# Anti-Hallucination System — Design Spec

**Date:** 2026-07-17
**Status:** Approved for planning
**Owner:** Julian Sackey

## Problem

TrueRate publishes financial data that carries the platform's reputation. The repo
already has strong *article-data* fabrication gates (`validate-data`, `fact-check`,
`verify-article`, `number-lock`) and superpowers ships `verification-before-completion`
for the general "don't claim done without evidence" case. Two gaps remain:

1. **No unifying entry point** that names the full hallucination taxonomy and routes
   each type to the gate that already handles it. The discipline is scattered across
   CLAUDE.md and a dozen skills.
2. **No automated enforcement.** Every existing gate only fires if Claude chooses to
   invoke it. There are no hooks that catch fabrication or unverified claims
   automatically.

This system fills both gaps with **one router skill + three hooks + one small
extension to `number-lock`**. It composes existing gates rather than duplicating
them.

## Scope

### In scope
- A new `anti-hallucination` skill (protocol + router).
- Three Claude Code hooks (Stop, PreToolUse, PostToolUse) enforcing the discipline
  on Claude's own actions.
- A minimal extension to `number-lock` so it persists a receipt file that a hook
  can read.
- Committed `.claude/settings.json` wiring the hooks for the whole team.

### Out of scope
- **The admin-UI publish path.** Articles are published through Next.js server
  actions in `src/app/admin/articles/_actions.ts` (a human clicking "Publish" in
  the browser). A Claude Code hook can only intercept Claude's own tool calls, so
  guarding the UI button belongs in the app, not here. A future app-side task may
  add a server-action-level lock; this spec does not.
- Rewriting or duplicating any existing verify skill. `number-lock`,
  `verify-article`, `validate-data`, `fact-check` stay as they are (number-lock
  gains one small write step).
- Blocking behavior on the general claim-guard. It warns only (per decision below).

## Design decisions (settled during brainstorming)

| Decision | Choice |
|---|---|
| System shape | 1 router skill + 3 hooks (Approach 2, hooks-heavy) |
| Stop hook strictness | Warn, non-blocking |
| Hook location | Committed `.claude/settings.json` (team-wide), scripts in `.claude/hooks/` |
| Publish-guard coverage | Claude-initiated publishes only; UI path out of scope |
| Reuse vs new | Compose existing gates; only `number-lock` is extended |

## Components

### 1. Skill: `anti-hallucination`

**File:** `.claude/skills/anti-hallucination.md`

**Purpose:** Single source of truth for the anti-hallucination discipline and the
router the hooks point back to.

**Core rule:** Every factual claim is either (a) grounded in a tool result, file
read, or command output from *this session*, or (b) explicitly marked as unverified
/ an assumption. Never present a guess as fact.

**Taxonomy + routing table** (the heart of the skill):

| # | Hallucination type | Gate / required action |
|---|---|---|
| 1 | Fabricated economic numbers | `article_data_sheet` → `verify_article_data`; never write a number not from a tool call |
| 2 | Fabricated quotes / people | Insert `[QUOTE NEEDED: subject, topic]`; never invent a person or quote |
| 3 | Fabricated sources / URLs / citations | Fetch live (WebFetch / MCP); peer stats via `/peer-benchmark`; never from memory |
| 4 | Fabricated dates / "since X" / "Nth consecutive month" | Re-derive from `get_series` (find the observation where the value last changed) |
| 5 | Fabricated file paths / symbols / config keys | Read or grep before referencing |
| 6 | Fabricated API / library shapes | Verify against installed source or docs; do not guess signatures |
| 7 | Fabricated results ("tests pass", "deployed", "fixed") | Run it, show output; defer to `superpowers:verification-before-completion` |

**Uncertainty markers section:** explicit phrasings for unverified statements
("I haven't verified this — ", "assumption: ", "unconfirmed: ") so uncertainty is
visible rather than smoothed over.

**Triggers:** "anti-hallucination", "don't hallucinate", "am I making this up",
"make sure this is real", "verify before you claim", "did you make that up",
"ground this", "no fabrication".

**Relationship to hooks:** each hook's reminder message references this skill by
name so the human (and Claude) can jump to the full protocol.

### 2. Hook: `claim-guard.mjs` (Stop, non-blocking)

**File:** `.claude/hooks/claim-guard.mjs`
**Event:** `Stop`

**Behavior:**
1. Reads hook JSON from stdin (includes `transcript_path`).
2. Loads the last assistant message plus the recent tool calls of the current turn.
3. Detects **unverified success/result claims** — regex families for: tests
   pass / all green, build succeeds / compiles, deployed / shipped / live, "it
   works", fixed, verified, done — and checks whether a corresponding evidence tool
   call (a Bash test/build/deploy invocation, etc.) appears in the recent turns.
4. Detects **ungrounded external citations** — URLs or peer/external figures
   introduced in the final message without a preceding `WebFetch` / `WebSearch` /
   MCP fetch in the session.
5. If any claim lacks matching evidence, emits a **non-blocking reminder** (exit 0,
   does NOT set `decision: block`) naming the unmatched claim(s) and pointing to
   `/anti-hallucination`. If everything is grounded, exits silently.

**Non-goals:** It does not block. It tolerates false negatives (misses) over false
positives that trap the session. The exact Stop-hook JSON contract for a
non-blocking advisory (systemMessage vs additionalContext vs stderr) is confirmed
against current Claude Code hook docs at implementation time.

### 3. Hook: `publish-guard.mjs` (PreToolUse, hard block)

