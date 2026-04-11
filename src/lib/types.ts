export interface HistoricalDataPoint {
  date: string;
  value: number;
}

export interface ExchangeRate {
  pair: string;
  from: string;
  to: string;
  rate: number;
  change: number;
  changePercent: number;
  high52w: number;
  low52w: number;
  historicalData: HistoricalDataPoint[];
}

export interface EconomicIndicator {
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  period: string;
  source: string;
  historicalData: HistoricalDataPoint[];
}

export interface Commodity {
  name: string;
  price: number;
  unit: string;
  currency: string;
  change: number;
  changePercent: number;
  high52w: number;
  low52w: number;
  historicalData: HistoricalDataPoint[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  category: 'economy' | 'forex' | 'commodities' | 'policy';
}

export type TimeRange = '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';

// ─── Business Directory ────────────────────────────────────────────────────────

export type CompanySector =
  | 'Mining'
  | 'Banking'
  | 'Telecom'
  | 'Agriculture'
  | 'Energy'
  | 'Logistics'
  | 'Insurance'
  | 'Regulatory'
  | 'Oil & Gas'
  | 'Retail';

export type CompanyOwnership = 'Private' | 'Public' | 'State-Owned' | 'Mixed';

export type CompanyStatus = 'Active' | 'Suspended' | 'Under Review';

export interface CompanyFinancials {
  revenue?: number;        // USD millions
  revenueYear?: number;
  employees?: number;
  marketCap?: number;      // USD millions
  totalAssets?: number;    // USD millions
  concessionArea?: string; // e.g. "220,000 ha"
  exportVolume?: string;   // e.g. "4.4M tonnes/yr"
  licensedSince?: number;
}

export interface Company {
  id: string;
  name: string;
  shortName?: string;
  sector: CompanySector;
  subsector?: string;
  ownership: CompanyOwnership;
  status: CompanyStatus;
  founded?: number;
  headquarters: string;
  description: string;
  keyFact: string;
  financials: CompanyFinancials;
  relatedCommodities?: string[];
  relatedNewsKeywords?: string[];
  relatedStockTicker?: string;
  website?: string;
  parentCompany?: string;
  concessionCounty?: string[];
  isFeatured?: boolean;
}
