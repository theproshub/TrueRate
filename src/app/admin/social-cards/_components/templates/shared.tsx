'use client';

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export const FONT_SANS = 'var(--font-inter), Inter, sans-serif';
export const FONT_MONO = 'var(--font-roboto-mono), "Roboto Mono", monospace';

export const TR_COLORS = {
  navy: '#050d11', navy2: '#040f18',
  lime: '#BFEA36', cream: '#F3F0E8', paper: '#f8f9fa',
  ink: '#111111', mid: '#8a9aaa',
  red: '#e11b22', green: '#00a757',
} as const;

// Section accent colors for social cards. The studio's category dropdown is the
// seven site sections (News, Markets, Economy, Analytics, Business, Technology,
// Videos). Running them through the site's fine-grained getCatColor() palette
// collides (Markets/Technology, Economy/Business) and leaves gaps, so each
// section gets its own distinct, legible hue here — drawn from the same color
// language. Used for the color-coded chip/eyebrow on section cards (breaking).
// Lime stays reserved for brand.
export const SECTION_HEX: Record<string, string> = {
  news:        '#e11b22', // site red — urgent/breaking
  markets:     '#0284c7', // sky-600
  banking:     '#0d9488', // teal-600
  forex:       '#0891b2', // cyan-600
  commodities: '#b45309', // amber-700 — metals/gold
  economy:     '#2563eb', // blue-600
  business:    '#059669', // emerald-600
  analytics:   '#9333ea', // purple-600
  technology:  '#4f46e5', // indigo-600
  videos:      '#db2777', // pink-600
};

// Resolve a category label to its section hex. Falls back to slate-600 (holds
// white text) for any label outside the fixed dropdown.
export function sectionColor(cat?: string): string {
  return SECTION_HEX[(cat ?? '').trim().toLowerCase()] ?? '#475569';
}

const LOGO_SRC = '/logo-tight.png';

// Auto-fit headline: shrinks font-size so the text fits within container width
// across up to `maxLines` lines, between min/max font sizes.
export function AutoFitHeadline({
  text, children, maxSize = 78, minSize = 54, maxLines = 4, styleOverrides,
}: {
  text?: string; children?: ReactNode; maxSize?: number; minSize?: number;
  maxLines?: number; styleOverrides?: CSSProperties;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [size, setSize] = useState(maxSize);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let s = maxSize;
    el.style.fontSize = s + 'px';
    const lineHeight = 1.12;
    const fits = () => {
      const lines = el.scrollHeight / (s * lineHeight);
      return lines <= maxLines + 0.1 && el.scrollWidth <= el.clientWidth + 1;
    };
    while (!fits() && s > minSize) {
      s -= 2;
      el.style.fontSize = s + 'px';
    }
    setSize(s);
  }, [text, maxSize, minSize, maxLines]);

  return (
    <h1 ref={ref} style={{
      fontFamily: FONT_SANS,
      lineHeight: 1.12, letterSpacing: -1,
      color: '#fff', textWrap: 'balance',
      margin: '0 0 40px', fontWeight: 800,
      ...styleOverrides, fontSize: size + 'px',
    }}>{children || text}</h1>
  );
}

// Stretches text horizontally (scaleX) so it fills the parent's full width on one
// line, anchored left. Distorts glyph width by design — for a display number that
// should always span edge to edge regardless of how many characters it has.
export function StretchWidth({
  text, baseSize = 230, styleOverrides,
}: { text?: string; baseSize?: number; styleOverrides?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const natural = el.scrollWidth;
    if (natural > 0) setScale(parent.clientWidth / natural);
  }, [text, baseSize]);

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <div ref={ref} style={{
        display: 'inline-block', whiteSpace: 'nowrap',
        transformOrigin: 'left center', transform: `scaleX(${scale})`,
        fontFamily: FONT_SANS, fontSize: baseSize, lineHeight: 1,
        ...styleOverrides,
      }}>{text}</div>
    </div>
  );
}

export function Logo({ mode = 'white', size = 28 }: { mode?: 'white' | 'navy' | 'lime'; size?: number }) {
  const color = mode === 'white' ? '#fff' : mode === 'navy' ? '#050d11' : '#BFEA36';
  return <span style={{
    fontFamily: FONT_SANS,
    fontWeight: 900, fontStyle: 'italic',
    fontSize: size * 0.95, color,
    letterSpacing: -0.5, lineHeight: 1,
    display: 'inline-block',
  }}>TrueRate</span>;
}

