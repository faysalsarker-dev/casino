/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#14805E', // Vibrant red
        secondary: '#21D07A', // Neon green
        background: {
          DEFAULT: '#1E1E2E', // Dark gray
          dark: '#14141C', // Deeper black for sections
        },
        accent: '#F9D648', // Vibrant yellow
        text: {
          light: '#E4E4E7', // Light gray
          white: '#FFFFFF', // Pure white
        },
        border: '#2D2D3A', // Subtle gray for borders
      },
    },
  },
  plugins: [],
});