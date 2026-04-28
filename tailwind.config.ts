import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand palette ──────────────────────────────────────────────────
        'brand-accent':  '#BFEA36',   // Yellow-green — primary CTA, active states
        'brand-dark':    '#050d11',   // Page background — near-black with dark azure undertone
        'brand-header':  '#061520',   // Header / nav background
        'brand-card':    '#040f18',   // Card / panel background — matches secondary nav
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
        card:   '#0a2535',
        border: '#0d3248',
        't1':   '#F3F4F4',
        't2':   '#94a3b8',
        't3':   '#64748b',
      },
      fontFamily: {
        sans:       ['var(--font-inter)', 'Inter', 'sans-serif'],
        inter:      ['var(--font-inter)', 'Inter', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      // Yahoo Finance discrete typography scale — every text size in the app
      // resolves to one of these tiers. Aliased pixel utilities (text-[13px], etc.)
      // already match this scale; the named tokens below cover any text-xs/sm/base/etc. usage.
      fontSize: {
        'xs':   ['11px', { lineHeight: '1.35' }],   // tiny meta / eyebrow
        'sm':   ['12px', { lineHeight: '1.35' }],   // small meta
        'base': ['13px', { lineHeight: '1.385' }],  // body
        'md':   ['14px', { lineHeight: '1.4' }],    // body emphasis
        'lg':   ['16px', { lineHeight: '1.4' }],    // h4 / sub-heading
        'xl':   ['18px', { lineHeight: '1.3' }],    // h3 / card title
        '2xl':  ['22px', { lineHeight: '1.2' }],    // h2 / section heading
        '3xl':  ['32px', { lineHeight: '1.125' }],  // h1 / hero
        '4xl':  ['32px', { lineHeight: '1.125' }],  // capped at hero scale
        '5xl':  ['32px', { lineHeight: '1.125' }],  // capped at hero scale
      },
    },
  },
  plugins: [],
};
export default config;
