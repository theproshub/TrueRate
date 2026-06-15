/**
 * Server-side loader for CBL statistical observations.
 *
 * Reads from the `cbl_observations` table, populated nightly by the sync-cbl
 * cron from the CBL DataWarehousePro API. Returns empty arrays on any DB error
 * so callers can render gracefully without a chart.
 */

import { publicClient } from '@/lib/supabase/public';

export interface CblObsPoint {
  date: string;
  value: number;
}

export interface CpiData {
  points: CblObsPoint[];
  latest: CblObsPoint | null;
  /** Year-on-year change in percentage points, null if insufficient history. */
  yoy: number | null;
  /** Period label of the latest observation, e.g. "Mar-26". */
  period: string | null;
}

export interface ExchangeRateData {
  points: CblObsPoint[];
  latest: CblObsPoint | null;
}

async function fetchSeries(mnemonic: string, limit: number): Promise<CblObsPoint[]> {
  try {
    const { data } = await publicClient
      .from('cbl_observations')
      .select('period_date, period_label, value')
      .eq('mnemonic', mnemonic)
      .not('value', 'is', null)
      .neq('value', 0)
      .order('period_date', { ascending: false })
      .limit(limit);

    if (!data?.length) return [];
    return data
      .reverse()
      .map(r => ({ date: String(r.period_date), value: Number(r.value) }));
  } catch {
    return [];
  }
}

/** Returns 24-month CPI history + YoY change for LBR_CPI_0. */
export async function getCpiData(months = 24): Promise<CpiData> {
  // Fetch one extra year so we can compute YoY without a second query.
  const obs = await fetchSeries('LBR_CPI_0', months + 12);
  if (!obs.length) return { points: [], latest: null, yoy: null, period: null };

  const trimmed = obs.slice(-months);
  const latest = trimmed[trimmed.length - 1] ?? null;

  // Year-ago value: 12 observations back from the latest in the full set.
  const yearAgo = obs.length >= 13 ? obs[obs.length - 13] : null;
  const yoy =
    latest && yearAgo
      ? Number((((latest.value - yearAgo.value) / yearAgo.value) * 100).toFixed(2))
      : null;

  // Recover the period label from the raw query for display (e.g. "Mar-26").
  const period = latest ? latest.date.slice(0, 7) : null;

  return { points: trimmed, latest, yoy, period };
}

/** Returns 24-month USD/LRD end-of-period history for LBR_EXR_EPR_1. */
export async function getExchangeRateData(months = 24): Promise<ExchangeRateData> {
  const obs = await fetchSeries('LBR_EXR_EPR_1', months);
  const latest = obs.length ? obs[obs.length - 1] : null;
  return { points: obs, latest };
}
