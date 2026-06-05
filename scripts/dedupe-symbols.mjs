// One-time cleanup of duplicate rows in the `symbols` table.
//
// Root cause: the table's uniqueness is `unique (ticker, mic, asset_class)`,
// but `mic` is NULL for our symbols and Postgres treats NULLs as DISTINCT in a
// unique index — so running seed-symbols.mjs twice inserted a second copy of
// every ticker. Both the snapshot cron and the analytics reader key a Map by
// ticker, so duplicates collapse to whichever row the (unordered) query returns
// last, and price history can land on an id the chart doesn't read.
//
// For each ticker this keeps ONE canonical row (the one with the most data /
// references; tiebreak oldest, then smallest id), repoints every referencing
// table to it, and deletes the rest. Idempotent and convergent — safe to re-run
// (after dedupe there is nothing left to do).
//
// Tables referencing symbols(id):  quotes_daily, article_symbols,
//                                  watchlist_items, alerts  (all ON DELETE CASCADE)
//
// Usage:
//   node --env-file=.env.local scripts/dedupe-symbols.mjs [--apply]
//
// Without --apply it runs a DRY RUN (reports the plan, changes nothing).

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APPLY = process.argv.includes('--apply');

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local.');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const COUNT = { count: 'exact', head: true };

async function refCounts(id) {
  const [q, a, w, al] = await Promise.all([
    sb.from('quotes_daily').select('*', COUNT).eq('symbol_id', id),
    sb.from('article_symbols').select('*', COUNT).eq('symbol_id', id),
    sb.from('watchlist_items').select('*', COUNT).eq('symbol_id', id),
    sb.from('alerts').select('*', COUNT).eq('symbol_id', id),
  ]);
  return {
    quotes: q.count ?? 0,
    articles: a.count ?? 0,
    watch: w.count ?? 0,
    alerts: al.count ?? 0,
    get total() {
      return this.quotes + this.articles + this.watch + this.alerts;
    },
  };
}

/** Move composite-PK rows (symbol_id + other key) from dup -> canonical. */
async function repointComposite(table, otherKey, dupId, canonId) {
  const { data: rows, error } = await sb.from(table).select('*').eq('symbol_id', dupId);
  if (error) throw error;
  if (!rows?.length) return 0;
  // Insert under the canonical id, ignoring rows that already exist there.
  const moved = rows.map((r) => ({ ...r, symbol_id: canonId }));
  const { error: upErr } = await sb
    .from(table)
    .upsert(moved, { onConflict: `${otherKey},symbol_id`, ignoreDuplicates: true });
  if (upErr) throw upErr;
  // Remove the dup's originals (the canonical now has equivalents).
  const { error: delErr } = await sb.from(table).delete().eq('symbol_id', dupId);
  if (delErr) throw delErr;
  return rows.length;
}

/** Move single-PK rows (own id, symbol_id is just an FK) from dup -> canonical. */
async function repointSimple(table, dupId, canonId) {
  const { data, error } = await sb
    .from(table)
    .update({ symbol_id: canonId })
    .eq('symbol_id', dupId)
    .select('id');
  if (error) throw error;
  return data?.length ?? 0;
}

async function main() {
  console.log(`Dedupe symbols — ${APPLY ? 'APPLY' : 'DRY RUN'}\n`);

  const { data: syms, error } = await sb
    .from('symbols')
    .select('id, ticker, created_at')
    .order('ticker')
    .order('created_at');
  if (error) throw error;

  const byTicker = new Map();
  for (const s of syms ?? []) {
    if (!byTicker.has(s.ticker)) byTicker.set(s.ticker, []);
    byTicker.get(s.ticker).push(s);
  }

  let dupTickers = 0;
  let deleted = 0;

  for (const [ticker, rows] of byTicker) {
    if (rows.length < 2) continue;
    dupTickers++;

    // Score each row, then pick canonical: most references, then oldest, then id.
    const scored = [];
    for (const r of rows) scored.push({ ...r, refs: await refCounts(r.id) });
    scored.sort(
      (a, b) =>
        b.refs.total - a.refs.total ||
        new Date(a.created_at) - new Date(b.created_at) ||
        a.id.localeCompare(b.id),
    );
    const [canonical, ...dups] = scored;
    console.log(
      `${ticker}: keep ${canonical.id} (refs ${canonical.refs.total}) ` +
        `· drop ${dups.map((d) => `${d.id}[${d.refs.total}]`).join(', ')}`,
    );

    if (!APPLY) continue;

    for (const d of dups) {
      await repointComposite('quotes_daily', 'date', d.id, canonical.id);
      await repointComposite('article_symbols', 'article_id', d.id, canonical.id);
      await repointSimple('watchlist_items', d.id, canonical.id);
      await repointSimple('alerts', d.id, canonical.id);
      const { error: delErr } = await sb.from('symbols').delete().eq('id', d.id);
      if (delErr) throw delErr;
      deleted++;
    }
  }

  if (dupTickers === 0) {
    console.log('No duplicate tickers found — nothing to do.');
    return;
  }

  console.log(
    `\n${APPLY ? 'Done.' : 'Dry run.'} ${dupTickers} tickers had duplicates; ` +
      `${APPLY ? `deleted ${deleted} rows.` : 're-run with --apply to fix.'}`,
  );

  if (APPLY) {
    const { count } = await sb.from('symbols').select('*', COUNT);
    const { data: after } = await sb.from('symbols').select('ticker');
    const distinct = new Set((after ?? []).map((r) => r.ticker)).size;
    console.log(`symbols now: ${count} rows across ${distinct} tickers.`);
  }
}

main().catch((e) => {
  console.error('\nFatal:', e);
  process.exit(1);
});
