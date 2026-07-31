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

### Editorial standards — one story, one article

TrueRate is a professional financial news platform. Apply Yahoo Finance / Bloomberg editorial discipline:

1. **One data point, one article.** If March 2026 cement output already has an article, don't write a second one. Update the existing article or pitch a genuinely new angle to the user first.
2. **Duplicate = same headline data.** Two articles that cite the same primary figure (e.g. "89,000 MT cement", "exports $2.07B", "lending rate 13.11%") for the same period are duplicates regardless of editorial angle. The angle can differ; the lead number cannot.
3. **Repackaging is not a new article.** Taking an Economy article and rewriting it as a Business article is a duplicate. If the audience changes, update the original or link to it — don't create a parallel version.
4. **Data recycling degrades trust.** Readers who see "13.11% lending rate" in 7 different articles lose confidence in the editorial voice. Reference the figure once in a dedicated article, then link to it from other pieces that mention it in passing.
5. **When in doubt, UPDATE.** If new data arrives for a topic that already has an article, update that article rather than writing a new one — unless the story has fundamentally changed (e.g. a policy rate cut after months of holds).

### House style — TrueRate voice and structure

TrueRate reads like Yahoo Finance or Bloomberg for Liberia. The voice is a smart business journalist explaining data to a Liberian businessperson. Vivid, concrete, never sensational — the examples are the vividness, not the adjectives.

> For the social-cards **Explainer carousel** (the plain-language, swipeable format at `/admin/social-cards`), a separate and simpler voice applies — no jargon, everyday scenarios, for any Liberian regardless of financial literacy. See [Explainer hook house style](docs/social-cards-explainer-house-style.md).

#### Headlines

1. **≤12 words.** Lead with the hook: a number, a change, an insight, or a consequence.
2. **Never lead with "Liberia" / "Liberia's" / "Liberian."** The reader is already on TrueRate — a Liberia-focused platform. Starting with "Liberia's" is like Yahoo Finance starting every headline with "America's." The country name may appear mid-headline for clarity, but it is never the first word.
3. **Vary structure across a batch.** Colon titles ("The Cost of Credit: Why Businesses Pay 13%"), em-dash follow-ups ("Revenue Hits $304 Million — What It Means for Contractors"), question hooks ("Where the $5.2 Billion Economy Really Comes From"), declarative statements ("VAT Set to Replace GST in Biggest Tax Overhaul in Years"). Don't repeat the same pattern in consecutive articles.
4. **Use % in headlines and deks.** Spell out "percent" in body text.

#### Dek (standfirst)

1. **1–2 sentences.** Include the headline figure with exact value and period.
2. **End with the consequence** — the "so what" or "who this affects." The dek sells the article to someone deciding whether to read it.
3. **May use % and abbreviations** (US$, L$, CBL) that would be spelled out in body text.

#### Body

1. **No dateline.** Do not start with "MONROVIA —" or any wire-service dateline. Open directly with the lede sentence.
2. **Lede = one declarative sentence.** Key figure, exact value, period, source. No throat-clearing, no scene-setting.
3. **Second paragraph = context.** Prior period, year-ago comparison, 24-month average, or share of a total. The reader needs to know whether the number is high, low, or normal.
4. **"For [audience]" paragraphs.** This is the TrueRate signature. Ground every abstract number in impact on a specific group: "For cookshop owners borrowing L$500,000…", "For businesses that sell to the state…", "For the market women in Red Light…". Use real Liberian archetypes — keke operators, market traders, susu club members, construction subcontractors — not generic "stakeholders."
5. **Concrete math.** Don't just say "the spread is wide." Say "a spread of 11.17 percentage points means a borrower pays L$65,000 per year in interest on L$500,000 before repaying any principal." Make the reader feel the number.
6. **One idea per paragraph.** 3–5 sentences max. Short paragraphs scan well on mobile.
7. **Close with a forward look or practical takeaway.** Never recap or summarize. End with "what to watch," a structural insight, or actionable guidance. The last sentence should leave the reader thinking, not reviewing.
8. **Cross-link related articles** with `[text](/news/slug)` when citing a figure that has its own dedicated article. This is how TrueRate avoids data recycling while keeping stories connected.

#### Numbers and attribution

