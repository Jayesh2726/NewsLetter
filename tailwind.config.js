/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#173B57",
        gold: "#C69A45",
        ivory: "#F5F2EA",
        charcoal: "#263238",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        marathi: ['"Noto Sans Devanagari"', "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};