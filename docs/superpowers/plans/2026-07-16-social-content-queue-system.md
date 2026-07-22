# Social Content Queue System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `/admin/social-cards` a type-checked content queue so one click loads a complete social post — the card fully composed plus the ready caption and alt text with copy buttons.

**Architecture:** A static, type-checked `src/data/social-queue.ts` (mirrors `news.ts` / `economic-events.ts`) holds `QueueEntry[]`. A new "Queue" section in the existing `SyncPanel` renders the entries; clicking one calls the existing `onApply(entry.tweaks)` path to compose the card and reveals a caption/alt copy block. No new route, no DB, no server round-trip.

**Tech Stack:** Next.js App Router (existing), TypeScript, Vitest (`test: vitest run`, specs in `src/__tests__/`). No React Testing Library in the repo — UI logic is extracted into pure helpers that are unit-tested; JSX is verified by running the studio.

## Global Constraints

- **Source of numbers:** every figure is transcribed from the already-fact-checked article bodies in `src/data/news.ts` and the strategy spec `docs/superpowers/specs/2026-07-16-social-media-launch-design.md` §6. Nothing is fabricated or re-derived.
- **Caption house style (verbatim rules):** exact CBL/LISGIS value + period label ("in March 2026"); numerals for money/percentages; "percentage points" ≠ "percent"; currency prefix always `US$`/`L$`, never bare `$`; no banned words (massive, surge-as-filler, skyrocketing, unprecedented, plummet, etc.); **caption never begins with "Liberia"/"Liberia's"**; ends on the consequence; closes with `→ truerateliberia.com/news/<slug>` (pinned launch post may close with bare `→ truerateliberia.com`).
- **Image policy:** Big-Stat (`stat`) entries leave `statImage` blank (editor attaches a fresh ≥1200px real photo via StoragePicker; no reused site hero, no AI). Feature (`article`) entries may set `articleImage`/`breakingImage` to the article hero URL.
- **Type safety:** `QueueEntry.tweaks` is `Partial<CardTweaks>` — a mistyped field fails `tsc`/CI.
- **Accessibility (project HCI):** interactive rows are real `<button>`s, `min-height: 44`, visible `focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none`, `aria-label` naming the post; "Today" state carries a text badge (not color-only); copy confirmation announced with `aria-live="polite"`.
- **Slugs:** every `QueueEntry.slug` must exist in `newsItems` (`src/data/news.ts`).

---

### Task 1: Queue types + pure view helpers

**Files:**
- Create: `src/data/social-queue.ts`
- Test: `src/__tests__/social-queue-helpers.test.ts`

**Interfaces:**
- Consumes: `CardTweaks`, `TemplateFormat` from `@/app/admin/social-cards/_components/templates/types`.
- Produces:
  - `interface QueueEntry { date: string; slug: string; format: TemplateFormat; pinned?: boolean; note?: string; tweaks: Partial<CardTweaks>; caption: string; alt: string; }`
  - `const socialQueue: QueueEntry[]` (empty in this task).
  - `function sortQueueByDate(entries: QueueEntry[]): QueueEntry[]` — ascending by `date`, stable, non-mutating.
  - `function isToday(dateStr: string, now: Date): boolean` — true when `dateStr` (`YYYY-MM-DD`) equals `now`'s UTC date.
  - `function formatBadge(format: TemplateFormat): string` — short uppercase label: `stat→'STAT'`, `article→'FEATURE'`, `breaking→'BREAKING'`, `event→'EVENT'`, `story→'STORY'`, `quote→'QUOTE'`, `rate→'RATE'`, `markets→'MARKETS'`, `explainer→'EXPLAINER'`, `cover→'COVER'`.

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/social-queue-helpers.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { sortQueueByDate, isToday, formatBadge, type QueueEntry } from '@/data/social-queue';

const mk = (date: string, slug = 's'): QueueEntry => ({
  date, slug, format: 'stat', tweaks: {}, caption: 'c', alt: 'a',
});

