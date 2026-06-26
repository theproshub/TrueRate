import { publicClient } from '@/lib/supabase/public';
import type { NormalizedIndicator } from '@/lib/types/indicators';
import { getCblPolicyRate } from '@/lib/data/cbl-rate';
import { getCpiData, getGdpData, getFiscalData, getTradeData, getPolicyRateData } from '@/lib/data/cbl-observations';

async function cblPolicyRateIndicator(): Promise<NormalizedIndicator> {
  const rate = await getCblPolicyRate();
  const policyData = await getPolicyRateData(12);
  const change = Number((rate.value - rate.previousValue).toFixed(4));
  return {
    key: 'CBL_RATE',
    name: 'CBL Policy Rate',
    value: rate.value,
    previousValue: rate.previousValue,
    change,
    changePercent:
      rate.previousValue !== 0
        ? Number(((change / rate.previousValue) * 100).toFixed(4))
        : null,
    unit: '%',
    period: rate.period,
    source: 'Central Bank of Liberia',
    history: (policyData?.points ?? []).map(p => ({ date: p.date, value: p.value })),
  };
}

async function cblInflationIndicator(): Promise<NormalizedIndicator | null> {
  const cpi = await getCpiData(36);
  if (!cpi.latest || cpi.yoy === null) return null;

  const prevObs = cpi.points.length >= 2 ? cpi.points[cpi.points.length - 2] : null;
  let prevYoy: number | null = null;
  if (prevObs && cpi.points.length >= 14) {
    const yearAgoPrev = cpi.points[cpi.points.length - 14];
    if (yearAgoPrev) {
      prevYoy = Number((((prevObs.value - yearAgoPrev.value) / yearAgoPrev.value) * 100).toFixed(2));
    }
  }

  const change = prevYoy !== null ? fmt(cpi.yoy - prevYoy) : null;
  return {
    key: 'INFLATION',
    name: 'Inflation Rate',
    value: cpi.yoy,
    previousValue: prevYoy,
    change,
    changePercent:
      prevYoy !== null && prevYoy !== 0
        ? fmt((change! / Math.abs(prevYoy)) * 100)
        : null,
    unit: '%',
    period: cpi.period ?? '',
    source: 'Central Bank of Liberia',
    history: [],
  };
}

async function cblGdpIndicator(): Promise<NormalizedIndicator | null> {
  const gdp = await getGdpData(15);
  if (!gdp.nominal.latest) return null;

  const points = gdp.nominal.points;
  const latest = points[points.length - 1];
  const prev = points.length >= 2 ? points[points.length - 2] : null;

  const scale = 1e-6;
  const value = fmt(latest.value * scale);
  const previousValue = prev ? fmt(prev.value * scale) : null;
  const change = previousValue !== null ? fmt(value - previousValue) : null;

  return {
    key: 'GDP',
    name: 'GDP',
    value,
    previousValue,
    change,
    changePercent:
      previousValue !== null && previousValue !== 0
        ? fmt((change! / Math.abs(previousValue)) * 100)
        : null,
    unit: 'M USD',
    period: latest.date.slice(0, 4),
    source: 'Central Bank of Liberia',
    history: points.map(p => ({ date: p.date, value: fmt(p.value * scale) })),
  };
}

async function cblDebtIndicator(): Promise<NormalizedIndicator | null> {
  const fiscal = await getFiscalData(24);
  if (!fiscal.debt.latest) return null;

  const points = fiscal.debt.points;
  const latest = points[points.length - 1];
  const prev = points.length >= 2 ? points[points.length - 2] : null;

  const scale = 1e-6;
  const value = fmt(latest.value * scale);
  const previousValue = prev ? fmt(prev.value * scale) : null;
  const change = previousValue !== null ? fmt(value - previousValue) : null;

  return {
    key: 'GOVT_DEBT',
    name: 'Government Debt',
    value,
    previousValue,
    change,
    changePercent:
      previousValue !== null && previousValue !== 0
        ? fmt((change! / Math.abs(previousValue)) * 100)
        : null,
    unit: 'M LRD',
    period: latest.date.slice(0, 7),
    source: 'Central Bank of Liberia',
    history: points.map(p => ({ date: p.date, value: fmt(p.value * scale) })),
  };
}

async function cblTradeBalanceIndicator(): Promise<NormalizedIndicator | null> {
  const trade = await getTradeData(20);
  if (!trade.balance.latest) return null;

  const points = trade.balance.points;
  const latest = points[points.length - 1];
  const prev = points.length >= 2 ? points[points.length - 2] : null;

  const value = fmt(latest.value);
  const previousValue = prev ? fmt(prev.value) : null;
  const change = previousValue !== null ? fmt(value - previousValue) : null;

  return {
    key: 'TRADE_BALANCE',
    name: 'Trade Balance',
    value,
    previousValue,
    change,
    changePercent:
      previousValue !== null && previousValue !== 0
        ? fmt((change! / Math.abs(previousValue)) * 100)
        : null,
    unit: 'M USD',
    period: latest.date.slice(0, 7),
    source: 'Central Bank of Liberia',
    history: points.map(p => ({ date: p.date, value: fmt(p.value) })),
  };
}

/**
 * Server-side loader for the dashboard indicators strip.
 *
 * Reads pre-hydrated values from `macro_values` (populated by
 * `npm run hydrate:worldbank` and the future CBL/IMF scrapers) and shapes
 * them into the same `NormalizedIndicator[]` contract that the existing
 * `/api/indicators` consumers already speak.
 *
 * Latency budget: one query for metadata, then one query per series for
 * history, all run in parallel. Typical p99 < 200ms.
 */

