# TrueRate — Claude working notes

Liberia-focused financial news / Yahoo-Finance-style product. Next.js App Router, Tailwind, Recharts.

## CBL Data Warehouse (MCP)

The `truerate-mcp` Supabase edge function exposes all CBL statistical data as MCP tools. When writing, editing, or fact-checking any article with economic data:

1. **Never fabricate numbers.** Every figure must come from an MCP tool call (`series_statistics`, `get_series`, `fact_check`, etc.).
2. **Use exact values.** Write "189.45 LRD per USD" not "approximately 190 LRD". Use the `value` field as-is.
3. **Always cite the period.** Every figure needs its period label: "in March 2026" or "(Mar-26)".
4. **Fact-check before publishing.** Run `fact_check` on any numerical claim against the relevant mnemonic.
5. **Check data freshness first.** Run `data_quality_report` before writing any content to ensure series are current.
6. **Cross-validate multi-indicator stories.** Run `cross_validate` when citing 2+ indicators together to verify directional consistency.
7. **Never claim correlation without data.** Only use "correlated" when Pearson |r| ≥ 0.5 from `compare_series`. Use "associated" for 0.3–0.5. Say "no meaningful correlation" below 0.3.
8. **Never claim causation.** Use "coincided with", "associated with", "correlated with" — never "caused by" or "driven by".

### Automated workflow triggers

These workflows fire automatically based on the request — no manual `/skill` invocation needed. Detect the intent and run the full pipeline.

#### WRITE — "write an article", "create a story", "draft a piece about", "new article on"
1. `search_series` → identify relevant CBL mnemonics from topic
2. `data_quality_report` → gate: abort if any series is stale
3. **`/validate-data` on referenced series** → pre-flight integrity check; abort if any HIGH-severity finding (e.g. non-25bp policy rate change)
4. `article_data_sheet` → assemble formatted data sheet (every number comes from here)
5. `trend_analysis` + `outlier_detection` → deeper context for primary series
6. If 2+ indicators: `compare_series` + `cross_validate` → correlation + consistency check
7. Write the article body using **only** values from the data sheet
8. `verify_article_data` → automated claim-by-claim fact-check
9. Fix any MISMATCH, re-verify until all pass
10. Output: article with macroTags, data box, source attribution

#### VERIFY — "check this article", "verify", "audit", "is this accurate", "fact check"
1. Load article (from `src/data/news.ts` by ID, or `get_article` by slug, or inline text)
2. `data_quality_report` → freshness check on all macroTags
3. `verify_article_data` → automated extraction and matching of every number
4. Recompute all percentage claims from raw values
5. If 2+ indicators: `cross_validate` → directional consistency
6. `outlier_detection` → flag unacknowledged anomalies
7. Output: claim-by-claim verdict table + corrections list

#### DATA BRIEF — "what's the latest on", "give me the data on", "data brief", "numbers for"
1. `search_series` → find relevant mnemonics
2. `data_quality_report` → freshness gate
3. `article_data_sheet` → formatted values + YoY + trends
4. `series_statistics` → Bloomberg-style summary per series
5. `trend_analysis` → moving averages, volatility, momentum
6. If multi-indicator: `compare_series` + `cross_validate`
7. `outlier_detection` → anomaly flags
8. Output: structured brief with key figures, technicals, correlations

#### CORRELATE — "compare", "correlation between", "how does X relate to Y", "X vs Y"
1. Resolve series: mnemonics or `search_series` for keywords
2. `data_quality_report` → freshness gate
3. `compare_series` → Pearson coefficients + aligned data
4. `cross_validate` → directional consistency
5. `series_statistics` + `trend_analysis` → per-series context
6. `outlier_detection` → coincident anomalies
7. Output: correlation matrix, editorial guidance, optional narrative paragraph

#### EDIT — "update article", "change the number", "fix this article", "edit the piece"
1. Load article from `src/data/news.ts` or CMS
2. `article_data_sheet` → pull latest data for all macroTags
3. Apply edits using only values from the data sheet
4. `verify_article_data` → re-verify after edits
5. Fix any MISMATCH, re-verify until clean
6. Output: updated article with verification report

#### VALIDATE — "check the data", "validate data", "data integrity", "audit the database", "sanity check"
Full quantitative audit. Act as a senior data scientist — question every value, apply every test, prove every finding mathematically.
1. Reconnaissance: full history pull (`get_series`), `series_statistics`, `data_quality_report` for all targets
2. Statistical forensics: Z-score outlier detection (standard + modified), Benford's Law (χ² test, α=0.05), continuity/gap detection, structural break detection (variance ratio)
3. Domain convention checks: 25bp grid test (MPR), covered interest rate parity (LRD vs USD), plausible range checks, velocity caps, stale-repeat detection
4. Macroeconomic identity checks: Debt = Domestic + External, Trade balance = Exports − Imports, M2 ≥ Reserve money, Nominal GDP ≥ Real GDP, money multiplier stability
5. Cross-series consistency: `cross_validate` + `compare_series` on related pairs with Pearson r thresholds
6. Pipeline integrity: DB latest vs codebase fallbacks vs MPC communiqués
7. Article impact scan: search `src/data/news.ts` for any incorrect values found
8. Output: professional audit report with severity classification (CRITICAL/HIGH/MEDIUM/LOW), mathematical proofs, corrective SQL, and overall integrity score

#### ECONOMY SNAPSHOT — "how's the economy", "macro overview", "economy dashboard"
1. `macro_snapshot` → latest value for every CBL series
2. `data_quality_report` → freshness check on key series
3. Highlight: FX rate, CPI, GDP, policy rate, trade balance, debt, money supply
4. Output: structured dashboard with trends and changes

