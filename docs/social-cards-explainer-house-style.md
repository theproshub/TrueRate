# Explainer hook house style

House style for the **social-cards Explainer carousel** — the plain-language,
swipeable format at `/admin/social-cards` (template: *Explainer*). This is a
*different, simpler voice* than TrueRate article copy: the article explains data
to a Liberian businessperson; the explainer explains money to **any Liberian,
assuming zero financial literacy**. No jargon, everyday scenarios, one idea at a
time. (See the `explainer_for_every_liberian` and `currency_L_dollar` memories.)

Hooks live in `src/app/admin/social-cards/_components/hookBank.ts`, one entry per
published article (`slug` + `articleTitle` + `hook` + three `points`). Every hook
is tied 1:1 to a real article, and every figure comes from **that article only**.

---

## Generation workflow (same rigor as an article)

An explainer is **money news for everyone** — but it is held to the same data
discipline as a TrueRate article. It is not written from memory; it is *translated*
from one verified article. Mirrors the `EXPLAINER` workflow in CLAUDE.md:

1. **Source one published article.** The explainer derives 1:1 from a real,
   already-verified article (`search_articles` / `get_article`). No article yet →
   write the article first; the explainer sits on top of it.
2. **Duplicate gate.** One hook per article. If `hookBank.ts` already has that
   `slug`, **update** it — never add a second. (Enforced by the hook-bank test.)
3. **Freshness gate.** `data_quality_report` on the article's series — abort if any
   cited figure is stale.
4. **Pull exact figures.** `article_data_context` / `article_data_sheet` or the
   article body. Every number in the hook + points comes from *this article only*.
5. **Write to this house style** (below): hook + three two-part points + outro.
6. **Verify.** Claim-check every number against the article/CBL; recompute derived
   ratios; run the plain-language lint (no jargon, `US$`/`L$`, no causation/hype).
   Fix mismatches, re-verify.
7. **Output** a `HookEntry { slug, articleTitle, hook, points, bodies }`; tests pass.

The difference from an article: the *article* explains data to a businessperson at
400–600 words; the *explainer* explains money to anyone, in a five-slide carousel,
assuming zero financial literacy. Same numbers, same integrity — plainer voice.

## The carousel (5 slides)

| Slide | Field | Job |
|-------|-------|-----|
| A — Cover | `hook` | The scroll-stopper. One plain sentence. |
| B/C/D — Points | `points[0..2]` → `ex1/2/3Title` | Three one-line takeaways that build the argument. |
| E — Outro | `explainerCTA` | The call to action (`@truerateliberia`). |

Each point is **two-part**: a bold **takeaway** (`points[i]` → `exNTitle`) plus a
**daily-life body** (`bodies[i]` → `exNBody`). The body is the whole reason this
template exists: it names a real Liberian archetype and shows how the number hits
their day. It must **never restate the takeaway in other words** — that is
duplication with a new voice. Takeaway = the "so what"; body = the lived
consequence for a specific person.

---

## The hook (cover)

1. **One plain sentence, one idea.** Aim for ≤ ~110 characters. If it needs a
   comma-spliced second clause to make sense, it's two hooks.
2. **Lead with a person or a stake, or open a curiosity gap.** Two proven shapes:
   - *Archetype-led:* start with the real Liberian it touches — `Market woman, …`,
     `Keke driver, …`, `Susu member, …`, `Family abroad, …`, `Rubber farmer, …`.
   - *Curiosity gap:* a surprising fact or question that demands the swipe —
     `Two-thirds of everything the country sells abroad is now just gold.`
3. **Plain words, not the dek.** The article dek is written for a businessperson;
   the hook is written for everyone. Translate it down.
4. **Never lead with "Liberia" / "Liberia's."** (Same rule as headlines — the
   reader is already here.)
5. **The hook is not a point.** It sets up the three points; it doesn't pre-empt
   them. A point must never be the hook restated.

**Do**
> Keke driver, your fuel jumped 12% in a month — the news said prices barely moved.

**Don't** (this is the dek, not a hook — jargon, two figures, no person)
> The imported fuel price index rose 12.38% while headline CPI climbed 0.62%.

---

## The three points

