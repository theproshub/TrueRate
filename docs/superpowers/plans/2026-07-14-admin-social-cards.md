# /admin/social-cards Social Card Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An admin page that generates on-brand social media PNGs (10 formats × terminal/broadsheet variants) prefilled from live site data, per the approved spec `docs/superpowers/specs/2026-07-14-admin-social-cards-design.md`.

**Architecture:** Server component page fetches stories/rates/commodities and hands them to a client "studio" (toolbar + scaled preview + panels). The ten card templates are pixel-perfect TSX ports of the handoff prototypes in `design_handoff_admin_social_cards/`. Export renders the exact previewed DOM node with `html-to-image`.

**Tech Stack:** Next.js App Router (React 19), TypeScript, Tailwind (chrome only — card faces use inline styles verbatim), Supabase (`@/lib/supabase/*`), `html-to-image` (new dep), vitest (node env, tests in `src/__tests__/`).

## Global Constraints

- **Pixel-perfect card faces.** Inline style values in `design_handoff_admin_social_cards/tr_templates.jsx` and `tr_templates2.jsx` are the spec — port them verbatim. Do not "improve" spacing, colors, or sizes.
- **Fonts:** replace prototype font strings with the site's next/font variables. Define once in `shared.tsx`: `FONT_SANS = 'var(--font-inter), Inter, sans-serif'` and `FONT_MONO = 'var(--font-roboto-mono), "Roboto Mono", monospace'`. Never hardcode `'Inter, sans-serif'` / `'Roboto Mono, monospace'` in templates.
- **Wordmark asset:** `/logo-tight.png` (repo `public/logo-tight.png`). The prototype's `uploads/logo-trimmed.png` and `uploads/Logo 1.png` both map to it. Never use `/logo.png` (padded — breaks sizing).
- **Design tokens:** `TR_COLORS = { navy:'#050d11', navy2:'#040f18', lime:'#BFEA36', cream:'#F3F0E8', paper:'#f8f9fa', ink:'#111111', mid:'#8a9aaa', red:'#e11b22', green:'#00a757' }`.
- **Canvas sizes:** feed cards 1080×1350; story 1080×1920; cover 1920×1080.
- **Export:** `html-to-image` `toPng` with `pixelRatio: 1` (exact platform dimensions — decided over the prototype's 3×), `backgroundColor: '#050d11'`, `cacheBust: true`. Filename `truerate-{format}-{yyyy-mm-dd}.png`; explainer slides `truerate-explainer-{1..5}-{yyyy-mm-dd}.png`.
- **localStorage key:** `tr_admin_cards_v1`. Never persist data-URL values > 100 KB. Do not port the prototype's `tr_state_v7` migration shims.
- **No fabricated data:** when `fetchLiveRates()` returns `stale: true`, prefill must refuse and show a status line — never seed rate fields from fallback values.
- **No `alert()`.** All errors render inline.
- **HCI (studio chrome only, not card faces):** every input has a `<label>`, interactive elements get `focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none` (or an inline-style equivalent outline), ≥44px hit areas, panel toggles expose `aria-expanded` + `aria-controls`, Escape closes panels, icon-only buttons get `aria-label`, decorative SVGs get `aria-hidden="true"`.
- **Auth:** `/admin` layout already runs `requireAdmin()`; every server action in `_actions.ts` must also call `await requireAdmin()` first (house pattern, see `src/app/admin/articles/_upload.ts`).
- **Commits:** one per task, message style `[admin] …` matching repo history.
- Run `npm run lint` and `npx tsc --noEmit` before every commit.

## Known prototype discrepancies (resolved decisions)

1. **Variant toggle labels:** `tr_app.jsx:196-198` labels BOTH variant buttons "Terminal". Obvious typo — label them "Terminal" and "Broadsheet".
2. **Footer wordmark height:** README says 64px; the prototype's `TrueRateMark` hardcodes `height: 48` and ignores its `size` prop, so the *reviewed rendering* was 48px. Port verbatim (48px), and flag to Julian at final QA for a call on bumping to 64.
3. **Rubber market row:** the commodities feed (`COMMODITIES` in `src/domain/markets/commodities.ts`) has no rubber. Market-row prefill uses the first three quotes with a finite price; the prototype's row copy is sample content, not a data contract.

---

### Task 1: CORS headers on /api/news and /api/rates

**Files:**
- Modify: `src/app/api/news/route.ts`
- Modify: `src/app/api/rates/route.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: both endpoints emit `Access-Control-Allow-Origin: *` on every response; no other behavior change.

- [ ] **Step 1: Add the header to every `NextResponse.json` call in `/api/news`**

In `src/app/api/news/route.ts` there are three responses. Change each:

```ts
// 429 branch:
return NextResponse.json(
  { error: 'Rate limit exceeded' },
  {
    status: 429,
    headers: {
      ...rateLimitHeaders(remaining, 60, 60_000),
      'Access-Control-Allow-Origin': '*',
    },
  },
);

// error branch:
return NextResponse.json(
  { items: [] },
  { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } },
);

