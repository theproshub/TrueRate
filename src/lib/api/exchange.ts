/**
 * Exchange rate API client — sources assigned per layer:
 *
 * USD/LRD anchor:  Central Bank of Liberia (authoritative — see ./cbl). CBL
 *                  only quotes USD/LRD.
 * ECB majors:      European Central Bank reference rates, fetched straight from
 *                  the ECB's own daily feed (no intermediary) for EUR, GBP, CNY.
 *                  Frankfurter (https://frankfurter.dev) republishes the same
 *                  ECB data and is kept only as a fallback if the ECB feed is
 *                  unreachable.
 * West African:    fawazahmed0 currency API (free, no key) for GHS, NGN, which
 *                  the ECB set does not cover. Also backstops the majors and
 *                  provides an alternate LRD if the CBL scrape fails.
 *                  https://github.com/fawazahmed0/exchange-api
 * Fallback:        hardcoded seed rates if no live LRD anchor is reachable
 *                  (flagged `stale` so callers can render a dash).
 *
 * All `rates` values follow the "units of currency per 1 USD" convention and
 * use lowercase keys (lrd, eur, gbp, cny, ghs, ngn).
 */

import { resolveCblUsdLrd } from './cbl';

const CDN_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
const CDN_URL_FALLBACK = 'https://latest.currency-api.pages.dev/v1/currencies/usd.json';

/** ECB's own daily reference-rate feed (EUR-base XML, official source). */
const ECB_URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

/** Frankfurter republishes ECB rates — fallback only if the ECB feed is down. */
const FRANKFURTER_URL = 'https://api.frankfurter.app/latest?base=USD&symbols=EUR,GBP,CNY';

/** Currencies sourced from the ECB (or Frankfurter fallback); rest come from the CDN. */
const ECB_CURRENCIES = ['eur', 'gbp', 'cny'] as const;

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
  /**
   * Where the headline USD/LRD anchor came from this fetch.
   *  - 'CBL'        live scrape today (fresh, persistable)
   *  - 'CBL-cache'  last official rate from quotes_daily (recent, NOT today)
   *  - 'CDN'        community aggregate (fawazahmed0)
   *  - 'fallback'   hardcoded constant
   */
  lrdSource?: 'CBL' | 'CBL-cache' | 'CDN' | 'fallback';
  /** Date of the CBL rate when lrdSource is 'CBL' or 'CBL-cache'. */
  lrdAsOf?: string;
}

/** Currencies TrueRate tracks (LRD-centric) */
export const TRACKED_CURRENCIES = ['lrd', 'eur', 'gbp', 'cny', 'ghs', 'ngn'] as const;
export type TrackedCurrency = (typeof TRACKED_CURRENCIES)[number];

