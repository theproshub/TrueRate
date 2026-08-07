// End-of-day quote snapshot — shared job logic.
//
// Runs from the Vercel route and the droplet runner. No `next/*` imports:
// cache invalidation belongs to the caller.
//
// Persists ONE real end-of-day close per tracked symbol into `quotes_daily`,
// building the price/FX time-series forward over time (quotes_daily started
// empty — there is no historical bulk source for Liberian FX, and no free bulk
// history endpoint for commodities, so we accumulate honest daily snapshots).
//
// NEVER fabricates: a symbol whose live source fails is simply skipped this run.
// Upsert on (symbol_id, date) makes re-runs within a day idempotent.

import { createAdminClient } from '@/lib/supabase/admin';
import { fetchLiveRates, toLRDRates } from '@/domain/markets/exchange';
import { fetchCommodities } from '@/domain/markets/commodities';
import { FX_SYMBOLS, COMMODITY_SYMBOLS } from '@/lib/analytics/catalog';

interface QuoteRow {
  symbol_id: string;
  date: string;
  close: number;
  open: number | null;
  high: number | null;
  low: number | null;
}

export interface SnapshotQuotesResult {
  /** False when no live source produced a single usable quote this run. */
  ok: boolean;
  rows_written: number;
  date: string;
  detail: Record<string, unknown>;
}

/** Cache tags to invalidate after a successful run — see /api/revalidate. */
export const SNAPSHOT_QUOTES_REVALIDATE_TAGS = ['rates', 'commodities'] as const;

/**
 * Throws on infrastructure failure (symbol lookup, upsert). Returns
 * `ok: false` when the run completed but every live feed was unusable — the
 * caller decides whether that warrants an alert.
 */
export async function snapshotQuotes(
  onProgress: (message: string) => void = () => {},
): Promise<SnapshotQuotesResult> {
  const db = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);
  const detail: Record<string, unknown> = {};

  // Map tickers → symbol UUIDs.
  const { data: symbols, error: symErr } = await db.from('symbols').select('id, ticker');
  if (symErr) throw symErr;
  const idByTicker = new Map((symbols ?? []).map((s) => [s.ticker, s.id]));

  const rows: QuoteRow[] = [];

  // ── FX: live USD-base rates → LRD cross-rates ──
  try {
    const live = await fetchLiveRates();
    if (live.stale) {
      // Both FX feeds down — never persist hardcoded fallback rates as a
      // real end-of-day close. Skip FX entirely this run.
      throw new Error('FX feed unavailable (stale fallback) — skipped');
    }
    const lrd = toLRDRates(live); // { USD: <LRD per USD>, EUR: ..., ... }
    let fxCount = 0;
    for (const sym of FX_SYMBOLS) {
      const base = sym.sourceKey.toUpperCase(); // 'usd' → 'USD'
      // The USD/LRD series is the official CBL record — only persist it when
      // freshly scraped today. A cached ('CBL-cache') or CDN anchor must not
      // be written as a new official close.
      if (base === 'USD' && live.lrdSource !== 'CBL') continue;
      const value = lrd[base];
      const id = idByTicker.get(sym.ticker);
      if (id && typeof value === 'number' && Number.isFinite(value)) {
        rows.push({ symbol_id: id, date: today, close: Number(value.toFixed(4)), open: null, high: null, low: null });
        fxCount++;
      }
    }
    detail.fx = fxCount;
    onProgress(`fx: ${fxCount} quotes`);
  } catch (e) {
    detail.fx_error = e instanceof Error ? e.message : String(e);
    onProgress(`fx FAILED: ${detail.fx_error}`);
  }

  // ── Commodities: live Yahoo Finance snapshot ──
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
          // q.prevClose is the *previous* session's close, not today's open —
          // don't mislabel it in the open column.
          open: null,
          high: null,
          low: null,
        });
        cCount++;
      }
    }
    detail.commodities = cCount;
    onProgress(`commodities: ${cCount} quotes`);
  } catch (e) {
    detail.commodities_error = e instanceof Error ? e.message : String(e);
    onProgress(`commodities FAILED: ${detail.commodities_error}`);
  }

  if (rows.length === 0) {
    return { ok: false, rows_written: 0, date: today, detail };
  }

  // Upsert so re-running within a day overwrites, never duplicates.
  const { error: upErr, count } = await db
    .from('quotes_daily')
    .upsert(rows, { onConflict: 'symbol_id,date', count: 'exact' });
  if (upErr) throw upErr;

  return { ok: true, rows_written: count ?? rows.length, date: today, detail };
}