1. **Numerals for all money, percentages, and data points.** No exceptions.
2. **"percent" in body, "%" in headlines/deks.** Never mix in the same context.
3. **Distinguish "percentage points" from "percent."** A rate moving from 12% to 13% rose 1 percentage point (or 8.3 percent). Never conflate them.
4. **Currency prefix always explicit.** US$5,159.74 million, L$500,000. Never bare "$" — always US$ or L$.
5. **First reference spells out the source** with abbreviation: "Central Bank of Liberia (CBL)", "Liberia Institute of Statistics and Geo-Information Services (LISGIS)." Subsequent references use the abbreviation.
6. **Use exact CBL values.** Write "13.11 percent" not "about 13 percent." Rounding is editorializing.
7. **Derive regime dates from the series, never from other articles.** "Held at X since <month>" / "Nth consecutive month" / "first since" must come from locating the observation where the value last changed (`get_series`). A wrong "since December 2025" MPR date (actual: October 2025) once propagated into six articles because each copied the previous one.
8. **Never generalize from an outlier month.** If a component of a cited figure is >3× its trailing median (or |z| > 3), scope every share/ratio claim to that month and acknowledge the anomaly in the same sentence — e.g. "tax covered a fifth of revenue" was true only in the month a US$244.91M one-off receipt landed.
9. **Recompute derived ratios from exact stored values and round once, at the end.** 175.13 / 263.28 is 66.52 percent, not 66.53.
10. **Component-identity gate.** Before citing an aggregate with published sub-components (revenue, expenditure, debt, broad money, trade balance), verify the components sum to it for that exact period. If they don't, the figure may be corrupted at the source — don't publish it; run `/validate-data`.
11. **Mechanical style is enforced by `npm run lint:editorial` (CI, seed) and `npm run lint:editorial:db` (seed + live catalog).** Run the `:db` variant before publishing anything: it catches bare $, Liberia-led headlines, datelines, banned words, and cross-catalog precision drift (4.5% vs 4.50%).

#### Tone and word choice

1. **Neutral analytical voice.** Factual verbs of direction: rose, fell, climbed, dropped, jumped, slid, expanded, contracted, narrowed, widened. These are precise, not hype.
2. **Banned words and phrases:** massive, surge (as filler verb), shocking, game-changing, explosive, soaring, skyrocketing, unprecedented (unless literally verified as first-ever), slam, tank, crater, plummet (unless >20% decline), "it remains to be seen," "only time will tell." These are filler that substitutes drama for analysis.
3. **No editorializing.** The article presents data and explains consequences. It does not tell the reader what to feel about the data. "The spread is 11 percentage points" — not "the spread is alarmingly wide."
4. **No fabricated quotes, sources, or anecdotes.** If a quote would strengthen the piece, mark `[QUOTE NEEDED: subject, topic]` and flag it to the editor. Never invent a person.

#### Structure and length

1. **400–600 words** for data-driven pieces. Up to 900 for policy analysis or sector deep-dives.
2. **Not strict inverted pyramid.** The TrueRate structure is: lede (key number) → context (comparison) → impact on specific audiences (multiple "For…" paragraphs) → structural analysis (why this is happening) → closing takeaway (forward look).
3. **Every article answers "so what for business."** This is the editorial mission. A macro number without a business consequence is a data brief, not an article.

### Visual standards — no duplicate images, high-quality only

Visualization is a core value. Every image on TrueRate must meet Yahoo Finance / Bloomberg visual standards:

1. **No duplicate hero images.** Every article gets its own unique hero image. Before assigning an image, check that no other published article uses the same file. Two articles sharing a hero image looks careless and undermines credibility.
2. **No stock-photo filler.** Hero images must be relevant to the story — a cement plant for cement output, the CBL building for policy rate, Freeport for trade. Generic skylines, handshake photos, and clip-art charts are not acceptable.
3. **High resolution only.** Minimum 1200px wide. No upscaled, pixelated, or watermarked images. WebP format preferred for performance.
4. **Consistent aspect ratio.** Hero images should be 16:9 or 3:2. Avoid portrait crops, square crops, or inconsistent sizing across the article catalog.
5. **Alt text on every image.** Descriptive `hero_alt` for screen readers ("Cemenco manufacturing plant in Monrovia" not "image1" or blank). Decorative-only images get `alt=""`.
6. **Charts and data visualizations.** Use the TrueRate design system (Recharts, brand colors). No screenshots of spreadsheets. Every chart needs a `/chart-narrative` companion for accessibility.
7. **No AI-generated imagery.** TrueRate is a data-driven news platform. All editorial images should be real photographs or purpose-built data visualizations — not AI-generated art, illustrations, or renders.

### Automated workflow triggers

