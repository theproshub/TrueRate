import { publicClient } from '@/lib/supabase/public';
import type { NormalizedIndicator } from '@/lib/types/indicators';
import {
  CBL_POLICY_RATE,
  CBL_POLICY_RATE_PERIOD,
  CBL_POLICY_RATE_PREV,
} from '@/lib/data/cbl-rate';

/**
 * The CBL policy rate has no World Bank series — it is an administered figure
 * maintained in `@/lib/data/cbl-rate`. We surface it alongside the live macro
 * series so every consumer (ticker, rail, /api/indicators) reads one value.
 */
function cblPolicyRateIndicator(): NormalizedIndicator {
  const change = Number((CBL_POLICY_RATE - CBL_POLICY_RATE_PREV).toFixed(4));
  return {
    key: 'CBL_RATE',
    name: 'CBL Policy Rate',
    value: CBL_POLICY_RATE,
    previousValue: CBL_POLICY_RATE_PREV,
    change,
    changePercent:
      CBL_POLICY_RATE_PREV !== 0
        ? Number(((change / CBL_POLICY_RATE_PREV) * 100).toFixed(4))
        : null,
    unit: '%',
    period: CBL_POLICY_RATE_PERIOD,
    source: 'Central Bank of Liberia',
    history: [],
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
  GDP:           { seriesId: 'WB.NY.GDP.MKTP.CD',    name: 'GDP',            unit: 'B USD', scale: 1e-9 },
  GDP_GROWTH:    { seriesId: 'WB.NY.GDP.MKTP.KD.ZG', name: 'GDP Growth',     unit: '%' },
  INFLATION:     { seriesId: 'WB.FP.CPI.TOTL.ZG',    name: 'Inflation Rate', unit: '%' },
  POPULATION:    { seriesId: 'WB.SP.POP.TOTL',       name: 'Population',     unit: 'M',     scale: 1e-6 },
  UNEMPLOYMENT:  { seriesId: 'WB.SL.UEM.TOTL.ZS',    name: 'Unemployment',   unit: '%' },
  EXTERNAL_DEBT: { seriesId: 'WB.DT.DOD.DECT.CD',    name: 'External Debt',  unit: 'B USD', scale: 1e-9 },
  FDI:           { seriesId: 'WB.BX.KLT.DINV.CD.WD', name: 'FDI Inflows',    unit: 'M USD', scale: 1e-6 },
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

  // Administered CBL policy rate (no WB series) — single source of truth.
  out.push(cblPolicyRateIndicator());

  return out;
}
