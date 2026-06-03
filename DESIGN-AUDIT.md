# TrueRate — Design System, Brand Consistency & Financial-Media Credibility Audit

> Senior design-systems + financial-media review. Lens: WCAG 2.2 AA, Nielsen heuristics, and the
> conventions of Yahoo Finance, Bloomberg, Reuters, CNBC, FT, WSJ, MarketWatch. The guiding question:
> *"Does a first-time visitor trust this with their money within 5 seconds?"* Evidence is cited as
> `file:line` against the codebase at review time.

---

## ⚠️ Headline Finding — Data Integrity

**The homepage data is fabricated and frozen while presenting itself as live.** This overrides every
styling issue and is the single biggest blocker to credibility.

Evidence (`src/app/page.tsx`):
- A **"LIVE FEED"** with a pulsing dot and **`"Updated 2 min ago"`** as a hardcoded string (`:235`).
- **"Today's signal · Apr 3 · 18:30 GMT"** — hardcoded (`:526`).
- `FX_RATES`, `COMMODITIES_WITH_CONTEXT`, `EconomicWidget`, `TODAYS_SIGNAL`, `UPCOMING_EVENTS`, and the
  "Regional Spotlight" are **hardcoded constants** with stale datelines ("CBL reference rate, Apr 3
  2026", "LME/SGX/ICE close, Apr 2 2026").
- Bylines come from a **hardcoded lookup** (`FEATURED_BYLINES`, `:93`) — five names recycled across
  unrelated stories.

The only genuinely live element is `IndicatorsStrip` (`/api/rates`, `/api/indicators`). A returning
reader sees identical "today's" numbers tomorrow and concludes the platform is a mockup. This also
violates the project's own principle: *no fabricated data — every section backed by a live source;
delete, don't seed.*

---

## Executive Summary

TrueRate has the skeleton of a real design system — tokens (`tailwind.config.ts`), mirrored CSS vars
(`globals.css`), and seven documented primitives in `src/components/ui`. The intent is excellent. **The
problem is adoption and integrity.** The system is widely bypassed (three–four parallel visual
languages), and the flagship "live" data is static.

Most damaging for a *financial* product, in order: (1) fabricated/frozen "live" data; (2) inverted
arrow semantics; (3) no single brand color (lime / lime-green / emerald / purple); (4) recycled
hardcoded bylines + no methodology; (5) placeholder gradient tiles instead of photography.

- **Composite design maturity: ~55 / 100** — "Promising prototype, not yet a publication."
- **Public-facing consistency: ~5.4 / 10.**
- **Trustworthiness: 30 / 100** — fabricated live data is disqualifying for finance.

---

## Inventory

### 1. Fonts
| Family | Loaded | Intended role | Reality |
|---|---|---|---|
| **Inter** (`--font-inter`) | ✅ | Headings + UI | Correct, widely used |
| **Montserrat** (`--font-montserrat`) | ✅ | Body copy | Wide *display* sans, weak for dense reading; see bug |
| **Roboto Mono** | ✅ | Figures | Used in charts / tabular nums |

> **Bug:** `Text.tsx` applies class **`font-body`** (`Text.tsx:6-12`) but it is **not defined** in
> `tailwind.config.ts` (only `sans/inter/montserrat/mono`). `<Text>` (default `<p>`) inherits
> Montserrat from the element selector, but `<Text as="span/div">` silently falls back to Inter.

### 2. Colors
**Tokens:** accent `#BFEA36`, accent-hover `#a8d42a`; darks `#050d11/#030a0e/#061520/#040f18/#061E29`;
lights `#F3F4F4/#f8f9fa`; ink `#0a0a0d`; semantic `pos #00a757 / neg #e11b22 / warning #f59e0b / info #3b82f6`.
**Off-system in the wild:**
| Value | Where | Problem |
|---|---|---|
| `#6001d2` / `#490099` purple | all `/admin/*`, `sign-in:89`, `sign-up:121`, article links (`globals.css:123`) | Off-brand primary CTA |
| `lime-300…700` | ~14 sports files (`#84cc16`) | A *second* green = sports accent |
| `emerald-300…700` | 100+ | A *third* green = light links + up-deltas |
| `red-400/500` | 44× | Down-deltas bypassing `neg` |
| `#16a34a / #dc2626` | `analytics/terminal/colors.ts` | Chart green/red ≠ tokens |
| `gray-100…950` | hundreds | No semantic mapping |

### 3. Spacing
`Container` primitive abandoned: **2 imports vs 41 raw `max-w-[1320px]`** + one-off `820/780/760/600px`.

### 4. Buttons
`Button` primitive (4 variants × 3 sizes) shadowed by **52 raw `<button>`**, a purple admin/auth button
duplicated in **8 files**, and lime sports pills → ≥4 button languages.

### 5. Cards
`Card` primitive vs raw divs with `bg-white/[0.03–0.05]`, borders `/[0.06–0.08]`, radii `lg/xl/2xl`
(auth uses off-token `rounded-2xl`, `sign-in:44`).

### 6. Forms
`Input` primitive (token + a11y correct) ignored by every auth/admin form (hand-rolled inputs,
different label colors, extra focus treatment).

### 7. Headings & text
`Heading`/`Text` primitives bypassed by **18 arbitrary `text-[…px]`** (incl. `text-[9px]`, `text-[44px]`)
— violating the config's own "never write `text-[Xpx]`" note. `font-black` used **101×**.

---

## Issues by Severity

### Critical
- **C0 — Fabricated/frozen "live" data** (see headline).
- **C1 — Four greens, no canonical brand color** (`Header.tsx:456`, all `sports/*`, `colors.ts:13`).
- **C2 — Off-brand purple CTAs** on auth + admin (`sign-in:89`, `sign-up:121`, 6 admin forms).
- **C3 — Primitives bypassed at scale** (Container 2v41; Input/Button ignored). No enforcement gate.
- **C4 — Light/dark theme is an un-systematized per-route fork** (`Header.tsx:386`).

### Medium
- **M1** — 18 arbitrary `text-[…px]` (incl. illegible `text-[9px]`, `markets:199`).
- **M2** — `font-body` utility undefined (non-deterministic body font).
- **M3** — Semantic delta tokens unused: `emerald-400`(33×)/`red-400`(44×)/`#16a34a` instead of `pos`/`neg`.
- **M4** — Border-radius drift (`lg`125 / `xl`56 / `full`65 / off-token `2xl`).
- **M5** — Focus-ring split (`ring-brand-accent` 59 vs `ring-lime-500` 18).
- **M6** — Gray-scale sprawl (`gray-100…950`, no roles; `gray-500` borderline contrast).

### Minor
- **N1** — Duplicate auth route: `/sign-in`, `/sign-up`, **and** `/signin`.
- **N2** — Type scale capped at 32px then circumvented by `text-[44px]`.
- **N3** — Raw `<img>` logo + `brightness(0)` light-mode hack (`Header.tsx:433`).
- **N4** — Hover-open mega-menu (`Header.tsx:465`).
- **N5** — Hardcoded chart tooltip colors (`TrendChart.tsx`).
- **N6** — Inverted arrow semantics on indicators (`page.tsx:401`) — misleads vs finance convention.

---

## Financial-Media Credibility

**Benchmark principle:** Bloomberg/Reuters/Yahoo/CNBC/FT/WSJ earn trust through *monotony of identity* —
one accent, one type system, one green-up/red-down rule, live + sourced data, minimal decoration.

**Where TrueRate fails:** fabricated "live" data; inverted arrows; multi-accent palette; display body
font; theme fork; recycled bylines; placeholder tiles; centered "magazine" hero; sub-legible `9px` data.
**Where it meets the bar:** the **analytics terminal** (disciplined palette, mono figures,
direction-only color — best surface, 8/10); Bloomberg-style section nav; restrained motion; per-widget
source/"as of" lines; strong `article-body` typography.

### Trust scorecard (0–100)
| Dimension | Score |
|---|---|
| Visual Design | 62 |
| Brand Consistency | 38 |
| Data Presentation | 45 |
| News Presentation | 66 |
| User Experience | 64 |
| Accessibility | 70 |
| Mobile Experience | 68 |
| Trustworthiness | 30 |
| Professionalism | 55 |
| **Composite** | **≈ 55** |

### Brand positioning today
Closest to **Yahoo Finance's *layout* executed at a *startup-landing-page* level of brand discipline,
with a *content-farm* data layer.** Not yet Bloomberg/Reuters (those = live, sourced, monochromatic).
Above a personal blog (IA + copy too sophisticated).

### TrueRate-specific verdicts
- Liberia's most trusted platform? **No** — flagship data is hardcoded/frozen.
- Africa's leading financial media co.? **Partially** — vision/IA/voice are there; execution integrity isn't.
- Institutional investors? **No** — frozen prices + inverted arrows fail the sniff test.
- Banks trust the brand? **No** — off-brand auth + no data-governance page.
- Government reference the data? **Partially** — article quality yes; fabricated indicators no.
- Marquee interviewees? **Partially** — credible enough to tempt; placeholder visuals signal "early."

---

## Per-Page Consistency Scores (1–10)
| Surface | Score | Why |
|---|---|---|
| Analytics terminal | 8 | Disciplined palette, mono figures; green/red diverge from tokens |
| Markets | 7 | Primitives used; `text-[9px/26px/20px]` |
| News / article (light) | 6.5 | Great article type; purple links + emerald hovers fork accent |
| Home (/) | 6 | Good IA; fabricated data; centered hero; raw containers |
| Economy / Technology | 6 | `text-[13.5px]`, font-black sprawl |
| Entertainment | 5.5 | Light theme + arbitrary sizes + emerald |
| Videos | 5.5 | Bespoke header tab logic |
| About / legal / help / feedback | 5 | Gray-scale improvisation |
| Watchlist | 5 | Mixed primitive/raw; static quotes |
| Sports | 4 | Separate lime design system |
| Sign-in / Sign-up | 3 | Purple CTA, hand-rolled inputs, off-token radius |
| Admin | 3 | Purple buttons ×6, no primitives |

**Weighted public-facing avg ≈ 5.4 / 10.**

---

## Competitive Gap Analysis — Top 50
*[#] Gap — Competitor / TrueRate / Why / Fix / Priority (P0 critical → P3 polish)*

**Data integrity (P0)**
1. Live prices — streamed / hardcoded → unusable → wire real feeds → P0
2. Real "updated" time — true freshness / `"Updated 2 min ago"` literal → trust → bind to fetch → P0
3. Arrow semantics — ▲green/▼red universal / inverted on inflation → misleads → use literal +/− → P0
4. One delta color — single green/red / emerald+red-400+`#16a34a` → looks unreliable → `pos`/`neg` → P0
5. Methodology page — linked / none → no auditability → add + masthead link → P0
6. Real authors — bios/pages / recycled hardcoded names → content-farm signal → author records → P0
7. Source chain on stories — "Reporting by" / none → can't cite → story footer → P1
8. Corrections policy — published / none → norm missing → add → P1

**Brand & identity (P0–P2)**
9. One accent — fixed brand color / 4 greens+purple → incoherent → unify + codemod → P0
10. On-brand CTA — consistent / purple only on auth+admin → fractured → `Button` everywhere → P0
11. Consistent focus ring — uniform / brand-accent vs lime-500 → P1
12. Logo system — crisp SVG light/dark / raw `<img>`+brightness hack → SVG+`next/image` → P1
13. Real photography — Getty/Reuters / gradient letter-tiles → "demo" → image pipeline → P0
14. Structured left-aligned hero — Bloomberg/WSJ / centered tombstone → magazine feel → left-align → P1
15. One type family — Reuters single / Inter+Montserrat+broken `font-body` → drop Montserrat → P1
16. No arbitrary type — tokens / 18× `text-[…px]` incl `9px` → tokens only → P1
17. Radius discipline — `lg/xl/2xl` off-token → P2
18. Single theme identity — one identity / per-route fork → P2

**Data presentation & charts (P0–P2)**
19. Homepage charts/sparklines — present / text lists only → add index/FX charts → P1
20. Instrument drill-down — quote pages / keyword search → build → P1
21. Sortable market table — standard / static → P2
22. Watchlist on live quotes — Yahoo core / static → wire → P1
23. Market-status banner — CNBC / none → add → P2
24. Movers/heatmap — Bloomberg / none → P2
25. Chart token alignment — / chart green ≠ UI green → P1
26. Legible data type — / `9px` → P1
27. Currency converter prominence — Yahoo tool / a link → surface it → P1

**Editorial (P1–P3)**
28. Deep verticals — / thin topic pages → P2
29. Live blog / breaking tier — Reuters / static "live feed" → P1
30. Newsletter capture — all four / none → add → P2
31. Live related-tickers on articles — Bloomberg / static chips → P2
32. Opinion/analysis labels — FT/WSJ / mixed → tag content types → P2
33. Paywall/registration model — WSJ/FT / open, none → product decision → P3
34. Real video infra — CNBC / YouTube embeds → P2

**Trust signals (P0–P3)**
35. Masthead/leadership — shown / generic About → add → P1
36. Data-partner logos (CBL/IMF/WB/LISGIS) — / names in text → add attributions → P1
37. Branded secure auth — polished / off-brand purple → P0
38. Delay/disclaimer notice — required / partial → standardize → P2
39. Social proof — "trusted by" / none → P3
40. Verified social linkage — / links present, no verification cues → P3

**UX & navigation (P1–P3)**
41. Personalization (follow) — Yahoo core / none → P2
42. Faceted search results — / basic box → P2
43. Click-not-hover menus — / hover-open (`Header.tsx:465`) → P2
44. Post-login value — / sign-in gives little → P2
45. Skeleton loading — graceful / mixed → P3
46. Consistent `Card` — / ad-hoc divs → P1

**Scale & governance (P0–P2)**
47. Consistent container — / 41× raw `max-w-[1320px]` → `Container` → P1
48. Lint/governance gate — enforced / none → ESLint rules → P0 (cheap)
49. Gray text tokens — / raw `gray-100…950` → semantic tokens → P1
50. Remove duplicate routes — / `/signin`+`/sign-in`+`/sign-up` → consolidate → P2

---

## Recommendations & Token Library
1. One brand green; delete `lime-*`/`emerald-*`, map to tokens.
2. One CTA color sitewide; retire `#6001d2`.
3. Semantic gray text roles (`primary/secondary/muted/disabled`, dark+light, ≥4.5:1); ban raw `gray-###`.
4. Tokenize up/down via `pos`/`neg` (or `<Delta>`); align charts.
5. Collapse to Inter + mono; drop Montserrat (or define `font-body`).
6. Light/dark via `data-theme` token set, not per-route branching.
7. **Enforce:** ESLint banning `text-[`, raw hex in className, `*-lime-*`/`*-emerald-*`, raw `max-w-[1320px]`.

```
color:
  brand.accent #BFEA36   accent.hover #a8d42a   cta.bg = brand.accent   (retire #6001d2)
  surface.dark/header/card/azure ; surface.light/light-2
  text.dark.{primary #e8e8e8, secondary #9ca3af, muted #6b7280}
  text.light.{primary #0a0a0d, secondary #374151, muted #6b7280}
  data.pos #00a757   data.neg #e11b22   (UI + charts share)
  status.warning #f59e0b   status.info #3b82f6
type:   2xs10 xs11 sm12 base13 md14 lg16 xl18 2xl22 3xl32  (no arbitrary px)
weight: medium500 semibold600 bold700
radius: sm4 md6 lg8 xl12 full   (delete 2xl)
focus:  ring=brand.accent, offset=surface.dark|light
```

---

## Component Standardization Plan
| # | Action | Impact | Effort | Priority |
|---|---|---|---|---|
| 1 | Replace fabricated "live" homepage data — wire real feeds or delete per no-seed rule | High | L | **P0** |
| 2 | Auth + admin purple CTA → `Button` primary (brand) | High | S | **P0** |
| 3 | Up/down through `pos`/`neg` (incl. charts) | High | M | **P0** |
| 4 | ESLint gate: no `text-[`, raw hex, `lime/emerald`, raw `max-w-[1320px]` | High | S | **P0** |
| 5 | Decide arrow semantics (use literal +/−) | High | S | **P0** |
| 6 | Migrate auth/admin forms to `Input`/`Button` | Med | M | P1 |
| 7 | Replace 41 `max-w-[1320px]` with `<Container>` | Med | M | P1 |
| 8 | Define `font-body` / drop Montserrat | Med | S | P1 |
| 9 | Semantic gray tokens + codemod | Med | L | P1 |
| 10 | Real photography pipeline | High | L | P1 |
| 11 | Unify focus ring | Low | S | P2 |
| 12 | Replace 18 `text-[…px]` | Low | S | P2 |
| 13 | Delete `/signin`; `next/image` logo | Low | S | P2 |
| 14 | Light/dark token theming | Med | L | P2 |

**Sequencing:** P0 #4 (lint) first so CI fails on new violations, then codemods against a guarded baseline.

---

## Executive Summary — biggest credibility blockers (most → least damaging)
1. **Fabricated, frozen data labeled "live."** Disqualifying for finance.
2. **Inverted arrow semantics.** Misleads on the universal up/down contract.
3. **No brand identity — four greens + off-brand purple CTA.**
4. **Recycled hardcoded bylines + no author/methodology/source pages.**
5. **Placeholder gradient tiles instead of real photography.**
6. **No homepage charts / no instrument drill-down.**
7. **Centered magazine hero + display body font.**
8. **Sub-legible data type (`9px`) + gray-on-dark contrast.**
9. **Off-brand, unbranded auth/admin surfaces.**
10. **No governance (lint/tokens) so entropy keeps growing.**

The vision, IA, editorial voice, and Liberia/West-Africa focus are world-class in *ambition*; the
analytics terminal and article layout prove the team can hit a high bar. The gap to "billion-dollar
financial media brand" is almost entirely **data integrity** and **identity discipline** — not talent
or concept. Land items 1–4 and trust roughly doubles (30 → ~60).
