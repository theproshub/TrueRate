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