These workflows fire automatically based on the request — no manual `/skill` invocation needed. Detect the intent and run the full pipeline.

#### WRITE — "write an article", "create a story", "draft a piece about", "new article on"
1. `search_series` → identify relevant CBL mnemonics from topic
2. **DUPLICATE GATE (mandatory, blocks publication):**
   - `search_articles` with 2–3 keyword queries covering the topic
   - `latest_articles` to check the most recent 20 articles
   - For each result, check: does it share the same primary data point AND period?
   - **If a match is found:** STOP. Show the existing article(s) to the user and ask: "This topic is already covered by [slug]. Should I (a) update that article with fresh data, (b) proceed with a new article because the angle is genuinely different, or (c) abort?"
   - Only proceed to step 3 if the user explicitly confirms no duplicate exists.
3. `data_quality_report` → gate: abort if any series is stale
4. **`/validate-data` on referenced series** → pre-flight integrity check; abort if any HIGH-severity finding (e.g. non-25bp policy rate change)
5. `article_data_sheet` → assemble formatted data sheet (every number comes from here)
6. `trend_analysis` + `outlier_detection` → deeper context for primary series
7. If 2+ indicators: `compare_series` + `cross_validate` → correlation + consistency check
8. Write the article body using **only** values from the data sheet
9. `verify_article_data` → automated claim-by-claim fact-check
10. Fix any MISMATCH, re-verify until all pass
11. Output: article with macroTags, data box, source attribution

#### EXPLAINER — "write an explainer", "make a hook", "explain [topic] for users", "plain-language [topic]", "explainer card / carousel"
Same rigor as WRITE, but the output is the **social-cards Explainer carousel** (cover hook + three two-part points + outro) — money news put in plain language anyone can understand. It is **derived 1:1 from one published, already-verified article**, never written from raw memory. Voice + rules: `docs/social-cards-explainer-house-style.md`. Hooks live in `src/app/admin/social-cards/_components/hookBank.ts`.
1. **Resolve the source article (required).** `search_articles` / `latest_articles` / `get_article` → the ONE published article this explainer sits on. If no article covers the topic yet, run **WRITE first** — the explainer is a translation layer on top of a verified article, not a substitute for it.
2. **DUPLICATE GATE (one hook per article, mandatory).** Check `hookBank.ts` for an entry with that article's `slug`. If one exists, STOP and **UPDATE** it — never add a second hook for the same article. (Slug uniqueness is enforced by `social-cards-hookbank.test.ts`.)
3. **Freshness gate.** `data_quality_report` on the article's macroTags/series → abort if any cited series is stale. A plain-language hook citing a superseded figure is still wrong.
4. **Assemble the numbers.** `article_data_context` / `article_data_sheet` (or the article body) → every figure in the hook + points comes from here, exact values, **this article only** (no borrowing a number from another story).
5. **Write in house style.** Cover hook = one plain sentence (archetype-led or curiosity gap, ≤~110 chars, never "Liberia"-led). Three points, each a bold takeaway + one plain-language body (who it affects & how), built **fact → contrast → consequence**. No jargon, `US$`/`L$` never bare `$`, no causation, no banned words.
6. **Verify.** `verify_article_data`-style claim check: every number in the hook/points matches the article/CBL; recompute any derived ratio. Plain-language lint: no jargon, period/currency correct, no causation/hype.
7. Fix any MISMATCH, re-verify until clean.
8. **Output:** a `HookEntry { slug, articleTitle, hook, points, bodies }` added to `hookBank.ts` under the article's category group; `npm test` (hook-bank + prefill) must pass.

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
8. Output: professional audit report with severity classification (CRITICAL/HIGH/MEDIUM/LOW), mathematical proofs, and overall integrity score. **The warehouse is never edited.** Each CRITICAL/HIGH finding is filed to `data_integrity_findings` (`scripts/file-integrity-finding.mjs`) for human review at `/admin/data-integrity`, and any article citing the disputed figure is set to `status = 'pending'` on the admin dashboard until the finding is resolved.

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

#### Content creation
- `/write-article <topic>` — Write a data-backed article at Bloomberg/Yahoo Finance quality. Includes mandatory duplicate gate and data integrity checks.
- `/update-article <slug>` — Update an existing article with fresh CBL data. Preserves editorial voice while swapping in current figures. The antidote to writing duplicates.
- `/write-explainer <topic|slug>` — Turn a published article into a plain-language Explainer carousel (hook + three two-part points). Same rigor as `/write-article` (source article → duplicate gate → freshness → exact figures → verify), but the voice is the [explainer house style](docs/social-cards-explainer-house-style.md) — money news anyone can understand.
- `/update-explainer <slug>` — Refresh an existing hook-bank entry with current figures from its source article, preserving the plain-language voice. The antidote to duplicate or stale hooks.
- `/data-brief <topic>` — Generate a publication-ready data brief with exact CBL figures.

