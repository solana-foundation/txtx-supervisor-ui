/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      amber: {
        400: "amber",
      },
      blue: {
        600: "blue",
      },
      cyan: {
        300: "cyan",
      },
      emerald: {
        400: "#34d399",
        500: "#22c55e",
        600: "#059669",
      },
      fuchsia: { 500: "fuchsia" },
      green: { 600: "#33d398" },
      indigo: { 500: "indigo" },
      lime: { 300: "lime" },
      orange: { 500: "orange" },
      pink: { 500: "pink" },
      purple: { 500: "purple" },
      red: { 600: "red" },
      rose: { 500: "rose" },
      sky: { 500: "sky" },
      slate: {
        500: "#6c7375",
        800: "#161f23",
        900: "#101718",
        950: "#090e11",
      },
      teal: { 600: "teal" },
      violet: { 500: "violet" },
      white: "white",
      yellow: { 300: "yellow" },
      zinc: {
        100: "zinc",
        200: "zinc",
        300: "zinc",
        400: "zinc",
        500: "#6c7375",
        600: "zinc",
        700: "zinc",
        800: "zinc",
        900: "zinc",
        950: "#0a0f0f",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
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
