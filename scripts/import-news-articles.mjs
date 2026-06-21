// One-time import of the in-repo seed articles (src/data/news.ts) into the
// Supabase `articles` table, so the CMS becomes the single source of truth and
// the public site can render every story from the database.
//
// Design choices:
//   • slug = the seed item's id ('1'…'48') so existing /news/<id> URLs keep
//     resolving (the detail page already looks articles up by slug).
//   • Idempotent: existing slugs are skipped, never overwritten — re-running is
//     safe and won't clobber edits made in the CMS afterwards.
//   • Categories that the seed uses but the DB lacks (forex, commodities,
//     banking, policy) are created up-front so the import is lossless.
//   • body (array of paragraphs) → Markdown (blank-line-separated paragraphs).
//   • All seed stories are original TrueRate reporting (source === 'TrueRate'),
//     so source_name stays null — no external outlet to credit.
//
// Usage:
//   node --env-file=.env.local scripts/import-news-articles.mjs
//   node --env-file=.env.local scripts/import-news-articles.mjs --dry-run

import { createClient } from '@supabase/supabase-js';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = process.argv.includes('--dry-run');

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const NEWS_TS = join(here, '..', 'src', 'data', 'news.ts');

// Seed category slug → { label, display_order } for any category the DB may not
// have yet. Existing categories (economy, analysis…) are matched by slug and
// left untouched; these four fill the gaps the seed relies on.
const CATEGORY_BACKFILL = {
  forex:       { label: 'Forex',       description: 'Exchange-rate moves and FX-market coverage', display_order: 120 },
  commodities: { label: 'Commodities', description: 'Gold, iron ore, rubber, oil and other exports', display_order: 130 },
  banking:     { label: 'Banking',     description: 'Banks, credit, and financial-sector news', display_order: 140 },
  policy:      { label: 'Policy',      description: 'Monetary, fiscal, and regulatory policy', display_order: 150 },
  startups:    { label: 'Startups',    description: 'Liberian and African startups, founders, and venture news', display_order: 160 },
  ai:          { label: 'AI',          description: 'Artificial intelligence, machine learning, and automation', display_order: 170 },
};

// Seed byline → canonical author name. 'TrueRate Markets' was never canonical
// (migration 017 folds markets into economics), so it maps across.
const AUTHOR_REMAP = {
  'TrueRate Markets': 'TrueRate Economics',
  'TrueRate Technology': 'TrueRate Tech',
};

/** Load newsItems out of the TS seed without a TS toolchain: strip the type-only
 *  import + the array's type annotation, then dynamic-import the rest as ESM. */
async function loadNewsItems() {
  const raw = await readFile(NEWS_TS, 'utf8');
  const js = raw
    .replace(/^\s*import\s+\{[^}]*\}\s+from\s+'@\/lib\/types';\s*$/m, '')
    .replace(/:\s*NewsItem\[\]/, '');
  const tmp = join(here, `.news-data.${process.pid}.mjs`);
  await writeFile(tmp, js, 'utf8');
  try {
    const mod = await import(pathToFileURL(tmp).href);
    return mod.newsItems;
  } finally {
    await unlink(tmp).catch(() => {});
  }
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

async function ensureCategories() {
  const rows = Object.entries(CATEGORY_BACKFILL).map(([slug, v]) => ({ slug, ...v }));
  if (DRY_RUN) return;
  const { error } = await supabase
    .from('categories')
    .upsert(rows, { onConflict: 'slug', ignoreDuplicates: true });
  if (error) throw new Error(`category backfill failed: ${error.message}`);
}

async function lookupMaps() {
  const [{ data: cats, error: cErr }, { data: authors, error: aErr }] = await Promise.all([
    supabase.from('categories').select('id, slug'),
    supabase.from('authors').select('id, name'),
  ]);
  if (cErr) throw new Error(`load categories: ${cErr.message}`);
  if (aErr) throw new Error(`load authors: ${aErr.message}`);
  const catBySlug = new Map((cats ?? []).map((c) => [c.slug, c.id]));
  const authorByName = new Map((authors ?? []).map((a) => [a.name, a.id]));
  return { catBySlug, authorByName };
}

function toMarkdown(body) {
  if (Array.isArray(body)) return body.map((p) => String(p).trim()).filter(Boolean).join('\n\n');
  return String(body ?? '').trim();
}

async function main() {
  const newsItems = await loadNewsItems();
  if (!Array.isArray(newsItems) || newsItems.length === 0) {
    console.error('No newsItems parsed from src/data/news.ts.');
    process.exit(1);
  }
  console.log(`Parsed ${newsItems.length} seed articles.${DRY_RUN ? '  [DRY RUN]' : ''}`);

  await ensureCategories();
  const { catBySlug, authorByName } = await lookupMaps();
  // In a real run the backfill categories now exist; reflect that in dry-run too
  // so the category warnings below are accurate rather than false positives.
  if (DRY_RUN) {
    for (const slug of Object.keys(CATEGORY_BACKFILL)) {
      if (!catBySlug.has(slug)) catBySlug.set(slug, 'pending-backfill');
    }
  }

  // Existing slugs → never overwrite.
  const { data: existing, error: exErr } = await supabase.from('articles').select('slug');
  if (exErr) throw new Error(`load existing slugs: ${exErr.message}`);
  const existingSlugs = new Set((existing ?? []).map((r) => r.slug));

  const rows = [];
  const warnings = [];
  for (const n of newsItems) {
    const slug = String(n.id);
    if (existingSlugs.has(slug)) continue;

    const category_id = catBySlug.get(n.category) ?? null;
    if (!category_id) warnings.push(`#${n.id}: no category for '${n.category}'`);

    const authorName = AUTHOR_REMAP[n.author] ?? n.author;
    const author_id = authorName ? authorByName.get(authorName) ?? null : null;
    if (authorName && !author_id) warnings.push(`#${n.id}: no author '${authorName}'`);

    const body = toMarkdown(n.body);
    if (!body) { warnings.push(`#${n.id}: empty body — skipped`); continue; }

    rows.push({
      slug,
      title: n.title,
      dek: n.summary ?? null,
      body,
      hero_image: null,
      hero_alt: null,
      author_id,
      category_id,
      status: 'published',
      published_at: n.date ? new Date(n.date).toISOString() : new Date().toISOString(),
      source_name: n.source && n.source !== 'TrueRate' ? n.source : null,
      source_url: null,
    });
  }

  console.log(`To insert: ${rows.length}   Already in DB (skipped): ${newsItems.length - rows.length}`);
  if (warnings.length) {
    console.log('\nWarnings:');
    for (const w of warnings) console.log('  • ' + w);
  }

  if (DRY_RUN) {
    console.log('\nDry run — nothing written. Sample row:');
    console.log(JSON.stringify({ ...rows[0], body: rows[0]?.body.slice(0, 120) + '…' }, null, 2));
    return;
  }

  if (rows.length === 0) {
    console.log('\nNothing to insert — all seed articles already in the database.');
    return;
  }

  const { error } = await supabase.from('articles').insert(rows);
  if (error) throw new Error(`insert failed: ${error.message}`);
  console.log(`\n✓ Inserted ${rows.length} articles as published.`);
}

main().catch((e) => {
  console.error('\n✗ ' + e.message);
  process.exit(1);
});
