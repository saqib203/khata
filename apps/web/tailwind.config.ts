import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#071118",
        night: "#0b1720",
        roast: "#2b1712",
        mist: "#102b36",
        panel: "#0f2530",
        line: "#1f4b58",
        brand: "#27d3e8",
        aqua: "#8cecff",
        foam: "#d8fbff",
        bean: "#7a3f2b",
        success: "#20d89b",
        warning: "#f2b85b",
        danger: "#ff6b61"
      }
    }
  },
  plugins: []
};

export default config;
