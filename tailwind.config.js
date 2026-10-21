/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d"
        },
        gold: {
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04"
        }
      },
      animation: {
        ripple: "ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite",
        pulseFast: "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      keyframes: {
        ripple: {
          "0%": { transform: "scale(0.95)", opacity: "1" },
          "100%": { transform: "scale(1.4)", opacity: "0" }
        }
      }
    }
  },
  plugins: []
};
