/**
 * GET /api/rates
 *
 * Returns live LRD-denominated exchange rates.
 * Revalidates every hour — rates shift intraday.
 *
 * Response shape: { date: string; rates: NormalizedRate[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveRates, toLRDRates } from '@/lib/api/exchange';
import { exchangeRates } from '@/data/exchangeRates';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';

// ISR: revalidate hourly
export const revalidate = 3600;

export interface NormalizedRate {
  pair: string;
  from: string;
  to: string;
  rate: number;
  change: number;
  changePercent: number;
  high52w: number;
  low52w: number;
}

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
    const lrdRates = toLRDRates(live);

    // Merge live rates onto the existing exchange rate records
    // (preserves 52W high/low and change data from our seed file)
    const rates: NormalizedRate[] = exchangeRates.map(r => {
      const liveRate = lrdRates[r.from];
      const rate = liveRate ?? r.rate; // fallback to seed if API missing
      return {
        pair: r.pair,
        from: r.from,
        to: r.to,
        rate: Number(rate.toFixed(4)),
        change: r.change,
        changePercent: r.changePercent,
        high52w: r.high52w,
        low52w: r.low52w,
      };
    });

    // Also expose the raw lookup map for the converter
    const lookup: Record<string, number> = { LRD: 1 };
    for (const r of rates) {
      lookup[r.from] = r.rate;
    }

    return NextResponse.json(
      // Don't advertise a current date when these are stale fallback rates.
      { date: live.stale ? null : live.date, rates, lookup },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
        },
      }
    );
  } catch (err) {
    console.error('[/api/rates] fetch failed:', err);

    // Full fallback: return seed data so the page stays functional
    const rates: NormalizedRate[] = exchangeRates.map(r => ({
      pair: r.pair,
      from: r.from,
      to: r.to,
      rate: r.rate,
      change: r.change,
      changePercent: r.changePercent,
      high52w: r.high52w,
      low52w: r.low52w,
    }));

    const lookup: Record<string, number> = { LRD: 1 };
    for (const r of rates) lookup[r.from] = r.rate;

    return NextResponse.json(
      { date: null, rates, lookup },
      { status: 200 } // still 200 so the UI renders
    );
  }
}
