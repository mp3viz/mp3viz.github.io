export type VisualizerStyle = 'bars' | 'radial' | 'wave' | 'particles';
export type AspectRatioPreset = '16:9' | '9:16' | '1:1';

export interface AspectDimensions {
  width: number;
  height: number;
}

export const ASPECT_RESOLUTIONS: Record<AspectRatioPreset, AspectDimensions> = {
  '16:9': { width: 1280, height: 720 },
  '9:16': { width: 720, height: 1280 },
  '1:1': { width: 1080, height: 1080 },
};

export interface ColorSwatch {
  id: string;
  name: string;
  accent: string;
  secondary: string;
  background: string;
}

export const STUDIO_SWATCHES: ColorSwatch[] = [
  {
    id: 'indigo-night',
    name: 'Electric Indigo',
    accent: '#8B7CE0',
    secondary: '#C3BEDA',
    background: '#111019',
  },
  {
    id: 'alabaster-studio',
    name: 'Warm Alabaster',
    accent: '#5E4FA2',
    secondary: '#8B7CE0',
    background: '#F4F1EA',
  },
  {
    id: 'neon-cyan',
    name: 'Cyber Pulse',
    accent: '#22D3EE',
    secondary: '#818CF8',
    background: '#09111E',
  },
  {
    id: 'sunset-coral',
    name: 'Velvet Sunset',
    accent: '#FB7185',
    secondary: '#FBBF24',
    background: '#1A0F18',
  },
  {
    id: 'emerald-glow',
    name: 'Aurora Mint',
    accent: '#34D399',
    secondary: '#60A5FA',
    background: '#0A1614',
  },
];

export interface RenderFrameOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  freqData: Uint8Array;
  waveData: Uint8Array;
  beatPulse: number; // 0..1.3
  timeSec: number;
  beatPhase: number; // cumulative beat travel for smooth particle motion
  style: VisualizerStyle;
  accentColor: string;
  bgColor: string;
  coverImage: HTMLImageElement | null;
  songTitle: string;
  artistName: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean.padEnd(6, '0');
  const num = parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(num)) return { r: 139, g: 124, b: 224 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function isLightColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62;
}

function rgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

function sampleSpectrumRange(freqData: Uint8Array, count: number): Float32Array {
  const out = new Float32Array(count);
  // Focus on musical bins 2..360 (~45 Hz to ~8.5 kHz) with logarithmic perceptual curve
  const minBin = 2;
  const maxBin = Math.min(freqData.length - 1, 360);
  const logRatio = Math.log(maxBin / minBin);

  for (let i = 0; i < count; i++) {
    const t0 = i / count;
    const t1 = (i + 1) / count;
    const b0 = Math.floor(minBin * Math.exp(logRatio * t0));
    const b1 = Math.max(b0 + 1, Math.floor(minBin * Math.exp(logRatio * t1)));

    let sum = 0;
    let n = 0;
    for (let b = b0; b < b1 && b < freqData.length; b++) {
      sum += freqData[b] / 255;
      n++;
    }
    const avg = n > 0 ? sum / n : 0;
    // Slight high-frequency visual lift so treble sparkles naturally
    const tilt = 1 + t0 * 0.32;
    out[i] = Math.min(1, Math.pow(avg, 1.15) * tilt);
  }
  return out;
}

