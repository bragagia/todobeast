/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "860px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
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
