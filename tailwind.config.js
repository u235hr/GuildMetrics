/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gold-start': '#FFD700',
        'gold-end': '#DAA520',
        'silver-start': '#C0C0C0',
        'silver-end': '#A9A9A9',
        'bronze-start': '#CD7F32',
        'bronze-end': '#A0522D',
      },
      containers: {
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
      }
    },
  },
  plugins: [],
};
