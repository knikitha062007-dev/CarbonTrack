/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        cybergreen: {
          50: '#e6fff7',
          100: '#b3ffea',
          400: '#33FFC7', // custom primary neon glow green
          500: '#10b981',
          600: '#059669',
          900: '#064e3b'
        }
      },
      boxShadow: {
        'glow-neon': '0 0 20px rgba(51, 255, 199, 0.45)',
        'glow-neon-lg': '0 0 35px rgba(51, 255, 199, 0.65)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