### Key MCP tools for content

| Tool | Purpose |
|------|---------|
| `series_statistics` | Bloomberg-style summary: latest, change, YoY, min/max/mean, trend |
| `compare_series` | Correlate 2–6 series with aligned data + Pearson coefficients |
| `macro_snapshot` | Full economy dashboard — latest value for every CBL series |
| `fact_check` | Verify a claim against actual data for a specific period |
| `article_data_context` | All tagged CBL series + values for a given article |
| `get_series` / `search_series` | Look up series by mnemonic or keyword |
| `trend_analysis` | Moving averages (3/6/12), volatility, momentum, support/resistance |
| `data_quality_report` | Pre-publication freshness + completeness check (1–10 series) |
| `period_comparison` | Compare any two time ranges (QoQ, HoH, custom) with exact values |
| `outlier_detection` | Z-score anomaly detection with severity levels |
| `cross_validate` | Directional consistency check between 2–6 related series |
| `verify_article_data` | **Automated fact-checker**: extracts every number from article text, matches against CBL data with unit conversion, returns claim-by-claim EXACT/SUPPORTED/MISMATCH verdicts. Mandatory before publishing. |
| `article_data_sheet` | **Pre-write data assembly**: given mnemonics, returns formatted data sheet with publication-ready values (US$2.82B, L$299.4B, 16.3%), YoY changes, trends. Build the article from this sheet — no other source of numbers. |

### Skills (also invocable manually via `/skill-name`)

- `/data-brief <topic>` — Generate a publication-ready data brief with exact CBL figures
- `/fact-check <slug>` — Verify all numbers in an article against real data
- `/write-article <topic>` — Write a data-backed article at Bloomberg/Yahoo Finance quality
- `/verify-article <id>` — Automated data integrity audit of an article against the CBL warehouse
- `/correlate <series...>` — Multi-series correlation analysis with Pearson coefficients and editorial guidance
- `/validate-data [series|group]` — Senior data scientist–grade integrity audit: Z-score outliers, Benford's Law, 25bp grid tests, macroeconomic identity checks, cross-series correlation, pipeline consistency. Blocks article publication on CRITICAL/HIGH findings. Every finding is mathematically proven.

## HCI guidelines (apply to every UI change)

These rules are non-negotiable for any new or edited interactive UI. They blend WCAG 2.2 AA, Nielsen heuristics, and platform conventions. When a rule conflicts with a request, surface it — don't silently break it.

### 1. Structure & semantics

- Every page has exactly one `<h1>`. Headings descend without skipping levels.
- Use real landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`. Annotate duplicates with `aria-label` (`<nav aria-label="Footer">`).
- Lists are `<ul>`/`<ol>`, tables are `<table>` with `<thead>` + `scope="col"` on headers and an `sr-only` `<caption>`.
- Forms use `<form>` with a real submit handler and a `<label>` (visible or `sr-only`) for every input.
- Internal navigation uses `next/link`. Reserve `<a href>` for external/mailto/tel links.

### 2. Keyboard & focus

- Everything clickable is reachable by Tab and operable with Enter/Space. No `onMouseEnter`-only menus — pair with click + Escape.
- Visible focus on every interactive element: `focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none`. Never set `outline:none` without a replacement.
- Modals/drawers: trap focus inside, restore focus to the trigger on close, close on Escape, lock body scroll. (Header's MobileMenu is the reference implementation.)
- Disclosure widgets (accordions, dropdowns) expose `aria-expanded` and reference their content via `aria-controls`.

### 3. Touch & pointer targets

- Minimum 44×44px hit area (WCAG 2.5.5). For visually small icons, expand the click area with padding, not transforms.
- Never rely on hover alone for critical info — every hover state has a focus or tap equivalent.

### 4. Color & contrast

- Body text and UI labels: ≥4.5:1 against background. Large text (≥18px bold or ≥24px regular): ≥3:1.
- Tailwind shorthand: `text-gray-500` on dark (`bg-brand-dark`) is borderline — prefer `text-gray-400` for body, `text-gray-500` only for de-emphasized metadata ≤12px, and check with a contrast tool when unsure.
- Color is never the only carrier of meaning. Up/down deltas pair color with `+`/`−` signs or arrows.

### 5. Motion & live regions

- Wrap decorative animation in `motion-safe:` so `prefers-reduced-motion` users get static UI. Pulse dots, autoplay, parallax — all gated.
- Content that updates without user action (live feeds, tickers, toast) gets `aria-live="polite"` (or `"assertive"` for errors). Counters/timers that change every second should not be live-announced.

### 6. Images & icons

- Decorative images: `alt=""` and `aria-hidden="true"`. Informative: `alt="<concise description>"`.
- Standalone icon buttons (no visible text) must have `aria-label`. SVGs inside labelled buttons get `aria-hidden="true"`.

### 7. Data visualization

- Every chart has a text summary nearby (one sentence stating the headline) and an `aria-label` or `<figcaption>` describing the data shape.
- Tooltips that appear on hover must also appear on keyboard focus, or the underlying data must be available another way (table, list).

### 8. Error prevention & feedback

- Destructive actions confirm. Forms validate inline with `aria-invalid` and `aria-describedby` pointing at the error message.
- Empty `<input>` submissions don't navigate or no-op silently — show an inline message.

### Quick checklist before merging UI changes

1. Tab through the page — every interactive thing is reachable, focus is visible.
2. Test with the keyboard only — open menus, close them with Escape, submit forms with Enter.
3. Zoom to 200% — layout doesn't break; text doesn't get clipped.
4. Run `prefers-reduced-motion` — nothing animates that doesn't have to.
5. Check contrast on any new color combination.
