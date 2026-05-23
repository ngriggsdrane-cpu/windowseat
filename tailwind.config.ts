import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF3E0",
        orange: "#E8520A",
        amber: "#F2A51A",
        ink: "#1A1208",
        muted: "#6B5D4F",
        "ink-light": "#2C1F0E",
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "serif"],
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
      },
      animation: {
        ticker: "ticker 30s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
