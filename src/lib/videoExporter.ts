import { ArrayBufferTarget, Muxer } from 'mp4-muxer';
import {
  BIN_COUNT,
  FFT_SIZE,
  OfflineAudioAnalyzer,
  createBeatState,
  stepBeatDetector,
} from './fftEngine';
import {
  ASPECT_RESOLUTIONS,
  type AspectRatioPreset,
  type VisualizerStyle,
  renderVisualizerFrame,
} from './visualizerRenderer';

export interface ExportVideoOptions {
  audioBuffer: AudioBuffer;
  aspectRatio: AspectRatioPreset;
  style: VisualizerStyle;
  sensitivity: number;
  accentColor: string;
  bgColor: string;
  coverImage: HTMLImageElement | null;
  songTitle: string;
  artistName: string;
  signal: AbortSignal;
  onProgress: (percent: number) => void;
}

export interface ExportVideoResult {
  blob: Blob;
  extension: 'mp4' | 'webm';
}

interface SelectedCodecs {
  videoConfig: VideoEncoderConfig;
  fps: number;
  audioMuxCodec: 'aac' | 'opus';
  audioEncoderCodec: string;
  targetSampleRate: number;
}

async function resampleBuffer(source: AudioBuffer, targetRate: number): Promise<AudioBuffer> {
  if (source.sampleRate === targetRate) return source;
  const targetLength = Math.ceil(source.duration * targetRate);
  const offline = new OfflineAudioContext(
    Math.min(2, source.numberOfChannels),
    targetLength,
    targetRate
  );
  const bufferSource = offline.createBufferSource();
  bufferSource.buffer = source;
  bufferSource.connect(offline.destination);
  bufferSource.start(0);
  return offline.startRendering();
}

/**
 * Waits until a WebCodecs VideoEncoder / AudioEncoder drains below `maxQueue`
 * so hardware encoders never overflow their surface pool or drop frames.
 */
async function waitForQueueCapacity(
  encoder: VideoEncoder | AudioEncoder,
  maxQueue: number
): Promise<void> {
  while (encoder.state === 'configured' && encoder.encodeQueueSize >= maxQueue) {
    await new Promise<void>((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        encoder.removeEventListener('dequeue', done);
        resolve();
      };
      encoder.addEventListener('dequeue', done, { once: true });
      setTimeout(done, 12);
    });
  }
}

