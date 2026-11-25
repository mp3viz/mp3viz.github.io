/**
 * Real-time & offline 2048-point FFT spectrum + sub-bass beat detector.
 * Matches W3C Web Audio API AnalyserNode (Blackman window, 1/N normalization,
 * dB scaling, and framerate-compensated exponential smoothing) so 60fps
 * WebCodecs MP4 exports animate just as smoothly as the live preview.
 */

export const FFT_SIZE = 2048;
export const BIN_COUNT = FFT_SIZE >> 1; // 1024

export interface BeatAnalysisState {
  rollingBass: number;
  beatPulse: number;
}

export function createBeatState(): BeatAnalysisState {
  return {
    rollingBass: 0.16,
    beatPulse: 0,
  };
}

/**
 * Updates beatPulse (0..1.3) from 0..255 byte frequency data.
 * Isolates sub-bass / kick bins (~32 Hz - 155 Hz) and detects transient energy spikes.
 */
export function stepBeatDetector(
  freqBytes: Uint8Array,
  sampleRate: number,
  sensitivity: number,
  dtSeconds: number,
  state: BeatAnalysisState
): number {
  const binHz = sampleRate / FFT_SIZE;
  const startBin = Math.max(1, Math.floor(32 / binHz));
  const endBin = Math.min(freqBytes.length - 1, Math.ceil(155 / binHz));

  let sum = 0;
  let count = 0;
  for (let i = startBin; i <= endBin; i++) {
    const norm = freqBytes[i] / 255;
    const weight = i <= startBin + 2 ? 1.25 : 1.0;
    sum += norm * norm * weight;
    count += weight;
  }

  const rmsBass = count > 0 ? Math.sqrt(sum / count) : 0;

  const alpha = Math.min(1, dtSeconds * 3.2);
  state.rollingBass = state.rollingBass * (1 - alpha) + rmsBass * alpha;

  const delta = Math.max(0, rmsBass - state.rollingBass * 0.82);
  const rawHit = (rmsBass * 0.58 + delta * 2.45) * sensitivity;
  const targetPulse = Math.min(1.3, Math.max(0, rawHit));

  if (targetPulse > state.beatPulse) {
    const attack = Math.min(1, dtSeconds * 30);
    state.beatPulse += (targetPulse - state.beatPulse) * attack;
  } else {
    const decay = Math.exp(-dtSeconds * 8.2);
    state.beatPulse *= decay;
  }

  return state.beatPulse;
}

// Precomputed tables for Radix-2 2048 FFT with W3C Web Audio Blackman window
const bitReverse = new Uint32Array(FFT_SIZE);
const blackmanWindow = new Float32Array(FFT_SIZE);

(function initFftTables() {
  const bits = Math.log2(FFT_SIZE);
  for (let i = 0; i < FFT_SIZE; i++) {
    let rev = 0;
    let val = i;
    for (let j = 0; j < bits; j++) {
      rev = (rev << 1) | (val & 1);
      val >>= 1;
    }
    bitReverse[i] = rev;
    const phase = (2 * Math.PI * i) / FFT_SIZE;
    blackmanWindow[i] = 0.42 - 0.5 * Math.cos(phase) + 0.08 * Math.cos(2 * phase);
  }
})();

export class OfflineAudioAnalyzer {
  private monoPcm: Float32Array;
  private sampleRate: number;
  private smoothedMag: Float32Array;
  private real: Float32Array;
  private imag: Float32Array;

  constructor(audioBuffer: AudioBuffer) {
    this.sampleRate = audioBuffer.sampleRate;
    const len = audioBuffer.length;
    this.monoPcm = new Float32Array(len);

    const channels = audioBuffer.numberOfChannels;
    const scale = 1 / Math.max(1, channels);
    for (let ch = 0; ch < channels; ch++) {
      const data = audioBuffer.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        this.monoPcm[i] += data[i] * scale;
      }
    }

    this.smoothedMag = new Float32Array(BIN_COUNT);
    this.real = new Float32Array(FFT_SIZE);
    this.imag = new Float32Array(FFT_SIZE);
  }

  /**
   * Computes byte frequency data (0..255) and byte waveform data (0..255)
   * matching Web Audio API AnalyserNode at exact timestamp `timeSec`.
   */
  public sampleAt(
    timeSec: number,
    outFreq: Uint8Array,
    outWave: Uint8Array,
    smoothing = 0.68
  ): void {
    // Web Audio AnalyserNode inspects the most recent FFT_SIZE samples ending at current time
    const endSample = Math.floor(timeSec * this.sampleRate);
    const startSample = endSample - FFT_SIZE;
    const pcm = this.monoPcm;
    const pcmLen = pcm.length;

    for (let i = 0; i < FFT_SIZE; i++) {
      const idx = startSample + i;
      const sample = idx >= 0 && idx < pcmLen ? pcm[idx] : 0;
      if (i < outWave.length) {
        outWave[i] = Math.max(0, Math.min(255, Math.round((sample * 0.5 + 0.5) * 255)));
      }
      const rev = bitReverse[i];
      this.real[rev] = sample * blackmanWindow[i];
      this.imag[rev] = 0;
    }

    // In-place iterative Cooley-Tukey Radix-2 FFT
    for (let size = 2; size <= FFT_SIZE; size <<= 1) {
      const half = size >> 1;
      const stepAngle = (-2 * Math.PI) / size;
      const wStepRe = Math.cos(stepAngle);
      const wStepIm = Math.sin(stepAngle);

      for (let i = 0; i < FFT_SIZE; i += size) {
        let wRe = 1;
        let wIm = 0;
        for (let j = 0; j < half; j++) {
          const evenIdx = i + j;
          const oddIdx = evenIdx + half;
          const tRe = wRe * this.real[oddIdx] - wIm * this.imag[oddIdx];
          const tIm = wRe * this.imag[oddIdx] + wIm * this.real[oddIdx];

          this.real[oddIdx] = this.real[evenIdx] - tRe;
          this.imag[oddIdx] = this.imag[evenIdx] - tIm;
          this.real[evenIdx] += tRe;
          this.imag[evenIdx] += tIm;

          const nextWRe = wRe * wStepRe - wIm * wStepIm;
          wIm = wRe * wStepIm + wIm * wStepRe;
          wRe = nextWRe;
        }
      }
    }

    // Calibrated dB window [-95, -18] prevents loud mastered kicks/bass from flat-topping at 255
    const minDb = -95;
    const maxDb = -18;
    const dbRangeInv = 1 / (maxDb - minDb);
    const invN = 1 / FFT_SIZE;

    for (let k = 0; k < BIN_COUNT; k++) {
      const re = this.real[k] * invN;
      const im = this.imag[k] * invN;
      const mag = Math.hypot(re, im);
      const smoothed = smoothing * this.smoothedMag[k] + (1 - smoothing) * mag;
      this.smoothedMag[k] = smoothed;

      const db = 20 * Math.log10(Math.max(smoothed, 1e-7));
      const norm = (db - minDb) * dbRangeInv;
      outFreq[k] = Math.max(0, Math.min(255, Math.round(norm * 255)));
    }
  }
}
