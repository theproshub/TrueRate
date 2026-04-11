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
        // ── Brand palette ──────────────────────────────────────────────────
        'brand-accent':  '#BFEA36',   // Yellow-green — primary CTA, active states
        'brand-dark':    '#061E29',   // Dark azure — page background, header
        'brand-card':    '#0a2535',   // Card / panel background
        'brand-nav':     '#051a26',   // Secondary nav bar
        'brand-light':   '#F3F4F4',   // Light grey — surfaces, subtle text

        // ── Semantic tokens ────────────────────────────────────────────────
        pos:    '#00a757',
        neg:    '#e11b22',

        // ── Legacy (kept for any remaining references) ─────────────────────
        accent: '#BFEA36',
        'accent-hover': '#a8d42a',
        page:   '#F3F4F4',
        card:   '#0a2535',
        border: '#0d3248',
        't1':   '#F3F4F4',
        't2':   '#94a3b8',
        't3':   '#64748b',
      },
      fontFamily: {
        // Poppins = main brand font, Montserrat = secondary
        sans:       ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        poppins:    ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
