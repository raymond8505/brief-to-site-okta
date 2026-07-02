// Tailwind v4 via PostCSS. Used by Storybook's vite builder (core is a library, not a Next
// app) and by any site app that builds core's globals.css.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
