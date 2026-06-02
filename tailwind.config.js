/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        scalebg: '#05060a',
        scalenav: '#071025',
        scalecard: '#0b1220',
        scaleblue: '#2563eb',
        scaleindigo: '#1e40af'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        glow: {
          '0%, 100%': { opacity: '0.25', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' }
        }
      },
      animation: {
        'fade-up': 'fadeUp 400ms ease-out both',
        'glow-slow': 'glow 6s ease-in-out infinite'
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem'
        }
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
}
