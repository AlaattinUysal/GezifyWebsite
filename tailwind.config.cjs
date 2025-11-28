/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#0EA5E9",
        "secondary": "#10B981",
        "accent": "#F59E0B",
        "background-light": "#f6f7f8",
        "background-dark": "#10c22",
        "text-light": "#111618",
        "text-dark": "#f6f7f8",
        "card-light": "#ffffff",
        "card-dark": "#1a2a33",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "full": "9999px"
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // v3'te bu gereklidir
  ],
};