describe('sortQueueByDate', () => {
  it('orders ascending by date without mutating input', () => {
    const input = [mk('2026-07-20'), mk('2026-07-16'), mk('2026-07-18')];
    const out = sortQueueByDate(input);
    expect(out.map((e) => e.date)).toEqual(['2026-07-16', '2026-07-18', '2026-07-20']);
    expect(input.map((e) => e.date)).toEqual(['2026-07-20', '2026-07-16', '2026-07-18']);
  });
});

describe('isToday', () => {
  it('matches same UTC calendar day and rejects others', () => {
    const now = new Date('2026-07-16T09:30:00Z');
    expect(isToday('2026-07-16', now)).toBe(true);
    expect(isToday('2026-07-17', now)).toBe(false);
  });
});

describe('formatBadge', () => {
  it('maps template formats to short uppercase labels', () => {
    expect(formatBadge('stat')).toBe('STAT');
    expect(formatBadge('article')).toBe('FEATURE');
    expect(formatBadge('breaking')).toBe('BREAKING');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/social-queue-helpers.test.ts`
Expected: FAIL — cannot resolve `@/data/social-queue`.

- [ ] **Step 3: Write minimal implementation**

Create `src/data/social-queue.ts`:

```ts
import type { CardTweaks, TemplateFormat } from
  '@/app/admin/social-cards/_components/templates/types';

export interface QueueEntry {
  /** Schedule day, 'YYYY-MM-DD', Liberia time (GMT). */
  date: string;
  /** Published article slug; the post links to /news/<slug>. Must exist in newsItems. */
  slug: string;
  /** Which card template this post uses. */
  format: TemplateFormat;
  /** Launch / pinned post. */
  pinned?: boolean;
  /** Editor hint (image direction, etc.) — not rendered on the card. */
  note?: string;
  /** Composes the card in one click. Type-checked against CardTweaks. */
  tweaks: Partial<CardTweaks>;
  /** The Facebook/Instagram post text. House style; ends on consequence; closes with the link. */
  caption: string;
  /** Accessibility alt text for the card image. */
  alt: string;
}

const BADGE: Record<TemplateFormat, string> = {
  stat: 'STAT', article: 'FEATURE', breaking: 'BREAKING', event: 'EVENT',
  story: 'STORY', quote: 'QUOTE', rate: 'RATE', markets: 'MARKETS',
  explainer: 'EXPLAINER', cover: 'COVER',
};

export function formatBadge(format: TemplateFormat): string {
  return BADGE[format];
}

export function sortQueueByDate(entries: QueueEntry[]): QueueEntry[] {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date));
}

export function isToday(dateStr: string, now: Date): boolean {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  return dateStr === `${y}-${m}-${d}`;
}

export const socialQueue: QueueEntry[] = [];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/social-queue-helpers.test.ts`
Expected: PASS (3 files, all green).

- [ ] **Step 5: Typecheck + commit**

Run: `npx tsc --noEmit` → Expected: no errors.

```bash
git add src/data/social-queue.ts src/__tests__/social-queue-helpers.test.ts
git commit -m "feat(social-cards): queue types + view helpers"
```

---

### Task 2: Author Weeks 1–2 (14 entries) + integrity test

**Files:**
- Modify: `src/data/social-queue.ts` (fill `socialQueue`)
- Test: `src/__tests__/social-queue.test.ts`

**Interfaces:**
- Consumes: `QueueEntry`, `socialQueue` (Task 1); `newsItems` from `@/data/news.ts`.
- Produces: `socialQueue` with the 14 Week 1–2 entries (source: strategy spec §6).

**Content source of truth:** strategy spec `docs/superpowers/specs/2026-07-16-social-media-launch-design.md` §6 gives the exact card fields (`stat`, `statLabel`, `statContext`, `date`, `category`) for Days 1–7 and the exact captions for Weeks 1–2. Transcribe those values; compose the same field set for the Week 2 posts from the matching article body in `news.ts`. Do not invent numbers.

**The 14 entries (date · slug · format · big number · label):**

| # | date | slug | format | stat | statLabel |
|---|---|---|---|---|---|
| 1 | 2026-07-16 | banking-spread-13-percent-lending-2-percent-savings-feb-2026 | stat (pinned) | `11.17` | The gap between borrowing and saving |
| 2 | 2026-07-17 | exchange-rate-8-percent-shift-business-impact | stat | `L$184` | The US dollar now buys fewer Liberian dollars |
| 3 | 2026-07-18 | liberia-5-billion-economy-sectoral-breakdown | stat | `US$5.16B` | The size of the economy in 2025 |
| 4 | 2026-07-19 | gold-export-concentration-risk-march-2026 | stat | `66.52%` | Gold's share of everything exported |
| 5 | 2026-07-20 | money-supply-299-billion-composition-shift-march-2026 | stat | `L$299B` | The money supply — but savings are shrinking |
| 6 | 2026-07-21 | government-revenue-surges-march-2026 | stat | `US$304M` | Government revenue in a single month |
| 7 | 2026-07-22 | monrovia-hustle-liberia-open-world-game | article | — | (feature link-post, hero image) |
| 8 | 2026-07-23 | fuel-cost-jump-small-business-impact-march-2026 | stat | `12.38%` | Fuel jumped while headline inflation read 0.62% |
| 9 | 2026-07-24 | record-imports-small-retailer-impact-march-2026 | stat | `US$314M` | Imports hit a two-year high |
| 10 | 2026-07-25 | ekan-connect-fintech-messaging | article | — | (feature link-post, hero image) |
| 11 | 2026-07-26 | cbl-holds-policy-rate-16-25-what-businesses-know | breaking | `16.25%` | The policy rate, held since October 2025 |
| 12 | 2026-07-27 | personal-loans-hidden-tax-informal-entrepreneurs | stat | `16.16%` | What informal entrepreneurs actually pay |
| 13 | 2026-07-28 | china-buys-134-million-liberian-exports-2025 | stat | `US$134M` | China's exports, from near-zero a year earlier |
| 14 | 2026-07-29 | liberia-gst-to-vat-transition | breaking | — | VAT set to replace GST |

- [ ] **Step 1: Write the failing integrity test**

Create `src/__tests__/social-queue.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { socialQueue } from '@/data/social-queue';
import { newsItems } from '@/data/news';

const slugs = new Set(newsItems.map((n) => n.id));
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const VALID_FORMATS = new Set([
  'breaking', 'article', 'quote', 'stat', 'markets', 'rate', 'event', 'explainer', 'story', 'cover',
]);

describe('socialQueue integrity', () => {
  it('has at least the 14 Week 1–2 entries', () => {
    expect(socialQueue.length).toBeGreaterThanOrEqual(14);
  });

  it('every entry is well-formed and on-standard', () => {
    for (const e of socialQueue) {
      expect(slugs.has(e.slug), `unknown slug: ${e.slug}`).toBe(true);
      expect(ISO.test(e.date), `bad date on ${e.slug}: ${e.date}`).toBe(true);
      expect(Number.isNaN(Date.parse(e.date)), `unparseable date on ${e.slug}`).toBe(false);
      expect(VALID_FORMATS.has(e.format), `bad format on ${e.slug}: ${e.format}`).toBe(true);
      expect(e.caption.trim().length, `empty caption on ${e.slug}`).toBeGreaterThan(0);
      expect(e.alt.trim().length, `empty alt on ${e.slug}`).toBeGreaterThan(0);
      // Never lead the caption with Liberia / Liberia's (house rule).
      expect(/^liberia'?s?\b/i.test(e.caption.trim()), `Liberia-led caption on ${e.slug}`).toBe(false);
      // Cross-link discipline.
      if (e.pinned) {
        expect(e.caption.includes('truerateliberia.com'), `pinned missing link on ${e.slug}`).toBe(true);
      } else {
        expect(e.caption.includes(`truerateliberia.com/news/${e.slug}`),
          `missing /news/${e.slug} cross-link`).toBe(true);
      }
      // No card/format mismatch.
      if (e.tweaks.templateType) {
        expect(e.tweaks.templateType, `templateType≠format on ${e.slug}`).toBe(e.format);
      }
    }
  });

  it('slugs are unique', () => {
    const seen = new Set<string>();
    for (const e of socialQueue) {
      expect(seen.has(e.slug), `duplicate slug: ${e.slug}`).toBe(false);
      seen.add(e.slug);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/social-queue.test.ts`
Expected: FAIL — `socialQueue.length` is 0, below 14.

- [ ] **Step 3: Fill the 14 entries**

Replace `export const socialQueue: QueueEntry[] = [];` in `src/data/social-queue.ts` with the 14 entries. Three fully-worked exemplars below fix the exact shape for the three formats; author the remaining 11 identically, pulling `stat`/`statLabel`/`statContext`/caption from spec §6 and the article body, obeying every Global Constraint.

**Exemplar A — pinned Big-Stat (entry 1):**

```ts
{
  date: '2026-07-16',
  slug: 'banking-spread-13-percent-lending-2-percent-savings-feb-2026',
  format: 'stat',
  pinned: true,
  note: 'image: CBL building / bank branch, real ≥1200px, not a reused hero',
  tweaks: {
    templateType: 'stat',
    variant: 'terminal',
    category: 'Banking',
    stat: '11.17',
    statLabel: 'The gap between borrowing and saving',
    statContext: 'Liberian banks charged 13.11% to borrow but paid just 1.94% to save in February 2026 — an 11.17-point spread that means every savings account loses to inflation.',
    date: 'Feb 2026',
    creditLine: 'SOURCE: CBL · LISGIS · TRUERATE RESEARCH',
  },
  caption:
    'Welcome to TrueRate. 📊\n\n' +
    'Liberian banks charged 13.11 percent to borrow and paid just 1.94 percent to save in February 2026 — a spread of 11.17 percentage points, according to the Central Bank of Liberia.\n\n' +
    'We turn CBL data into numbers you can actually use. Follow for the figure that shapes your business — every morning.\n' +
    '→ truerateliberia.com',
  alt: 'TrueRate data card: 11.17 percentage-point gap between Liberia’s 13.11% average lending rate and 1.94% savings rate, February 2026.',
},
```

**Exemplar B — regular Big-Stat (entry 4):**

```ts
{
  date: '2026-07-19',
  slug: 'gold-export-concentration-risk-march-2026',
  format: 'stat',
  note: 'image: gold bars / gold pour / mining operation, real ≥1200px',
  tweaks: {
    templateType: 'stat',
    variant: 'terminal',
    category: 'Commodities',
    stat: '66.52%',
    statLabel: 'Gold’s share of everything Liberia exports',
    statContext: 'Gold exports hit US$175.13 million in March 2026, up 111.87% year-on-year. With iron ore, two metals are 92.59% of all export earnings.',
    date: 'Mar 2026',
    creditLine: 'SOURCE: CBL · TRUERATE RESEARCH',
  },
  caption:
    'Gold exports hit US$175.13 million in March 2026 — up 111.87 percent year-on-year, now two-thirds (66.52%) of everything Liberia exports.\n\n' +
    'With iron ore, two metals are 92.59% of export earnings. One global price move is now a national-accounts event.\n' +
    '→ truerateliberia.com/news/gold-export-concentration-risk-march-2026',
  alt: 'Gold was 66.52 percent of Liberia’s total exports in March 2026, at US$175.13 million.',
},
```

**Exemplar C — Feature link-post (entry 7):**

```ts
{
  date: '2026-07-22',
  slug: 'monrovia-hustle-liberia-open-world-game',
  format: 'article',
  note: 'use the article hero image (real photo, no AI) — no stat card; its US$184B hook is not CBL/LISGIS data',
  tweaks: {
    templateType: 'article',
    variant: 'terminal',
    category: 'Technology',
    articleTitle: 'A One-Person Monrovia Studio Built a 3D Open-World Game',
    articleExcerpt: 'Set on Carey and Benson Street, built on a machine with 4 GB of RAM. The global games industry is worth US$184 billion — almost none of it from West Africa.',
    // articleImage left to the editor via StoragePicker (or set the article hero URL here).
  },
  caption:
    'A one-person Monrovia studio built a 3D open-world game — set on Carey and Benson Street — on a machine with 4 GB of RAM.\n\n' +
    'The global games industry is worth US$184 billion. Almost none of it comes from West Africa. HUIX-2099 is betting that changes.\n' +
    '→ truerateliberia.com/news/monrovia-hustle-liberia-open-world-game',
  alt: 'Screenshot from Monrovia Hustle, a 3D open-world game set in downtown Monrovia built by solo studio HUIX-2099.',
},
```

The remaining 11 entries (2, 3, 5, 6, 8, 9, 10, 11, 12, 13, 14) follow Exemplar A/B for `stat`, Exemplar C for `article`, and Exemplar B's shape for `breaking` (set `format`/`templateType: 'breaking'`, use `headline`/`subtext` instead of `stat`/`statLabel` per the breaking template's fields). Captions are the verbatim Week 1–2 text from spec §6; `stat`/`statLabel`/`statContext` for Days 2–6 are the §6 "Day N card fields" tables.

- [ ] **Step 4: Run integrity test + typecheck**

Run: `npx vitest run src/__tests__/social-queue.test.ts`
Expected: PASS (length ≥ 14, all invariants green).
Run: `npx tsc --noEmit`
Expected: no errors (every `tweaks` key valid on `CardTweaks`).

- [ ] **Step 5: Editorial lint sanity (bare-$ / banned words)**

Run: `npx vitest run src/__tests__/social-queue.test.ts && npx eslint src/data/social-queue.ts`
Expected: PASS / no lint errors. Manually confirm no caption contains a bare `$` (must be `US$`/`L$`) or a banned word.

- [ ] **Step 6: Commit**

```bash
git add src/data/social-queue.ts src/__tests__/social-queue.test.ts
git commit -m "feat(social-cards): author Weeks 1–2 content queue (14 posts)"
```

---

### Task 3: Append Weeks 3–4 (8 entries)

**Files:**
- Modify: `src/data/social-queue.ts`
- Modify: `src/__tests__/social-queue.test.ts` (raise the count floor)

**Interfaces:**
- Consumes: everything from Task 2.
- Produces: `socialQueue` with 22 entries total.

**The 8 rotation entries (spec §6 "Week 3+ queue"), dates continuing 1/day from 2026-07-30:**

| # | date | slug | format | big number / hook |
|---|---|---|---|---|
| 15 | 2026-07-30 | trade-hospitality-sector-services-boom | stat | `US$506M` trade & hospitality |
| 16 | 2026-07-31 | banks-hold-260-billion-deposits-where-goes-money | stat | `L$260B` bank deposits |
| 17 | 2026-08-01 | cost-of-credit-liberian-business-borrowing | stat | `13%` cost of credit (link from entry 1) |
| 18 | 2026-08-02 | rubber-production-drop-smallholder-impact-march-2026 | stat | `-47%` rubber output |
| 19 | 2026-08-03 | liberian-startups-barriers-first-year | article | why startups don't survive year one |
| 20 | 2026-08-04 | huix-2099-monrovia-studio-profile | article | studio profile: 5 products shipped solo |
| 21 | 2026-08-05 | rubber-output-106-million-uneven-recovery | stat | `US$106M` rubber GDP |
| 22 | 2026-08-06 | african-game-development-digital-economy | article | the `US$184B` industry Africa is missing |

- [ ] **Step 1: Raise the count floor (failing test)**

In `src/__tests__/social-queue.test.ts`, change:
```ts
    expect(socialQueue.length).toBeGreaterThanOrEqual(14);
```
to:
```ts
    expect(socialQueue.length).toBeGreaterThanOrEqual(22);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/social-queue.test.ts`
Expected: FAIL — length is 14, below 22.

- [ ] **Step 3: Append the 8 entries**

Add entries 15–22 to `socialQueue`, each following the Task 2 exemplars (`stat` → Exemplar A/B, `article` → Exemplar C). Pull each `stat`/`statLabel`/`statContext`/caption from the matching article body in `news.ts`, obeying every Global Constraint. Entry 17's caption should cross-link entry 1 (`.../news/banking-spread-13-percent-lending-2-percent-savings-feb-2026`) as well as its own slug, mirroring the site's anti-recycling links.

- [ ] **Step 4: Run integrity test + typecheck**

Run: `npx vitest run src/__tests__/social-queue.test.ts`
Expected: PASS (length ≥ 22, all invariants green, slugs unique).
Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/data/social-queue.ts src/__tests__/social-queue.test.ts
git commit -m "feat(social-cards): append Weeks 3–4 rotation (8 posts, 22 total)"
```

---

### Task 4: Wire the Queue section into SyncPanel

**Files:**
- Modify: `src/app/admin/social-cards/_components/SyncPanel.tsx`

**Interfaces:**
- Consumes: `socialQueue`, `sortQueueByDate`, `isToday`, `formatBadge`, `QueueEntry` from `@/data/social-queue`; existing `onApply: (edits: Partial<CardTweaks>) => void` prop (bound to `applyMany`).
- Produces: no new exports — additive UI inside `SyncPanel`.

**Behavior (from the spec §3.2):** a `SyncSection title="Queue (N)"` rendered **first** in the panel; entries sorted ascending; each row = date badge + `formatBadge(format)` + label (`tweaks.statLabel ?? tweaks.headline ?? tweaks.articleTitle`); the `isToday` row shows a "TODAY" text badge. Clicking a row calls `onApply(entry.tweaks)` and sets `selectedSlug` — it does **not** call `onClose()` (unlike the article rows). When a row is selected, a caption/alt block renders with **Copy caption** and **Copy alt** buttons using `navigator.clipboard.writeText`, with an `aria-live="polite"` "Copied" confirmation.

- [ ] **Step 1: Add imports and selection state**

At the top of `SyncPanel.tsx`, add to the imports:
```ts
import { socialQueue, sortQueueByDate, isToday, formatBadge, type QueueEntry } from '@/data/social-queue';
```
Inside the component, add state near the other `useState` calls:
```ts
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState('');
  const queue = sortQueueByDate(socialQueue);
  const now = new Date();
```

- [ ] **Step 2: Add the copy helper**

Inside the component body (above `return`):
```ts
  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      setCopied('');
    }
  };
  const selected = queue.find((e) => e.slug === selectedSlug) ?? null;
```

- [ ] **Step 3: Render the Queue section (first section in the panel)**

Immediately after the `<SyncSection title="Live Rate">…</SyncSection>` opening structure, insert a new section BEFORE it (so Queue is first). Add:
```tsx
      <SyncSection title={`Queue (${queue.length})`}>
        {selected &&
          <div style={{ marginBottom: 10, padding: 10, background: 'rgba(191,234,54,0.06)', border: '1px solid rgba(191,234,54,0.25)' }}>
            <p style={{ fontSize: 12, color: 'rgba(243,244,244,0.85)', whiteSpace: 'pre-wrap', lineHeight: 1.5, marginBottom: 8 }}>
              {selected.caption}
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <button type="button" onClick={() => copy(selected.caption, 'caption')} className={FOCUS_RING}
                aria-label="Copy caption" style={{ ...SECONDARY_BTN, width: 'auto', padding: '8px 12px' }}>
                Copy caption
              </button>
              <button type="button" onClick={() => copy(selected.alt, 'alt')} className={FOCUS_RING}
                aria-label="Copy alt text" style={{ ...SECONDARY_BTN, width: 'auto', padding: '8px 12px' }}>
                Copy alt
              </button>
            </div>
            <p aria-live="polite" style={{ fontSize: 11, minHeight: 14, color: '#BFEA36', margin: 0 }}>
              {copied ? `${copied === 'caption' ? 'Caption' : 'Alt text'} copied` : ''}
            </p>
          </div>
        }
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {queue.map((e) => {
            const label = e.tweaks.statLabel ?? e.tweaks.headline ?? e.tweaks.articleTitle ?? e.slug;
            const today = isToday(e.date, now);
            return (
              <li key={e.slug} style={{ marginBottom: 6 }}>
                <button
                  type="button"
                  onClick={() => { onApply(e.tweaks); setSelectedSlug(e.slug); }}
                  aria-label={`Load queued post: ${label}`}
                  className={FOCUS_RING}
                  style={{
                    display: 'block', width: '100%', minHeight: 44, textAlign: 'left',
                    background: e.slug === selectedSlug ? 'rgba(191,234,54,0.1)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)', color: '#F3F4F4',
                    padding: '8px 10px', cursor: 'pointer', fontSize: 13, lineHeight: 1.35, fontFamily: FONT_SANS,
                  }}
                >
                  <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(243,244,244,0.55)', display: 'block', marginBottom: 2 }}>
                    {e.date} · {formatBadge(e.format)}{today ? ' · TODAY' : ''}{e.pinned ? ' · 📌' : ''}
                  </span>
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </SyncSection>
```

- [ ] **Step 4: Verify existing helper tests still pass + typecheck**

Run: `npx vitest run src/__tests__/social-queue-helpers.test.ts src/__tests__/social-queue.test.ts`
Expected: PASS.
Run: `npx tsc --noEmit`
Expected: no errors.
Run: `npx eslint src/app/admin/social-cards/_components/SyncPanel.tsx`
Expected: no errors.

- [ ] **Step 5: Manual verification in the running studio**

Run the app (`npm run dev`) and open `/admin/social-cards`. Verify:
1. Open the **Pull from Site** panel — a **Queue (22)** section appears first.
2. Rows are date-ascending; the 2026-07-16 row shows **· TODAY · 📌** (adjust expectation to the actual current date).
3. Click a `stat` row → the live card fills with the stat/label/context/category and the panel **stays open**.
4. The caption/alt block appears; **Copy caption** copies the full caption (paste to confirm); the "Copied" line announces.
5. Tab through the rows — focus ring visible, each row reachable, Enter activates.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/social-cards/_components/SyncPanel.tsx
git commit -m "feat(social-cards): Queue section with one-click post + caption/alt copy"
```

---

## Self-Review

**Spec coverage:**
- §3.1 data module → Task 1 (types/helpers) + Tasks 2–3 (entries). ✓
- §3.2 Queue section, click-applies-tweaks, panel stays open, caption/alt copy, Today badge, a11y → Task 4. ✓
- §3.3 no `CardTweaks` change → honored; caption/alt live only on `QueueEntry`. ✓
- §4 content standard → Global Constraints + Task 2/3 exemplars + integrity test. ✓
- §5 testing (slug/date/format/caption/cross-link/templateType, pinned exception) → `social-queue.test.ts` in Task 2. Harness open item resolved: Vitest, `src/__tests__/`. ✓
- §6 files touched → matches Tasks 1–4 exactly. ✓
- §7 open items → test harness resolved (Vitest); caption/alt placement resolved (selected-entry block above the list); formats used are `stat`/`article`/`breaking` (all render at 4:5). ✓

**Placeholder scan:** No TBD/TODO. The "remaining 11 / 8 entries follow the exemplars" instructions point to concrete authored source (spec §6 + `news.ts` bodies) with three complete exemplars and per-entry tables — not vague placeholders. Every code step shows complete code.

**Type consistency:** `QueueEntry`, `socialQueue`, `sortQueueByDate`, `isToday`, `formatBadge` are defined in Task 1 and consumed with identical signatures in Tasks 2–4. `onApply(edits: Partial<CardTweaks>)` matches the existing `applyMany`. `tweaks.templateType`/`statLabel`/`headline`/`articleTitle` are real `CardTweaks` keys. Test format set matches `TemplateFormat`.
