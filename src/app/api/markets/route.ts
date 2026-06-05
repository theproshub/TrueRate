/**
 * GET /api/markets
 *
 * Live cross-asset markets snapshot for the homepage feed: the CBL USD/LRD
 * anchor plus global indices, commodities, and crypto (Yahoo chart API), each
 * with a 7-point sparkline. Assembled by buildMarketsSnapshot — never
 * fabricated; a ticker whose source fails is simply omitted.
 *
 * Response shape: { updatedAt: string | null; tickers: MarketsTicker[] }
 */

import { NextResponse } from 'next/server';
import { buildMarketsSnapshot } from '@/lib/feed/markets';

// ISR: refresh the server snapshot every 5 minutes; clients poll on top.
export const revalidate = 300;

export async function GET() {
  try {
    const tickers = await buildMarketsSnapshot();
    return NextResponse.json(
      { updatedAt: new Date().toISOString(), tickers },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=120',
        },
      },
    );
  } catch (err) {
    console.error('[/api/markets] snapshot failed:', err);
    // Honest empty payload — the widget hides rather than show stale prices.
    return NextResponse.json({ updatedAt: null, tickers: [] }, { status: 200 });
  }
}
