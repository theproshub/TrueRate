/**
 * Liberia economic indicators — seed data.
 *
 * Values are sourced from:
 *  - World Bank Open Data  (https://data.worldbank.org/country/liberia)
 *  - IMF World Economic Outlook (April 2024)
 *  - Central Bank of Liberia annual reports
 *  - LISGIS (Liberia Institute of Statistics and Geo-Information Services)
 *
 * This file is the fallback / static layer.
 * Live values are fetched at runtime via /api/indicators (World Bank API).
 * Historical data is generated from real annual anchors for realistic charts.
 */

import { EconomicIndicator } from '@/lib/types';
import { generateHistoricalDataFromAnchors } from '@/lib/utils';

export const economicIndicators: EconomicIndicator[] = [
  {
    name: 'GDP',
    value: 4.27,
    unit: 'B USD',
    change: 0.38,
    changePercent: 9.77,
    period: '2023',
    source: 'World Bank',
    // Real World Bank annual GDP data for Liberia (current USD, billions)
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 2.095 },
      { year: 2016, value: 2.101 },
      { year: 2017, value: 2.158 },
      { year: 2018, value: 2.425 },
      { year: 2019, value: 3.285 },
      { year: 2020, value: 3.046 }, // COVID contraction
      { year: 2021, value: 3.352 },
      { year: 2022, value: 3.889 },
      { year: 2023, value: 4.270 },
      { year: 2024, value: 4.480 }, // IMF estimate
    ], 0.006, 201),
  },
  {
    name: 'Inflation Rate',
    value: 10.3,
    unit: '%',
    change: 2.7,
    changePercent: 35.5,
    period: '2023',
    source: 'Central Bank of Liberia',
    // Real World Bank CPI inflation data (annual %)
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 7.7  },
      { year: 2016, value: 8.8  },
      { year: 2017, value: 12.4 },
      { year: 2018, value: 23.4 },
      { year: 2019, value: 20.1 },
      { year: 2020, value: 17.4 },
      { year: 2021, value: 8.0  },
      { year: 2022, value: 7.6  },
      { year: 2023, value: 10.3 },
      { year: 2024, value: 9.8  }, // CBL estimate
    ], 0.02, 202),
  },
  {
    name: 'CBL Policy Rate',
    value: 20.0,
    unit: '%',
    change: 0.0,
    changePercent: 0.0,
    period: 'Q1 2026',
    source: 'Central Bank of Liberia',
    // CBL Monetary Policy Rate — held at 20% since Nov 2023 MPC meeting
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 3.2  },
      { year: 2016, value: 3.2  },
      { year: 2017, value: 3.2  },
      { year: 2018, value: 25.0 }, // Emergency hike to defend LRD
      { year: 2019, value: 30.0 },
      { year: 2020, value: 25.0 },
      { year: 2021, value: 25.0 },
      { year: 2022, value: 25.0 },
      { year: 2023, value: 20.0 }, // Eased Nov 2023
      { year: 2024, value: 20.0 },
    ], 0.005, 203),
  },
  {
    name: 'Unemployment',
    value: 2.7,
    unit: '%',
    change: -0.3,
    changePercent: -10.0,
    period: '2023',
    source: 'World Bank / LISGIS',
    // Note: formal sector unemployment; broader informal underemployment is ~50%+
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 3.6 },
      { year: 2016, value: 3.5 },
      { year: 2017, value: 3.4 },
      { year: 2018, value: 3.6 },
      { year: 2019, value: 3.0 },
      { year: 2020, value: 3.5 }, // COVID impact
      { year: 2021, value: 3.2 },
      { year: 2022, value: 3.0 },
      { year: 2023, value: 2.7 },
      { year: 2024, value: 2.6 },
    ], 0.01, 204),
  },
  {
    name: 'Trade Balance',
    value: -0.78,
    unit: 'B USD',
    change: 0.04,
    changePercent: 4.88,
    period: '2023',
    source: 'World Bank',
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: -0.95 },
      { year: 2016, value: -0.88 },
      { year: 2017, value: -0.82 },
      { year: 2018, value: -0.91 },
      { year: 2019, value: -1.12 },
      { year: 2020, value: -0.98 },
      { year: 2021, value: -0.95 },
      { year: 2022, value: -0.82 },
      { year: 2023, value: -0.78 },
      { year: 2024, value: -0.74 },
    ], 0.02, 205),
  },
  {
    name: 'Foreign Reserves',
    value: 0.496,
    unit: 'B USD',
    change: 0.012,
    changePercent: 2.48,
    period: 'Q4 2024',
    source: 'Central Bank of Liberia',
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 0.534 },
      { year: 2016, value: 0.434 },
      { year: 2017, value: 0.350 }, // Declining reserves period
      { year: 2018, value: 0.353 },
      { year: 2019, value: 0.365 },
      { year: 2020, value: 0.477 }, // SDR allocation boost
      { year: 2021, value: 0.632 }, // IMF SDR windfall
      { year: 2022, value: 0.559 },
      { year: 2023, value: 0.484 },
      { year: 2024, value: 0.496 },
    ], 0.02, 206),
  },
  {
    name: 'Government Debt/GDP',
    value: 55.4,
    unit: '%',
    change: 1.8,
    changePercent: 3.36,
    period: '2023',
    source: 'IMF',
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 35.6 },
      { year: 2016, value: 37.2 },
      { year: 2017, value: 38.8 },
      { year: 2018, value: 43.2 },
      { year: 2019, value: 48.7 },
      { year: 2020, value: 55.1 }, // COVID spending spike
      { year: 2021, value: 51.3 },
      { year: 2022, value: 53.6 },
      { year: 2023, value: 55.4 },
      { year: 2024, value: 56.1 },
    ], 0.008, 207),
  },
  {
    name: 'Population',
    value: 5.54,
    unit: 'M',
    change: 0.13,
    changePercent: 2.4,
    period: '2023',
    source: 'World Bank',
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 4.50 },
      { year: 2016, value: 4.62 },
      { year: 2017, value: 4.73 },
      { year: 2018, value: 4.85 },
      { year: 2019, value: 4.98 }, // Corrected from census
      { year: 2020, value: 5.06 },
      { year: 2021, value: 5.19 },
      { year: 2022, value: 5.30 },
      { year: 2023, value: 5.42 },
      { year: 2024, value: 5.54 },
    ], 0.002, 208),
  },
];
