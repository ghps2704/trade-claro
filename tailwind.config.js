/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0B0E',
        surface: '#111318',
        accent: '#00D4AA',
        negative: '#FF4560',
        attention: '#FFB800',
        'text-primary': '#F0F2F8',
        'text-secondary': '#8892A4',
        border: '#1E2330',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        title: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
