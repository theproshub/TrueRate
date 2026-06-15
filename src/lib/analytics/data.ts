import { createClient } from '@supabase/supabase-js';
import { fetchLiveRates, toLRDRates } from '@/lib/api/exchange';
import { fetchCommodities } from '@/lib/api/yahoo';
import {
  ALL_SYMBOLS,
  FX_SYMBOLS,
  COMMODITY_SYMBOLS,
  regionForTicker,
  regionForMacro,
} from './catalog';
import type { AnalyticsItem, AnalyticsPayload, SeriesPoint } from './types';

/**
 * Batched server-side data layer for the Trends & Analytics page.
 *
 * One pass assembles everything the page needs — no client waterfalls:
 *   - price history (FX + commodities) from quotes_daily  (real, accruing daily)
 *   - macro history                     from macro_values (real, World Bank)
 *   - live spot                         from /lib/api (exchange + Yahoo)
 *
 * NEVER fabricates. A symbol/series with no stored history yields an empty
 * `series` and `buildingHistory: true`; the UI renders an honest empty state.
 */

/**
 * True only when both Supabase creds are present. They are absent during the
 * production *build* (the service-role key isn't injected at prerender time),
 * so the DB-backed loaders fail soft to an empty payload there and ISR fills
 * in the real data on the first runtime revalidation. If this is ever false at
 * runtime, the page renders its honest empty state instead of crashing.
 */
const HAS_DB_CREDS = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
);

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/** Macro series we surface, with display formatting. All Liberia → region LR. */
const MACRO_DISPLAY: Record<string, { label: string; format: AnalyticsItem['format'] }> = {
  'WB.NY.GDP.MKTP.KD.ZG': { label: 'GDP Growth', format: 'pct' },
  'WB.FP.CPI.TOTL.ZG':    { label: 'Inflation (CPI)', format: 'pct' },
  'WB.NY.GDP.MKTP.CD':    { label: 'GDP', format: 'usd' },
  'WB.NY.GDP.PCAP.CD':    { label: 'GDP per capita', format: 'usd' },
  'WB.SL.UEM.TOTL.ZS':    { label: 'Unemployment', format: 'pct' },
  'WB.SL.TLF.CACT.ZS':    { label: 'Labor Force Participation', format: 'pct' },
  'WB.DT.DOD.DECT.CD':    { label: 'External Debt', format: 'usd' },
  'WB.BX.KLT.DINV.CD.WD': { label: 'FDI (net)', format: 'usd' },
  'WB.BN.CAB.XOKA.CD':    { label: 'Current Account', format: 'usd' },
  'WB.BX.GSR.GNFS.CD':    { label: 'Exports', format: 'usd' },
  'WB.BM.GSR.GNFS.CD':    { label: 'Imports', format: 'usd' },
  'WB.SP.POP.TOTL':       { label: 'Population', format: 'people' },
};

interface SymbolRow { id: string; ticker: string; name: string; asset_class: string; unit: string | null }
interface QuoteRow { symbol_id: string; date: string; close: number | null }
interface MacroSeriesRow { id: string; series_id: string; label: string; unit: string | null; source: string }
interface MacroValueRow { series_id: string; date: string; value: number }

function asc(points: SeriesPoint[]): SeriesPoint[] {
  return [...points].sort((a, b) => a.date.localeCompare(b.date));
}

/** Canonical source label per FX pair — honest provenance, not a blanket feed. */
function fxSourceLabel(ticker: string): string {
  if (ticker === 'USD/LRD') return 'Central Bank of Liberia';
  if (ticker === 'EUR/LRD' || ticker === 'GBP/LRD' || ticker === 'CNY/LRD') return 'European Central Bank';
  return 'Open currency-rate feed'; // GHS/NGN
}

