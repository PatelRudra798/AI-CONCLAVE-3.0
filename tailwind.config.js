/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Space Grotesk'", 'sans-serif'],
        sora: ["'Sora'", 'sans-serif'],
        mono: ["'JetBrains Mono'", "'Space Grotesk'", 'monospace'],
      },
      colors: {
        // Theme-routed accent colors — driven by CSS vars, swap with .light class
        // Using rgb(var(--x) / <alpha-value>) lets Tailwind's opacity modifiers
        // (e.g. border-accent/40) work natively across both themes.
        accent:  { DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',  light: 'rgb(var(--accent2-light-rgb) / <alpha-value>)' },
        accent2: { DEFAULT: 'rgb(var(--accent2-rgb) / <alpha-value>)', light: 'rgb(var(--accent2-light-rgb) / <alpha-value>)' },
        bg:      '#060B14',
        card:    '#0C1826',
        card2:   '#0F1E30',
        navy:    '#0A1931',
      },

      keyframes: {
        pulse2: {
          '0%,100%': { opacity:'1', transform:'scale(1)' },
          '50%':     { opacity:'0.5', transform:'scale(1.4)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleUp: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        pulse2: 'pulse2 2s ease-in-out infinite',
        float:  'float 6s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        scaleUp: 'scaleUp 0.3s ease-out forwards',
      },
      screens: { xs: '400px' },
    },
  },
  plugins: [],
}