async function probeWebCodecsSupport(
  width: number,
  height: number,
  audioBuffer: AudioBuffer
): Promise<SelectedCodecs | null> {
  if (
    typeof window === 'undefined' ||
    typeof VideoEncoder === 'undefined' ||
    typeof AudioEncoder === 'undefined' ||
    typeof VideoFrame === 'undefined' ||
    typeof AudioData === 'undefined'
  ) {
    return null;
  }

  // IMPORTANT: Prioritize Constrained Baseline / Baseline profiles ('42e0' / '4200')!
  // Baseline profiles strictly forbid B-frames (PTS === DTS monotonically), preventing
  // out-of-order B-frame presentation timestamp jitter/stuttering in MP4 players.
  // Level 4.2 ('2a') supports full 60fps HD across 1280x720, 720x1280, and 1080x1080.
  const candidateConfigs: Array<{ codec: string; fps: number; bitrate: number }> = [
    { codec: 'avc1.42e02a', fps: 60, bitrate: 8_000_000 },
    { codec: 'avc1.42002a', fps: 60, bitrate: 8_000_000 },
    { codec: 'avc1.4d002a', fps: 60, bitrate: 8_000_000 },
    { codec: 'avc1.64002a', fps: 60, bitrate: 8_000_000 },
    { codec: 'avc1.42e028', fps: 30, bitrate: 5_500_000 },
    { codec: 'avc1.420028', fps: 30, bitrate: 5_500_000 },
    { codec: 'avc1.42001f', fps: 30, bitrate: 5_000_000 },
  ];

  let chosenVideo: { config: VideoEncoderConfig; fps: number } | null = null;

  for (const item of candidateConfigs) {
    const cfg: VideoEncoderConfig = {
      codec: item.codec,
      width,
      height,
      bitrate: item.bitrate,
      framerate: item.fps,
      latencyMode: 'quality', // Forbids realtime encoder frame dropping
      avc: { format: 'avc' },
    };
    try {
      const check = await VideoEncoder.isConfigSupported(cfg);
      if (check.supported && check.config) {
        chosenVideo = { config: check.config, fps: item.fps };
        break;
      }
    } catch {
      // Try without optional latencyMode/avc fields if older implementation
      try {
        const basicCfg: VideoEncoderConfig = {
          codec: item.codec,
          width,
          height,
          bitrate: item.bitrate,
          framerate: item.fps,
        };
        const check = await VideoEncoder.isConfigSupported(basicCfg);
        if (check.supported) {
          chosenVideo = { config: basicCfg, fps: item.fps };
          break;
        }
      } catch {
        // continue
      }
    }
  }

  if (!chosenVideo) {
    return null;
  }

  const channels = Math.min(2, audioBuffer.numberOfChannels);

  // Test standard AAC sample rates (native first, then 48kHz / 44.1kHz) so Windows Media
  // Player, QuickTime, iOS, and social platforms get universal H.264 + AAC MP4 files.
  const aacRates = Array.from(new Set([audioBuffer.sampleRate, 48000, 44100]));
  for (const rate of aacRates) {
    try {
      const aacCheck = await AudioEncoder.isConfigSupported({
        codec: 'mp4a.40.2',
        sampleRate: rate,
        numberOfChannels: channels,
        bitrate: 160_000,
      });
      if (aacCheck.supported) {
        return {
          videoConfig: chosenVideo.config,
          fps: chosenVideo.fps,
          audioMuxCodec: 'aac',
          audioEncoderCodec: 'mp4a.40.2',
          targetSampleRate: rate,
        };
      }
    } catch {
      // try next sample rate
    }
  }

  // Fallback to Opus inside MP4 on open-source Chromium builds without AAC encoder
  try {
    const opusCheck = await AudioEncoder.isConfigSupported({
      codec: 'opus',
      sampleRate: 48000,
      numberOfChannels: channels,
      bitrate: 160_000,
    });
    if (opusCheck.supported) {
      return {
        videoConfig: chosenVideo.config,
        fps: chosenVideo.fps,
        audioMuxCodec: 'opus',
        audioEncoderCodec: 'opus',
        targetSampleRate: 48000,
      };
    }
  } catch {
    // fallback to MediaRecorder
  }

  return null;
}

export async function exportVisualizerVideo(
  options: ExportVideoOptions
): Promise<ExportVideoResult> {
  const { width, height } = ASPECT_RESOLUTIONS[options.aspectRatio];
  const codecs = await probeWebCodecsSupport(width, height, options.audioBuffer);

  if (codecs) {
    return exportViaWebCodecs(options, width, height, codecs);
  }
  return exportViaMediaRecorder(options, width, height);
}

