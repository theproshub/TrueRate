# TrueRate Social — Content Queue System

**Date:** 2026-07-16
**Owner:** Julian Sackey / Carlos Sennay
**Status:** Design approved — ready for implementation plan
**Related:** [`2026-07-16-social-media-launch-design.md`](./2026-07-16-social-media-launch-design.md) (the content strategy this operationalizes)

---

## 1. Problem

The `/admin/social-cards` studio can pull a published article and prefill a card's
`headline`, `subtext`, `image`, and category chip (via `storyEdits` in `prefill.ts`).
But the **editorial hook is not composed anywhere**:

- The big `stat`, the human `statLabel`, and the `statContext` are retyped by hand on every Big-Stat card.
- `statEdits` (the Big-Stat prefill) only pulls generic dashboard values ("Previous reading… Source…"), not the framing the launch spec calls for ("11.17 — the gap between borrowing and saving").
- The **caption** (the Facebook/Instagram post text) and **alt text** have no home at all — `CardTweaks` has no field for them because they are not rendered on the card; they are what the human pastes into Meta.

Result: assembling one post is ~10 fields of manual, error-prone editorial work, repeated ~50 times across the backfill queue. The launch spec has already authored the exact figures and framing for weeks of posts, but that content lives in prose and cannot drive the studio.

## 2. Goal

A **content queue**: a machine-readable, type-checked list of pre-composed posts that the studio consumes so that **one click loads a complete post** — the card fully composed, plus the ready caption and alt text with copy-to-clipboard buttons.

**First batch:** Weeks 1–4 (~22 entries) from the launch spec — the locked launch fortnight plus the Week 3–4 rotation. Structured so the remaining ~36 backfill posts append trivially once the pipeline is validated.

### Non-goals (YAGNI)

- No posted/unposted state tracking. Posting to Meta stays manual.
- No auto-scheduling or Meta API integration.
- No database table or admin CRUD screen. The queue is authored in-repo and ships via the normal `develop` → prod deploy.
- No new admin screen or route. The queue lives inside the existing Pull-from-Site panel.

## 3. Architecture

Three units, one-way data flow, no new server round-trip:

```
src/data/social-queue.ts   (static, type-checked content)
        │  import (same pattern as SyncPanel already imports economic-events)
        ▼
SyncPanel.tsx  ──renders "Queue" section──▶  click entry
        │                                          │
        │  onApply(entry.tweaks)                   │  reveal caption + alt
        ▼                                          ▼
SocialCardStudio card state              Copy caption / Copy alt buttons
```

### 3.1 Data layer — `src/data/social-queue.ts`

New typed module, mirroring `src/data/news.ts` and `src/data/economic-events.ts`.

```ts
import type { CardTweaks, TemplateFormat } from
  '@/app/admin/social-cards/_components/templates/types';

export interface QueueEntry {
  /** Schedule day, 'YYYY-MM-DD', Liberia time (GMT). */
  date: string;
  /** Published article slug; the post links to /news/<slug>. */
  slug: string;
  /** Which card template this post uses. */
  format: TemplateFormat;
  /** Launch / pinned post. Optional. */
  pinned?: boolean;
  /** Editor hint not rendered anywhere — e.g. image direction for BS cards. */
  note?: string;
  /** Composes the card in one click. Type-checked against CardTweaks. */
  tweaks: Partial<CardTweaks>;
  /** The Facebook/Instagram post text. House style; ends on consequence;
   *  closes with "→ truerateliberia.com/news/<slug>". */
  caption: string;
  /** Accessibility alt text for the card image. */
  alt: string;
}

export const socialQueue: QueueEntry[] = [ /* 22 entries, date-ascending */ ];
```

Because `tweaks` is `Partial<CardTweaks>`, a mistyped field name or wrong value type
fails `tsc`/CI rather than silently no-op'ing in the feed.

**Image policy (deliberate):**

- **Big-Stat (`stat`) entries leave `statImage` blank.** House rule bars reusing a
  site hero and requires a fresh, real, ≥1200px photo per card. The editor attaches
  that via the existing **StoragePicker**. The `note` field carries the image
  direction (e.g. `"image: gold pour / mine, real ≥1200px, not a reused hero"`).
- **Feature (`article`) entries** may set `articleImage`/`breakingImage` to the
  article hero URL, because the launch spec explicitly uses the article hero for the
  tech/startup variety-break posts.

### 3.2 UI layer — "Queue" section in `SyncPanel.tsx`

`SyncPanel` is the existing Pull-from-Site panel. Add one `SyncSection title="Queue (N)"`
(placed first, above "Live Rate", since it is the primary daily workflow). No new route,
no new component file beyond a small caption/alt sub-block.

Import is direct and static:

```ts
import { socialQueue, type QueueEntry } from '@/data/social-queue';
```

