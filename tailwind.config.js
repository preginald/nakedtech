/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,njk,md}"],
  theme: {
    extend: {
      colors: {
        'skin-bone': '#F7F4EF',      // Primary bg
        'ivanhoe-slate': '#2D3035',  // Text/Secondary
        'electric-peach': '#FF8C69', // Accents
        'electric-peach-ink': '#B84424', // Accessible accent text on light surfaces
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'], // Ensure a clean font stack
      }
    },
  },
  plugins: [],
}
