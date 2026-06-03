import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchLiveRates, toLRDRates } from '@/lib/api/exchange';
import { fetchCommodities } from '@/lib/api/stooq';
import { FX_SYMBOLS, COMMODITY_SYMBOLS } from '@/lib/analytics/catalog';

/**
 * GET /api/cron/snapshot-quotes
 *
 * Persists ONE real end-of-day close per tracked symbol into `quotes_daily`,
 * building the price/FX time-series forward over time (quotes_daily started
 * empty — there is no historical bulk source for Liberian FX, and Stooq's bulk
 * history endpoint is IP-blocked, so we accumulate honest daily snapshots).
 *
 * NEVER fabricates: a symbol whose live source fails is simply skipped this run.
 * Upsert on (symbol_id, date) makes re-runs within a day idempotent.
 *
 * Auth: Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

interface QuoteRow {
  symbol_id: string;
  date: string;
  close: number;
  open: number | null;
  high: number | null;
  low: number | null;
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = adminClient();
  const today = new Date().toISOString().slice(0, 10);
  const detail: Record<string, unknown> = {};

  try {
    // Map tickers → symbol UUIDs.
    const { data: symbols, error: symErr } = await db
      .from('symbols')
      .select('id, ticker');
    if (symErr) throw symErr;
    const idByTicker = new Map((symbols ?? []).map((s) => [s.ticker, s.id]));

    const rows: QuoteRow[] = [];

    // ── FX: live USD-base rates → LRD cross-rates ──
    try {
      const live = await fetchLiveRates();
      const lrd = toLRDRates(live); // { USD: <LRD per USD>, EUR: ..., ... }
      let fxCount = 0;
      for (const sym of FX_SYMBOLS) {
        const base = sym.sourceKey.toUpperCase(); // 'usd' → 'USD'
        const value = lrd[base];
        const id = idByTicker.get(sym.ticker);
        if (id && typeof value === 'number' && Number.isFinite(value)) {
          rows.push({ symbol_id: id, date: today, close: Number(value.toFixed(4)), open: null, high: null, low: null });
          fxCount++;
        }
      }
      detail.fx = fxCount;
    } catch (e) {
      detail.fx_error = e instanceof Error ? e.message : String(e);
    }

    // ── Commodities: live Stooq snapshot ──
    try {
      const commodities = await fetchCommodities();
      const bySymbol = new Map(commodities.map((c) => [c.symbol, c]));
      let cCount = 0;
      for (const sym of COMMODITY_SYMBOLS) {
        const q = bySymbol.get(sym.sourceKey);
        const id = idByTicker.get(sym.ticker);
        if (id && q && typeof q.price === 'number' && Number.isFinite(q.price)) {
          rows.push({
            symbol_id: id,
            date: today,
            close: Number(q.price.toFixed(4)),
            open: q.prevClose ?? null,
            high: null,
            low: null,
          });
          cCount++;
        }
      }
      detail.commodities = cCount;
    } catch (e) {
      detail.commodities_error = e instanceof Error ? e.message : String(e);
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'no live quotes available this run', detail },
        { status: 200 },
      );
    }

    // Upsert so re-running within a day overwrites, never duplicates.
    const { error: upErr, count } = await db
      .from('quotes_daily')
      .upsert(rows, { onConflict: 'symbol_id,date', count: 'exact' });
    if (upErr) throw upErr;

    return NextResponse.json({ ok: true, rowsWritten: count ?? rows.length, date: today, detail });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message, detail }, { status: 500 });
  }
}
