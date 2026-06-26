export type EventImpact = 'high' | 'medium' | 'low';

export type EventCategory =
  | 'monetary-policy'
  | 'fiscal'
  | 'imf'
  | 'trade'
  | 'data-release'
  | 'regional';

export interface EconomicEvent {
  id: string;
  date: string;
  title: string;
  body: string;
  category: EventCategory;
  impact: EventImpact;
  source: string;
  sourceUrl?: string;
  /** CBL mnemonics affected by this event's outcome. */
  relatedSeries?: string[];
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  'monetary-policy': 'Monetary Policy',
  fiscal: 'Fiscal',
  imf: 'IMF',
  trade: 'Trade',
  'data-release': 'Data Release',
  regional: 'Regional',
};

export const economicEvents: EconomicEvent[] = [
  {
    id: 'mpc-2026-q3',
    date: '2026-07-15',
    title: 'CBL Monetary Policy Committee Meeting',
    body: 'Quarterly MPC decision on the policy rate, reserve requirements, and inflation outlook. Previous meeting (Apr 27) held the MPR at 16.25%.',
    category: 'monetary-policy',
    impact: 'high',
    source: 'Central Bank of Liberia',
    sourceUrl: 'https://www.cbl.org.lr',
    relatedSeries: ['LBR_INR_MPR_1', 'LBR_EXR_EPR_1', 'LBR_CPI_0'],
  },
  {
    id: 'fy26-mid-year',
    date: '2026-07-31',
    title: 'FY2026 Mid-Year Budget Review',
    body: 'MFDP publishes H1 revenue and expenditure actuals against the $1.25B approved budget. Tracks fiscal consolidation targets.',
    category: 'fiscal',
    impact: 'medium',
    source: 'Ministry of Finance & Development Planning',
    sourceUrl: 'https://mfdp.gov.lr',
    relatedSeries: ['LBR_FIS_BUD_1', 'LBR_FIS_BUD_2', 'LBR_FIS_DEBT_1'],
  },
  {
    id: 'cbl-mer-jun',
    date: '2026-08-15',
    title: 'CBL Monthly Economic Review — June 2026',
    body: 'Monthly bulletin with CPI, exchange rate, money supply, banking sector, and trade data for June 2026.',
    category: 'data-release',
    impact: 'medium',
    source: 'Central Bank of Liberia',
    sourceUrl: 'https://www.cbl.org.lr/publications/document-type/monthly-economic-review',
    relatedSeries: ['LBR_CPI_0', 'LBR_EXR_EPR_1', 'LBR_MON_DC_4', 'LBR_MON_6'],
  },
  {
    id: 'imf-ecf-4th',
    date: '2026-09-15',
    title: 'IMF 4th ECF Review Mission (est.)',
    body: 'Staff visit for the fourth review of the Extended Credit Facility. 3rd review completed Apr 2026, disbursing SDR 19.3M. Expect updated GDP and inflation projections.',
    category: 'imf',
    impact: 'high',
    source: 'International Monetary Fund',
    sourceUrl: 'https://www.imf.org/en/Countries/LBR',
    relatedSeries: ['LBR_NAT_0', 'LBR_CPI_0', 'LBR_FIS_DEBT_1'],
  },
  {
    id: 'imf-rsf-1st',
    date: '2026-10-15',
    title: 'IMF RSF 1st Review (est.)',
    body: 'First review of the SDR 193.8M Resilience and Sustainability Facility approved Apr 2026. Focuses on climate and governance reforms.',
    category: 'imf',
    impact: 'medium',
    source: 'International Monetary Fund',
    sourceUrl: 'https://www.imf.org/en/Countries/LBR',
  },
  {
    id: 'mpc-2026-q4',
    date: '2026-10-27',
    title: 'CBL Monetary Policy Committee Meeting',
    body: 'Q4 MPC decision. Will reflect H1 fiscal data, mid-year CPI trajectory, and any IMF ECF conditions.',
    category: 'monetary-policy',
    impact: 'high',
    source: 'Central Bank of Liberia',
    sourceUrl: 'https://www.cbl.org.lr',
    relatedSeries: ['LBR_INR_MPR_1', 'LBR_EXR_EPR_1', 'LBR_CPI_0'],
  },
  {
    id: 'fy27-draft-budget',
    date: '2026-11-15',
    title: 'FY2027 Draft National Budget (est.)',
    body: 'Executive submits draft budget to the Legislature. Will include revenue projections, sector allocations, and medium-term fiscal framework.',
    category: 'fiscal',
    impact: 'high',
    source: 'Ministry of Finance & Development Planning',
    sourceUrl: 'https://mfdp.gov.lr',
    relatedSeries: ['LBR_FIS_BUD_1', 'LBR_FIS_BUD_2'],
  },
  {
    id: 'cbl-annual-report',
    date: '2026-12-31',
    title: 'CBL Annual Report 2026 (est.)',
    body: 'Comprehensive annual statistical publication with full-year monetary, fiscal, and external sector data.',
    category: 'data-release',
    impact: 'medium',
    source: 'Central Bank of Liberia',
    sourceUrl: 'https://www.cbl.org.lr',
  },
];

export function getUpcomingEvents(from: Date = new Date(), limit = 5): EconomicEvent[] {
  const iso = from.toISOString().slice(0, 10);
  return economicEvents
    .filter(e => e.date >= iso)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

export function getPastEvents(from: Date = new Date(), limit = 3): EconomicEvent[] {
  const iso = from.toISOString().slice(0, 10);
  return economicEvents
    .filter(e => e.date < iso)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
