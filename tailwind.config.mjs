/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        alabaster: '#F8F7F4',
        sand: '#EAE6DF',
        lavender: '#C3BEDA',
        indigo: {
          brand: '#5E4FA2',
          dark: '#8B7CE0',
        },
        page: 'var(--bg-page)',
        card: 'var(--bg-card)',
        subtle: 'var(--bg-subtle)',
        accent: {
          DEFAULT: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
          hover: 'var(--accent-hover)',
          fg: 'var(--text-on-accent)',
        },
        ink: {
          DEFAULT: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
        },
        line: 'var(--border-color)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      transitionTimingFunction: {
        studio: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        studio: '0 20px 50px -15px rgba(24, 22, 34, 0.08), 0 4px 16px -4px rgba(24, 22, 34, 0.04)',
        'studio-dark': '0 24px 60px -15px rgba(0, 0, 0, 0.55), 0 4px 16px -4px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};
