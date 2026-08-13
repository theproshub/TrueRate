# CBL Release Detection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `sync-cbl` report what changed in the CBL warehouse — new periods, revisions, and scrape regressions — persist those findings, label affected articles as outdated, and notify a human.

**Architecture:** Load all existing observations into an in-memory `Map` before the scrape, diff each scraped series against it inside the existing per-series loop, then persist findings to `cbl_releases`, label matching published articles with `needs_refresh`, route restatements to `data_integrity_findings`, and post a grouped summary to `JOB_ALERT_WEBHOOK_URL` via a new optional `notice` field on the job outcome contract.

**Tech Stack:** TypeScript, Supabase JS (`@supabase/supabase-js`), vitest, tsx, systemd on the DigitalOcean droplet.

**Spec:** [`docs/superpowers/specs/2026-08-13-cbl-release-monitoring-design.md`](../specs/2026-08-13-cbl-release-monitoring-design.md)

## Global Constraints

- **No `next/*` imports** in `src/lib/jobs/**`. The droplet has no Next runtime. `sync-cbl.ts` states this at the top of the file; it applies to every new module here.
- **The warehouse is read-only.** Never `UPDATE` or `DELETE` `cbl_observations` / `cbl_series`. Upserts from the existing scrape are the only writes.
- **Never mutate `articles.status`.** `getNewsItems` filters `.eq('status','published')` (`src/lib/news-source.ts:68`) and falls back to the `news.ts` seed at zero rows. Use `needs_refresh` only.
- **DDL is run manually** in the Supabase SQL editor. No migration runner exists in this repo.
- **Float comparison uses `Math.abs(a - b) <= 1e-9`.** `value` is PG `numeric` but JS `number`; `!==` manufactures false revisions.
- **Tests** live in `src/__tests__/*.test.ts`, use the `@/` path alias, and run with `npm test` (`vitest run`).
- **Automation lives on the droplet.** No new systemd unit, no new timer, no new env var — this rides inside `truerate-sync-cbl.service`.

## Out of Scope

Follow-up article drafting (spec §"Follow-up article drafting") is deferred to a separate plan; it is blocked on `AI_GATEWAY_API_KEY`, which is absent from `/etc/truerate/env` today. Stale-series detection is out per the spec.

## File Structure

| File | Responsibility |
|---|---|
| `supabase/migrations/2026-08-13-cbl-releases.sql` | Record of the DDL (run manually) |
| `src/lib/jobs/cbl-releases.ts` | Types, pure diff functions, persistence, labeling, notice formatting |
| `src/__tests__/cbl-releases.test.ts` | Unit tests for the pure core |
| `src/lib/jobs/sync-cbl.ts` | Modified: load index, collect findings, record them |
| `src/lib/jobs/run.ts` | Modified: optional `notice` on `JobOutcome`, webhook delivery |

---

### Task 1: Migrations

**Files:**
- Create: `supabase/migrations/2026-08-13-cbl-releases.sql`

**Interfaces:**
- Consumes: nothing
- Produces: tables `cbl_releases`; columns `articles.needs_refresh` (boolean, not null, default false) and `articles.refresh_reason` (text, nullable)

- [ ] **Step 1: Write the migration file**

```sql
-- CBL release monitoring. Run manually in the Supabase SQL editor.
-- Design: docs/superpowers/specs/2026-08-13-cbl-release-monitoring-design.md

create table if not exists cbl_releases (
  id           uuid primary key default gen_random_uuid(),
  run_id       uuid        not null,
  detected_at  timestamptz not null default now(),
  kind         text        not null check (kind in
                 ('new_period','revision','series_missing','series_failed')),
  mnemonic     text        not null,
  period_date  date,
  period_label text,
  old_value    numeric,
  new_value    numeric,
  detail       text
);

create index if not exists cbl_releases_detected_at_idx on cbl_releases (detected_at desc);
create index if not exists cbl_releases_run_id_idx      on cbl_releases (run_id);
create index if not exists cbl_releases_mnemonic_idx    on cbl_releases (mnemonic);

alter table articles
  add column if not exists needs_refresh  boolean not null default false,
  add column if not exists refresh_reason text;
```

- [ ] **Step 2: Run it in the Supabase SQL editor**

Paste the file contents into the SQL editor for project `xryhgfpudlpcxgpsytcc` and execute.

- [ ] **Step 3: Verify the schema landed**

Run in the SQL editor:

```sql
select column_name from information_schema.columns
 where table_name = 'cbl_releases' order by ordinal_position;
select column_name from information_schema.columns
 where table_name = 'articles' and column_name in ('needs_refresh','refresh_reason');
```

