/**
 * Exchange rate API client.
 *
 * USD/LRD anchor: Central Bank of Liberia (the authoritative source — see
 *                 ./cbl). The CBL only quotes USD/LRD.
 * Other pairs:    fawazahmed0 currency API (free, no key, jsDelivr CDN) gives
 *                 USD-base ratios for EUR/GBP/CNY/GHS/NGN, which we cross to LRD.
 *                 https://github.com/fawazahmed0/exchange-api
 * Fallback:       hardcoded seed rates (keeps the app functional if all sources
 *                 are down — flagged `stale` so callers can render a dash).
 */

import { fetchCblUsdLrd } from './cbl';

const CDN_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
const CDN_URL_FALLBACK = 'https://latest.currency-api.pages.dev/v1/currencies/usd.json';

export interface LiveRates {
  date: string;
  /** All values are "how many units of this currency per 1 USD" */
  rates: Record<string, number>;
  /**
   * True when no live source was reachable and these are hardcoded fallback
   * rates. Consumers that promise "no fabricated data" (e.g. the Markets page)
   * must check this and render a dash instead of the stale values.
   */
  stale?: boolean;
  /** Where the headline USD/LRD anchor came from this fetch. */
  lrdSource?: 'CBL' | 'CDN' | 'fallback';
}

/** Currencies TrueRate tracks (LRD-centric) */
export const TRACKED_CURRENCIES = ['lrd', 'eur', 'gbp', 'cny', 'ghs', 'ngn'] as const;
export type TrackedCurrency = (typeof TRACKED_CURRENCIES)[number];

/** Hardcoded fallback rates (1 USD = X) — updated manually from CBL data */
const FALLBACK_RATES: Record<string, number> = {
  lrd: 182.53, // CBL mid, Jun 2026 (buying 181.59 / selling 183.47)
  eur: 0.9201,
  gbp: 0.7921,
  cny: 7.2387,
  ghs: 15.84,
  ngn: 1605.30,
};

async function tryFetch(url: string): Promise<LiveRates | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // cache 1 hour
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000), // don't let a hung CDN stall the function
    });
    if (!res.ok) return null;
    const json = await res.json();
    // Shape: { date: "YYYY-MM-DD", usd: { lrd: 192.5, eur: 0.92, ... } }
    const rates: Record<string, number> = json?.usd ?? {};
    if (!rates.lrd) return null;
    return { date: json.date ?? new Date().toISOString().split('T')[0], rates };
  } catch {
    return null;
  }
}

/** Fetch USD-base rates from the CDN (first endpoint that answers). */
async function fetchCdnRates(): Promise<LiveRates | null> {
  return (await tryFetch(CDN_URL)) ?? (await tryFetch(CDN_URL_FALLBACK));
}

/**
 * Fetch live rates. The USD/LRD anchor comes from the Central Bank of Liberia;
 * other currencies' USD-base ratios come from the CDN. Each source is optional:
 * whichever is available is used, and only when nothing is reachable do we fall
 * back to hardcoded values (flagged `stale`).
 */
export async function fetchLiveRates(): Promise<LiveRates> {
  const [cdn, cbl] = await Promise.all([fetchCdnRates(), fetchCblUsdLrd()]);

  // Nothing live → hardcoded fallback, flagged so callers can render a dash.
  if (!cdn && !cbl) {
    return {
      date: new Date().toISOString().split('T')[0],
      rates: { ...FALLBACK_RATES },
      stale: true,
      lrdSource: 'fallback',
    };
  }

  // Other currencies' USD ratios come from the CDN (CBL quotes USD/LRD only).
  const rates: Record<string, number> = cdn ? { ...cdn.rates } : {};

  // Authoritative LRD anchor: CBL first, then the CDN's own lrd.
  let lrdSource: LiveRates['lrdSource'];
  if (cbl) {
    rates.lrd = cbl.mid;
    lrdSource = 'CBL';
  } else if (typeof rates.lrd === 'number' && Number.isFinite(rates.lrd)) {
    lrdSource = 'CDN';
  } else {
    delete rates.lrd; // no trustworthy anchor → consumers dash USD/LRD
  }

  return {
    date: cbl?.date ?? cdn?.date ?? new Date().toISOString().split('T')[0],
    rates,
    lrdSource,
  };
}

/**
 * Convert a USD-base rate table into LRD-denominated rates (how many LRD per
 * 1 X). Currencies without a finite source ratio are omitted, so callers can
 * render a dash rather than a fabricated cross-rate.
 */
export function toLRDRates(liveRates: LiveRates): Record<string, number> {
  const usdToLrd = liveRates.rates.lrd;
  const result: Record<string, number> = { LRD: 1 };
  if (typeof usdToLrd !== 'number' || !Number.isFinite(usdToLrd)) return result;

  for (const cur of TRACKED_CURRENCIES) {
    if (cur === 'lrd') {
      result['USD'] = usdToLrd;
    } else {
      const usdPerUnit = liveRates.rates[cur]; // e.g. EUR: 0.92 means 1 USD = 0.92 EUR
      // So 1 EUR = (1/0.92) USD = (1/0.92) * usdToLrd LRD
      if (typeof usdPerUnit === 'number' && Number.isFinite(usdPerUnit) && usdPerUnit !== 0) {
        result[cur.toUpperCase()] = (1 / usdPerUnit) * usdToLrd;
      }
    }
  }

  return result;
}
