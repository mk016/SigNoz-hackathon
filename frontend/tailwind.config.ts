import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
        manrope: ["var(--font-manrope)", "sans-serif"],
        gloock: ["var(--font-gloock)", "serif"],
        "bebas-neue": ["var(--font-bebas-neue)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
