// One-shot script: resync article URL slugs from titles and auto-detect
// macro indicator tags from article content.
//
// Usage:
//   node --env-file=.env.local scripts/resync-slugs-and-autotag.mjs
//
// Dry-run (preview only, no writes):
//   node --env-file=.env.local scripts/resync-slugs-and-autotag.mjs --dry-run

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const DRY_RUN = process.argv.includes('--dry-run');
if (DRY_RUN) console.log('── DRY RUN — no database writes ──\n');

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

function slugify(input) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// Extra keywords that should trigger a match for a given series_id.
// These supplement the exact label / series_id matching.
const KEYWORD_MAP = {
  'CBL.CPI_HEADLINE':  ['inflation', 'consumer price', 'price index'],
  'CBL.CPI_CORE':      ['core inflation', 'core cpi'],
  'CBL.CPI_FOOD':      ['food price', 'food inflation', 'food cost'],
  'CBL.CPI_NONFOOD':   ['non-food price', 'nonfood'],
  'CBL.CPI_MOM':       ['month-on-month inflation', 'monthly inflation'],
  'WB.FP.CPI.TOTL.ZG': ['inflation rate', 'annual inflation'],
  'WB.NY.GDP.MKTP.CD':    ['gdp', 'gross domestic product', 'economy grew', 'economic output'],
  'WB.NY.GDP.MKTP.KD.ZG': ['gdp growth', 'economic growth', 'economy grew'],
  'WB.NY.GDP.PCAP.CD':    ['per capita', 'income per person', 'gdp per capita'],
  'WB.NV.AGR.TOTL.ZS':    ['agriculture', 'farming', 'crop'],
  'WB.NV.IND.TOTL.ZS':    ['industry', 'mining', 'manufacturing', 'industrial'],
  'WB.NV.SRV.TOTL.ZS':    ['services sector', 'service sector'],
  'CBL.M1':             ['money supply', 'narrow money'],
  'CBL.M2':             ['money supply', 'broad money', 'm2'],
  'CBL.MB':             ['monetary base', 'reserve money'],
  'CBL.CURRENCY_CIRC':  ['currency in circulation', 'cash outside bank', 'cash in circulation'],
  'CBL.FX_RESERVES':    ['foreign exchange reserve', 'forex reserve', 'gross reserve', 'international reserve'],
  'WB.DT.DOD.DECT.CD':  ['external debt', 'public debt', 'national debt', 'government debt'],
  'WB.BX.GSR.GNFS.CD':  ['exports', 'export earnings', 'export revenue'],
  'WB.BM.GSR.GNFS.CD':  ['imports', 'import bill', 'import cost'],
  'WB.BN.CAB.XOKA.CD':  ['current account', 'trade balance', 'balance of payment', 'remittance'],
  'WB.BX.KLT.DINV.CD.WD': ['foreign direct investment', 'fdi', 'foreign investment'],
  'CBL.POLICY_RATE':    ['policy rate', 'cbl rate', 'central bank rate', 'monetary policy'],
  'CBL.LENDING_RATE':   ['lending rate', 'loan rate', 'business loan', 'interest rate'],
  'CBL.DEPOSIT_RATE':   ['deposit rate', 'savings rate'],
  'CBL.INTERBANK_RATE': ['interbank'],
  'CBL.RESERVE_REQ':    ['reserve requirement', 'cash reserve'],
  'CBL.TBILL_91':       ['treasury bill', 't-bill', 'tbill'],
  'CBL.TBILL_182':      ['treasury bill', 't-bill', 'tbill'],
  'CBL.TBILL_364':      ['treasury bill', 't-bill', 'tbill'],
  'WB.SL.UEM.TOTL.ZS':  ['unemployment', 'jobless'],
  'WB.SL.TLF.CACT.ZS':  ['labor force', 'labour force', 'workforce participation'],
  'WB.SP.POP.TOTL':     ['population'],
  'WB.SP.URB.TOTL.IN.ZS': ['urban population', 'urbanization'],
};

