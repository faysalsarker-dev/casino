/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Include all source files for Tailwind to scan
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9B59B6', // Vibrant purple for primary elements
        secondary: '#1AFD9C', // Neon green for hover or accents
        background: {
          DEFAULT: '#1A2C38', // Deep black background
          dark: '#14141B', // Slightly lighter black for sections
        },
        accent: '#FF8A00', // Bright orange for complementary highlights
        zombie: '#4CAF50', // Zombie green for thematic elements
        blood: '#FF0000', // Bright red for dramatic effects
        eerie: '#6B7280', // Cool gray for subtle designs
        text: {
          light: '#B3B3C1', // Light gray for secondary text
          white: '#FFFFFF', // Pure white for strong contrast
          warning: '#FB923C', // Spooky orange for alerts
        },
        border: '#2D2D3A', // Subtle gray for dividers
        shadow: '#00000099', // Transparent black for shadows
        glow: '#9B59B6AA', // Purple glow effect for hover or active states
      },
      boxShadow: {
        neon: '0 4px 15px rgba(155, 89, 182, 0.7)', // Purple glowing shadow
        zombie: '0 4px 10px rgba(76, 175, 80, 0.7)', // Green zombie aura
      },
    },
  },
  plugins: [],
});
