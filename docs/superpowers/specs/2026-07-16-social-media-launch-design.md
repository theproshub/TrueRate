# TrueRate Social Media Launch — Facebook + Instagram

**Date:** 2026-07-16
**Owner:** Julian Sackey / Carlos Sennay
**Scope:** Establish TrueRate's external social presence on Facebook (existing) + Instagram (new), modeled on Yahoo Finance / Bloomberg.

---

## 1. Positioning

**One line:** *"Liberia's economy, explained in numbers you can trust."*

Every post answers: **what's the number, and what does it mean for you.** No opinions, no memes, no politics. Data with a consequence.

## 2. Profiles

| | Facebook | Instagram |
|---|---|---|
| Handle | `truerateliberia` (exists) | `@truerateliberia` (create) |
| Type | Page → News & Media Website | Professional → Business |
| Link | — | Link to FB page via **Meta Business Suite** (post once → both) |
| Profile pic | TrueRate mark on `brand-dark`, lime accent — identical on both | same |

**Bios**
- **IG:** `📊 Liberia's economy in numbers.` / `Data you can trust — sourced from CBL & LISGIS.` / `Read the full story ↓` / `truerateliberia.com`
- **FB About:** mission sentence + **"Independent. Not affiliated with the Central Bank of Liberia; we cite CBL data, we are not the CBL."**

## 3. Visual identity

Reuse `/admin/social-cards` templates as the feed:

| Template | Use | Format |
|---|---|---|
| Big-Stat | Workhorse — one indicator, one number, one takeaway | Portrait 4:5 (IG feed) |
| Breaking | CBL/LISGIS data releases, MPC decisions | 4:5 feed + 9:16 story |
| Event | MPC meetings, scheduled releases | 4:5 feed |
| Story | Daily "number of the day" | 9:16 |

Rules carried from house style: numerals for all figures, exact CBL values with period labels, **no caption leads with "Liberia's,"** no banned words, no fabricated numbers.

## 4. Content pillars

1. **📈 Number of the Day** — one CBL indicator (big-stat). *Daily.*
2. **🔎 What it means for you** — "For market women in Red Light…" angle. *2–3×/week.*
3. **📰 Breaking** — new CBL/LISGIS data the day it drops.
4. **🗓 On the calendar** — "MPC meets Thursday. The number to watch." *Weekly.*
5. **📚 Explainer** — plain-language carousel. *Weekly.*

## 5. Cadence

**Start: today, Thursday 2026-07-16.** Post **every day** from launch — 1 feed post/day + 1 story/day, Liberia time (GMT). Windows: **7–8am** (commute), **6–8pm** (evening).

**Repeating weekly rhythm** (once week 1 is done, this is the standing engine):

| Day | Standing slot |
|---|---|
| Mon | 📈 Number of the Day |
| Tue | 🔎 What it means for you |
| Wed | 📚 Explainer (carousel) |
| Thu | 📈 Number of the Day |
| Fri | 📈 Number of the Day (FX) |
| Sat | 📚 Explainer (light) |
| Sun | 📊 Weekly wrap (3 numbers) |

📰 **Breaking** overrides any slot the day CBL/LISGIS data drops. 🗓 **On the calendar** runs the day before a scheduled release.

---

## 6. Posting queue — backfilled from published articles

> **No brackets, no MCP needed.** Every number below is already published and fact-checked on the site. Each post pulls one figure from an existing article and links to it. Older data is fine — captions carry the **period label** ("in March 2026") so it reads as evergreen data, not fake-fresh news. Close every caption with `→ truerateliberia.com/news/<slug>`.
>
> **Live catalog: 67 published articles** (confirmed against the Supabase `articles` table, status=`published`, 2026-07-16). At 1 post/day that's ~2 months of banked content before we need fresh figures. The first two weeks below are locked; the Week 3+ list draws from the remaining 60. Full slug list in §9.

### Day 1 card — exact fields (`StatTerminal`, dark)

