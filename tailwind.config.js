/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-crossbrowser-touch")(),
    require("@tailwindcss/forms"),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  modules: {
    opacity: [
      "responsive",
      "hover",
      "focus",
      "no-touch",
      "no-touch-hover",
      "no-touch-group-hover",
    ],
  },
};
