/**
 * MCP-aligned data layer for the Trends & Analytics page.
 *
 * Queries the SAME Supabase tables the TrueRate MCP server uses:
 *   - cbl_series / cbl_observations  → all CBL statistical series
 *   - content_cards                  → live market tickers (S&P, Gold, BTC…)
 *
 * Replaces the old symbols/quotes_daily/macro_series/macro_values loaders.
 * NEVER fabricates data — empty series yield an honest empty state.
 */

import { createClient } from '@supabase/supabase-js';
import type { AnalyticsItem, AnalyticsPayload, SeriesPoint } from './types';

// ---------------------------------------------------------------------------
// Supabase client (service-role for server-side ISR)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// CBL series catalog — every series the terminal surfaces
// ---------------------------------------------------------------------------

export interface CblSeriesConfig {
  mnemonic: string;
  label: string;
  name: string;
  format: AnalyticsItem['format'];
  unit: string;
  /** Multiply raw DB values by this to get display units. */
  scale: number;
  section: 'currency' | 'prices' | 'monetary' | 'fiscal' | 'trade' | 'national';
}

export const CBL_CATALOG: CblSeriesConfig[] = [
  // Currency
  { mnemonic: 'LBR_EXR_EPR_1', label: 'USD/LRD',            name: 'Market Rate End of Period',             format: 'rate',  unit: 'LRD per USD',   scale: 1,   section: 'currency' },
  { mnemonic: 'LBR_EXR_PAR_1', label: 'USD/LRD (avg)',      name: 'Market Rate Period Average',            format: 'rate',  unit: 'LRD per USD',   scale: 1,   section: 'currency' },

  // Prices
  { mnemonic: 'LBR_CPI_0',     label: 'CPI',                name: 'Harmonized Consumer Price Index',       format: 'plain', unit: 'Index (2005=100)', scale: 1, section: 'prices' },

  // Monetary
  { mnemonic: 'LBR_MON_DC_4',  label: 'Broad Money (M2)',   name: 'Broad Money',                           format: 'plain', unit: 'M LRD',         scale: 1,   section: 'monetary' },
  { mnemonic: 'LBR_MON_6',     label: 'Reserve Money',      name: 'Monetary Base (Reserve Money)',         format: 'plain', unit: 'M LRD',         scale: 1,   section: 'monetary' },

  // Fiscal
  { mnemonic: 'LBR_FIS_DEBT_1', label: 'Govt Debt',         name: 'Total Government Debt',                 format: 'usd',  unit: 'Million USD',   scale: 1e6, section: 'fiscal' },
  { mnemonic: 'LBR_FIS_BUD_1',  label: 'Govt Revenue',      name: 'Total Revenue',                         format: 'usd',  unit: 'Million USD',   scale: 1e6, section: 'fiscal' },
  { mnemonic: 'LBR_FIS_BUD_2',  label: 'Govt Expenditure',  name: 'Total Expenditure',                     format: 'usd',  unit: 'Million USD',   scale: 1e6, section: 'fiscal' },

  // Trade
  { mnemonic: 'LBR_BOP_1_4',   label: 'Trade Balance',      name: 'Goods (Trade Balance)',                 format: 'usd',  unit: 'Million USD',   scale: 1e6, section: 'trade' },

  // National Accounts
  { mnemonic: 'LBR_NAT_0',     label: 'GDP (nominal)',      name: 'Gross Domestic Product, market prices', format: 'usd',  unit: 'Millions USD',  scale: 1e6, section: 'national' },
];

const MNEMONIC_SET = new Set(CBL_CATALOG.map((c) => c.mnemonic));

// ---------------------------------------------------------------------------
// Content-cards ticker type (from content_cards table)
// ---------------------------------------------------------------------------

interface ContentCardTicker {
  name: string;
  symbol: string;
  price: number;
  change: number | null;
  changePct: number | null;
  sparkline: number[];
  assetClass: string;
}

export interface MarketTicker {
  symbol: string;
  name: string;
  price: number;
  change: number | null;
  changePct: number | null;
  sparkline: number[];
  assetClass: string;
}

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------