| Field | Value |
|---|---|
| `stat` | `11.17` |
| `statLabel` | `The gap between borrowing and saving` |
| `statContext` | `Liberian banks charged 13.11% to borrow but paid just 1.94% to save in February 2026 — an 11.17-point spread that means every savings account loses to inflation.` |
| `date` | `Feb 2026` |
| `category` | `Banking` |
| `statImage` | CBL building / bank-branch photo — real, ≥1200px, not a reused site hero, no AI. |
| source line | auto: `Source · CBL · LISGIS · TrueRate Research` |

**Alt text:** *TrueRate data card: 11.17 percentage-point gap between Liberia's 13.11% average lending rate and 1.94% savings rate, February 2026.*

### Day 2–7 card fields

All `StatTerminal` (dark) except Day 7. Big number is a legible display value; the exact figure always appears in `statContext`.

**Day 2 — Fri Jul 17 · Forex** — slug `exchange-rate-8-percent-shift-business-impact`
| Field | Value |
|---|---|
| `stat` | `L$184` |
| `statLabel` | `The US dollar now buys fewer Liberian dollars` |
| `statContext` | `The rate stood at L$183.93 per US$1 in March 2026 — down 7.92% from L$199.76 a year earlier. Cheaper imports; thinner margins for dollar-earners.` |
| `date` | `Mar 2026` |
| `category` | `Forex` |
| `statImage` | US$/L$ notes, forex bureau, or Freeport cargo. |

*Alt:* Liberian dollar at L$183.93 per US dollar in March 2026, down 7.92% year-on-year.

**Day 3 — Sat Jul 18 · Economy** — slug `liberia-5-billion-economy-sectoral-breakdown`
| Field | Value |
|---|---|
| `stat` | `US$5.16B` |
| `statLabel` | `The size of the economy in 2025` |
| `statContext` | `GDP reached US$5,159.74 million in 2025, up 8%. Services are 38.7% of output, agriculture 28.7%, and mining 18.4% — nearly double its share four years ago.` |
| `date` | `2025` |
| `category` | `Economy` |
| `statImage` | Monrovia skyline / port / mixed-sector montage. |

*Alt:* Liberia's GDP reached US$5.16 billion in 2025, up 8 percent, led by services at 38.7 percent.

**Day 4 — Sun Jul 19 · Commodities** — slug `gold-export-concentration-risk-march-2026`
| Field | Value |
|---|---|
| `stat` | `66.52%` |
| `statLabel` | `Gold's share of everything Liberia exports` |
| `statContext` | `Gold exports hit US$175.13 million in March 2026, up 111.87% year-on-year. With iron ore, two metals are 92.59% of all export earnings.` |
| `date` | `Mar 2026` |
| `category` | `Commodities` |
| `statImage` | Gold bars / mining operation / gold pour. |

*Alt:* Gold was 66.52 percent of Liberia's total exports in March 2026, at US$175.13 million.

**Day 5 — Mon Jul 20 · Banking** — slug `money-supply-299-billion-composition-shift-march-2026`
| Field | Value |
|---|---|
| `stat` | `L$299B` |
| `statLabel` | `The total money supply — but savings are shrinking` |
| `statContext` | `Broad money reached L$299,356.37 million in March 2026, up 10.66% year-on-year. Savings deposits fell 6.51% while cash and demand deposits rose 7.86%.` |
| `date` | `Mar 2026` |
| `category` | `Banking` |
| `statImage` | Bank vault / cash counting / CBL interior. |

*Alt:* Liberia's broad money supply reached L$299.4 billion in March 2026, up 10.66 percent year-on-year.

**Day 6 — Tue Jul 21 · Fiscal** — slug `government-revenue-surges-march-2026`
| Field | Value |
|---|---|
| `stat` | `US$304M` |
| `statLabel` | `Government revenue in a single month` |
| `statContext` | `Total revenue hit US$304.37 million in March 2026 — nearly four times February's US$77.69 million. When the state has cash, contractors get paid; but it's lumpy.` |
| `date` | `Mar 2026` |
| `category` | `Fiscal` |
| `statImage` | Ministry of Finance / government building / LRA. |

*Alt:* Liberia's government revenue reached US$304.37 million in March 2026, nearly four times February's total.

