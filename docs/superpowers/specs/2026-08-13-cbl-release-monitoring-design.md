# CBL release monitoring — design

**Date:** 2026-08-13
**Status:** Approved design, pending implementation plan
**Builds on:** [`2026-08-07-droplet-jobs-design.md`](2026-08-07-droplet-jobs-design.md)

## Problem

`sync-cbl` scrapes ~366 CBL series nightly and upserts them into `cbl_series` /
`cbl_observations`. Both writes are upserts on the primary key, so the job is
idempotent — and completely silent about *what changed*. When CBL publishes a new
month of CPI, or restates a figure an article already quotes, nothing surfaces it.
The warehouse simply contains different numbers the next morning.

Three consequences today:

- **Releases go unnoticed.** The editorial trigger for covering new data is a human
  remembering to look.
- **Published articles silently drift.** 45 of 67 published articles carry
  `macro_tags` (CBL mnemonics). None of them know when their cited figure has been
  superseded.
- **Restatements are invisible.** If CBL revises a period an article quotes, the
  article now contradicts its own cited source, and nothing detects it.

`cbl_observations` stores no timestamps — only `(mnemonic, period_date, period_label,
value)`. There is no way to ask the database what arrived today. "What changed" must be
derived by comparing state before and after a sync.

## Scope

**In:** detect new periods, revisions, and scrape-health regressions during `sync-cbl`;
persist them; label affected articles as outdated; route restatements to the existing
integrity queue; draft follow-up articles for genuinely new periods.

**Out, deliberately:**

- **Stale-series detection.** 18 of 169 monthly series are already >90 days behind.
  Reporting them is a separate concern with its own thresholds per frequency; excluded
  to keep this shippable.
- **Any mutation of warehouse values.** `cbl_observations` and `cbl_series` remain
  read-and-upsert-only. Discrepancies are review items, never edits.
- **Auto-publishing.** Generated articles land as `status='draft'` and are never
  published without a human.
- **Clearing `needs_refresh` automatically.** A human clears it when the article is
  actually updated.
- **New systemd units.** This rides inside the existing `truerate-sync-cbl.service`.

## Architecture

### Where it runs

On the droplet, inside `truerate-sync-cbl.service` (06:05 UTC), shipped via
`scripts/deploy.sh`. No new `.service`, no new `.timer`, no new environment variable.
All scheduled work lives on the droplet; Vercel declares no crons.

### Detection: in-memory diff

