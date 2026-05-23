// Backfill topicTag on existing AI-generated editorial cards so the feed is
// consistent retroactively. Any card missing a topicTag gets the canonical
// fallback 'General' — guaranteeing no card ever renders without a valid tag.
//
// Going forward, the daily cron assigns a specific tag at generation time
// (constrained by TopicTagEnum). This one-shot pass only repairs legacy rows
// created before topicTag existed.
//
// Usage:
//   node --env-file=.env.local scripts/backfill-topic-tags.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const EDITORIAL_TYPES = ['breaking', 'article', 'quote', 'big_stat'];

async function main() {
  const { data, error } = await supabase
    .from('content_cards')
    .select('id, type, payload')
    .eq('is_ai_generated', true)
    .in('type', EDITORIAL_TYPES);

  if (error) {
    console.error('Query failed:', error.message);
    process.exit(1);
  }

  const cards = data ?? [];
  console.log(`Scanning ${cards.length} AI editorial card(s)…`);

  let fixed = 0;
  for (const card of cards) {
    const payload = card.payload ?? {};
    const tag = payload.topicTag;
    if (typeof tag === 'string' && tag.trim().length > 0) continue; // already tagged

    const updated = { ...payload, topicTag: 'General' };
    const { error: upErr } = await supabase
      .from('content_cards')
      .update({ payload: updated })
      .eq('id', card.id);
    if (upErr) {
      console.error(`  ${card.id} (${card.type}) — update failed: ${upErr.message}`);
    } else {
      fixed++;
      console.log(`  ${card.id} (${card.type}) → topicTag=General`);
    }
  }

  console.log(
    fixed === 0
      ? '\nAll AI cards already have a topicTag. Nothing to backfill.'
      : `\nBackfilled ${fixed} card(s) to topicTag=General.`,
  );
}

main().catch((e) => {
  console.error('\nFatal:', e);
  process.exit(1);
});
