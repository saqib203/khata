import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        mist: "#f4f6f8",
        line: "#d9dee5",
        brand: "#1769aa",
        success: "#14845c",
        warning: "#b7791f",
        danger: "#b42318"
      }
    }
  },
  plugins: []
};

export default config;
