/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      utilities: {
        '.overflow-wrap-anywhere': {
          'overflow-wrap': 'anywhere',
          'word-break': 'break-word'
        }
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.overflow-wrap-anywhere': {
          'overflow-wrap': 'anywhere',
          'word-break': 'break-word'
        }
      };
      addUtilities(newUtilities);
    }
  ],
}; 