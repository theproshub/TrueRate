// Editorial lint — enforces the mechanical house-style rules from CLAUDE.md
// over the article seed (src/data/news.ts) and, with --db, the live Supabase catalog.
//
// Errors (exit 1):
//   E1  bare "$" before a number (must be US$ or L$) — titles, deks, body
//   E2  headline leading with Liberia / Liberia's / Liberian
//   E3  wire-service dateline opening the body ("MONROVIA — ")
//   E4  banned hype words (massive, shocking, skyrocketing, …)
//   E5  same numeric value written with different decimal precision
//       across the catalog (e.g. "4.5 percent" vs "4.50 percent")
// Warnings (exit 0):
//   W1  headline longer than 12 words
//   W2  "surge"/"plummet" (banned as filler; allowed only for verified extremes)
//
// Usage:
//   node scripts/lint-editorial.mjs            # seed only (runs in CI, no secrets)
//   node --env-file=.env.local scripts/lint-editorial.mjs --db   # also lint live articles

import { readFile, writeFile, unlink } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const CHECK_DB = process.argv.includes('--db');

const BARE_DOLLAR = /(^|[^SL])\$\d/;
const LIBERIA_LEAD = /^Liberia('s)?\s|^Liberian\s/;
const DATELINE = /^[A-Z]{3,}(\s[A-Z]{3,})? — /;
const BANNED = /\b(massive|shocking|game-changing|explosive|soaring|skyrocket(s|ed|ing)?|slam(s|med)?|crater(s|ed)?|tank(ed|ing)|it remains to be seen|only time will tell)\b/i;
const FILLER = /\b(surge[sd]?|surging|plummet(s|ed|ing)?)\b/i;
const PCT_TOKEN = /\b(\d+\.\d+)\s*(?:percent|%)/g;

const errors = [];
const warnings = [];
const pctForms = new Map(); // numeric value -> Map(stringForm -> [where])

function checkText(where, kind, text) {
  if (!text) return;
  const m = text.match(BARE_DOLLAR);
  if (m) errors.push(`E1 bare-$ in ${kind} of ${where}: "…${text.slice(Math.max(0, m.index - 20), m.index + 15)}…"`);
  const banned = text.match(BANNED);
  if (banned) errors.push(`E4 banned word "${banned[0]}" in ${kind} of ${where}`);
  const filler = text.match(FILLER);
  if (filler) warnings.push(`W2 filler verb "${filler[0]}" in ${kind} of ${where} — allowed only for verified extremes`);
  for (const t of text.matchAll(PCT_TOKEN)) {
    const value = String(Number(t[1]));
    if (!pctForms.has(value)) pctForms.set(value, new Map());
    const forms = pctForms.get(value);
    if (!forms.has(t[1])) forms.set(t[1], []);
    forms.get(t[1]).push(`${kind} of ${where}`);
  }
}

function checkArticle(where, { title, dek, bodyParas }) {
  if (title) {
    checkText(where, 'title', title);
    if (LIBERIA_LEAD.test(title)) errors.push(`E2 headline leads with Liberia: "${title}" (${where})`);
    const words = title.replace(/[—:]/g, ' ').split(/\s+/).filter(Boolean).length;
    if (words > 12) warnings.push(`W1 headline is ${words} words (>12): "${title}" (${where})`);
  }
  checkText(where, 'dek', dek);
  (bodyParas ?? []).forEach((p, idx) => {
    if (idx === 0 && DATELINE.test(p)) errors.push(`E3 dateline opens body of ${where}: "${p.slice(0, 30)}…"`);
    checkText(where, `body ¶${idx + 1}`, p);
  });
}

// --- seed file ---
async function loadSeed() {
  const raw = await readFile(join(here, '..', 'src', 'data', 'news.ts'), 'utf8');
  const js = raw
    .replace(/^\s*import\s+\{[^}]*\}\s+from\s+'@\/lib\/types';\s*$/m, '')
    .replace(/:\s*NewsItem\[\]/, '');
  const tmp = join(here, `.lint-news.${process.pid}.mjs`);
  await writeFile(tmp, js, 'utf8');
  try {
    return (await import(pathToFileURL(tmp).href)).newsItems;
  } finally {
    await unlink(tmp).catch(() => {});
  }
}

for (const n of await loadSeed()) {
  checkArticle(`seed:${n.id}`, { title: n.title, dek: n.summary, bodyParas: n.body });
}

// --- live catalog ---
if (CHECK_DB) {
  const { createClient } = await import('@supabase/supabase-js');
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  const { data, error } = await db.from('articles').select('slug, title, dek, body');
  if (error) throw error;
  for (const r of data ?? []) {
    checkArticle(`db:${r.slug}`, { title: r.title, dek: r.dek, bodyParas: (r.body ?? '').split(/\n\n+/) });
  }
}

// --- E5: precision consistency across everything scanned ---
for (const [value, forms] of pctForms) {
  if (forms.size > 1) {
    const detail = [...forms.entries()].map(([f, locs]) => `"${f}" (${locs[0]}${locs.length > 1 ? ` +${locs.length - 1}` : ''})`).join(' vs ');
    errors.push(`E5 value ${value} written with inconsistent precision: ${detail}`);
  }
}

for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
console.log(`\neditorial lint: ${errors.length} error(s), ${warnings.length} warning(s)${CHECK_DB ? ' (seed + live DB)' : ' (seed only)'}`);
process.exit(errors.length ? 1 : 0);
