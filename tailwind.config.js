/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,njk,md}"],
  theme: {
    extend: {
      colors: {
        'canvas': 'rgb(var(--nt-canvas) / <alpha-value>)',
        'surface': 'rgb(var(--nt-surface) / <alpha-value>)',
        'surface-muted': 'rgb(var(--nt-surface-muted) / <alpha-value>)',
        'ink': 'rgb(var(--nt-ink) / <alpha-value>)',
        'muted': 'rgb(var(--nt-muted) / <alpha-value>)',
        'line': 'rgb(var(--nt-line) / <alpha-value>)',
        'inverse': 'rgb(var(--nt-inverse) / <alpha-value>)',
        'inverse-ink': 'rgb(var(--nt-inverse-ink) / <alpha-value>)',
        'accent': 'rgb(var(--nt-accent) / <alpha-value>)',
        'accent-ink': 'rgb(var(--nt-accent-ink) / <alpha-value>)',
        'urgent-surface': 'rgb(var(--nt-urgent-surface) / <alpha-value>)',
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
