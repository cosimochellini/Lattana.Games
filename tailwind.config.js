module.exports = {
  purge: { content: ["./public/**/*.html", "./src/**/*.{vue,ts,json}"] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [],
};