function detectMacros(text, macros) {
  const lower = text.toLowerCase();
  const found = [];
  for (const m of macros) {
    if (lower.includes(m.label.toLowerCase())) {
      found.push(m.id);
      continue;
    }
    const escaped = m.series_id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(text)) {
      found.push(m.id);
      continue;
    }
    const keywords = KEYWORD_MAP[m.series_id];
    if (keywords && keywords.some((kw) => lower.includes(kw))) {
      found.push(m.id);
    }
  }
  return found;
}

async function main() {
  // ── Load all articles ──
  const { data: articles, error: artErr } = await supabase
    .from('articles')
    .select('id, title, slug, body')
    .order('created_at', { ascending: false });

  if (artErr) {
    console.error('Failed to load articles:', artErr.message);
    process.exit(1);
  }
  console.log(`Found ${articles.length} article(s).\n`);

  // ── Load all macro series ──
  const { data: macros, error: macErr } = await supabase
    .from('macro_series')
    .select('id, series_id, label, category')
    .order('category')
    .order('label');

  if (macErr) {
    console.error('Failed to load macro_series:', macErr.message);
    process.exit(1);
  }
  console.log(`Loaded ${macros.length} macro series for auto-detect.\n`);

  // ── Load existing article_macros ──
  const { data: existingTags, error: tagErr } = await supabase
    .from('article_macros')
    .select('article_id, series_id');

  if (tagErr) {
    console.error('Failed to load article_macros:', tagErr.message);
    process.exit(1);
  }

  const existingByArticle = new Map();
  for (const row of existingTags ?? []) {
    const set = existingByArticle.get(row.article_id) ?? new Set();
    set.add(row.series_id);
    existingByArticle.set(row.article_id, set);
  }

  // ── 1. Resync slugs ──
  console.log('═══ SLUG RESYNC ═══');
  let slugsUpdated = 0;
  let slugsSkipped = 0;

  for (const art of articles) {
    const derived = slugify(art.title ?? '');
    if (!derived) {
      console.log(`  SKIP  ${art.id} — empty title`);
      slugsSkipped++;
      continue;
    }
    if (art.slug === derived) {
      slugsSkipped++;
      continue;
    }

    console.log(`  ${art.slug} → ${derived}`);
    console.log(`         "${(art.title ?? '').slice(0, 70)}"`);

    if (!DRY_RUN) {
      const { error } = await supabase
        .from('articles')
        .update({ slug: derived })
        .eq('id', art.id);
      if (error) {
        console.error(`  ERROR  ${art.id}: ${error.message}`);
        continue;
      }
    }
    slugsUpdated++;
  }

  console.log(
    `\nSlugs: ${slugsUpdated} updated, ${slugsSkipped} already in sync.\n`,
  );

  // ── 2. Auto-tag macros ──
  console.log('═══ MACRO AUTO-TAG ═══');
  let articlesTagged = 0;
  let tagsInserted = 0;

  for (const art of articles) {
    const text = `${art.title ?? ''} ${art.body ?? ''}`;
    const detected = detectMacros(text, macros);
    if (detected.length === 0) continue;

    const existing = existingByArticle.get(art.id) ?? new Set();
    const newTags = detected.filter((id) => !existing.has(id));
    if (newTags.length === 0) continue;

    const macroLabels = newTags
      .map((id) => macros.find((m) => m.id === id)?.label ?? id)
      .join(', ');
    console.log(
      `  ${(art.title ?? '').slice(0, 60).padEnd(60)} +${newTags.length} → ${macroLabels}`,
    );

    if (!DRY_RUN) {
      const rows = newTags.map((series_id) => ({
        article_id: art.id,
        series_id,
      }));
      const { error } = await supabase.from('article_macros').insert(rows);
      if (error) {
        console.error(`  ERROR  ${art.id}: ${error.message}`);
        continue;
      }
    }
    articlesTagged++;
    tagsInserted += newTags.length;
  }

  console.log(
    `\nMacro tags: ${tagsInserted} new tag(s) on ${articlesTagged} article(s).\n`,
  );

  if (DRY_RUN) {
    console.log('── Dry run complete. Re-run without --dry-run to apply. ──');
  } else {
    console.log('Done.');
  }
}

main().catch((e) => {
  console.error('\nFatal:', e);
  process.exit(1);
});