1. **Takeaway = the "so what", one line.** The bold `points[i]` is a short, plain
   headline for the point — keep the exact figure where it *is* the point, but drop
   jargon ("broad money", "quasi money", "constant-price GDP"). No semicolons.
2. **Body = a real Liberian's day.** `bodies[i]` names an archetype and shows how the
   number lands on them: *"For a cookshop owner borrowing L$500,000, interest alone
   tops L$65,000 a year — before she pays back a cent."* It must **add the lived
   consequence**, never rephrase the takeaway. Figures stay to what the article
   states; a body may soften one with "about/roughly" only if the exact value already
   appears in the entry.
3. **Rotate archetypes** to fit the story: market woman (Red Light, Waterside),
   keke driver, susu member, cookshop owner, small retailer, smallholder farmer,
   family living on money from abroad, parent paying school fees, importer, saver,
   borrower. Ground the number in *their* day, not a generic "consumer."
4. **Build an argument across the three** — fact → contrast → consequence — so the
   three slides tell one story, not three synonyms of the same fact.
5. **Figures come from this article only.** Never borrow a number from another story.

**Do** (plain takeaway on top, a real day underneath)
> takeaways: `['You borrow at 13.11%', 'You save at just 1.94%', 'The bank keeps the gap']`
> bodies: `['For a cookshop owner taking a loan, credit costs 13.11% a year — real money before any profit.', 'For a susu member saving small, the bank pays just 1.94%, and rising prices eat most of that.', 'The 11.17-point gap in between is the bank's cut, paid by saver and borrower alike.']`

**Don't** (body just re-voices the takeaway — duplication)
> takeaway `'Borrowing costs 13.11%'` + body `'Take a loan and you pay about 13%.'`

---

## Numbers and currency

1. **Exact values, never rounded.** `13.11%`, not "about 13%". `US$175.13 million`,
   not "roughly US$175M". Rounding is editorializing.
2. **Currency prefix always explicit: `US$` or `L$`.** Never a bare `$`, never a
   bare `L`. (Enforced elsewhere by lint E1; keep the bank clean too.)
3. **`%` is fine on cards** (unlike article body text, which spells out "percent").
4. **Percentage points ≠ percent.** A rate moving 12% → 13% rose *1 percentage
   point*. Say "an 11.17-point gap", not "11.17 percent".
5. **Illustrative math is welcome** when it makes a number felt, on an explicit
   example amount: *"Over L$65,000 a year on L$500,000."*

---

## Voice and word choice

1. **Neutral, concrete, calm.** Direction verbs carry the movement: *rose, fell,
   jumped, slid, doubled, narrowed.* The vividness is the everyday example, not
   the adjective.
2. **Banned words** (same list as articles): *massive, surge (as filler), shocking,
   game-changing, explosive, soaring, skyrocketing, unprecedented, plummet, slam,
   tank, crater.* They substitute drama for information.
3. **No causation.** Use *as, while, coincided with, alongside* — never *caused by*
   or *driven by*. The explainer describes; it doesn't assign blame.
4. **No fabricated people or quotes.** Archetypes (market woman, keke driver) are
   general roles, not named individuals. Never invent a named source.

---

## Tie-to-article rule

- **One hook per article.** Each entry's `slug` is a real published article; no slug
  is reused. (`social-cards-hookbank.test.ts` enforces uniqueness + kebab-case.)
- **`articleTitle`** is a build-time snapshot of the headline for traceability.
- Where two articles genuinely share a headline figure (e.g. two FX-rate pieces),
  each hook leads with the **angle unique to its own article** so the hooks stay
  distinct — don't just duplicate the number.

---

## Quick checklist (before adding or editing a hook)

1. Hook is one plain sentence, ≤ ~110 chars, leads with a person or a curiosity gap.
2. Hook doesn't start with "Liberia"; no jargon; not a restated point.
3. Three points build **fact → contrast → consequence**, each one line, each a
   distinct takeaway.
4. Every figure is exact, sourced from *this* article, with `US$`/`L$` (never a bare `$`).
5. No banned words, no causation, no invented numbers or people.
6. `slug` is the real article slug; no other entry uses it.