**Day 7 — Wed Jul 22 · Feature (no stat card)** — slug `monrovia-hustle-liberia-open-world-game`
- Hero-image link post (variety break). Use the article hero (real photo, no AI). No `StatTerminal` — its hook (US$184B global games industry) is not CBL/LISGIS data, and the card's source line would misattribute it.
- Caption: the Wed Jul 22 text in §6 Week 1.
- *Alt:* Screenshot from Monrovia Hustle, a 3D open-world game set in downtown Monrovia built by solo studio HUIX-2099.
>
> **Template legend:** `BS` = Big-Stat card (single number). `BR` = Breaking card. `EV` = Event card. `FT` = Feature link-post (hero image + caption, no stat card — used for the tech/startup profiles that have no single CBL number).

### Week 1

**Thu Jul 16 · Launch (pinned) · `BS`** — slug `banking-spread-13-percent-lending-2-percent-savings-feb-2026`
> Welcome to TrueRate. 📊
>
> Liberian banks charged **13.11 percent** to borrow and paid just **1.94 percent** to save in February 2026 — a spread of **11.17 percentage points**, according to the Central Bank of Liberia.
>
> We turn CBL data into numbers you can actually use. Follow for the figure that shapes your business — every morning.
> → truerateliberia.com
*Story:* "We're live. The number that runs your business, every morning. Follow."

**Fri Jul 17 · FX · `BS`** — slug `exchange-rate-8-percent-shift-business-impact`
> The Liberian dollar strengthened to **L$183.93 per US dollar** in March 2026 — up **7.92 percent** in a year (from L$199.76).
>
> For importers, a US$10,000 container now costs about **L$158,000 less** than a year ago. For dollar-earners, margins get thinner. → /news/exchange-rate-8-percent-shift-business-impact
*Story:* "This week's rate: L$183.93 / US$1."

**Sat Jul 18 · GDP explainer · `BS`** — slug `liberia-5-billion-economy-sectoral-breakdown`
> The economy crossed **US$5.16 billion** in 2025 — up **8 percent** in nominal terms, per LISGIS.
>
> Where it comes from: services **38.7%**, agriculture **28.7%**, and a mining sector that's nearly doubled its weight in four years. → /news/liberia-5-billion-economy-sectoral-breakdown
*Story:* poll — "Which sector is biggest? 🏦 / 🌾 / ⛏"

**Sun Jul 19 · Commodities · `BS`** — slug `gold-export-concentration-risk-march-2026`
> Gold exports hit **US$175.13 million** in March 2026 — up **111.87 percent** year-on-year, now **two-thirds (66.52%)** of everything Liberia exports.
>
> With iron ore, two metals are **92.59%** of export earnings. One global price move is now a national-accounts event. → /news/gold-export-concentration-risk-march-2026

**Mon Jul 20 · Money & banking · `BS`** — slug `money-supply-299-billion-composition-shift-march-2026`
> The money supply reached **L$299.4 billion** in March 2026, up **10.66 percent** year-on-year — but savings are shrinking while cash grows.
>
> What that means for whether banks lend to your business ↓ → /news/money-supply-299-billion-composition-shift-march-2026

**Tue Jul 21 · Fiscal · `BS`** — slug `government-revenue-surges-march-2026`
> Government revenue jumped to **US$304.37 million** in March 2026 — nearly **4× February's** figure.
>
> For businesses that sell to the state: when government has cash, contractors get paid. But it's lumpy — here's how to plan around it. → /news/government-revenue-surges-march-2026

**Wed Jul 22 · Feature (variety) · `FT`** — slug `monrovia-hustle-liberia-open-world-game`
> A one-person Monrovia studio built a **3D open-world game** — set on Carey and Benson Street — on a machine with **4 GB of RAM**.
>
> The global games industry is worth **US$184 billion**. Almost none of it comes from West Africa. HUIX-2099 is betting that changes. → /news/monrovia-hustle-liberia-open-world-game
*(Use the article hero image, not a stat card.)*

### Week 2

