// CBL Statistics sync — shared job logic.
//
// Runs in two places: the Vercel cron route (src/app/api/cron/sync-cbl/route.ts)
// and the droplet runner (src/lib/jobs/run.ts). Nothing here may import from
// `next/*` — the droplet has no Next runtime. Cache invalidation is the
// caller's responsibility, not this module's.
//
// Env required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createAdminClient } from '@/lib/supabase/admin';
import {
  loadObservationIndex,
  diffSeries,
  diffCatalog,
  recordReleases,
  type ObservationIndex,
  type ReleaseFinding,
} from './cbl-releases';

const PORTAL = 'cblstatistics';
const BASE = 'https://app.datawarehousepro.com/guest';
const CONCURRENCY = 8;

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

interface Node {
  mnemonic: string;
  name_of_series: string;
  frequency: string;
  mnemonics?: Node[];
}
type Catalog = Record<string, { name: string; mnemonics?: Node[] }>;

interface SeriesRef {
  databank: string;
  mnemonic: string;
}

export interface SyncCblResult {
  ok: true;
  series_synced: number;
  observations_upserted: number;
  failed_count: number;
  failed: string[];
  /**
   * Distinct failure reasons, capped. Without this a bad service-role key looks
   * identical to a portal outage: hundreds of anonymous failures and no cause.
   */
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

/** Cache tags to invalidate after a successful run — see /api/revalidate. */
export const SYNC_CBL_REVALIDATE_TAGS = ['rates', 'indicators'] as const;

// Flatten the nested catalog tree into a flat list of (databank, mnemonic).
// Every node is itself a series (parents carry data too), so we don't filter to leaves.
function flatten(catalog: Catalog): SeriesRef[] {
  const out: SeriesRef[] = [];
  for (const [databank, db] of Object.entries(catalog)) {
    const walk = (nodes?: Node[]) => {
      for (const n of nodes ?? []) {
        out.push({ databank, mnemonic: n.mnemonic });
        walk(n.mnemonics);
      }
    };
    walk(db.mnemonics);
  }
  return out;
}

// "Jan-92" | "2025Q2" | "2025" -> first day of period as YYYY-MM-DD
function periodToDate(label: string, freq: string): string | null {
  if (freq === 'A') {
    const y = Number(label);
    return Number.isInteger(y) ? `${y}-01-01` : null;
  }
  if (freq === 'Q') {
    const m = /^(\d{4})Q([1-4])$/.exec(label);
    if (!m) return null;
    const month = (Number(m[2]) - 1) * 3 + 1;
    return `${m[1]}-${String(month).padStart(2, '0')}-01`;
  }
  // Monthly
  const m = /^([A-Za-z]{3})-(\d{2})$/.exec(label);
  if (!m) return null;
  const month = MONTHS[m[1].toLowerCase()];
  if (!month) return null;
  const yy = Number(m[2]);
  const year = yy >= 90 ? 1900 + yy : 2000 + yy; // CBL data starts 1992
  return `${year}-${String(month).padStart(2, '0')}-01`;
}

async function pool<T>(items: T[], n: number, fn: (t: T) => Promise<void>) {
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) await fn(items[i++]);
    }),
  );
}

/**
 * Scrape every CBL series from the DataWarehouse portal and upsert it into
 * `cbl_series` / `cbl_observations`. Both writes are upserts, so running this
 * twice against the same data is a no-op — safe to schedule in two places
 * during the Vercel-to-droplet transition.
 *
 * `onProgress` exists so the droplet can stream progress to journald; a scrape
 * of ~366 series is otherwise silent for minutes.
 */
export async function syncCbl(
  onProgress: (message: string) => void = () => {},
): Promise<SyncCblResult> {
  const startedAt = Date.now();
  const supabase = createAdminClient();

  const catalog: Catalog = await fetch(
    `${BASE}/getDatabanksWithMnemonics/${PORTAL}`,
  ).then((r) => r.json());

  const refs = flatten(catalog);
  onProgress(`catalog: ${refs.length} series across ${Object.keys(catalog).length} databanks`);

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

  let seriesOk = 0;
  let obsOk = 0;
  let done = 0;
  const failed: string[] = [];
  const sampleErrors: string[] = [];

  // Record why a series failed, keeping only distinct reasons. 364 identical
  // "invalid API key" messages say the same thing as one. The per-mnemonic map
  // is what diffCatalog needs to tell a regression from a first-time failure.
  const fail = (mnemonic: string, reason: string) => {
    failed.push(mnemonic);
    failedReasons.set(mnemonic, reason);
    if (sampleErrors.length < 5 && !sampleErrors.includes(reason)) {
      sampleErrors.push(reason);
    }
  };

  await pool(refs, CONCURRENCY, async (ref) => {
    try {
      const res = await fetch(
        `${BASE}/getMnemonicData/${PORTAL}/${ref.databank}/${ref.mnemonic}`,
      );
      if (!res.ok) {
        fail(ref.mnemonic, `portal fetch: HTTP ${res.status}`);
        return;
      }
      const j = await res.json();

      // Upsert the series row first (FK target for observations).
      const seriesRow = {
        mnemonic: j.mnemonic,
        databank: j.databank,
        databank_name: j.databank_name,
        name_of_series: j.name_of_series,
        data_family: j.data_family ?? null,
        unit_of_measure: j.unit_of_measure ?? null,
        frequency: j.frequency,
        data_source: j.data_source ?? null,
        first_observation: j.first_observation ?? null,
        notes: j.notes || null,
        updated_at: new Date().toISOString(),
      };
      const sErr = (await supabase.from('cbl_series').upsert(seriesRow, { onConflict: 'mnemonic' })).error;
      if (sErr) {
        fail(ref.mnemonic, `cbl_series upsert: ${sErr.message}`);
        return;
      }
      seriesOk++;

      const rows = ((j.data ?? []) as { description: string; value: string }[])
        .map((d) => {
          const period_date = periodToDate(d.description, j.frequency);
          if (!period_date) return null;
          const num = Number(d.value);
          return {
            mnemonic: j.mnemonic,
            period_date,
            period_label: d.description,
            value: Number.isFinite(num) ? num : null,
          };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null);

      if (index) {
        findings.push(...diffSeries(index, j.mnemonic, rows));
      }

      if (rows.length) {
        const oErr = (
          await supabase.from('cbl_observations').upsert(rows, { onConflict: 'mnemonic,period_date' })
        ).error;
        if (oErr) {
          fail(ref.mnemonic, `cbl_observations upsert: ${oErr.message}`);
          return;
        }
        obsOk += rows.length;
      }
    } catch (err) {
      fail(ref.mnemonic, `exception: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      done++;
      if (done % 50 === 0) onProgress(`${done}/${refs.length} series processed`);
    }
  });

  let releases: SyncCblResult['releases'];
  if (index) {
    try {
      const { data: knownRows, error: knownErr } = await supabase
        .from('cbl_series')
        .select('mnemonic');
      if (knownErr) throw knownErr;

      const known = new Set((knownRows ?? []).map((r) => r.mnemonic));
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

  return {
    ok: true,
    series_synced: seriesOk,
    observations_upserted: obsOk,
    failed_count: failed.length,
    failed,
    sample_errors: sampleErrors,
    duration_ms: Date.now() - startedAt,
    releases,
    release_findings: index ? findings : undefined,
    detection_error: detectionError,
  };
}