/** Frequency code → AnalyticsItem frequency */
function toFrequency(code: string | null): AnalyticsItem['frequency'] {
  switch (code) {
    case 'M': return 'monthly';
    case 'Q': return 'monthly'; // quarterly treated as monthly for UI
    case 'A': return 'annual';
    case 'D': return 'daily';
    default:  return 'monthly';
  }
}

/** Source label from the cbl_series.data_source field, with a sane fallback. */
function sourceLabel(dataSource: string | null): string {
  if (dataSource && dataSource.trim()) return dataSource;
  return 'Central Bank of Liberia';
}

async function loadCblItems(): Promise<AnalyticsItem[]> {
  if (!HAS_DB_CREDS) return [];
  const sb = db();
  const mnemonics = CBL_CATALOG.map((c) => c.mnemonic);

  // Fetch series metadata + observations in parallel
  const [metaRes, obsRes] = await Promise.all([
    sb.from('cbl_series')
      .select('mnemonic, frequency, data_source')
      .in('mnemonic', mnemonics),
    sb.from('cbl_observations')
      .select('mnemonic, period_date, value')
      .in('mnemonic', mnemonics)
      .not('value', 'is', null)
      .order('period_date', { ascending: true }),
  ]);

  const metaByMnemonic = new Map<string, { frequency: string | null; data_source: string | null }>();
  for (const row of (metaRes.data ?? []) as { mnemonic: string; frequency: string | null; data_source: string | null }[]) {
    metaByMnemonic.set(row.mnemonic, row);
  }

  // Group observations by mnemonic
  const histByMnemonic = new Map<string, SeriesPoint[]>();
  for (const row of (obsRes.data ?? []) as { mnemonic: string; period_date: string; value: number }[]) {
    if (!MNEMONIC_SET.has(row.mnemonic)) continue;
    const cfg = CBL_CATALOG.find((c) => c.mnemonic === row.mnemonic)!;
    const arr = histByMnemonic.get(row.mnemonic) ?? [];
    arr.push({ date: row.period_date, value: row.value * cfg.scale });
    histByMnemonic.set(row.mnemonic, arr);
  }

  const items: AnalyticsItem[] = [];
  for (const cfg of CBL_CATALOG) {
    const hist = histByMnemonic.get(cfg.mnemonic) ?? [];
    if (hist.length === 0) continue;
    const meta = metaByMnemonic.get(cfg.mnemonic);

    items.push({
      id: cfg.mnemonic,
      label: cfg.label,
      name: cfg.name,
      assetClass: 'macro',
      region: 'LR',
      unit: cfg.unit,
      format: cfg.format,
      source: sourceLabel(meta?.data_source ?? null),
      current: hist[hist.length - 1].value,
      series: hist,
      frequency: toFrequency(meta?.frequency ?? null),
      buildingHistory: hist.length < 2,
    });
  }

  return items;
}

/** Load the latest market tickers from content_cards. */
async function loadMarketTickers(): Promise<MarketTicker[]> {
  if (!HAS_DB_CREDS) return [];
  const sb = db();

  const { data } = await sb
    .from('content_cards')
    .select('payload')
    .eq('type', 'markets')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  if (!data?.payload?.tickers) return [];

  return (data.payload.tickers as ContentCardTicker[]).map((t) => ({
    symbol: t.symbol,
    name: t.name,
    price: t.price,
    change: t.change,
    changePct: t.changePct,
    sparkline: t.sparkline ?? [],
    assetClass: t.assetClass,
  }));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getMcpAnalyticsPayload(): Promise<AnalyticsPayload & { tickers: MarketTicker[] }> {
  const [cblItems, tickers] = await Promise.all([loadCblItems(), loadMarketTickers()]);

  // Split by section for convenience
  const fx = cblItems.filter((i) => i.id.startsWith('LBR_EXR'));
  const macro = cblItems.filter((i) => !i.id.startsWith('LBR_EXR'));

  return {
    updatedAt: new Date().toISOString(),
    items: cblItems,
    fx,
    commodities: [], // commodities now come via tickers
    macro,
    priceHistoryReady: cblItems.some((i) => !i.buildingHistory),
    tickers,
  };
}
