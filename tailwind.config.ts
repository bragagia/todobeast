/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    nightwind: {
      transitionDuration: false,
      //   //typography: true,
      //   colorClasses: [
      //     "gradient",
      //     "ring",
      //     "ring-offset",
      //     "divide",
      //     "placeholder",
      //   ],
      //   colorScale: {
      //     600: 500,
      //     500: 500,
      //   },
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "860px",
      // => @media (min-width: 768px) { ... }

      lg: "1040px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },

    // Shadcn shit
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },

  // End of shadcn shit

  // variants: {
  //   nightwind: ["group-hover", "active", "focus"],
  // },

  plugins: [
    require("tailwindcss-crossbrowser-touch")(),
    require("tailwindcss-animate"),
    require("nightwind"),
  ],

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
