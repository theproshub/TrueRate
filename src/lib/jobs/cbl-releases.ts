// CBL warehouse release detection. Runs inside sync-cbl on the droplet.
// Nothing here may import from `next/*` — there is no Next runtime there.
//
// Design: docs/superpowers/specs/2026-08-13-cbl-release-monitoring-design.md

import type { createAdminClient } from '@/lib/supabase/admin';

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

    const lines = group.slice(0, NOTICE_CAP).map((f) => `  ${describeFinding(f)}`);
    if (group.length > NOTICE_CAP) {
      lines.push(`  …and ${group.length - NOTICE_CAP} more`);
    }

    blocks.push(`${NOTICE_HEADINGS[kind]} (${group.length})\n${lines.join('\n')}`);
  }

  return `CBL warehouse changes detected\n\n${blocks.join('\n\n')}`;
}

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
        observationKey(r.mnemonic, r.period_date),
        r.value === null ? null : Number(r.value),
      );
    }

    if (rows.length < INDEX_PAGE) break;
  }

  return index;
}

export interface ReleaseSummary {
  runId: string;
  findings: ReleaseFinding[];
  articlesLabeled: number;
  findingsFiled: number;
}

const INSERT_CHUNK = 500;

interface AffectedArticle {
  id: string;
  slug: string;
  macro_tags: string[] | null;
}

/** Revisions outrank new periods when one article cites several changed series. */
function bestReasonByMnemonic(
  findings: readonly ReleaseFinding[],
): Map<string, string> {
  const best = new Map<string, ReleaseFinding>();
  for (const f of findings) {
    if (f.kind !== 'new_period' && f.kind !== 'revision') continue;
    const existing = best.get(f.mnemonic);
    if (existing?.kind === 'revision' && f.kind === 'new_period') continue;
    best.set(f.mnemonic, f);
  }
  return new Map([...best].map(([m, f]) => [m, describeFinding(f)]));
}

/** Published articles whose macro_tags mention any of these mnemonics. */
async function findAffectedArticles(
  supabase: AdminClient,
  mnemonics: string[],
): Promise<AffectedArticle[]> {
  if (mnemonics.length === 0) return [];
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, macro_tags')
    .eq('status', 'published')
    .overlaps('macro_tags', mnemonics);
  if (error) throw error;
  return data ?? [];
}

/**
 * Persist findings, label affected articles, and file revisions to the integrity
 * queue.
 *
 * Never touches articles.status. getNewsItems filters status='published' and
 * falls back to the news.ts seed at zero rows, so unpublishing on a release
 * would pull live articles off the site — and a large release could flip the
 * whole site to seed data. An article citing June CPI is not wrong when July
 * lands; it is merely no longer current.
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
  for (const rev of findings.filter((f) => f.kind === 'revision')) {
    const slugs = articles
      .filter((a) => (a.macro_tags ?? []).includes(rev.mnemonic))
      .map((a) => a.slug);

    const { error } = await supabase
      .from('data_integrity_findings')
      .insert({
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
