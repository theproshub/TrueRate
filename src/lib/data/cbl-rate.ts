/**
 * CBL Monetary Policy Rate.
 *
 * The live value is read from `cbl_observations` (mnemonic LBR_INR_MPR_1),
 * synced nightly from the CBL DataWarehousePro API. The hardcoded constants
 * below are fallbacks for static/synchronous consumers (ticker seed,
 * economic-indicators seed) and for when the DB is unreachable.
 *
 * Source: Central Bank of Liberia, MPC communiqué.
 * Last reviewed: Q2 2026 MPC (April 27, 2026) — held at 16.25%.
 */

import { getPolicyRateData } from '@/lib/data/cbl-observations';

/** Fallback constant for synchronous consumers (ticker seed, seed data). */
export const CBL_POLICY_RATE: number = 16.25;

/** Fallback display period. */
export const CBL_POLICY_RATE_PERIOD = 'Q2 2026';

/** Fallback previous rate. */
export const CBL_POLICY_RATE_PREV: number = 16.25;

/**
 * Async loader — reads the policy rate from `cbl_observations` first,
 * falls back to the hardcoded constants above.
 */
export async function getCblPolicyRate(): Promise<{
  value: number;
  previousValue: number;
  period: string;
}> {
  const live = await getPolicyRateData(2);
  if (live) return { value: live.value, previousValue: live.previousValue, period: live.period };
  return { value: CBL_POLICY_RATE, previousValue: CBL_POLICY_RATE_PREV, period: CBL_POLICY_RATE_PERIOD };
}
