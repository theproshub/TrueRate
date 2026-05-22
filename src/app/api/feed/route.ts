import { NextResponse } from 'next/server';
import { feedPublicClient } from '@/lib/feed/db';
import type { CardType } from '@/lib/feed/schemas';

export const revalidate = 3600;

interface FeedCard {
  id: string;
  type: CardType;
  category: string | null;
  payload: unknown;
  priority: number;
  is_ai_generated: boolean;
  source_note: string | null;
  published_at: string | null;
}

export async function GET() {
  // RLS already restricts anon reads to published + unexpired, but we filter
  // explicitly too so the contract is clear and resilient to policy changes.
  const nowIso = new Date().toISOString();
  const { data, error } = await feedPublicClient()
    .from('content_cards')
    .select('id, type, category, payload, priority, is_ai_generated, source_note, published_at')
    .eq('status', 'published')
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order('priority', { ascending: false })
    .order('published_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const cards = (data ?? []) as FeedCard[];
  const grouped: Record<CardType, FeedCard[]> = {
    breaking: [],
    article: [],
    quote: [],
    big_stat: [],
    markets: [],
  };
  for (const card of cards) {
    (grouped[card.type] ??= []).push(card);
  }

  return NextResponse.json(
    { updatedAt: nowIso, count: cards.length, cards: grouped },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}
