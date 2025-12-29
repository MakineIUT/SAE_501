/** @type {import('tailwindcss').Config} */
export default {
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
    
        'sphere-purple': '#6D00BC',
        'sphere-gradient-start': '#4500ab',
        'sphere-gradient-end': '#8700c2',
        'sphere-gray': '#F1F1F1',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}