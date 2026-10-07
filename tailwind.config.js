/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
        'surface-sunken': 'var(--surface-sunken)',
        ink: 'var(--ink)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          active: 'var(--primary-active)',
          tint: 'var(--primary-tint)',
        },
        secondary: 'var(--secondary)',
        accent: {
          DEFAULT: 'var(--accent)',
          tint: 'var(--accent-tint)',
        },
        success: {
          DEFAULT: 'var(--success)',
          tint: 'var(--success-tint)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          tint: 'var(--warning-tint)',
        },
        error: {
          DEFAULT: 'var(--error)',
          tint: 'var(--error-tint)',
        },
        info: 'var(--info)',
        'dark-bg': 'var(--dark-bg)',
        'dark-surface': 'var(--dark-surface)',
        'on-dark': 'var(--on-dark)',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
      },
      boxShadow: {
        1: 'var(--sh-1)',
        2: 'var(--sh-2)',
        3: 'var(--sh-3)',
      },
      zIndex: {
        sticky: 'var(--z-sticky)',
        nav: 'var(--z-nav)',
        demo: 'var(--z-demo)',
        drawer: 'var(--z-drawer)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
        lens: 'var(--z-lens)',
        loader: 'var(--z-loader)',
      },
    },
  },
  plugins: [],
}
