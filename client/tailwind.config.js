/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'layout': '16rem 1fr',
        'track-info': '2fr 1fr 3fr 1fr',
      },
      gridTemplateRows: {
        'layout': 'minmax(20rem, 1fr) 5rem',
        'track-info': '1fr 1fr 1fr 1fr',
      },
    },
  },
  plugins: [],
}

