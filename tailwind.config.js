/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      amber: {
        400: "#FFB615",
      },
      black: "#000000",
      blue: {
        600: "#5EA2F5",
      },
      cyan: {
        300: "cyan",
      },
      emerald: {
        300: "#6ACF9B",
        400: "#34d399",
        500: "#00D992",
        600: "#059669",
        700: "#111F1F",
        800: "#112221",
        950: "#102924",
      },
      fuchsia: { 500: "fuchsia" },
      green: { 600: "#33d398" },
      gray: { 400: "#B7BBBC", 700: "#313131", 800: "#2C3335", 950: "#060F11" },
      indigo: { 500: "indigo" },
      lime: { 300: "lime" },
      neutral: {
        300: "#D7D7D5",
        700: "#363636",
        800: "#1A2225",
        900: "#0D1517",
      },
      orange: { 500: "orange" },
      pink: { 500: "pink" },
      purple: { 400: "#9f74d7", 500: "#9747FF" },
      red: { 600: "#FB7185" },
      rose: { 400: "#FB6D88" },
      sky: { 500: "sky" },
      slate: {
        500: "#6c7375",
        800: "#161f23",
        900: "#101718",
        950: "#090E11",
      },
      stone: {
        500: "#636969",
        700: "#4A381F",
        800: "#3B2327",
        850: "#2B2011",
        900: "#231517",
      },
      teal: { 600: "teal", 950: "#10372C" },
      violet: { 500: "violet" },
      white: "#FFFFFF",
      yellow: { 400: "#e9ba4c", 500: "#FFB200" },
      zinc: {
        100: "#F0F1F1",
        200: "#101618",
        300: "#DBDBDB",
        400: "#A9ADAE",
        500: "#6c7375",
        600: "#5B5B5B",
        700: "#1C2225",
        800: "#271F2D",
        900: "#121B1D",
        950: "#0a0f0f",
      },
    },
    extend: {
      fontFamily: {
        inter: ["Inter var"],
        gt: ['"GT America Mono"'],
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss/plugin")(({ addVariant }) => {
      addVariant("search-cancel", "&::-webkit-search-cancel-button");
    }),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};
