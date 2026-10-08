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
        "paper-cream": "#FDFBF7",
        "surface-pure": "#FFFFFF",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f3f2",
        "surface-container": "#f0eded",
        "surface-container-high": "#eae7e7",
        "surface-container-highest": "#e5e2e1",
        "surface-dim": "#dcd9d9",
        "surface-bright": "#fcf9f8",
        "surface-variant": "#e5e2e1",
        "vermilion-red": "#D93829",
        "primary": "#b51d13",
        "primary-container": "#d93829",
        "on-primary": "#ffffff",
        "on-primary-container": "#fffcff",
        "bronze-gold": "#C5A059",
        "secondary": "#775a19",
        "secondary-container": "#fed488",
        "on-secondary": "#ffffff",
        "tertiary": "#675b42",
        "tertiary-container": "#807459",
        "border-bronze-light": "#E5D5B5",
        "text-charcoal": "#1A1A1A",
        "text-warm-gray": "#666059",
        "guardrail-pass": "#2A7E4B",
        "guardrail-pass-surface": "#F2F9F4",
        "guardrail-warning": "#C76A15",
        "guardrail-warning-surface": "#FDF6ED",
        heritage: {
          red: {
            DEFAULT: "#D93829",
            light: "#E35649",
            dark: "#B51D13",
          },
          gold: {
            DEFAULT: "#C5A059",
            light: "#D8B87B",
            dark: "#A38038",
          },
          jade: {
            DEFAULT: "#2A7E4B",
            light: "#3D9C63",
            dark: "#1C5A34",
          },
          cream: "#FDFBF7",
          dark: {
            DEFAULT: "#1A1A1A",
            card: "#262320",
            border: "#E5D5B5",
            hover: "#332E2A",
          },
        },
      },
      fontFamily: {
        sans: ["'Be Vietnam Pro'", "system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        serif: ["'Be Vietnam Pro'", "system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        mono: ["'Space Grotesk'", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        cyber: ["'Space Grotesk'", "sans-serif"],
        "headline-lg": ["'Be Vietnam Pro'", "sans-serif"],
        "headline-md": ["'Be Vietnam Pro'", "sans-serif"],
        "headline-sm": ["'Be Vietnam Pro'", "sans-serif"],
        "display-lg": ["'Be Vietnam Pro'", "sans-serif"],
        "cultural-quote": ["'Be Vietnam Pro'", "sans-serif"],
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        gutter: "1rem",
        "gutter-desktop": "1.5rem",
        margin: "1rem",
        "margin-desktop": "2rem",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        fadeIn: "fadeIn 0.25s ease-out forwards",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