Expected: 10 columns for `cbl_releases`; 2 rows for `articles`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/2026-08-13-cbl-releases.sql
git commit -m "feat(db): cbl_releases table and article refresh flags"
```

---

### Task 2: Types and `diffSeries`

**Files:**
- Create: `src/lib/jobs/cbl-releases.ts`
- Test: `src/__tests__/cbl-releases.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type ReleaseKind = 'new_period' | 'revision' | 'series_missing' | 'series_failed'`
  - `interface ReleaseFinding { kind, mnemonic, period_date?, period_label?, old_value?, new_value?, detail? }`
  - `type ObservationIndex = Map<string, number | null>` keyed `` `${mnemonic}|${period_date}` ``
  - `interface ScrapedRow { mnemonic, period_date, period_label, value }`
  - `function diffSeries(index, mnemonic, rows): ReleaseFinding[]`

- [ ] **Step 1: Write the failing test**

```ts
// src/__tests__/cbl-releases.test.ts
import { describe, it, expect } from 'vitest';
import {
  diffSeries,
  type ObservationIndex,
  type ScrapedRow,
} from '@/lib/jobs/cbl-releases';

const row = (period_date: string, value: number | null, label = 'Jun-26'): ScrapedRow => ({
  mnemonic: 'LBR_CPI_0',
  period_date,
  period_label: label,
  value,
});

