/**
 * STATIC editorial copy for the Trends terminal — keyed by AnalyticsItem id
 * (FX/commodity ticker, or macro series_id). Never AI-generated per load; these
 * are hand-written, reviewed one-liners. The data values they sit beside are
 * live; only this contextual prose is fixed.
 */

export interface Editorial {
  /** Plain-language "what this means for a decision". */
  note: string;
  /** Commodities only: Liberia export-relevance angle. */
  liberiaAngle?: string;
}

export const EDITORIAL: Record<string, Editorial> = {
  // ── Macro (World Bank, Liberia) ──
  'WB.NY.GDP.MKTP.KD.ZG': { note: 'Faster growth signals an expanding economy and rising incomes.' },
  'WB.FP.CPI.TOTL.ZG':    { note: 'Rising prices reduce household purchasing power.' },
  'WB.SL.UEM.TOTL.ZS':    { note: 'Higher unemployment points to a weaker labour market.' },
  'WB.NY.GDP.MKTP.CD':    { note: 'The total size of Liberia’s economy in current dollars.' },
  'WB.NY.GDP.PCAP.CD':    { note: 'Output per person — a rough proxy for living standards.' },
  'WB.SL.TLF.CACT.ZS':    { note: 'Share of working-age people in the labour force.' },
  'WB.DT.DOD.DECT.CD':    { note: 'Rising external debt raises repayment pressure on the budget.' },
  'WB.BX.KLT.DINV.CD.WD': { note: 'Foreign investment funds jobs and capacity.' },
  'WB.BN.CAB.XOKA.CD':    { note: 'A deficit means Liberia spends more abroad than it earns.' },
  'WB.BX.GSR.GNFS.CD':    { note: 'Export earnings are a primary source of foreign currency.' },
  'WB.BM.GSR.GNFS.CD':    { note: 'High imports draw down foreign reserves.' },
  'WB.SP.POP.TOTL':       { note: 'Population growth shapes labour supply and demand.' },

  // ── Central Bank of Liberia (cbl_observations) ──
  'LBR_CPI_0':      { note: 'Monthly consumer prices — rising CPI erodes purchasing power faster than annual snapshots reveal.' },
  'LBR_FIS_DEBT_1': { note: 'Total government debt stock — rising levels tighten fiscal space for public investment.' },
  'LBR_FIS_BUD_1':  { note: 'Monthly government revenue — tracks tax collection and grant inflows.' },
  'LBR_FIS_BUD_2':  { note: 'Monthly government spending — salary, capital and debt-service outlays.' },
  'LBR_BOP_1_4':    { note: 'Goods trade balance — a deficit means Liberia imports more goods than it exports.' },
  'LBR_NAT_0':      { note: 'Nominal GDP at market prices — the headline size of the economy.' },

  // ── Currency (vs LRD) ──
  'USD/LRD': { note: 'A weaker LRD raises the cost of imports and dollar-priced goods.' },
  'EUR/LRD': { note: 'Tracks euro-zone trade and diaspora remittance value.' },
  'GBP/LRD': { note: 'Relevant to UK diaspora remittances and sterling-priced imports.' },
  'CNY/LRD': { note: 'China is a major source of imported goods and project finance.' },
  'GHS/LRD': { note: 'Cross-border trade with Ghana moves with this rate.' },
  'NGN/LRD': { note: 'Regional trade and travel costs track the naira.' },

  // ── Commodities (Liberia export relevance) ──
  'bhp.us': {
    note: 'A proxy for the 62% Fe iron-ore price; falling prices squeeze miners.',
    liberiaAngle: 'A key Liberian export — price drops pressure mining revenue and state royalties.',
  },
  'gc.f': {
    note: 'A safe-haven asset; strength often reflects market caution.',
    liberiaAngle: 'A growing export — higher prices support foreign reserves and export receipts.',
  },
  'cb.f': {
    note: 'Sets global fuel and freight costs.',
    liberiaAngle: 'Liberia imports all refined fuel — higher crude lifts pump and transport prices.',
  },
  'cc.f': {
    note: 'West Africa benchmark cocoa price.',
    liberiaAngle: 'A cash crop for smallholders — prices affect rural farm income.',
  },
  'kc.f': {
    note: 'Global coffee benchmark.',
    liberiaAngle: 'Lofa-county growers track this — it drives their export earnings.',
  },
  'sb.f': {
    note: 'Global raw-sugar price.',
    liberiaAngle: 'Feeds into the cost of imported refined sugar through the Freeport.',
  },
};

/** Curated sections the terminal renders (subset of the full payload). */
export const SECTION_CONFIG: { id: string; title: string; ids: string[] }[] = [
  { id: 'macro',       title: 'Macro',        ids: ['WB.NY.GDP.MKTP.KD.ZG', 'WB.FP.CPI.TOTL.ZG', 'WB.SL.UEM.TOTL.ZS'] },
  { id: 'cbl',         title: 'Central Bank', ids: ['LBR_CPI_0', 'LBR_FIS_DEBT_1', 'LBR_BOP_1_4'] },
  { id: 'currency',    title: 'Currency',     ids: ['USD/LRD', 'EUR/LRD', 'GBP/LRD'] },
  { id: 'commodities', title: 'Commodities',  ids: ['gc.f', 'cb.f', 'bhp.us'] },
];

export function editorialFor(id: string): Editorial {
  return EDITORIAL[id] ?? { note: '' };
}
