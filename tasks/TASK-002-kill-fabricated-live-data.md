# TASK-002 — Eliminate fabricated / frozen "live" data (data integrity)

**Source:** `DESIGN-AUDIT.md` → C0 (Headline Finding), item #1/#2, Component Plan #1 · **Priority:** P0 · **Effort:** L · **Impact:** Disqualifying-if-unfixed

## Why this is the top task
Master context defines TrueRate's foundation as **Accuracy ("Facts before speed"), Credibility, and Trust** — *"Accuracy is non-negotiable."* The homepage currently presents **hardcoded, stale data as live**, which is a direct violation of that core value and the audit's single biggest credibility blocker. A returning reader sees identical "today's" numbers tomorrow → concludes the platform is a mockup. This caps Trustworthiness at 30/100. No styling or feature work matters until this is fixed.

## The lie, specifically (`src/app/page.tsx`)
- `"LIVE FEED"` with pulsing dot + hardcoded `"Updated 2 min ago"` (~:235)
- `"Today's signal · Apr 3 · 18:30 GMT"` hardcoded (~:526)
- `FX_RATES`, `COMMODITIES_WITH_CONTEXT`, `EconomicWidget`, `TODAYS_SIGNAL`, `UPCOMING_EVENTS`, "Regional Spotlight" — hardcoded constants with frozen datelines
- `FEATURED_BYLINES` (~:93) — 5 recycled names across unrelated stories
- Only `IndicatorsStrip` (`/api/rates`, `/api/indicators`) is genuinely live

## Governing principle (from project rules)
**No fabricated data. Every section is backed by a live source. If there's no source: delete, don't seed.**

## Goal
Every "live"/"today's"/"updated" claim on the homepage is either (a) bound to a real, time-stamped fetch, or (b) removed. No frozen value may wear a live label.

## Scope
For each hardcoded block, decide and execute one of two paths:

**A. Wire to a real source** (preferred where a feed exists)
- FX rates → existing `/api/rates` (already powering `IndicatorsStrip`).
- Commodities / indicators → `/api/indicators` or a real provider; render real `as of <timestamp>`.
- "Updated X ago" → compute from the actual fetch time, not a literal string.
- Datelines → derived from data payload, never hardcoded.

**B. Delete (no seeding)**
- If no live source exists yet (e.g. "Today's signal", "Regional Spotlight", `UPCOMING_EVENTS`), remove the block or replace with an honest empty/coming-soon state. Do **not** keep it dressed as live.

**Bylines**
- Replace `FEATURED_BYLINES` lookup with real author records (ties to audit #6). If author data isn't ready, show the real author or no byline — never a recycled fake one.

## Acceptance criteria
- [ ] No hardcoded date/time/"updated" string remains on the homepage; all freshness labels derive from real fetch timestamps.
- [ ] Every block labeled "live" / "today" is backed by `/api/*` (or equivalent) with a visible, accurate `as of` time.
- [ ] Blocks with no live source are removed or shown in an honest non-live state — none are seeded with fake data.
- [ ] Bylines reflect real authors (or are omitted); no recycled hardcoded names.
- [ ] Each data widget shows source attribution (CBL / IMF / WB / LISGIS / provider) per the editorial credibility standard.
- [ ] Loading + error states handled (no silent fallback to stale constants).

## Verification
- Load homepage on two different days (or mock clock) → "today's" values and timestamps change with the source.
- Kill the API in dev → widgets show loading/error/empty, never frozen fake numbers.
- Grep for hardcoded date literals and the byline constant → zero remaining on the homepage.

## Dependencies / sequence
- Best landed **after TASK-001** (lint gate) so the rebuild doesn't reintroduce banned patterns.
- Pairs with audit #3/#4 (arrow semantics + `pos`/`neg` deltas) and #5/#36 (methodology page + data-partner attribution) — consider bundling the source-attribution work.