// Wordmark for corner usage. NOTE: height 48 matches the reviewed prototype
// rendering (its `size` prop was ignored); see plan "known discrepancies" #2.
export function TrueRateMark({ color = '#BFEA36' }: { color?: string; size?: number }) {
  const filter = color === '#050d11' || color === 'navy'
    ? 'brightness(0)'
    : color === '#fff' || color === 'white'
      ? 'brightness(0) invert(1)'
      : 'none';
  // eslint-disable-next-line @next/next/no-img-element -- exported to canvas; next/image would rewrite the URL
  return <img src={LOGO_SRC} alt="" style={{
    height: 48, filter, display: 'block',
    width: 'auto', objectFit: 'contain',
  }} />;
}

export function PhotoPlaceholder({
  variant = 'portrait', label = 'Photo', imageUrl, objectPosition = 'center', bw = false,
}: {
  variant?: 'portrait' | 'tech' | 'finance' | 'industrial' | 'abstract';
  label?: string; imageUrl?: string; objectPosition?: string; bw?: boolean;
}) {
  const bgs: Record<string, string> = {
    portrait: 'radial-gradient(ellipse 60% 80% at 50% 40%, #2a3a4a 0%, #0f1a22 60%, #060d14 100%)',
    tech: 'radial-gradient(ellipse at 30% 40%, #3a1a4a 0%, #1a0a2a 45%, #0a0512 100%)',
    finance: 'radial-gradient(ellipse at 60% 30%, #1a3a4a 0%, #0a1a28 50%, #050a12 100%)',
    industrial: 'radial-gradient(ellipse at 40% 60%, #3a2a1a 0%, #1a1008 50%, #0a0604 100%)',
    abstract: 'linear-gradient(135deg, #0f1e2a 0%, #1a2a3a 40%, #0a1520 100%)',
  };
  const bg = bgs[variant] || bgs.portrait;

  if (imageUrl) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
        {/* No crossOrigin: the browser HTTP cache can hold a copy of the image that is
            unusable for CORS validation (observed with Supabase storage), which makes a
            crossOrigin load fail outright and break the preview. Export doesn't need the
            attribute — html-to-image inlines images via fetch with cacheBust. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- exported to canvas; next/image would rewrite the URL */}
        <img src={imageUrl} alt={label} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          objectPosition, display: 'block',
          imageRendering: 'high-quality' as CSSProperties['imageRendering'],
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          filter: bw ? 'grayscale(100%) contrast(1.18) brightness(0.96)' : 'none',
        }} />
      </div>
    );
  }
  return (
    <div style={{ width: '100%', height: '100%', background: bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 40%), radial-gradient(circle at 80% 60%, rgba(191,234,54,0.05) 0%, transparent 50%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 12, left: 16,
        fontFamily: FONT_MONO, fontSize: 10,
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: 2, textTransform: 'uppercase',
      }}>[ {label} ]</div>
    </div>
  );
}

// Shared footer: credit left, mark right
export function CardFooter({
  credit, dark = true, left = 48, right = 48, bottom = 28, hideMark = false,
}: {
  credit?: ReactNode; dark?: boolean; left?: number; right?: number;
  bottom?: number; hideMark?: boolean;
}) {
  return (
    <div style={{
      position: 'absolute', left, right, bottom, zIndex: 10,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{
        fontFamily: FONT_SANS, textTransform: 'uppercase',
        color: dark ? '#fff' : TR_COLORS.navy, lineHeight: 1,
        whiteSpace: 'nowrap', fontSize: '30px', fontWeight: '400', display: 'block',
      }}>{credit}</span>
      {!hideMark && <span style={{ display: 'block', lineHeight: 0, marginBottom: 0 }}>
        <TrueRateMark color={dark ? TR_COLORS.lime : TR_COLORS.navy} size={64} />
      </span>}
    </div>
  );
}

export function MonoChip({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      background: TR_COLORS.lime, color: TR_COLORS.navy,
      padding: '12px 22px', display: 'inline-block',
      fontFamily: FONT_MONO,
      fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700,
      ...style,
    }}>{children}</div>
  );
}
