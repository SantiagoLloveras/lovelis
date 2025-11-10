/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        pink: {
          50: "#fff0f5",
          100: "#ffe4ec",
          200: "#ffccd9",
          300: "#ff99b3",
          400: "#ff6699",
          500: "#ff3380",
          600: "#e60073",
          700: "#b30059",
          800: "#800040",
          900: "#4d0026",
        },
        beige: "#fff8f2",
      },
      boxShadow: {
        'soft': '0 6px 18px rgba(16,24,40,0.08)',
      },
    },
  },
  plugins: [forms],
}
