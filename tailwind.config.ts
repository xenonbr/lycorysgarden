import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lycoris: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48", // Cor Primária
          700: "#BE123C", // Tom profundo
          800: "#9F1239",
          900: "#990C1A", // Vermelho Carmesim Oficial Brandkit
          950: "#4C0519",
          glow: "#FF2A55",
        },
        gothic: {
          bg: "#080808",
          card: "#0E0E12",
          surface: "#121217",
          border: "#27272A",
          muted: "#71717A",
          gold: "#DAAF37", // Acento Dourado Brandkit
          foliage: "#2C4736", // Verde Folhagem Brandkit
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "lycoris-glow": "0 0 25px -5px rgba(225, 29, 72, 0.45)",
        "lycoris-glow-lg": "0 0 45px -5px rgba(225, 29, 72, 0.6)",
        "gold-glow": "0 0 20px -5px rgba(218, 175, 55, 0.4)",
      },
      backgroundImage: {
        "radial-vignette": "radial-gradient(circle at center, transparent 30%, rgba(8, 8, 8, 0.85) 90%)",
        "lycoris-gradient": "linear-gradient(135deg, #E11D48 0%, #990C1A 50%, #4C0519 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(3deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
