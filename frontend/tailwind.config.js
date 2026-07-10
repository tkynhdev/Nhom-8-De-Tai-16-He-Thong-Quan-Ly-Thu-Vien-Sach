/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7f4',
          100: '#d9ebe5',
          200: '#b8d8cd',
          300: '#8bbdad',
          400: '#5f9f8d',
          500: '#3f8272',
          600: '#31695d',
          700: '#28564d',
        },
        accent: {
          50: '#fff8e6',
          100: '#f9e8b4',
          600: '#a96818',
          700: '#854f10',
        },
        library: {
          50: '#f4f7f6',
          100: '#e4ebe9',
          200: '#cbd9d5',
          300: '#aabfba',
          400: '#7fa097',
          500: '#5f8278',
          600: '#4a675f',
          700: '#3b544e',
          800: '#2f443f',
          900: '#182725',
        },
        gold: {
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        surface: '#ffffff',
        canvas: '#f4f6f5',
        border: '#dfe7e3',
        ink: {
          900: '#17211f',
          800: '#24312e',
          700: '#34423f',
          600: '#52625e',
          500: '#71807b',
          400: '#93a09b',
        },
      },
      boxShadow: {
        panel: '0 1px 2px rgba(23, 33, 31, 0.06)',
        soft: '0 8px 20px rgba(23, 33, 31, 0.08)',
        glow: '0 0 0 3px rgba(63, 130, 114, 0.18)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
