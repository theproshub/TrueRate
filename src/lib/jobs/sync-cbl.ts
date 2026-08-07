// CBL Statistics sync — shared job logic.
//
// Runs in two places: the Vercel cron route (src/app/api/cron/sync-cbl/route.ts)
// and the droplet runner (src/lib/jobs/run.ts). Nothing here may import from
// `next/*` — the droplet has no Next runtime. Cache invalidation is the
// caller's responsibility, not this module's.
//
// Env required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createAdminClient } from '@/lib/supabase/admin';

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
  duration_ms: number;
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

  let seriesOk = 0;
  let obsOk = 0;
  let done = 0;
  const failed: string[] = [];

  await pool(refs, CONCURRENCY, async (ref) => {
    try {
      const res = await fetch(
        `${BASE}/getMnemonicData/${PORTAL}/${ref.databank}/${ref.mnemonic}`,
      );
      if (!res.ok) {
        failed.push(ref.mnemonic);
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
        failed.push(ref.mnemonic);
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

      if (rows.length) {
        const oErr = (
          await supabase.from('cbl_observations').upsert(rows, { onConflict: 'mnemonic,period_date' })
        ).error;
        if (oErr) {
          failed.push(ref.mnemonic);
          return;
        }
        obsOk += rows.length;
      }
    } catch {
      failed.push(ref.mnemonic);
    } finally {
      done++;
      if (done % 50 === 0) onProgress(`${done}/${refs.length} series processed`);
    }
  });

  return {
    ok: true,
    series_synced: seriesOk,
    observations_upserted: obsOk,
    failed_count: failed.length,
    failed,
    duration_ms: Date.now() - startedAt,
  };
}
