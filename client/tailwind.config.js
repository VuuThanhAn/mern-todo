/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // để Tailwind apply class trong React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
