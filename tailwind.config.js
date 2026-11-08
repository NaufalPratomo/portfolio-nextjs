/** @type {import('tailwindcss').Config} */

// Warm neutral ramp. Overrides Tailwind's cool "slate" so every component,
// including the older ones (Achievements, Copyright, admin), shares one paper/ink palette.
const neutral = {
  50: '#FAF8F4',
  100: '#F1EDE4',
  200: '#E4DFD5',
  300: '#CFC9BC',
  400: '#A8A298',
  500: '#6A655C',
  600: '#5B574F',
  700: '#403D36',
  800: '#2A2823',
  900: '#1D1C17',
  950: '#14130F',
};

// The single accent (terracotta). 600 passes 5.2:1 on paper, 400 passes 7.5:1 on the dark background.
// "blue" and "sky" point at it on purpose: older components still say blue-600, and they now follow the accent.
const accent = {
  50: '#FDF4EE',
  100: '#FAE5D6',
  200: '#F4C8AA',
  300: '#EDA577',
  400: '#F08A5D',
  500: '#D9561F',
  600: '#B8420F',
  700: '#983510',
  800: '#7A2C12',
  900: '#64260F',
  950: '#371006',
};

module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: neutral,
        accent,
        blue: accent,
        sky: accent,
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