**Thu Jul 23 · Prices · `BS`** — slug `fuel-cost-jump-small-business-impact-march-2026`
> Imported fuel prices jumped **12.38 percent** in a single month (March 2026) — while headline inflation read just **0.62 percent**.
>
> For a keke operator, that's about **L$11,000 more a month**. Why the official number hides the pain. → /news/fuel-cost-jump-small-business-impact-march-2026

**Fri Jul 24 · Trade · `BS`** — slug `record-imports-small-retailer-impact-march-2026`
> Imports hit **US$314.08 million** in March 2026 — a two-year high — flipping the trade balance from a **US$13.98M surplus** to a **US$50.80M deficit** in one month.
>
> What a flood of new stock means for small retailers in Red Light and Waterside. → /news/record-imports-small-retailer-impact-march-2026

**Sat Jul 25 · Feature · `FT`** — slug `ekan-connect-fintech-messaging`
> What if every chat could be a checkout? Liberian-founded **EKAN Connect** is building payments, invoicing and escrow *inside* encrypted messages.
>
> Africa's digital payments market is projected past **US$40 billion** by 2028. → /news/ekan-connect-fintech-messaging
*(Hero image, not a stat card.)*

**Sun Jul 26 · Policy · `BR`** — slug `cbl-holds-policy-rate-16-25-what-businesses-know`
> The Central Bank held its policy rate at **16.25 percent** — unchanged since October 2025.
>
> What a "hold" actually means for your loan, your savings, and prices. → /news/cbl-holds-policy-rate-16-25-what-businesses-know
*Story:* "MPR held at 16.25%. Swipe for what it means."

**Mon Jul 27 · Credit · `BS`** — slug `personal-loans-hidden-tax-informal-entrepreneurs`
> Personal loans cost **16.16 percent** in February 2026 — the rate most informal entrepreneurs actually pay, because their businesses can't qualify for commercial credit.
>
> The hidden tax on Liberia's hustle economy. → /news/personal-loans-hidden-tax-informal-entrepreneurs

**Tue Jul 28 · Trade partners · `BS`** — slug `china-buys-134-million-liberian-exports-2025`
> China bought **US$134 million** of Liberian exports in 2025 — after **near-zero** in 2024.
>
> How one buyer reshaped the export map in twelve months. → /news/china-buys-134-million-liberian-exports-2025

**Wed Jul 29 · Policy · `BR`** — slug `liberia-gst-to-vat-transition`
> The biggest tax overhaul in years: **VAT is set to replace GST.**
>
> What changes for every business that charges it — and every customer who pays it. → /news/liberia-gst-to-vat-transition

### Week 3+ queue (same 1/day cadence, then switch to the standing weekly rhythm)

Remaining published articles, ready to schedule in this order:

1. `trade-hospitality-sector-services-boom` — Trade & hospitality hits **US$506M** (`BS`)
2. `banks-hold-260-billion-deposits-where-goes-money` — Banks hold **L$260B** in deposits (`BS`)
3. `cost-of-credit-liberian-business-borrowing` — Deep-dive: **13%** to borrow, the structural why (`BS`) *(link from the Day 1 launch post)*
4. `rubber-production-drop-smallholder-impact-march-2026` — Rubber output **−47%**, smallholders bear it (`BS`)
5. `liberian-startups-barriers-first-year` — Why most startups don't survive year one (`FT`)
6. `huix-2099-monrovia-studio-profile` — Studio profile: **5 products** shipped solo (`FT`)
7. `rubber-output-106-million-uneven-recovery` — Rubber's **US$106M** GDP, wild swings (`BS`)
8. `african-game-development-digital-economy` — The **US$184B** industry Africa is missing (`FT`)

After the backfill runs out (~mid-August), switch to the **standing weekly rhythm** in §5, sourcing fresh figures via `/data-brief`.

---

## 7. Operating notes

- **Cross-link discipline:** each post that cites a figure with a dedicated article links to `truerateliberia.com/news/<slug>` — mirrors the site's anti-data-recycling rule.
- **Engagement:** reply to comments with data, never opinion. If asked "will rates go up?" → "Here's what the MPC has done; next meeting is [date]." Never predict.
- **Measurement:** track follower growth, saves, and link clicks weekly. Saves > likes for a data brand.
- **What NOT to do:** no AI-generated imagery, no stock-photo filler, no reused hero images, no invented quotes — same visual/editorial standards as the site.

