// One-time backfill of the USD/LRD daily history from the Central Bank of
// Liberia's published buying/selling archive into `quotes_daily`.
//
// The CBL paginates ~31 rows/page back to 2012 at
//   https://www.cbl.org.lr/research/buying-selling-rates?page=N   (0-indexed)
//
// We store the daily MID as `close` (the series the charts read) and keep the
// bank's buying/selling as low/high so the bid/ask spread is preserved.
//
// Idempotent — upserts on (symbol_id, date), so it is safe to re-run (e.g. to
// pick up newly published days). NEVER fabricates: a row that fails to parse or
// is implausible is skipped, not invented.
//
// Usage:
//   node --env-file=.env.local scripts/backfill-cbl-history.mjs [--max-pages=120]
//
// Requires .env.local to contain:
//   NEXT_PUBLIC_SUPABASE_URL=...
//   SUPABASE_SERVICE_ROLE_KEY=...

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TICKER = 'USD/LRD';
const BASE_URL = 'https://www.cbl.org.lr/research/buying-selling-rates';
const RATE_LIMIT_MS = 300; // be polite to the CBL server
const MAX_PAGES_DEFAULT = 120; // safety cap (~105 pages exist as of 2026)
const UPSERT_CHUNK = 500;

const argVal = (name, def) => {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  return a ? Number(a.split('=')[1]) : def;
};
const MAX_PAGES = argVal('max-pages', MAX_PAGES_DEFAULT);
const START_PAGE = argVal('start-page', 0); // resume from a deep page after a timeout

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    'Missing env vars. Need NEXT_PUBLIC_SUPABASE_URL and ' +
      'SUPABASE_SERVICE_ROLE_KEY in .env.local.',
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const BUYING_RE = /views-field-field-buying-us"[^>]*>\s*L\$([0-9]+(?:\.[0-9]+)?)/g;
const SELLING_RE = /views-field-field-selling-us"[^>]*>\s*L\$([0-9]+(?:\.[0-9]+)?)/g;
const TIME_RE = /<time[^>]*datetime="([^"]+)"/g;

const plausible = (n) => Number.isFinite(n) && n >= 50 && n <= 500;

/** Fetch one archive page and return [{ date, buying, selling, mid }]. */
async function fetchPage(page) {
  const url = `${BASE_URL}?page=${page}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'text/html',
      'User-Agent': 'Mozilla/5.0 (compatible; TrueRate/1.0; +https://truerateliberia.com)',
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const dates = [...html.matchAll(TIME_RE)].map((m) => m[1].slice(0, 10));
  const buys = [...html.matchAll(BUYING_RE)].map((m) => Number(m[1]));
  const sells = [...html.matchAll(SELLING_RE)].map((m) => Number(m[1]));

  // Cells appear in row order: date, buying, selling. Zip by index; only zip
  // the overlapping count so a stray <time> elsewhere can't misalign columns.
  const n = Math.min(dates.length, buys.length, sells.length);
  const rows = [];
  for (let i = 0; i < n; i++) {
    const buying = buys[i];
    const selling = sells[i];
    if (!plausible(buying) || !plausible(selling)) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dates[i])) continue;
    rows.push({
      date: dates[i],
      buying,
      selling,
      mid: Number(((buying + selling) / 2).toFixed(4)),
    });
  }
  return rows;
}

async function resolveSymbolId() {
  const { data, error } = await supabase
    .from('symbols')
    .select('id, ticker')
    .eq('ticker', TICKER);
  if (error) throw error;
  const ids = (data ?? []).map((r) => r.id);
  if (ids.length === 0) {
    throw new Error(
      `No '${TICKER}' row in symbols. Run scripts/seed-symbols.mjs first.`,
    );
  }
  if (ids.length === 1) return ids[0];

  // Duplicate symbols exist (known seed bug). Target the row the live app
  // already writes to — i.e. the one holding the most quotes — so the chart
  // reads what we backfill. Deterministic tiebreak by id.
  let best = null;
  let bestCount = -1;
  for (const id of ids.sort()) {
    const { count } = await supabase
      .from('quotes_daily')
      .select('*', { count: 'exact', head: true })
      .eq('symbol_id', id);
    if ((count ?? 0) > bestCount) {
      bestCount = count ?? 0;
      best = id;
    }
  }
  console.log(
    `  ! ${ids.length} '${TICKER}' symbols found (duplicate seed); ` +
      `using ${best} (${bestCount} existing quotes).\n`,
  );
  return best;
}

async function upsertQuotes(symbolId, rows) {
  // Dedup by date (page boundaries can repeat a day); last write wins.
  const byDate = new Map();
  for (const r of rows) {
    byDate.set(r.date, {
      symbol_id: symbolId,
      date: r.date,
      close: r.mid,
      open: null,
      high: r.selling, // bank sells high
      low: r.buying, //  bank buys low
    });
  }
  const records = [...byDate.values()];

  let written = 0;
  for (let i = 0; i < records.length; i += UPSERT_CHUNK) {
    const chunk = records.slice(i, i + UPSERT_CHUNK);
    const { error } = await supabase
      .from('quotes_daily')
      .upsert(chunk, { onConflict: 'symbol_id,date' });
    if (error) throw error;
    written += chunk.length;
  }
  return written;
}

async function main() {
  console.log(`Backfilling ${TICKER} history from the Central Bank of Liberia…\n`);
  const symbolId = await resolveSymbolId();

  const all = [];
  let emptyStreak = 0;

  for (let page = START_PAGE; page < MAX_PAGES; page++) {
    process.stdout.write(`  page ${String(page).padStart(3)} `);
    let rows = null;
    // One retry — deep archive pages are slow and occasionally time out.
    for (let attempt = 0; attempt < 2 && rows === null; attempt++) {
      try {
        rows = await fetchPage(page);
      } catch (e) {
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 1500));
        } else {
          console.log(`ERROR: ${e.message} — stopping`);
        }
      }
    }
    if (rows === null) break;

    if (rows.length === 0) {
      console.log('—  no rows (end of archive)');
      if (++emptyStreak >= 2) break; // two empties in a row = done
    } else {
      emptyStreak = 0;
      all.push(...rows);
      const lo = rows[rows.length - 1].date;
      const hi = rows[0].date;
      console.log(`${String(rows.length).padStart(2)} rows  (${lo} … ${hi})`);
    }
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
  }

  if (all.length === 0) {
    console.log('\nNo rows parsed — aborting without writing.');
    process.exit(1);
  }

  const written = await upsertQuotes(symbolId, all);
  const dates = all.map((r) => r.date).sort();
  console.log(
    `\nDone. Upserted ${written} unique daily rates ` +
      `(${dates[0]} … ${dates[dates.length - 1]}).`,
  );
}

main().catch((e) => {
  console.error('\nFatal:', e);
  process.exit(1);
});
