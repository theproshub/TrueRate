/**
 * GET /api/rates
 *
 * Returns live LRD-denominated exchange rates.
 * Revalidates every hour — rates shift intraday.
 *
 * Response shape: { date: string; rates: NormalizedRate[] }
 */

import { NextResponse } from 'next/server';
import { fetchLiveRates, toLRDRates } from '@/lib/api/exchange';
import { exchangeRates } from '@/data/exchangeRates';

// ISR: revalidate hourly
export const revalidate = 3600;

export interface NormalizedRate {
  pair: string;       // e.g. "USD/LRD"
  from: string;       // e.g. "USD"
  to: string;         // "LRD"
  rate: number;       // how many LRD per 1 unit of `from`
  change: number;
  changePercent: number;
  high52w: number;
  low52w: number;
}

export async function GET() {
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
      { date: live.date, rates, lookup },
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
