# Anti-Hallucination System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one router skill plus three Claude Code hooks (with a `number-lock` receipt extension) that automatically catch fabricated numbers, ungrounded citations, unverified success claims, and un-gated publishes on Claude's own actions.

**Architecture:** Each hook is a thin `.mjs` runner that reads the hook JSON from stdin, delegates to a pure, unit-tested function in `.claude/hooks/lib/`, prints the hook's JSON verdict to stdout, and always exits 0 (fail-open). A shared `hook-io.mjs` centralizes stdin parsing and the exact output contract. The router skill (`anti-hallucination.md`) is the human/Claude-facing protocol the hooks point back to.

**Tech Stack:** Node ESM (`.mjs`, Node built-ins only — no new dependencies), vitest (already present) for the pure logic, Claude Code hooks configured in a committed `.claude/settings.json`.

## Global Constraints

- **No new dependencies.** Only Node built-ins (`node:fs`, `node:path`, `process`) and the existing `vitest`.
- **All hook scripts are ESM `.mjs`** and MUST `process.exit(0)` on every path, wrapping their body in `try/catch` so a bug never breaks the user's session (fail-open).
- **Only `publish-guard` may deny.** `claim-guard` and `article-number-scan` are advisory (never block, never deny).
- **Exact hook output contract** (verified against current Claude Code docs, 2026-07-17):
  - PreToolUse deny: `{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"..."}}`
  - Stop advisory (non-blocking): `{"hookSpecificOutput":{"hookEventName":"Stop","additionalContext":"..."},"systemMessage":"..."}` with exit 0.
  - PostToolUse context: `{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"..."}}`
  - Stdin fields: `transcript_path`, `tool_name`, `tool_input`, `cwd`, `session_id`.
- **vitest config** (`vitest.config.ts`): `environment: 'node'`, `globals: true` — so `describe/it/expect` are global; test files are `*.test.mjs`.
- **`.claude/` is fully git-ignored** (`.gitignore:44`). Committed paths must be surgically un-ignored (Task 1). `.claude/state/` stays ignored.
- **Publish-guard covers Claude-initiated publishes only.** The admin-UI server-action path (`src/app/admin/articles/_actions.ts`) is out of scope.

---

### Task 1: Un-ignore committed `.claude` paths; keep state ignored

**Files:**
- Modify: `.gitignore:44`

**Interfaces:**
- Produces: committed directory `.claude/hooks/`, committed `.claude/settings.json`, committed `.claude/skills/anti-hallucination.md`; ignored `.claude/state/`. Later tasks add files under these paths and commit them.

- [ ] **Step 1: Replace the blanket `.claude/` ignore with surgical rules**

Current `.gitignore` lines 43–44 are:
```
# claude worktrees
.claude/
```
Replace those two lines with:
```
# claude local dir — ignore everything except the committed anti-hallucination system
.claude/*
!.claude/settings.json
!.claude/hooks/
!.claude/skills/
.claude/skills/*
!.claude/skills/anti-hallucination.md
.claude/state/
.claude/worktrees/
```
(This keeps all existing local-only skills and worktrees ignored, un-ignores only `settings.json`, the whole `hooks/` dir, and the single new skill file, and re-ignores `state/`.)

- [ ] **Step 2: Verify the ignore rules resolve correctly**

Run:
```bash
git check-ignore -v .claude/settings.json .claude/hooks/x.mjs .claude/skills/anti-hallucination.md .claude/skills/fact-check.md .claude/state/number-lock/y.json 2>&1; echo "exit: done"
```
Expected: `settings.json`, `hooks/x.mjs`, and `anti-hallucination.md` print **nothing** (not ignored); `fact-check.md` and `state/number-lock/y.json` print a matching `.gitignore` line (still ignored).

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: un-ignore committed .claude anti-hallucination paths"
```

---

### Task 2: Shared hook I/O helper (`hook-io.mjs`)

**Files:**
- Create: `.claude/hooks/lib/hook-io.mjs`
- Test: `.claude/hooks/lib/hook-io.test.mjs`

**Interfaces:**
- Produces:
  - `parseJsonOrEmpty(raw: string): object` — `JSON.parse` or `{}` on empty/invalid.
  - `readStdinJson(): Promise<object>` — reads all of stdin, returns `parseJsonOrEmpty`.
  - `denyTool(reason: string): object` — PreToolUse deny payload.
  - `stopAdvisory({ systemMessage?, additionalContext? }): object` — Stop advisory payload.
  - `postContext(context: string): object` — PostToolUse context payload.

- [ ] **Step 1: Write the failing test**

Create `.claude/hooks/lib/hook-io.test.mjs`:
```js
import { parseJsonOrEmpty, denyTool, stopAdvisory, postContext } from './hook-io.mjs';

