/**
 * GET /api/rates
 *
 * Returns live LRD-denominated exchange rates.
 * Returns an empty array when no live source is reachable — no stale seed fallback.
 *
 * Response shape: { date: string | null; rates: NormalizedRate[]; lookup: Record<string, number> }
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveRates, toLRDRates } from '@/lib/api/exchange';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';

export const revalidate = 900; // 15 min — consistent with indicators/analytics

export interface NormalizedRate {
  pair: string;
  from: string;
  to: string;
  rate: number;
  change: number;
  changePercent: number;
}

const PAIR_ORDER = ['USD', 'EUR', 'GBP', 'CNY', 'GHS', 'NGN'] as const;

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const { allowed, remaining } = rateLimit(`api-rates:${ip}`, 60, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: rateLimitHeaders(remaining, 60, 60_000) },
    );
  }

  try {
    const live = await fetchLiveRates();

    if (live.stale) {
      return NextResponse.json(
        { date: null, rates: [], lookup: {} },
        { status: 200 },
      );
    }

    const lrdRates = toLRDRates(live);

    const rates: NormalizedRate[] = PAIR_ORDER
      .filter((from) => typeof lrdRates[from] === 'number' && Number.isFinite(lrdRates[from]))
      .map((from) => ({
        pair: `${from}/LRD`,
        from,
        to: 'LRD',
        rate: Number(lrdRates[from].toFixed(4)),
        change: 0,
        changePercent: 0,
      }));

    const lookup: Record<string, number> = { LRD: 1 };
    for (const r of rates) lookup[r.from] = r.rate;

    return NextResponse.json(
      { date: live.date, rates, lookup },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=300',
        },
      },
    );
  } catch (err) {
    console.error('[/api/rates] fetch failed:', err);
    return NextResponse.json(
      { date: null, rates: [], lookup: {} },
      { status: 200 },
    );
  }
}