async function loadPriceItems(): Promise<AnalyticsItem[]> {
  if (!HAS_DB_CREDS) return [];
  const sb = db();

  const { data: symbols } = await sb
    .from('symbols')
    .select('id, ticker, name, asset_class, unit')
    .in('asset_class', ['fx', 'commodity']);
  const symRows = (symbols ?? []) as SymbolRow[];
  if (symRows.length === 0) return [];

  const idByTicker = new Map(symRows.map((s) => [s.ticker, s.id]));
  const symById = new Map(symRows.map((s) => [s.id, s]));

  // All stored history for these symbols, ascending.
  const { data: quotes } = await sb
    .from('quotes_daily')
    .select('symbol_id, date, close')
    .in('symbol_id', symRows.map((s) => s.id))
    .order('date', { ascending: true });
  const historyBySymbol = new Map<string, SeriesPoint[]>();
  for (const q of (quotes ?? []) as QuoteRow[]) {
    if (q.close == null) continue;
    const arr = historyBySymbol.get(q.symbol_id) ?? [];
    arr.push({ date: q.date, value: q.close });
    historyBySymbol.set(q.symbol_id, arr);
  }

  // Live spot overlay (today), merged onto stored history.
  const liveSpot = new Map<string, number>(); // ticker → value
  const [ratesRes, commsRes] = await Promise.allSettled([fetchLiveRates(), fetchCommodities()]);
  if (ratesRes.status === 'fulfilled' && !ratesRes.value.stale) {
    const lrd = toLRDRates(ratesRes.value);
    for (const s of FX_SYMBOLS) {
      const v = lrd[s.sourceKey.toUpperCase()];
      if (typeof v === 'number' && Number.isFinite(v)) liveSpot.set(s.ticker, Number(v.toFixed(4)));
    }
  }
  if (commsRes.status === 'fulfilled') {
    const bySym = new Map(commsRes.value.map((c) => [c.symbol, c]));
    for (const s of COMMODITY_SYMBOLS) {
      const q = bySym.get(s.sourceKey);
      if (q && typeof q.price === 'number' && Number.isFinite(q.price)) liveSpot.set(s.ticker, Number(q.price.toFixed(4)));
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return ALL_SYMBOLS.map((cat) => {
    const id = idByTicker.get(cat.ticker);
    const sym = id ? symById.get(id) : undefined;
    const stored = id ? asc(historyBySymbol.get(id) ?? []) : [];

    // Merge live spot as today's point (overwrite if same date).
    const series = [...stored];
    const live = liveSpot.get(cat.ticker);
    if (live != null) {
      if (series.length && series[series.length - 1].date === today) {
        series[series.length - 1] = { date: today, value: live };
      } else {
        series.push({ date: today, value: live });
      }
    }

    const current = live ?? (stored.length ? stored[stored.length - 1].value : null);

    // FX: the pair (USD/LRD) is the recognizable label. Commodities: lead with
    // the friendly name (Gold), not the ticker (gc.f).
    const label = cat.assetClass === 'fx' ? cat.ticker : (sym?.name ?? cat.name);

    return {
      id: cat.ticker,
      label,
      name: sym?.name ?? cat.name,
      assetClass: cat.assetClass,
      region: regionForTicker(cat.ticker),
      unit: sym?.unit ?? cat.unit,
      format: cat.assetClass === 'fx' ? 'rate' : 'price',
      source: cat.assetClass === 'fx' ? fxSourceLabel(cat.ticker) : 'Yahoo Finance',
      current,
      series,
      frequency: 'daily',
      buildingHistory: stored.length < 2,
    } satisfies AnalyticsItem;
  });
}

async function loadMacroItems(): Promise<AnalyticsItem[]> {
  if (!HAS_DB_CREDS) return [];
  const sb = db();
  const wanted = Object.keys(MACRO_DISPLAY);

  const { data: series } = await sb
    .from('macro_series')
    .select('id, series_id, label, unit, source')
    .in('series_id', wanted);
  const seriesRows = (series ?? []) as MacroSeriesRow[];
  if (seriesRows.length === 0) return [];

  const { data: values } = await sb
    .from('macro_values')
    .select('series_id, date, value')
    .in('series_id', seriesRows.map((s) => s.id))
    .order('date', { ascending: true });

  const historyByDbId = new Map<string, SeriesPoint[]>();
  for (const v of (values ?? []) as MacroValueRow[]) {
    const arr = historyByDbId.get(v.series_id) ?? [];
    arr.push({ date: v.date, value: v.value });
    historyByDbId.set(v.series_id, arr);
  }

  const items: AnalyticsItem[] = [];
  for (const row of seriesRows) {
    const disp = MACRO_DISPLAY[row.series_id];
    const hist = asc(historyByDbId.get(row.id) ?? []);
    if (hist.length === 0) continue; // honest: skip empty series
    items.push({
      id: row.series_id,
      label: disp.label,
      name: row.label,
      assetClass: 'macro',
      region: regionForMacro(),
      unit: row.unit ?? '',
      format: disp.format,
      source: row.source,
      current: hist[hist.length - 1].value,
      series: hist,
      frequency: 'annual',
      buildingHistory: false,
    });
  }
  // Preserve the order we declared in MACRO_DISPLAY.
  const order = Object.keys(MACRO_DISPLAY);
  items.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  return items;
}

/** Assemble the full batched payload for the Trends page. */
export async function getAnalyticsPayload(): Promise<AnalyticsPayload> {
  const [prices, macro] = await Promise.all([loadPriceItems(), loadMacroItems()]);

  const fx = prices.filter((p) => p.assetClass === 'fx');
  const commodities = prices.filter((p) => p.assetClass === 'commodity');
  const items = [...prices, ...macro];

  // priceHistoryReady = at least one price series has ≥2 stored points.
  const priceHistoryReady = prices.some((p) => !p.buildingHistory);

  return {
    updatedAt: new Date().toISOString(),
    items,
    fx,
    commodities,
    macro,
    priceHistoryReady,
  };
}
