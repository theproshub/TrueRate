// Print an inventory of the TrueRate Supabase schema:
//   - Row counts per table
//   - macro_series → number of values per series + date range
//   - Profile / admin status
//
// Usage:
//   node --env-file=.env.local scripts/inventory.mjs
//
// Uses the service role key (read-only here) so it sees rows that RLS
// would otherwise hide from anon.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const TABLES = [
  'profiles',
  'currencies', 'exchanges', 'sectors', 'issuers',
  'symbols', 'macro_series',
  'quotes_daily', 'macro_values',
  'authors', 'categories', 'articles',
  'article_symbols', 'article_macros',
  'watchlist_groups', 'watchlist_items', 'alerts',
];

async function rowCount(table) {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  if (error) return { ok: false, err: error.message };
  return { ok: true, count };
}

async function main() {
  console.log('\n=== TrueRate Supabase inventory ===\n');

  // 1. Row counts
  console.log('Tables (row counts):');
  let widest = Math.max(...TABLES.map(t => t.length));
  for (const t of TABLES) {
    const r = await rowCount(t);
    const pad = t.padEnd(widest);
    if (r.ok) {
      console.log(`  ${pad}  ${String(r.count).padStart(6)} rows`);
    } else {
      console.log(`  ${pad}  ERROR: ${r.err}`);
    }
  }

  // 2. macro_series with value counts and date span
  console.log('\nMacro series (sorted by row count, top 25):');
  const { data: series, error: seriesErr } = await supabase
    .from('macro_series')
    .select('id, series_id, label, frequency')
    .order('series_id');
  if (seriesErr) {
    console.log('  ERROR:', seriesErr.message);
  } else {
    const stats = await Promise.all(
      (series ?? []).map(async (s) => {
        const { data, error } = await supabase
          .from('macro_values')
          .select('date', { count: 'exact' })
          .eq('series_id', s.id)
          .order('date', { ascending: true })
          .limit(1);
        const first = data?.[0]?.date ?? null;
        const { data: lastRow } = await supabase
          .from('macro_values')
          .select('date, value')
          .eq('series_id', s.id)
          .order('date', { ascending: false })
          .limit(1);
        const last = lastRow?.[0] ?? null;
        // Get full count
        const { count } = await supabase
          .from('macro_values')
          .select('*', { count: 'exact', head: true })
          .eq('series_id', s.id);
        return {
          series_id: s.series_id,
          label: s.label,
          count: count ?? 0,
          first,
          last,
        };
      }),
    );
    stats.sort((a, b) => b.count - a.count);
    const top = stats.slice(0, 25);
    const widestSid = Math.max(...top.map(s => s.series_id.length));
    for (const s of top) {
      const sid = s.series_id.padEnd(widestSid);
      const cnt = String(s.count).padStart(4);
      if (s.count === 0) {
        console.log(`  ${sid}  ${cnt}  (no data)`);
      } else {
        const latestYear = s.last?.date ? String(s.last.date).slice(0, 4) : '?';
        const latestVal  = s.last?.value !== undefined
          ? String(s.last.value).slice(0, 14).padStart(14)
          : '';
        const firstYear  = s.first ? String(s.first).slice(0, 4) : '?';
        console.log(
          `  ${sid}  ${cnt}  ${firstYear}…${latestYear}  latest=${latestVal}`,
        );
      }
    }
    const empty = stats.filter(s => s.count === 0);
    if (empty.length > 0) {
      console.log(
        `\n  ${empty.length} series have no data: ${empty.map(s => s.series_id).join(', ')}`,
      );
    }
  }

  // 3. Profiles / admins
  console.log('\nProfiles:');
  const { data: profiles, error: profErr } = await supabase
    .from('profiles')
    .select('id, display_name, is_admin, created_at')
    .order('created_at', { ascending: false });
  if (profErr) {
    console.log('  ERROR:', profErr.message);
  } else if (!profiles?.length) {
    console.log('  (none — no auth.users have signed up yet)');
  } else {
    for (const p of profiles) {
      const flag = p.is_admin ? 'ADMIN' : '     ';
      console.log(`  ${flag}  ${p.id}  ${p.display_name ?? '(no name)'}`);
    }
  }

  // 4. Sanity: any RLS-locked tables behaving oddly?
  console.log('\nEditorial:');
  const { count: publishedCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');
  const { count: draftCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft');
  console.log(`  articles: ${publishedCount ?? 0} published, ${draftCount ?? 0} draft`);

  console.log('\nDone.\n');
}

main().catch((e) => {
  console.error('\nFatal:', e);
  process.exit(1);
});
