/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        night: {
          950: "#07090f",
          900: "#0a0e17",
          850: "#0d1220",
          800: "#111827",
          700: "#1a2233",
        },
        surface: {
          DEFAULT: "#0d1220",
          light: "#121a2b",
          lighter: "#182238",
        },
        grass: {
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
        creeper: {
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
        },
        gold: {
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
        },
        amethyst: {
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
        },
      },
      boxShadow: {
        glow: "0 0 24px -6px rgba(74, 222, 128, 0.35)",
        "glow-red": "0 0 24px -6px rgba(248, 113, 113, 0.35)",
        card: "0 8px 30px -12px rgba(0, 0, 0, 0.55)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(60rem 30rem at 85% -10%, rgba(74,222,128,0.10), transparent 60%), radial-gradient(50rem 26rem at -10% 110%, rgba(45,212,191,0.08), transparent 60%), radial-gradient(40rem 22rem at 50% 120%, rgba(139,92,246,0.07), transparent 60%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(74,222,128,0.45)" },
          "50%": { opacity: ".75", boxShadow: "0 0 0 6px rgba(74,222,128,0)" },
        },
        "pulse-dot-red": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(248,113,113,0.45)" },
          "50%": { opacity: ".75", boxShadow: "0 0 0 6px rgba(248,113,113,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-up": "fade-up .45s cubic-bezier(.21,.61,.35,1) both",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "pulse-dot-red": "pulse-dot-red 2s ease-in-out infinite",
        shimmer: "shimmer 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};
