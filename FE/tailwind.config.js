/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        mist: "#f5f7fa",
        leaf: "#2f7d62",
        clay: "#b8563f",
        line: "#d9e2ec",
        "paper-cream": "#FCFAF9",
        "bone-white": "#F7F3F0",
        "sage-green": "#728C7D",
        "deep-teal": "#314E52",
        "stone-grey": "#8E8D8A",
        primary: "#496154",
        background: "#fdf9f6",
        surface: "#fdf9f6",
        "surface-container-low": "#f7f3f0",
        "surface-container": "#f1edea",
        "surface-container-high": "#ebe7e4",
        "surface-container-highest": "#e5e2df",
        "on-surface": "#1c1b1a",
        "on-background": "#1c1b1a",
        "on-surface-variant": "#424844",
        "primary-container": "#617a6c",
        "primary-fixed-dim": "#b2cdbc",
        "secondary-container": "#c6e5ea",
        tertiary: "#765353",
        "tertiary-fixed-dim": "#e9bbbb",
        error: "#ba1a1a"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Merriweather", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(31, 41, 51, 0.08)"
      }
    }
  },
  plugins: []
};
