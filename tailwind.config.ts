import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ef4444",
          dark: "#dc2626"
        }
      },
      boxShadow: {
        glass: "0 20px 50px rgba(0,0,0,0.18)"
      }
    }
  },
  plugins: []
} satisfies Config;