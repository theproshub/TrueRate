/**
 * Central Bank of Liberia — official USD/LRD exchange rate.
 *
 * The CBL is the authoritative source for the Liberian dollar. It publishes
 * daily buying & selling rates (USD only) as a server-rendered HTML table at
 * https://www.cbl.org.lr/research/buying-selling-rates — there is no API or
 * CSV, so we parse the most recent row.
 *
 * Markup (Drupal Views), newest row first:
 *   <td ... class="views-field views-field-field-buying-us">L$181.5886/US$1.00</td>
 *   <td ... class="views-field views-field-field-selling-us">L$183.4674/US$1.00</td>
 *   <time datetime="2026-06-04T12:00:00Z">…</time>
 *
 * Cross-rates for other currencies are derived from USD-base ratios elsewhere;
 * the CBL only quotes USD/LRD.
 */

import { publicClient } from '@/lib/supabase/public';

const CBL_URL = 'https://www.cbl.org.lr/research/buying-selling-rates';

export interface CblUsdLrd {
  /** ISO date the rate was posted, e.g. "2026-06-04". */
  date: string;
  /** L$ per US$1.00 — rate at which the bank buys USD. */
  buying: number;
  /** L$ per US$1.00 — rate at which the bank sells USD. */
  selling: number;
  /** Midpoint of buying & selling — the headline USD/LRD figure. */
  mid: number;
}

const BUYING_RE = /views-field-field-buying-us"[^>]*>\s*L\$([0-9]+(?:\.[0-9]+)?)/;
const SELLING_RE = /views-field-field-selling-us"[^>]*>\s*L\$([0-9]+(?:\.[0-9]+)?)/;
const DATE_RE = /<time[^>]*datetime="([^"]+)"/;

function firstNumber(re: RegExp, html: string): number | null {
  const m = re.exec(html);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

/**
 * Fetch the most recent CBL USD/LRD rate. Returns null on any failure (network,
 * non-200, markup change, or an implausible value) so callers can fall back or
 * render a dash rather than trust a bad parse.
 */
export async function fetchCblUsdLrd(): Promise<CblUsdLrd | null> {
  try {
    const res = await fetch(CBL_URL, {
      // CBL posts once per business day — pull at most ~once/day. The fragile
      // scrape lives behind Vercel's Data Cache, so a transient CBL outage or
      // markup hiccup is absorbed by the cached value, not re-hit per request.
      next: { revalidate: 86400 },
      headers: {
        Accept: 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; TrueRate/1.0; +https://truerateliberia.com)',
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const buying = firstNumber(BUYING_RE, html);
    const selling = firstNumber(SELLING_RE, html);
    if (buying === null || selling === null) return null;

    // Sanity guard against markup changes feeding garbage into the app.
    const plausible = (n: number) => n >= 50 && n <= 500;
    if (!plausible(buying) || !plausible(selling)) return null;

    const dateMatch = DATE_RE.exec(html);
    const date = dateMatch ? dateMatch[1].slice(0, 10) : new Date().toISOString().slice(0, 10);

    return {
      date,
      buying,
      selling,
      mid: Number(((buying + selling) / 2).toFixed(4)),
    };
  } catch {
    return null;
  }
}

/**
 * CBL rate from the `cbl_observations` table, populated nightly by the
 * sync-cbl cron from the CBL DataWarehousePro API. Uses the end-of-period
 * USD/LRD rate (mnemonic LBR_EXR_EPR_1) — monthly frequency, up to ~1 month
 * stale but authoritative official CBL data.
 *
 * Preferred over `quotes_daily` as a fallback because it is sourced directly
 * from the CBL's own statistical database rather than a secondary scrape.
 */
export async function fetchCblRateFromObservations(): Promise<{ date: string; mid: number } | null> {
  try {
    const { data: row } = await publicClient
      .from('cbl_observations')
      .select('period_date, value')
      .eq('mnemonic', 'LBR_EXR_EPR_1')
      .not('value', 'is', null)
      .neq('value', 0)
      .order('period_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    const mid = Number(row?.value);
    if (!row?.period_date || !Number.isFinite(mid) || mid < 50 || mid > 500) return null;
    return { date: String(row.period_date), mid };
  } catch {
    return null;
  }
}

/**
 * Last-known-good CBL rate: the most recent USD/LRD close we previously stored
 * in `quotes_daily` (written by the snapshot cron + the history backfill, both
 * sourced from the CBL). Used as an authoritative fallback when the live scrape
 * fails — a recent *official* rate beats a community aggregate or a constant.
 */
export async function fetchLastKnownCblUsdLrd(): Promise<{ date: string; mid: number } | null> {
  try {
    const { data: sym } = await publicClient
      .from('symbols')
      .select('id')
      .eq('ticker', 'USD/LRD')
      .limit(1)
      .maybeSingle();
    if (!sym?.id) return null;

    const { data: row } = await publicClient
      .from('quotes_daily')
      .select('date, close')
      .eq('symbol_id', sym.id)
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle();

    const mid = Number(row?.close);
    if (!row?.date || !Number.isFinite(mid)) return null;
    return { date: String(row.date), mid };
  } catch {
    return null;
  }
}

/**
 * Resolve the CBL USD/LRD rate with a three-tier fallback:
 *  1. Live HTML scrape  — daily, most current
 *  2. cbl_observations  — official CBL DataWarehousePro data, monthly cadence
 *  3. quotes_daily      — last snapshot we stored from a prior successful scrape
 *
 * `live` is true only for tier 1 — callers must not persist tier 2/3 results
 * as a fresh daily close.
 */
export async function resolveCblUsdLrd(): Promise<{ date: string; mid: number; live: boolean } | null> {
  const live = await fetchCblUsdLrd();
  if (live) return { date: live.date, mid: live.mid, live: true };

  const obs = await fetchCblRateFromObservations();
  if (obs) return { date: obs.date, mid: obs.mid, live: false };

  const cached = await fetchLastKnownCblUsdLrd();
  if (cached) return { date: cached.date, mid: cached.mid, live: false };

  return null;
}