(exactly how `SyncPanel` already does `import { getUpcomingEvents } from '@/data/economic-events'`).

**Rendering & behavior:**

- Entries sorted **date-ascending**. Each row: a date badge, a format badge
  (`STAT` / `FEATURE` / `BREAKING` …), and the entry's headline label
  (`tweaks.statLabel` for BS, `tweaks.headline` for FT/BR).
- The entry whose `date` equals **today** (GMT) gets a **"Today"** highlight/badge.
- **Click a row →** calls `onApply(entry.tweaks)` (same path article-click uses) to
  compose the card, **and** sets local `selectedSlug` state. Unlike article-click,
  the panel **does not close** — the editor needs the caption/alt to stay visible.
- When an entry is selected, a **caption + alt block** renders (below the Queue header
  or inline under the row): the caption text with a **Copy caption** button, and the
  alt text with a **Copy alt** button, both using `navigator.clipboard.writeText`.
  Buttons give a brief "Copied" confirmation (existing `useTransition`/local state
  pattern; `aria-live="polite"` on the confirmation).

**Accessibility (per project HCI guidelines):**

- Every row is a real `<button>` with `min-height: 44`, visible focus ring
  (`focus-visible:ring-2 focus-visible:ring-brand-accent`), and an `aria-label`
  naming the post.
- Copy buttons are labelled (`aria-label="Copy caption"`), 44×44 hit area, and the
  "Copied" feedback is announced politely.
- The "Today" state is not color-only — it carries a text badge.

### 3.3 No changes to the card templates or `CardTweaks`

Caption and alt are **not** added to `CardTweaks` — they are post metadata, not card
fields, and adding them would leak into `TWEAK_DEFAULTS`, persistence, and every
template needlessly. They live only on `QueueEntry`.

## 4. Content standard (the 22 captions)

Authored to house style, verified against the **already-fact-checked** article bodies
in `src/data/news.ts` — no fabrication, no re-derivation of figures:

- Exact CBL/LISGIS value with a **period label** ("in March 2026").
- **Never** leads with "Liberia" / "Liberia's".
- Numerals for money/percentages; distinguishes "percentage points" from "percent".
- No banned words (massive, surge-as-filler, skyrocketing, etc.).
- Ends on the **consequence** — the "so what for business".
- Closes with `→ truerateliberia.com/news/<slug>`.

The 22 entries and their exact fields are enumerated in the launch spec §6 (Weeks 1–2
locked) and §6 Week 3+ queue (the 8 rotation slugs). This system encodes them; it does
not re-decide them.

## 5. Testing

Because these captions live in a data file, `lint:editorial:db` (which scans the DB
catalog) will not see them. A focused integrity test replaces that guardrail:

**`src/data/social-queue.test.ts`** asserts, for every entry:

1. `slug` exists in the published catalog and is unique per entry.
2. `date` parses as a valid ISO date.
3. `format` is a member of `TemplateFormat`.
4. `caption` and `alt` are non-empty.
5. `caption` does **not** begin with "Liberia" / "Liberia's" (case-insensitive).
6. `caption` contains a `truerateliberia.com` link. Non-pinned entries must carry the
   `/news/<slug>` cross-link for their slug; a `pinned` entry (the launch post) may
   link to the bare `truerateliberia.com` domain instead, matching the launch spec.
7. `tweaks.templateType`, when present, equals `format` (no card/format mismatch).

Type safety (`tweaks: Partial<CardTweaks>`) covers field-name/type correctness at build
time; the test covers the semantic/editorial invariants `tsc` cannot see.

> Implementation note: confirm the repo's test runner during planning (check
> `package.json` scripts and existing `*.test.ts` files). If no unit-test harness
> exists, the slug/date/format/caption checks become a small `scripts/*.mjs` validator
> wired into the same place `lint:editorial` runs. This is resolved in the plan, not here.

## 6. Files touched

| File | Change |
|---|---|
| `src/data/social-queue.ts` | **New.** `QueueEntry` interface + 22 entries. |
| `src/data/social-queue.test.ts` | **New.** Integrity checks (or `.mjs` validator — see §5). |
| `src/app/admin/social-cards/_components/SyncPanel.tsx` | Add "Queue" section + caption/alt copy block. |

No changes to `_actions.ts`, `prefill.ts`, `state.ts`, `types.ts`, or any template —
the queue is static and its `tweaks` reuse the existing `onApply` path.

## 7. Open items for the plan

- Confirm test harness vs. `.mjs` validator (§5).
- Confirm exact placement of the caption/alt copy block (inline under the row vs. a
  fixed sub-header) — a small UI decision, resolved when wiring `SyncPanel`.
- Confirm the `TemplateFormat` values used by the 22 entries map to templates that
  render well in the target aspect ratios (4:5 feed, 9:16 story) — mostly `stat`,
  `article`, `breaking`, `event`.
