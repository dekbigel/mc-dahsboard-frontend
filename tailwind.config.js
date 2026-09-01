/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0f1115",
          light: "#171a21",
          lighter: "#1e2230",
        },
      },
    },
  },
  plugins: [],
};