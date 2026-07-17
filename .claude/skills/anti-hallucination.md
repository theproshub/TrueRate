# anti-hallucination

The single source of truth for TrueRate's anti-hallucination discipline. Routes each
kind of fabrication to the gate that already handles it. The three hooks
(`claim-guard`, `publish-guard`, `article-number-scan`) point back to this skill by
type number.

## Triggers
Auto-activates when the request matches: "anti-hallucination", "don't hallucinate",
"am I making this up", "make sure this is real", "verify before you claim",
"did you make that up", "ground this", "no fabrication", "prove this number".

## Core rule
Every factual claim is either (a) grounded in a tool result, file read, or command
output from THIS session, or (b) explicitly marked as unverified. Never present a
guess as fact. When you have not verified something, say so with an uncertainty
marker rather than smoothing it over.

## Hallucination taxonomy → gate

1. **Fabricated economic numbers.** Never write a number that did not come from a
   tool call. Assemble figures with `article_data_sheet`; confirm with
   `verify_article_data`. Use exact stored values, not "about".
2. **Fabricated quotes / people.** Never invent a person, quote, or anecdote. Insert
   `[QUOTE NEEDED: subject, topic]` and flag it to the editor.
3. **Fabricated sources / URLs / citations.** Fetch live before citing (WebFetch or
   the relevant MCP tool). Peer-country stats come from `/peer-benchmark` with
   per-row citations — never from memory.
4. **Fabricated dates / regime claims.** "Held since X", "Nth consecutive month",
   "first since" must be re-derived from `get_series` by locating the observation
   where the value last changed. Never copy a regime date from another article.
5. **Fabricated file paths / symbols / config keys.** Read or grep the file before
   referencing a path, function, export, or setting.
6. **Fabricated API / library shapes.** Verify a signature against the installed
   package source or official docs before using it. Do not guess parameters or
   return types.
7. **Fabricated results.** "Tests pass", "build works", "deployed", "it's fixed" —
   run the command and show the output first. Defer to
   `superpowers:verification-before-completion`.

## Uncertainty markers
When a statement is not verified, prefix it so the reader can see the gap:
- `unverified:` — I have not checked this.
- `assumption:` — I am proceeding on this without confirmation.
- `unconfirmed source:` — figure/quote not yet grounded in a fetch or the warehouse.

## The hooks
- `claim-guard` (Stop, advisory) — warns when a success/result claim (type 7) or an
  external URL (type 3) appears without matching evidence this turn.
- `publish-guard` (PreToolUse, blocking) — a stop-and-confirm tripwire: denies running
  the bulk article importer (`node … import-news-articles`) so a human confirms every
  affected article passed `/number-lock` first (type 1 gate). It gates only the
  importer command, since TrueRate publishes to the Supabase `articles` table, not to
  `src/data/news.ts`.
- `article-number-scan` (PostToolUse, advisory) — flags currency/percent figures
  added to `src/data/news.ts` that lack a period label (type 1).
