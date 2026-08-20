/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sinhala: ['"Abhaya Libre"', 'serif'],
      },
      screens: {
        'custom': '1114px',
      },
      height: {
        'custom-min-screen': '60vh',
      },
      colors: {
        // Government blue palette maps to our redesigned theme variables
        'primary': 'var(--color-accent)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-light': 'var(--color-primary-light)',
        'accent': 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        'surface': 'var(--color-bg-surface)',
        'surface-dark': 'var(--color-bg-surface-dark)',
        'text-primary': 'var(--color-text-main)',
        'text-secondary': 'var(--color-text-muted)',
        
        // Legacy colors mapped to NIRDC Plum design system variables
        'main-color': 'var(--color-accent)',
        'main-color-light': 'var(--color-primary-light)',
        'second-color': 'var(--color-primary-light)',
        'third-color': 'var(--color-bg-canvas)',

        // Dark mode overrides
        'dark-bg': 'var(--color-bg-canvas)',
        'dark-surface': 'var(--color-bg-surface)',
        'dark-border': 'var(--color-border-subtle)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
