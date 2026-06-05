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
      next: { revalidate: 3600 }, // CBL posts once per business day
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