/** Hardcoded fallback rates (1 USD = X) — refreshed manually from CBL + ECB. */
const FALLBACK_RATES: Record<string, number> = {
  lrd: 182.53,  // CBL mid, Jun 2026 (buying 181.59 / selling 183.47)
  eur: 0.8591,  // ECB, Jun 2026
  gbp: 0.7426,  // ECB, Jun 2026
  cny: 6.7656,  // ECB, Jun 2026
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
 * Fetch ECB reference rates straight from the ECB's own daily XML feed.
 *
 * The feed is EUR-base (`<Cube currency='USD' rate='1.1540'/>` = 1 EUR = 1.154
 * USD). We convert to this module's USD-base convention: units of X per 1 USD =
 * rate_X / rate_USD. Parsed with a regex — the feed is a fixed, flat format, so
 * no XML dependency is warranted.
 */
async function fetchEcbRates(): Promise<LiveRates | null> {
  try {
    const res = await fetch(ECB_URL, {
      next: { revalidate: 3600 }, // ECB publishes once per working day
      headers: { Accept: 'application/xml' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const xml = await res.text();

    // EUR-base rates from the <Cube currency='X' rate='Y'/> nodes (EUR itself = 1).
    const eurBase: Record<string, number> = { eur: 1 };
    const re = /currency=['"]([A-Za-z]{3})['"]\s+rate=['"]([\d.]+)['"]/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(xml)) !== null) {
      const v = Number(m[2]);
      if (Number.isFinite(v)) eurBase[m[1].toLowerCase()] = v;
    }

    const usdPerEur = eurBase.usd; // 1 EUR = usdPerEur USD
    if (!usdPerEur || !Number.isFinite(usdPerEur)) return null;

    const rates: Record<string, number> = {};
    for (const cur of ECB_CURRENCIES) {
      const eurRate = eurBase[cur]; // units of cur per 1 EUR (eur → 1)
      if (typeof eurRate === 'number' && Number.isFinite(eurRate)) {
        rates[cur] = eurRate / usdPerEur; // → units of cur per 1 USD
      }
    }
    if (Object.keys(rates).length === 0) return null;

    const date = xml.match(/time=['"](\d{4}-\d{2}-\d{2})['"]/)?.[1];
    return { date: date ?? new Date().toISOString().split('T')[0], rates };
  } catch {
    return null;
  }
}

/** Fetch ECB major-currency ratios (USD base) from Frankfurter (fallback feed). */
async function fetchFrankfurterRates(): Promise<LiveRates | null> {
  try {
    const res = await fetch(FRANKFURTER_URL, {
      next: { revalidate: 3600 }, // ECB publishes once per working day
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const raw: Record<string, unknown> = json?.rates ?? {};
    const rates: Record<string, number> = {};
    for (const [k, v] of Object.entries(raw)) {
      if (typeof v === 'number' && Number.isFinite(v)) rates[k.toLowerCase()] = v;
    }
    if (Object.keys(rates).length === 0) return null;
    return { date: json.date ?? new Date().toISOString().split('T')[0], rates };
  } catch {
    return null;
  }
}

/**
 * Fetch live rates by composing the sources:
 *   - CBL        → USD/LRD anchor (authoritative)
 *   - ECB        → EUR/GBP/CNY (official reference; Frankfurter as fallback)
 *   - CDN        → GHS/NGN (+ backstop for majors and an alternate LRD)
 *
 * LRD is the spine: without a live anchor, nothing LRD-denominated can be real,
 * so we fall back wholesale to hardcoded values (flagged `stale`) in that case.
 */
export async function fetchLiveRates(): Promise<LiveRates> {
  const [ecb, frank, cdn, cbl] = await Promise.all([
    fetchEcbRates(),
    fetchFrankfurterRates(), // fallback for the majors if the ECB feed is down
    fetchCdnRates(),
    resolveCblUsdLrd(), // live scrape, else last-known-good from quotes_daily
  ]);

  const cdnLrd =
    cdn && typeof cdn.rates.lrd === 'number' && Number.isFinite(cdn.rates.lrd)
      ? cdn.rates.lrd
      : undefined;
  const lrdAnchor = cbl?.mid ?? cdnLrd;

  // No LRD anchor at all → fall back wholesale so callers can dash everything.
  if (lrdAnchor === undefined) {
    return {
      date: new Date().toISOString().split('T')[0],
      rates: { ...FALLBACK_RATES },
      stale: true,
      lrdSource: 'fallback',
    };
  }

  // Base layer: the CDN's full set (eur, gbp, cny, ghs, ngn, lrd).
  const rates: Record<string, number> = cdn ? { ...cdn.rates } : {};

  // Authority layer: ECB majors (direct, else Frankfurter) override the CDN's
  // equivalents when available.
  const majors = ecb ?? frank;
  if (majors) {
    for (const cur of ECB_CURRENCIES) {
      const v = majors.rates[cur];
      if (typeof v === 'number' && Number.isFinite(v)) rates[cur] = v;
    }
  }

  // Anchor: CBL (live or cached), else the CDN's own lrd.
  rates.lrd = lrdAnchor;
  const lrdSource: LiveRates['lrdSource'] = cbl
    ? cbl.live
      ? 'CBL'
      : 'CBL-cache'
    : 'CDN';

  return {
    date: cbl?.date ?? ecb?.date ?? frank?.date ?? cdn?.date ?? new Date().toISOString().split('T')[0],
    rates,
    lrdSource,
    lrdAsOf: cbl?.date,
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