async function exportViaWebCodecs(
  options: ExportVideoOptions,
  width: number,
  height: number,
  codecs: SelectedCodecs
): Promise<ExportVideoResult> {
  const {
    audioBuffer,
    style,
    sensitivity,
    accentColor,
    bgColor,
    coverImage,
    songTitle,
    artistName,
    signal,
    onProgress,
  } = options;

  const encodeAudioBuffer = await resampleBuffer(audioBuffer, codecs.targetSampleRate);
  const numberOfChannels = Math.min(2, encodeAudioBuffer.numberOfChannels);
  const sampleRate = encodeAudioBuffer.sampleRate;
  const fps = codecs.fps;
  const durationSec = Math.max(0.1, audioBuffer.duration);
  const totalFrames = Math.max(1, Math.round(durationSec * fps));

  const target = new ArrayBufferTarget();
  const muxer = new Muxer({
    target,
    video: {
      codec: 'avc',
      width,
      height,
      frameRate: fps,
    },
    audio: {
      codec: codecs.audioMuxCodec,
      numberOfChannels,
      sampleRate,
    },
    fastStart: 'in-memory',
    firstTimestampBehavior: 'offset',
  });

  let encoderError: Error | null = null;
  let emittedVideoIndex = 0;

  const videoEncoder = new VideoEncoder({
    output: (chunk, meta) => {
      // Compute monotonic decode timestamp in case a Main/High fallback encoder uses B-frames
      const dtsUs = Math.round((emittedVideoIndex * 1_000_000) / fps);
      emittedVideoIndex++;
      const ptsUs = Math.max(0, chunk.timestamp);
      const ctoUs = ptsUs - dtsUs;
      muxer.addVideoChunk(chunk, meta, ptsUs, ctoUs);
    },
    error: (err) => {
      encoderError = err instanceof Error ? err : new Error(String(err));
    },
  });

  videoEncoder.configure(codecs.videoConfig);

  const audioEncoder = new AudioEncoder({
    output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
    error: (err) => {
      encoderError = err instanceof Error ? err : new Error(String(err));
    },
  });

  audioEncoder.configure({
    codec: codecs.audioEncoderCodec,
    sampleRate,
    numberOfChannels,
    bitrate: 160_000,
  });

  try {
    // 1. Render & Encode Every Single 60fps Video Frame with Strict Backpressure (Zero Drops)
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      throw new Error('Could not initialize 2D rendering context for video export.');
    }

    const analyzer = new OfflineAudioAnalyzer(audioBuffer);
    const freqData = new Uint8Array(BIN_COUNT);
    const waveData = new Uint8Array(FFT_SIZE);
    const beatState = createBeatState();
    let beatPhase = 0;
    const dt = 1 / fps;

    // Pre-extract planar audio channels so we can interleave audio encoding cleanly
    const audioChunkFrames = 1024;
    const totalAudioSamples = encodeAudioBuffer.length;
    const channelArrays: Float32Array[] = [];
    for (let ch = 0; ch < numberOfChannels; ch++) {
      channelArrays.push(encodeAudioBuffer.getChannelData(ch));
    }
    let audioSampleCursor = 0;

    for (let frameIdx = 0; frameIdx < totalFrames; frameIdx++) {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      if (encoderError) throw encoderError;

      // Keep VideoEncoder queue <= 3 frames so hardware D3D11/VideoToolbox encoders never drop frames
      await waitForQueueCapacity(videoEncoder, 3);

      const timestampUs = Math.round((frameIdx * 1_000_000) / fps);
      const nextTimestampUs = Math.round(((frameIdx + 1) * 1_000_000) / fps);
      const frameDurationUs = nextTimestampUs - timestampUs;
      const timeSec = frameIdx / fps;

      analyzer.sampleAt(timeSec, freqData, waveData, 0.68);
      const beatPulse = stepBeatDetector(
        freqData,
        audioBuffer.sampleRate,
        sensitivity,
        dt,
        beatState
      );
      beatPhase += dt * (0.42 + beatPulse * 1.85);

      renderVisualizerFrame({
        ctx,
        width,
        height,
        freqData,
        waveData,
        beatPulse,
        timeSec,
        beatPhase,
        style,
        accentColor,
        bgColor,
        coverImage,
        songTitle,
        artistName,
      });

      const videoFrame = new VideoFrame(canvas, {
        timestamp: timestampUs,
        duration: frameDurationUs,
      });

      // Keyframe every 1 second for crisp seeking and smooth decoder lock
      videoEncoder.encode(videoFrame, { keyFrame: frameIdx % fps === 0 });
      videoFrame.close();

      // Feed matching audio samples up to current video timestamp so memory stays tiny on long songs
      const targetAudioSample = Math.min(
        totalAudioSamples,
        Math.ceil(((frameIdx + 1) / fps) * sampleRate)
      );
      while (audioSampleCursor < targetAudioSample) {
        await waitForQueueCapacity(audioEncoder, 16);
        const count = Math.min(audioChunkFrames, totalAudioSamples - audioSampleCursor);
        const planar = new Float32Array(count * numberOfChannels);
        for (let ch = 0; ch < numberOfChannels; ch++) {
          planar.set(
            channelArrays[ch].subarray(audioSampleCursor, audioSampleCursor + count),
            ch * count
          );
        }
        const audioTsUs = Math.round((audioSampleCursor * 1_000_000) / sampleRate);
        const audioData = new AudioData({
          format: 'f32-planar',
          sampleRate,
          numberOfFrames: count,
          numberOfChannels,
          timestamp: audioTsUs,
          data: planar,
        });
        audioEncoder.encode(audioData);
        audioData.close();
        audioSampleCursor += count;
      }

      const pct = Math.min(97, Math.round(((frameIdx + 1) / totalFrames) * 96));
      onProgress(pct);

      // Yield periodically so progress UI stays responsive at 60fps
      if (frameIdx % 10 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    // Encode any remaining trailing audio samples
    while (audioSampleCursor < totalAudioSamples) {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      await waitForQueueCapacity(audioEncoder, 16);
      const count = Math.min(audioChunkFrames, totalAudioSamples - audioSampleCursor);
      const planar = new Float32Array(count * numberOfChannels);
      for (let ch = 0; ch < numberOfChannels; ch++) {
        planar.set(
          channelArrays[ch].subarray(audioSampleCursor, audioSampleCursor + count),
          ch * count
        );
      }
      const audioTsUs = Math.round((audioSampleCursor * 1_000_000) / sampleRate);
      const audioData = new AudioData({
        format: 'f32-planar',
        sampleRate,
        numberOfFrames: count,
        numberOfChannels,
        timestamp: audioTsUs,
        data: planar,
      });
      audioEncoder.encode(audioData);
      audioData.close();
      audioSampleCursor += count;
    }

    await Promise.all([videoEncoder.flush(), audioEncoder.flush()]);
    if (encoderError) throw encoderError;

    muxer.finalize();
    onProgress(100);

    return {
      blob: new Blob([target.buffer], { type: 'video/mp4' }),
      extension: 'mp4',
    };
  } finally {
    try {
      if (videoEncoder.state !== 'closed') videoEncoder.close();
    } catch {}
    try {
      if (audioEncoder.state !== 'closed') audioEncoder.close();
    } catch {}
  }
}

async function exportViaMediaRecorder(
  options: ExportVideoOptions,
  width: number,
  height: number
): Promise<ExportVideoResult> {
  const {
    audioBuffer,
    style,
    sensitivity,
    accentColor,
    bgColor,
    coverImage,
    songTitle,
    artistName,
    signal,
    onProgress,
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable.');
  }

  const audioCtx = new AudioContext();
  const dest = audioCtx.createMediaStreamDestination();
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = FFT_SIZE;
  analyser.smoothingTimeConstant = 0.78;

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(analyser);
  analyser.connect(dest);

  const canvasStream = canvas.captureStream(60);
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);

  const mimeCandidates = [
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];

  const chosenMime =
    mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';
  const extension: 'mp4' | 'webm' = chosenMime.startsWith('video/mp4') ? 'mp4' : 'webm';

  return new Promise<ExportVideoResult>((resolve, reject) => {
    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(combinedStream, {
      mimeType: chosenMime,
      videoBitsPerSecond: 6_500_000,
    });

    const freqData = new Uint8Array(analyser.frequencyBinCount);
    const waveData = new Uint8Array(FFT_SIZE);
    const beatState = createBeatState();
    let beatPhase = 0;
    let rafId = 0;
    let lastTime = performance.now();
    const startWall = lastTime;
    const totalSec = Math.max(0.1, audioBuffer.duration);

    const cleanup = () => {
      cancelAnimationFrame(rafId);
      combinedStream.getTracks().forEach((t) => t.stop());
      try {
        source.stop();
      } catch {}
      audioCtx.close().catch(() => {});
    };

    const onAbort = () => {
      if (recorder.state !== 'inactive') recorder.stop();
      cleanup();
      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal.addEventListener('abort', onAbort, { once: true });

    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) chunks.push(ev.data);
    };

    recorder.onerror = () => {
      signal.removeEventListener('abort', onAbort);
      cleanup();
      reject(new Error('MediaRecorder failed during video capture.'));
    };

    recorder.onstop = () => {
      signal.removeEventListener('abort', onAbort);
      cleanup();
      if (signal.aborted) return;
      onProgress(100);
      resolve({
        blob: new Blob(chunks, { type: chosenMime }),
        extension,
      });
    };

    const drawLoop = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      const elapsed = (now - startWall) / 1000;

      analyser.getByteFrequencyData(freqData);
      analyser.getByteTimeDomainData(waveData);

      const beatPulse = stepBeatDetector(
        freqData,
        audioBuffer.sampleRate,
        sensitivity,
        dt,
        beatState
      );
      beatPhase += dt * (0.42 + beatPulse * 1.85);

      renderVisualizerFrame({
        ctx,
        width,
        height,
        freqData,
        waveData,
        beatPulse,
        timeSec: elapsed,
        beatPhase,
        style,
        accentColor,
        bgColor,
        coverImage,
        songTitle,
        artistName,
      });

      const pct = Math.min(99, Math.round((elapsed / totalSec) * 100));
      onProgress(pct);

      if (elapsed < totalSec && recorder.state === 'recording') {
        rafId = requestAnimationFrame(drawLoop);
      }
    };

    source.onended = () => {
      if (recorder.state !== 'inactive') recorder.stop();
    };

    recorder.start(250);
    source.start(0);
    rafId = requestAnimationFrame(drawLoop);
  });
}
