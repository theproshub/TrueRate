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

This system fills both gaps with **one router skill + three hooks**. It composes
existing gates rather than duplicating them.

> **Post-review amendment (2026-07-17).** The final whole-branch review found that
> publish state does not live in `src/data/news.ts` (it is written to the Supabase
> `articles` table by the bulk importer), so the originally-planned per-slug
> `number-lock` *receipt gate* had no reachable path. `publish-guard` was reworked
> into a stop-and-confirm tripwire on the bulk importer, the `news.ts` Edit/Write
> detection and the receipt mechanism were dropped, and `number-lock` was left
> unchanged. Sections below reflect the shipped design.

## Scope

### In scope
- A new `anti-hallucination` skill (protocol + router).
- Three Claude Code hooks (Stop, PreToolUse, PostToolUse) enforcing the discipline
  on Claude's own actions.
- Committed `.claude/settings.json` wiring the hooks for the whole team.

### Out of scope
- **The admin-UI publish path.** Articles are published through Next.js server
  actions in `src/app/admin/articles/_actions.ts` (a human clicking "Publish" in
  the browser). A Claude Code hook can only intercept Claude's own tool calls, so
  guarding the UI button belongs in the app, not here. A future app-side task may
  add a server-action-level lock; this spec does not.
- Rewriting or duplicating any existing verify skill. `number-lock`,
  `verify-article`, `validate-data`, `fact-check` stay exactly as they are.
- Blocking behavior on the general claim-guard. It warns only (per decision below).

## Design decisions (settled during brainstorming)

| Decision | Choice |
|---|---|
| System shape | 1 router skill + 3 hooks (Approach 2, hooks-heavy) |
| Stop hook strictness | Warn, non-blocking |
| Hook location | Committed `.claude/settings.json` (team-wide), scripts in `.claude/hooks/` |
| Publish-guard coverage | Claude-initiated bulk importer only; UI path out of scope |
| Reuse vs new | Compose existing gates; nothing existing is modified |

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

### 3. Hook: `publish-guard.mjs` (PreToolUse, stop-and-confirm tripwire)

**File:** `.claude/hooks/publish-guard.mjs`
**Event:** `PreToolUse` (matcher: `Bash|Edit|Write` — but only `Bash` is acted on)

**Publish reality (corrected after review):** TrueRate does not carry publish state
in `src/data/news.ts` — that file is the read-only fallback seed and has no `status`
or `slug` fields. Articles are published by writing `status: 'published'` to the
Supabase `articles` table, done either by the bulk importer
`scripts/import-news-articles.mjs` or by the admin-UI server actions in
`src/app/admin/articles/_actions.ts`. A Claude Code hook can only intercept Claude's
own tool calls, so the only Claude-initiated publish it can gate is *running the bulk
importer*. There is no per-article publish command, so a per-slug `number-lock`
receipt cannot be machine-verified here — hence a tripwire, not a receipt gate.

**Behavior:**
1. Reads the pending tool call from stdin.
2. `isPublishCommand(toolName, input)` returns true iff the tool is `Bash` AND the
   command both invokes a JS runner (`node`) AND names a publish-y target
   (`import-news-articles`, or a `*publish*.{mjs,js,ts}` script). Requiring both a
   runner and a target means inspecting the script (`cat`/`grep`/`git log`/a commit
   message mentioning it) is **not** flagged — the review found the earlier
   substring match blocked benign commands.
3. If it is a publish command → **denies** (`permissionDecision: deny`) with a
   stop-and-confirm reason telling the human to confirm every affected article passed
   `/number-lock` first. Everything else passes through untouched (fast exit).

**Boundary:** covers only the Claude-initiated bulk importer. The admin-UI server
action and any future per-article publish path are out of scope (see Scope).

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

### 5. `number-lock` (unchanged after review)

**File:** `.claude/skills/number-lock.md`

The original design added a receipt file for `publish-guard` to read. After review,
`publish-guard` became a tripwire that cannot machine-verify a per-article receipt
(there is no per-article publish command — see §3), so the receipt had no consumer
and was dropped. `number-lock` is left as-is: it prints its audit certificate; the
discipline it enforces is what `publish-guard`'s deny message points the human back
to. (`number-lock.md` is a local, git-ignored skill file, so this is not part of the
committed diff.)

### 6. Wiring: `.claude/settings.json`

Create a committed `.claude/settings.json` registering the three hooks:

- `Stop` → `claim-guard.mjs`
- `PreToolUse` (Bash, Edit, Write) → `publish-guard.mjs`
- `PostToolUse` (Edit, Write) → `article-number-scan.mjs`

`.claude/settings.local.json` (untracked, per-user) is left as-is.

## Data flow

```
Write article ──> article_data_sheet / verify_article_data (numbers grounded)
      │
      ├─ Edit src/data/news.ts ──> [PostToolUse] article-number-scan → advisory on unlabelled figures
      │
      ├─ Claude runs the bulk importer (node … import-news-articles) ──> [PreToolUse] publish-guard
      │        └─ deny "confirm every article passed /number-lock first"
      │
   End of turn ──> [Stop] claim-guard → reminder if a success/citation claim is ungrounded
```

## Testing

Each hook is a thin Node runner over a pure function: read JSON from stdin, write
JSON/exit code. Build test-first (`superpowers:test-driven-development`):

- **claim-guard:** fixtures for (a) grounded success claim → silent, (b) ungrounded
  "tests pass" → reminder, (c) ungrounded external URL → reminder, (d) no claims →
  silent. Assert it never sets a blocking decision.
- **publish-guard:** unit fixtures for `isPublishCommand` — (a) `node … import-news-articles`
  → true, (b) `cat`/`grep`/commit message mentioning the importer → false, (c) an
  Edit/Write tool → false (only Bash is gated), (d) unrelated Bash → false — plus a
  runner-level integration test (deny JSON on the importer, empty on an unrelated
  command).
- **article-number-scan:** fixtures for (a) unlabelled `US$304M` added → advisory,
  (b) figure with a month/quarter period label → silent, (c) figure whose only nearby
  date is a bare year → advisory, (d) edit to an unrelated file → silent.

Skill and settings wiring verified manually (trigger check + a real importer command
that gets denied).

## Risks / trade-offs

- **Heuristic hooks have false positives/negatives.** Mitigated by making claim-guard
  and article-number-scan advisory-only; only publish-guard blocks, and it blocks
  only when a command both invokes `node` and names a publish-y script — so inspecting
  the importer is never blocked.
- **Stop-hook contract:** the non-blocking-advisory mechanism (`systemMessage` +
  `hookSpecificOutput.additionalContext`, exit 0) is confirmed against current Claude
  Code hook docs.
- **publish-guard is a tripwire, not a firewall.** It denies the one Claude-initiated
  publish path it can see (the bulk importer); the admin-UI publish and any future
  per-article publish command sit outside it and are gated in the app, not here.

## Success criteria

1. Typing `/anti-hallucination` (or a trigger phrase) surfaces the taxonomy + routing.
2. Running the bulk importer (`node … import-news-articles`) is denied with a
   stop-and-confirm reason; inspecting the importer (`cat`/`grep`) is not blocked.
3. An ungrounded "tests pass"/"deployed" claim at end of turn produces a reminder;
   a grounded one does not.
4. Adding an unlabelled currency figure to `news.ts` produces an advisory.
5. All three hook scripts have passing unit tests; hooks are committed in
   `.claude/settings.json`.