## 8. Immediate action checklist

1. Create `@truerateliberia` IG business account.
2. Link IG ↔ FB in Meta Business Suite.
3. Set both bios + identical profile picture.
4. Add FB "Independent / not the CBL" disclaimer.
5. Build the Day 1 card in `/admin/social-cards` using the fields in §6 (all numbers already published — no MCP needed).
6. Post today (Thu Jul 16), then one/day from the queue.

## 9. Full published catalog (67 articles, newest first)

Source: Supabase `articles`, status=`published`, pulled 2026-07-16. Slug → `truerateliberia.com/news/<slug>`.

| # | Date | Category | Slug |
|---|---|---|---|
| 1 | 2026-07-04 | forex | exchange-rate-8-percent-shift-business-impact |
| 2 | 2026-07-04 | commodities | gold-export-concentration-risk-march-2026 |
| 3 | 2026-07-04 | banking | money-supply-299-billion-composition-shift-march-2026 |
| 4 | 2026-07-04 | investing | banking-spread-13-percent-lending-2-percent-savings-feb-2026 |
| 5 | 2026-07-04 | business | fuel-cost-jump-small-business-impact-march-2026 |
| 6 | 2026-07-04 | business | rubber-production-drop-smallholder-impact-march-2026 |
| 7 | 2026-07-04 | business | record-imports-small-retailer-impact-march-2026 |
| 8 | 2026-06-23 | policy | liberia-gst-to-vat-transition |
| 9 | 2026-06-21 | technology | ekan-connect-fintech-messaging |
| 10 | 2026-06-20 | business | cost-of-credit-liberian-business-borrowing |
| 11 | 2026-06-20 | technology | monrovia-hustle-liberia-open-world-game |
| 12 | 2026-06-20 | startups | huix-2099-monrovia-studio-profile |
| 13 | 2026-06-20 | technology | african-game-development-digital-economy |
| 14 | 2026-06-19 | business | liberia-5-billion-economy-sectoral-breakdown |
| 15 | 2026-06-14 | business | government-revenue-surges-march-2026 |
| 16 | 2026-06-13 | business | trade-hospitality-sector-services-boom |
| 17 | 2026-06-12 | business | personal-loans-hidden-tax-informal-entrepreneurs |
| 18 | 2026-06-11 | business | china-buys-134-million-liberian-exports-2025 |
| 19 | 2026-06-10 | business | banks-hold-260-billion-deposits-where-goes-money |
| 20 | 2026-06-09 | business | liberian-startups-barriers-first-year |
| 21 | 2026-06-06 | analysis | a-two-speed-economy-minerals-race-ahead-most-people-don-t |
| 22 | 2026-06-06 | business | rubber-output-106-million-uneven-recovery |
| 23 | 2026-06-04 | analysis | lumpy-taxes-volatile-spending-rising-debt-the-2026-budget |
| 24 | 2026-06-03 | business | cbl-holds-policy-rate-16-25-what-businesses-know |
| 25 | 2026-06-01 | economy | bottlers-ramp-up-20-as-consumer-spending-holds |
| 26 | 2026-05-30 | commodities | cement-output-hits-a-record-as-the-building-boom-rolls-on |
| 27 | 2026-05-27 | analysis | incomes-per-person-are-still-climbing-back-to-2018-levels |
| 28 | 2026-05-25 | economy | the-state-s-own-economic-output-barely-grew-last-year |
| 29 | 2026-05-22 | commodities | palm-oil-rebounds-to-us-173-million-after-volatile-years |
| 30 | 2026-05-20 | economy | homegrown-steel-output-more-than-doubles-in-a-year |
| 31 | 2026-05-17 | economy | rice-the-us-296-million-staple-with-outsized-political-weight |
| 32 | 2026-05-15 | commodities | vast-forests-idle-trade-why-forestry-is-stuck |
| 33 | 2026-05-12 | economy | more-power-flows-yet-few-are-still-connected |
| 34 | 2026-05-10 | banking | the-financial-sector-keeps-growing-but-not-by-lending-to-business |
| 35 | 2026-05-07 | economy | moving-people-and-data-grows-into-a-us-257-million-business |
| 36 | 2026-05-05 | economy | a-building-boom-pushes-construction-past-us-270-million |
| 37 | 2026-05-02 | analysis | imported-goods-hold-steady-it-s-local-prices-that-are-rising |
| 38 | 2026-04-30 | economy | eating-out-gets-15-pricier-the-fastest-rising-cost-of-all |
| 39 | 2026-04-27 | economy | the-one-bill-that-s-getting-cheaper-phone-and-data |
| 40 | 2026-04-25 | economy | why-school-fees-make-education-costs-jump-once-a-year |
| 41 | 2026-04-22 | economy | health-care-costs-climb-6-and-families-pay-out-of-pocket |
| 42 | 2026-04-20 | economy | keeping-the-lights-on-costs-6-more-this-year |
| 43 | 2026-04-17 | economy | taxpayers-not-donors-are-now-funding-the-budget |
| 44 | 2026-04-15 | economy | the-public-payroll-eats-a-large-slice-of-the-budget |
| 45 | 2026-04-12 | policy | running-costs-crowd-out-investment-in-the-national-budget |
| 46 | 2026-04-10 | policy | government-spending-lurches-month-to-month-bunching-at-year-end |
| 47 | 2026-04-05 | economy | public-debt-climbs-to-us-2-82-billion-as-the-bill-mounts |
| 48 | 2026-04-03 | economy | inflation-cools-to-4-5-but-the-core-tells-a-tougher-story |
| 49 | 2026-04-03 | policy | money-supply-swells-11-while-the-central-bank-holds-steady |
| 50 | 2026-04-03 | banking | banks-are-lending-to-the-government-not-to-business |
| 51 | 2026-04-02 | commodities | gold-overtakes-iron-ore-as-liberia-s-top-export-earner-at-us-175m |
| 52 | 2026-04-02 | economy | domestic-food-prices-eased-in-liberia-but-imported-fuel-jumped-in-march |
| 53 | 2026-04-02 | commodities | gold-and-iron-ore-drive-mining-higher-as-rubber-falls |
| 54 | 2026-04-02 | forex | a-stronger-currency-eases-import-costs-as-the-us-dollar-slips-to-l-184 |
| 55 | 2026-04-01 | commodities | iron-ore-output-rebounds-to-2-3-million-tonnes-in-march |
| 56 | 2026-04-01 | commodities | exports-surge-58-to-us-2-1-billion-powered-by-gold |
| 57 | 2026-04-01 | analysis | mining-output-tops-us-1-billion-driving-one-fifth-of-liberia-s-gdp |
| 58 | 2026-04-01 | economy | the-economy-grew-4-6-in-2025-or-5-1-depending-on-who-s-counting |
| 59 | 2026-03-31 | analysis | a-rare-current-account-surplus-at-least-by-the-central-bank-s-count |
| 60 | 2026-03-31 | banking | business-loans-get-pricier-even-as-consumer-rates-fall |
| 61 | 2026-03-31 | economy | imports-more-than-doubled-in-march-exposing-a-deep-dependence |
| 62 | 2026-03-31 | economy | remittances-reach-us-941m-the-backbone-of-liberia-s-external-accounts |
| 63 | 2026-03-30 | banking | cash-outside-banks-jumped-22-in-liberia-as-deposits-grew-slowly |
| 64 | 2026-03-30 | economy | services-quietly-remain-the-biggest-engine-of-the-economy |
| 65 | 2026-03-29 | commodities | palm-oil-jumps-diamonds-double-cocoa-slumps-in-liberia-s-march-commodity-mix |
| 66 | 2026-03-29 | economy | agriculture-employs-the-most-people-but-grew-the-slowest |
| 67 | 2026-03-28 | economy | cement-and-beverages-push-manufacturing-up-9 |
