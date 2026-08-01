/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bazaar: {
          midnight: '#070a12',
          panel: '#0a0e1a',
          card: '#111625',
          gold: '#d4af37',
          goldLight: '#e5c158',
          goldDark: '#c59b27',
          amber: '#e69138',
          moonlight: '#7b9acc',
          silver: '#8e9aaf',
          parchment: '#f3e5ab',
        },
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d4af37',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
      },
      boxShadow: {
        'bazaar-card': '0 16px 45px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(212, 175, 55, 0.18)',
        'gold-glow': '0 0 30px rgba(212, 175, 55, 0.35)',
        'moon-glow': '0 0 35px rgba(123, 154, 204, 0.25)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulseSlow 15s ease-in-out infinite',
        'moon-float': 'moonFloat 10s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
