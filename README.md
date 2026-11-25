# MP3Viz — Beat-Reactive Music Visualizer & Video Maker

**Live Studio:** [https://mp3viz.github.io/](https://mp3viz.github.io/)

MP3Viz is an ultra-fast, distraction-free, 100% client-side music visualizer and downloadable MP4 video maker built with **Astro 5**, **React 19**, **Tailwind CSS**, **Web Audio API**, and **WebCodecs (`mp4-muxer`)**. Drop an MP3, WAV, OGG, FLAC, or M4A track directly into your browser to preview smooth 60fps beat-synced visuals and export a watermark-free video with zero server uploads.

---

## Key Features

- **Real-Time Web Audio FFT Beat Detection:** Uses a `2048`-point Fast Fourier Transform (`AnalyserNode`) isolating sub-bass and kick transients (~32–155 Hz) to drive smooth pulse scaling while mapping mid and treble harmonics at 60fps.
- **4 Hardware-Accelerated Visualizer Presets:**
  - **Bars Spectrum** — Symmetrical rounded spectrum bars with luminous peak indicators.
  - **Radial Neon Ring** — Circular medallion emblem with dual-color radial frequency spikes.
  - **Mirrored Wave** — Mirrored harmonic ribbons layered with a live oscilloscope waveform.
  - **Particle Beat Pulse** — Concentric bass shockwaves and orbital streaming particles.
- **Social-Ready Video Aspect Ratios:** Switch seamlessly between **16:9 YouTube** (`1280×720`), **9:16 Shorts / TikTok / Reels** (`720×1280`), and **1:1 Square** (`1080×1080`) with zero layout shift (`CLS = 0`).
- **Cover Art, Color Swatches & Track Overlays:** Customize studio color presets or hex pickers, upload optional background/cover art that gently zooms on bass kicks, and add Song Title + Artist text overlays.
- **100% Local MP4 Video Export:** Encodes H.264 video (`VideoEncoder`) and AAC/Opus audio (`AudioEncoder`) directly in memory via [`mp4-muxer`](https://github.com/Vanilagy/mp4-muxer), with automatic `canvas.captureStream(60)` + `MediaRecorder` fallback on older browsers.
- **Complete Browser Privacy:** Unreleased songs, beats, podcast clips, and artwork never leave your device. Zero external tracking scripts and zero watermarks.
- **Offline PWA Support:** Installable via **Add to Home Screen** (`manifest.webmanifest` + cache-first Service Worker `sw.js`) so you can render music videos completely offline.
- **8-Language Internationalization & Technical SEO:** Localized static routes for English (`/`), Español (`/es/`), Português (`/pt/`), Deutsch (`/de/`), Français (`/fr/`), 日本語 (`/ja/`), 简体中文 (`/zh/`), and Русский (`/ru/`), paired with a flat `/sitemap.xml`, `hreflang` alternates, and clean JSON-LD structured data.

---

## Tech Stack

- **Framework:** [Astro 5](https://astro.build/) (Static Islands Architecture — 0 KB JS outside the visualizer island)
- **Interactive Studio Island:** [React 19](https://react.dev/) + TypeScript (`client:load`)
- **Styling & Themes:** [Tailwind CSS](https://tailwindcss.com/) + WCAG AA (`>= 4.5:1`) Clean Light & Dark CSS custom properties
- **Audio & Video Engine:** Web Audio API + HTML5 Canvas 2D + WebCodecs + `mp4-muxer` + MediaRecorder fallback

---

## Local Development

### Prerequisites

- **Node.js** `>= 20`
- **npm** `>= 10`

### Commands

```bash
# Install dependencies
npm install

# Start local development server at http://localhost:4321
npm run dev

# Run TypeScript / Astro checks and build static production output into ./dist
npm run build

# Preview the production build locally
npm run preview
```

---

## GitHub Pages Deployment

Deployment is automated via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) using `actions/configure-pages`, `withastro/action`, and `actions/deploy-pages`:

1. In your GitHub repository, open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to the `main` branch (or trigger the workflow manually from the **Actions** tab) to build and publish to `https://mp3viz.github.io/`.

---

## Support & Freelance Inquiries

Built and maintained by **Kishara Dilshan**.

- **Support the Developer:** [Buy Me a Coffee on Gumroad](https://kisharadilshan.gumroad.com/coffee)
- **Hire for Custom Web / WASM / Media Projects:** [https://mp3viz.github.io/hire-me/](https://mp3viz.github.io/hire-me/) or email [`kisharadilshan007@gmail.com`](mailto:kisharadilshan007@gmail.com)

---

## License

Released under the [MIT License](LICENSE). Copyright © 2026 Kishara Dilshan.
