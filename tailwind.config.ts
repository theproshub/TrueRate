import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
colors: {
        pos:    '#00a757',
        neg:    '#e11b22',
        accent: '#6001d2',
        'accent-hover': '#490099',
        page:   '#f0f0f0',
        card:   '#ffffff',
        border: '#e0e0e0',
        't1':   '#0f1419',
        't2':   '#646567',
        't3':   '#8c8e8f',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
