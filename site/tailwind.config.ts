import { type Config } from "tailwindcss";
// get roboto from google fonts

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      colors: {
        steamDark: "#101822",
        steamMarket: "#1B2838",
      },
    },
  },
  plugins: [require("daisyui")],
} satisfies Config;
