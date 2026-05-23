import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { feedAdminClient } from '@/lib/feed/db';
import {
  BreakingBatchSchema,
  ArticleBatchSchema,
  QuoteBatchSchema,
  BigStatBatchSchema,
} from '@/lib/feed/schemas';
import {
  EDITORIAL_SYSTEM,
  breakingPrompt,
  articlePrompt,
  quotePrompt,
  bigStatPrompt,
} from '@/lib/feed/prompts';
import { buildMarketsSnapshot } from '@/lib/feed/markets';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const MODEL = 'anthropic/claude-sonnet-4.5'; // via Vercel AI Gateway
const EXPIRES_HOURS = { breaking: 24, markets: 25 } as const;

interface CardInsert {
  type: 'breaking' | 'article' | 'quote' | 'big_stat' | 'markets';
  category: string | null;
  payload: unknown;
  status: 'draft' | 'published';
  is_ai_generated: boolean;
  source_note: string | null;
  published_at: string | null;
  expires_at: string | null;
}

function hoursFromNow(h: number): string {
  return new Date(Date.now() + h * 3600_000).toISOString();
}

/** Cap each category at 2 across the cards that carry one. */
function enforceCategoryDiversity<T extends { category?: string }>(cards: T[]): T[] {
  const counts = new Map<string, number>();
  const kept: T[] = [];
  for (const c of cards) {
    const cat = c.category ?? '__none__';
    const n = counts.get(cat) ?? 0;
    if (n >= 2) continue;
    counts.set(cat, n + 1);
    kept.push(c);
  }
  return kept;
}

export async function GET(request: NextRequest) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const auth = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = feedAdminClient();
  const runDetail: Record<string, unknown> = {};
  let cardsCreated = 0;
  let hadError = false;

  try {
    // 1. Expire anything past its TTL.
    await supabase
      .from('content_cards')
      .update({ status: 'expired' })
      .eq('status', 'published')
      .not('expires_at', 'is', null)
      .lte('expires_at', new Date().toISOString());

    // 2. Anti-repetition: last 7 days of headlines/values.
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
    const { data: recent } = await supabase
      .from('content_cards')
      .select('type, payload')
      .gte('created_at', sevenDaysAgo)
      .in('type', ['breaking', 'article', 'big_stat']);
    const recentHeadlines = (recent ?? [])
      .map((r) => {
        const p = r.payload as Record<string, string>;
        return p.headline ?? p.value ?? '';
      })
      .filter(Boolean);

    const inserts: CardInsert[] = [];

    // 3. Generate AI cards → DRAFTS (human review before publish).
    const aiJobs = [
      { type: 'breaking' as const, schema: BreakingBatchSchema, prompt: breakingPrompt(3, recentHeadlines), n: 3 },
      { type: 'article'  as const, schema: ArticleBatchSchema,  prompt: articlePrompt(4, recentHeadlines),  n: 4 },
      { type: 'quote'    as const, schema: QuoteBatchSchema,    prompt: quotePrompt(3, recentHeadlines),    n: 3 },
      { type: 'big_stat' as const, schema: BigStatBatchSchema,  prompt: bigStatPrompt(4, recentHeadlines),  n: 4 },
    ];

    for (const job of aiJobs) {
      try {
        const { object } = await generateObject({
          model: MODEL,
          schema: job.schema,
          system: EDITORIAL_SYSTEM,
          prompt: job.prompt,
        });
        let cards = object.cards as Array<Record<string, unknown>>;
        if (job.type === 'breaking' || job.type === 'article') {
          cards = enforceCategoryDiversity(cards as Array<{ category?: string }>) as typeof cards;
        }
        for (const card of cards) {
          inserts.push({
            type: job.type,
            category: (card.category as string) ?? null,
            payload: card,
            status: 'draft',
            is_ai_generated: true,
            source_note:
              job.type === 'quote'
                ? 'Illustrative/composite speaker — not a real attributed quote'
                : (card.source as string) ?? null,
            published_at: null,
            expires_at: null,
          });
        }
        runDetail[job.type] = cards.length;
      } catch (e) {
        hadError = true;
        runDetail[`${job.type}_error`] = e instanceof Error ? e.message : String(e);
      }
    }

    // 4. Markets snapshot — REAL data, auto-published.
    try {
      const tickers = await buildMarketsSnapshot();
      if (tickers.length > 0) {
        // Supersede the previous markets card — only the latest is ever live.
        // Done only now that we have a fresh snapshot, so a failed fetch never
        // leaves the feed with no markets card.
        await supabase
          .from('content_cards')
          .update({ status: 'expired', expires_at: new Date().toISOString() })
          .eq('type', 'markets')
          .eq('status', 'published');

        inserts.push({
          type: 'markets',
          category: 'Markets',
          payload: { tickers },
          status: 'published',
          is_ai_generated: false,
          source_note: 'Yahoo Finance chart API + exchange API (live)',
          published_at: new Date().toISOString(),
          expires_at: hoursFromNow(EXPIRES_HOURS.markets),
        });
        // Also refresh the flat markets_snapshot table for quick ticker reads.
        await supabase.from('markets_snapshot').insert(
          tickers.map((t) => ({
            ticker: t.symbol,
            name: t.name,
            asset_class: t.assetClass,
            price: t.price,
            change: t.change,
            change_pct: t.changePct,
            sparkline: t.sparkline,
          })),
        );
        runDetail.markets = tickers.length;
      } else {
        runDetail.markets_error = 'no live tickers available';
        hadError = true;
      }
    } catch (e) {
      hadError = true;
      runDetail.markets_error = e instanceof Error ? e.message : String(e);
    }

    // 5. Insert all cards.
    if (inserts.length > 0) {
      const { error: insErr, count } = await supabase
        .from('content_cards')
        .insert(inserts, { count: 'exact' });
      if (insErr) throw insErr;
      cardsCreated = count ?? inserts.length;
    }

    // 6. Log.
    await supabase.from('generation_log').insert({
      cards_created: cardsCreated,
      status: hadError ? 'partial' : 'success',
      error: hadError ? 'see detail' : null,
      detail: runDetail,
    });

    return NextResponse.json({
      ok: true,
      cardsCreated,
      status: hadError ? 'partial' : 'success',
      detail: runDetail,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await supabase.from('generation_log').insert({
      cards_created: cardsCreated,
      status: 'error',
      error: message,
      detail: runDetail,
    });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
