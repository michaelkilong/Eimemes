/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-ibm-plex)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-ibm-mono)', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f8f7f4',
          100: '#ede9e0',
          200: '#d5ccba',
          300: '#b8aa92',
          400: '#9a8b71',
          500: '#7d6f58',
          600: '#635847',
          700: '#4a4236',
          800: '#312c24',
          900: '#1a1712',
          950: '#0d0c09',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        navy: {
          800: '#1e2d4a',
          900: '#0f172a',
          950: '#060d1c',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '75ch',
            color: '#1a1712',
          },
        },
      },
    },
  },
  plugins: [],
};
