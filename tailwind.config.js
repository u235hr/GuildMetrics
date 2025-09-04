/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      containerType: {
        'size': 'size',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        gradient: 'gradient 8s linear infinite',
        breathe: 'breathe 3s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        'gold-start': '#FFD700',
        'gold-end': '#DAA520',
        'silver-start': '#C0C0C0',
        'silver-end': '#A9A9A9',
        'bronze-start': '#CD7F32',
        'bronze-end': '#A0522D',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}
