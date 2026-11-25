/**
 * Synthesizes a clean 12-second (6-bar, 120 BPM) stereo electronic groove
 * completely in browser memory so users can test real-time 60fps beat visuals
 * and full MP4 video export immediately with zero external network files.
 */
export function createSampleBeatBuffer(ctx: BaseAudioContext): AudioBuffer {
  const sampleRate = 44100;
  const bpm = 120;
  const beatsPerSecond = bpm / 60; // 2 beats/sec -> 0.5s per beat
  const durationSeconds = 8; // 16 beats (4 full bars) — punchy & fast to test MP4 export
  const totalSamples = sampleRate * durationSeconds;
  const buffer = ctx.createBuffer(2, totalSamples, sampleRate);

  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  // Minor pentatonic / indigo synth frequencies (A minor / Fmaj7 / Dm9 / E7sus4)
  const chordRoots = [110.0, 87.31, 73.42, 82.41]; // A2, F2, D2, E2
  const arpNotes = [
    [440.0, 523.25, 659.25, 783.99],
    [349.23, 440.0, 523.25, 659.25],
    [293.66, 440.0, 523.25, 659.25],
    [329.63, 493.88, 587.33, 659.25],
  ];

  // Deterministic PRNG for crisp snare/hi-hat noise
  let seed = 0x5e4fa2;
  const nextNoise = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return (seed / 0xffffffff) * 2 - 1;
  };

  let kickPhase = 0;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const beatFloat = t * beatsPerSecond;
    const beatIndex = Math.floor(beatFloat);
    const beatFrac = beatFloat - beatIndex; // 0..1 within current quarter-note beat
    const beatTime = beatFrac / beatsPerSecond; // 0..0.5s
    const barIndex = Math.floor(beatIndex / 4) % 4;

    // 1. Punchy 808 / club kick on every beat
    const kickFreq = 46 + 115 * Math.exp(-beatTime * 34);
    kickPhase += (2 * Math.PI * kickFreq) / sampleRate;
    const kickEnv = Math.exp(-beatTime * 8.5) * (beatTime < 0.004 ? beatTime / 0.004 : 1);
    const kick = Math.sin(kickPhase) * kickEnv * 0.68;

    // 2. Snare / clap on beats 2 & 4 (beatIndex % 2 === 1)
    let snare = 0;
    if (beatIndex % 2 === 1 && beatTime < 0.22) {
      const snareEnv = Math.exp(-beatTime * 22);
      const body = Math.sin(2 * Math.PI * 185 * beatTime) * Math.exp(-beatTime * 32) * 0.4;
      snare = (nextNoise() * 0.55 + body) * snareEnv * 0.36;
    }

    // 3. Crisp 16th-note hi-hats
    const sixteenthFloat = beatFloat * 4;
    const sixteenthIdx = Math.floor(sixteenthFloat);
    const sixteenthTime = (sixteenthFloat - sixteenthIdx) / (beatsPerSecond * 4);
    const isOffbeatHat = sixteenthIdx % 4 === 2;
    const hatDecay = isOffbeatHat ? 28 : 55;
    const hatEnv = Math.exp(-sixteenthTime * hatDecay);
    const hat = nextNoise() * hatEnv * (isOffbeatHat ? 0.16 : 0.08);

    // 4. Warm sub-bass & mid synth pad
    const rootFreq = chordRoots[barIndex];
    const sidechain = 0.28 + 0.72 * (1 - Math.exp(-beatTime * 9));
    const bass =
      (Math.sin(2 * Math.PI * rootFreq * t) * 0.24 +
        Math.sin(2 * Math.PI * rootFreq * 2 * t) * 0.1) *
      sidechain;

    // 5. Stereo eighth-note melodic synth plucks (mid & treble movement)
    const eighthFloat = beatFloat * 2;
    const eighthIdx = Math.floor(eighthFloat);
    const eighthTime = (eighthFloat - eighthIdx) / (beatsPerSecond * 2);
    const noteFreq = arpNotes[barIndex][eighthIdx % 4];
    const arpEnv = Math.exp(-eighthTime * 9.5) * Math.min(1, eighthTime / 0.005);
    const arpL =
      (Math.sin(2 * Math.PI * noteFreq * t) +
        0.35 * Math.sin(2 * Math.PI * noteFreq * 2.003 * t)) *
      arpEnv *
      0.17;
    const arpR =
      (Math.sin(2 * Math.PI * noteFreq * 1.002 * t + 0.4) +
        0.35 * Math.sin(2 * Math.PI * noteFreq * 2.0 * t)) *
      arpEnv *
      0.17;

    // Smooth fade-in and fade-out at loop boundaries
    const masterFade =
      t < 0.03 ? t / 0.03 : t > durationSeconds - 0.08 ? (durationSeconds - t) / 0.08 : 1;

    const sampleL = Math.max(-0.96, Math.min(0.96, (kick + snare + hat * 0.9 + bass + arpL) * masterFade));
    const sampleR = Math.max(-0.96, Math.min(0.96, (kick + snare + hat * 1.1 + bass + arpR) * masterFade));

    left[i] = sampleL;
    right[i] = sampleR;
  }

  return buffer;
}

/**
 * Encodes an AudioBuffer to a 16-bit PCM WAV Blob so the native <audio> element
 * can scrub, pause, loop, and play cleanly alongside Web Audio AnalyserNode.
 */
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = Math.min(2, buffer.numberOfChannels);
  const sampleRate = buffer.sampleRate;
  const length = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = length * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // Linear PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // 16-bit
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  const channels: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channels.push(buffer.getChannelData(ch));
  }

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const clamped = Math.max(-1, Math.min(1, channels[ch][i]));
      const int16 = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}
