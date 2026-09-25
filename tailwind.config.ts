import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          red: {
            DEFAULT: "#9E1C1C",
            light: "#C53030",
            dark: "#741212",
          },
          gold: {
            DEFAULT: "#D4AF37",
            light: "#F3C64F",
            dark: "#AA820A",
          },
          jade: {
            DEFAULT: "#1F4E46",
            light: "#2A6E63",
            dark: "#143530",
          },
          indigo: {
            DEFAULT: "#1D2D50",
            light: "#2B4170",
            dark: "#131E35",
          },
          cream: "#FAF6F0",
          dark: {
            DEFAULT: "#0F1117",
            card: "#171B26",
            border: "#252D3D",
            hover: "#1F2637",
          }
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
