/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          900: '#0b0d10',
          800: '#12151a',
          700: '#1a1f26',
          600: '#252b35',
        },
        acento: {
          DEFAULT: '#a3e635',
          escuro: '#84cc16',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
