import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        elevated: 'var(--color-surface-elevated)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: 'var(--shadow-glow)',
        panel: 'var(--shadow-panel)',
        accent: 'var(--shadow-accent)',
      },
      borderRadius: {
        app: 'var(--radius-sm)',
        panel: 'var(--radius-md)',
        shell: 'var(--radius-lg)',
      },
      transitionTimingFunction: {
        app: 'var(--ease-standard)',
      },
    },
  },
  plugins: [],
} satisfies Config;
