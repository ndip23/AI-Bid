/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#061933',
        foreground: '#F8FAFC',
        card: {
          DEFAULT: 'rgba(11, 37, 69, 0.75)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        brand: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          500: '#388E3C',
          600: '#2E7D32',
          700: '#1B5E20',
          800: '#0F2C59',
          900: '#061933',
        },
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          500: '#1B365D',
          600: '#0F2540',
          700: '#0B2545',
          800: '#061933',
          900: '#030D1B',
        },
        cyanAccent: '#0284C7',
        emeraldAccent: '#2E7D32',
        roseAccent: '#F43F5E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