interface DashboardSpec {
  /** Stable key consumed by the UI (do not rename without updating callers). */
  seriesId: string;
  name: string;
  unit: string;
  /** Multiply raw DB value by this before display (e.g. 1e-9 for USD → B USD). */
  scale?: number;
}

const DASHBOARD: Record<string, DashboardSpec> = {
  GDP:           { seriesId: 'WB.NY.GDP.MKTP.CD',    name: 'GDP',              unit: 'B USD', scale: 1e-9 },
  GDP_GROWTH:    { seriesId: 'WB.NY.GDP.MKTP.KD.ZG', name: 'GDP Growth',       unit: '%' },
  INFLATION:     { seriesId: 'WB.FP.CPI.TOTL.ZG',    name: 'Inflation Rate',   unit: '%' },
  POPULATION:    { seriesId: 'WB.SP.POP.TOTL',       name: 'Population',       unit: 'M',     scale: 1e-6 },
  UNEMPLOYMENT:  { seriesId: 'WB.SL.UEM.TOTL.ZS',    name: 'Unemployment',     unit: '%' },
  RESERVES:      { seriesId: 'WB.FI.RES.TOTL.CD',    name: 'Foreign Reserves', unit: 'B USD', scale: 1e-9 },
  EXTERNAL_DEBT: { seriesId: 'WB.DT.DOD.DECT.CD',    name: 'External Debt',    unit: 'B USD', scale: 1e-9 },
  FDI:           { seriesId: 'WB.BX.KLT.DINV.CD.WD', name: 'FDI Inflows',      unit: 'M USD', scale: 1e-6 },
};

const HISTORY_LIMIT = 10;

type SeriesRow = { id: string; series_id: string; source: string };
type ValueRow  = { date: string; value: number };

function fmt(n: number): number {
  return Number(n.toFixed(4));
}

export async function getDashboardIndicators(): Promise<NormalizedIndicator[]> {
  const wantedSeriesIds = Object.values(DASHBOARD).map(d => d.seriesId);

  const { data: seriesRows, error: seriesErr } = await publicClient
    .from('macro_series')
    .select('id, series_id, source')
    .in('series_id', wantedSeriesIds);

  if (seriesErr) throw seriesErr;
  if (!seriesRows?.length) return [];

  const seriesByExternalId = new Map<string, SeriesRow>(
    (seriesRows as SeriesRow[]).map(r => [r.series_id, r]),
  );

  // Pull history for every series in parallel.
  const valueLoads = await Promise.all(
    (seriesRows as SeriesRow[]).map(async (s) => {
      const { data, error } = await publicClient
        .from('macro_values')
        .select('date, value')
        .eq('series_id', s.id)
        .order('date', { ascending: false })
        .limit(HISTORY_LIMIT);
      if (error) throw error;
      return [s.series_id, (data ?? []) as ValueRow[]] as const;
    }),
  );
  const valuesByExternalId = new Map(valueLoads);

  const out: NormalizedIndicator[] = [];

  for (const [key, cfg] of Object.entries(DASHBOARD)) {
    const meta = seriesByExternalId.get(cfg.seriesId);
    const values = valuesByExternalId.get(cfg.seriesId) ?? [];
    if (!meta || values.length === 0) continue;

    const scale = cfg.scale ?? 1;
    const latest = values[0];
    const prev = values[1];

    const value = fmt(latest.value * scale);
    const previousValue = prev ? fmt(prev.value * scale) : null;
    const change = previousValue !== null ? fmt(value - previousValue) : null;
    const changePercent =
      previousValue !== null && previousValue !== 0
        ? fmt((change! / Math.abs(previousValue)) * 100)
        : null;

    out.push({
      key,
      name: cfg.name,
      value,
      previousValue,
      change,
      changePercent,
      unit: cfg.unit,
      period: String(latest.date).slice(0, 4),
      source: meta.source,
      history: values
        .slice()
        .reverse() // chronological for charts
        .map(v => ({
          date: String(v.date),
          value: fmt(v.value * scale),
        })),
    });
  }

  // Layer in CBL-sourced indicators — fresher than World Bank for CPI, GDP,
  // debt, and trade. CBL data wins when available; WB remains the fallback.
  const [cblInflation, cblGdp, cblDebt, cblTrade, cblRate] = await Promise.all([
    cblInflationIndicator().catch(() => null),
    cblGdpIndicator().catch(() => null),
    cblDebtIndicator().catch(() => null),
    cblTradeBalanceIndicator().catch(() => null),
    cblPolicyRateIndicator(),
  ]);

  const cblOverrides = new Map<string, NormalizedIndicator>();
  if (cblInflation) cblOverrides.set('INFLATION', cblInflation);
  if (cblGdp) cblOverrides.set('GDP', cblGdp);
  if (cblDebt) cblOverrides.set('GOVT_DEBT', cblDebt);
  if (cblTrade) cblOverrides.set('TRADE_BALANCE', cblTrade);

  for (let i = 0; i < out.length; i++) {
    const override = cblOverrides.get(out[i].key);
    if (override) {
      out[i] = override;
      cblOverrides.delete(out[i].key);
    }
  }
  for (const ind of cblOverrides.values()) out.push(ind);

  out.push(cblRate);

  return out;
}
