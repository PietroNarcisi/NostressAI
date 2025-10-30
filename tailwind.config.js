/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './content/**/*.mdx'
  ],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif']
      },
      colors: {
        primary: {
          50: '#f3f6f6',
          100: '#dfe8e7',
          200: '#c7d7d5',
          300: '#a7c2bf',
          400: '#87aca8',
          500: '#6b958f',
          600: '#4f7a75',
          700: '#42655f',
          800: '#36514c',
          900: '#273a36'
        },
        accent: {
          50: '#f7f3ed',
          100: '#ede3d3',
          200: '#ddc8ad',
          300: '#c6aa88',
          400: '#b08d6c',
          500: '#957257',
          600: '#7a5b46',
          700: '#614737',
          800: '#493428',
          900: '#33241c'
        },
        neutral: {
          25: '#f8f6f3',
          50: '#f2efeb',
          100: '#e7e1d9',
          200: '#d7cfc4',
          300: '#c1b5aa',
          400: '#a4948b',
          500: '#87786f',
          600: '#6c6059',
          700: '#544b46',
          800: '#3b3432',
          900: '#262120'
        },
        success: '#4a9a8a',
        warning: '#c89245',
        danger: '#c86455'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      boxShadow: {
        soft: '0 2px 4px -2px rgba(0,0,0,0.06), 0 4px 12px -2px rgba(0,0,0,0.04)'
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: []
};