// success branch:
return NextResponse.json(
  { items },
  { headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' } },
);
```

- [ ] **Step 2: Same for `/api/rates`**

`src/app/api/rates/route.ts` has four responses (429, stale, success, catch). Add `'Access-Control-Allow-Origin': '*'` to each, merging with existing headers objects exactly as in Step 1 (the 429 uses `rateLimitHeaders(...)` spread; success merges with its `Cache-Control` header; stale and catch branches gain a `headers` object).

- [ ] **Step 3: Verify against the dev server**

```bash
npm run dev &   # or use the already-running dev server
sleep 8
curl -sI http://localhost:3000/api/news | grep -i access-control
curl -sI http://localhost:3000/api/rates | grep -i access-control
```

Expected: `access-control-allow-origin: *` on both.

- [ ] **Step 4: Lint, typecheck, commit**

```bash
npm run lint && npx tsc --noEmit
git add src/app/api/news/route.ts src/app/api/rates/route.ts
git commit -m "[api] Allow cross-origin GET on /api/news and /api/rates"
```

---

### Task 2: Card state — types, defaults, persistence guards

**Files:**
- Create: `src/app/admin/social-cards/_components/templates/types.ts`
- Create: `src/app/admin/social-cards/_components/state.ts`
- Test: `src/__tests__/social-cards-state.test.ts`

**Interfaces:**
- Consumes: `design_handoff_admin_social_cards/example_state.json` (source for default copy).
- Produces:
  - `TemplateFormat` = `'breaking' | 'article' | 'quote' | 'stat' | 'markets' | 'rate' | 'event' | 'explainer' | 'story' | 'cover'`
  - `TemplateVariant` = `'terminal' | 'broadsheet'`
  - `interface CardTweaks` (all fields below), `TWEAK_DEFAULTS: CardTweaks`, `IMAGE_KEYS: readonly (keyof CardTweaks)[]`
  - `STORAGE_KEY = 'tr_admin_cards_v1'`, `slimForStorage(t: CardTweaks): CardTweaks`, `loadSavedTweaks(raw: string | null): Partial<CardTweaks>`

- [ ] **Step 1: Write the failing tests**

```ts
// src/__tests__/social-cards-state.test.ts
import { describe, it, expect } from 'vitest';
import {
  TWEAK_DEFAULTS,
  IMAGE_KEYS,
} from '@/app/admin/social-cards/_components/templates/types';
import {
  slimForStorage,
  loadSavedTweaks,
  STORAGE_KEY,
} from '@/app/admin/social-cards/_components/state';

describe('social-cards state', () => {
  it('defaults have no baked-in image URLs and start on breaking/terminal slide 0', () => {
    for (const key of IMAGE_KEYS) expect(TWEAK_DEFAULTS[key]).toBe('');
    expect(TWEAK_DEFAULTS.templateType).toBe('breaking');
    expect(TWEAK_DEFAULTS.variant).toBe('terminal');
    expect(TWEAK_DEFAULTS.explainerSlide).toBe(0);
  });

  it('slimForStorage blanks data URLs over 100KB and keeps small values', () => {
    const big = 'data:image/png;base64,' + 'a'.repeat(200_000);
    const slim = slimForStorage({ ...TWEAK_DEFAULTS, breakingImage: big, articleImage: 'https://x/y.webp' });
    expect(slim.breakingImage).toBe('');
    expect(slim.articleImage).toBe('https://x/y.webp');
  });

  it('loadSavedTweaks tolerates garbage and null', () => {
    expect(loadSavedTweaks(null)).toEqual({});
    expect(loadSavedTweaks('{not json')).toEqual({});
    expect(loadSavedTweaks('{"headline":"X"}')).toEqual({ headline: 'X' });
  });

  it('uses the fresh storage key, not the prototype key', () => {
    expect(STORAGE_KEY).toBe('tr_admin_cards_v1');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/__tests__/social-cards-state.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `types.ts`**

`CardTweaks` fields (types exactly):

- strings: `variant` (`TemplateVariant`), `templateType` (`TemplateFormat`), `category`, `headline`, `subtext`, `articleTitle`, `articleExcerpt`, `articleReadTime`, `stat`, `statLabel`, `statContext`, `date`, `marketDate`, `market1Label`, `market1Value`, `market1Change`, … through `market4Change`, `quote`, `quoteAuthor`, `quoteRole`, `quoteContext`, `quoteAccent`, `breakingImage`, `articleImage`, `quoteImage`, `statImage`, `marketsImage`, `rateDate`, `rateValue`, `rateChange`, `rateBuy`, `rateSell`, `rateImage`, `eventKind`, `eventTitle`, `eventDate`, `eventTime`, `eventVenue`, `eventCTA`, `eventImage`, `explainerTitle`, `explainerImage`, `ex1Title`, `ex1Body`, `ex2Title`, `ex2Body`, `ex3Title`, `ex3Body`, `explainerCTA`, `storyImage`, `coverTitle`, `coverImage`
- numbers: `breakingImagePosY`, `articleImagePosY`, `quoteImagePosY`, `statImagePosY`, `marketsImagePosY`, `rateImagePosY`, `eventImagePosY`, `explainerSlide`, `explainerImagePosY`, `storyImagePosY`, `coverImagePosY`
- booleans: `market1Up`…`market4Up`, `rateUp`, `bwPhoto`

`TWEAK_DEFAULTS`: copy every value from `design_handoff_admin_social_cards/example_state.json` verbatim, EXCEPT set all ten `IMAGE_KEYS` to `''` and `explainerSlide` to `0`.

```ts
export const IMAGE_KEYS = [
  'breakingImage', 'articleImage', 'quoteImage', 'statImage', 'marketsImage',
  'rateImage', 'eventImage', 'explainerImage', 'storyImage', 'coverImage',
] as const satisfies readonly (keyof CardTweaks)[];
```

- [ ] **Step 4: Implement `state.ts`**

```ts
// src/app/admin/social-cards/_components/state.ts
import type { CardTweaks } from './templates/types';

export const STORAGE_KEY = 'tr_admin_cards_v1';

/** Don't persist huge inline images — they live in component state for the session. */
export function slimForStorage(tweaks: CardTweaks): CardTweaks {
  const slim = { ...tweaks };
  for (const k of Object.keys(slim) as (keyof CardTweaks)[]) {
    const v = slim[k];
    if (typeof v === 'string' && v.startsWith('data:') && v.length > 100_000) {
      (slim[k] as string) = '';
    }
  }
  return slim;
}

export function loadSavedTweaks(raw: string | null): Partial<CardTweaks> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}
```

- [ ] **Step 5: Run tests to verify pass**

Run: `npx vitest run src/__tests__/social-cards-state.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Lint, typecheck, commit**

```bash
npm run lint && npx tsc --noEmit
git add src/app/admin/social-cards src/__tests__/social-cards-state.test.ts
git commit -m "[admin] Social cards: tweaks schema, defaults, persistence guards"
```

---

### Task 3: Shared template primitives

**Files:**
- Create: `src/app/admin/social-cards/_components/templates/shared.tsx`

**Interfaces:**
- Consumes: `types.ts` (nothing else).
- Produces (all exported): `FONT_SANS`, `FONT_MONO`, `TR_COLORS`, `AutoFitHeadline`, `Logo`, `TrueRateMark`, `PhotoPlaceholder`, `CardFooter`, `MonoChip`. Every later template file imports from here.

- [ ] **Step 1: Port the shared module**

Sources: `tr_templates.jsx:8-118` (AutoFitHeadline, TR_COLORS, Logo, TrueRateMark, PhotoPlaceholder) and `tr_templates2.jsx:8-36` (CardFooter, MonoChip). Style values verbatim; the only changes are TypeScript types, imports, font constants, and the logo path:

```tsx
// src/app/admin/social-cards/_components/templates/shared.tsx
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
        {/* eslint-disable-next-line @next/next/no-img-element -- exported to canvas; next/image would rewrite the URL */}
        <img src={imageUrl} alt={label} crossOrigin="anonymous" style={{
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
```

Note `crossOrigin="anonymous"` on the photo `<img>` — required so `html-to-image` can read Supabase-hosted images into the export canvas. Supabase public storage sends `Access-Control-Allow-Origin: *`.

- [ ] **Step 2: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean. (`textWrap` is valid in @types/react 19's csstype; `imageRendering: 'high-quality'` needs the shown cast.)

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/social-cards/_components/templates/shared.tsx
git commit -m "[admin] Social cards: shared template primitives"
```

---

### Task 4: Templates part 1 — breaking, article, quote, stat, markets + registry

**Files:**
- Create: `src/app/admin/social-cards/_components/templates/breaking.tsx`
- Create: `src/app/admin/social-cards/_components/templates/article.tsx`
- Create: `src/app/admin/social-cards/_components/templates/quote.tsx`
- Create: `src/app/admin/social-cards/_components/templates/stat.tsx`
- Create: `src/app/admin/social-cards/_components/templates/markets.tsx`
- Create: `src/app/admin/social-cards/_components/templates/registry.ts`
- Test: `src/__tests__/social-cards-registry.test.ts`

**Interfaces:**
- Consumes: everything from `shared.tsx`; `CardTweaks`, `TemplateFormat` from `types.ts`.
- Produces:
  - Each template file exports two components typed `({ data }: { data: CardTweaks })` — e.g. `BreakingTerminal`, `BreakingBroadsheet`.
  - `registry.ts` exports `interface TemplateEntry { terminal: ComponentType<{data: CardTweaks}>; broadsheet: ComponentType<{data: CardTweaks}>; label: string; size?: { w: number; h: number } }`, `TR_TEMPLATES: Record<TemplateFormat, TemplateEntry>` and `templateSize(format: TemplateFormat): { w: number; h: number }`.

**Port sources (line ranges in `design_handoff_admin_social_cards/tr_templates.jsx`):**

| Target file | Components | Source lines |
|---|---|---|
| `breaking.tsx` | `BreakingBroadsheet`, `BreakingTerminal` | 124–228 |
| `article.tsx` | `ArticleTerminal`, `ArticleBroadsheet` | 230–342 |
| `quote.tsx` | `QuoteTerminal`, `QuoteBroadsheet` | 344–488 |
| `stat.tsx` | `StatTerminal`, `StatBroadsheet` | 490–634 |
| `markets.tsx` | `MarketRow` (not exported), `MarketsTerminal`, `MarketsBroadsheet` | 636–796 |

**Mechanical port rules (apply to every template file in Tasks 4 and 5):**

1. File header: `import type { CSSProperties } from 'react';` as needed, plus
   `import { AutoFitHeadline, CardFooter, MonoChip, PhotoPlaceholder, TrueRateMark, Logo, TR_COLORS, FONT_SANS, FONT_MONO } from './shared';` (only what the file uses) and `import type { CardTweaks } from './types';`. No `'use client'` needed (no hooks in template bodies; they render inside the client studio).
2. Prop signature: `function BreakingTerminal({ data }: { data: CardTweaks }) { … }`.
3. Replace every `fontFamily: 'Inter, sans-serif'` → `FONT_SANS`, `fontFamily: 'Roboto Mono, monospace'` → `FONT_MONO`.
4. Replace `TR_COLORS.x` references and any `C.x` (from `const C = window.TR_COLORS`) with the imported `TR_COLORS`. A local `const C = TR_COLORS;` at the top of the file is fine and keeps diffs minimal.
5. **Every other style value stays byte-identical.** Gradients, px values, opacities, letter-spacings — verbatim.
6. Boolean-ish data reads (`data.market1Up`) keep prototype semantics.
7. Where the prototype reads a nonstandard CSS value, cast as in `shared.tsx`.

- [ ] **Step 1: Write the failing registry test**

```ts
// src/__tests__/social-cards-registry.test.ts
import { describe, it, expect } from 'vitest';
import { TR_TEMPLATES, templateSize } from '@/app/admin/social-cards/_components/templates/registry';

const PART1 = ['breaking', 'article', 'quote', 'stat', 'markets'] as const;

describe('social-cards template registry', () => {
  it('registers part-1 formats with both variants and labels', () => {
    for (const key of PART1) {
      const entry = TR_TEMPLATES[key];
      expect(entry, key).toBeDefined();
      expect(typeof entry.terminal).toBe('function');
      expect(typeof entry.broadsheet).toBe('function');
      expect(entry.label.length).toBeGreaterThan(0);
    }
  });

  it('feed cards default to 1080×1350', () => {
    expect(templateSize('breaking')).toEqual({ w: 1080, h: 1350 });
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/__tests__/social-cards-registry.test.ts`
Expected: FAIL — registry module not found.

- [ ] **Step 3: Port the five template files** applying the rules above to the listed line ranges. Labels for the registry come from `tr_templates.jsx:798-804`: breaking "Breaking", article "Article", quote "Quote", stat "Big Stat", markets "Markets".

- [ ] **Step 4: Create `registry.ts`** (part-1 entries only; Task 5 completes it):

```ts
import type { ComponentType } from 'react';
import type { CardTweaks, TemplateFormat } from './types';
import { BreakingTerminal, BreakingBroadsheet } from './breaking';
import { ArticleTerminal, ArticleBroadsheet } from './article';
import { QuoteTerminal, QuoteBroadsheet } from './quote';
import { StatTerminal, StatBroadsheet } from './stat';
import { MarketsTerminal, MarketsBroadsheet } from './markets';

export interface TemplateEntry {
  terminal: ComponentType<{ data: CardTweaks }>;
  broadsheet: ComponentType<{ data: CardTweaks }>;
  label: string;
  size?: { w: number; h: number };
}

// Task 5 fills in rate/event/explainer/story/cover.
export const TR_TEMPLATES = {
  breaking: { terminal: BreakingTerminal, broadsheet: BreakingBroadsheet, label: 'Breaking' },
  article: { terminal: ArticleTerminal, broadsheet: ArticleBroadsheet, label: 'Article' },
  quote: { terminal: QuoteTerminal, broadsheet: QuoteBroadsheet, label: 'Quote' },
  stat: { terminal: StatTerminal, broadsheet: StatBroadsheet, label: 'Big Stat' },
  markets: { terminal: MarketsTerminal, broadsheet: MarketsBroadsheet, label: 'Markets' },
} as Record<TemplateFormat, TemplateEntry>;

export function templateSize(format: TemplateFormat): { w: number; h: number } {
  return TR_TEMPLATES[format]?.size ?? { w: 1080, h: 1350 };
}
```

(The `as Record<…>` cast is temporary until Task 5 completes the map — leave a `// Task 5` comment.)

- [ ] **Step 5: Run tests, typecheck, lint**

Run: `npx vitest run src/__tests__/social-cards-registry.test.ts && npx tsc --noEmit && npm run lint`
Expected: PASS / clean.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/social-cards/_components/templates src/__tests__/social-cards-registry.test.ts
git commit -m "[admin] Social cards: breaking/article/quote/stat/markets templates"
```

---

### Task 5: Templates part 2 — rate, event, explainer, story, cover; complete registry

**Files:**
- Create: `src/app/admin/social-cards/_components/templates/rate.tsx`
- Create: `src/app/admin/social-cards/_components/templates/event.tsx`
- Create: `src/app/admin/social-cards/_components/templates/explainer.tsx`
- Create: `src/app/admin/social-cards/_components/templates/story.tsx`
- Create: `src/app/admin/social-cards/_components/templates/cover.tsx`
- Modify: `src/app/admin/social-cards/_components/templates/registry.ts`
- Modify test: `src/__tests__/social-cards-registry.test.ts`

**Interfaces:**
- Consumes: `shared.tsx`, `types.ts` (same rules as Task 4).
- Produces: `RateTerminal/RateBroadsheet`, `EventTerminal/EventBroadsheet`, `ExplainerTerminal/ExplainerBroadsheet`, `StoryTerminal/StoryBroadsheet`, `CoverTerminal/CoverBroadsheet`; completed `TR_TEMPLATES` (cast removed) with `story: size {1080,1920}`, `cover: size {1920,1080}`.

**Port sources (line ranges in `design_handoff_admin_social_cards/tr_templates2.jsx`; same mechanical rules as Task 4):**

| Target file | Components | Source lines |
|---|---|---|
| `rate.tsx` | `RateCore` (private), `RateTerminal`, `RateBroadsheet` | 41–112 |
| `event.tsx` | `EventTerminal`, `EventBroadsheet` | 117–201 |
| `explainer.tsx` | `ExplainerCore` (private), `ExplainerTerminal`, `ExplainerBroadsheet` | 203–309 |
| `story.tsx` | `StoryCore` (private), `StoryTerminal`, `StoryBroadsheet` | 314–364 |
| `cover.tsx` | `CoverTerminal`, `CoverBroadsheet` | 369–450 |

Extra rule for this file set: `const C = window.TR_COLORS;` (line 5) becomes `const C = TR_COLORS;` from the shared import. `ExplainerCore` reads `data.explainerSlide` (number 0–4) — keep `Number(...)` coercions exactly as written.

- [ ] **Step 1: Extend the registry test (failing first)**

Replace `PART1` usage with all ten formats and add size assertions:

```ts
const ALL = ['breaking', 'article', 'quote', 'stat', 'markets', 'rate', 'event', 'explainer', 'story', 'cover'] as const;
// … same per-entry assertions over ALL …

it('story and cover carry explicit sizes', () => {
  expect(templateSize('story')).toEqual({ w: 1080, h: 1920 });
  expect(templateSize('cover')).toEqual({ w: 1920, h: 1080 });
  expect(templateSize('rate')).toEqual({ w: 1080, h: 1350 });
});
```

Run: `npx vitest run src/__tests__/social-cards-registry.test.ts` — expected FAIL (missing formats).

- [ ] **Step 2: Port the five files** per the table; registry labels/sizes from `tr_templates2.jsx:452-458`: rate "Daily Rate", event "Event", explainer "Explainer", story "Story" (size 1080×1920), cover "Video Cover" (size 1920×1080).

- [ ] **Step 3: Complete `registry.ts`** — add the five entries, remove the `as Record<…>` cast so the object literal is checked exhaustively:

```ts
export const TR_TEMPLATES: Record<TemplateFormat, TemplateEntry> = {
  /* part 1 entries unchanged */
  rate: { terminal: RateTerminal, broadsheet: RateBroadsheet, label: 'Daily Rate' },
  event: { terminal: EventTerminal, broadsheet: EventBroadsheet, label: 'Event' },
  explainer: { terminal: ExplainerTerminal, broadsheet: ExplainerBroadsheet, label: 'Explainer' },
  story: { terminal: StoryTerminal, broadsheet: StoryBroadsheet, label: 'Story', size: { w: 1080, h: 1920 } },
  cover: { terminal: CoverTerminal, broadsheet: CoverBroadsheet, label: 'Video Cover', size: { w: 1920, h: 1080 } },
};
```

- [ ] **Step 4: Run tests, typecheck, lint** — `npx vitest run src/__tests__/social-cards-registry.test.ts && npx tsc --noEmit && npm run lint` — expected PASS / clean.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/social-cards/_components/templates src/__tests__/social-cards-registry.test.ts
git commit -m "[admin] Social cards: rate/event/explainer/story/cover templates"
```

---

### Task 6: Prefill mapping (stories, rates, commodities)

**Files:**
- Create: `src/app/admin/social-cards/_components/prefill.ts`
- Test: `src/__tests__/social-cards-prefill.test.ts`

**Interfaces:**
- Consumes: `CardTweaks` from `templates/types`; `CommodityQuote` from `@/domain/markets/commodities`.
- Produces:
  - `interface StoryItem { slug: string; title: string; summary: string; category: string; source: string; image?: string }` (same shape `/api/news` emits)
  - `TR_CAT_MAP: Record<string, string>`
  - `storyEdits(s: StoryItem): Partial<CardTweaks>`
  - `rateEdits(lookup: Record<string, number>, dateLabel: string): Partial<CardTweaks>`
  - `marketEdits(lookup: Record<string, number>, commodities: CommodityQuote[], dateLabel: string): Partial<CardTweaks>`

- [ ] **Step 1: Write the failing tests**

```ts
// src/__tests__/social-cards-prefill.test.ts
import { describe, it, expect } from 'vitest';
import { storyEdits, rateEdits, marketEdits } from '@/app/admin/social-cards/_components/prefill';
import type { CommodityQuote } from '@/domain/markets/commodities';

describe('storyEdits', () => {
  it('maps title, category, summary, and image to card fields', () => {
    const e = storyEdits({
      slug: 'vat-overhaul', title: 'VAT Set to Replace GST', summary: 'Big change.',
      category: 'policy', source: 'TrueRate', image: 'https://x/hero.webp',
    });
    expect(e.headline).toBe('VAT Set to Replace GST');
    expect(e.articleTitle).toBe('VAT Set to Replace GST');
    expect(e.coverTitle).toBe('VAT Set to Replace GST');
    expect(e.category).toBe('Economy');          // policy → Economy via TR_CAT_MAP
    expect(e.subtext).toBe('Big change.');
    expect(e.articleExcerpt).toBe('Big change.');
    expect(e.breakingImage).toBe('https://x/hero.webp');
    expect(e.articleImage).toBe('https://x/hero.webp');
    expect(e.coverImage).toBe('https://x/hero.webp');
  });

  it('defaults unknown categories to News and omits image keys when absent', () => {
    const e = storyEdits({ slug: 's', title: 'T', summary: '', category: 'weird', source: 'TrueRate' });
    expect(e.category).toBe('News');
    expect('breakingImage' in e).toBe(false);
    expect('subtext' in e).toBe(false);
  });
});

describe('rateEdits', () => {
  it('fills value and dates from the USD lookup, leaves change/buy/sell alone', () => {
    const e = rateEdits({ LRD: 1, USD: 183.9312 }, 'Jul 14, 2026');
    expect(e.rateValue).toBe('183.93');
    expect(e.rateDate).toBe('Jul 14, 2026');
    expect(e.market1Label).toBe('LRD / USD');
    expect(e.market1Value).toBe('183.93');
    expect('rateChange' in e).toBe(false);
    expect('rateBuy' in e).toBe(false);
  });

  it('returns {} when USD is missing (stale/failed feed — no fabricated data)', () => {
    expect(rateEdits({ LRD: 1 }, 'Jul 14, 2026')).toEqual({});
  });
});

describe('marketEdits', () => {
  const q = (name: string, unit: string, price: number | null, changePercent: number | null): CommodityQuote =>
    ({ name, symbol: 'X', unit, note: '', price, prevClose: null, date: null, change: null, changePercent });

  it('fills rows 2-4 from the first three priced quotes', () => {
    const e = marketEdits({ LRD: 1, USD: 183.93 }, [
      q('Gold', '$/oz', 2285.4, 0.82),
      q('Brent crude', '$/bbl', null, null),      // skipped: no price
      q('Cocoa', '$/t', 8123, -1.2),
      q('Coffee', '¢/lb', 301.5, 0),
    ], 'Jul 14, 2026 · Close');
    expect(e.marketDate).toBe('Jul 14, 2026 · Close');
    expect(e.market2Label).toBe('Gold ($/oz)');
    expect(e.market2Value).toBe('2,285.40');
    expect(e.market2Change).toBe('0.82%');
    expect(e.market2Up).toBe(true);
    expect(e.market3Label).toBe('Cocoa ($/t)');
    expect(e.market3Up).toBe(false);
    expect(e.market4Label).toBe('Coffee (¢/lb)');
    expect(e.market4Up).toBe(true);               // 0 counts as up (flat)
  });
});
```

- [ ] **Step 2: Run to verify failure** — `npx vitest run src/__tests__/social-cards-prefill.test.ts` — FAIL (module not found).

- [ ] **Step 3: Implement `prefill.ts`**

```ts
// src/app/admin/social-cards/_components/prefill.ts
import type { CardTweaks } from './templates/types';
import type { CommodityQuote } from '@/domain/markets/commodities';

export interface StoryItem {
  slug: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  image?: string;
}

/** Site category slug → card chip label (from the handoff's tr_sync.jsx). */
export const TR_CAT_MAP: Record<string, string> = {
  economy: 'Economy', markets: 'Markets', business: 'Business',
  technology: 'Technology', analytics: 'Analytics', news: 'News',
  videos: 'Videos', finance: 'Markets', policy: 'Economy',
  banking: 'Markets', investing: 'Markets', commodities: 'Markets', forex: 'Markets',
};

const LONG_DATE = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export function storyEdits(s: StoryItem): Partial<CardTweaks> {
  const edits: Partial<CardTweaks> = {
    headline: s.title, articleTitle: s.title, coverTitle: s.title,
    category: TR_CAT_MAP[(s.category || '').toLowerCase()] || 'News',
    date: LONG_DATE.format(new Date()),
  };
  if (s.summary) { edits.subtext = s.summary; edits.articleExcerpt = s.summary; }
  if (s.image) { edits.breakingImage = s.image; edits.articleImage = s.image; edits.coverImage = s.image; }
  return edits;
}

/**
 * Daily Rate prefill from /api/rates-style lookup (LRD per 1 X).
 * Change %, bank buy/sell have no live source — left for the editor.
 * Returns {} when USD/LRD is unavailable: never seed from stale data.
 */
export function rateEdits(lookup: Record<string, number>, dateLabel: string): Partial<CardTweaks> {
  const usd = lookup.USD;
  if (typeof usd !== 'number' || !Number.isFinite(usd)) return {};
  const value = usd.toFixed(2);
  return {
    rateValue: value, rateDate: dateLabel,
    market1Label: 'LRD / USD', market1Value: value,
  };
}

const NUM = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Markets card prefill: row 1 = LRD/USD, rows 2–4 = first priced commodities. */
export function marketEdits(
  lookup: Record<string, number>,
  commodities: CommodityQuote[],
  dateLabel: string,
): Partial<CardTweaks> {
  const edits: Partial<CardTweaks> = { marketDate: dateLabel, ...rateEdits(lookup, dateLabel) };
  delete edits.rateValue;
  delete edits.rateDate;

  const priced = commodities.filter(
    (c) => typeof c.price === 'number' && Number.isFinite(c.price),
  ).slice(0, 3);

  priced.forEach((c, i) => {
    const n = i + 2; // rows 2..4
    (edits as Record<string, unknown>)[`market${n}Label`] = `${c.name} (${c.unit})`;
    (edits as Record<string, unknown>)[`market${n}Value`] = NUM.format(c.price as number);
    if (typeof c.changePercent === 'number' && Number.isFinite(c.changePercent)) {
      (edits as Record<string, unknown>)[`market${n}Change`] = `${Math.abs(c.changePercent).toFixed(2)}%`;
      (edits as Record<string, unknown>)[`market${n}Up`] = c.changePercent >= 0;
    }
  });
  return edits;
}
```

- [ ] **Step 4: Run tests to verify pass** — `npx vitest run src/__tests__/social-cards-prefill.test.ts` — PASS.

- [ ] **Step 5: Lint, typecheck, commit**

```bash
npm run lint && npx tsc --noEmit
git add src/app/admin/social-cards/_components/prefill.ts src/__tests__/social-cards-prefill.test.ts
git commit -m "[admin] Social cards: story/rate/commodity prefill mapping"
```

---

### Task 7: Server data — `_actions.ts` and `page.tsx`

**Files:**
- Create: `src/app/admin/social-cards/_actions.ts`
- Create: `src/app/admin/social-cards/page.tsx`
- Create (placeholder for compile): `src/app/admin/social-cards/_components/SocialCardStudio.tsx` (minimal shell; Task 8 builds it out)

**Interfaces:**
- Consumes: `publicClient` from `@/lib/supabase/public`; `createAdminClient` from `@/lib/supabase/admin`; `requireAdmin` from `@/lib/auth/admin`; `fetchLiveRates`, `toLRDRates` from `@/domain/markets/exchange`; `fetchCommodities`, `CommodityQuote` from `@/domain/markets/commodities`; `StoryItem` from `_components/prefill`.
- Produces (server actions, all `requireAdmin()`-gated):
  - `refreshStories(): Promise<StoryItem[]>` — first 12 published articles
  - `refreshRates(): Promise<RatesPayload>` where `interface RatesPayload { date: string | null; lookup: Record<string, number>; stale: boolean }`
  - `refreshCommodities(): Promise<CommodityQuote[]>`
  - `listStorageImages(): Promise<{ name: string; url: string }[]>` — `article-images` bucket, `heroes/` folder, newest 60
  - `page.tsx` renders `<SocialCardStudio initialStories={…} initialRates={…} initialCommodities={…} />` and exports `metadata = { title: 'Social Cards' }`.

- [ ] **Step 1: Implement `_actions.ts`**

```ts
'use server';

import { publicClient } from '@/lib/supabase/public';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin';
import { fetchLiveRates, toLRDRates } from '@/domain/markets/exchange';
import { fetchCommodities, type CommodityQuote } from '@/domain/markets/commodities';
import type { StoryItem } from './_components/prefill';

const BUCKET = 'article-images';
const HERO_FOLDER = 'heroes';

export interface RatesPayload {
  date: string | null;
  lookup: Record<string, number>;
  stale: boolean;
}

/** Same query as /api/news, limited to the 12 the panel shows. */
export async function refreshStories(): Promise<StoryItem[]> {
  await requireAdmin();
  const { data, error } = await publicClient
    .from('articles')
    .select('slug, title, dek, source_name, hero_image, category:categories(slug)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(12);
  if (error || !data) return [];
  return data.map((a) => ({
    slug: a.slug,
    title: a.title,
    summary: a.dek ?? '',
    category: (a.category as { slug: string } | null)?.slug ?? 'economy',
    source: a.source_name ?? 'TrueRate',
    image: a.hero_image ?? undefined,
  }));
}

export async function refreshRates(): Promise<RatesPayload> {
  await requireAdmin();
  try {
    const live = await fetchLiveRates();
    if (live.stale) return { date: null, lookup: {}, stale: true };
    return { date: live.date, lookup: toLRDRates(live), stale: false };
  } catch {
    return { date: null, lookup: {}, stale: true };
  }
}

export async function refreshCommodities(): Promise<CommodityQuote[]> {
  await requireAdmin();
  try {
    return await fetchCommodities();
  } catch {
    return [];
  }
}

/** Newest hero images from the article-images bucket, as public URLs. */
export async function listStorageImages(): Promise<{ name: string; url: string }[]> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(HERO_FOLDER, { limit: 60, sortBy: { column: 'created_at', order: 'desc' } });
  if (error || !data) return [];
  return data
    .filter((f) => f.name && !f.name.startsWith('.'))
    .map((f) => ({
      name: f.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(`${HERO_FOLDER}/${f.name}`).data.publicUrl,
    }));
}
```

Adjust the Supabase select-result typing to satisfy `tsc` the same way `src/app/api/news/route.ts` does (explicit row type on the map callback) if inference falls short.

- [ ] **Step 2: Placeholder `SocialCardStudio.tsx`** (compiles now, replaced in Task 8):

```tsx
'use client';

import type { CommodityQuote } from '@/domain/markets/commodities';
import type { StoryItem } from './prefill';
import type { RatesPayload } from '../_actions';

export interface StudioProps {
  initialStories: StoryItem[];
  initialRates: RatesPayload;
  initialCommodities: CommodityQuote[];
}

export default function SocialCardStudio(props: StudioProps) {
  return <p className="text-gray-400">Studio loading… ({props.initialStories.length} stories)</p>;
}
```

- [ ] **Step 3: Implement `page.tsx`**

```tsx
import SocialCardStudio from './_components/SocialCardStudio';
import { refreshStories, refreshRates, refreshCommodities } from './_actions';

export const metadata = { title: 'Social Cards' };
export const dynamic = 'force-dynamic';

export default async function SocialCardsPage() {
  // Layout already ran requireAdmin(); actions re-check per call.
  const [stories, rates, commodities] = await Promise.all([
    refreshStories(),
    refreshRates(),
    refreshCommodities(),
  ]);

  return (
    <SocialCardStudio
      initialStories={stories}
      initialRates={rates}
      initialCommodities={commodities}
    />
  );
}
```

(The actions never throw — they degrade to `[]` / `stale: true` — so `Promise.all` is safe.)

- [ ] **Step 4: Verify the page renders**

```bash
npx tsc --noEmit && npm run lint
```

Then load `http://localhost:3000/admin/social-cards` in the dev server as an admin: expect the placeholder line with a story count > 0.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/social-cards
git commit -m "[admin] Social cards: server data actions and page shell"
```

---

### Task 8: Studio shell — toolbar, preview, slide nav

**Files:**
- Rewrite: `src/app/admin/social-cards/_components/SocialCardStudio.tsx`
- Create: `src/app/admin/social-cards/_components/usePersistedTweaks.ts`

**Interfaces:**
- Consumes: `TR_TEMPLATES`, `templateSize` from `templates/registry`; `TWEAK_DEFAULTS`, `CardTweaks`, `TemplateFormat`, `TemplateVariant` from `templates/types`; `STORAGE_KEY`, `slimForStorage`, `loadSavedTweaks` from `state`; `StudioProps` (unchanged from Task 7).
- Produces:
  - `usePersistedTweaks(): { tweaks: CardTweaks; setTweak: <K extends keyof CardTweaks>(key: K, value: CardTweaks[K]) => void; applyMany: (edits: Partial<CardTweaks>) => void }`
  - Studio renders: top toolbar (format buttons, variant toggle, Pull-from-Site toggle, Tweaks toggle, Export button slot), the scaled preview with `id="tr-export-target"` on the **unscaled** inner node, explainer slide nav (`C/1/2/3/E` + arrows), dimension caption. Panels mount in Tasks 9–10; export wires in Task 11 — until then the Export button renders disabled with `aria-disabled`.

- [ ] **Step 1: Implement `usePersistedTweaks.ts`**

```ts
'use client';

import { useEffect, useState } from 'react';
import { TWEAK_DEFAULTS, type CardTweaks } from './templates/types';
import { STORAGE_KEY, slimForStorage, loadSavedTweaks } from './state';

export function usePersistedTweaks() {
  const [tweaks, setTweaks] = useState<CardTweaks>(TWEAK_DEFAULTS);

  // Hydrate from localStorage after mount (server render uses defaults).
  useEffect(() => {
    const saved = loadSavedTweaks(localStorage.getItem(STORAGE_KEY));
    if (Object.keys(saved).length) setTweaks((prev) => ({ ...prev, ...saved }));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slimForStorage(tweaks)));
    } catch {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* quota — give up */ }
    }
  }, [tweaks]);

  const setTweak = <K extends keyof CardTweaks>(key: K, value: CardTweaks[K]) =>
    setTweaks((prev) => ({ ...prev, [key]: value }));
  const applyMany = (edits: Partial<CardTweaks>) =>
    setTweaks((prev) => ({ ...prev, ...edits }));

  return { tweaks, setTweak, applyMany };
}
```

- [ ] **Step 2: Build the studio**

Port the layout of `App()` in `tr_app.jsx:154-275` minus the postMessage/edit-mode plumbing (lines 118-144 — drop entirely) and minus localStorage migrations (86-98 — drop). Structure:

```tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { CommodityQuote } from '@/domain/markets/commodities';
import type { StoryItem } from './prefill';
import type { RatesPayload } from '../_actions';
import { TR_TEMPLATES, templateSize } from './templates/registry';
import type { TemplateFormat, TemplateVariant } from './templates/types';
import { usePersistedTweaks } from './usePersistedTweaks';

export interface StudioProps {
  initialStories: StoryItem[];
  initialRates: RatesPayload;
  initialCommodities: CommodityQuote[];
}

export default function SocialCardStudio({ initialStories, initialRates, initialCommodities }: StudioProps) {
  const { tweaks, setTweak, applyMany } = usePersistedTweaks();
  const [showTweaks, setShowTweaks] = useState(false);
  const [showSync, setShowSync] = useState(false);

  // Escape closes whichever panel is open (HCI).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowTweaks(false); setShowSync(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const format = tweaks.templateType as TemplateFormat;
  const variant = (tweaks.variant === 'broadsheet' ? 'broadsheet' : 'terminal') as TemplateVariant;
  const Template = TR_TEMPLATES[format]?.[variant] ?? TR_TEMPLATES.breaking.terminal;
  const DIM = templateSize(format);
  const SCALE = Math.min(560 / DIM.w, 700 / DIM.h);

  return (/* toolbar + preview + caption + panels; see notes below */);
}
```

Rendering notes (follow `tr_app.jsx` for all visual values):

- Keep the toolbar's dark chrome inline styles from the prototype, with these HCI upgrades on every `<button>`: minimum `minHeight: 44` via padding, plus `className="focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none"`.
- Toolbar wordmark: `<Image src="/logo-tight.png" alt="TrueRate" width={88} height={22} style={{ height: 22, width: 'auto', filter: 'brightness(0) invert(1)' }} />`.
- Variant toggle: two buttons labelled **Terminal** and **Broadsheet** (fixes prototype typo), `aria-pressed` reflecting selection.
- Panel toggles: `aria-expanded={showSync}` / `aria-expanded={showTweaks}` and `aria-controls="tr-sync-panel"` / `"tr-tweaks-panel"`.
- Preview block: outer div sized `DIM.w * SCALE × DIM.h * SCALE`; inner `<div id="tr-export-target" style={{ transform: `scale(${SCALE})`, transformOrigin: 'top left', width: DIM.w, height: DIM.h, position: 'absolute', top: 0, left: 0, boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(191,234,54,0.1)' }}><Template data={tweaks} /></div>`.
- Explainer slide nav (only when `format === 'explainer'`): arrows + 5 buttons `C 1 2 3 E` setting `explainerSlide` 0–4, per `tr_app.jsx:247-259`, each with `aria-label` ("Cover slide", "Point 1", …, "Outro slide") and `aria-pressed`.
- Dimension caption per `tr_app.jsx:262-268`.
- A visually-hidden paragraph describing the preview for screen readers: `<p className="sr-only">Preview of the {label} card, {DIM.w} by {DIM.h} pixels.</p>`.
- The studio escapes the admin container width: wrap in `<div className="-mx-4">` if needed so the dark canvas reads as a full-bleed workspace (match sibling admin pages' spacing conventions; don't fight the layout's `max-w-container`).

- [ ] **Step 3: Verify in the browser**

Load `/admin/social-cards`: all ten format buttons render and switch templates; variant toggle works; explainer nav appears only for Explainer; story/cover previews change aspect. Tab through the toolbar — focus visible on every button; Escape closes panels (once they exist).

- [ ] **Step 4: Lint, typecheck, tests, commit**

```bash
npm run lint && npx tsc --noEmit && npx vitest run
git add src/app/admin/social-cards/_components
git commit -m "[admin] Social cards: studio shell with preview and toolbar"
```

---

### Task 9: TweaksPanel with labeled inputs, image upload, crop slider

**Files:**
- Create: `src/app/admin/social-cards/_components/TweaksPanel.tsx`
- Modify: `src/app/admin/social-cards/_components/SocialCardStudio.tsx` (mount panel)

**Interfaces:**
- Consumes: `CardTweaks` and setters from the studio: `({ tweaks, setTweak, onPickFromSite }: { tweaks: CardTweaks; setTweak: <K extends keyof CardTweaks>(k: K, v: CardTweaks[K]) => void; onPickFromSite?: () => void })`. `CATEGORIES = ['News','Markets','Economy','Analytics','Business','Technology','Videos']`.
- Produces: `<TweaksPanel …/>` rendered when `showTweaks`, `id="tr-tweaks-panel"`, `role="region"`, `aria-label="Card tweaks"`. Also exports `StoragePickerSlot` hook point used in Task 10 (a `children`-style render slot inside the image section: prop `storagePicker?: ReactNode`).

- [ ] **Step 1: Port the panel**

Source: `TweaksPanel` + field components in `tr_app.jsx:277-572`. Port the conditional-section logic (`showField`, `imageSlot` maps) and all styling verbatim, with these deltas:

1. Every `TwInput`/`TwTextarea`/`TwSelect`/`TwColor`/`TwSlider`/file input gets a real `<label htmlFor={id}>` (generate ids with `useId()`); keep the visual label style (`twLabel`).
2. All interactive elements: `focus-visible` ring classes as in Task 8; buttons ≥44px hit area (the small ▲/▼ toggles get invisible padding, not visual growth: wrap in a 44×44 flex button with the visible square inside).
3. `TwImageUpload` keeps FileReader→data-URL behavior verbatim (`tr_app.jsx:519-572`) and gains a `storagePicker` render slot directly below the Upload/Clear row (Task 10 fills it).
4. The ▲/▼ direction toggles get `aria-label={`Direction: ${up ? 'up' : 'down'}`}` and `aria-pressed`.
5. Panel container: keep prototype position/size styles; add `id="tr-tweaks-panel"`, `role="region"`, `aria-label="Card tweaks"`.

- [ ] **Step 2: Mount in the studio** — `{showTweaks && <TweaksPanel tweaks={tweaks} setTweak={setTweak} storagePicker={null} />}` and make the toolbar Tweaks toggle target it.

- [ ] **Step 3: Verify in the browser** — for each of the ten formats, the panel shows the right sections (e.g. Quote fields only on Quote; Markets rows on markets/article/breaking per the `showField` map); editing a headline live-updates the preview; uploading an image shows it on the card; the crop slider moves `object-position`; keyboard-only operation works.

- [ ] **Step 4: Lint, typecheck, commit**

```bash
npm run lint && npx tsc --noEmit
git add src/app/admin/social-cards/_components
git commit -m "[admin] Social cards: tweaks panel with per-format fields"
```

---

### Task 10: SyncPanel (Pull from Site) + StoragePicker

**Files:**
- Create: `src/app/admin/social-cards/_components/SyncPanel.tsx`
- Create: `src/app/admin/social-cards/_components/StoragePicker.tsx`
- Modify: `src/app/admin/social-cards/_components/SocialCardStudio.tsx` (mount SyncPanel, pass StoragePicker into TweaksPanel)

**Interfaces:**
- Consumes: `storyEdits`, `rateEdits`, `marketEdits`, `StoryItem` from `prefill`; server actions `refreshStories`, `refreshRates`, `refreshCommodities`, `listStorageImages` from `../_actions`; studio props (`initialStories`, `initialRates`, `initialCommodities`).
- Produces:
  - `SyncPanel({ stories, rates, commodities, onApply, onClose })` — `onApply: (edits: Partial<CardTweaks>) => void`; `id="tr-sync-panel"`, `role="region"`, `aria-label="Pull from site"`.
  - `StoragePicker({ onSelect }: { onSelect: (url: string) => void })` — loads on first expand, renders a thumbnail grid.

- [ ] **Step 1: Build `SyncPanel`**

Model on the prototype's `SyncPanel` (`tr_sync.jsx:28` onward) but with server data instead of proxy fetches:

- Initial props render immediately (no loading state on first paint).
- A "Refresh" button (`aria-label="Refresh stories and rates"`) calls the three server actions via `useTransition`, replacing local state; on failure shows an inline status line.
- Story list: up to 12 rows, each a button "Use this story" applying `onApply(storyEdits(story))` then `onClose()` (prototype behavior: applying a story closes the panel).
- Rates block: shows `USD → LRD {lookup.USD}` and an "Apply to Daily Rate card" button → `onApply({ ...rateEdits(lookup, shortDate), templateType: 'rate' })`. When `rates.stale` or `lookup.USD` missing: render `Live rates unavailable — refusing to prefill from stale data.` and no button (**no fabricated data**).
- Markets block: "Apply to Markets card" → `onApply({ ...marketEdits(lookup, commodities, marketDateLabel), templateType: 'markets' })`, same stale guard. `shortDate` = `new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date())`; `marketDateLabel` = `${shortDate} · Latest`.
- Visual style: match the TweaksPanel chrome (dark panel, mono section headers) — the prototype's own sync panel styling.

- [ ] **Step 2: Build `StoragePicker`**

```tsx
'use client';

import { useState, useTransition } from 'react';
import { listStorageImages } from '../_actions';

export default function StoragePicker({ onSelect }: { onSelect: (url: string) => void }) {
  const [images, setImages] = useState<{ name: string; url: string }[] | null>(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const load = () => startTransition(async () => {
    try {
      setError('');
      setImages(await listStorageImages());
    } catch {
      setError('Could not list site images — try again.');
    }
  });

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="tr-storage-grid"
        className="focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none"
        onClick={() => { setOpen(!open); if (!open && images === null) load(); }}
        /* style: match the panel's secondary-button chrome */
      >
        Browse site images
      </button>
      {open && (
        <div id="tr-storage-grid">
          {pending && <p>Loading…</p>}
          {error && <p role="alert">{error} <button type="button" onClick={load}>Retry</button></p>}
          {images?.length === 0 && <p>No images in the bucket.</p>}
          {!!images?.length && (
            <ul /* 3-col grid, gap 6 */>
              {images.map((img) => (
                <li key={img.name}>
                  <button type="button" aria-label={`Use image ${img.name}`} onClick={() => onSelect(img.url)}>
                    <img src={img.url} alt="" loading="lazy" /* h-16 w-full object-cover */ />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
```

(Style the grid to match the panel; the structure and a11y attributes above are the contract.)

- [ ] **Step 3: Wire into the studio** — mount `{showSync && <SyncPanel stories={…} rates={…} commodities={…} onApply={applyMany} onClose={() => setShowSync(false)} />}`; pass `storagePicker={<StoragePicker onSelect={(url) => setTweak(imageSlotKeyForCurrentFormat, url)} />}` into TweaksPanel (the panel already knows the current format's image key from its `imageSlot` map — pass the picker a callback that panel wires to that key).

- [ ] **Step 4: Verify in the browser** — Pull-from-Site lists real published articles; applying one fills headline/chip/image across breaking/article/cover; Apply-to-rate fills the Daily Rate card with the live CBL mid; storage picker browses real bucket images and sets the current card's image; stale-rate path (disconnect network or stub) shows the refusal line.

- [ ] **Step 5: Lint, typecheck, tests, commit**

```bash
npm run lint && npx tsc --noEmit && npx vitest run
git add src/app/admin/social-cards/_components
git commit -m "[admin] Social cards: pull-from-site panel and storage picker"
```

---

### Task 11: PNG export

**Files:**
- Create: `src/app/admin/social-cards/_components/export.ts`
- Create: `src/app/admin/social-cards/_components/ExportButton.tsx`
- Modify: `src/app/admin/social-cards/_components/SocialCardStudio.tsx` (replace disabled export slot)
- Modify: `package.json` (+ `html-to-image`)
- Test: `src/__tests__/social-cards-export.test.ts`

**Interfaces:**
- Consumes: `templateSize`, `TemplateFormat` from `templates/registry`/`types`; the `#tr-export-target` node contract from Task 8; `setTweak('explainerSlide', n)` for the carousel loop.
- Produces:
  - `makeFilename(format: TemplateFormat, date: Date, slide?: number): string`
  - `exportNodeAsPng(node: HTMLElement, size: { w: number; h: number }, filename: string): Promise<void>`
  - `ExportButton({ format, onSetSlide }: { format: TemplateFormat; onSetSlide: (n: number) => void })` — renders the lime "Download PNG" toolbar button, inline error `<p role="alert">` on failure, busy state while exporting.

- [ ] **Step 1: Install the dependency**

```bash
npm install html-to-image
```

- [ ] **Step 2: Write the failing filename test**

```ts
// src/__tests__/social-cards-export.test.ts
import { describe, it, expect } from 'vitest';
import { makeFilename } from '@/app/admin/social-cards/_components/export';

describe('makeFilename', () => {
  const d = new Date('2026-07-14T12:00:00Z');
  it('uses truerate-{format}-{yyyy-mm-dd}.png', () => {
    expect(makeFilename('breaking', d)).toBe('truerate-breaking-2026-07-14.png');
    expect(makeFilename('cover', d)).toBe('truerate-cover-2026-07-14.png');
  });
  it('numbers explainer slides 1-5', () => {
    expect(makeFilename('explainer', d, 0)).toBe('truerate-explainer-1-2026-07-14.png');
    expect(makeFilename('explainer', d, 4)).toBe('truerate-explainer-5-2026-07-14.png');
  });
});
```

Run: `npx vitest run src/__tests__/social-cards-export.test.ts` — FAIL (module not found).

- [ ] **Step 3: Implement `export.ts`**

```ts
import type { TemplateFormat } from './templates/types';

export function makeFilename(format: TemplateFormat, date: Date = new Date(), slide?: number): string {
  const ymd = date.toISOString().slice(0, 10);
  const slidePart = slide === undefined ? '' : `-${slide + 1}`;
  return `truerate-${format}${slidePart}-${ymd}.png`;
}

/**
 * Export the unscaled card node at exact platform dimensions (pixelRatio 1 —
 * spec decision; 1080×1350 is already the native feed size).
 */
export async function exportNodeAsPng(
  node: HTMLElement,
  size: { w: number; h: number },
  filename: string,
): Promise<void> {
  const { toPng } = await import('html-to-image');

  const originalTransform = node.style.transform;
  node.style.transform = 'none';
  try {
    await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 100)); // let layout settle post-transform

    const dataUrl = await toPng(node, {
      width: size.w,
      height: size.h,
      pixelRatio: 1,
      backgroundColor: '#050d11',
      cacheBust: true,
    });

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    node.style.transform = originalTransform;
  }
}
```

- [ ] **Step 4: Implement `ExportButton.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { templateSize } from './templates/registry';
import type { TemplateFormat } from './templates/types';
import { exportNodeAsPng, makeFilename } from './export';

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

export default function ExportButton({
  format, onSetSlide,
}: {
  format: TemplateFormat;
  onSetSlide: (n: number) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleExport() {
    const node = document.getElementById('tr-export-target');
    if (!node) { setError('Export target not found.'); return; }
    setBusy(true);
    setError('');
    const size = templateSize(format);
    try {
      if (format === 'explainer') {
        for (let slide = 0; slide <= 4; slide++) {
          onSetSlide(slide);
          await nextFrame();
          await nextFrame(); // slide re-render + AutoFitHeadline pass
          await exportNodeAsPng(node, size, makeFilename(format, new Date(), slide));
        }
      } else {
        await exportNodeAsPng(node, size, makeFilename(format));
      }
    } catch (err) {
      setError(err instanceof Error ? `Export failed: ${err.message}` : 'Export failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button
        type="button"
        onClick={handleExport}
        disabled={busy}
        className="focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none"
        /* style: prototype's lime export button, tr_app.jsx:213-226, with the
           download SVG marked aria-hidden="true" */
      >
        {busy ? 'Exporting…' : format === 'explainer' ? 'Download 5 PNGs' : 'Download PNG'}
      </button>
      {error && <p role="alert" style={{ color: '#e11b22', fontSize: 12, margin: 0 }}>{error}</p>}
    </div>
  );
}
```

- [ ] **Step 5: Wire into the studio toolbar** — replace the disabled slot with `<ExportButton format={format} onSetSlide={(n) => setTweak('explainerSlide', n)} />`.

- [ ] **Step 6: Run tests** — `npx vitest run` — all suites PASS.

- [ ] **Step 7: Verify real exports in the browser** — export Breaking (expect a 1080×1350 PNG download), Story (1080×1920), Cover (1920×1080), Explainer (five files `truerate-explainer-1…5-<date>.png`). Verify a card using a Supabase-hosted hero image exports with the photo intact (CORS path). Check downloaded dimensions:

```bash
sips -g pixelWidth -g pixelHeight ~/Downloads/truerate-breaking-*.png
```

- [ ] **Step 8: Lint, typecheck, commit**

```bash
npm run lint && npx tsc --noEmit
git add package.json package-lock.json src/app/admin/social-cards src/__tests__/social-cards-export.test.ts
git commit -m "[admin] Social cards: PNG export with explainer carousel loop"
```

---

### Task 12: Admin nav link + final QA

**Files:**
- Modify: `src/app/admin/layout.tsx` (nav link)

- [ ] **Step 1: Add the nav link** after the Feed link (`src/app/admin/layout.tsx:57-62`), matching sibling classes exactly:

```tsx
<Link
  href="/admin/social-cards"
  className="whitespace-nowrap text-gray-500 transition-colors hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
>
  Social Cards
</Link>
```

- [ ] **Step 2: Full gates**

```bash
npm run lint && npx tsc --noEmit && npx vitest run && npm run build
```

Expected: all pass; build succeeds with `/admin/social-cards` in the route list.

- [ ] **Step 3: Visual QA against the reviewed prototype**

1. Open the prototype: `open "design_handoff_admin_social_cards/TrueRate Social Templates.html"`, then in its console: `localStorage.setItem('tr_state_v7', JSON.stringify(<contents of example_state.json>)); location.reload()`.
2. In the admin studio, temporarily paste the same values (including the example_state image URLs into the image URL fields).
3. Compare every format × variant side by side at the same zoom. Differences beyond font rasterization = defects; fix before closing.
4. Confirm with Julian: keep the footer wordmark at the prototype's rendered 48px, or bump to the README's 64px (plan discrepancy #2).

- [ ] **Step 4: HCI pass** — keyboard-only: reach every toolbar button, open/close both panels with Enter and Escape, operate the crop slider with arrows, tab through the storage grid. Zoom 200%: toolbar wraps, nothing clipped.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/layout.tsx
git commit -m "[admin] Social cards: nav link and final QA"
```

---

## Self-review notes

- **Spec coverage:** architecture/files (T7–T11), templates+fidelity (T3–T5), state (T2, T8), prefill data flow (T6, T7, T10), image sources incl. storage picker (T9, T10), export incl. pixelRatio-1 decision and explainer loop (T11), CORS side-change (T1), error handling (T7 actions degrade, T10 stale guard, T11 inline errors), HCI (T8–T11 + T12 pass), nav+auth (T7, T12), testing/verification (per-task gates + T12). Design-bundle stays untracked — no task touches it.
- **Types consistent:** `CardTweaks`/`TemplateFormat`/`TemplateVariant` defined once (T2), consumed by name everywhere; `StoryItem` defined in `prefill.ts` (T6), consumed by `_actions.ts` (T7) and `SyncPanel` (T10); `RatesPayload` defined in `_actions.ts` (T7), consumed by studio/panels; `templateSize` defined T4, consumed T8/T11.
- **Known judgment calls recorded** under "Known prototype discrepancies" — variant-label typo fix, 48px wordmark (flag at QA), rubber row.
