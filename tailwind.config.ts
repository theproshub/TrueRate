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
        'brand-accent':        '#BFEA36',   // Yellow-green — primary CTA, active states
        'brand-accent-hover':  '#a8d42a',   // CTA hover — one shade darker than accent
        'brand-dark':          '#050d11',   // Page background — near-black with dark azure undertone
        'brand-muted':         '#030a0e',   // Deeper dark — innermost header layer
        'brand-header':        '#061520',   // Header / nav background
        'brand-card':          '#040f18',   // Card / panel background
        'brand-nav':           '#040f18',   // Secondary nav bar (alias of card)
        'brand-azure':         '#061E29',   // Dark Azure — borders / accents
        'brand-light':         '#F3F4F4',   // Light grey — surfaces / subtle text
        'brand-surface':       '#f8f9fa',   // Light page background (news / article pages)
        'brand-ink':           '#0a0a0d',   // Near-black text on light surfaces

        // ── Semantic tokens ────────────────────────────────────────────────
        pos:     '#00a757',   // Positive / success green
        neg:     '#e11b22',   // Negative / error red
        warning: '#f59e0b',   // Warning amber
        info:    '#3b82f6',   // Info blue

        // ── Legacy aliases (kept until all call-sites are migrated) ─────────
        accent:       '#BFEA36',
        'accent-hover': '#a8d42a',
        page:         '#F3F4F4',
        card:         '#0a2535',
        border:       '#0d3248',
        't1':         '#F3F4F4',
        't2':         '#94a3b8',
        't3':         '#64748b',
      },
      fontFamily: {
        sans:       ['var(--font-inter)', 'Inter', 'sans-serif'],
        inter:      ['var(--font-inter)', 'Inter', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        mono:       ['"Roboto Mono"', '"Courier New"', 'monospace'],  // financial figures
      },
      // ── Typography scale ────────────────────────────────────────────────
      // Every text size in the app maps to one of these named tiers.
      // Use these; never write text-[Xpx] arbitrary values.
      fontSize: {
        '2xs':  ['10px', { lineHeight: '1.35' }],   // tiny badges / eyebrow labels
        'xs':   ['11px', { lineHeight: '1.35' }],   // small meta / timestamps
        'sm':   ['12px', { lineHeight: '1.35' }],   // secondary labels
        'base': ['13px', { lineHeight: '1.385' }],  // body (primary reading size)
        'md':   ['14px', { lineHeight: '1.4' }],    // body emphasis / form text
        'lg':   ['16px', { lineHeight: '1.4' }],    // h4 / sub-heading
        'xl':   ['18px', { lineHeight: '1.3' }],    // h3 / card title
        '2xl':  ['22px', { lineHeight: '1.2' }],    // h2 / section heading
        '3xl':  ['32px', { lineHeight: '1.125' }],  // h1 / hero
        '4xl':  ['32px', { lineHeight: '1.125' }],  // capped — do not exceed 32px
        '5xl':  ['32px', { lineHeight: '1.125' }],  // capped — do not exceed 32px
      },
      // ── Spacing extensions ──────────────────────────────────────────────
      spacing: {
        'header':    '64px',   // top-header   — sticky offset matching header height
        'header-md': '100px',  // top-header-md — header + indicator strip
        'header-lg': '120px',  // top-header-lg — header + indicator strip + section nav
      },
      // ── Border radius ───────────────────────────────────────────────────
      borderRadius: {
        'sm':   '4px',
        'md':   '6px',
        'lg':   '8px',
        'xl':   '12px',
        'full': '9999px',
      },
      // ── Box shadow ──────────────────────────────────────────────────────
      boxShadow: {
        'sm':  '0 1px 2px 0 rgb(0 0 0 / 0.20)',
        'md':  '0 2px 8px 0 rgb(0 0 0 / 0.30)',
        'lg':  '0 4px 16px 0 rgb(0 0 0 / 0.40)',
      },
    },
  },
  plugins: [],
};
export default config;
