import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1a365d',
          primary: '#2563eb',
          light: '#93c5fd',
          bg: '#f8fafc',
        },
        success: '#10b981',
        amber: { primary: '#f59e0b', dark: '#d97706' },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
