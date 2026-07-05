/**
 * STATIC editorial copy for the Trends terminal — keyed by CBL mnemonic.
 * Never AI-generated per load; these are hand-written, reviewed one-liners.
 * The data values they sit beside are live; only this contextual prose is fixed.
 */

export interface Editorial {
  /** Plain-language "what this means for a decision". */
  note: string;
  /** Optional extra angle. */
  liberiaAngle?: string;
}

export const EDITORIAL: Record<string, Editorial> = {
  // ── Currency ──
  'LBR_EXR_EPR_1': { note: 'A weaker LRD raises the cost of imports and dollar-priced goods.' },
  'LBR_EXR_PAR_1': { note: 'The monthly average smooths daily volatility — useful for trade contracts.' },

  // ── Prices ──
  'LBR_CPI_0': { note: 'Monthly consumer prices — rising CPI erodes purchasing power faster than annual snapshots reveal.' },

  // ── Monetary ──
  'LBR_MON_DC_4': { note: 'Broad money (M2) growth above GDP growth can signal inflationary pressure.' },
  'LBR_MON_6':    { note: 'Reserve money is the CBL\'s primary monetary-policy lever.' },

  // ── Fiscal ──
  'LBR_FIS_DEBT_1': { note: 'Total government debt stock — rising levels tighten fiscal space for public investment.' },
  'LBR_FIS_BUD_1':  { note: 'Monthly government revenue — tracks tax collection and grant inflows.' },
  'LBR_FIS_BUD_2':  { note: 'Monthly government spending — salary, capital and debt-service outlays.' },

  // ── Trade ──
  'LBR_BOP_1_4': { note: 'Goods trade balance — a deficit means Liberia imports more goods than it exports.' },

  // ── National Accounts ──
  'LBR_NAT_0': { note: 'Nominal GDP at market prices — the headline size of the economy.' },
};

/** Curated sections the terminal renders (subset of the full payload). */
export const SECTION_CONFIG: { id: string; title: string; ids: string[] }[] = [
  { id: 'currency',  title: 'Currency',          ids: ['LBR_EXR_EPR_1', 'LBR_EXR_PAR_1'] },
  { id: 'prices',    title: 'Prices',            ids: ['LBR_CPI_0'] },
  { id: 'monetary',  title: 'Monetary',          ids: ['LBR_MON_DC_4', 'LBR_MON_6'] },
  { id: 'fiscal',    title: 'Government Finance', ids: ['LBR_FIS_DEBT_1', 'LBR_FIS_BUD_1', 'LBR_FIS_BUD_2'] },
  { id: 'trade',     title: 'Trade',             ids: ['LBR_BOP_1_4'] },
  { id: 'national',  title: 'National Accounts', ids: ['LBR_NAT_0'] },
];

export function editorialFor(id: string): Editorial {
  return EDITORIAL[id] ?? { note: '' };
}
