// Sync edited seed articles (src/data/news.ts) INTO the Supabase `articles`
// table, matching by slug (= the seed id '1'…'48'). Unlike import-news-articles.mjs
// (insert-only, skips existing), this UPDATES rows that already exist so editorial
// rewrites — e.g. new headlines — go live.
//
// Scope (safe by default):
//   • Updates `title` only.            ← default
//   • --with-dek   also updates `dek`  (the summary)
//   • --with-body  also updates `body` (paragraphs → Markdown)
//   It never touches author, category, status, published_at, slug or images.
//
// Always run --dry-run first to see the exact old → new title diffs.
//
// Usage:
//   node --env-file=.env.local scripts/update-news-from-seed.mjs --dry-run
//   node --env-file=.env.local scripts/update-news-from-seed.mjs            # titles only
//   node --env-file=.env.local scripts/update-news-from-seed.mjs --with-dek --with-body

import { createClient } from '@supabase/supabase-js';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = process.argv.includes('--dry-run');
const WITH_DEK = process.argv.includes('--with-dek');
const WITH_BODY = process.argv.includes('--with-body');

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const NEWS_TS = join(here, '..', 'src', 'data', 'news.ts');

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

function toMarkdown(body) {
  if (Array.isArray(body)) return body.map((p) => String(p).trim()).filter(Boolean).join('\n\n');
  return String(body ?? '').trim();
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

async function main() {
  const newsItems = await loadNewsItems();
  if (!Array.isArray(newsItems) || newsItems.length === 0) {
    console.error('No newsItems parsed from src/data/news.ts.');
    process.exit(1);
  }

  // Current titles in DB, keyed by slug, for the diff.
  const { data: existing, error: exErr } = await supabase.from('articles').select('slug, title');
  if (exErr) throw new Error(`load existing: ${exErr.message}`);
  const dbTitleBySlug = new Map((existing ?? []).map((r) => [r.slug, r.title]));

  const fields = ['title'].concat(WITH_DEK ? ['dek'] : [], WITH_BODY ? ['body'] : []);
  console.log(`Syncing fields: ${fields.join(', ')}${DRY_RUN ? '   [DRY RUN]' : ''}\n`);

  let updated = 0, unchanged = 0;
  const missing = [];

  for (const n of newsItems) {
    const slug = String(n.id);
    if (!dbTitleBySlug.has(slug)) { missing.push(slug); continue; }

    const patch = { title: n.title };
    if (WITH_DEK) patch.dek = n.summary ?? null;
    if (WITH_BODY) patch.body = toMarkdown(n.body);

    const oldTitle = dbTitleBySlug.get(slug);
    const titleChanged = oldTitle !== n.title;
    if (titleChanged) {
      console.log(`#${slug}\n   - ${oldTitle}\n   + ${n.title}`);
    }

    if (DRY_RUN) { titleChanged ? updated++ : unchanged++; continue; }

    const { error } = await supabase.from('articles').update(patch).eq('slug', slug);
    if (error) throw new Error(`update #${slug} failed: ${error.message}`);
    titleChanged ? updated++ : unchanged++;
  }

  console.log(`\n${DRY_RUN ? 'Would update' : 'Updated'}: ${updated} title(s) changed, ${unchanged} unchanged.`);
  if (missing.length) console.log(`Not in DB (skipped): ${missing.join(', ')}`);
  if (DRY_RUN) console.log('\nDry run — nothing written. Re-run without --dry-run to apply.');
}

main().catch((e) => { console.error('\n✗ ' + e.message); process.exit(1); });
