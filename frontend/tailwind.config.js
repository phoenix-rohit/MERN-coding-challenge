/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        jose: ["Josefin Sans", "ui-sans"],
      },
    },
  },
  plugins: [],
};
