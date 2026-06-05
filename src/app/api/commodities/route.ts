/**
 * GET /api/commodities
 *
 * Returns live commodity quotes (Stooq EOD) for client surfaces that can't
 * fetch server-side, e.g. the homepage ticker's Gold row.
 *
 * A symbol whose upstream feed is unavailable comes back with `price: null` —
 * callers must render a dash rather than substitute a stale value.
 *
 * Response shape: { date: string; commodities: CommodityQuote[] }
 */

import { NextResponse } from 'next/server';
import { fetchCommodities } from '@/lib/api/stooq';

// ISR: match the Stooq client's 15-minute cache.
export const revalidate = 900;

export async function GET() {
  try {
    const commodities = await fetchCommodities();
    return NextResponse.json(
      { date: new Date().toISOString(), commodities },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=300',
        },
      },
    );
  } catch (err) {
    console.error('[/api/commodities] fetch failed:', err);
    // Honest empty payload — callers show a dash, never fabricated prices.
    return NextResponse.json({ date: null, commodities: [] }, { status: 200 });
  }
}
