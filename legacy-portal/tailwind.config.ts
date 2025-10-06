import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#e82d05",
          black: "#000000",
          white: "#ffffff",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

