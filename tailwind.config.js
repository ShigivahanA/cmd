/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rose: {
          950: '#1a0b0b',
          500: '#ff4d6d',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
