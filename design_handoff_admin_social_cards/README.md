# Handoff: /admin/social-cards — Social Media Card Generator for TrueRate Admin

## Overview
Add a **Social Cards** page to the TrueRate admin (`src/app/admin/social-cards/`) that generates on-brand social media graphics from live site data. Editors pick a format (Breaking, Article, Quote, Big Stat, Markets, Daily Rate, Event, Explainer carousel, Story, Video Cover), prefill it from any published article or live rates with one click, tweak the copy, and export a PNG sized for the platform.

## About the Design Files
The files in this bundle are **design references created in HTML/JSX** — working prototypes showing the exact look and behavior. They are NOT production code to copy directly. The task is to **recreate them inside the TrueRate Next.js codebase** (App Router, TypeScript, Tailwind, Supabase) using its established patterns: server components + `_actions.ts` where appropriate, `requireAdmin()` gating, and the existing admin layout (`src/app/admin/layout.tsx`).

The prototype files use React 18 UMD + Babel in-browser; convert to TSX modules. All styles are inline style objects — port values verbatim (they are the spec) or translate to Tailwind arbitrary values.

## Fidelity
**High-fidelity.** Colors, type sizes, spacing, and layout are final and were reviewed against Yahoo Finance's social style. Recreate pixel-perfectly.

## Files in this bundle
- `TrueRate Social Templates.html` — app shell (fonts, canvas scaling, script imports)
- `tr_templates.jsx` — formats: Breaking, Article, Quote, Big Stat, Markets (terminal + broadsheet variants), AutoFitHeadline, shared footer
- `tr_templates2.jsx` — formats: Daily Rate, Event, Explainer (5-slide carousel), Story (1080×1920), Video Cover (1920×1080)
- `tr_app.jsx` — toolbar, tweaks panel, state, localStorage persistence, PNG export target
- `tr_sync.jsx` — "Pull from Site" panel (replace its proxy fetches with same-origin/server calls — see below)
- `TrueRate Brand Guidelines.html` — the written spec (sizes, colors, voice rules)

## Architecture in the target codebase

```
src/app/admin/social-cards/
  page.tsx            // server component: requireAdmin(), fetch initial data
  _components/
    SocialCardStudio.tsx   // client component: toolbar + canvas + controls
    templates/             // one file per format, ported from tr_templates*.jsx
    ExportButton.tsx       // html-to-image or satori-based PNG export
```

### Data wiring (the big win over the prototype)
Same-origin — **no CORS, no proxies**:
- **Stories**: query Supabase directly in the server component, same as `/api/news` does: `articles` select `slug, title, dek, source_name, hero_image, category:categories(slug)` where `status = 'published'` order `published_at desc`. Pass to the client component.
- **Rates**: reuse `fetchLiveRates()` + `toLRDRates()` from `@/domain/markets/exchange` (what `/api/rates` uses).
- **Commodities** (optional, for the Markets card): `fetchCommodities()` from `@/domain/markets/commodities`.
- Article → card mapping: `title → headline/articleTitle/coverTitle`, `dek → subtext/articleExcerpt`, `hero_image → card image`, `category.slug → chip` via the map in `tr_sync.jsx` (`TR_CAT_MAP`).

### PNG export
The prototype scales the fixed-size card with `transform: scale()` and exports the unscaled node. Use `html-to-image`'s `toPng(node, { width, height, pixelRatio: 1 })` on the unscaled card element, or render server-side with `@vercel/og`/satori if you prefer no client dependency. Filename convention: `truerate-{format}-{yyyy-mm-dd}.png`.

## Canvas sizes
- Feed cards (Breaking, Article, Quote, Big Stat, Markets, Daily Rate, Event, Explainer slides): **1080×1350**
- Story: **1080×1920** (keep content 250px clear of top/bottom)
- Video Cover: **1920×1080**

## Design tokens
- Dark `#050D11` (primary bg — site `brand-dark`) · Card `#040F18` (panels — site `brand-card`) · Lime `#BFEA36` (accent — chips, wordmark, key figures; never a background) · Surface `#F8F9FA` (broadsheet bg — site `brand-surface`) · Charcoal `#1E1E1E` (approved neutral — site footer bg; utility bands only) · Negative `#E11B22` (site `neg`) · Green `#00a757` (positive on light)
- Fonts: **Inter** (300–900) for headlines/body, **Roboto Mono** (400–700) for labels/chips/data meta — the site's `font-mono` token.

