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
        'gold': {
          DEFAULT: '#FFD700',
          'start': '#FFD700',
          'end': '#DAA520',
        },
        'silver': {
          DEFAULT: '#C0C0C0',
          'start': '#C0C0C0',
          'end': '#A9A9A9',
        },
        'bronze': {
          DEFAULT: '#CD7F32',
          'start': '#CD7F32',
          'end': '#A0522D',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}