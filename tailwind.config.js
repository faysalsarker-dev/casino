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
        primary: '#1ce81d', 
        secondary: '#F47000', 
        background: {
          DEFAULT: '#0F212E', 
          section: '#213743', 
          secondary: '#1A2C38', 
        },
        text: {
          primary:'#FFFFFF',
       
          warning: '#FB923C',
        },
    
      },
 
    },
  },
  plugins: [],
});
