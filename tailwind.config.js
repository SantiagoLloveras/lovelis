/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