describe('diffSeries', () => {
  it('reports an absent key as a new period', () => {
    const index: ObservationIndex = new Map();
    const out = diffSeries(index, 'LBR_CPI_0', [row('2026-06-01', 822.59)]);
    expect(out).toEqual([
      {
        kind: 'new_period',
        mnemonic: 'LBR_CPI_0',
        period_date: '2026-06-01',
        period_label: 'Jun-26',
        old_value: null,
        new_value: 822.59,
      },
    ]);
  });

  it('reports a changed value as a revision carrying the old value', () => {
    const index: ObservationIndex = new Map([['LBR_CPI_0|2026-06-01', 822.59]]);
    const out = diffSeries(index, 'LBR_CPI_0', [row('2026-06-01', 823.4)]);
    expect(out).toHaveLength(1);
    expect(out[0].kind).toBe('revision');
    expect(out[0].old_value).toBe(822.59);
    expect(out[0].new_value).toBe(823.4);
  });

  it('reports nothing when the value is unchanged', () => {
    const index: ObservationIndex = new Map([['LBR_CPI_0|2026-06-01', 822.59]]);
    expect(diffSeries(index, 'LBR_CPI_0', [row('2026-06-01', 822.59)])).toEqual([]);
  });

  it('treats a sub-epsilon difference as unchanged', () => {
    const index: ObservationIndex = new Map([['LBR_CPI_0|2026-06-01', 822.59]]);
    expect(diffSeries(index, 'LBR_CPI_0', [row('2026-06-01', 822.59 + 1e-12)])).toEqual([]);
  });

  it('treats null -> value as a revision', () => {
    const index: ObservationIndex = new Map([['LBR_CPI_0|2026-06-01', null]]);
    const out = diffSeries(index, 'LBR_CPI_0', [row('2026-06-01', 822.59)]);
    expect(out[0].kind).toBe('revision');
    expect(out[0].old_value).toBeNull();
  });

  it('treats value -> null as a revision', () => {
    const index: ObservationIndex = new Map([['LBR_CPI_0|2026-06-01', 822.59]]);
    const out = diffSeries(index, 'LBR_CPI_0', [row('2026-06-01', null)]);
    expect(out[0].kind).toBe('revision');
    expect(out[0].new_value).toBeNull();
  });

  it('treats null -> null as unchanged', () => {
    const index: ObservationIndex = new Map([['LBR_CPI_0|2026-06-01', null]]);
    expect(diffSeries(index, 'LBR_CPI_0', [row('2026-06-01', null)])).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/cbl-releases.test.ts`
Expected: FAIL — cannot resolve `@/lib/jobs/cbl-releases`.

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/jobs/cbl-releases.ts
//
// CBL warehouse release detection. Runs inside sync-cbl on the droplet.
// Nothing here may import from `next/*` — there is no Next runtime there.
//
// Design: docs/superpowers/specs/2026-08-13-cbl-release-monitoring-design.md

export type ReleaseKind =
  | 'new_period'
  | 'revision'
  | 'series_missing'
  | 'series_failed';

export interface ReleaseFinding {
  kind: ReleaseKind;
  mnemonic: string;
  /** ISO date, `YYYY-MM-DD`. Absent for the series_* kinds. */
  period_date?: string;
  period_label?: string;
  old_value?: number | null;
  new_value?: number | null;
  detail?: string;
}

/** Keyed `${mnemonic}|${period_date}`. Value is null when CBL published none. */
export type ObservationIndex = Map<string, number | null>;

export interface ScrapedRow {
  mnemonic: string;
  period_date: string;
  period_label: string;
  value: number | null;
}

/**
 * `value` is PG numeric but JS number. A bare !== manufactures revisions out of
 * float representation drift, so compare with a tolerance.
 */
const EPSILON = 1e-9;

function valuesEqual(a: number | null, b: number | null): boolean {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  return Math.abs(a - b) <= EPSILON;
}

export function observationKey(mnemonic: string, periodDate: string): string {
  return `${mnemonic}|${periodDate}`;
}

/**
 * Compare one series' freshly scraped rows against what the warehouse already
 * holds. Pure — the whole correctness core is testable without a database.
 */
export function diffSeries(
  index: ObservationIndex,
  mnemonic: string,
  rows: readonly ScrapedRow[],
): ReleaseFinding[] {
  const findings: ReleaseFinding[] = [];

  for (const row of rows) {
    const key = observationKey(mnemonic, row.period_date);

    if (!index.has(key)) {
      findings.push({
        kind: 'new_period',
        mnemonic,
        period_date: row.period_date,
        period_label: row.period_label,
        old_value: null,
        new_value: row.value,
      });
      continue;
    }

    const previous = index.get(key) ?? null;
    if (!valuesEqual(previous, row.value)) {
      findings.push({
        kind: 'revision',
        mnemonic,
        period_date: row.period_date,
        period_label: row.period_label,
        old_value: previous,
        new_value: row.value,
      });
    }
  }

  return findings;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/cbl-releases.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/jobs/cbl-releases.ts src/__tests__/cbl-releases.test.ts
git commit -m "feat(jobs): diffSeries detects new periods and revisions"
```

---

### Task 3: `diffCatalog`

**Files:**
- Modify: `src/lib/jobs/cbl-releases.ts`
- Test: `src/__tests__/cbl-releases.test.ts`

**Interfaces:**
- Consumes: `ReleaseFinding` from Task 2
- Produces: `function diffCatalog(known: ReadonlySet<string>, scraped: ReadonlySet<string>, failedReasons: ReadonlyMap<string, string>): ReleaseFinding[]`

- [ ] **Step 1: Write the failing test**

Append to `src/__tests__/cbl-releases.test.ts`:

```ts
import { diffCatalog } from '@/lib/jobs/cbl-releases';

describe('diffCatalog', () => {
  it('reports a known series absent from the catalog as missing', () => {
    const out = diffCatalog(
      new Set(['A', 'B']),
      new Set(['A']),
      new Map(),
    );
    expect(out).toEqual([
      {
        kind: 'series_missing',
        mnemonic: 'B',
        detail: 'in cbl_series but absent from the scraped catalog',
      },
    ]);
  });

  it('reports a previously-synced series that failed today as a regression', () => {
    const out = diffCatalog(
      new Set(['A']),
      new Set(['A']),
      new Map([['A', 'portal fetch: HTTP 502']]),
    );
    expect(out).toEqual([
      {
        kind: 'series_failed',
        mnemonic: 'A',
        detail: 'synced before, failed today: portal fetch: HTTP 502',
      },
    ]);
  });

  it('does not report a failure for a series never synced before', () => {
    const out = diffCatalog(
      new Set(),
      new Set(['NEW']),
      new Map([['NEW', 'portal fetch: HTTP 500']]),
    );
    expect(out).toEqual([]);
  });

  it('reports nothing when the catalog is intact', () => {
    expect(diffCatalog(new Set(['A']), new Set(['A']), new Map())).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/cbl-releases.test.ts -t diffCatalog`
Expected: FAIL — `diffCatalog is not a function`.

- [ ] **Step 3: Write the implementation**

Append to `src/lib/jobs/cbl-releases.ts`:

```ts
/**
 * Catalog-level findings. Needs no previous-run state: presence in `cbl_series`
 * proves a series synced successfully at least once, because sync-cbl only ever
 * upserts and never deletes.
 *
 * @param known   mnemonics already in cbl_series
 * @param scraped mnemonics in today's portal catalog
 * @param failedReasons mnemonic -> failure reason for this run
 */
export function diffCatalog(
  known: ReadonlySet<string>,
  scraped: ReadonlySet<string>,
  failedReasons: ReadonlyMap<string, string>,
): ReleaseFinding[] {
  const findings: ReleaseFinding[] = [];

  for (const mnemonic of known) {
    if (!scraped.has(mnemonic)) {
      findings.push({
        kind: 'series_missing',
        mnemonic,
        detail: 'in cbl_series but absent from the scraped catalog',
      });
    }
  }

  for (const [mnemonic, reason] of failedReasons) {
    // Only a regression if it worked before. A brand-new series failing on its
    // first attempt is a portal problem, not a regression.
    if (known.has(mnemonic)) {
      findings.push({
        kind: 'series_failed',
        mnemonic,
        detail: `synced before, failed today: ${reason}`,
      });
    }
  }

  return findings;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/cbl-releases.test.ts`
Expected: PASS, 11 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/jobs/cbl-releases.ts src/__tests__/cbl-releases.test.ts
git commit -m "feat(jobs): diffCatalog detects missing and regressed series"
```

---

### Task 4: Finding descriptions and notice formatting

**Files:**
- Modify: `src/lib/jobs/cbl-releases.ts`
- Test: `src/__tests__/cbl-releases.test.ts`

**Interfaces:**
- Consumes: `ReleaseFinding`, `ReleaseKind` from Task 2
- Produces:
  - `function describeFinding(f: ReleaseFinding): string`
  - `function formatReleaseNotice(findings: readonly ReleaseFinding[]): string | undefined`

- [ ] **Step 1: Write the failing test**

Append to `src/__tests__/cbl-releases.test.ts`:

```ts
import { describeFinding, formatReleaseNotice } from '@/lib/jobs/cbl-releases';

describe('describeFinding', () => {
  it('describes a new period with its value', () => {
    expect(
      describeFinding({
        kind: 'new_period',
        mnemonic: 'LBR_CPI_0',
        period_label: 'Jun-26',
        new_value: 822.59,
      }),
    ).toBe('Outdated — LBR_CPI_0 gained Jun-26 (822.59).');
  });

  it('describes a revision with both values', () => {
    expect(
      describeFinding({
        kind: 'revision',
        mnemonic: 'LBR_CPI_0',
        period_label: 'Jun-26',
        old_value: 822.59,
        new_value: 823.4,
      }),
    ).toBe('Outdated — LBR_CPI_0 Jun-26 restated 822.59 → 823.4.');
  });
});

describe('formatReleaseNotice', () => {
  it('returns undefined when there is nothing to report', () => {
    expect(formatReleaseNotice([])).toBeUndefined();
  });

  it('groups findings by kind with counts', () => {
    const notice = formatReleaseNotice([
      { kind: 'new_period', mnemonic: 'A', period_label: 'Jun-26', new_value: 1 },
      { kind: 'new_period', mnemonic: 'B', period_label: 'Jun-26', new_value: 2 },
      { kind: 'series_missing', mnemonic: 'C', detail: 'gone' },
    ])!;
    expect(notice).toContain('NEW PERIODS (2)');
    expect(notice).toContain('SERIES MISSING (1)');
    expect(notice).toContain('A');
  });

  it('caps each group at 15 entries and states the remainder', () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      kind: 'new_period' as const,
      mnemonic: `M${i}`,
      period_label: 'Jun-26',
      new_value: i,
    }));
    const notice = formatReleaseNotice(many)!;
    expect(notice).toContain('NEW PERIODS (20)');
    expect(notice).toContain('…and 5 more');
    expect(notice).not.toContain('M19');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/cbl-releases.test.ts -t formatReleaseNotice`
Expected: FAIL — `formatReleaseNotice is not a function`.

- [ ] **Step 3: Write the implementation**

Append to `src/lib/jobs/cbl-releases.ts`:

```ts
/** Human-readable reason, stored on the article and shown in the notice. */
export function describeFinding(f: ReleaseFinding): string {
  if (f.kind === 'new_period') {
    return `Outdated — ${f.mnemonic} gained ${f.period_label} (${f.new_value}).`;
  }
  if (f.kind === 'revision') {
    return `Outdated — ${f.mnemonic} ${f.period_label} restated ${f.old_value} → ${f.new_value}.`;
  }
  return `${f.mnemonic}: ${f.detail ?? f.kind}`;
}

const NOTICE_HEADINGS: Record<ReleaseKind, string> = {
  new_period: 'NEW PERIODS',
  revision: 'REVISIONS',
  series_missing: 'SERIES MISSING',
  series_failed: 'SERIES REGRESSED',
};

/** Order matters: the most editorially urgent kind reads first. */
const NOTICE_ORDER: ReleaseKind[] = [
  'revision',
  'new_period',
  'series_missing',
  'series_failed',
];

const NOTICE_CAP = 15;

/**
 * Grouped, capped summary for JOB_ALERT_WEBHOOK_URL. A monthly CBL release can
 * carry 150+ findings; dumping them all buries the ones that matter.
 * Returns undefined when there is nothing to say, so the caller can skip the post.
 */
export function formatReleaseNotice(
  findings: readonly ReleaseFinding[],
): string | undefined {
  if (findings.length === 0) return undefined;

  const blocks: string[] = [];

  for (const kind of NOTICE_ORDER) {
    const group = findings.filter((f) => f.kind === kind);
    if (group.length === 0) continue;

    const lines = group
      .slice(0, NOTICE_CAP)
      .map((f) => `  ${describeFinding(f)}`);
    if (group.length > NOTICE_CAP) {
      lines.push(`  …and ${group.length - NOTICE_CAP} more`);
    }

    blocks.push(`${NOTICE_HEADINGS[kind]} (${group.length})\n${lines.join('\n')}`);
  }

  return `CBL warehouse changes detected\n\n${blocks.join('\n\n')}`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/cbl-releases.test.ts`
Expected: PASS, 16 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/jobs/cbl-releases.ts src/__tests__/cbl-releases.test.ts
git commit -m "feat(jobs): grouped, capped release notice formatting"
```

---

### Task 5: `loadObservationIndex`

**Files:**
- Modify: `src/lib/jobs/cbl-releases.ts`

**Interfaces:**
- Consumes: `ObservationIndex`, `observationKey` from Task 2
- Produces: `function loadObservationIndex(supabase: AdminClient): Promise<ObservationIndex>`, `type AdminClient = ReturnType<typeof createAdminClient>`

- [ ] **Step 1: Add the type-only import at the TOP of the file**

Imports must sit at the top of the module, not with the appended code below. Add this
as the first line of `src/lib/jobs/cbl-releases.ts`:

```ts
import type { createAdminClient } from '@/lib/supabase/admin';
```

It is a type-only import, so it erases at compile time and does not pull the Supabase
admin client into the pure-function tests.

- [ ] **Step 2: Append the implementation**

Append to `src/lib/jobs/cbl-releases.ts`:

```ts
export type AdminClient = ReturnType<typeof createAdminClient>;

/** PostgREST caps a single response; page through the whole table. */
const INDEX_PAGE = 10_000;

/**
 * Load every existing observation into memory keyed `mnemonic|period_date`.
 * ~44k rows / ~5 MB today, trivially under the unit's MemoryHigh=768M.
 *
 * The explicit ORDER BY is load-bearing: range pagination without a total order
 * can skip or repeat rows between pages.
 */
export async function loadObservationIndex(
  supabase: AdminClient,
): Promise<ObservationIndex> {
  const index: ObservationIndex = new Map();

  for (let from = 0; ; from += INDEX_PAGE) {
    const { data, error } = await supabase
      .from('cbl_observations')
      .select('mnemonic, period_date, value')
      .order('mnemonic', { ascending: true })
      .order('period_date', { ascending: true })
      .range(from, from + INDEX_PAGE - 1);

    if (error) throw error;

    const rows = data ?? [];
    for (const r of rows) {
      index.set(
        observationKey(r.mnemonic as string, r.period_date as string),
        r.value === null ? null : Number(r.value),
      );
    }

    if (rows.length < INDEX_PAGE) break;
  }

  return index;
}
```

- [ ] **Step 3: Verify it compiles and existing tests still pass**

Run: `npx tsc --noEmit && npm test`
Expected: no type errors; all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/jobs/cbl-releases.ts
git commit -m "feat(jobs): paginated observation index loader"
```

---

### Task 6: Persist findings and label affected articles

**Files:**
- Modify: `src/lib/jobs/cbl-releases.ts`

**Interfaces:**
- Consumes: `AdminClient`, `ReleaseFinding`, `describeFinding`
- Produces:
  - `interface ReleaseSummary { runId: string; findings: ReleaseFinding[]; articlesLabeled: number; findingsFiled: number }`
  - `function recordReleases(supabase: AdminClient, runId: string, findings: readonly ReleaseFinding[]): Promise<ReleaseSummary>`

- [ ] **Step 1: Write the implementation**

Append to `src/lib/jobs/cbl-releases.ts`:

```ts
export interface ReleaseSummary {
  runId: string;
  findings: ReleaseFinding[];
  articlesLabeled: number;
  findingsFiled: number;
}

const INSERT_CHUNK = 500;

/** Revisions outrank new periods when one article cites several changed series. */
function bestReasonByMnemonic(
  findings: readonly ReleaseFinding[],
): Map<string, string> {
  const out = new Map<string, ReleaseFinding>();
  for (const f of findings) {
    if (f.kind !== 'new_period' && f.kind !== 'revision') continue;
    const existing = out.get(f.mnemonic);
    if (existing?.kind === 'revision' && f.kind === 'new_period') continue;
    out.set(f.mnemonic, f);
  }
  return new Map([...out].map(([m, f]) => [m, describeFinding(f)]));
}

/** Published articles whose macro_tags mention any of these mnemonics. */
async function findAffectedArticles(
  supabase: AdminClient,
  mnemonics: string[],
): Promise<{ id: string; slug: string; macro_tags: string[] }[]> {
  if (mnemonics.length === 0) return [];
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, macro_tags')
    .eq('status', 'published')
    .overlaps('macro_tags', mnemonics);
  if (error) throw error;
  return (data ?? []) as { id: string; slug: string; macro_tags: string[] }[];
}

/**
 * Persist findings, label affected articles, and file revisions to the integrity
 * queue. Never touches articles.status — see the spec on why that would pull
 * live articles off the site.
 */
export async function recordReleases(
  supabase: AdminClient,
  runId: string,
  findings: readonly ReleaseFinding[],
): Promise<ReleaseSummary> {
  const summary: ReleaseSummary = {
    runId,
    findings: [...findings],
    articlesLabeled: 0,
    findingsFiled: 0,
  };
  if (findings.length === 0) return summary;

  // 1. Full change log.
  for (let i = 0; i < findings.length; i += INSERT_CHUNK) {
    const chunk = findings.slice(i, i + INSERT_CHUNK).map((f) => ({
      run_id: runId,
      kind: f.kind,
      mnemonic: f.mnemonic,
      period_date: f.period_date ?? null,
      period_label: f.period_label ?? null,
      old_value: f.old_value ?? null,
      new_value: f.new_value ?? null,
      detail: f.detail ?? null,
    }));
    const { error } = await supabase.from('cbl_releases').insert(chunk);
    if (error) throw error;
  }

  // 2. Label affected published articles.
  const reasons = bestReasonByMnemonic(findings);
  const articles = await findAffectedArticles(supabase, [...reasons.keys()]);

  for (const article of articles) {
    const hit = (article.macro_tags ?? []).find((m) => reasons.has(m));
    if (!hit) continue;
    const { error } = await supabase
      .from('articles')
      .update({ needs_refresh: true, refresh_reason: reasons.get(hit) })
      .eq('id', article.id);
    if (error) throw error;
    summary.articlesLabeled++;
  }

  // 3. Revisions are a review item, not just a change. An article quoting a
  //    superseded value is wrong, not merely stale.
  const revisions = findings.filter((f) => f.kind === 'revision');
  for (const rev of revisions) {
    const slugs = articles
      .filter((a) => (a.macro_tags ?? []).includes(rev.mnemonic))
      .map((a) => a.slug);

    const { error } = await supabase.from('data_integrity_findings').insert({
      severity: 'HIGH',
      title: `${rev.mnemonic} ${rev.period_label} restated by source`,
      detail:
        `cbl_observations held ${rev.old_value}; CBL now publishes ${rev.new_value}. ` +
        `Articles listed quote the superseded figure.`,
      series_mnemonic: rev.mnemonic,
      period_label: rev.period_label ?? null,
      affected_slugs: slugs,
      status: 'open',
    });
    if (error) throw error;
    summary.findingsFiled++;
  }

  return summary;
}
```

- [ ] **Step 2: Verify it compiles and tests pass**

Run: `npx tsc --noEmit && npm test`
Expected: no type errors; all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/lib/jobs/cbl-releases.ts
git commit -m "feat(jobs): persist releases, label articles, file revisions"
```

---

### Task 7: Wire detection into `sync-cbl`

**Files:**
- Modify: `src/lib/jobs/sync-cbl.ts`

**Interfaces:**
- Consumes: `loadObservationIndex`, `diffSeries`, `diffCatalog`, `recordReleases`, `ReleaseFinding` from Tasks 2–6
- Produces: `SyncCblResult` gains `releases?: { run_id: string; counts: Record<string, number>; articles_labeled: number; findings_filed: number }` and `release_findings?: ReleaseFinding[]`; `detection_error?: string`

- [ ] **Step 1: Add the imports and extend the result type**

In `src/lib/jobs/sync-cbl.ts`, add after the existing `createAdminClient` import:

```ts
import {
  loadObservationIndex,
  diffSeries,
  diffCatalog,
  recordReleases,
  type ObservationIndex,
  type ReleaseFinding,
} from './cbl-releases';
```

Extend `SyncCblResult`:

```ts
export interface SyncCblResult {
  ok: true;
  series_synced: number;
  observations_upserted: number;
  failed_count: number;
  failed: string[];
  sample_errors: string[];
  duration_ms: number;
  /** Release detection outcome. Absent when detection could not run. */
  releases?: {
    run_id: string;
    counts: Record<string, number>;
    articles_labeled: number;
    findings_filed: number;
  };
  /** Findings for the caller's notice. Absent when detection could not run. */
  release_findings?: ReleaseFinding[];
  /** Set when detection failed; the sync itself still succeeded. */
  detection_error?: string;
}
```

- [ ] **Step 2: Load the index before the pool**

Immediately after `onProgress(\`catalog: ...\`)`, insert:

```ts
  // Detection must never cost us the sync. If the index will not load we still
  // scrape — we just cannot say what changed, and the run reports degraded.
  const runId = crypto.randomUUID();
  let index: ObservationIndex | null = null;
  let detectionError: string | undefined;
  try {
    index = await loadObservationIndex(supabase);
    onProgress(`index: ${index.size} existing observations`);
  } catch (err) {
    detectionError = `index load failed: ${err instanceof Error ? err.message : String(err)}`;
    onProgress(`WARN ${detectionError}`);
  }

  const findings: ReleaseFinding[] = [];
  const failedReasons = new Map<string, string>();
```

- [ ] **Step 3: Record per-mnemonic failure reasons**

Replace the body of the existing `fail` helper so it also records the reason per mnemonic:

```ts
  const fail = (mnemonic: string, reason: string) => {
    failed.push(mnemonic);
    failedReasons.set(mnemonic, reason);
    if (sampleErrors.length < 5 && !sampleErrors.includes(reason)) {
      sampleErrors.push(reason);
    }
  };
```

- [ ] **Step 4: Diff each series inside the pool**

In the per-series callback, immediately after `rows` is built and before the `if (rows.length)` upsert block, insert:

```ts
      if (index) {
        findings.push(...diffSeries(index, j.mnemonic, rows));
      }
```

- [ ] **Step 5: Diff the catalog and record, after the pool**

After `await pool(...)` completes and before the `return`, insert:

```ts
  let releases: SyncCblResult['releases'];
  if (index) {
    try {
      const { data: knownRows, error: knownErr } = await supabase
        .from('cbl_series')
        .select('mnemonic');
      if (knownErr) throw knownErr;

      const known = new Set((knownRows ?? []).map((r) => r.mnemonic as string));
      const scraped = new Set(refs.map((r) => r.mnemonic));
      findings.push(...diffCatalog(known, scraped, failedReasons));

      const summary = await recordReleases(supabase, runId, findings);
      const counts: Record<string, number> = {};
      for (const f of findings) counts[f.kind] = (counts[f.kind] ?? 0) + 1;

      releases = {
        run_id: runId,
        counts,
        articles_labeled: summary.articlesLabeled,
        findings_filed: summary.findingsFiled,
      };
      onProgress(
        `releases: ${findings.length} findings, ` +
          `${summary.articlesLabeled} articles labeled, ` +
          `${summary.findingsFiled} findings filed`,
      );
    } catch (err) {
      detectionError = `recording failed: ${err instanceof Error ? err.message : String(err)}`;
      onProgress(`WARN ${detectionError}`);
    }
  }
```

- [ ] **Step 6: Return the new fields**

Extend the existing `return` object with:

```ts
    releases,
    release_findings: index ? findings : undefined,
    detection_error: detectionError,
```

- [ ] **Step 7: Verify it compiles and tests pass**

Run: `npx tsc --noEmit && npm test`
Expected: no type errors; all tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/jobs/sync-cbl.ts
git commit -m "feat(jobs): detect and record CBL releases during sync"
```

---

### Task 8: `notice` on the job contract and webhook delivery

**Files:**
- Modify: `src/lib/jobs/run.ts`

**Interfaces:**
- Consumes: `SyncCblResult.release_findings`, `SyncCblResult.detection_error`, `formatReleaseNotice`
- Produces: `JobOutcome.notice?: string`; `async function notify(message: string): Promise<boolean>`

- [ ] **Step 1: Add the import and extend `JobOutcome`**

Add to the imports in `src/lib/jobs/run.ts`:

```ts
import { formatReleaseNotice } from './cbl-releases';
```

Add to the `JobOutcome` interface:

```ts
  /**
   * Succeeded, but worth telling a human about. OnFailure= only fires on
   * failure, so a successful run with something to report has no other route
   * to a person. Posted to JOB_ALERT_WEBHOOK_URL.
   */
  notice?: string;
```

- [ ] **Step 2: Add the `notify` helper**

Add below the existing `revalidate` function:

```ts
/**
 * Post a non-failure notice to the alert webhook. alert.sh stays a pure failure
 * path; this is the "exit 0 but interesting" channel. A missing webhook is
 * logged, never fatal.
 */
async function notify(message: string): Promise<boolean> {
  const url = process.env.JOB_ALERT_WEBHOOK_URL;
  if (!url) {
    log('WARN notice not delivered: JOB_ALERT_WEBHOOK_URL is unset');
    log(message);
    return false;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: message, content: message }),
    });
    if (!res.ok) {
      log(`WARN notice failed: HTTP ${res.status}`);
      return false;
    }
    log('notice delivered');
    return true;
  } catch (err) {
    log(`WARN notice failed: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}
```

- [ ] **Step 3: Produce the notice from `sync-cbl`**

Replace the `'sync-cbl'` entry in the `JOBS` map with:

```ts
  'sync-cbl': async (log) => {
    const result = await syncCbl(log);
    const total = result.series_synced + result.failed_count;
    const massFailure = total > 0 && result.failed_count / total > FAILURE_THRESHOLD;

    // Detection breaking is degraded-but-synced: the data committed, but we
    // cannot say what changed, and silence there is the failure mode that hides
    // every other failure.
    const degraded = massFailure || Boolean(result.detection_error);

    return {
      result: { ...result },
      degraded,
      degradedReason: massFailure
        ? `${result.failed_count} of ${total} series failed (threshold ${FAILURE_THRESHOLD * 100}%)`
        : result.detection_error,
      notice: formatReleaseNotice(result.release_findings ?? []),
      tags: SYNC_CBL_REVALIDATE_TAGS,
    };
  },
```

- [ ] **Step 4: Deliver the notice in `main`**

In `main()`, replace `await revalidate(tags);` with:

```ts
  await revalidate(tags);
  if (notice) await notify(notice);
```

and destructure `notice` from the job call:

```ts
  const { result, degraded, degradedReason, tags, notice } = await job(log);
```

- [ ] **Step 5: Verify it compiles and tests pass**

Run: `npx tsc --noEmit && npm test && npm run lint`
Expected: no type errors, all tests pass, no lint errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/jobs/run.ts
git commit -m "feat(jobs): notice channel for successful-but-notable runs"
```

---

### Task 9: Rollout and verification on the droplet

**Files:**
- Modify: `infra/systemd/README.md`

**Interfaces:**
- Consumes: everything above
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Confirm the migration ran**

In the Supabase SQL editor:

```sql
select count(*) from cbl_releases;
```

Expected: `0`. If this errors, Task 1 was not applied.

- [ ] **Step 2: Push and deploy**

```bash
git push origin develop
ssh julian@192.34.63.217 'sudo -u truerate /srv/truerate/scripts/deploy.sh'
```

- [ ] **Step 3: Hand-run the job**

```bash
ssh julian@192.34.63.217 'sudo systemctl start truerate-sync-cbl.service'
ssh julian@192.34.63.217 'journalctl -u truerate-sync-cbl --no-pager -n 40 --output=cat'
```

Expected in the log: `index: 44152 existing observations` (or current count), then
`releases: 0 findings, 0 articles labeled, 0 findings filed`.

**Zero findings is the correct first result** — the index is read from the database
that already holds every observation, so the first run has nothing new to find. A
large number here means the diff is wrong, not that CBL published.

- [ ] **Step 4: Confirm the unit succeeded**

```bash
ssh julian@192.34.63.217 'systemctl show truerate-sync-cbl.service --property=Result --value'
```

Expected: `success`.

- [ ] **Step 5: Verify idempotency**

Run the job a second time and confirm `cbl_releases` is still empty:

```sql
select count(*) from cbl_releases;
```

Expected: `0`. A second pass over unchanged data must produce no findings.

- [ ] **Step 6: Document the behavior in the runbook**

Add to the "What a healthy run looks like" list in `infra/systemd/README.md`, under
the `sync-cbl` bullet:

```markdown
  Release detection then logs `index: N existing observations` and
  `releases: N findings, N articles labeled, N findings filed`. Zero findings on
  a day CBL published nothing is correct. `WARN index load failed` means the
  sync ran but could not report changes — the run is marked degraded and alerts.
```

- [ ] **Step 7: Commit**

```bash
git add infra/systemd/README.md
git commit -m "docs(infra): document release detection in the runbook"
```

---

## Self-Review

**Spec coverage:**

| Spec section | Task |
|---|---|
| Schema (`cbl_releases`, article columns) | 1 |
| In-memory diff, epsilon, null transitions | 2 |
| `series_missing` / `series_failed` regressions | 3 |
| Notice grouping and 15-entry cap | 4 |
| Paginated index load | 5 |
| Persist findings, label articles, route revisions | 6 |
| Wiring into `sync-cbl`, four touch points | 7 |
| `notice` field, webhook delivery, degradation table | 8 |
| Rollout, no-first-run-flood verification, runbook | 9 |
| Follow-up drafting, volume gate, AI degradation | **Deferred — separate plan** |
| Stale-series detection | Out of scope per spec |

**Known gap:** the spec's "Testing" section calls for integration tests of
`recordReleases` against a scratch schema. This repo has no integration harness —
every existing test in `src/__tests__` is a pure unit test with mocked modules. Rather
than invent a harness, Task 9 Steps 3–5 verify the same properties against the real
droplet and database. If an integration harness is added later, port those checks.
