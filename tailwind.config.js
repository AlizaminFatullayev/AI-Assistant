/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f27f0d',
        'background-light': '#f8f7f5',
        'background-dark': '#221910',
        'surface-dark': '#27211b',
        'accent-dark': '#393028',
      },
      fontFamily: {
        display: ['Be Vietnam Pro', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

