'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Rate = { pair: string; from: string; to: string; rate: number; change?: number; changePercent?: number };
type Indicator = { key: string; name: string; value: number; unit: string; change?: number; changePercent?: number };

type Row = { label: string; value: string; change: number | null; pct: number | null };

const FX_FROM = ['USD', 'EUR', 'GBP', 'CNY'];
const IND_KEYS = ['CBL_RATE', 'INFLATION'];

function fmt(n: number, dec = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export default function MoversTable() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/rates').then((r) => r.json()).catch(() => null),
      fetch('/api/indicators').then((r) => r.json()).catch(() => null),
    ]).then(([rd, id]) => {
      if (cancelled) return;
      const next: Row[] = [];

      const rates: Rate[] = rd?.rates ?? [];
      for (const from of FX_FROM) {
        const r = rates.find((x) => x.from === from);
        if (r)
          next.push({
            label: `${from}/LRD`,
            value: fmt(r.rate),
            change: r.change ?? null,
            pct: r.changePercent ?? null,
          });
      }

      const indicators: Indicator[] = id?.indicators ?? [];
      for (const key of IND_KEYS) {
        const ind = indicators.find((x) => x.key === key);
        if (ind)
          next.push({
            label: ind.name,
            value: ind.unit === '%' ? `${ind.value}%` : `${ind.value}`,
            change: ind.change ?? null,
            pct: ind.changePercent ?? null,
          });
      }

      setRows(next.length > 0 ? next : null);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <h3 className="text-[16px] font-bold text-[#0A0A0A] pb-2.5 border-b border-[#E8E8E5] mb-0">
        Liberia Markets
      </h3>

      {loading ? (
        <div aria-busy="true" aria-label="Loading market data">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#F0F0EE]">
              <div className="h-3 w-16 bg-[#F0F0EE] motion-safe:animate-pulse rounded-sm" />
              <div className="h-3 w-20 bg-[#F0F0EE] motion-safe:animate-pulse rounded-sm" />
            </div>
          ))}
        </div>
      ) : !rows ? (
        <p className="py-3 text-[12px] text-[#999]">Market data unavailable.</p>
      ) : (
        <table className="w-full text-[13px]" aria-label="Liberia market rates">
          <thead className="sr-only">
            <tr>
              <th scope="col">Instrument</th>
              <th scope="col">Value</th>
              <th scope="col">Change</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-[#F0F0EE]">
                <td className="py-2.5 font-semibold text-[#333]">{row.label}</td>
                <td className="py-2.5 text-right font-bold tabular-nums text-[#0A0A0A]">{row.value}</td>
                <td className="py-2.5 pl-2 text-right tabular-nums text-[12px] font-medium w-[72px]">
                  {row.pct != null ? (
                    <span className={row.pct >= 0 ? 'text-[#00A650]' : 'text-[#D91400]'}>
                      {row.pct >= 0 ? '+' : ''}{fmt(row.pct)}%
                    </span>
                  ) : (
                    <span className="text-[#CCC]">&mdash;</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <caption className="caption-bottom pt-2 text-left text-[10px] text-[#AAA] leading-snug">
            Live mid-rates &amp; indicators &middot; indicative only
          </caption>
        </table>
      )}

      <div className="mt-3 pt-2.5 border-t border-[#F0F0EE]">
        <Link
          href="/watchlist"
          className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0A0A0A] hover:text-[#333] transition-colors no-underline min-h-[44px]"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
            <path d="M8 3v10M3 8h10" strokeLinecap="round" />
          </svg>
          My Watchlist
        </Link>
      </div>
    </div>
  );
}
