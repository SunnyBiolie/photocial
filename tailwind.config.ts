import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "rich-black": "var(--rich-black)",
        "black-chocolate": "var(--black-chocolate)",
        "coffee-bean": "var(--coffee-bean)",
        jet: "var(--jet)",
        normal: "var(--normal)",
        unselected: "var(--unselected)",
      },
      keyframes: {
        "nav-item_click": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "0.9" },
          to: { opacity: "0" },
        },
        appear: {
          from: {
            scale: "0.9",
            opacity: "0",
          },
          to: {
            scale: "1",
            opacity: "1",
          },
        },
        "appear-lg": {
          from: {
            scale: "0.5",
            opacity: "0",
          },
          to: {
            scale: "1",
            opacity: "1",
          },
        },
        "slide-in-up": {
          from: {
            opacity: "0",
            bottom: "100%",
          },
          to: {
            opacity: "1",
            bottom: "150%",
          },
        },
        "slide-out-down": {
          from: {
            opacity: "1",
            bottom: "150%",
          },
          to: {
            opacity: "0",
            bottom: "100%",
          },
        },
      },
      animation: {
        "nav-item_click": "nav-item_click 0.2s linear",
        "fade-in": "fade-in 0.2s linear",
        "fade-out": "fade-out 0.2s linear",
      },
    },
  },
  plugins: [],
};

export default config;