## Type scale (on 1080-wide canvas — port verbatim)
- **Headline**: Inter 800, auto-fit 54–78px (Breaking/Article/Cover), line-height 1.12, letter-spacing −1px, max 4 lines, white, `text-wrap: balance`. See `AutoFitHeadline` in `tr_templates.jsx` — port this component; it shrinks font-size until scrollHeight fits maxLines.
- **Quote**: same auto-fit 46–68px, max 6 lines; 180px lime quote glyph; attribution 34px (author 700 + role 400, both lime); context 26px rgba(255,255,255,0.75)
- **Chips**: Roboto Mono 700, 22px, tracking +3, uppercase, lime bg `padding: 12px 22px`, navy text
- **Eyebrows** ("FIGURE OF THE DAY"): Roboto Mono 600–700, 22–24px, tracking +4, lime
- **Meta rows** (dates, sections): Roboto Mono, 20px, tracking +2, uppercase, 55–60% opacity
- **Body/excerpt**: Inter 400, 24–26px, line-height 1.5
- **Market rows**: label Inter 700 30px · value Inter 700 48px · change Roboto Mono 700 26px (lime up / red down)
- **Photo credit**: Inter 400, 30px, uppercase ("PHOTO: GETTY IMAGES")
- **Big stat number**: Inter 800, 200–280px, lime on navy

## Footer (every card — the brand lockup)
Photo-led cards (Breaking, Article, Quote, Story, Video Cover) — single flex row, `alignItems: center`, `justify-content: space-between`, 28px from bottom edge, 48px side margins:
- Left: photo credit or source line (30px Inter 400 uppercase)
- Right: TrueRate wordmark image, **64px tall** (use `public/logo-tight.png` from the repo — the trimmed asset; the padded `logo.png` breaks sizing)

## Layout rules
- 48px margins on all content sides; headline/chip/credit share the left edge
- Photos full-bleed with vertical gradient scrim (`linear-gradient(180deg, rgba(6,30,41,0) 40%, rgba(6,30,41,0.92) 78%)`) — never a solid box behind text
- Two variants per news format: **terminal** (navy + photo) and **broadsheet** (paper, editorial). Variant toggle in toolbar.
- Vertical image crop: `object-position: 50% {posY}%` with a 0–100 slider per image

## Interactions & state
- State = one flat `tweaks` object (see `TWEAK_DEFAULTS` in `tr_app.jsx` for every key + default copy). Persist to localStorage (`tr_state_v7` in prototype; pick a fresh key).
- Toolbar: format buttons, variant toggle, explainer slide nav (C/1/2/3/E), Tweaks panel toggle, Pull-from-Site panel, Export PNG.
- Explainer = 5 virtual slides (cover, 3 points, outro CTA) — export loops slides 0–4 into 5 PNGs.
- Image upload: file input → object URL → card image (admin version can also pick from Supabase `article-images` storage).

## Auth & nav
- Gate with `requireAdmin()` (same as other admin pages).
- Add "Social Cards" link to the admin nav in `src/app/admin/layout.tsx`.

## Also recommended (one-liner)
Add `Access-Control-Allow-Origin: *` headers to `/api/news` and `/api/rates` responses so the standalone HTML prototype keeps working without proxies. Harmless — both are public, rate-limited, read-only.

## Assets
- `public/logo-tight.png` (in repo) — footer wordmark
- Photos come from `articles.hero_image` (Supabase public storage) or editor upload


## Wordmark placement (v2)
Data cards (Big Stat, Markets, Daily Rate, Event, Explainer) place the wordmark **upper-left** in the header row (top 44 / left 48), opposite the date/section meta; their bottom strip carries only the source line. Photo-led cards keep the bottom-right lockup.


## Current editor state (v3 update)
`example_state.json` is a snapshot of the design as last reviewed in the prototype (the full `tweaks` object, localStorage key `tr_state_v7`). Use it as the seed/default state and as QA reference content: load it into the prototype (`localStorage.setItem('tr_state_v7', JSON.stringify(state))`) to see the exact reviewed rendering of every format. Note the image URLs point at the production Supabase `article-images` bucket — in the admin these come from `articles.hero_image`.
