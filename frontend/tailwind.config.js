/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'Poppins', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: {
          50: '#eff8ff',
          100: '#dbf0ff',
          200: '#bfe3ff',
          300: '#8dd0ff',
          400: '#54b4ff',
          500: '#2a95ff',
          600: '#0f75e6',
          700: '#115cb4',
          800: '#154f93',
          900: '#194275'
        },
        accent: {
          50: '#fff8ed',
          100: '#ffedd2',
          200: '#ffd7a4',
          300: '#ffba6b',
          400: '#ff9631',
          500: '#ff7810',
          600: '#f05f06',
          700: '#c74608',
          800: '#9d370f',
          900: '#7f3010'
        }
      },
      boxShadow: {
        soft: '0 10px 35px rgba(17, 92, 180, 0.08)',
        card: '0 8px 28px rgba(15, 23, 42, 0.08)',
        glow: '0 0 0 4px rgba(42, 149, 255, 0.18)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 5s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    },
  },
  plugins: [],
}