export function renderVisualizerFrame(opts: RenderFrameOptions): void {
  const {
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
  } = opts;

  const minDim = Math.min(width, height);
  const lightBg = isLightColor(bgColor);
  const secondaryHex = lightBg ? '#5E4FA2' : '#C3BEDA';

  ctx.save();

  // 1. Solid Stage Fill
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Optional Cover / Background Art with Gentle Beat-Zoom Reaction
  if (coverImage && coverImage.complete && coverImage.naturalWidth > 0) {
    const zoom = 1.03 + beatPulse * 0.065;
    const imgAspect = coverImage.naturalWidth / coverImage.naturalHeight;
    const stageAspect = width / height;
    let drawW = width;
    let drawH = height;

    if (imgAspect > stageAspect) {
      drawH = height * zoom;
      drawW = drawH * imgAspect;
    } else {
      drawW = width * zoom;
      drawH = drawW / imgAspect;
    }

    const dx = (width - drawW) * 0.5;
    const dy = (height - drawH) * 0.5;

    ctx.save();
    ctx.globalAlpha = lightBg ? 0.28 : 0.42;
    ctx.drawImage(coverImage, dx, dy, drawW, drawH);
    ctx.restore();

    // Soft readability vignette over background cover art
    const vig = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      minDim * 0.15,
      width * 0.5,
      height * 0.5,
       Math.max(width, height) * 0.72
    );
    vig.addColorStop(0, rgba(bgColor, lightBg ? 0.35 : 0.38));
    vig.addColorStop(1, rgba(bgColor, lightBg ? 0.86 : 0.88));
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, width, height);
  }

  // 3. Ambient Beat-Reactive Center Glow
  const glowRadius = minDim * (0.34 + beatPulse * 0.18);
  const glow = ctx.createRadialGradient(
    width * 0.5,
    height * 0.5,
    0,
    width * 0.5,
    height * 0.5,
    glowRadius
  );
  glow.addColorStop(0, rgba(accentColor, (lightBg ? 0.16 : 0.26) + beatPulse * 0.14));
  glow.addColorStop(0.6, rgba(secondaryHex, 0.06 + beatPulse * 0.05));
  glow.addColorStop(1, rgba(bgColor, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // 4. Render Selected Visualizer Style
  switch (style) {
    case 'bars':
      drawBarsSpectrum(ctx, width, height, freqData, beatPulse, accentColor, secondaryHex, lightBg);
      break;
    case 'radial':
      drawRadialNeonRing(
        ctx,
        width,
        height,
        freqData,
        beatPulse,
        timeSec,
        accentColor,
        secondaryHex,
        bgColor,
        coverImage,
        lightBg
      );
      break;
    case 'wave':
      drawMirroredWave(
        ctx,
        width,
        height,
        freqData,
        waveData,
        beatPulse,
        timeSec,
        accentColor,
        secondaryHex,
        lightBg
      );
      break;
    case 'particles':
      drawParticleBeatPulse(
        ctx,
        width,
        height,
        freqData,
        beatPulse,
        timeSec,
        beatPhase,
        accentColor,
        secondaryHex,
        lightBg
      );
      break;
  }

  // 5. Optional Song Title & Artist Name Overlay
  const cleanTitle = songTitle.trim();
  const cleanArtist = artistName.trim();
  if (cleanTitle || cleanArtist) {
    drawTrackOverlay(ctx, width, height, cleanTitle, cleanArtist, accentColor, bgColor, beatPulse, lightBg);
  }

  ctx.restore();
}

function drawBarsSpectrum(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  freqData: Uint8Array,
  beatPulse: number,
  accentColor: string,
  secondaryHex: string,
  lightBg: boolean
): void {
  const isPortrait = height > width;
  const halfBars = isPortrait ? 24 : 36;
  const bands = sampleSpectrumRange(freqData, halfBars);

  const usableWidth = width * 0.84;
  const startX = (width - usableWidth) * 0.5;
  const totalBars = halfBars * 2;
  const stepX = usableWidth / totalBars;
  const barWidth = Math.max(4, stepX * 0.62);
  const centerY = height * 0.5;
  const maxHalfHeight = height * (0.31 + beatPulse * 0.06);

  const grad = ctx.createLinearGradient(0, centerY - maxHalfHeight, 0, centerY + maxHalfHeight);
  grad.addColorStop(0, secondaryHex);
  grad.addColorStop(0.5, accentColor);
  grad.addColorStop(1, secondaryHex);

  ctx.fillStyle = grad;

  for (let i = 0; i < totalBars; i++) {
    // Mirror low frequencies in center outward for balanced studio symmetry
    const mirrorIdx = i < halfBars ? halfBars - 1 - i : i - halfBars;
    const energy = bands[mirrorIdx];
    const idleWave = 0.035 + 0.015 * Math.cos(mirrorIdx * 0.35);
    const barHalf = Math.max(barWidth * 0.5, (idleWave + energy * (0.88 + beatPulse * 0.22)) * maxHalfHeight);

    const x = startX + i * stepX + (stepX - barWidth) * 0.5;
    const y = centerY - barHalf;
    const h = barHalf * 2;
    const radius = barWidth * 0.5;

    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, h, radius);
    ctx.fill();

    // Luminous peak dots above/below active bars
    if (energy > 0.18) {
      const dotOffset = barHalf + barWidth * 1.15 + beatPulse * 6;
      ctx.save();
      ctx.fillStyle = lightBg ? accentColor : '#F8F7F4';
      ctx.globalAlpha = Math.min(0.92, energy * 0.95);
      ctx.beginPath();
      ctx.arc(x + barWidth * 0.5, centerY - dotOffset, barWidth * 0.32, 0, Math.PI * 2);
      ctx.arc(x + barWidth * 0.5, centerY + dotOffset, barWidth * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

function drawRadialNeonRing(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  freqData: Uint8Array,
  beatPulse: number,
  timeSec: number,
  accentColor: string,
  secondaryHex: string,
  bgColor: string,
  coverImage: HTMLImageElement | null,
  lightBg: boolean
): void {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const minDim = Math.min(width, height);
  const baseRadius = minDim * (0.2 + beatPulse * 0.035);
  const maxSpike = minDim * 0.19;
  const spokeCount = 96;
  const halfSpokes = spokeCount >> 1;
  const bands = sampleSpectrumRange(freqData, halfSpokes);

  // Outer subtle orbit halo
  ctx.save();
  ctx.strokeStyle = rgba(accentColor, 0.28 + beatPulse * 0.32);
  ctx.lineWidth = Math.max(2, minDim * 0.003);
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius * (1.14 + beatPulse * 0.06), 0, Math.PI * 2);
  ctx.stroke();

  // Radial frequency spikes
  ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(3, (2 * Math.PI * baseRadius) / spokeCount * 0.52);

  for (let i = 0; i < spokeCount; i++) {
    const bandIdx = i < halfSpokes ? i : spokeCount - 1 - i;
    const val = bands[bandIdx];
    const angle = (i / spokeCount) * Math.PI * 2 - Math.PI * 0.5 + timeSec * 0.12;
    const spikeLen = minDim * 0.012 + val * maxSpike * (1 + beatPulse * 0.24);

    const r0 = baseRadius * 1.04;
    const r1 = r0 + spikeLen;

    ctx.strokeStyle = i % 2 === 0 ? accentColor : secondaryHex;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r0, cy + Math.sin(angle) * r0);
    ctx.lineTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
    ctx.stroke();
  }

  // Inner medallion (frames cover art if uploaded, or crisp pulsing core)
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius * 0.95, 0, Math.PI * 2);
  ctx.fillStyle = rgba(bgColor, 0.92);
  ctx.fill();

  if (coverImage && coverImage.complete && coverImage.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius * 0.91, 0, Math.PI * 2);
    ctx.clip();
    const d = baseRadius * 1.86;
    ctx.drawImage(coverImage, cx - d * 0.5, cy - d * 0.5, d, d);
    ctx.restore();
  } else {
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 0.92);
    coreGrad.addColorStop(0, rgba(accentColor, lightBg ? 0.35 : 0.48));
    coreGrad.addColorStop(1, rgba(bgColor, 0.95));
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius * 0.91, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = Math.max(3, minDim * 0.005);
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius * 0.95, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawMirroredWave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  freqData: Uint8Array,
  waveData: Uint8Array,
  beatPulse: number,
  timeSec: number,
  accentColor: string,
  secondaryHex: string,
  lightBg: boolean
): void {
  const points = 64;
  const bands = sampleSpectrumRange(freqData, points);
  const centerY = height * 0.5;
  const marginX = width * 0.06;
  const drawW = width - marginX * 2;
  const maxAmp = height * (0.28 + beatPulse * 0.07);

  // Layer 1: Mirrored harmonic ribbon envelope
  for (const sign of [-1, 1]) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(marginX, centerY);

    for (let i = 0; i < points; i++) {
      const t = i / (points - 1);
      const windowEnv = Math.sin(t * Math.PI);
      const mirrorIdx = i < points / 2 ? i * 2 : (points - 1 - i) * 2;
      const energy = bands[Math.min(points - 1, mirrorIdx)];
      const ripple = Math.sin(t * 10 + timeSec * 3.2) * 0.04;
      const amp = (0.02 + energy * 0.92 + ripple) * windowEnv * maxAmp;
      const x = marginX + t * drawW;
      const y = centerY + sign * amp;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(marginX + drawW, centerY);
    ctx.closePath();

    const fillGrad = ctx.createLinearGradient(0, centerY - maxAmp, 0, centerY + maxAmp);
    fillGrad.addColorStop(0, rgba(secondaryHex, lightBg ? 0.26 : 0.32));
    fillGrad.addColorStop(0.5, rgba(accentColor, lightBg ? 0.45 : 0.52));
    fillGrad.addColorStop(1, rgba(secondaryHex, lightBg ? 0.26 : 0.32));
    ctx.fillStyle = fillGrad;
    ctx.fill();

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = Math.max(2.5, Math.min(width, height) * 0.004);
    ctx.stroke();
    ctx.restore();
  }

  // Layer 2: Crisp live oscilloscope centerline wave
  ctx.save();
  ctx.strokeStyle = lightBg ? '#181622' : '#F8F7F4';
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = Math.max(2, Math.min(width, height) * 0.003);
  ctx.beginPath();

  const waveSamples = 128;
  const stride = Math.max(1, Math.floor(waveData.length / waveSamples));
  for (let i = 0; i < waveSamples; i++) {
    const t = i / (waveSamples - 1);
    const sample = (waveData[Math.min(waveData.length - 1, i * stride)] - 128) / 128;
    const taper = Math.sin(t * Math.PI);
    const x = marginX + t * drawW;
    const y = centerY + sample * height * 0.16 * taper;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawParticleBeatPulse(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  freqData: Uint8Array,
  beatPulse: number,
  timeSec: number,
  beatPhase: number,
  accentColor: string,
  secondaryHex: string,
  lightBg: boolean
): void {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const minDim = Math.min(width, height);
  const maxRadius = Math.hypot(width, height) * 0.52;
  const particleCount = 88;
  const bands = sampleSpectrumRange(freqData, particleCount);

  ctx.save();

  // Concentric bass shockwave rings
  for (let r = 0; r < 3; r++) {
    const progress = ((beatPhase * 0.45 + r / 3) % 1 + 1) % 1;
    const radius = minDim * 0.07 + progress * minDim * 0.42;
    const alpha = (1 - progress) * (0.22 + beatPulse * 0.32);
    ctx.strokeStyle = rgba(accentColor, alpha);
    ctx.lineWidth = Math.max(1.8, (1 - progress) * minDim * 0.006);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Deterministic beat-driven streaming starfield particles
  for (let i = 0; i < particleCount; i++) {
    const goldenAngle = i * 2.39996323;
    const speedSeed = 0.35 + ((i * 37) % 29) / 29 * 0.65;
    const radialProgress = ((timeSec * 0.14 * speedSeed + beatPhase * 0.22 * speedSeed + i / particleCount) % 1 + 1) % 1;
    const energy = bands[i];

    const dist = minDim * 0.06 + radialProgress * maxRadius * (0.85 + beatPulse * 0.18);
    const swirl = goldenAngle + timeSec * (i % 2 === 0 ? 0.16 : -0.12);
    const px = cx + Math.cos(swirl) * dist;
    const py = cy + Math.sin(swirl) * dist;

    const size = Math.max(2.2, minDim * (0.004 + energy * 0.012 + beatPulse * 0.005) * (0.4 + radialProgress * 0.8));
    const alpha = Math.sin(radialProgress * Math.PI) * (0.55 + energy * 0.45);

    ctx.fillStyle = i % 3 === 0 ? (lightBg ? '#181622' : '#F8F7F4') : i % 2 === 0 ? accentColor : secondaryHex;
    ctx.globalAlpha = Math.min(0.96, alpha);
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pulsing harmonic core
  ctx.globalAlpha = 1;
  const coreR = minDim * (0.055 + beatPulse * 0.032);
  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.1);
  coreGrad.addColorStop(0, lightBg ? accentColor : '#FFFFFF');
  coreGrad.addColorStop(0.45, accentColor);
  coreGrad.addColorStop(1, rgba(accentColor, 0));
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR * 2.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawTrackOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  title: string,
  artist: string,
  accentColor: string,
  bgColor: string,
  beatPulse: number,
  lightBg: boolean
): void {
  const minDim = Math.min(width, height);
  const padX = Math.round(minDim * 0.035);
  const padY = Math.round(minDim * 0.024);
  const titleSize = Math.max(20, Math.round(minDim * 0.038));
  const artistSize = Math.max(14, Math.round(minDim * 0.024));

  ctx.save();
  ctx.font = `700 ${titleSize}px Inter, "Segoe UI", system-ui, sans-serif`;
  const titleW = title ? ctx.measureText(title).width : 0;

  ctx.font = `500 ${artistSize}px Inter, "Segoe UI", system-ui, sans-serif`;
  const artistW = artist ? ctx.measureText(artist).width : 0;

  const contentW = Math.min(width * 0.84, Math.max(titleW, artistW) + padX * 2.4);
  const contentH =
    (title ? titleSize * 1.25 : 0) +
    (artist ? artistSize * 1.35 : 0) +
    padY * 1.6;

  const boxX = (width - contentW) * 0.5;
  const boxY = height - contentH - Math.round(height * 0.055);

  ctx.fillStyle = rgba(bgColor, lightBg ? 0.82 : 0.74);
  ctx.strokeStyle = rgba(accentColor, 0.45 + beatPulse * 0.35);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, contentW, contentH, Math.round(minDim * 0.022));
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let cursorY = boxY + padY * 0.85;
  if (title) {
    ctx.font = `700 ${titleSize}px Inter, "Segoe UI", system-ui, sans-serif`;
    ctx.fillStyle = lightBg ? '#181622' : '#F8F7F4';
    cursorY += titleSize * 0.58;
    ctx.fillText(title, width * 0.5, cursorY, contentW - padX * 1.6);
    cursorY += titleSize * 0.62;
  }

  if (artist) {
    ctx.font = `600 ${artistSize}px Inter, "Segoe UI", system-ui, sans-serif`;
    ctx.fillStyle = accentColor;
    cursorY += artistSize * 0.62;
    ctx.fillText(artist, width * 0.5, cursorY, contentW - padX * 1.6);
  }

  ctx.restore();
}
