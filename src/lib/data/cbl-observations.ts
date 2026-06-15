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

// ---------------------------------------------------------------------------
// Growth (NAT — National Accounts, annual)
// ---------------------------------------------------------------------------

export interface GdpData {
  /** GDP at market prices (LBR_NAT_0), annual. */
  nominal: { points: CblObsPoint[]; latest: CblObsPoint | null };
  /** GDP at constant 1992 prices (LBR_NAT_00), annual. */
  real: { points: CblObsPoint[]; latest: CblObsPoint | null };
}

export async function getGdpData(years = 15): Promise<GdpData> {
  const [nominal, real] = await Promise.all([
    fetchSeries('LBR_NAT_0', years),
    fetchSeries('LBR_NAT_00', years),
  ]);
  return {
    nominal: { points: nominal, latest: nominal.at(-1) ?? null },
    real: { points: real, latest: real.at(-1) ?? null },
  };
}

// ---------------------------------------------------------------------------
// Fiscal (FIS — Government Budget & Debt, monthly)
// ---------------------------------------------------------------------------

export interface FiscalData {
  /** Total government debt (LBR_FIS_DEBT_1). */
  debt: { points: CblObsPoint[]; latest: CblObsPoint | null };
  /** Total revenue (LBR_FIS_BUD_1) — latest value only. */
  revenue: CblObsPoint | null;
  /** Total expenditure (LBR_FIS_BUD_2) — latest value only. */
  expenditure: CblObsPoint | null;
}

export async function getFiscalData(months = 24): Promise<FiscalData> {
  const [debt, rev, exp] = await Promise.all([
    fetchSeries('LBR_FIS_DEBT_1', months),
    fetchSeries('LBR_FIS_BUD_1', 1),
    fetchSeries('LBR_FIS_BUD_2', 1),
  ]);
  return {
    debt: { points: debt, latest: debt.at(-1) ?? null },
    revenue: rev.at(-1) ?? null,
    expenditure: exp.at(-1) ?? null,
  };
}

// ---------------------------------------------------------------------------
// Trade (BOP — Balance of Payments, quarterly)
// ---------------------------------------------------------------------------

export interface TradeData {
  /** Goods trade balance (LBR_BOP_1_4). */
  balance: { points: CblObsPoint[]; latest: CblObsPoint | null };
  /** Goods exports (LBR_BOP_1_4_1) — latest value only. */
  exports: CblObsPoint | null;
  /** Goods imports (LBR_BOP_1_4_2) — latest value only. */
  imports: CblObsPoint | null;
}

export async function getTradeData(quarters = 20): Promise<TradeData> {
  const [bal, exp, imp] = await Promise.all([
    fetchSeries('LBR_BOP_1_4', quarters),
    fetchSeries('LBR_BOP_1_4_1', 1),
    fetchSeries('LBR_BOP_1_4_2', 1),
  ]);
  return {
    balance: { points: bal, latest: bal.at(-1) ?? null },
    exports: exp.at(-1) ?? null,
    imports: imp.at(-1) ?? null,
  };
}

// ---------------------------------------------------------------------------
// Interest Rates (INR — CBL interest rate series, monthly)
// ---------------------------------------------------------------------------

export interface InterestRateRow {
  label: string;
  lrd: CblObsPoint | null;
  usd: CblObsPoint | null;
}

export interface InterestRateData {
  /** CBL Monetary Policy Rate time series. */
  policyRate: { points: CblObsPoint[]; latest: CblObsPoint | null };
  /** Lending rate time series (LRD). */
  lendingLrd: { points: CblObsPoint[]; latest: CblObsPoint | null };
  /** Latest values for each rate type, LRD vs USD. */
  rows: InterestRateRow[];
}

export async function getInterestRateData(months = 12): Promise<InterestRateData> {
  const [mpr, lendLrd, lendUsd, savLrd, savUsd, tdLrd, tdUsd, mtgLrd, mtgUsd, plLrd, plUsd, cdLrd, cdUsd] =
    await Promise.all([
      fetchSeries('LBR_INR_MPR_1', months),
      fetchSeries('LBR_INR_LRL_2', months),
      fetchSeries('LBR_INR_LRU_8', months),
      fetchSeries('LBR_INR_SRL_6', months),
      fetchSeries('LBR_INR_SRU_12', months),
      fetchSeries('LBR_INR_DRL_5', months),
      fetchSeries('LBR_INR_DRU_11', months),
      fetchSeries('LBR_INR_MRL_4', months),
      fetchSeries('LBR_INR_MRU_10', months),
      fetchSeries('LBR_INR_PRL_3', months),
      fetchSeries('LBR_INR_PRU_9', months),
      fetchSeries('LBR_INR_CRL_7', months),
      fetchSeries('LBR_INR_CRU_13', months),
    ]);

  const last = (arr: CblObsPoint[]) => arr.at(-1) ?? null;

  return {
    policyRate: { points: mpr, latest: last(mpr) },
    lendingLrd: { points: lendLrd, latest: last(lendLrd) },
    rows: [
      { label: 'Policy Rate (MPR)', lrd: last(mpr), usd: null },
      { label: 'Lending',           lrd: last(lendLrd), usd: last(lendUsd) },
      { label: 'Personal Loan',     lrd: last(plLrd),   usd: last(plUsd) },
      { label: 'Mortgage',          lrd: last(mtgLrd),  usd: last(mtgUsd) },
      { label: 'Time Deposit',      lrd: last(tdLrd),   usd: last(tdUsd) },
      { label: 'Savings',           lrd: last(savLrd),  usd: last(savUsd) },
      { label: 'CDs',               lrd: last(cdLrd),   usd: last(cdUsd) },
    ],
  };
}

// ---------------------------------------------------------------------------
// Money Supply (MON — Monetary Surveys, monthly)
// ---------------------------------------------------------------------------

export interface MoneySupplyData {
  /** Monetary Base / Reserve Money (LBR_MON_6). */
  reserveMoney: { points: CblObsPoint[]; latest: CblObsPoint | null };
  /** Broad Money M2 (LBR_MON_DC_4). */
  broadMoney: { points: CblObsPoint[]; latest: CblObsPoint | null };
}

export async function getMoneySupplyData(months = 12): Promise<MoneySupplyData> {
  const [rm, bm] = await Promise.all([
    fetchSeries('LBR_MON_6', months),
    fetchSeries('LBR_MON_DC_4', months),
  ]);
  return {
    reserveMoney: { points: rm, latest: rm.at(-1) ?? null },
    broadMoney: { points: bm, latest: bm.at(-1) ?? null },
  };
}

// ---------------------------------------------------------------------------
// Government Debt breakdown (FIS — already have total; add domestic/external)
// ---------------------------------------------------------------------------

export interface DebtBreakdownData {
  total: { points: CblObsPoint[]; latest: CblObsPoint | null };
  domestic: { points: CblObsPoint[]; latest: CblObsPoint | null };
  external: { points: CblObsPoint[]; latest: CblObsPoint | null };
}

export async function getDebtBreakdownData(months = 12): Promise<DebtBreakdownData> {
  const [total, dom, ext] = await Promise.all([
    fetchSeries('LBR_FIS_DEBT_1', months),
    fetchSeries('LBR_FIS_DEBT_1_2', months),
    fetchSeries('LBR_FIS_DEBT_1_3', months),
  ]);
  return {
    total: { points: total, latest: total.at(-1) ?? null },
    domestic: { points: dom, latest: dom.at(-1) ?? null },
    external: { points: ext, latest: ext.at(-1) ?? null },
  };
}