At job start, load every existing observation into a `Map` keyed
`mnemonic|period_date → value`, paginated 10,000 rows at a time (~5 requests for the
current 44,152 rows, ~5 MB resident — trivial under the unit's `MemoryHigh=768M`).

`sync-cbl` already holds each series' full scraped payload in hand where it builds
`rows`. For each scraped row:

| Index state | Verdict |
|---|---|
| key absent | `new_period` |
| key present, value differs beyond epsilon | `revision` |
| key present, value equal | no finding |

Two alternatives were considered and rejected:

- **`created_at`/`updated_at` + trigger on `cbl_observations`.** More durable — works
  regardless of writer — but requires DDL plus a trigger on the largest table (14 MB,
  44k rows), and a plain PostgREST upsert cannot express "only bump `updated_at` when
  the value actually changed." Worse, the backfill makes all 44k existing rows look
  created-today, so run one needs special-casing. `sync-cbl` is currently the only
  writer, so the durability buys nothing.
- **A separate diff job.** Needs its own timer, its own snapshot table, and introduces
  a race if `sync-cbl` overruns.

The in-memory diff has a property the trigger approach lacks: **no first-run flood.**
The index is read from the database that already holds every observation, so the first
run after deploy legitimately finds nothing new.

### Schema

Two migrations, run manually in the Supabase SQL editor.

```sql
create table cbl_releases (
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
create index on cbl_releases (detected_at desc);
create index on cbl_releases (run_id);
create index on cbl_releases (mnemonic);

alter table articles
  add column needs_refresh boolean not null default false,
  add column refresh_reason text;
```

`run_id` groups one sync's findings so a monthly release reads as a single reviewable
batch rather than 150 loose rows.

`period_date`, `old_value`, `new_value` are null for the `series_*` kinds; `old_value`
is null for `new_period`; `detail` carries the error text for `series_failed`.

### Module layout

Detection lives in a new `src/lib/jobs/cbl-releases.ts` rather than growing
`sync-cbl.ts` (already ~210 lines doing one thing well):

```ts
loadObservationIndex(supabase): Promise<ObservationIndex>
diffSeries(index, mnemonic, rows): ReleaseFinding[]        // pure
diffCatalog(known, scraped, failed): ReleaseFinding[]      // pure
recordReleases(supabase, runId, findings): Promise<ReleaseSummary>
```

`diffSeries` and `diffCatalog` are pure functions over plain data — the entire
correctness core is unit-testable without a database.

### Wiring into `sync-cbl`

Four touch points, no restructuring:

1. Before the concurrency pool: `loadObservationIndex`.
2. Inside the existing per-series block, where `rows` is already built: collect
   `diffSeries(...)`.
3. After the pool drains: `diffCatalog(...)`.
4. At the end: `recordReleases(...)`.

`series_missing` costs nothing extra. `sync-cbl` never deletes, so any mnemonic present
in `cbl_series` but absent from today's scraped catalog has disappeared upstream.

**`series_missing` repeats by design.** It reports a standing condition, not an
event, so a series CBL has dropped is reported on every run for as long as it
stays dropped — a row in `cbl_releases` and a line in the notice each day.
Suppressing repeats was considered and **deliberately rejected** (2026-08-15):
a standing problem should stay visible rather than scroll away after one
mention. Do not "fix" this as duplicate-finding noise. If the volume ever does
become a problem, the intended remedy is to notify only on change while still
recording daily, not to stop recording.

`series_failed` is scoped to *regressions*, and needs no previous-run state either:
presence in `cbl_series` proves the series synced successfully at least once, so a
mnemonic that is in `cbl_series` and in today's catalog but landed in `failed[]` has
regressed. This is distinct from the existing 10% mass-failure threshold, which only
fires when the whole scrape degrades.

### Article labeling

One batched pass per run, never per series: collect the distinct mnemonics with
findings, select `status='published'` articles whose `macro_tags` overlap them, and set

```sql
needs_refresh  = true
refresh_reason = 'Outdated — LBR_CPI_0 gained Jun-26 (822.59); article cites May-26 (821.31)'
```

**`status` is never touched.** `getNewsItems` filters `.eq('status','published')`
(`src/lib/news-source.ts:68`) and falls back to the `news.ts` seed when zero published
rows return. Mutating `status` on a release would pull live articles off
truerateliberia.com at 06:05 UTC, and a large release could trip the seed fallback for
the whole site. An article citing June CPI is not *wrong* when July lands — house style
mandates a period label on every figure, so the claim stays true; it is merely no longer
current. Unpublishing is the wrong instrument for staleness.

This preserves the existing two-tier model:

| Situation | Meaning | Action | Public? |
|---|---|---|---|
| Integrity finding | cited figure is **wrong** | `status='pending'` | pulled |
| CBL release | cited figure is **superseded** | `needs_refresh=true` | stays live |

### Revisions route to the integrity queue

A restatement is categorically different from a new period: the article now states a
number CBL no longer publishes. It goes to the existing review workflow rather than a
parallel one.

Revisions are written to **both** tables, and the split is deliberate: `cbl_releases` is
the complete detection log of everything that changed in the warehouse, while
`data_integrity_findings` is the human review queue holding only what needs a decision.
Recording a revision solely in the queue would leave a hole in the change history.

```
data_integrity_findings
  severity        HIGH
  title           LBR_CPI_0 Jun-26 restated by source
  detail          cbl_observations held 822.59; CBL now publishes 823.40 (Δ +0.81).
  series_mnemonic LBR_CPI_0
  period_label    Jun-26
  affected_slugs  {…}
  status          open
```

Affected articles are additionally labeled outdated, and a human resolves the finding at
`/admin/data-integrity`. The warehouse itself is never corrected — that rule is
unchanged.

**A revision updates the existing article; it never spawns a new one.** Same period,
same primary figure, so a second article would be a duplicate under the one-story-one-
article rule.

### Follow-up article drafting

Only `new_period` findings earn a draft — a new period is a new primary figure, so it is
not a duplicate.

**Volume gate.** 151 of 169 monthly series move in the same release window. One draft
per series would produce ~151 drafts a month and destroy editorial discipline. Drafting
is therefore restricted to:

1. `kind = 'new_period'`, and
2. the mnemonic is already cited in `macro_tags` by at least one published article
   (proven editorial interest), and
3. a hard cap of **5 drafts per run**. A `new_period` finding has no `old_value` to
   rank by, so ranking uses the absolute percentage change between the new value and
   the immediately preceding period for that mnemonic — both already in the index —
   with series lacking a prior observation ranked last. Findings beyond the cap are
   still recorded in `cbl_releases` and still label their articles; they simply do not
   get drafted.

**Output.** `status='draft'`, house style, built only from values in the data sheet for
that series. Structure follows the existing WRITE workflow: lede with the exact figure
and period, a context paragraph carrying the continuity framing ("Since TrueRate last
reported this series in May, the index has added 1.28 points"), a "For [audience]"
paragraph with concrete math, and a forward-looking close. The draft cross-links the
article it supersedes, which is how the catalog cites a figure once and links to it
thereafter.

Every draft runs through `verify_article_data` before being written. A draft with any
MISMATCH is not saved; the failure is reported in the run notice.

**Degradation.** Drafting is the only part that needs `AI_GATEWAY_API_KEY`. When the key
is absent, detection, recording, labeling, and integrity routing all still run;
drafting is skipped and reported in the notice. It is **not** treated as a failure —
`generate-feed` already fails daily for exactly this reason, and duplicating that alarm
adds noise without adding information.

### Notification

`run.ts` models outcomes as `{ result, degraded, degradedReason, tags }`. Add one
optional field:

```ts
notice?: string;   // succeeded, but worth telling a human about
```

When set, `run.ts` posts it to `JOB_ALERT_WEBHOOK_URL`. This is the minimal way to
express "exit 0 but interesting". `OnFailure=` only fires on failure, so a successful
sync that discovered a release would otherwise never reach a human, and `alert.sh` stays
a pure failure path. Any future job inherits the capability.

A monthly release can produce 150+ findings, so the message groups by kind and caps at
15 entries per group with "…and N more", mirroring the existing `summarize()` trimming.

## Correctness details

**Float comparison.** `value` is PostgreSQL `numeric` but JavaScript `number`. A naive
`!==` would manufacture revisions from representation drift. Comparison uses
`Math.abs(a - b) > 1e-9`.

**Null transitions.** `null → value` and `value → null` are both recorded as revisions.
The latter means CBL withdrew a figure an article may quote, which is precisely what
should be seen.

**Idempotency.** Re-running `sync-cbl` the same day finds no differences on the second
pass — the first pass already wrote them — so no duplicate `cbl_releases` rows and no
repeat notification.

## Error handling

Detection must never cost the sync, and must never fail silently.

| Failure | Behavior |
|---|---|
| `loadObservationIndex` fails | WARN; sync proceeds with detection disabled; run marked degraded |
| `recordReleases` fails | WARN; degraded; data already committed |
| Article labeling fails | WARN; degraded; `cbl_releases` rows retained |
| Draft generation fails | Reported in notice; **not** degraded |
| `AI_GATEWAY_API_KEY` absent | Reported in notice; **not** degraded |

Degraded exits 1 and fires the existing `OnFailure=`. The upserts have already
committed at that point, so it reads as "look at this", not "data lost" — the same
contract `generate-feed` uses.

## Testing

Unit tests (no database):

- `diffSeries`: new period, revision, unchanged, `null → value`, `value → null`,
  epsilon boundary (a difference of 1e-12 is not a revision).
- `diffCatalog`: series missing from catalog, series failed today that succeeded
  before, no-change case.
- Notice formatting: grouping and the 15-entry cap.

Integration (against a scratch schema):

- `recordReleases` writes the expected rows and labels only `status='published'`
  articles.
- Second run over identical data produces zero new findings.

`npm test` must pass, and `npm run lint:editorial:db` must pass for any generated draft.

## Migration and rollout

1. Run both migrations in the Supabase SQL editor.
2. Deploy: `sudo -u truerate /srv/truerate/scripts/deploy.sh`.
3. Hand-run `sudo systemctl start truerate-sync-cbl.service`; confirm `Result=success`
   and that the first run reports zero findings (the no-flood property).
4. Confirm the notice reaches the webhook on the next real release.

Prerequisite: `JOB_ALERT_WEBHOOK_URL` must be set in `/etc/truerate/env`, which it is
not today — `alert.sh` currently logs `JOB_ALERT_WEBHOOK_URL unset — alert not
delivered`. Drafting additionally requires `AI_GATEWAY_API_KEY`, also absent.

## Open questions

- **Frequency-aware expectations.** A monthly series silent for 40 days is late; an
  annual one is not. Deferred with stale detection.
- **Notice routing.** All notices currently go to the single `JOB_ALERT_WEBHOOK_URL`.
  If release volume makes that channel noisy, a second webhook for editorial signals
  can be split out later.
