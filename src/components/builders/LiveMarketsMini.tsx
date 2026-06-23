'use client';

import { useEffect, useState } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   LiveMarketsMini — compact "Liberia Markets" panel for the builders rail.

   FX rates   → /api/rates       (live LRD mid-rates)
   Indicators → /api/indicators  (CBL policy rate + inflation, genuinely sourced)

   No fabricated values: rows render only from live endpoints, and the panel
   omits itself entirely if nothing loads.
───────────────────────────────────────────────────────────────────────────── */

type Rate = { pair: string; from: string; rate: number };
type Indicator = { key: string; name: string; value: number; unit: string };

const FX_FROM = ['USD', 'EUR', 'GBP'];
const INDICATOR_KEYS = ['CBL_RATE', 'INFLATION'];

type Row = { label: string; value: string };

export default function LiveMarketsMini() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/rates').then(r => r.json()).catch(() => null),
      fetch('/api/indicators').then(r => r.json()).catch(() => null),
    ]).then(([ratesData, indicatorsData]) => {
      if (cancelled) return;
      const next: Row[] = [];

      const rates: Rate[] = ratesData?.rates ?? [];
      for (const from of FX_FROM) {
        const r = rates.find(x => x.from === from);
        if (r) next.push({ label: `${from}/LRD`, value: r.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) });
      }

      const indicators: Indicator[] = indicatorsData?.indicators ?? [];
      for (const key of INDICATOR_KEYS) {
        const ind = indicators.find(x => x.key === key);
        if (ind) next.push({ label: ind.name, value: ind.unit === '%' ? `${ind.value}%` : `${ind.value} ${ind.unit}`.trim() });
      }

      setRows(next);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading market data">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-7 rounded bg-white motion-safe:animate-pulse" />
        ))}
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return <p className="text-xs text-gray-500">Market data unavailable.</p>;
  }

  return (
    <>
      <ul className="list-none p-0 m-0 divide-y divide-gray-200">
        {rows.map(row => (
          <li key={row.label} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
            <span className="text-sm font-semibold text-gray-900">{row.label}</span>
            <span className="text-sm font-bold tabular-nums text-gray-900">{row.value}</span>
          </li>
        ))}
      </ul>
      <p className="text-2xs text-gray-500 mt-3 leading-relaxed">
        Live mid-rates &amp; indicators · indicative only.
      </p>
    </>
  );
}
