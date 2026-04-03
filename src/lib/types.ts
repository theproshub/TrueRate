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
