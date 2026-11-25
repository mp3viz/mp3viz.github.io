import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { StudioStrings } from '../i18n/translations';
import {
  BIN_COUNT,
  FFT_SIZE,
  createBeatState,
  stepBeatDetector,
} from '../lib/fftEngine';
import { audioBufferToWavBlob, createSampleBeatBuffer } from '../lib/sampleBeat';
import { exportVisualizerVideo } from '../lib/videoExporter';
import {
  ASPECT_RESOLUTIONS,
  type AspectRatioPreset,
  STUDIO_SWATCHES,
  type VisualizerStyle,
  renderVisualizerFrame,
} from '../lib/visualizerRenderer';

interface AudioVisualizerIslandProps {
  strings: StudioStrings;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function stripExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
}

export default function AudioVisualizerIsland({ strings }: AudioVisualizerIslandProps) {
  const uid = useId();

  // Audio & Track State
  const [hasTrack, setHasTrack] = useState(false);
  const [trackFileName, setTrackFileName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Visualizer Controls
  const [style, setStyle] = useState<VisualizerStyle>('bars');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>('16:9');
  const [sensitivity, setSensitivity] = useState(1.1);
  const [accentColor, setAccentColor] = useState('#8B7CE0');
  const [bgColor, setBgColor] = useState('#111019');
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [coverFileName, setCoverFileName] = useState('');

  // Export & Polite Live Region State
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [liveAnnouncement, setLiveAnnouncement] = useState(strings.statusIdle);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // Mutable Engine Refs (zero re-render overhead in 60fps Canvas loop)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const decodedBufferRef = useRef<AudioBuffer | null>(null);
  const coverImgRef = useRef<HTMLImageElement | null>(null);

  const audioUrlRef = useRef<string | null>(null);
  const coverUrlRef = useRef<string | null>(null);
  const rafRef = useRef<number>(0);
  const exportAbortRef = useRef<AbortController | null>(null);
  const lastAnnouncedBucketRef = useRef<number>(-1);

  // Keep latest render parameters accessible inside 60fps RAF loop
  const renderParamsRef = useRef({
    style,
    aspectRatio,
    sensitivity,
    accentColor,
    bgColor,
    songTitle,
    artistName,
    hasTrack,
    isPlaying,
  });

  useEffect(() => {
    renderParamsRef.current = {
      style,
      aspectRatio,
      sensitivity,
      accentColor,
      bgColor,
      songTitle,
      artistName,
      hasTrack,
      isPlaying,
    };
  }, [style, aspectRatio, sensitivity, accentColor, bgColor, songTitle, artistName, hasTrack, isPlaying]);

  const ensureAudioGraph = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.minDecibels = -95;
      analyser.maxDecibels = -18;
      analyser.smoothingTimeConstant = 0.68;
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    }

    if (audioElRef.current && !mediaSourceRef.current && audioCtxRef.current && analyserRef.current) {
      const src = audioCtxRef.current.createMediaElementSource(audioElRef.current);
      src.connect(analyserRef.current);
      mediaSourceRef.current = src;
    }

    return audioCtxRef.current;
  }, []);

  // Main 60fps Hardware-Accelerated Preview Loop
  useEffect(() => {
    const freqData = new Uint8Array(BIN_COUNT);
    const waveData = new Uint8Array(FFT_SIZE);
    const beatState = createBeatState();
    let beatPhase = 0;
    let lastTimestamp = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTimestamp) / 1000));
      lastTimestamp = now;
      const timeSec = now / 1000;
      const params = renderParamsRef.current;
      const canvas = canvasRef.current;

      if (canvas) {
        const { width, height } = ASPECT_RESOLUTIONS[params.aspectRatio];
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        const ctx = canvas.getContext('2d', { alpha: false });
        if (ctx) {
          let beatPulse = 0;
          const analyser = analyserRef.current;

          if (params.hasTrack && params.isPlaying && analyser && audioCtxRef.current) {
            analyser.getByteFrequencyData(freqData);
            analyser.getByteTimeDomainData(waveData);
            beatPulse = stepBeatDetector(
              freqData,
              audioCtxRef.current.sampleRate,
              params.sensitivity,
              dt,
              beatState
            );
          } else {
            // Subtle calm ambient studio breathe when idle or paused
            for (let i = 0; i < BIN_COUNT; i++) {
              const wave = Math.sin(timeSec * 2.1 + i * 0.09) * 0.5 + 0.5;
              const env = Math.exp(-i / 180);
              freqData[i] = Math.round(wave * env * (params.hasTrack ? 36 : 64));
            }
            for (let i = 0; i < FFT_SIZE; i++) {
              waveData[i] = Math.round(128 + Math.sin(timeSec * 2.6 + i * 0.025) * 14);
            }
            beatPulse = (Math.sin(timeSec * 2.4) * 0.5 + 0.5) * 0.14;
          }

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
            style: params.style,
            accentColor: params.accentColor,
            bgColor: params.bgColor,
            coverImage: coverImgRef.current,
            songTitle: params.songTitle,
            artistName: params.artistName,
          });
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (exportAbortRef.current) {
        exportAbortRef.current.abort();
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
      if (coverUrlRef.current) {
        URL.revokeObjectURL(coverUrlRef.current);
        coverUrlRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, []);

  const attachAudioBlobAndPlay = useCallback(
    async (blobUrl: string, decoded: AudioBuffer, displayTitle: string, announcement: string) => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      audioUrlRef.current = blobUrl;
      decodedBufferRef.current = decoded;

      const audio = audioElRef.current;
      if (!audio) return;

      audio.src = blobUrl;
      audio.currentTime = 0;
      setDuration(decoded.duration);
      setCurrentTime(0);
      setTrackFileName(displayTitle);
      setHasTrack(true);
      setBannerNotice(null);
      setLiveAnnouncement(announcement);

      const ctx = ensureAudioGraph();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    },
    [ensureAudioGraph]
  );

  const handleAudioFile = useCallback(
    async (file: File) => {
      try {
        setBannerNotice(null);
        const ctx = ensureAudioGraph();
        const arrayBuf = await file.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuf.slice(0));
        const objectUrl = URL.createObjectURL(file);
        const cleanTitle = stripExtension(file.name);

        if (!songTitle) {
          setSongTitle(cleanTitle);
        }

        await attachAudioBlobAndPlay(
          objectUrl,
          decoded,
          file.name,
          `${strings.statusAudioLoaded} ${file.name}`
        );
      } catch {
        const msg = 'Unsupported or corrupted audio file. Please select an MP3, WAV, OGG, FLAC, or M4A track.';
        setBannerNotice(msg);
        setLiveAnnouncement(msg);
      }
    },
    [attachAudioBlobAndPlay, ensureAudioGraph, songTitle, strings.statusAudioLoaded]
  );

  const handleTrySampleBeat = useCallback(async () => {
    const ctx = ensureAudioGraph();
    const sampleBuffer = createSampleBeatBuffer(ctx);
    const wavBlob = audioBufferToWavBlob(sampleBuffer);
    const objectUrl = URL.createObjectURL(wavBlob);

    if (!songTitle) setSongTitle(strings.sampleTrackTitle);
    if (!artistName) setArtistName(strings.sampleTrackArtist);

    await attachAudioBlobAndPlay(
      objectUrl,
      sampleBuffer,
      `${strings.sampleTrackTitle}.wav`,
      strings.statusSampleLoaded
    );
  }, [
    artistName,
    attachAudioBlobAndPlay,
    ensureAudioGraph,
    songTitle,
    strings.sampleTrackArtist,
    strings.sampleTrackTitle,
    strings.statusSampleLoaded,
  ]);

  const togglePlayPause = useCallback(async () => {
    const audio = audioElRef.current;
    if (!audio || !hasTrack) return;

    const ctx = ensureAudioGraph();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (audio.paused) {
      await audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [ensureAudioGraph, hasTrack]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = parseFloat(e.target.value);
    setCurrentTime(nextTime);
    if (audioElRef.current) {
      audioElRef.current.currentTime = nextTime;
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (coverUrlRef.current) {
      URL.revokeObjectURL(coverUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    coverUrlRef.current = url;
    const img = new Image();
    img.onload = () => {
      coverImgRef.current = img;
      setCoverFileName(file.name);
    };
    img.src = url;
  };

  const clearCoverImage = () => {
    if (coverUrlRef.current) {
      URL.revokeObjectURL(coverUrlRef.current);
      coverUrlRef.current = null;
    }
    coverImgRef.current = null;
    setCoverFileName('');
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };

  const handleExportVideo = async () => {
    if (!decodedBufferRef.current || isExporting) return;

    // Pause live preview audio cleanly while rendering export
    if (audioElRef.current && !audioElRef.current.paused) {
      audioElRef.current.pause();
      setIsPlaying(false);
    }

    const abortController = new AbortController();
    exportAbortRef.current = abortController;
    lastAnnouncedBucketRef.current = -1;

    setIsExporting(true);
    setExportProgress(0);
    setBannerNotice(null);
    setLiveAnnouncement(strings.statusExportStart);

    try {
      const result = await exportVisualizerVideo({
        audioBuffer: decodedBufferRef.current,
        aspectRatio,
        style,
        sensitivity,
        accentColor,
        bgColor,
        coverImage: coverImgRef.current,
        songTitle,
        artistName,
        signal: abortController.signal,
        onProgress: (pct) => {
          setExportProgress(pct);
          const bucket = Math.floor(pct / 20) * 20;
          if (bucket > lastAnnouncedBucketRef.current && bucket > 0) {
            lastAnnouncedBucketRef.current = bucket;
            setLiveAnnouncement(`${strings.statusExportProgress} ${bucket}%`);
          }
        },
      });

      const downloadUrl = URL.createObjectURL(result.blob);
      const safeBase =
        (songTitle || stripExtension(trackFileName) || 'mp3viz-video')
          .toLowerCase()
          .replace(/[^a-z0-9-_]+/g, '-')
          .replace(/^-+|-+$/g, '') || 'mp3viz-video';

      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = `${safeBase}-${aspectRatio.replace(':', 'x')}.${result.extension}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      setTimeout(() => URL.revokeObjectURL(downloadUrl), 15_000);
      setLiveAnnouncement(strings.statusExportComplete);
      setBannerNotice(strings.statusExportComplete);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setLiveAnnouncement(strings.statusExportCancelled);
      } else {
        const message = err instanceof Error ? err.message : 'Unknown encoder error';
        setLiveAnnouncement(`${strings.statusExportError} ${message}`);
        setBannerNotice(`${strings.statusExportError} ${message}`);
      }
    } finally {
      setIsExporting(false);
      exportAbortRef.current = null;
    }
  };

  const cancelExport = () => {
    exportAbortRef.current?.abort();
  };

  const onDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleAudioFile(file);
    }
  };

  const stageAspectClass =
    aspectRatio === '16:9'
      ? 'aspect-video h-full max-w-full'
      : aspectRatio === '9:16'
        ? 'aspect-[9/16] h-full max-w-full'
        : 'aspect-square h-full max-w-full';

  const styleItems: Array<{ id: VisualizerStyle; label: string }> = [
    { id: 'bars', label: strings.styles.bars },
    { id: 'radial', label: strings.styles.radial },
    { id: 'wave', label: strings.styles.wave },
    { id: 'particles', label: strings.styles.particles },
  ];

  const aspectItems: Array<{ id: AspectRatioPreset; label: string }> = [
    { id: '16:9', label: strings.aspects.landscape },
    { id: '9:16', label: strings.aspects.portrait },
    { id: '1:1', label: strings.aspects.square },
  ];

  return (
    <div className="w-full rounded-3xl border border-line bg-card p-4 sm:p-6 lg:p-7 shadow-studio dark:shadow-studio-dark studio-transition">
      {/* Polite Screen-Reader Live Region */}
      <div role="status" aria-live="polite" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Hidden Native Audio & File Inputs */}
      <audio
        ref={audioElRef}
        preload="metadata"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          if (Number.isFinite(e.currentTarget.duration)) {
            setDuration(e.currentTarget.duration);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <input
        ref={audioInputRef}
        type="file"
        accept=".mp3,.wav,.ogg,.flac,.m4a,audio/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleAudioFile(f);
          e.target.value = '';
        }}
      />

      <input
        ref={coverInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleCoverUpload}
      />

      {/* Fixed-Height Preview Stage Container (Zero CLS across 16:9 / 9:16 / 1:1) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!isDraggingOver) setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={onDropFile}
        className={`relative flex h-[290px] sm:h-[380px] lg:h-[420px] w-full items-center justify-center overflow-hidden rounded-2xl border-2 bg-[#0D0C14] p-2 sm:p-3 studio-transition ${
          isDraggingOver ? 'border-accent ring-4 ring-accent/25' : 'border-line'
        }`}
      >
        {/* Hardware-Accelerated Beat-Reactive Canvas */}
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl shadow-2xl studio-transition ${stageAspectClass}`}>
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            aria-label="Beat-reactive audio spectrum video preview canvas"
            className="h-full w-full object-contain rounded-xl"
          />
        </div>

        {/* Top Studio Status Pills */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-[#F8F7F4] backdrop-blur-md border border-white/15">
            <span
              className={`h-2 w-2 rounded-full ${
                isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-[#C3BEDA]'
              }`}
            />
            {strings.privacyBadge}
          </span>

          {hasTrack && (
            <button
              type="button"
              onClick={() => audioInputRef.current?.click()}
              aria-label={strings.changeAudioBtn}
              className="pointer-events-auto inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-black/75 px-3.5 py-1.5 text-xs font-semibold text-[#F8F7F4] hover:bg-black border border-white/20 studio-transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>{strings.changeAudioBtn}</span>
            </button>
          )}
        </div>

        {/* Prominent Keyboard-Accessible Audio Dropzone Overlay (When No Track Loaded) */}
        {!hasTrack && (
          <div
            role="region"
            aria-label={strings.dropHeadline}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 p-4 text-center backdrop-blur-[2px]"
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={`${strings.dropHeadline}. ${strings.selectAudioBtn}`}
              onClick={() => audioInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  audioInputRef.current?.click();
                }
              }}
              className="group max-w-lg cursor-pointer rounded-2xl border border-white/20 bg-[#181622]/90 px-5 py-6 sm:px-8 sm:py-7 shadow-2xl hover:border-[#C3BEDA]/60 studio-transition"
            >
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5E4FA2] text-white shadow-lg group-hover:scale-105 studio-transition">
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <p className="text-lg sm:text-xl font-bold text-[#F8F7F4]">
                {strings.dropHeadline}
              </p>
              <p className="mt-1.5 text-xs sm:text-sm text-[#CBC6DF]">
                {strings.dropSubtext}
              </p>

              <div
                className="mt-5 flex flex-wrap items-center justify-center gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  aria-label={strings.selectAudioBtn}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#8B7CE0] px-5 py-2.5 text-sm font-bold text-[#111019] hover:bg-[#A396EC] shadow-md studio-transition"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>{strings.selectAudioBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleTrySampleBeat()}
                  aria-label={strings.trySampleBtn}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-[#F8F7F4] hover:bg-white/20 studio-transition"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5.14v14l11-7-11-7z" />
                  </svg>
                  <span>{strings.trySampleBtn}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transport Timeline + Primary Download Video (MP4) Bar */}
      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-line bg-page p-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-1 items-center gap-3">
          <button
            type="button"
            onClick={() => void togglePlayPause()}
            disabled={!hasTrack || isExporting}
            aria-label={isPlaying ? strings.pauseLabel : strings.playLabel}
            className="inline-flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-xl bg-accent text-accent-fg hover:bg-accent-hover disabled:opacity-45 disabled:cursor-not-allowed shadow-sm studio-transition"
          >
            {isPlaying ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg className="h-5 w-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            )}
          </button>

          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
              <span className="truncate max-w-[180px] sm:max-w-[260px] text-ink">
                {hasTrack ? trackFileName : '—'}
              </span>
              <span className="tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={duration > 0 ? duration : 1}
              step={0.05}
              value={Math.min(currentTime, duration || 1)}
              disabled={!hasTrack || isExporting}
              onChange={handleSeek}
              aria-label={strings.seekLabel}
              className="studio-slider w-full disabled:opacity-45"
            />
          </div>
        </div>

        {/* One-Click MP4 Video Export Control */}
        <div className="flex items-center gap-2">
          {!isExporting ? (
            <button
              type="button"
              onClick={() => void handleExportVideo()}
              disabled={!hasTrack}
              aria-label={strings.exportMp4Btn}
              className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-fg hover:bg-accent-hover disabled:opacity-45 disabled:cursor-not-allowed shadow-sm studio-transition whitespace-nowrap"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{strings.exportMp4Btn}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={cancelExport}
              aria-label={strings.cancelExportBtn}
              className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-line bg-subtle px-4 py-2.5 text-sm font-bold text-ink hover:border-accent studio-transition whitespace-nowrap"
            >
              <span>{strings.cancelExportBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Export Progress Bar */}
      {isExporting && (
        <div className="mt-3 rounded-2xl border border-line bg-subtle p-3.5">
          <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-ink">
            <span>{strings.exportingLabel}...</span>
            <span className="tabular-nums">{exportProgress}%</span>
          </div>
          <div
            role="progressbar"
            aria-label={strings.exportingLabel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={exportProgress}
            className="h-3 w-full overflow-hidden rounded-full bg-page border border-line"
          >
            <div
              className="h-full rounded-full bg-accent studio-transition"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>
      )}

      {bannerNotice && !isExporting && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-line bg-subtle px-4 py-2.5 text-xs sm:text-sm font-medium text-ink">
          <span>{bannerNotice}</span>
          <button
            type="button"
            onClick={() => setBannerNotice(null)}
            aria-label="Dismiss notification"
            className="rounded-lg px-2 py-1 text-xs font-bold text-ink-muted hover:text-ink"
          >
            ✕
          </button>
        </div>
      )}

      {/* Studio Control Grid: Styles, Aspect Ratios, Sensitivity & Visual Customization */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Column: 4 Beat-Reactive Styles + Aspect Ratio + Sensitivity */}
        <div className="space-y-4 rounded-2xl border border-line bg-page p-4 lg:col-span-7">
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2.5">
              {strings.styleSectionLabel}
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {styleItems.map((item) => {
                const active = style === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`${strings.styleSectionLabel}: ${item.label}`}
                    aria-pressed={active}
                    onClick={() => setStyle(item.id)}
                    className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl border px-2.5 py-2 text-xs font-semibold text-center studio-transition ${
                      active
                        ? 'border-accent bg-accent text-accent-fg shadow-sm'
                        : 'border-line bg-card text-ink hover:bg-subtle'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-end">
            <div className="sm:col-span-7">
              <span className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                {strings.aspectSectionLabel}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {aspectItems.map((ar) => {
                  const active = aspectRatio === ar.id;
                  return (
                    <button
                      key={ar.id}
                      type="button"
                      aria-label={`${strings.aspectSectionLabel}: ${ar.label}`}
                      aria-pressed={active}
                      onClick={() => setAspectRatio(ar.id)}
                      className={`inline-flex min-h-[48px] items-center justify-center rounded-xl border px-2 py-2 text-xs font-semibold text-center studio-transition ${
                        active
                          ? 'border-accent bg-accent text-accent-fg shadow-sm'
                          : 'border-line bg-card text-ink hover:bg-subtle'
                      }`}
                    >
                      {ar.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-5">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor={`${uid}-sensitivity`}
                  className="text-xs font-bold uppercase tracking-wider text-ink-muted"
                >
                  {strings.sensitivityLabel}
                </label>
                <span className="rounded-md bg-subtle px-2 py-0.5 text-xs font-bold tabular-nums text-ink">
                  {sensitivity.toFixed(1)}×
                </span>
              </div>
              <div className="flex min-h-[48px] items-center rounded-xl border border-line bg-card px-3">
                <input
                  id={`${uid}-sensitivity`}
                  type="range"
                  min={0.4}
                  max={2.2}
                  step={0.1}
                  value={sensitivity}
                  onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                  className="studio-slider w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Color Swatches, Cover Art & Song Title Overlay */}
        <div className="space-y-3.5 rounded-2xl border border-line bg-page p-4 lg:col-span-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              {strings.themeSwatchesLabel}
            </span>
            <div className="flex items-center gap-1.5">
              {STUDIO_SWATCHES.map((swatch) => {
                const selected =
                  accentColor.toLowerCase() === swatch.accent.toLowerCase() &&
                  bgColor.toLowerCase() === swatch.background.toLowerCase();
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    aria-label={`${strings.themeSwatchesLabel}: ${swatch.name}`}
                    aria-pressed={selected}
                    onClick={() => {
                      setAccentColor(swatch.accent);
                      setBgColor(swatch.background);
                    }}
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 studio-transition ${
                      selected ? 'border-ink scale-110' : 'border-line hover:scale-105'
                    }`}
                    style={{ backgroundColor: swatch.background }}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: swatch.accent }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Pickers + Cover Image Uploader */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <label
              htmlFor={`${uid}-accent-color`}
              className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-line bg-card px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-subtle studio-transition"
            >
              <input
                id={`${uid}-accent-color`}
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
              />
              <span className="truncate">{strings.accentColorLabel}</span>
            </label>

            <label
              htmlFor={`${uid}-bg-color`}
              className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-line bg-card px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-subtle studio-transition"
            >
              <input
                id={`${uid}-bg-color`}
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
              />
              <span className="truncate">{strings.bgColorLabel}</span>
            </label>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                aria-label={`${strings.coverArtLabel}: ${strings.uploadCoverBtn}`}
                className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-card px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-subtle studio-transition truncate"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="truncate">
                  {coverFileName ? coverFileName : strings.uploadCoverBtn}
                </span>
              </button>
              {coverFileName && (
                <button
                  type="button"
                  onClick={clearCoverImage}
                  aria-label={strings.clearCoverBtn}
                  className="inline-flex min-h-[44px] min-w-[36px] items-center justify-center rounded-xl border border-line bg-subtle px-2 text-xs font-bold text-ink hover:border-accent"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Optional Song Title & Artist Text Overlay Inputs */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`${uid}-song-title`}
                className="mb-1 block text-xs font-semibold text-ink-muted"
              >
                {strings.songTitleLabel}
              </label>
              <input
                id={`${uid}-song-title`}
                type="text"
                maxLength={64}
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                placeholder={strings.songTitlePlaceholder}
                className="w-full min-h-[42px] rounded-xl border border-line bg-card px-3 py-1.5 text-xs sm:text-sm text-ink placeholder:text-ink-muted/60"
              />
            </div>

            <div>
              <label
                htmlFor={`${uid}-artist-name`}
                className="mb-1 block text-xs font-semibold text-ink-muted"
              >
                {strings.artistNameLabel}
              </label>
              <input
                id={`${uid}-artist-name`}
                type="text"
                maxLength={64}
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder={strings.artistNamePlaceholder}
                className="w-full min-h-[42px] rounded-xl border border-line bg-card px-3 py-1.5 text-xs sm:text-sm text-ink placeholder:text-ink-muted/60"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