#### Pre-publication verification
- `/fact-check <slug>` — Verify all numbers in an article against real data. Claim-by-claim verdicts.
- `/verify-article <id>` — Automated data integrity audit of an article against the CBL warehouse.
- `/headline-check <slug>` — Verify headline and dek claims specifically. Headlines are 10x more visible — a wrong number there does the most damage.
- `/editorial-lint <slug>` — Enforce Bloomberg/Yahoo Finance writing standards: no approximate language, period labels on every figure, attribution, no causation claims.
- `/number-lock <slug>` — Final pre-publication checkpoint. Runs ALL verification skills, then issues a signed audit certificate proving every number was verified at publish time.

#### Data integrity
- `/validate-data [series|group]` — Senior data scientist–grade integrity audit: Z-score outliers, Benford's Law, 25bp grid tests, macroeconomic identity checks, cross-series correlation, pipeline consistency. Blocks article publication on CRITICAL/HIGH findings.
- `/audit-trail <slug>` — Forensic provenance chain: traces every number in an article back to the exact MCP tool call, database field, and computation. Like a financial auditor's working papers.
- `/correlate <series...>` — Multi-series correlation analysis with Pearson coefficients and editorial guidance.

#### Catalog health
- `/dedup-check [topic]` — Scan the article catalog for duplicate or near-duplicate stories. Flags articles sharing the same headline data point and period.
- `/consistency-check [mnemonic]` — Verify the same figure is reported identically across all articles. Catches "13.11%" in one article vs "13.1%" in another.
- `/refresh-check [mnemonic]` — Find published articles whose data has been superseded by newer CBL releases. Prioritizes which articles to update first.

#### CBL translation layer
- `/mpc-explainer` — Plain-language explainer of an MPC policy rate decision. Translates the communiqué for a general audience with exact data, practical impact examples, and full rate-cycle context.
- `/data-release [period]` — First-responder coverage when new CBL data drops. Auto-detects what moved, ranks by newsworthiness, generates wire-style coverage or updates existing articles.
- `/indicator-explainer <indicator>` — Financial-literacy-grade explainer for any CBL indicator. Answers "what is this, why does it matter, what does the current number mean for me?" using Liberian examples.
- `/plain-language <slug>` — Rewrite any article at a lower reading level for broader reach. Same exact figures, simpler framing. No data is lost, no numbers are rounded.

#### Monitoring & alerts
- `/trend-alert [group]` — Scan CBL series for significant movements: direction reversals, record values, threshold crossings, acceleration, outliers, divergences. Quantitative tests, not editorial judgment.
- `/risk-monitor [domain]` — Red/amber/green dashboard for macro warning signs across inflation, currency, banking, fiscal, and growth domains. Quantitative thresholds calibrated for Liberia.
- `/quarterly-review [quarter]` — Comprehensive quarterly economic review synthesizing every CBL indicator. TrueRate's flagship periodic report.

#### Coverage discipline
- `/coverage-map [group]` — Audit which CBL series have dedicated articles and which don't. Identifies editorial gaps and suggests the next articles to write.
- `/sector-spotlight <sector>` — Deep-dive into a single economic sector: production, trade, GDP contribution, price dynamics, and structural role.
- `/mpc-preview` — Pre-MPC meeting data-driven preview. Presents the exact data the MPC will consider with a CUT/HOLD/HIKE scorecard. No predictions — just the numbers.

#### Context & accessibility
- `/chart-narrative <mnemonic>` — WCAG 2.2 AA text summaries for charts: aria-label, structured narrative, and underlying data table. Every chart needs a companion narrative.
- `/historical-context <indicator>` — Full historical arc for any current figure. Eras, inflection points, cycles, percentile position. The definitive reference for "where has this number been?"
- `/peer-benchmark <indicator>` — Compare a Liberian indicator against regional peers (Sierra Leone, Guinea, Ghana, Côte d'Ivoire). Liberia figures from the CBL warehouse; peer figures fetched live from IMF/World Bank/peer central banks with per-row citations — never from memory.

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
