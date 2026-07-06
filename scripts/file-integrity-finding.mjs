// File a data-integrity finding for human review at /admin/data-integrity.
// This is the ONLY sanctioned response when TrueRate's verification pipeline
// disagrees with the CBL warehouse — cbl_observations is never edited.
//
// Usage:
//   node --env-file=.env.local scripts/file-integrity-finding.mjs \
//     --severity critical|high|medium|low \
//     --title "One-line summary" \
//     --detail "Markdown evidence (the mathematical proof)" \
//     [--mnemonic LBR_FIS_BUD_2_1] [--period Mar-26] \
//     [--slugs slug-one,slug-two] [--pend-articles]
//
//   --pend-articles also sets the affected articles' status to 'pending' so
//   they surface on the admin dashboard for revision.

import { createClient } from '@supabase/supabase-js';

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

const severity = arg('severity');
const title = arg('title');
const detail = arg('detail');
const mnemonic = arg('mnemonic') ?? null;
const period = arg('period') ?? null;
const slugs = (arg('slugs') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const pendArticles = process.argv.includes('--pend-articles');

if (!['critical', 'high', 'medium', 'low'].includes(severity ?? '') || !title || !detail) {
  console.error('Required: --severity critical|high|medium|low --title "…" --detail "…"');
  process.exit(1);
}

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const { data, error } = await db
  .from('data_integrity_findings')
  .insert({
    severity,
    title,
    detail,
    series_mnemonic: mnemonic,
    period_label: period,
    affected_slugs: slugs,
  })
  .select('id')
  .single();
if (error) {
  console.error(`insert failed: ${error.message}`);
  process.exit(1);
}
console.log(`finding filed: ${data.id} (${severity}) — review at /admin/data-integrity`);

if (pendArticles && slugs.length) {
  const { data: updated, error: e } = await db
    .from('articles')
    .update({ status: 'pending' })
    .in('slug', slugs)
    .neq('status', 'archived')
    .select('slug');
  if (e) {
    console.error(`pending update failed: ${e.message}`);
    process.exit(1);
  }
  for (const r of updated ?? []) console.log(`article set to pending: ${r.slug}`);
}
