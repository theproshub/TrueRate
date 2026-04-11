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
        'brand-dark':    '#050d11',   // Page background — near-black with dark azure undertone
        'brand-header':  '#061520',   // Header / nav background
        'brand-card':    '#050d11',   // Card / panel background — matches page bg
        'brand-nav':     '#040f18',   // Secondary nav bar
        'brand-azure':   '#061E29',   // Dark Azure — brand color, used for borders/accents
        'brand-light':   '#F3F4F4',   // Light grey — surfaces, subtle text

        // ── Semantic tokens ────────────────────────────────────────────────
        pos:    '#00a757',
        neg:    '#e11b22',

        // ── Legacy (kept for any remaining references) ─────────────────────
        accent: '#BFEA36',
        'accent-hover': '#a8d42a',
        page:   '#F3F4F4',
        card:   '#050d11',
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
