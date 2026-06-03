// Seed the `symbols` table with the Trends & Analytics instruments via the
// Supabase REST API (service role). Idempotent: skips tickers that already exist.
//
// Region is NOT written here when the symbols.region column is absent (migration
// 009 adds it). The app reads region from src/lib/analytics/catalog.ts until 009
// is applied; once it is, re-run with WRITE_REGION=1 to backfill the column.
//
// Usage: node --env-file=.env.local scripts/seed-symbols.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const writeRegion = process.env.WRITE_REGION === '1';
const db = createClient(url, key, { auth: { persistSession: false } });

const FX = [
  { ticker: 'USD/LRD', name: 'US Dollar / Liberian Dollar',      base: 'USD', region: 'LR', unit: 'LRD per USD' },
  { ticker: 'EUR/LRD', name: 'Euro / Liberian Dollar',           base: 'EUR', region: 'LR', unit: 'LRD per EUR' },
  { ticker: 'GBP/LRD', name: 'British Pound / Liberian Dollar',  base: 'GBP', region: 'LR', unit: 'LRD per GBP' },
  { ticker: 'CNY/LRD', name: 'Chinese Yuan / Liberian Dollar',   base: 'CNY', region: 'LR', unit: 'LRD per CNY' },
  { ticker: 'GHS/LRD', name: 'Ghanaian Cedi / Liberian Dollar',  base: 'GHS', region: 'LR', unit: 'LRD per GHS' },
  { ticker: 'NGN/LRD', name: 'Nigerian Naira / Liberian Dollar', base: 'NGN', region: 'LR', unit: 'LRD per NGN' },
];
const COMM = [
  { ticker: 'gc.f',   name: 'Gold',                     region: 'global', unit: '$/oz'  },
  { ticker: 'cb.f',   name: 'Brent crude',             region: 'global', unit: '$/bbl' },
  { ticker: 'cc.f',   name: 'Cocoa',                   region: 'global', unit: '$/t'   },
  { ticker: 'kc.f',   name: 'Coffee',                  region: 'global', unit: '¢/lb'  },
  { ticker: 'sb.f',   name: 'Sugar',                   region: 'global', unit: '¢/lb'  },
  { ticker: 'bhp.us', name: 'Iron ore (BHP ADR proxy)', region: 'global', unit: '$ ADR' },
];

function row(s, assetClass) {
  const r = {
    ticker: s.ticker,
    asset_class: assetClass,
    name: s.name,
    currency: 'LRD' in s ? 'LRD' : 'USD',
    unit: s.unit,
    is_active: true,
  };
  if (assetClass === 'fx') { r.currency = 'LRD'; r.base_currency = s.base; r.quote_currency = 'LRD'; }
  else { r.currency = 'USD'; }
  if (writeRegion) r.region = s.region;
  return r;
}

async function main() {
  const { data: existing, error: exErr } = await db.from('symbols').select('ticker');
  if (exErr) { console.error('read failed:', exErr.message); process.exit(1); }
  const have = new Set((existing ?? []).map((e) => e.ticker));

  const toInsert = [
    ...FX.filter((s) => !have.has(s.ticker)).map((s) => row(s, 'fx')),
    ...COMM.filter((s) => !have.has(s.ticker)).map((s) => row(s, 'commodity')),
  ];

  if (toInsert.length === 0) {
    console.log('✓ all symbols already present, nothing to insert');
  } else {
    const { data, error } = await db.from('symbols').insert(toInsert).select('ticker,asset_class');
    if (error) { console.error('insert failed:', error.message); process.exit(1); }
    console.log(`✓ inserted ${data.length} symbols:`, data.map((d) => d.ticker).join(', '));
  }

  if (writeRegion) {
    for (const s of [...FX, ...COMM]) {
      await db.from('symbols').update({ region: s.region }).eq('ticker', s.ticker);
    }
    console.log('✓ region backfilled');
  } else {
    console.log('ℹ region not written (column may not exist yet); app reads region from catalog.ts');
  }
}
main();
