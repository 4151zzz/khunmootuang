/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Prompt"', '"Kanit"', 'sans-serif'],
        display: ['"Kanit"', '"Prompt"', 'sans-serif'],
      },
      colors: {
        chalkboard: {
          900: '#1a382b',
          800: '#234938',
          700: '#2d5c47',
        },
        moo: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        line: {
          green: '#06C755',
          dark: '#05B34C',
          light: '#E8F9EE'
        }
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(0)' },
        },
        hatch: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.1) rotate(-8deg)' },
          '50%': { transform: 'scale(0.95) rotate(8deg)' },
          '75%': { transform: 'scale(1.15) rotate(-6deg)' },
          '100%': { transform: 'scale(1.2) rotate(0deg)' },
        }
      },
      animation: {
        wiggle: 'wiggle 0.5s ease-in-out infinite',
        bounceSubtle: 'bounceSubtle 2s ease-in-out infinite',
        hatch: 'hatch 0.8s ease-in-out',
      }
    },
  },
  plugins: [],
}

