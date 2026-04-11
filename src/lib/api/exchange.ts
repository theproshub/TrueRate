/**
 * Exchange rate API client.
 * Primary:  fawazahmed0 currency API (free, no key, hosted on jsDelivr CDN)
 *           https://github.com/fawazahmed0/exchange-api
 * Fallback: hardcoded seed rates (keeps the app functional if CDN is down)
 */

const CDN_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
const CDN_URL_FALLBACK = 'https://latest.currency-api.pages.dev/v1/currencies/usd.json';

export interface LiveRates {
  date: string;
  /** All values are "how many units of this currency per 1 USD" */
  rates: Record<string, number>;
}

/** Currencies TrueRate tracks (LRD-centric) */
export const TRACKED_CURRENCIES = ['lrd', 'eur', 'gbp', 'cny', 'ghs', 'ngn'] as const;
export type TrackedCurrency = (typeof TRACKED_CURRENCIES)[number];

/** Hardcoded fallback rates (1 USD = X) — updated manually from CBL data */
const FALLBACK_RATES: Record<string, number> = {
  lrd: 192.50,
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

/** Fetch live USD-base rates; falls back gracefully to hardcoded values */
export async function fetchLiveRates(): Promise<LiveRates> {
  const primary = await tryFetch(CDN_URL);
  if (primary) return primary;

  const secondary = await tryFetch(CDN_URL_FALLBACK);
  if (secondary) return secondary;

  // Both CDN endpoints down — use hardcoded fallback
  return {
    date: new Date().toISOString().split('T')[0],
    rates: FALLBACK_RATES,
  };
}

/** Convert rate table into LRD-denominated rates (how many LRD per 1 X) */
export function toLRDRates(liveRates: LiveRates): Record<string, number> {
  const usdToLrd = liveRates.rates.lrd;
  const result: Record<string, number> = { LRD: 1 };

  for (const cur of TRACKED_CURRENCIES) {
    if (cur === 'lrd') {
      result['USD'] = usdToLrd;
    } else {
      const usdPerUnit = liveRates.rates[cur]; // e.g. EUR: 0.92 means 1 USD = 0.92 EUR
      // So 1 EUR = (1/0.92) USD = (1/0.92) * usdToLrd LRD
      result[cur.toUpperCase()] = (1 / usdPerUnit) * usdToLrd;
    }
  }

  return result;
}
