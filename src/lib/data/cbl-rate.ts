/**
 * CBL Monetary Policy Rate — single source of truth.
 *
 * The CBL policy rate is a manually-administered official figure (there is no
 * free machine-readable feed for it), updated after each Monetary Policy
 * Committee meeting. Every surface that shows the policy rate — the homepage
 * ticker, the macro rail, the indicators API, and the economic-indicators seed
 * — must read it from here so the number can never drift out of sync.
 *
 * Source: Central Bank of Liberia, MPC communiqué.
 * Last reviewed: Q2 2026 MPC (April 27, 2026) — held at 16.25%.
 */
export const CBL_POLICY_RATE: number = 16.25;

/** Display period for the current rate. */
export const CBL_POLICY_RATE_PERIOD = 'Q2 2026';

/** Rate set at the prior MPC meeting — used to derive the change delta. */
export const CBL_POLICY_RATE_PREV: number = 16.25; // unchanged: cautious tightening hold
