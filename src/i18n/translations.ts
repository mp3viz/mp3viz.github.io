export type Locale = 'en' | 'es' | 'pt' | 'de' | 'fr' | 'ja' | 'zh' | 'ru';

export interface LanguageConfig {
  code: Locale;
  label: string;
  pathPrefix: string;
  ogLocale: string;
}

export const LANGUAGES: LanguageConfig[] = [
  { code: 'en', label: 'English', pathPrefix: '/', ogLocale: 'en_US' },
  { code: 'es', label: 'Español', pathPrefix: '/es/', ogLocale: 'es_ES' },
  { code: 'pt', label: 'Português', pathPrefix: '/pt/', ogLocale: 'pt_BR' },
  { code: 'de', label: 'Deutsch', pathPrefix: '/de/', ogLocale: 'de_DE' },
  { code: 'fr', label: 'Français', pathPrefix: '/fr/', ogLocale: 'fr_FR' },
  { code: 'ja', label: '日本語', pathPrefix: '/ja/', ogLocale: 'ja_JP' },
  { code: 'zh', label: '简体中文', pathPrefix: '/zh/', ogLocale: 'zh_CN' },
  { code: 'ru', label: 'Русский', pathPrefix: '/ru/', ogLocale: 'ru_RU' },
];

export const NON_DEFAULT_LOCALES: Exclude<Locale, 'en'>[] = [
  'es',
  'pt',
  'de',
  'fr',
  'ja',
  'zh',
  'ru',
];

export function getLocalizedPath(locale: Locale, route: '' | 'how-to-use/' | 'hire-me/' = ''): string {
  if (locale === 'en') {
    return `/${route}`;
  }
  return `/${locale}/${route}`;
}

export interface StudioStrings {
  dropHeadline: string;
  dropSubtext: string;
  selectAudioBtn: string;
  trySampleBtn: string;
  changeAudioBtn: string;
  playLabel: string;
  pauseLabel: string;
  seekLabel: string;
  styleSectionLabel: string;
  styles: {
    bars: string;
    radial: string;
    wave: string;
    particles: string;
  };
  sensitivityLabel: string;
  aspectSectionLabel: string;
  aspects: {
    landscape: string;
    portrait: string;
    square: string;
  };
  customSectionLabel: string;
  themeSwatchesLabel: string;
  accentColorLabel: string;
  bgColorLabel: string;
  coverArtLabel: string;
  uploadCoverBtn: string;
  clearCoverBtn: string;
  songTitleLabel: string;
  songTitlePlaceholder: string;
  artistNameLabel: string;
  artistNamePlaceholder: string;
  exportMp4Btn: string;
  cancelExportBtn: string;
  exportingLabel: string;
  statusIdle: string;
  statusSampleLoaded: string;
  statusAudioLoaded: string;
  statusExportStart: string;
  statusExportProgress: string;
  statusExportComplete: string;
  statusExportCancelled: string;
  statusExportError: string;
  privacyBadge: string;
  sampleTrackTitle: string;
  sampleTrackArtist: string;
}

export interface TranslationBundle {
  nav: {
    home: string;
    howToUse: string;
    hireMe: string;
    languageLabel: string;
    themeToggleLabel: string;
    installApp: string;
    installAppAria: string;
    iosInstallTitle: string;
    iosInstallBody: string;
    installedToast: string;
    closeLabel: string;
    supportDev: string;
    supportDevAria: string;
    githubAria: string;
    breadcrumbAria: string;
  };
  footer: {
    tagline: string;
    privacyNote: string;
    copyright: string;
  };
  home: {
    title: string;
    description: string;
    h1: string;
    heroSubtitle: string;
    faqHeading: string;
    faqIntro: string;
    faqs: Array<{ question: string; answer: string }>;
  };
  howToUse: {
    title: string;
    description: string;
    breadcrumbCurrent: string;
    h1: string;
    intro: string;
    steps: Array<{ title: string; body: string }>;
    tipsHeading: string;
    tips: Array<{ title: string; body: string }>;
    ctaText: string;
    ctaButton: string;
  };
  hireMe: {
    title: string;
    description: string;
    breadcrumbCurrent: string;
    badge: string;
    heading: string;
    intro: string;
    subcopy: string;
    specialtiesHeading: string;
    specialties: Array<{ title: string; description: string }>;
    ctaHeading: string;
    email: string;
    emailLabel: string;
    copyButtonLabel: string;
    copiedButtonLabel: string;
  };
  studio: StudioStrings;
}

