// Fetch every WB.* macro series from the World Bank API and upsert
// the time-series values into Supabase. Idempotent — safe to re-run.
//
// Usage:
//   node --env-file=.env.local scripts/hydrate-worldbank.mjs
//
// Requires .env.local to contain:
//   NEXT_PUBLIC_SUPABASE_URL=...
//   SUPABASE_SERVICE_ROLE_KEY=...    (the "secret" key from Supabase dashboard)

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const COUNTRY      = 'LBR';        // Liberia ISO 3166-1 alpha-3
const PAGE_SIZE    = 200;          // covers ~50+ years of annual data
const RATE_LIMIT_MS = 250;         // be polite to the WB API

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    'Missing env vars. Need NEXT_PUBLIC_SUPABASE_URL and ' +
    'SUPABASE_SERVICE_ROLE_KEY in .env.local.'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

async function fetchWbSeries(indicatorCode) {
  const url =
    `https://api.worldbank.org/v2/country/${COUNTRY}` +
    `/indicator/${indicatorCode}?format=json&per_page=${PAGE_SIZE}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`WB API ${res.status} ${res.statusText} for ${indicatorCode}`);
  }
  const json = await res.json();
  // Shape: [metadata, dataArray]
  if (!Array.isArray(json) || json.length < 2 || !Array.isArray(json[1])) {
    return [];
  }
  return json[1]
    .filter((d) => d && d.value !== null && d.date)
    .map((d) => ({ year: d.date, value: Number(d.value) }));
}

async function loadSeriesList() {
  const { data, error } = await supabase
    .from('macro_series')
    .select('id, series_id, label')
    .like('series_id', 'WB.%')
    .order('series_id');
  if (error) throw error;
  return data ?? [];
}

async function upsertValues(seriesUuid, points) {
  if (points.length === 0) return 0;
  // Annual series → store as Dec 31 of the year. Quarterly/monthly would
  // need a different date convention; none of our WB.* series are subannual.
  const rows = points.map((p) => ({
    series_id: seriesUuid,
    date: `${p.year}-12-31`,
    value: p.value,
  }));
  const { error } = await supabase
    .from('macro_values')
    .upsert(rows, { onConflict: 'series_id,date' });
  if (error) throw error;
  return rows.length;
}

async function main() {
  const series = await loadSeriesList();
  if (series.length === 0) {
    console.log('No WB.* series found in macro_series. Did migration 003 run?');
    return;
  }
  console.log(`Hydrating ${series.length} World Bank series for ${COUNTRY}...\n`);

  let totalRows = 0;
  let skipped = 0;

  for (const s of series) {
    const code = s.series_id.replace(/^WB\./, '');
    process.stdout.write(`  ${s.series_id.padEnd(28)} `);
    try {
      const points = await fetchWbSeries(code);
      if (points.length === 0) {
        console.log('—  no data');
        skipped++;
      } else {
        const n = await upsertValues(s.id, points);
        const years = `${points[points.length - 1].year}…${points[0].year}`;
        console.log(`${String(n).padStart(3)} rows  (${years})`);
        totalRows += n;
      }
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
      skipped++;
    }
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
  }

  console.log(
    `\nDone. Upserted ${totalRows} rows across ${series.length - skipped} series` +
    (skipped ? ` (${skipped} skipped).` : '.')
  );
}

main().catch((e) => {
  console.error('\nFatal:', e);
  process.exit(1);
});
