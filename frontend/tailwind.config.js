/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nexa: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#bfe0ff',
          300: '#93cdff',
          400: '#5ab3ff',
          500: '#2e99ff',
          600: '#0f7ff0',
          700: '#0b64c0',
          800: '#0b4f96',
          900: '#0a3c73'
        }
      },
      boxShadow: {
        glow: '0 0 30px rgba(46,153,255,0.5)'
      }
    }
  },
  plugins: []
}