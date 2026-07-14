# Design: /admin/social-cards — Social Card Studio

**Date:** 2026-07-14
**Source:** `design_handoff_admin_social_cards/` handoff bundle (high-fidelity, reviewed; recreate pixel-perfectly)
**Status:** Approved by Julian 2026-07-14

## Purpose

A Social Cards page in the TrueRate admin that generates on-brand social media
graphics from live site data. Editors pick a format, prefill it from any
published article or live rates with one click, tweak the copy, and export a
PNG sized for the platform.

## Scope

In scope (all confirmed by Julian):

- The core studio: 10 formats × terminal/broadsheet variants, tweaks panel,
  pull-from-site prefill, PNG export.
- Commodities prefill for the Markets card rows via `fetchCommodities()`.
- CORS headers (`Access-Control-Allow-Origin: *`) on `/api/news` and
  `/api/rates` so the standalone HTML prototype works without proxies.
- Supabase storage image picker (browse the `article-images` bucket).

Out of scope: saving card presets server-side, scheduled/automated card
generation, posting to social platforms.

## Architecture

```
src/app/admin/social-cards/
  page.tsx              server component: fetch initial stories, live rates,
                        commodities; render studio
  _actions.ts           server actions: refreshStories(), refreshRates(),
                        listStorageImages()
  _components/
    SocialCardStudio.tsx  client root: toolbar, scaled preview canvas, panels
    TweaksPanel.tsx       per-format field editors
    SyncPanel.tsx         "Pull from Site" panel — server data, no proxies
    StoragePicker.tsx     browse article-images bucket
    ExportButton.tsx      html-to-image PNG export
    templates/
      shared.tsx          AutoFitHeadline, footer lockup, chip, design tokens
      breaking.tsx article.tsx quote.tsx stat.tsx markets.tsx
      rate.tsx event.tsx explainer.tsx story.tsx cover.tsx
      registry.ts         format → { terminal, broadsheet, label, size } map
```

- Auth: the admin layout (`src/app/admin/layout.tsx`) already calls
  `requireAdmin()`; the page inherits that gate like every sibling admin page.
- Nav: add a "Social Cards" link to the admin layout nav.
- New dependency: `html-to-image` (npm, not CDN).

## Templates and fidelity

- The ten formats port verbatim from `tr_templates.jsx` / `tr_templates2.jsx`
  to TSX. Inline style objects are the spec — keep values as-is.
- Exception: font-family strings become the site's `next/font` variables
  (`var(--font-inter)`, `var(--font-roboto-mono)`). Loaded weights already
  cover every weight the templates use (Inter 400–900, Roboto Mono 400–700);
  no font config changes.
- `AutoFitHeadline` ports directly — it measures real DOM scrollHeight and
  shrinks font-size until the text fits maxLines.
- Wordmark: `public/logo-tight.png` (never the padded `logo.png`).
- Canvas sizes: feed cards 1080×1350, story 1080×1920, video cover 1920×1080.
- Registry keys and per-format labels match the prototype
  (`breaking, article, quote, stat, markets, rate, event, explainer, story, cover`).

## State

- One flat typed `CardTweaks` object (interface derived from `TWEAK_DEFAULTS`
  in `tr_app.jsx`).
- Defaults seeded from `example_state.json`'s reviewed copy, with the
  hardcoded production bucket image URLs stripped (admin images come from
  `articles.hero_image`, the storage picker, or upload).
- Persisted to localStorage under key `tr_admin_cards_v1`; data-URL values
  over 100KB are not persisted (session-only), matching the prototype's
  quota guard. The prototype's `tr_state_v7` migration shims are not ported.
- Explainer carousel = 5 virtual slides (cover, 3 points, outro) driven by an
  `explainerSlide` index with the C/1/2/3/E slide nav.

## Data flow (prefill)

- `page.tsx` fetches on the server and passes down:
  - **Stories:** Supabase query identical to `/api/news`: `articles` select
    `slug, title, dek, source_name, hero_image, category:categories(slug)`
    where `status = 'published'` order `published_at desc` (first 12 used by
    the panel).
  - **Rates:** `fetchLiveRates()` + `toLRDRates()` from
    `@/domain/markets/exchange`.
  - **Commodities:** `fetchCommodities()` from `@/domain/markets/commodities`
    for the Markets card rows.
- `SyncPanel` applies a story to the card via the `TR_CAT_MAP` mapping:
  `title → headline/articleTitle/coverTitle`, `dek → subtext/articleExcerpt`,
  `hero_image → card image`, `category.slug → chip`.
- A refresh button re-runs the fetches through server actions in
  `_actions.ts` — same-origin, no CORS proxies.

## Image sources

Per-format image slot with three inputs, all feeding the same tweak key:

1. Article prefill (`hero_image`).
2. Storage picker: server action lists the `article-images` bucket
   (name + public URL), client renders a thumbnail grid.
3. Upload (FileReader → data URL, session-only) or pasted URL.

Vertical crop via `object-position: 50% {posY}%` with a 0–100 slider.

## PNG export

- Client-side `html-to-image` on the actual previewed DOM node — WYSIWYG by
  construction.
- Procedure (from the prototype): temporarily clear the preview's
  `transform: scale()`, await `document.fonts.ready` plus a settle tick,
  `toPng(node, { width, height, pixelRatio: 1, backgroundColor: '#050d11',
  cacheBust: true })`, restore the transform.
- **pixelRatio 1** (decided): exports at exact platform dimensions
  (1080×1350 etc.), per the README, not the prototype's 3×.
- Filename: `truerate-{format}-{yyyy-mm-dd}.png`.
- Explainer export loops slides 0–4 into 5 PNGs
  (`truerate-explainer-{n}-{yyyy-mm-dd}.png`).
- Remote images (Supabase storage) load with `crossOrigin` handling +
  `cacheBust` so the canvas isn't tainted; Supabase public storage already
  serves permissive CORS headers.

## CORS side-change

`/api/news` and `/api/rates` responses gain
`Access-Control-Allow-Origin: *`. Both are public, rate-limited, read-only.
No preflight handler needed (simple GETs).

## Error handling

- Rates/commodities fetch failure at page load: studio still renders with
  seed defaults; SyncPanel shows a status line for the failed source.
- Server action refresh failure: inline status message in the panel.
- Export failure: inline error near the export button — no `alert()`.
- Storage picker list failure: inline message with retry.

## HCI

The card faces are pixel-perfect spec and exempt from UI-chrome rules (they
are images, not interactive UI). The studio chrome follows the repo's HCI
guidelines: every input labelled, `focus-visible` rings, ≥44px targets,
`aria-expanded`/`aria-controls` on panel toggles, Escape closes panels,
decorative SVGs `aria-hidden`, the preview announced with a text description
of the current format/size.

## Testing and verification

- `npm run lint`, typecheck, `npm run build` pass.
- Manual visual QA: load `example_state.json` content and compare every
  format/variant against the prototype rendering (open
  `TrueRate Social Templates.html` with the same state as reference).
- Export QA: verify PNG dimensions per format and that remote hero images
  render in the export.
- Keyboard-only pass per the HCI checklist.

## Design-bundle disposition

The `design_handoff_admin_social_cards/` directory remains untracked local
reference material; this spec is the committed record. (Julian opted to
implement the feature, not to commit the bundle.)
