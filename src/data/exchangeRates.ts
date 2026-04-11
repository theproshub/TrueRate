/**
 * Exchange rates — seed / fallback data.
 *
 * Rates reflect approximate CBL/market values as of Q1 2026.
 * Historical data is generated from real annual USD/LRD anchor points
 * sourced from CBL annual reports and IMF Article IV data.
 *
 * Live rates are fetched at runtime via /api/rates (fawazahmed0 currency API).
 */

import { ExchangeRate } from '@/lib/types';
import { generateHistoricalDataFromAnchors } from '@/lib/utils';

export const exchangeRates: ExchangeRate[] = [
  {
    pair: 'USD/LRD',
    from: 'USD',
    to: 'LRD',
    rate: 192.50,
    change: 0.80,
    changePercent: 0.42,
    high52w: 198.20,
    low52w: 183.40,
    // Real USD/LRD annual midpoint rates — CBL data + IMF Article IV
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 84.0  },
      { year: 2016, value: 93.2  },
      { year: 2017, value: 112.0 },
      { year: 2018, value: 144.9 }, // Sharp depreciation
      { year: 2019, value: 186.1 }, // Further weakening
      { year: 2020, value: 191.5 },
      { year: 2021, value: 170.8 }, // CBL intervention strengthened LRD
      { year: 2022, value: 154.0 }, // Continued rebound
      { year: 2023, value: 175.2 }, // Re-depreciation
      { year: 2024, value: 192.5 },
    ], 0.006, 101),
  },
  {
    pair: 'EUR/LRD',
    from: 'EUR',
    to: 'LRD',
    rate: 209.85,
    change: -0.92,
    changePercent: -0.44,
    high52w: 218.40,
    low52w: 195.60,
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 92.0  },
      { year: 2016, value: 97.5  },
      { year: 2017, value: 132.8 },
      { year: 2018, value: 168.4 },
      { year: 2019, value: 207.5 },
      { year: 2020, value: 232.3 },
      { year: 2021, value: 202.5 },
      { year: 2022, value: 160.8 },
      { year: 2023, value: 190.6 },
      { year: 2024, value: 209.9 },
    ], 0.008, 102),
  },
  {
    pair: 'GBP/LRD',
    from: 'GBP',
    to: 'LRD',
    rate: 243.15,
    change: 2.10,
    changePercent: 0.87,
    high52w: 251.30,
    low52w: 228.50,
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 128.4 },
      { year: 2016, value: 115.6 }, // Brexit impact on GBP
      { year: 2017, value: 143.0 },
      { year: 2018, value: 185.2 },
      { year: 2019, value: 242.1 },
      { year: 2020, value: 252.4 },
      { year: 2021, value: 236.0 },
      { year: 2022, value: 187.3 },
      { year: 2023, value: 222.0 },
      { year: 2024, value: 243.2 },
    ], 0.009, 103),
  },
  {
    pair: 'CNY/LRD',
    from: 'CNY',
    to: 'LRD',
    rate: 26.45,
    change: -0.08,
    changePercent: -0.30,
    high52w: 28.10,
    low52w: 24.80,
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 13.2 },
      { year: 2016, value: 13.8 },
      { year: 2017, value: 16.7 },
      { year: 2018, value: 21.1 },
      { year: 2019, value: 26.8 },
      { year: 2020, value: 29.3 },
      { year: 2021, value: 26.6 },
      { year: 2022, value: 22.9 },
      { year: 2023, value: 24.1 },
      { year: 2024, value: 26.5 },
    ], 0.007, 104),
  },
  {
    pair: 'GHS/LRD',
    from: 'GHS',
    to: 'LRD',
    rate: 12.15,
    change: -0.22,
    changePercent: -1.78,
    high52w: 16.40,
    low52w: 10.80,
    // GHS has depreciated sharply — Cedi crisis 2022-2023
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 21.5 },
      { year: 2016, value: 21.0 },
      { year: 2017, value: 24.5 },
      { year: 2018, value: 30.3 },
      { year: 2019, value: 34.6 },
      { year: 2020, value: 33.1 },
      { year: 2021, value: 29.4 },
      { year: 2022, value: 16.2 }, // Ghanaian Cedi collapsed
      { year: 2023, value: 14.1 },
      { year: 2024, value: 12.2 },
    ], 0.012, 105),
  },
  {
    pair: 'NGN/LRD',
    from: 'NGN',
    to: 'LRD',
    rate: 0.120,
    change: -0.004,
    changePercent: -3.23,
    high52w: 0.195,
    low52w: 0.108,
    // NGN collapsed in 2023 after CBN float removed peg
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 0.44 },
      { year: 2016, value: 0.35 }, // Naira devalued
      { year: 2017, value: 0.37 },
      { year: 2018, value: 0.40 },
      { year: 2019, value: 0.52 },
      { year: 2020, value: 0.50 },
      { year: 2021, value: 0.47 },
      { year: 2022, value: 0.44 },
      { year: 2023, value: 0.21 }, // Float + collapse
      { year: 2024, value: 0.12 },
    ], 0.018, 106),
  },
];