export const TRANSLATIONS: Record<Locale, TranslationBundle> = {
  en: {
    nav: {
      home: 'Home',
      howToUse: 'How to Use',
      hireMe: 'Hire Me',
      languageLabel: 'Select language',
      themeToggleLabel: 'Toggle light and dark theme',
      installApp: 'Add to Home Screen',
      installAppAria: 'Install MP3Viz offline app to Home Screen',
      iosInstallTitle: 'Install MP3Viz Offline App',
      iosInstallBody: 'On Safari or desktop browsers without an install prompt, tap the Share or browser menu icon and choose "Add to Home Screen" or "Install Page as App" to use MP3Viz completely offline.',
      installedToast: 'MP3Viz is ready for offline use.',
      closeLabel: 'Close dialog',
      supportDev: 'Support the Developer',
      supportDevAria: 'Support the developer on Gumroad',
      githubAria: 'View source code on GitHub',
      breadcrumbAria: 'Breadcrumb',
    },
    footer: {
      tagline: 'Client-side beat-reactive music visualizer and watermark-free MP4 video studio.',
      privacyNote: '100% Private — Audio decoding and video rendering run locally inside your browser.',
      copyright: '© 2026 Kishara Dilshan. Released under the MIT License.',
    },
    home: {
      title: 'MP3 Visualizer Online - Make Music Visualizer Videos Free',
      description: 'Turn MP3, WAV, and M4A songs into beat-reactive music visualizer videos right in your browser. Export 16:9 or 9:16 MP4s—100% free, no watermark.',
      h1: 'MP3 Visualizer — Turn Audio Into Beat-Reactive Videos Online',
      heroSubtitle: 'Drop an MP3, WAV, OGG, or M4A track to generate smooth beat-synced audio visuals and download a ready-to-share MP4 video—100% free, no watermark, and zero uploads.',
      faqHeading: 'Frequently Asked Questions',
      faqIntro: 'Everything you need to know about creating beat-reactive music videos right inside your browser.',
      faqs: [
        {
          question: 'How does MP3Viz sync visuals to the beat of my song?',
          answer: 'MP3Viz analyzes your audio in real time using the browser Web Audio API with a 2048-point Fast Fourier Transform (FFT). It isolates low-end kick and sub-bass frequencies to drive beat-reactive pulse scaling while mapping mid and treble harmonics across smooth 60fps spectrum bars, radial rings, waveforms, and particles.',
        },
        {
          question: 'Can I download the music visualizer as a video without watermarks?',
          answer: 'Yes. Every video you create is 100% free and completely watermark-free. Click "Download Video (MP4)" to encode crisp H.264 video and AAC audio directly in your browser via WebCodecs and mp4-muxer, with automatic MediaRecorder fallback on older browsers.',
        },
        {
          question: 'Are my audio files or cover images uploaded to a server?',
          answer: 'Never. Your unreleased tracks, podcast clips, and cover artwork stay strictly on your own device. Audio decoding, canvas visualization, and MP4 video muxing happen locally in browser memory with zero server uploads.',
        },
        {
          question: 'Which audio formats and video aspect ratios are supported?',
          answer: 'You can load MP3, WAV, OGG, FLAC, and M4A/AAC audio files. For video output, switch instantly between 16:9 Landscape for YouTube, 9:16 Vertical for TikTok, Instagram Reels, and YouTube Shorts, or 1:1 Square for album previews and social feeds.',
        },
      ],
    },
    howToUse: {
      title: 'How to Make a Beat-Reactive MP3 Visualizer Video Online',
      description: 'Step-by-step guide to turn MP3, WAV, and M4A tracks into beat-synced spectrum videos, customize aspect ratios and cover art, and export MP4s.',
      breadcrumbCurrent: 'How to Use',
      h1: 'How to Create and Download a Beat-Reactive MP3 Visualizer',
      intro: 'Turn any song, beat, or podcast clip into a polished spectrum video in four straightforward steps—directly inside your browser with zero software to install.',
      steps: [
        {
          title: 'Load Your Audio Track or Sample Beat',
          body: 'Drag and drop an MP3, WAV, OGG, FLAC, or M4A file onto the studio stage on the Home page, click "Select Audio File", or click "Try Sample Beat" to test a synthesized rhythmic groove immediately.',
        },
        {
          title: 'Choose a Beat-Reactive Style & Aspect Ratio',
          body: 'Pick from four hardware-accelerated presets—Bars Spectrum, Radial Neon Ring, Mirrored Wave, or Particle Beat Pulse. Select 16:9 for YouTube videos, 9:16 for TikTok, Reels, and YouTube Shorts, or 1:1 Square, then fine-tune the Beat Sensitivity slider.',
        },
        {
          title: 'Customize Colors, Cover Art & Track Titles',
          body: 'Select a curated studio color swatch or pick custom spectrum and background colors. Optionally add square or full-frame cover artwork—which gently zooms in sync with bass hits—and type your Song Title and Artist name for an on-screen overlay.',
        },
        {
          title: 'Export Your Watermark-Free MP4 Video',
          body: 'Click "Download Video (MP4)" to render the full song locally using WebCodecs hardware encoding (or automatic MediaRecorder fallback). Watch the live percentage bar reach 100% and save your finished video straight to your device.',
        },
      ],
      tipsHeading: 'Creator Tips for Crisp Social Releases',
      tips: [
        {
          title: 'Match Aspect Ratio Before Exporting',
          body: 'Choose 16:9 (1280×720 HD) for desktop YouTube uploads and 9:16 (720×1280 vertical HD) for YouTube Shorts, TikTok, and Instagram Reels so platforms never crop your spectrum.',
        },
        {
          title: 'Dial In Sub-Bass Sensitivity',
          body: 'Acoustic and ambient tracks shine around 1.3×–1.6× beat sensitivity, while mastered hip-hop, EDM, and drum-and-bass mixes stay punchy around 0.9×–1.1×.',
        },
        {
          title: 'Work Completely Offline as a PWA',
          body: 'Click "Add to Home Screen" in the top bar once, and MP3Viz caches the entire studio locally so you can render music videos on flights or offline studio laptops.',
        },
      ],
      ctaText: 'Ready to turn your track into a beat-synced video?',
      ctaButton: 'Open Visualizer Studio',
    },
    hireMe: {
      title: 'Hire Kishara Dilshan - Astro, React & Media Dev | MP3Viz',
      description: 'Need an ultra-fast Astro, React, or Next.js web app or client-side WebAssembly tool? Hire Kishara Dilshan for custom SEO-ready IT solutions.',
      breadcrumbCurrent: 'Hire Me',
      badge: 'Available for Freelance Projects',
      heading: 'Need a Custom IT Solution?',
      intro: "Hi, I'm Kishara Dilshan, the developer behind MP3Viz.",
      subcopy: 'If you love this fast, client-side tool and need a world-class IT solution for your own business, I am available for freelance projects. I specialize in:',
      specialtiesHeading: 'Core Engineering Specialties',
      specialties: [
        {
          title: 'Ultra-fast, SEO-optimized web applications',
          description: 'Astro, React, Next.js — engineered for sub-second loads, technical SEO, and clean scalability.',
        },
        {
          title: 'Client-side processing & WebAssembly (WASM) tools',
          description: 'Zero-server media, PDF, and data utilities that run privately inside the browser.',
        },
        {
          title: 'UI/UX design & High-converting landing pages',
          description: 'Minimal, accessible interfaces crafted to convert visitors effortlessly across desktop and mobile.',
        },
      ],
      ctaHeading: "Let's build something amazing together.",
      email: 'kisharadilshan007@gmail.com',
      emailLabel: 'Email me directly: kisharadilshan007@gmail.com',
      copyButtonLabel: 'Copy Email',
      copiedButtonLabel: 'Copied!',
    },
    studio: {
      dropHeadline: 'Drop your audio track here to start visualizing',
      dropSubtext: 'Supports MP3, WAV, OGG, FLAC & M4A • Processed 100% locally in your browser',
      selectAudioBtn: 'Select Audio File',
      trySampleBtn: 'Try Sample Beat',
      changeAudioBtn: 'Load New Track',
      playLabel: 'Play audio preview',
      pauseLabel: 'Pause audio preview',
      seekLabel: 'Seek audio timeline',
      styleSectionLabel: 'Visualizer Style',
      styles: {
        bars: 'Bars Spectrum',
        radial: 'Radial Neon Ring',
        wave: 'Mirrored Wave',
        particles: 'Particle Beat Pulse',
      },
      sensitivityLabel: 'Beat Sensitivity',
      aspectSectionLabel: 'Video Aspect Ratio',
      aspects: {
        landscape: '16:9 YouTube',
        portrait: '9:16 Shorts / TikTok',
        square: '1:1 Square',
      },
      customSectionLabel: 'Visual Customization',
      themeSwatchesLabel: 'Color Presets',
      accentColorLabel: 'Spectrum Color',
      bgColorLabel: 'Stage Color',
      coverArtLabel: 'Cover / Background Art',
      uploadCoverBtn: 'Upload Image',
      clearCoverBtn: 'Remove',
      songTitleLabel: 'Song Title Overlay',
      songTitlePlaceholder: 'e.g. Midnight Horizon',
      artistNameLabel: 'Artist Name Overlay',
      artistNamePlaceholder: 'e.g. Nova Pulse',
      exportMp4Btn: 'Download Video (MP4)',
      cancelExportBtn: 'Cancel Export',
      exportingLabel: 'Rendering Video',
      statusIdle: 'Audio visualizer studio ready. Select an audio file or try the sample beat.',
      statusSampleLoaded: 'Sample beat loaded and playing at 60 frames per second.',
      statusAudioLoaded: 'Loaded track:',
      statusExportStart: 'Starting local browser video export...',
      statusExportProgress: 'Rendering beat-synced video:',
      statusExportComplete: 'Video export complete! Your download has started.',
      statusExportCancelled: 'Video export cancelled.',
      statusExportError: 'Video export encountered an issue:',
      privacyBadge: 'Zero Uploads • No Watermark',
      sampleTrackTitle: 'Electric Indigo Pulse',
      sampleTrackArtist: 'MP3Viz Studio Loop',
    },
  },

  es: {
    nav: {
      home: 'Inicio',
      howToUse: 'Cómo Usar',
      hireMe: 'Contrátame',
      languageLabel: 'Seleccionar idioma',
      themeToggleLabel: 'Cambiar tema claro u oscuro',
      installApp: 'Añadir a Inicio',
      installAppAria: 'Instalar aplicación sin conexión MP3Viz',
      iosInstallTitle: 'Instalar MP3Viz sin conexión',
      iosInstallBody: 'En Safari o navegadores sin aviso directo, toca Compartir o el menú del navegador y elige "Añadir a pantalla de inicio" para usar MP3Viz sin conexión.',
      installedToast: 'MP3Viz está listo para usarse sin conexión.',
      closeLabel: 'Cerrar ventana',
      supportDev: 'Apoyar al Creador',
      supportDevAria: 'Apoyar al desarrollador en Gumroad',
      githubAria: 'Ver código fuente en GitHub',
      breadcrumbAria: 'Ruta de navegación',
    },
    footer: {
      tagline: 'Visualizador musical reactivo al ritmo y creador de vídeos MP4 sin marca de agua.',
      privacyNote: '100% Privado — El análisis de audio y la exportación de vídeo ocurren en tu navegador.',
      copyright: '© 2026 Kishara Dilshan. Publicado bajo licencia MIT.',
    },
    home: {
      title: 'Visualizador MP3 Online - Crea Vídeos Musicales Gratis',
      description: 'Convierte canciones MP3, WAV y M4A en vídeos musicales reactivos al ritmo en tu navegador. Exporta MP4 16:9 o 9:16 gratis y sin marca de agua.',
      h1: 'Visualizador MP3 — Convierte Audio en Vídeos al Ritmo Online',
      heroSubtitle: 'Arrastra una pista MP3, WAV, OGG o M4A para generar visuales sincronizados con el ritmo y descargar un vídeo MP4 listo para compartir: gratis y sin subir archivos.',
      faqHeading: 'Preguntas Frecuentes',
      faqIntro: 'Respuestas claras sobre cómo crear y exportar vídeos de espectro musical desde tu navegador.',
      faqs: [
        {
          question: '¿Cómo sincroniza MP3Viz los efectos visuales con el ritmo de mi canción?',
          answer: 'MP3Viz analiza tu pista en tiempo real mediante Web Audio API con una transformada FFT de 2048 puntos. Detecta la energía del bombo y subgraves para impulsar el pulso visual mientras dibuja medios y agudos a 60 fotogramas por segundo.',
        },
        {
          question: '¿Puedo descargar el visualizador musical en vídeo sin marca de agua?',
          answer: 'Sí. Todos los vídeos generados son 100% gratuitos y no incluyen marcas de agua. Pulsa "Descargar Vídeo (MP4)" para codificar vídeo H.264 y audio AAC en tu navegador con WebCodecs y mp4-muxer.',
        },
        {
          question: '¿Mis archivos de audio o portadas se suben a algún servidor?',
          answer: 'Nunca. Tus canciones inéditas, podcasts e imágenes de portada permanecen exclusivamente en tu dispositivo. Todo el procesamiento y renderizado ocurre en la memoria local del navegador.',
        },
        {
          question: '¿Qué formatos de audio y proporciones de vídeo están soportados?',
          answer: 'Acepta archivos MP3, WAV, OGG, FLAC y M4A. Puedes alternar al instante entre 16:9 horizontal para YouTube, 9:16 vertical para TikTok, Reels y Shorts, o 1:1 cuadrado para redes sociales.',
        },
      ],
    },
    howToUse: {
      title: 'Cómo Crear un Vídeo Visualizador MP3 Reactivo al Ritmo',
      description: 'Guía paso a paso para convertir pistas MP3, WAV y M4A en vídeos de espectro musical, ajustar formatos 16:9 o 9:16, añadir portada y bajar MP4.',
      breadcrumbCurrent: 'Cómo Usar',
      h1: 'Cómo Crear y Descargar un Visualizador MP3 Reactivo al Ritmo',
      intro: 'Transforma cualquier canción, base instrumental o clip de podcast en un vídeo musical fluido en cuatro sencillos pasos desde tu navegador.',
      steps: [
        {
          title: 'Carga tu Pista de Audio o Ritmo de Prueba',
          body: 'Arrastra un archivo MP3, WAV, OGG, FLAC o M4A al estudio principal, haz clic en "Seleccionar Audio" o prueba el botón de ritmo de muestra para ver el motor en acción.',
        },
        {
          title: 'Elige Estilo Visual y Formato de Vídeo',
          body: 'Selecciona entre Barras de Espectro, Anillo Neón Radial, Onda Espejada o Pulso de Partículas. Escoge 16:9 para YouTube, 9:16 para TikTok/Shorts o 1:1 cuadrado y regula la sensibilidad del golpe.',
        },
        {
          title: 'Personaliza Colores, Portada y Títulos',
          body: 'Aplica una paleta de estudio o colores propios, sube una imagen de portada que late suavemente con los graves y escribe el título de la canción y el nombre del artista.',
        },
        {
          title: 'Descarga tu Vídeo MP4 sin Marca de Agua',
          body: 'Pulsa "Descargar Vídeo (MP4)" para renderizar localmente con WebCodecs o MediaRecorder. Sigue el progreso del 0 al 100% y guarda el vídeo listo para publicar.',
        },
      ],
      tipsHeading: 'Consejos para Creadores y Músicos',
      tips: [
        {
          title: 'Elige la Proporción Antes de Exportar',
          body: 'Usa 16:9 para vídeos horizontales en YouTube y 9:16 vertical para Shorts, Reels y TikTok sin recortes.',
        },
        {
          title: 'Ajusta la Sensibilidad según el Género',
          body: 'Pistas acústicas destacan entre 1.3× y 1.6×, mientras mezclas electrónicas o urbanas brillan cerca de 1.0×.',
        },
        {
          title: 'Úsalo sin Conexión como App PWA',
          body: 'Pulsa "Añadir a Inicio" en la barra superior para trabajar y exportar vídeos incluso sin internet.',
        },
      ],
      ctaText: '¿Listo para convertir tu música en vídeo?',
      ctaButton: 'Abrir Estudio Visualizador',
    },
    hireMe: {
      title: 'Contrata a Kishara Dilshan - Desarrollador Web | MP3Viz',
      description: '¿Buscas una aplicación web ultrarrápida en Astro, React o Next.js o herramientas WebAssembly? Contrata a Kishara Dilshan para proyectos a medida.',
      breadcrumbCurrent: 'Contrátame',
      badge: 'Disponible para Proyectos Freelance',
      heading: '¿Necesitas una Solución IT a Medida?',
      intro: 'Hola, soy Kishara Dilshan, el desarrollador detrás de MP3Viz.',
      subcopy: 'Si te encanta esta herramienta rápida en el navegador y necesitas una solución digital de primer nivel para tu negocio, estoy disponible para proyectos freelance. Me especializo en:',
      specialtiesHeading: 'Especialidades de Ingeniería',
      specialties: [
        {
          title: 'Aplicaciones web ultrarrápidas y optimizadas para SEO',
          description: 'Astro, React y Next.js diseñados para cargas instantáneas, SEO técnico impecable y escalabilidad.',
        },
        {
          title: 'Procesamiento en cliente y herramientas WebAssembly (WASM)',
          description: 'Utilidades multimedia, PDF y datos sin servidor que funcionan con privacidad total en el navegador.',
        },
        {
          title: 'Diseño UI/UX y páginas de aterrizaje de alta conversión',
          description: 'Interfaces minimalistas y accesibles creadas para convertir visitas en escritorio y móvil.',
        },
      ],
      ctaHeading: 'Construyamos algo extraordinario juntos.',
      email: 'kisharadilshan007@gmail.com',
      emailLabel: 'Escríbeme directamente: kisharadilshan007@gmail.com',
      copyButtonLabel: 'Copiar Correo',
      copiedButtonLabel: '¡Copiado!',
    },
    studio: {
      dropHeadline: 'Arrastra tu archivo de audio aquí para visualizar',
      dropSubtext: 'Compatible con MP3, WAV, OGG, FLAC y M4A • 100% privado en tu navegador',
      selectAudioBtn: 'Seleccionar Audio',
      trySampleBtn: 'Probar Ritmo Demo',
      changeAudioBtn: 'Cambiar Pista',
      playLabel: 'Reproducir vista previa',
      pauseLabel: 'Pausar vista previa',
      seekLabel: 'Barra de tiempo de audio',
      styleSectionLabel: 'Estilo del Visualizador',
      styles: {
        bars: 'Barras Espectro',
        radial: 'Anillo Neón Radial',
        wave: 'Onda Espejada',
        particles: 'Pulso de Partículas',
      },
      sensitivityLabel: 'Sensibilidad al Ritmo',
      aspectSectionLabel: 'Relación de Aspecto',
      aspects: {
        landscape: '16:9 YouTube',
        portrait: '9:16 Shorts / TikTok',
        square: '1:1 Cuadrado',
      },
      customSectionLabel: 'Personalización Visual',
      themeSwatchesLabel: 'Paletas de Color',
      accentColorLabel: 'Color Espectro',
      bgColorLabel: 'Color Fondo',
      coverArtLabel: 'Portada / Fondo',
      uploadCoverBtn: 'Subir Imagen',
      clearCoverBtn: 'Quitar',
      songTitleLabel: 'Título de la Canción',
      songTitlePlaceholder: 'ej. Horizonte Nocturno',
      artistNameLabel: 'Nombre del Artista',
      artistNamePlaceholder: 'ej. Nova Pulse',
      exportMp4Btn: 'Descargar Vídeo (MP4)',
      cancelExportBtn: 'Cancelar',
      exportingLabel: 'Renderizando Vídeo',
      statusIdle: 'Estudio listo. Selecciona un archivo de audio o prueba el ritmo demo.',
      statusSampleLoaded: 'Ritmo de muestra cargado a 60 fotogramas por segundo.',
      statusAudioLoaded: 'Pista cargada:',
      statusExportStart: 'Iniciando exportación local de vídeo...',
      statusExportProgress: 'Renderizando vídeo sincronizado:',
      statusExportComplete: '¡Vídeo completado! La descarga ha comenzado.',
      statusExportCancelled: 'Exportación cancelada.',
      statusExportError: 'Error durante la exportación:',
      privacyBadge: 'Sin Subidas • Sin Marca de Agua',
      sampleTrackTitle: 'Pulso Índigo Eléctrico',
      sampleTrackArtist: 'MP3Viz Studio Loop',
    },
  },

  pt: {
    nav: {
      home: 'Início',
      howToUse: 'Como Usar',
      hireMe: 'Contrate-me',
      languageLabel: 'Selecionar idioma',
      themeToggleLabel: 'Alternar tema claro e escuro',
      installApp: 'Adicionar à Tela',
      installAppAria: 'Instalar aplicativo offline MP3Viz na tela inicial',
      iosInstallTitle: 'Instalar MP3Viz Offline',
      iosInstallBody: 'No Safari ou navegador sem aviso direto, toque em Compartilhar ou no menu e escolha "Adicionar à Tela de Início" para usar o MP3Viz offline.',
      installedToast: 'MP3Viz pronto para uso offline.',
      closeLabel: 'Fechar janela',
      supportDev: 'Apoiar o Criador',
      supportDevAria: 'Apoiar o desenvolvedor no Gumroad',
      githubAria: 'Ver código-fonte no GitHub',
      breadcrumbAria: 'Navegação estrutural',
    },
    footer: {
      tagline: 'Visualizador musical reativo à batida e criador de vídeos MP4 sem marca d’água.',
      privacyNote: '100% Privado — Decodificação de áudio e gravação de vídeo rodam no seu navegador.',
      copyright: '© 2026 Kishara Dilshan. Licenciado sob MIT.',
    },
    home: {
      title: 'Visualizador MP3 Online - Crie Vídeos de Música Grátis',
      description: 'Transforme músicas MP3, WAV e M4A em vídeos reativos à batida direto no navegador. Exporte MP4 em 16:9 ou 9:16 grátis e sem marca d’água.',
      h1: 'Visualizador MP3 — Transforme Áudio em Vídeos no Ritmo Online',
      heroSubtitle: 'Solte uma faixa MP3, WAV, OGG ou M4A para gerar visuais sincronizados com a batida e baixar um vídeo MP4 pronto para redes sociais—grátis e sem uploads.',
      faqHeading: 'Perguntas Frequentes',
      faqIntro: 'Tudo o que você precisa saber para transformar suas faixas em vídeos musicais no navegador.',
      faqs: [
        {
          question: 'Como o MP3Viz sincroniza o visual com a batida da minha música?',
          answer: 'O MP3Viz analisa seu áudio em tempo real usando a Web Audio API com FFT de 2048 pontos. Ele isola graves e bumbos para impulsionar o pulso visual enquanto desenha médios e agudos a 60 quadros por segundo.',
        },
        {
          question: 'Posso baixar o vídeo do visualizador sem marca d’água?',
          answer: 'Sim. Todos os vídeos exportados são 100% gratuitos e livres de marcas d’água. Clique em "Baixar Vídeo (MP4)" para gerar vídeo H.264 com áudio AAC localmente via WebCodecs e mp4-muxer.',
        },
        {
          question: 'Meus arquivos de áudio ou capas são enviados para algum servidor?',
          answer: 'Jamais. Suas músicas inéditas, podcasts e artes de capa permanecem apenas no seu dispositivo. Toda a decodificação e exportação acontece localmente no navegador.',
        },
        {
          question: 'Quais formatos de áudio e proporções de vídeo são aceitos?',
          answer: 'Você pode abrir arquivos MP3, WAV, OGG, FLAC e M4A. Exporte em 16:9 para YouTube, 9:16 vertical para TikTok, Reels e Shorts, ou 1:1 quadrado para feeds sociais.',
        },
      ],
    },
    howToUse: {
      title: 'Como Criar um Vídeo Visualizador MP3 Reativo à Batida',
      description: 'Passo a passo para converter faixas MP3, WAV e M4A em vídeos de espectro sincronizados, ajustar formato 16:9 ou 9:16, capa e baixar MP4.',
      breadcrumbCurrent: 'Como Usar',
      h1: 'Como Criar e Baixar um Visualizador MP3 Reativo à Batida',
      intro: 'Converta qualquer música, beat ou trecho de podcast em um vídeo dinâmico em quatro passos simples, direto no navegador.',
      steps: [
        {
          title: 'Carregue sua Música ou Batida de Exemplo',
          body: 'Arraste um arquivo MP3, WAV, OGG, FLAC ou M4A para o estúdio na página inicial, clique em "Selecionar Áudio" ou teste imediatamente com o botão de batida demo.',
        },
        {
          title: 'Escolha o Estilo Visual e a Proporção',
          body: 'Alterne entre Barras de Espectro, Anel Neon Radial, Onda Espelhada e Pulso de Partículas. Selecione 16:9 para YouTube, 9:16 para Shorts/TikTok ou 1:1 quadrado.',
        },
        {
          title: 'Personalize Cores, Arte de Capa e Títulos',
          body: 'Aplique paletas prontas ou cores personalizadas, envie uma capa que pulsa suavemente nos graves e adicione o título da faixa e nome do artista.',
        },
        {
          title: 'Exporte seu Vídeo MP4 sem Marca d’Água',
          body: 'Clique em "Baixar Vídeo (MP4)" para renderizar localmente com WebCodecs ou MediaRecorder, acompanhe a barra até 100% e salve seu arquivo MP4.',
        },
      ],
      tipsHeading: 'Dicas Rápidas para Criadores',
      tips: [
        {
          title: 'Defina o Formato Antes de Exportar',
          body: 'Use 16:9 para vídeos horizontais no YouTube e 9:16 vertical para TikTok, Reels e Shorts.',
        },
        {
          title: 'Calibre a Sensibilidade dos Graves',
          body: 'Músicas acústicas funcionam bem entre 1.3× e 1.6×; batidas eletrônicas e hip-hop ficam precisas perto de 1.0×.',
        },
        {
          title: 'Funciona 100% Offline como App',
          body: 'Use "Adicionar à Tela" no topo para instalar o estúdio e criar vídeos mesmo sem conexão.',
        },
      ],
      ctaText: 'Pronto para transformar sua faixa em vídeo?',
      ctaButton: 'Abrir Estúdio Visualizador',
    },
    hireMe: {
      title: 'Contrate Kishara Dilshan - Dev Astro, React & WebMedia',
      description: 'Precisa de um web app ultrarrápido em Astro, React ou Next.js ou ferramenta WebAssembly? Contrate Kishara Dilshan para soluções sob medida.',
      breadcrumbCurrent: 'Contrate-me',
      badge: 'Disponível para Projetos Freelance',
      heading: 'Precisa de uma Solução de TI Sob Medida?',
      intro: 'Olá, sou Kishara Dilshan, o desenvolvedor por trás do MP3Viz.',
      subcopy: 'Se você gostou desta ferramenta rápida no navegador e precisa de uma solução digital de alto nível para sua empresa, estou disponível para projetos freelance. Sou especialista em:',
      specialtiesHeading: 'Especialidades Principais',
      specialties: [
        {
          title: 'Aplicações web ultrarrápidas e otimizadas para SEO',
          description: 'Astro, React e Next.js — projetados para carregamento instantâneo, SEO técnico e escalabilidade.',
        },
        {
          title: 'Processamento client-side e ferramentas WebAssembly (WASM)',
          description: 'Utilitários de mídia, PDF e dados sem servidor que rodam com total privacidade no navegador.',
        },
        {
          title: 'Design UI/UX e landing pages de alta conversão',
          description: 'Interfaces minimalistas e acessíveis criadas para converter visitantes no desktop e celular.',
        },
      ],
      ctaHeading: 'Vamos construir algo incrível juntos.',
      email: 'kisharadilshan007@gmail.com',
      emailLabel: 'Envie um e-mail direto: kisharadilshan007@gmail.com',
      copyButtonLabel: 'Copiar E-mail',
      copiedButtonLabel: 'Copiado!',
    },
    studio: {
      dropHeadline: 'Solte sua música aqui para iniciar a visualização',
      dropSubtext: 'Aceita MP3, WAV, OGG, FLAC e M4A • Processado 100% no seu navegador',
      selectAudioBtn: 'Selecionar Áudio',
      trySampleBtn: 'Testar Batida Demo',
      changeAudioBtn: 'Trocar Música',
      playLabel: 'Reproduzir prévia de áudio',
      pauseLabel: 'Pausar prévia de áudio',
      seekLabel: 'Linha do tempo do áudio',
      styleSectionLabel: 'Estilo do Visualizador',
      styles: {
        bars: 'Barras de Espectro',
        radial: 'Anel Neon Radial',
        wave: 'Onda Espelhada',
        particles: 'Pulso de Partículas',
      },
      sensitivityLabel: 'Sensibilidade da Batida',
      aspectSectionLabel: 'Proporção do Vídeo',
      aspects: {
        landscape: '16:9 YouTube',
        portrait: '9:16 Shorts / TikTok',
        square: '1:1 Quadrado',
      },
      customSectionLabel: 'Personalização Visual',
      themeSwatchesLabel: 'Temas de Cor',
      accentColorLabel: 'Cor do Espectro',
      bgColorLabel: 'Cor do Fundo',
      coverArtLabel: 'Capa / Imagem de Fundo',
      uploadCoverBtn: 'Enviar Imagem',
      clearCoverBtn: 'Remover',
      songTitleLabel: 'Título da Música',
      songTitlePlaceholder: 'ex. Horizonte Noturno',
      artistNameLabel: 'Nome do Artista',
      artistNamePlaceholder: 'ex. Nova Pulse',
      exportMp4Btn: 'Baixar Vídeo (MP4)',
      cancelExportBtn: 'Cancelar',
      exportingLabel: 'Renderizando Vídeo',
      statusIdle: 'Estúdio pronto. Selecione um arquivo de áudio ou teste a batida demo.',
      statusSampleLoaded: 'Batida demo carregada a 60 quadros por segundo.',
      statusAudioLoaded: 'Faixa carregada:',
      statusExportStart: 'Iniciando exportação local de vídeo...',
      statusExportProgress: 'Renderizando vídeo sincronizado:',
      statusExportComplete: 'Exportação concluída! Seu download foi iniciado.',
      statusExportCancelled: 'Exportação cancelada.',
      statusExportError: 'Erro ao exportar vídeo:',
      privacyBadge: 'Zero Uploads • Sem Marca d’Água',
      sampleTrackTitle: 'Pulso Índigo Elétrico',
      sampleTrackArtist: 'MP3Viz Studio Loop',
    },
  },

  de: {
    nav: {
      home: 'Startseite',
      howToUse: 'Anleitung',
      hireMe: 'Kontakt',
      languageLabel: 'Sprache auswählen',
      themeToggleLabel: 'Zwischen hellem und dunklem Modus wechseln',
      installApp: 'Zum Startbildschirm',
      installAppAria: 'MP3Viz als Offline-App installieren',
      iosInstallTitle: 'MP3Viz Offline installieren',
      iosInstallBody: 'Tippen Sie in Safari oder Ihrem Browsermenü auf Teilen und wählen Sie „Zum Home-Bildschirm“, um MP3Viz komplett offline zu nutzen.',
      installedToast: 'MP3Viz ist offline einsatzbereit.',
      closeLabel: 'Dialog schließen',
      supportDev: 'Entwickler unterstützen',
      supportDevAria: 'Entwickler auf Gumroad unterstützen',
      githubAria: 'Quellcode auf GitHub ansehen',
      breadcrumbAria: 'Brotkrümelnavigation',
    },
    footer: {
      tagline: 'Beat-reaktiver Musik-Visualizer und wasserzeichenfreier MP4-Video-Generator.',
      privacyNote: '100% Privat — Audio-Analyse und Video-Export laufen lokal in Ihrem Browser.',
      copyright: '© 2026 Kishara Dilshan. Veröffentlicht unter MIT-Lizenz.',
    },
    home: {
      title: 'MP3 Visualizer Online - Musik-Videos Kostenlos Macher',
      description: 'Verwandeln Sie MP3-, WAV- und M4A-Songs direkt im Browser in beat-reaktive Musik-Visualizer-Videos. 16:9 oder 9:16 MP4 ohne Wasserzeichen.',
      h1: 'MP3 Visualizer — Audio Online in Beat-Reaktive Videos Verwandeln',
      heroSubtitle: 'Ziehen Sie eine MP3-, WAV-, OGG- oder M4A-Datei hinein, erzeugen Sie flüssige Beat-Visuals und laden Sie ein fertiges MP4-Video herunter — kostenlos und ohne Upload.',
      faqHeading: 'Häufig gestellte Fragen',
      faqIntro: 'Wichtige Antworten rund um Beat-Erkennung, Datenschutz und den lokalen MP4-Export im Browser.',
      faqs: [
        {
          question: 'Wie synchronisiert MP3Viz die Grafiken mit dem Beat meines Songs?',
          answer: 'MP3Viz analysiert Ihr Audiosignal in Echtzeit über die Web Audio API mittels 2048-Punkt-FFT. Kick- und Subbass-Frequenzen steuern den Beat-Impuls, während Mitten und Höhen mit flüssigen 60 fps dargestellt werden.',
        },
        {
          question: 'Kann ich das Musik-Visualizer-Video ohne Wasserzeichen herunterladen?',
          answer: 'Ja. Jedes erstellte Video ist komplett kostenlos und frei von Wasserzeichen. Über „Video herunterladen (MP4)“ kodiert Ihr Browser H.264-Video und AAC-Audio direkt lokal per WebCodecs und mp4-muxer.',
        },
        {
          question: 'Werden meine Audiodateien oder Coverbilder auf einen Server hochgeladen?',
          answer: 'Nein, niemals. Unveröffentlichte Songs, Podcasts und Cover-Grafiken verlassen Ihr Gerät nicht. Dekodierung, Vorschau und MP4-Erstellung erfolgen vollständig im Arbeitsspeicher Ihres Browsers.',
        },
        {
          question: 'Welche Audioformate und Video-Seitenverhältnisse werden unterstützt?',
          answer: 'Unterstützt werden MP3, WAV, OGG, FLAC und M4A. Für den Export stehen 16:9 Querformat für YouTube, 9:16 Hochformat für TikTok, Reels und Shorts sowie 1:1 Quadrat zur Auswahl.',
        },
      ],
    },
    howToUse: {
      title: 'Beat-Reaktives MP3-Visualizer-Video Online Erstellen',
      description: 'Schritt-für-Schritt-Anleitung: MP3-, WAV- und M4A-Tracks in Beat-Spektrum-Videos verwandeln, Cover und 16:9/9:16 wählen und MP4 speichern.',
      breadcrumbCurrent: 'Anleitung',
      h1: 'So Erstellen und Laden Sie ein Beat-Reaktives Visualizer-Video Herunter',
      intro: 'Verwandeln Sie jeden Song, Beat oder Podcast-Ausschnitt in vier klaren Schritten direkt im Browser in ein ausdrucksstarkes Musikvideo.',
      steps: [
        {
          title: 'Audiodatei oder Beispiel-Beat Laden',
          body: 'Ziehen Sie eine MP3-, WAV-, OGG-, FLAC- oder M4A-Datei auf die Studiofläche, klicken Sie auf „Audiodatei wählen“ oder starten Sie sofort mit dem integrierten Beispiel-Beat.',
        },
        {
          title: 'Visualizer-Stil und Format Auswählen',
          body: 'Wählen Sie zwischen Balken-Spektrum, Radialem Neonring, Gespiegelter Welle oder Partikel-Puls sowie 16:9 YouTube, 9:16 Shorts/TikTok oder 1:1 Quadrat.',
        },
        {
          title: 'Farben, Cover-Art und Songtitel Anpassen',
          body: 'Nutzen Sie harmonische Farbschemata oder eigene Farben, laden Sie ein optionales Coverbild mit sanftem Bass-Zoom hoch und ergänzen Sie Songtitel sowie Künstlernamen.',
        },
        {
          title: 'Wasserzeichenfreies MP4-Video Exportieren',
          body: 'Klicken Sie auf „Video herunterladen (MP4)“, verfolgen Sie den Fortschrittsbalken von 0 bis 100 % und speichern Sie Ihr fertiges Video lokal auf Ihrem Gerät.',
        },
      ],
      tipsHeading: 'Praxistipps für Beste Videoqualität',
      tips: [
        {
          title: 'Seitenverhältnis Vorab Festlegen',
          body: '16:9 eignet sich ideal für klassische YouTube-Videos, 9:16 für TikTok, Instagram Reels und Shorts.',
        },
        {
          title: 'Beat-Empfindlichkeit Feinjustieren',
          body: 'Ruhige Akustikstücke profitieren von 1.3×–1.6×, druckvolle Club- und Hip-Hop-Tracks von etwa 1.0×.',
        },
        {
          title: 'Komplett Offline als App Nutzen',
          body: 'Über „Zum Startbildschirm“ lässt sich MP3Viz als Offline-PWA installieren und überall ohne Netz nutzen.',
        },
      ],
      ctaText: 'Bereit, Ihren Song als Video zu exportieren?',
      ctaButton: 'Visualizer-Studio Öffnen',
    },
    hireMe: {
      title: 'Kishara Dilshan Beauftragen - Astro & React Entwickler',
      description: 'Schnelle Astro-, React- oder Next.js-Web-Apps und Browser-WebAssembly-Tools gesucht? Beauftragen Sie Kishara Dilshan für moderne IT-Lösungen.',
      breadcrumbCurrent: 'Kontakt',
      badge: 'Verfügbar für Freelance-Projekte',
      heading: 'Individuelle IT-Lösung gesucht?',
      intro: 'Hallo, ich bin Kishara Dilshan, der Entwickler hinter MP3Viz.',
      subcopy: 'Wenn Ihnen dieses schnelle Client-Side-Tool gefällt und Sie eine erstklassige Web- oder Softwarelösung für Ihr Unternehmen benötigen, stehe ich für Freelance-Projekte bereit. Meine Schwerpunkte:',
      specialtiesHeading: 'Technische Kernkompetenzen',
      specialties: [
        {
          title: 'Ultraschnelle, SEO-optimierte Webanwendungen',
          description: 'Astro, React, Next.js — entwickelt für Ladezeiten unter einer Sekunde, technisches SEO und Skalierbarkeit.',
        },
        {
          title: 'Client-seitige Verarbeitung & WebAssembly (WASM)',
          description: 'Serverlose Medien-, PDF- und Datenwerkzeuge, die vollständig privat im Browser laufen.',
        },
        {
          title: 'UI/UX-Design & konversionsstarke Landingpages',
          description: 'Minimalistische, barrierefreie Oberflächen für Desktop und Mobilgeräte.',
        },
      ],
      ctaHeading: 'Lassen Sie uns gemeinsam Großartiges entwickeln.',
      email: 'kisharadilshan007@gmail.com',
      emailLabel: 'Schreiben Sie mir direkt: kisharadilshan007@gmail.com',
      copyButtonLabel: 'E-Mail Kopieren',
      copiedButtonLabel: 'Kopiert!',
    },
    studio: {
      dropHeadline: 'Audiodatei hier ablegen, um die Visualisierung zu starten',
      dropSubtext: 'Unterstützt MP3, WAV, OGG, FLAC & M4A • 100% lokal im Browser verarbeitet',
      selectAudioBtn: 'Audiodatei Wählen',
      trySampleBtn: 'Demo-Beat Testen',
      changeAudioBtn: 'Neuer Track',
      playLabel: 'Audiovorschau abspielen',
      pauseLabel: 'Audiovorschau pausieren',
      seekLabel: 'Audio-Zeitleiste',
      styleSectionLabel: 'Visualizer-Stil',
      styles: {
        bars: 'Balken-Spektrum',
        radial: 'Radialer Neonring',
        wave: 'Gespiegelte Welle',
        particles: 'Partikel-Puls',
      },
      sensitivityLabel: 'Beat-Empfindlichkeit',
      aspectSectionLabel: 'Seitenverhältnis',
      aspects: {
        landscape: '16:9 YouTube',
        portrait: '9:16 Shorts / TikTok',
        square: '1:1 Quadrat',
      },
      customSectionLabel: 'Visuelle Anpassung',
      themeSwatchesLabel: 'Farbvorlagen',
      accentColorLabel: 'Spektrumfarbe',
      bgColorLabel: 'Bühnenfarbe',
      coverArtLabel: 'Cover / Hintergrundbild',
      uploadCoverBtn: 'Bild Laden',
      clearCoverBtn: 'Entfernen',
      songTitleLabel: 'Songtitel-Einblendung',
      songTitlePlaceholder: 'z. B. Midnight Horizon',
      artistNameLabel: 'Künstlername',
      artistNamePlaceholder: 'z. B. Nova Pulse',
      exportMp4Btn: 'Video Herunterladen (MP4)',
      cancelExportBtn: 'Abbrechen',
      exportingLabel: 'Video wird gerendert',
      statusIdle: 'Studio bereit. Wählen Sie eine Audiodatei oder testen Sie den Demo-Beat.',
      statusSampleLoaded: 'Demo-Beat geladen und läuft mit 60 Bildern pro Sekunde.',
      statusAudioLoaded: 'Geladener Track:',
      statusExportStart: 'Lokaler Video-Export im Browser startet...',
      statusExportProgress: 'Beat-synchrones Video wird gerendert:',
      statusExportComplete: 'Video-Export abgeschlossen! Der Download wurde gestartet.',
      statusExportCancelled: 'Video-Export abgebrochen.',
      statusExportError: 'Fehler beim Video-Export:',
      privacyBadge: 'Kein Upload • Kein Wasserzeichen',
      sampleTrackTitle: 'Electric Indigo Pulse',
      sampleTrackArtist: 'MP3Viz Studio Loop',
    },
  },

  fr: {
    nav: {
      home: 'Accueil',
      howToUse: 'Guide',
      hireMe: 'Me Recruter',
      languageLabel: 'Choisir la langue',
      themeToggleLabel: 'Basculer entre le thème clair et sombre',
      installApp: 'Installer l’App',
      installAppAria: 'Installer MP3Viz hors ligne sur l’écran d’accueil',
      iosInstallTitle: 'Installer MP3Viz Hors Ligne',
      iosInstallBody: 'Dans Safari ou votre navigateur, appuyez sur Partager ou le menu puis sélectionnez « Sur l’écran d’accueil » pour utiliser MP3Viz hors connexion.',
      installedToast: 'MP3Viz est prêt pour une utilisation hors ligne.',
      closeLabel: 'Fermer la fenêtre',
      supportDev: 'Soutenir le Créateur',
      supportDevAria: 'Soutenir le développeur sur Gumroad',
      githubAria: 'Voir le code source sur GitHub',
      breadcrumbAria: 'Fil d’Ariane',
    },
    footer: {
      tagline: 'Visualiseur musical réactif au rythme et exportateur vidéo MP4 sans filigrane.',
      privacyNote: '100% Privé — Le décodage audio et le rendu vidéo s’exécutent dans votre navigateur.',
      copyright: '© 2026 Kishara Dilshan. Publié sous licence MIT.',
    },
    home: {
      title: 'Visualiseur MP3 en Ligne - Créer des Vidéos Musicales',
      description: 'Transformez vos titres MP3, WAV et M4A en vidéos musicales réactives au rythme dans le navigateur. Export MP4 16:9 ou 9:16 sans filigrane.',
      h1: 'Visualiseur MP3 — Transformez l’Audio en Vidéos Rythmées en Ligne',
      heroSubtitle: 'Déposez un fichier MP3, WAV, OGG ou M4A pour générer des visuels synchronisés sur le tempo et télécharger une vidéo MP4 prête à partager — gratuit et sans envoi serveur.',
      faqHeading: 'Questions Fréquentes',
      faqIntro: 'Tout savoir sur la détection de rythme et l’exportation vidéo MP4 locale dans votre navigateur.',
      faqs: [
        {
          question: 'Comment MP3Viz synchronise-t-il les visuels sur le rythme de ma chanson ?',
          answer: 'MP3Viz analyse votre piste en temps réel avec la Web Audio API et une FFT de 2048 points. Les basses fréquences pilotent l’impulsion rythmique tandis que les médiums et aigus animent le spectre à 60 images par seconde.',
        },
        {
          question: 'Puis-je télécharger la vidéo du visualiseur sans filigrane ?',
          answer: 'Oui. Chaque vidéo générée est 100 % gratuite et sans aucun filigrane. Cliquez sur « Télécharger la Vidéo (MP4) » pour encoder l’image H.264 et le son AAC directement via WebCodecs et mp4-muxer.',
        },
        {
          question: 'Mes fichiers audio ou pochettes sont-ils envoyés sur un serveur ?',
          answer: 'Jamais. Vos morceaux inédits, podcasts et illustrations restent strictement sur votre appareil. Tout le traitement audio et vidéo se déroule localement en mémoire.',
        },
        {
          question: 'Quels formats audio et formats d’image vidéo sont pris en charge ?',
          answer: 'Vous pouvez importer des fichiers MP3, WAV, OGG, FLAC et M4A, puis choisir entre le format 16:9 pour YouTube, 9:16 vertical pour TikTok, Reels et Shorts, ou 1:1 carré.',
        },
      ],
    },
    howToUse: {
      title: 'Comment Créer une Vidéo Visualiseur MP3 sur le Rythme',
      description: 'Guide étape par étape pour convertir vos pistes MP3, WAV et M4A en vidéos spectrales, régler le format 16:9 ou 9:16 et exporter en MP4.',
      breadcrumbCurrent: 'Guide',
      h1: 'Comment Créer et Télécharger un Visualiseur MP3 Réactif au Rythme',
      intro: 'Convertissez n’importe quelle chanson, instrumentale ou extrait podcast en vidéo musicale fluide en quatre étapes simples depuis votre navigateur.',
      steps: [
        {
          title: 'Importez Votre Piste Audio ou le Rythme Démo',
          body: 'Glissez-déposez un fichier MP3, WAV, OGG, FLAC ou M4A dans le studio, cliquez sur « Choisir un Audio » ou testez immédiatement la boucle rythmique intégrée.',
        },
        {
          title: 'Sélectionnez le Style et le Format Vidéo',
          body: 'Choisissez parmi Spectre en Barres, Anneau Néon Radial, Onde Miroir ou Pulsation de Particules, puis sélectionnez 16:9 YouTube, 9:16 Shorts/TikTok ou 1:1 Carré.',
        },
        {
          title: 'Personnalisez Couleurs, Pochette et Titres',
          body: 'Appliquez une palette studio ou vos propres couleurs, ajoutez une pochette qui pulse avec les basses et renseignez le titre du morceau et l’artiste.',
        },
        {
          title: 'Exportez Votre Vidéo MP4 Sans Filigrane',
          body: 'Cliquez sur « Télécharger la Vidéo (MP4) » pour lancer l’encodage local WebCodecs ou MediaRecorder et enregistrer votre fichier une fois à 100 %.',
        },
      ],
      tipsHeading: 'Astuces pour des Vidéos Impeccables',
      tips: [
        {
          title: 'Choisissez le Ratio Avant l’Export',
          body: 'Privilégiez 16:9 pour YouTube classique et 9:16 vertical pour TikTok, Reels et YouTube Shorts.',
        },
        {
          title: 'Ajustez la Sensibilité aux Basses',
          body: 'Les morceaux acoustiques ressortent mieux vers 1.3×–1.6×, tandis que l’électro et le hip-hop restent nets autour de 1.0×.',
        },
        {
          title: 'Travaillez Hors Connexion en PWA',
          body: 'Cliquez sur « Installer l’App » dans la barre supérieure pour créer vos vidéos même sans accès internet.',
        },
      ],
      ctaText: 'Prêt à donner vie à votre morceau en vidéo ?',
      ctaButton: 'Ouvrir le Studio Visualiseur',
    },
    hireMe: {
      title: 'Recruter Kishara Dilshan - Dév Astro, React & WebMedia',
      description: 'Besoin d’une application web ultra-rapide Astro, React ou Next.js ou d’un outil WebAssembly ? Contactez Kishara Dilshan pour vos projets.',
      breadcrumbCurrent: 'Me Recruter',
      badge: 'Disponible pour Missions Freelance',
      heading: 'Besoin d’une Solution Web sur Mesure ?',
      intro: 'Bonjour, je suis Kishara Dilshan, le développeur derrière MP3Viz.',
      subcopy: 'Si vous appréciez la rapidité de cet outil côté client et cherchez une solution numérique haut de gamme pour votre entreprise, je suis disponible en freelance. Mes spécialités :',
      specialtiesHeading: 'Domaines d’Expertise',
      specialties: [
        {
          title: 'Applications web ultra-rapides optimisées pour le SEO',
          description: 'Astro, React, Next.js — conçus pour un chargement instantané, un SEO technique propre et une grande évolutivité.',
        },
        {
          title: 'Traitement côté client & outils WebAssembly (WASM)',
          description: 'Outils média, PDF et données sans serveur fonctionnant en toute confidentialité dans le navigateur.',
        },
        {
          title: 'Design UI/UX & pages d’atterrissage à forte conversion',
          description: 'Interfaces épurées et accessibles pensées pour convertir sur ordinateur comme sur mobile.',
        },
      ],
      ctaHeading: 'Construisons ensemble un projet remarquable.',
      email: 'kisharadilshan007@gmail.com',
      emailLabel: 'Écrivez-moi directement : kisharadilshan007@gmail.com',
      copyButtonLabel: 'Copier l’E-mail',
      copiedButtonLabel: 'Copié !',
    },
    studio: {
      dropHeadline: 'Déposez votre piste audio ici pour lancer le visualiseur',
      dropSubtext: 'Compatible MP3, WAV, OGG, FLAC & M4A • Traitement 100 % local dans le navigateur',
      selectAudioBtn: 'Choisir un Audio',
      trySampleBtn: 'Essayer le Rythme Démo',
      changeAudioBtn: 'Changer de Piste',
      playLabel: 'Lire l’aperçu audio',
      pauseLabel: 'Mettre en pause l’aperçu',
      seekLabel: 'Curseur temporel audio',
      styleSectionLabel: 'Style du Visualiseur',
      styles: {
        bars: 'Spectre en Barres',
        radial: 'Anneau Néon Radial',
        wave: 'Onde Miroir',
        particles: 'Pulsation Particules',
      },
      sensitivityLabel: 'Sensibilité au Rythme',
      aspectSectionLabel: 'Format de la Vidéo',
      aspects: {
        landscape: '16:9 YouTube',
        portrait: '9:16 Shorts / TikTok',
        square: '1:1 Carré',
      },
      customSectionLabel: 'Personnalisation Visuelle',
      themeSwatchesLabel: 'Thèmes Couleur',
      accentColorLabel: 'Couleur Spectre',
      bgColorLabel: 'Couleur Scène',
      coverArtLabel: 'Pochette / Fond',
      uploadCoverBtn: 'Importer Image',
      clearCoverBtn: 'Retirer',
      songTitleLabel: 'Titre du Morceau',
      songTitlePlaceholder: 'ex. Horizon de Minuit',
      artistNameLabel: 'Nom de l’Artiste',
      artistNamePlaceholder: 'ex. Nova Pulse',
      exportMp4Btn: 'Télécharger la Vidéo (MP4)',
      cancelExportBtn: 'Annuler',
      exportingLabel: 'Rendu Vidéo en Cours',
      statusIdle: 'Studio prêt. Choisissez un fichier audio ou essayez le rythme démo.',
      statusSampleLoaded: 'Rythme démo chargé à 60 images par seconde.',
      statusAudioLoaded: 'Piste chargée :',
      statusExportStart: 'Démarrage de l’exportation vidéo locale...',
      statusExportProgress: 'Rendu de la vidéo synchronisée :',
      statusExportComplete: 'Export terminé ! Votre téléchargement a commencé.',
      statusExportCancelled: 'Export vidéo annulé.',
      statusExportError: 'Erreur lors de l’export vidéo :',
      privacyBadge: 'Zéro Upload • Sans Filigrane',
      sampleTrackTitle: 'Pulsation Indigo Électrique',
      sampleTrackArtist: 'MP3Viz Studio Loop',
    },
  },

  ja: {
    nav: {
      home: 'ホーム',
      howToUse: '使い方',
      hireMe: '制作依頼',
      languageLabel: '言語を選択',
      themeToggleLabel: 'ライトモードとダークモードを切り替え',
      installApp: 'ホーム画面に追加',
      installAppAria: 'MP3Vizオフラインアプリをホーム画面にインストール',
      iosInstallTitle: 'MP3Vizをオフラインアプリとして追加',
      iosInstallBody: 'Safariやブラウザの共有メニューから「ホーム画面に追加」を選択すると、オフライン環境でもMP3Vizの全機能を利用できます。',
      installedToast: 'MP3Vizのオフライン利用準備が完了しました。',
      closeLabel: '閉じる',
      supportDev: '開発者を応援',
      supportDevAria: 'Gumroadで開発者をサポートする',
      githubAria: 'GitHubでソースコードを見る',
      breadcrumbAria: 'パンくずリスト',
    },
    footer: {
      tagline: 'ブラウザ完結のビート連動オーディオビジュアライザー＆透かしなしMP4動画作成スタジオ。',
      privacyNote: '100%プライベート処理 — 音声解析とMP4動画書き出しはすべてお使いのブラウザ内で完結します。',
      copyright: '© 2026 Kishara Dilshan. MITライセンスのもとで公開。',
    },
    home: {
      title: 'オンラインMP3ビジュアライザー｜無料で音楽スペクトラム動画作成・透かしなしMP4保存｜MP3Viz',
      description: 'MP3・WAV・OGG・M4A音源をブラウザ上でビート連動の音楽ビジュアライザー動画に変換。YouTube向け16:9やTikTok・Shorts向け9:16のMP4動画を完全無料・透かしなし・サーバー送信ゼロで安全に書き出せます。ソフトのインストールも不要ですぐ使えます。',
      h1: 'MP3ビジュアライザー — 音声をビート連動の音楽動画にオンライン変換',
      heroSubtitle: 'MP3・WAV・OGG・M4Aトラックをドロップするだけで滑らかなビート同期ビジュアルを生成し、共有用MP4動画を無料・透かしなし・アップロード不要でダウンロードできます。',
      faqHeading: 'よくある質問（FAQ）',
      faqIntro: 'ブラウザ完結のビート検出とMP4動画書き出しに関する主なご質問にお答えします。',
      faqs: [
        {
          question: 'MP3Vizはどのように曲のビートと映像を同期させていますか？',
          answer: 'ブラウザ標準のWeb Audio API（2048ポイントFFT解析）で音声をリアルタイム解析しています。キックやサブベースの低域エネルギーを検出して脈動エフェクトを駆動し、中域・高域を60fpsの滑らかなスペクトラムや波形に描画します。',
        },
        {
          question: '透かし（ウォーターマーク）なしで音楽ビジュアライザー動画を保存できますか？',
          answer: 'はい、完全無料・透かしなしで保存できます。「動画をダウンロード (MP4)」を押すと、WebCodecsとmp4-muxerによりH.264映像＋AAC音声のMP4動画をブラウザ内で直接生成します（非対応環境ではMediaRecorderへ自動切替）。',
        },
        {
          question: '音声ファイルやカバー画像が外部サーバーにアップロードされることはありますか？',
          answer: '一切ありません。未公開の楽曲やポッドキャスト音声、ジャケット画像はすべてご自身の端末内だけで処理され、外部サーバーへ送信されることはありません。',
        },
        {
          question: '対応している音声フォーマットと動画アスペクト比を教えてください。',
          answer: 'MP3、WAV、OGG、FLAC、M4A形式に対応しています。動画サイズはYouTube用の16:9横長、TikTok・Reels・YouTubeショート用の9:16縦長、SNS投稿用の1:1正方形をワンクリックで切り替え可能です。',
        },
      ],
    },
    howToUse: {
      title: 'ビート連動MP3ビジュアライザー動画の作り方｜無料オンラインMP4動画書き出し手順ガイド｜MP3Viz',
      description: 'MP3・WAV・M4A楽曲からビート同期のオーディオスペクトラム動画を作成する手順を分かりやすく解説。16:9 YouTubeや9:16 Shorts/TikTok比率の選択、ジャケット画像や曲名テキストの追加、無料MP4動画ダウンロードまでブラウザだけで完結します。',
      breadcrumbCurrent: '使い方',
      h1: 'ビート連動MP3ビジュアライザー動画の作成・ダウンロード手順',
      intro: 'インストール不要で、お手持ちの楽曲やビート音源を4つのステップで美しい音楽動画に仕上げられます。',
      steps: [
        {
          title: '音声ファイルまたはサンプルビートを読み込む',
          body: 'トップページのスタジオ枠にMP3・WAV・OGG・FLAC・M4Aファイルをドロップするか、「音声ファイルを選択」または「サンプルビートを試す」をクリックします。',
        },
        {
          title: 'ビジュアライザースタイルと画面比率を選ぶ',
          body: 'バー・スペクトラム、ラジアル・ネオンリング、ミラーウェーブ、パーティクル・ビートパルスの4種類から選択し、16:9・9:16・1:1の比率とビート感度を調整します。',
        },
        {
          title: 'カラー・カバー画像・曲名テキストをカスタマイズ',
          body: 'プリセット配色や自由なカラーピッカーを設定し、低音に合わせて心地よくズームするジャケット画像や曲名・アーティスト名オーバーレイを追加します。',
        },
        {
          title: '透かしなしのMP4動画を書き出して保存',
          body: '「動画をダウンロード (MP4)」をクリックするとブラウザ内で高速レンダリングが始まります。進捗バーが100%になったら完成動画が端末に保存されます。',
        },
      ],
      tipsHeading: 'きれいに仕上げるためのポイント',
      tips: [
        {
          title: '投稿先に合わせた比率を先に選択',
          body: 'YouTube本編には16:9横画面、ショート動画・TikTok・Reelsには9:16縦画面を選ぶと余白なく表示されます。',
        },
        {
          title: 'ジャンルに応じたビート感度調整',
          body: 'アコースティック楽曲は1.3×〜1.6×、EDMやヒップホップなど低音が強い音源は0.9×〜1.1×が最適です。',
        },
        {
          title: 'PWA登録で完全オフライン動作',
          body: '上部の「ホーム画面に追加」から登録すると、ネット接続がない制作環境でも動画を書き出せます。',
        },
      ],
      ctaText: 'あなたの楽曲でビート連動動画を作ってみましょう。',
      ctaButton: 'ビジュアライザースタジオを開く',
    },
    hireMe: {
      title: 'Kishara Dilshanへの開発依頼｜Astro・React・Webメディア開発｜MP3Viz',
      description: '超高速なAstro・React・Next.jsウェブアプリ開発や、ブラウザ完結のWebAssemblyメディア処理ツール制作をお探しですか？SEO設計とUI/UXに強いKishara Dilshanへフリーランス開発をご相談ください。迅速かつ高品質なITソリューションを提供します。',
      breadcrumbCurrent: '制作依頼',
      badge: 'フリーランス案件のご相談を受付中',
      heading: 'カスタムITソリューションをお探しですか？',
      intro: 'こんにちは、MP3Vizを開発したKishara Dilshanです。',
      subcopy: 'この高速なクライアントサイドツールを気に入っていただけたなら、貴社ビジネス向けのウェブ・システム開発もぜひお任せください。以下の専門領域でフリーランス案件を承っています：',
      specialtiesHeading: '主な専門分野',
      specialties: [
        {
          title: '超高速・SEO最適化ウェブアプリケーション開発',
          description: 'Astro、React、Next.jsを活用し、1秒未満の高速表示とテクニカルSEO、高い拡張性を実現します。',
        },
        {
          title: 'クライアントサイド処理＆WebAssembly (WASM) ツール',
          description: 'サーバー不要でブラウザ内にて安全・高速に動作する音声・動画・PDF・データ処理ツールを構築します。',
        },
        {
          title: 'UI/UXデザイン＆高コンバージョンLP制作',
          description: 'PC・モバイル双方で直感的に操作でき、アクセシビリティに配慮した洗練されたUIを設計します。',
        },
      ],
      ctaHeading: '素晴らしいプロダクトを一緒に作り上げましょう。',
      email: 'kisharadilshan007@gmail.com',
      emailLabel: '直接メールを送る: kisharadilshan007@gmail.com',
      copyButtonLabel: 'メールをコピー',
      copiedButtonLabel: 'コピー完了！',
    },
    studio: {
      dropHeadline: 'ここに音声ファイルをドロップしてビジュアライズ開始',
      dropSubtext: 'MP3・WAV・OGG・FLAC・M4A対応 • ブラウザ内で100%ローカル処理',
      selectAudioBtn: '音声ファイルを選択',
      trySampleBtn: 'サンプルビートを試す',
      changeAudioBtn: '別の曲を読み込む',
      playLabel: 'プレビューを再生',
      pauseLabel: 'プレビューを一時停止',
      seekLabel: '再生位置シークバー',
      styleSectionLabel: 'ビジュアライザースタイル',
      styles: {
        bars: 'バースペクトラム',
        radial: 'ラジアルネオンリング',
        wave: 'ミラーウェーブ',
        particles: 'パーティクルパルス',
      },
      sensitivityLabel: 'ビート感度',
      aspectSectionLabel: '動画アスペクト比',
      aspects: {
        landscape: '16:9 YouTube',
        portrait: '9:16 Shorts / TikTok',
        square: '1:1 スクエア',
      },
      customSectionLabel: 'ビジュアルカスタマイズ',
      themeSwatchesLabel: 'カラープリセット',
      accentColorLabel: 'スペクトラム色',
      bgColorLabel: 'ステージ背景色',
      coverArtLabel: 'カバー／背景画像',
      uploadCoverBtn: '画像を選択',
      clearCoverBtn: '削除',
      songTitleLabel: '曲名オーバーレイ',
      songTitlePlaceholder: '例: Midnight Horizon',
      artistNameLabel: 'アーティスト名',
      artistNamePlaceholder: '例: Nova Pulse',
      exportMp4Btn: '動画をダウンロード (MP4)',
      cancelExportBtn: '書き出し中止',
      exportingLabel: '動画をレンダリング中',
      statusIdle: '準備完了。音声ファイルを選択するかサンプルビートをお試しください。',
      statusSampleLoaded: 'サンプルビートを読み込みました（60fpsプレビュー再生中）。',
      statusAudioLoaded: '読み込み完了:',
      statusExportStart: 'ブラウザ内での動画書き出しを開始しています...',
      statusExportProgress: 'ビート同期動画を書き出し中:',
      statusExportComplete: '動画の書き出しが完了し、ダウンロードを開始しました。',
      statusExportCancelled: '動画の書き出しをキャンセルしました。',
      statusExportError: '書き出し中にエラーが発生しました:',
      privacyBadge: 'サーバー送信なし • 透かしなし',
      sampleTrackTitle: 'Electric Indigo Pulse',
      sampleTrackArtist: 'MP3Viz Studio Loop',
    },
  },

  zh: {
    nav: {
      home: '首页',
      howToUse: '使用指南',
      hireMe: '联系合作',
      languageLabel: '选择语言',
      themeToggleLabel: '切换浅色与深色模式',
      installApp: '添加到主屏幕',
      installAppAria: '将 MP3Viz 离线应用安装到主屏幕',
      iosInstallTitle: '离线安装 MP3Viz 应用',
      iosInstallBody: '在 Safari 或浏览器菜单中点击“分享”并选择“添加到主屏幕”，即可在无网络环境下流畅使用 MP3Viz。',
      installedToast: 'MP3Viz 已准备好离线使用。',
      closeLabel: '关闭窗口',
      supportDev: '支持开发者',
      supportDevAria: '在 Gumroad 上支持开发者',
      githubAria: '在 GitHub 查看源代码',
      breadcrumbAria: '面包屑导航',
    },
    footer: {
      tagline: '纯浏览器端运行的节奏律动音乐可视化与无水印 MP4 视频制作工具。',
      privacyNote: '100% 隐私安全 — 音频解码与视频合成完全在您的本地浏览器中完成。',
      copyright: '© 2026 Kishara Dilshan. 基于 MIT 许可证开源发布。',
    },
    home: {
      title: '在线 MP3 音乐可视化频谱视频制作工具 - 免费导出无水印节奏律动高清 MP4 视频 | MP3Viz',
      description: '在浏览器中将 MP3、WAV、OGG 和 M4A 音乐即时转换为节奏律动音频频谱视频。支持一键切换 16:9 YouTube 横屏、9:16 抖音与 TikTok 竖屏及 1:1 方形画幅，基于 WebCodecs 本地高速导出高清 MP4，完全免费、零水印、无需上传服务器。',
      h1: 'MP3 音乐可视化工具 — 在线将音频转换为节奏律动视频',
      heroSubtitle: '拖入 MP3、WAV、OGG 或 M4A 音频，即刻生成丝滑的节拍同步频谱动画，并直接下载高清 MP4 视频——100% 免费、无水印、零服务器上传。',
      faqHeading: '常见问题解答',
      faqIntro: '了解如何在浏览器中安全、免费地制作专业级音乐频谱视频。',
      faqs: [
        {
          question: 'MP3Viz 如何让画面精准跟随音乐节拍律动？',
          answer: 'MP3Viz 使用浏览器原生 Web Audio API 进行 2048 点快速傅里叶变换（FFT）实时频谱分析，精准捕捉底鼓与超低频能量来驱动节拍缩放脉冲，并以 60fps 渲染中高频频谱柱、霓虹圆环、镜像波形与粒子动画。',
        },
        {
          question: '导出的音乐可视化视频真的免费且没有水印吗？',
          answer: '是的，所有导出的视频完全免费且不含任何水印。点击“下载视频 (MP4)”即可通过 WebCodecs 与 mp4-muxer 在浏览器本地编码 H.264 视频与 AAC 音频（旧版浏览器自动切换至 MediaRecorder 方案）。',
        },
        {
          question: '我的音频文件或专辑封面会上传到远程服务器吗？',
          answer: '绝不会。您的原创歌曲、播客片段和封面图片始终保留在您自己的设备中，音频解析与视频合成全部在本地浏览器内存里完成。',
        },
        {
          question: '支持哪些音频格式和视频画幅比例？',
          answer: '支持导入 MP3、WAV、OGG、FLAC 与 M4A 音频；画幅支持一键切换 16:9 横屏（适合 YouTube/B站）、9:16 竖屏（适合 TikTok、Shorts、视频号与抖音）以及 1:1 方形专辑预览。',
        },
      ],
    },
    howToUse: {
      title: '如何在线制作节奏律动 MP3 音乐可视化频谱视频 - 免费无水印高清 MP4 导出教程 | MP3Viz',
      description: '分步详解如何在线将 MP3、WAV、OGG 与 M4A 歌曲转化为节拍同步的动态音乐频谱视频：自由切换 16:9 横屏或 9:16 竖屏比例，自定义专辑封面背景、精选配色主题与歌名歌手字幕，并在浏览器本地快速导出无水印高清 MP4 视频文件，全程无需安装任何桌面剪辑软件。',
      breadcrumbCurrent: '使用指南',
      h1: '如何在线制作并下载节奏律动 MP3 音乐可视化视频',
      intro: '无需安装复杂剪辑软件，只需简单四步即可在浏览器中把任何歌曲或播客片段制作成动感视频。',
      steps: [
        {
          title: '导入本地音频或试听示例节拍',
          body: '将 MP3、WAV、OGG、FLAC 或 M4A 文件拖入首页工作室区域，点击“选择音频文件”，或点击“试听示例节拍”立即体验 60fps 动态效果。',
        },
        {
          title: '选择频谱样式与视频画幅比例',
          body: '在频谱柱、径向霓虹环、镜像声波和粒子节拍脉冲四种预设间自由切换，选择 16:9、9:16 或 1:1 画幅并调节节拍灵敏度滑块。',
        },
        {
          title: '自定义配色、封面图与歌曲标题',
          body: '挑选精选工作室配色或自定义频谱与背景色，上传随重低音轻柔缩放的专辑封面，并填写歌曲名称与艺术家字幕。',
        },
        {
          title: '本地导出无水印高清 MP4 视频',
          body: '点击“下载视频 (MP4)”即可启动本地 WebCodecs 硬件编码合成，等待实时进度条达到 100% 后自动保存到您的电脑或手机。',
        },
      ],
      tipsHeading: '创作者实用技巧',
      tips: [
        {
          title: '导出前先确认平台画幅',
          body: '长视频平台推荐 16:9 横屏高清，短视频与竖屏快拍推荐 9:16 竖屏以避免画面被裁切。',
        },
        {
          title: '按曲风微调节拍灵敏度',
          body: '原声吉他与轻音乐适合 1.3×–1.6× 灵敏度；电子舞曲与说唱伴奏设置在 0.9×–1.1× 更具弹性。',
        },
        {
          title: '安装离线 PWA 随时创作',
          body: '点击顶部导航栏的“添加到主屏幕”，即可将整个可视化工作室缓存到本地离线运行。',
        },
      ],
      ctaText: '准备好把你的音乐变成动感视频了吗？',
      ctaButton: '打开可视化工作室',
    },
    hireMe: {
      title: '聘请全栈开发者 Kishara Dilshan - Astro、React 与音视频前端开发 | MP3Viz',
      description: '正在寻找超快加载速度的 Astro、React 或 Next.js 现代网站应用，或是零服务器隐私安全的浏览器端 WebAssembly 音视频与工具开发？立即联系独立开发者 Kishara Dilshan，为您定制符合技术 SEO 标准的高品质商业软件方案。',
      breadcrumbCurrent: '联系合作',
      badge: '当前可承接自由职业开发项目',
      heading: '需要定制您的专属 IT 解决方案吗？',
      intro: '您好，我是 Kishara Dilshan，MP3Viz 背后的独立开发者。',
      subcopy: '如果您喜欢这款响应迅速的纯前端工具，并希望为您的业务打造世界级的 Web 产品或数字化工具，欢迎与我洽谈项目合作。我专注于以下领域：',
      specialtiesHeading: '核心技术专长',
      specialties: [
        {
          title: '极速加载且深度 SEO 优化的现代 Web 应用',
          description: '基于 Astro、React、Next.js 架构，兼顾亚秒级首屏性能、技术 SEO 规范与清晰的可扩展性。',
        },
        {
          title: '纯前端本地处理与 WebAssembly (WASM) 工具研发',
          description: '无需后端服务器即可在浏览器内私密运行的音视频、PDF 与数据高效处理工具。',
        },
        {
          title: 'UI/UX 交互设计与高转化率品牌落地页',
          description: '极简、无障碍且精致的跨端界面设计，助力桌面端与移动端访客轻松转化。',
        },
      ],
      ctaHeading: '期待与您携手打造出色的产品。',
      email: 'kisharadilshan007@gmail.com',
      emailLabel: '直接发送邮件：kisharadilshan007@gmail.com',
      copyButtonLabel: '复制邮箱',
      copiedButtonLabel: '已复制！',
    },
    studio: {
      dropHeadline: '将音频文件拖放到此处开始可视化创作',
      dropSubtext: '支持 MP3、WAV、OGG、FLAC 与 M4A • 100% 在本地浏览器中私密处理',
      selectAudioBtn: '选择音频文件',
      trySampleBtn: '试听示例节拍',
      changeAudioBtn: '更换音频',
      playLabel: '播放音频预览',
      pauseLabel: '暂停音频预览',
      seekLabel: '音频进度条',
      styleSectionLabel: '可视化样式',
      styles: {
        bars: '动感频谱柱',
        radial: '径向霓虹环',
        wave: '镜像声波线',
        particles: '粒子节拍脉冲',
      },
      sensitivityLabel: '节拍灵敏度',
      aspectSectionLabel: '视频画幅比例',
      aspects: {
        landscape: '16:9 YouTube 横屏',
        portrait: '9:16 Shorts / 竖屏',
        square: '1:1 方形画幅',
      },
      customSectionLabel: '画面视觉定制',
      themeSwatchesLabel: '精选配色',
      accentColorLabel: '频谱主色',
      bgColorLabel: '舞台背景色',
      coverArtLabel: '专辑封面 / 背景图',
      uploadCoverBtn: '上传图片',
      clearCoverBtn: '移除',
      songTitleLabel: '歌曲标题字幕',
      songTitlePlaceholder: '例如：Midnight Horizon',
      artistNameLabel: '歌手 / 创作者名称',
      artistNamePlaceholder: '例如：Nova Pulse',
      exportMp4Btn: '下载视频 (MP4)',
      cancelExportBtn: '取消导出',
      exportingLabel: '正在合成视频',
      statusIdle: '可视化工作室已就绪，请选择本地音频文件或点击试听示例节拍。',
      statusSampleLoaded: '示例节拍已加载，正在以 60fps 实时渲染。',
      statusAudioLoaded: '已加载音频：',
      statusExportStart: '正在启动浏览器本地视频导出...',
      statusExportProgress: '正在渲染节拍同步视频：',
      statusExportComplete: '视频导出完成！浏览器已开始下载文件。',
      statusExportCancelled: '已取消视频导出。',
      statusExportError: '导出视频时遇到问题：',
      privacyBadge: '零服务器上传 • 无水印',
      sampleTrackTitle: 'Electric Indigo Pulse',
      sampleTrackArtist: 'MP3Viz Studio Loop',
    },
  },

  ru: {
    nav: {
      home: 'Главная',
      howToUse: 'Инструкция',
      hireMe: 'Заказать проект',
      languageLabel: 'Выбрать язык',
      themeToggleLabel: 'Переключить светлую и тёмную тему',
      installApp: 'На главный экран',
      installAppAria: 'Установить офлайн-приложение MP3Viz',
      iosInstallTitle: 'Установка MP3Viz офлайн',
      iosInstallBody: 'В Safari или меню браузера нажмите «Поделиться» и выберите «На экран Домой», чтобы создавать видео в MP3Viz без интернета.',
      installedToast: 'MP3Viz готов к работе офлайн.',
      closeLabel: 'Закрыть окно',
      supportDev: 'Поддержать автора',
      supportDevAria: 'Поддержать разработчика на Gumroad',
      githubAria: 'Исходный код на GitHub',
      breadcrumbAria: 'Навигационная цепочка',
    },
    footer: {
      tagline: 'Музыкальный визуализатор в ритм трека и экспорт MP4-видео без водяных знаков.',
      privacyNote: '100% Приватно — обработка звука и рендеринг видео выполняются прямо в браузере.',
      copyright: '© 2026 Kishara Dilshan. Опубликовано под лицензией MIT.',
    },
    home: {
      title: 'MP3 Визуализатор Онлайн — Видео из Музыки Бесплатно',
      description: 'Превращайте треки MP3, WAV и M4A в ритмичные музыкальные видео прямо в браузере. Экспорт MP4 16:9 и 9:16 бесплатно и без водяного знака.',
      h1: 'MP3 Визуализатор — Превратите Аудио в Ритмичное Видео Онлайн',
      heroSubtitle: 'Перетащите файл MP3, WAV, OGG или M4A, создайте плавную визуализацию в такт биту и скачайте готовое MP4-видео бесплатно, без водяных знаков и загрузок на сервер.',
      faqHeading: 'Часто задаваемые вопросы',
      faqIntro: 'Подробно о том, как работает анализ ритма и локальный экспорт видео в вашем браузере.',
      faqs: [
        {
          question: 'Как MP3Viz синхронизирует графику с битом моей песни?',
          answer: 'MP3Viz анализирует звук в реальном времени через Web Audio API (БПФ на 2048 точек). Низкие частоты бочки и саб-баса управляют пульсацией кадра, а средние и высокие рисуют спектр при 60 кадрах в секунду.',
        },
        {
          question: 'Можно ли скачать видео визуализатора без водяных знаков?',
          answer: 'Да. Все создаваемые ролики полностью бесплатны и не содержат водяных знаков. Нажмите «Скачать видео (MP4)» для локального кодирования H.264 и звука AAC через WebCodecs и mp4-muxer.',
        },
        {
          question: 'Загружаются ли мои аудиофайлы или обложки на внешний сервер?',
          answer: 'Никогда. Ваши неизданные треки, подкасты и обложки остаются только на вашем устройстве. Декодирование и сборка MP4 происходят локально в оперативной памяти браузера.',
        },
        {
          question: 'Какие аудиоформаты и пропорции видео поддерживаются?',
          answer: 'Поддерживаются файлы MP3, WAV, OGG, FLAC и M4A. Доступны форматы 16:9 для YouTube, вертикальный 9:16 для TikTok, Reels и Shorts, а также квадрат 1:1 для соцсетей.',
        },
      ],
    },
    howToUse: {
      title: 'Как Сделать Музыкальное Видео Визуализатор из MP3 Онлайн',
      description: 'Пошаговое руководство: как превратить MP3, WAV и M4A в видео со спектром, настроить обложку, формат 16:9 или 9:16 и скачать готовый MP4.',
      breadcrumbCurrent: 'Инструкция',
      h1: 'Как Создать и Скачать Ритмичный MP3-Визуализатор Онлайн',
      intro: 'Превратите любую песню, бит или фрагмент подкаста в стильное музыкальное видео за четыре простых шага прямо в браузере.',
      steps: [
        {
          title: 'Загрузите Аудиофайл или Демо-ритм',
          body: 'Перетащите файл MP3, WAV, OGG, FLAC или M4A в окно студии на главной странице, нажмите «Выбрать аудио» или включите встроенный демо-бит.',
        },
        {
          title: 'Выберите Стиль Спектра и Формат Кадра',
          body: 'Переключайтесь между Спектром полос, Неоновым кольцом, Зеркальной волной и Импульсом частиц. Выберите 16:9, 9:16 или 1:1 и настройте чувствительность бита.',
        },
        {
          title: 'Настройте Цвета, Обложку и Название Трека',
          body: 'Выберите готовую цветовую палитру или задайте свои оттенки, добавьте обложку с мягкой пульсацией на басах и укажите название песни и исполнителя.',
        },
        {
          title: 'Скачайте Готовое MP4-Видео Без Водяного Знака',
          body: 'Нажмите «Скачать видео (MP4)», дождитесь завершения локального рендеринга до 100% и сохраните готовый видеофайл на устройство.',
        },
      ],
      tipsHeading: 'Советы для Чистого Результата',
      tips: [
        {
          title: 'Выбирайте Пропорции до Экспорта',
          body: 'Используйте 16:9 для горизонтальных роликов YouTube и 9:16 для вертикальных Shorts, Reels и TikTok.',
        },
        {
          title: 'Подберите Чувствительность под Жанр',
          body: 'Для акустики подойдёт диапазон 1.3×–1.6×, а для плотной электроники и хип-хопа — около 1.0×.',
        },
        {
          title: 'Работайте Офлайн через PWA',
          body: 'Нажмите «На главный экран» в шапке сайта, чтобы рендерить музыкальные видео даже без доступа к сети.',
        },
      ],
      ctaText: 'Готовы превратить свой трек в эффектное видео?',
      ctaButton: 'Открыть Студию Визуализации',
    },
    hireMe: {
      title: 'Нанять Кишару Дилшана — Astro, React и WebMedia Разработка',
      description: 'Нужно сверхбыстрое веб-приложение на Astro, React или Next.js либо клиентский инструмент WebAssembly? Закажите разработку у Кишары Дилшана.',
      breadcrumbCurrent: 'Заказать проект',
      badge: 'Открыт для фриланс-проектов',
      heading: 'Нужно индивидуальное IT-решение?',
      intro: 'Привет! Я Кишара Дилшан, разработчик проекта MP3Viz.',
      subcopy: 'Если вам понравился этот быстрый браузерный инструмент и вашему бизнесу нужно современное веб-решение высокого уровня, я открыт для сотрудничества. Моя специализация:',
      specialtiesHeading: 'Ключевые направления разработки',
      specialties: [
        {
          title: 'Сверхбыстрые SEO-оптимизированные веб-приложения',
          description: 'Astro, React, Next.js — мгновенная загрузка страниц, безупречное техническое SEO и чистая архитектура.',
        },
        {
          title: 'Клиентская обработка данных и инструменты WebAssembly (WASM)',
          description: 'Приватные медиа-, PDF- и веб-утилиты без серверных затрат, работающие прямо в браузере.',
        },
        {
          title: 'UI/UX-дизайн и конверсионные посадочные страницы',
          description: 'Минималистичные и доступные интерфейсы, одинаково удобные на компьютерах и смартфонах.',
        },
      ],
      ctaHeading: 'Давайте создадим отличный продукт вместе.',
      email: 'kisharadilshan007@gmail.com',
      emailLabel: 'Напишите мне напрямую: kisharadilshan007@gmail.com',
      copyButtonLabel: 'Скопировать Email',
      copiedButtonLabel: 'Скопировано!',
    },
    studio: {
      dropHeadline: 'Перетащите аудиофайл сюда для запуска визуализации',
      dropSubtext: 'Поддержка MP3, WAV, OGG, FLAC и M4A • 100% локально в вашем браузере',
      selectAudioBtn: 'Выбрать аудио',
      trySampleBtn: 'Демо-бит',
      changeAudioBtn: 'Сменить трек',
      playLabel: 'Воспроизвести предпросмотр',
      pauseLabel: 'Пауза предпросмотра',
      seekLabel: 'Шкала времени трека',
      styleSectionLabel: 'Стиль визуализации',
      styles: {
        bars: 'Спектр полос',
        radial: 'Неоновое кольцо',
        wave: 'Зеркальная волна',
        particles: 'Импульс частиц',
      },
      sensitivityLabel: 'Чувствительность бита',
      aspectSectionLabel: 'Формат видео',
      aspects: {
        landscape: '16:9 YouTube',
        portrait: '9:16 Shorts / TikTok',
        square: '1:1 Квадрат',
      },
      customSectionLabel: 'Настройка оформления',
      themeSwatchesLabel: 'Цветовые темы',
      accentColorLabel: 'Цвет спектра',
      bgColorLabel: 'Цвет фона',
      coverArtLabel: 'Обложка / Фон',
      uploadCoverBtn: 'Загрузить фото',
      clearCoverBtn: 'Удалить',
      songTitleLabel: 'Название трека',
      songTitlePlaceholder: 'напр. Midnight Horizon',
      artistNameLabel: 'Имя исполнителя',
      artistNamePlaceholder: 'напр. Nova Pulse',
      exportMp4Btn: 'Скачать видео (MP4)',
      cancelExportBtn: 'Отмена',
      exportingLabel: 'Рендеринг видео',
      statusIdle: 'Студия готова. Выберите аудиофайл или запустите демо-бит.',
      statusSampleLoaded: 'Демо-бит загружен и воспроизводится при 60 кадрах/с.',
      statusAudioLoaded: 'Загружен трек:',
      statusExportStart: 'Запуск локального экспорта видео в браузере...',
      statusExportProgress: 'Рендеринг синхронизированного видео:',
      statusExportComplete: 'Экспорт завершён! Загрузка файла началась.',
      statusExportCancelled: 'Экспорт видео отменён.',
      statusExportError: 'Ошибка при экспорте видео:',
      privacyBadge: 'Без загрузок • Без водяных знаков',
      sampleTrackTitle: 'Electric Indigo Pulse',
      sampleTrackArtist: 'MP3Viz Studio Loop',
    },
  },
};
