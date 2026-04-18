export interface NormalizedIndicator {
  key: string;
  name: string;
  value: number;
  previousValue: number | null;
  change: number | null;
  changePercent: number | null;
  unit: string;
  period: string;
  source: string;
  history: { date: string; value: number }[];
}