describe('hook-io', () => {
  it('parseJsonOrEmpty returns {} for empty or bad input', () => {
    expect(parseJsonOrEmpty('')).toEqual({});
    expect(parseJsonOrEmpty('not json')).toEqual({});
    expect(parseJsonOrEmpty('{"a":1}')).toEqual({ a: 1 });
  });

  it('denyTool builds the PreToolUse deny contract', () => {
    expect(denyTool('nope')).toEqual({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: 'nope',
      },
    });
  });

  it('stopAdvisory includes only provided fields', () => {
    expect(stopAdvisory({ systemMessage: 'warn' })).toEqual({ systemMessage: 'warn' });
    expect(stopAdvisory({ additionalContext: 'ctx' })).toEqual({
      hookSpecificOutput: { hookEventName: 'Stop', additionalContext: 'ctx' },
    });
  });

  it('postContext builds the PostToolUse context contract', () => {
    expect(postContext('hi')).toEqual({
      hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: 'hi' },
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run .claude/hooks/lib/hook-io.test.mjs`
Expected: FAIL — cannot resolve `./hook-io.mjs`.

- [ ] **Step 3: Write minimal implementation**

Create `.claude/hooks/lib/hook-io.mjs`:
```js
export function parseJsonOrEmpty(raw) {
  if (!raw || !raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function readStdinJson() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return parseJsonOrEmpty(Buffer.concat(chunks).toString('utf8'));
}

export function denyTool(reason) {
  return {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  };
}

export function stopAdvisory({ systemMessage, additionalContext } = {}) {
  const out = {};
  if (additionalContext) {
    out.hookSpecificOutput = { hookEventName: 'Stop', additionalContext };
  }
  if (systemMessage) out.systemMessage = systemMessage;
  return out;
}

export function postContext(context) {
  return {
    hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: context },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run .claude/hooks/lib/hook-io.test.mjs`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add .claude/hooks/lib/hook-io.mjs .claude/hooks/lib/hook-io.test.mjs
git commit -m "feat(hooks): shared hook I/O helper for anti-hallucination hooks"
```

---

### Task 3: `anti-hallucination` router skill

**Files:**
- Create: `.claude/skills/anti-hallucination.md`

**Interfaces:**
- Produces: the `/anti-hallucination` skill and the taxonomy "type 1–7" that hook messages reference by number. No code consumes this.

- [ ] **Step 1: Write the skill file**

Create `.claude/skills/anti-hallucination.md` with exactly this content:
```markdown
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
- `publish-guard` (PreToolUse, blocking) — denies a Claude-initiated publish unless a
  fresh `number-lock` receipt exists for the article (type 1 gate).
- `article-number-scan` (PostToolUse, advisory) — flags currency/percent figures
  added to `src/data/news.ts` that lack a period label (type 1).
```

- [ ] **Step 2: Verify the skill is discoverable**

Run: `test -f .claude/skills/anti-hallucination.md && grep -c "^[0-9]\. \*\*" .claude/skills/anti-hallucination.md`
Expected: prints `7` (the seven taxonomy rows).

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/anti-hallucination.md
git commit -m "feat(skill): anti-hallucination router with 7-type taxonomy"
```

---

### Task 4: `claim-guard` Stop hook (advisory)

**Files:**
- Create: `.claude/hooks/lib/claim-guard.mjs`
- Create: `.claude/hooks/claim-guard.mjs` (runner)
- Test: `.claude/hooks/lib/claim-guard.test.mjs`

**Interfaces:**
- Consumes: `stopAdvisory` from `./hook-io.mjs`.
- Produces: `evaluate(entries: object[]): string[]` — given parsed transcript JSONL entries, returns warning strings (empty if all grounded). Transcript entry shape: `{ type: 'user'|'assistant', message?: { content }, content? }`; content is a string or an array of blocks `{type:'text',text}` / `{type:'tool_use',name,input}` / `{type:'tool_result',...}`.

- [ ] **Step 1: Write the failing test**

Create `.claude/hooks/lib/claim-guard.test.mjs`:
```js
import { evaluate } from './claim-guard.mjs';

const user = (text) => ({ type: 'user', message: { content: [{ type: 'text', text }] } });
const asst = (blocks) => ({ type: 'assistant', message: { content: blocks } });
const say = (text) => ({ type: 'text', text });
const bash = (command) => ({ type: 'tool_use', name: 'Bash', input: { command } });
const fetchTool = () => ({ type: 'tool_use', name: 'WebFetch', input: {} });

describe('claim-guard evaluate', () => {
  it('warns on a success claim with no command run this turn', () => {
    const w = evaluate([user('fix it'), asst([say('Done — all tests pass now.')])]);
    expect(w.some((s) => /type 7/.test(s))).toBe(true);
  });

  it('is silent when a command was run this turn', () => {
    const w = evaluate([user('fix it'), asst([bash('npx vitest run'), say('All tests pass.')])]);
    expect(w).toEqual([]);
  });

  it('warns on an external URL introduced without a fetch this turn', () => {
    const w = evaluate([user('cite it'), asst([say('See https://data.imf.org/x for the figure.')])]);
    expect(w.some((s) => /type 3/.test(s))).toBe(true);
  });

  it('is silent when a fetch happened this turn', () => {
    const w = evaluate([user('cite it'), asst([fetchTool(), say('See https://data.imf.org/x.')])]);
    expect(w).toEqual([]);
  });

  it('ignores claims from before the last user message', () => {
    const w = evaluate([
      user('older'), asst([say('tests pass')]),
      user('newer'), asst([say('here is a plan')]),
    ]);
    expect(w).toEqual([]);
  });

  it('ignores localhost URLs', () => {
    const w = evaluate([user('go'), asst([say('open http://localhost:3000 to check')])]);
    expect(w).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run .claude/hooks/lib/claim-guard.test.mjs`
Expected: FAIL — cannot resolve `./claim-guard.mjs`.

- [ ] **Step 3: Write minimal implementation**

Create `.claude/hooks/lib/claim-guard.mjs`:
```js
const SUCCESS_RE =
  /\b(tests?\s+(all\s+)?(pass|passing|passed|green)|all\s+(tests|checks)\s+(pass|green)|build\s+(succeed|succeeded|passes|works|is\s+green|compiles)|compiles?\s+(cleanly|successfully|with\s+no\s+errors)|deployed(\s+to\s+production)?|it\s+works\s+now|(bug|issue|error|it)\s+is\s+fixed|fixed\s+(it|the\s+\w+))\b/i;

const URL_RE = /https?:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0|example\.(?:com|org))/i;

function contentOf(entry) {
  return entry.message?.content ?? entry.content;
}

function isRealUser(entry) {
  if (entry.type !== 'user') return false;
  const c = contentOf(entry);
  if (typeof c === 'string') return true;
  if (Array.isArray(c)) return c.some((b) => b.type === 'text');
  return false;
}

export function evaluate(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return [];

  let start = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (isRealUser(entries[i])) {
      start = i;
      break;
    }
  }

  let assistantText = '';
  let bashCount = 0;
  let fetchCount = 0;
  for (const entry of entries.slice(start)) {
    if (entry.type !== 'assistant') continue;
    const c = contentOf(entry);
    if (!Array.isArray(c)) continue;
    for (const block of c) {
      if (block.type === 'text') assistantText += '\n' + (block.text || '');
      if (block.type === 'tool_use') {
        const name = block.name || '';
        if (name === 'Bash') bashCount++;
        if (name === 'WebFetch' || name === 'WebSearch' || name.startsWith('mcp__')) fetchCount++;
      }
    }
  }

  const warnings = [];
  if (SUCCESS_RE.test(assistantText) && bashCount === 0) {
    warnings.push(
      'Claimed a success/result (tests pass, build works, deployed, or fixed) but ran no command this turn to verify it — anti-hallucination type 7. Run the command and show output before claiming.',
    );
  }
  if (URL_RE.test(assistantText) && fetchCount === 0) {
    warnings.push(
      'Introduced an external URL/citation without fetching it this turn — anti-hallucination type 3. Fetch the source before citing.',
    );
  }
  return warnings;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run .claude/hooks/lib/claim-guard.test.mjs`
Expected: PASS (6 tests).

- [ ] **Step 5: Write the runner**

Create `.claude/hooks/claim-guard.mjs`:
```js
#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { readStdinJson, stopAdvisory } from './lib/hook-io.mjs';
import { evaluate } from './lib/claim-guard.mjs';

async function main() {
  const input = await readStdinJson();
  let entries = [];
  try {
    entries = readFileSync(input.transcript_path, 'utf8')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch {
    return; // no transcript → stay silent
  }
  const warnings = evaluate(entries);
  if (warnings.length) {
    const joined = warnings.join(' | ');
    process.stdout.write(
      JSON.stringify(
        stopAdvisory({
          systemMessage: '⚠︎ anti-hallucination: ' + joined,
          additionalContext:
            'Unverified claims flagged by claim-guard: ' + joined + ' See /anti-hallucination.',
        }),
      ),
    );
  }
}

main()
  .catch(() => {})
  .finally(() => process.exit(0));
```

- [ ] **Step 6: Smoke-test the runner end to end**

Run:
```bash
printf '{"type":"user","message":{"content":[{"type":"text","text":"go"}]}}\n{"type":"assistant","message":{"content":[{"type":"text","text":"All tests pass now."}]}}\n' > /tmp/ah-trans.jsonl
echo "{\"transcript_path\":\"/tmp/ah-trans.jsonl\"}" | node .claude/hooks/claim-guard.mjs; echo " exit=$?"
```
Expected: prints JSON containing `"systemMessage"` and `type 7`, then ` exit=0`.

- [ ] **Step 7: Commit**

```bash
git add .claude/hooks/lib/claim-guard.mjs .claude/hooks/lib/claim-guard.test.mjs .claude/hooks/claim-guard.mjs
git commit -m "feat(hooks): claim-guard Stop hook for unverified claims"
```

---

### Task 5: `publish-guard` PreToolUse hook (blocking) + `number-lock` receipt

**Files:**
- Create: `.claude/hooks/lib/publish-guard.mjs`
- Create: `.claude/hooks/publish-guard.mjs` (runner)
- Test: `.claude/hooks/lib/publish-guard.test.mjs`
- Modify: `.claude/skills/number-lock.md` (add receipt-writing step)

**Interfaces:**
- Consumes: `denyTool` from `./hook-io.mjs`.
- Produces:
  - `detectPublish(toolName: string, input: object): { isPublish: boolean, slug: string|null }`.
  - `decide(det, lookup, now?, maxAgeMs?): { deny: boolean, reason?: string }` where `lookup(slug) -> { valid: boolean, issuedAt?: number }` (issuedAt = epoch ms).
- Receipt file consumed: `.claude/state/number-lock/<slug>.json` containing `{ "slug", "issued_at": "<ISO>", ... }`.

- [ ] **Step 1: Write the failing test**

Create `.claude/hooks/lib/publish-guard.test.mjs`:
```js
import { detectPublish, decide } from './publish-guard.mjs';

describe('detectPublish', () => {
  it('flags the import-news-articles script as a bulk publish', () => {
    const d = detectPublish('Bash', { command: 'node scripts/import-news-articles.mjs' });
    expect(d).toEqual({ isPublish: true, slug: null });
  });

  it('extracts a slug from a --slug flag', () => {
    const d = detectPublish('Bash', { command: 'node scripts/publish-one.mjs --slug my-story' });
    expect(d).toEqual({ isPublish: true, slug: 'my-story' });
  });

  it('flags an Edit that introduces status: published into news.ts', () => {
    const d = detectPublish('Edit', {
      file_path: '/repo/src/data/news.ts',
      new_string: "{ slug: 'cement-output-rises', status: 'published' }",
    });
    expect(d).toEqual({ isPublish: true, slug: 'cement-output-rises' });
  });

  it('ignores an unrelated Bash command', () => {
    expect(detectPublish('Bash', { command: 'ls -la' })).toEqual({ isPublish: false, slug: null });
  });

  it('ignores a news.ts edit that does not publish', () => {
    const d = detectPublish('Edit', { file_path: '/repo/src/data/news.ts', new_string: "status: 'draft'" });
    expect(d).toEqual({ isPublish: false, slug: null });
  });
});

describe('decide', () => {
  const fresh = () => ({ valid: true, issuedAt: Date.now() });
  it('allows a non-publish call', () => {
    expect(decide({ isPublish: false, slug: null }, () => ({ valid: false }))).toEqual({ deny: false });
  });
  it('denies a bulk publish (no slug)', () => {
    const r = decide({ isPublish: true, slug: null }, () => fresh());
    expect(r.deny).toBe(true);
  });
  it('denies when no receipt exists', () => {
    const r = decide({ isPublish: true, slug: 'x' }, () => ({ valid: false }));
    expect(r.deny).toBe(true);
    expect(r.reason).toMatch(/number-lock x/);
  });
  it('allows when a fresh receipt exists', () => {
    expect(decide({ isPublish: true, slug: 'x' }, () => fresh())).toEqual({ deny: false });
  });
  it('denies when the receipt is stale (>24h)', () => {
    const stale = { valid: true, issuedAt: Date.now() - 25 * 3600 * 1000 };
    const r = decide({ isPublish: true, slug: 'x' }, () => stale);
    expect(r.deny).toBe(true);
    expect(r.reason).toMatch(/stale/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run .claude/hooks/lib/publish-guard.test.mjs`
Expected: FAIL — cannot resolve `./publish-guard.mjs`.

- [ ] **Step 3: Write minimal implementation**

Create `.claude/hooks/lib/publish-guard.mjs`:
```js
const PUBLISH_CMD_RE = /(import-news-articles|scripts\/[\w-]*publish[\w-]*)/i;
const STATUS_PUBLISHED_RE = /status\s*[:=]\s*['"]published['"]/;
const SLUG_RE = /slug\s*[:=]\s*['"]([a-z0-9-]+)['"]/i;
const CMD_SLUG_RE = /--slug[= ]([a-z0-9-]+)/i;
const DEFAULT_MAX_AGE_MS = 24 * 3600 * 1000;

export function detectPublish(toolName, input = {}) {
  if (toolName === 'Bash') {
    const cmd = input.command || '';
    if (PUBLISH_CMD_RE.test(cmd)) {
      const m = cmd.match(CMD_SLUG_RE);
      return { isPublish: true, slug: m ? m[1] : null };
    }
    return { isPublish: false, slug: null };
  }
  if (toolName === 'Edit' || toolName === 'Write') {
    const fp = input.file_path || '';
    if (!/news\.ts$/.test(fp)) return { isPublish: false, slug: null };
    const text = input.new_string ?? input.content ?? '';
    if (!STATUS_PUBLISHED_RE.test(text)) return { isPublish: false, slug: null };
    const m = text.match(SLUG_RE);
    return { isPublish: true, slug: m ? m[1] : null };
  }
  return { isPublish: false, slug: null };
}

export function decide(det, lookup, now = Date.now(), maxAgeMs = DEFAULT_MAX_AGE_MS) {
  if (!det.isPublish) return { deny: false };
  if (!det.slug) {
    return {
      deny: true,
      reason:
        'Bulk/unattributed publish detected. Run /number-lock <slug> and publish articles individually so every figure is verified (anti-hallucination publish-guard, type 1).',
    };
  }
  const r = lookup(det.slug);
  if (!r || !r.valid) {
    return {
      deny: true,
      reason: `No number-lock receipt for "${det.slug}". Run /number-lock ${det.slug} before publishing (anti-hallucination publish-guard, type 1).`,
    };
  }
  if (now - r.issuedAt > maxAgeMs) {
    return {
      deny: true,
      reason: `number-lock receipt for "${det.slug}" is stale (>24h). Re-run /number-lock ${det.slug} (anti-hallucination publish-guard, type 1).`,
    };
  }
  return { deny: false };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run .claude/hooks/lib/publish-guard.test.mjs`
Expected: PASS (10 tests).

- [ ] **Step 5: Write the runner**

Create `.claude/hooks/publish-guard.mjs`:
```js
#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readStdinJson, denyTool } from './lib/hook-io.mjs';
import { detectPublish, decide } from './lib/publish-guard.mjs';

async function main() {
  const input = await readStdinJson();
  const det = detectPublish(input.tool_name, input.tool_input || {});
  if (!det.isPublish) return;

  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const lookup = (slug) => {
    try {
      const raw = readFileSync(join(root, '.claude/state/number-lock', slug + '.json'), 'utf8');
      const j = JSON.parse(raw);
      const issuedAt = Date.parse(j.issued_at);
      if (!j.issued_at || Number.isNaN(issuedAt)) return { valid: false };
      return { valid: true, issuedAt };
    } catch {
      return { valid: false };
    }
  };

  const verdict = decide(det, lookup);
  if (verdict.deny) {
    process.stdout.write(JSON.stringify(denyTool(verdict.reason)));
  }
}

main()
  .catch(() => {})
  .finally(() => process.exit(0));
```

- [ ] **Step 6: Add the receipt-writing step to `number-lock`**

In `.claude/skills/number-lock.md`, find the line:
```markdown
### Step 4: Record keeping
```
Immediately BEFORE that `### Step 4` heading, insert:
```markdown
### Step 3b: Persist the receipt

On a successful lock (and only then), write the receipt the `publish-guard` hook
reads. Use the Write tool to create `.claude/state/number-lock/<slug>.json`:

```json
{
  "slug": "<article-slug>",
  "issued_at": "<ISO 8601 timestamp>",
  "integrity_score": "<N>/<N>",
  "figures": [
    { "claim_text": "89,247.8 metric tons", "mnemonic": "LBR_PRO_9", "db_value": 89247.8, "match": "EXACT" }
  ]
}
```

A DENIED lock writes nothing. Without a fresh receipt (issued within 24h),
`publish-guard` blocks any Claude-initiated publish of this slug.

```

- [ ] **Step 7: Smoke-test the runner (deny then allow)**

Run:
```bash
mkdir -p .claude/state/number-lock
echo '{"tool_name":"Bash","tool_input":{"command":"node scripts/publish-one.mjs --slug demo-story"}}' | node .claude/hooks/publish-guard.mjs; echo " (expect deny) exit=$?"
printf '{"slug":"demo-story","issued_at":"%s"}\n' "$(node -e 'console.log(new Date().toISOString())')" > .claude/state/number-lock/demo-story.json
echo '{"tool_name":"Bash","tool_input":{"command":"node scripts/publish-one.mjs --slug demo-story"}}' | node .claude/hooks/publish-guard.mjs; echo " (expect empty=allow) exit=$?"
rm -f .claude/state/number-lock/demo-story.json
```
Expected: first prints JSON with `"permissionDecision":"deny"`; second prints nothing (allow). Both `exit=0`.

- [ ] **Step 8: Commit**

```bash
git add .claude/hooks/lib/publish-guard.mjs .claude/hooks/lib/publish-guard.test.mjs .claude/hooks/publish-guard.mjs .claude/skills/number-lock.md
git commit -m "feat(hooks): publish-guard blocks Claude publishes without a number-lock receipt"
```

---

### Task 6: `article-number-scan` PostToolUse hook (advisory)

**Files:**
- Create: `.claude/hooks/lib/article-number-scan.mjs`
- Create: `.claude/hooks/article-number-scan.mjs` (runner)
- Test: `.claude/hooks/lib/article-number-scan.test.mjs`

**Interfaces:**
- Consumes: `postContext` from `./hook-io.mjs`.
- Produces: `scan(text: string): string[]` — currency/percent tokens in `text` that lack a nearby (±60 char) period label; deduped.

- [ ] **Step 1: Write the failing test**

Create `.claude/hooks/lib/article-number-scan.test.mjs`:
```js
import { scan } from './article-number-scan.mjs';

describe('article-number-scan scan', () => {
  it('flags a currency figure with no period label', () => {
    expect(scan('Revenue reached US$304 million last cycle.')).toContain('US$304 million');
  });

  it('is silent when a period label is nearby', () => {
    expect(scan('Revenue reached US$304 million in March 2026.')).toEqual([]);
  });

  it('flags a bare percent with no period', () => {
    const f = scan('The lending rate is 13.11 percent for borrowers.');
    expect(f.some((t) => /13\.11/.test(t))).toBe(true);
  });

  it('accepts a Mar-26 style label', () => {
    expect(scan('Lending rate 13.11 percent (Mar-26).')).toEqual([]);
  });

  it('returns empty for text with no figures', () => {
    expect(scan('The market women in Red Light felt the change.')).toEqual([]);
  });

  it('dedupes repeated unlabelled figures', () => {
    const f = scan('L$500,000 here and L$500,000 there.');
    expect(f).toEqual(['L$500,000']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run .claude/hooks/lib/article-number-scan.test.mjs`
Expected: FAIL — cannot resolve `./article-number-scan.mjs`.

- [ ] **Step 3: Write minimal implementation**

Create `.claude/hooks/lib/article-number-scan.mjs`:
```js
const MONEY_RE =
  /(?:US\$|L\$|\$)\s?\d[\d,]*(?:\.\d+)?(?:\s?(?:million|billion|thousand|bn|MT|metric tons))?/gi;
const PCT_RE = /\b\d[\d,]*(?:\.\d+)?\s?(?:percent|%)/gi;
const PERIOD_RE =
  /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[-\s]?(?:20)?\d{2}\b|\bQ[1-4][-\s]?20\d{2}\b|\b(?:19|20)\d{2}\b/i;

export function scan(text) {
  if (!text) return [];
  const flags = [];
  for (const re of [MONEY_RE, PCT_RE]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      const token = m[0].trim();
      const from = Math.max(0, m.index - 60);
      const to = Math.min(text.length, m.index + m[0].length + 60);
      const window = text.slice(from, to);
      if (!PERIOD_RE.test(window)) flags.push(token);
    }
  }
  return [...new Set(flags)];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run .claude/hooks/lib/article-number-scan.test.mjs`
Expected: PASS (6 tests).

- [ ] **Step 5: Write the runner**

Create `.claude/hooks/article-number-scan.mjs`:
```js
#!/usr/bin/env node
import { readStdinJson, postContext } from './lib/hook-io.mjs';
import { scan } from './lib/article-number-scan.mjs';

async function main() {
  const input = await readStdinJson();
  const fp = input.tool_input?.file_path || '';
  if (!/src\/data\/news\.ts$/.test(fp)) return;

  const text = input.tool_input?.new_string ?? input.tool_input?.content ?? '';
  const flags = scan(text);
  if (flags.length) {
    process.stdout.write(
      JSON.stringify(
        postContext(
          'anti-hallucination (type 1): these figures added to news.ts lack a period label — confirm each came from an article_data_sheet and add its period (e.g. "in March 2026" / "(Mar-26)"): ' +
            flags.join(', '),
        ),
      ),
    );
  }
}

main()
  .catch(() => {})
  .finally(() => process.exit(0));
```

- [ ] **Step 6: Smoke-test the runner**

Run:
```bash
echo '{"tool_name":"Edit","tool_input":{"file_path":"/repo/src/data/news.ts","new_string":"body: \"Revenue hit US$304 million.\""}}' | node .claude/hooks/article-number-scan.mjs; echo " exit=$?"
```
Expected: prints JSON with `additionalContext` mentioning `US$304 million`, then ` exit=0`.

- [ ] **Step 7: Commit**

```bash
git add .claude/hooks/lib/article-number-scan.mjs .claude/hooks/lib/article-number-scan.test.mjs .claude/hooks/article-number-scan.mjs
git commit -m "feat(hooks): article-number-scan flags unlabelled figures in news.ts"
```

---

### Task 7: Wire hooks in `.claude/settings.json` + full-suite verification

**Files:**
- Create: `.claude/settings.json`

**Interfaces:**
- Consumes: all three runners from Tasks 4–6.
- Produces: the committed hook configuration the whole team inherits.

- [ ] **Step 1: Create the settings file**

Create `.claude/settings.json`:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PROJECT_DIR}/.claude/hooks/publish-guard.mjs\""
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PROJECT_DIR}/.claude/hooks/article-number-scan.mjs\""
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PROJECT_DIR}/.claude/hooks/claim-guard.mjs\""
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 2: Validate the JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8')); console.log('settings.json OK')"`
Expected: `settings.json OK`.

- [ ] **Step 3: Run the full hook test suite**

Run: `npx vitest run .claude/hooks`
Expected: PASS — all four test files (hook-io, claim-guard, publish-guard, article-number-scan), 26 tests total, 0 failures.

- [ ] **Step 4: Confirm the full project test suite still passes**

Run: `npm test`
Expected: PASS — existing `src/__tests__/*` suites plus the new `.claude/hooks/*` suites, 0 failures.

- [ ] **Step 5: Confirm committed paths are tracked and state is not**

Run:
```bash
git add -A && git status --porcelain .claude | sort; echo "--- ignored check ---"; git check-ignore .claude/state 2>&1
```
Expected: staged entries include `.claude/settings.json`, the six `.claude/hooks/**` files, and `.claude/skills/anti-hallucination.md`; the ignored check prints `.claude/state`.

- [ ] **Step 6: Commit**

```bash
git commit -m "feat(hooks): wire anti-hallucination hooks in committed settings.json"
```

---

## Self-Review

**Spec coverage:**
- Router skill with 7-type taxonomy → Task 3. ✓
- claim-guard Stop advisory (unverified success + ungrounded citation) → Task 4. ✓
- publish-guard PreToolUse blocking, Claude-initiated only → Task 5. ✓
- article-number-scan PostToolUse advisory on news.ts → Task 6. ✓
- number-lock receipt extension → Task 5, Step 6. ✓
- Committed `.claude/settings.json` team-wide → Task 7 (+ Task 1 un-ignore, a spec-implied prerequisite surfaced during planning). ✓
- Test-first for each hook; exact hook JSON contract → Global Constraints + every task. ✓
- Out-of-scope UI publish path → noted in Global Constraints. ✓

**Placeholder scan:** none — every step has real code/commands and expected output.

**Type consistency:** `evaluate(entries)→string[]`, `detectPublish(toolName,input)→{isPublish,slug}`, `decide(det,lookup,now?,maxAgeMs?)→{deny,reason?}`, `lookup(slug)→{valid,issuedAt?}`, `scan(text)→string[]`, and `hook-io` exports are used identically in runners and tests. Receipt shape (`slug`, `issued_at` ISO) is written by number-lock (Task 5 Step 6) and read by the publish-guard runner (Task 5 Step 5) consistently.

---

## Post-review amendment (2026-07-17)

The final whole-branch review found that Task 5's premise was wrong: publish state
does not live in `src/data/news.ts` (the fallback seed has no `status`/`slug`
fields) — TrueRate publishes to the Supabase `articles` table via the bulk importer
`scripts/import-news-articles.mjs`. Consequences and the applied fix (commit
`f7b204b`):

- **publish-guard reworked into a tripwire.** `detectPublish`/`decide`/`lookup` were
  replaced by `isPublishCommand(toolName, input) -> boolean` (true iff a `Bash`
  command both invokes `node` and names a publish-y target). The runner denies such
  commands with a stop-and-confirm `DENY_REASON`; there is no receipt lookup, slug
  extraction, or `news.ts` Edit/Write detection. This also fixed the review's #1
  (the old substring regex blocked benign `cat`/`grep`/`git` commands).
- **number-lock left unchanged.** Task 5 Step 6's receipt-writing step was dropped —
  with no reachable allow-path, the receipt had no consumer. (`number-lock.md` is a
  local git-ignored skill file and never entered the committed diff.)
- **article-number-scan period regex tightened** to require a month/quarter label
  (bare year no longer counts), reducing false negatives.
- **Tests** now include a runner-level integration test for publish-guard.

Tasks 1-4, 6, 7 stand as written. The shipped design is described in the updated
design spec (`…-design.md`).
