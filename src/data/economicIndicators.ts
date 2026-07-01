/**
 * Liberia economic indicators — SEED / FALLBACK data.
 *
 * DATA INTEGRITY NOTICE:
 * These are static seed values used only when live APIs are unavailable.
 * Live values are fetched at runtime via /api/indicators (World Bank API)
 * and override everything here. DO NOT treat these as authoritative.
 *
 * For verified, real-time CBL data, use the MCP tools:
 *   - series_statistics / get_series for exact figures
 *   - data_quality_report to check freshness
 *   - fact_check to verify any claim
 *
 * Original sources (seed anchors only):
 *  - World Bank Open Data  (https://data.worldbank.org/country/liberia)
 *  - IMF World Economic Outlook (April 2024)
 *  - Central Bank of Liberia annual reports
 *  - LISGIS (Liberia Institute of Statistics and Geo-Information Services)
 */

import { EconomicIndicator } from '@/lib/types';
import { generateHistoricalDataFromAnchors } from '@/lib/utils';
import { CBL_POLICY_RATE, CBL_POLICY_RATE_PERIOD } from '@/lib/data/cbl-rate';

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
    name: 'GDP Growth',
    value: 4.8,
    unit: '%',
    change: 0.2,
    changePercent: 4.3,
    period: '2024',
    source: 'World Bank',
    // Real GDP growth (annual %) — World Bank NY.GDP.MKTP.KD.ZG
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 0.0  },
      { year: 2016, value: -1.6 },
      { year: 2017, value: 2.5  },
      { year: 2018, value: 1.2  },
      { year: 2019, value: -2.5 },
      { year: 2020, value: -3.0 }, // COVID contraction
      { year: 2021, value: 5.0  },
      { year: 2022, value: 4.8  },
      { year: 2023, value: 4.6  },
      { year: 2024, value: 4.8  },
    ], 0.05, 209),
  },
  {
    name: 'Inflation Rate',
    value: 10.2,
    unit: '%',
    change: 2.6,
    changePercent: 34.2,
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
      { year: 2023, value: 10.2 },
      { year: 2024, value: 9.8  }, // CBL estimate
    ], 0.02, 202),
  },
  {
    name: 'CBL Policy Rate',
    value: CBL_POLICY_RATE, // single source of truth — see @/lib/data/cbl-rate
    unit: '%',
    change: 0.0,
    changePercent: 0.0,
    period: CBL_POLICY_RATE_PERIOD,
    source: 'Central Bank of Liberia',
    // CBL Monetary Policy Rate — actual end-of-year values from LBR_INR_MPR_1
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2019, value: 30.0 },  // Emergency hike Dec-19 (4% → 30%)
      { year: 2020, value: 25.0 },  // Cut Jun-20
      { year: 2021, value: 20.0 },  // Cut Sep-21
      { year: 2022, value: 15.0 },  // Cut Sep-22
      { year: 2023, value: 20.0 },  // Hiked Jul/Sep-23
      { year: 2024, value: 17.0 },  // Cut Aug/Oct-24
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
    value: -780,
    unit: 'M USD',
    change: 40,
    changePercent: 4.88,
    period: '2023',
    source: 'World Bank',
    // Annual goods trade balance (M USD) — matches live CBL BOP unit
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: -950 },
      { year: 2016, value: -880 },
      { year: 2017, value: -820 },
      { year: 2018, value: -910 },
      { year: 2019, value: -1120 },
      { year: 2020, value: -980 },
      { year: 2021, value: -950 },
      { year: 2022, value: -820 },
      { year: 2023, value: -780 },
      { year: 2024, value: -740 },
    ], 10, 205),
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
    name: 'Government Debt',
    value: 2.64,
    unit: 'B USD',
    change: 0.19,
    changePercent: 7.75,
    period: '2024',
    source: 'Ministry of Finance',
    // Actual CBL LBR_FIS_DEBT_1 annual averages (Millions USD → B USD)
    historicalData: generateHistoricalDataFromAnchors([
      { year: 2015, value: 1.18 },
      { year: 2016, value: 1.25 },
      { year: 2017, value: 1.32 },
      { year: 2018, value: 1.42 },
      { year: 2019, value: 1.54 },
      { year: 2020, value: 1.64 },
      { year: 2021, value: 1.67 },
      { year: 2022, value: 1.97 },
      { year: 2023, value: 2.27 },
      { year: 2024, value: 2.64 },
    ], 0.02, 207),
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