**File:** `.claude/hooks/publish-guard.mjs`
**Event:** `PreToolUse` (matchers: `Bash`, `Edit`, `Write`)

**Behavior:**
1. Reads the pending tool call from stdin.
2. **Recognises a Claude-initiated publish** when the tool call is:
   - a Bash command invoking a publish path (`import-news-articles`, or
     `node scripts/…` that sets articles to published), OR
   - an Edit/Write that introduces `status: 'published'` (or `status = 'published'`)
     into `src/data/news.ts` or a DB seed file.
3. Extracts the target article slug from the command/diff where possible.
4. Checks for a **fresh `number-lock` receipt** at
   `.claude/state/number-lock/<slug>.json` (present, matching slug, recent).
5. If no valid receipt → **denies** the tool call (`permissionDecision: deny`) with
   a reason: "Run `/number-lock <slug>` before publishing." If a valid receipt
   exists → allows.
6. Non-publish tool calls pass through untouched (fast exit).

**Boundary:** covers only Claude-initiated publishes. The admin-UI server action is
out of scope (see Scope).

### 4. Hook: `article-number-scan.mjs` (PostToolUse, advisory)

**File:** `.claude/hooks/article-number-scan.mjs`
**Event:** `PostToolUse` (matchers: `Edit`, `Write`)

**Behavior:**
1. Fires only when the edited file is `src/data/news.ts` (or a designated article
   content file).
2. Scans the **added** lines for money/percent tokens — `US$…`, `L$…`, `…%`,
   "…percent", numeric+unit patterns — that lack a nearby period label
   (e.g. "Mar-26", "in March 2026", "(Q1 2026)").
3. Injects an **advisory** context message listing each flagged token with the
   reminder: confirm each figure came from an `article_data_sheet` and carries a
   period label. Does not block.

### 5. `number-lock` extension

**File:** `.claude/skills/number-lock.md` (edit)

Add a **Step 5 — Persist the receipt**: on a successful lock, write
`.claude/state/number-lock/<slug>.json` containing:

```json
{
  "slug": "<article-slug>",
  "issued_at": "<ISO timestamp>",
  "figures": [{ "claim_text": "...", "mnemonic": "...", "db_value": 0, "match": "EXACT" }],
  "integrity_score": "N/N"
}
```

This is the artifact `publish-guard` reads. The printed certificate is unchanged;
this only adds a persisted copy. A denied lock writes nothing.

### 6. Wiring: `.claude/settings.json`

Create a committed `.claude/settings.json` registering the three hooks:

- `Stop` → `claim-guard.mjs`
- `PreToolUse` (Bash, Edit, Write) → `publish-guard.mjs`
- `PostToolUse` (Edit, Write) → `article-number-scan.mjs`

`.claude/settings.local.json` (untracked, per-user) is left as-is. `.claude/state/`
is git-ignored (receipts are per-checkout artifacts).

## Data flow

```
Write article ──> article_data_sheet / verify_article_data (numbers grounded)
      │
      ├─ Edit src/data/news.ts ──> [PostToolUse] article-number-scan → advisory on unlabelled figures
      │
      /number-lock <slug> ──> writes .claude/state/number-lock/<slug>.json
      │
      ├─ Claude publishes (script / seed edit) ──> [PreToolUse] publish-guard
      │        └─ receipt present? allow : deny "run /number-lock first"
      │
   End of turn ──> [Stop] claim-guard → reminder if a success/citation claim is ungrounded
```

## Testing

Each hook is a small, pure Node script: read JSON from stdin, write JSON/exit code.
Build test-first (`superpowers:test-driven-development`):

- **claim-guard:** fixtures for (a) grounded success claim → silent, (b) ungrounded
  "tests pass" → reminder, (c) ungrounded external URL → reminder, (d) no claims →
  silent. Assert it never sets a blocking decision.
- **publish-guard:** fixtures for (a) publish Bash with valid receipt → allow,
  (b) publish Bash without receipt → deny, (c) Edit introducing `status:'published'`
  without receipt → deny, (d) unrelated Bash/Edit → allow. Assert slug extraction.
- **article-number-scan:** fixtures for (a) unlabelled `US$5M` added → advisory,
  (b) figure with period label → silent, (c) edit to unrelated file → silent.

Skill and settings wiring verified manually (trigger check + a real publish attempt
that gets blocked, then unblocked after `/number-lock`).

## Risks / trade-offs

- **Heuristic hooks have false positives/negatives.** Mitigated by making claim-guard
  and article-number-scan advisory-only; only publish-guard blocks, and it blocks on
  a precise textual signal (`status: 'published'` / known script names).
- **Stop-hook contract drift.** The exact non-blocking-advisory mechanism is
  confirmed against current Claude Code docs during implementation.
- **Slug extraction may miss unusual publish commands.** publish-guard fails
  *closed* only for recognised publish signals; anything it can't parse as a publish
  passes through (it is a tripwire, not a firewall — the UI path already sits
  outside it).

## Success criteria

1. Typing `/anti-hallucination` (or a trigger phrase) surfaces the taxonomy + routing.
2. A `number-lock` run leaves a receipt file; a subsequent Claude-initiated publish
   of that slug is allowed, and one without a receipt is denied with a clear reason.
3. An ungrounded "tests pass"/"deployed" claim at end of turn produces a reminder;
   a grounded one does not.
4. Adding an unlabelled currency figure to `news.ts` produces an advisory.
5. All three hook scripts have passing unit tests; hooks are committed in
   `.claude/settings.json`.
