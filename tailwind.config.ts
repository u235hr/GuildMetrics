import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'alibaba-thin': ['AlibabaPuHuiTi-3-35-Thin', 'sans-serif'],
        'alibaba-reg': ['AlibabaPuHuiTi-3-35-Regular', 'sans-serif'],
      },
      animation: {
        'grid': 'grid 15s linear infinite',
      },
      keyframes: {
        grid: {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(0%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
};
export default config;
