'use client';

import { useEffect, useState } from 'react';

type Rate = { pair: string; from: string; rate: number; change?: number; changePercent?: number };
type Indicator = { key: string; name: string; value: number; unit: string; change?: number; changePercent?: number };

type Chip = { label: string; value: string; change: number | null; pct: number | null };

const FX_SHOW = ['USD', 'EUR', 'GBP'];
const IND_SHOW = ['CBL_RATE'];

function fmt(n: number, dec = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function SkeletonChip() {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-r border-[#E5E5E0] last:border-r-0">
      <div className="h-3 w-14 bg-[#ECECEA] motion-safe:animate-pulse rounded-sm" />
      <div className="h-3 w-12 bg-[#ECECEA] motion-safe:animate-pulse rounded-sm" />
    </div>
  );
}

export default function MarketRibbon() {
  const [chips, setChips] = useState<Chip[] | null>(null);
  const [asOf, setAsOf] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/rates').then((r) => r.json()).catch(() => null),
      fetch('/api/indicators').then((r) => r.json()).catch(() => null),
    ]).then(([rd, id]) => {
      if (cancelled) return;
      const next: Chip[] = [];

      const rates: Rate[] = rd?.rates ?? [];
      for (const from of FX_SHOW) {
        const r = rates.find((x) => x.from === from);
        if (r) next.push({ label: `${from}/LRD`, value: fmt(r.rate), change: r.change ?? null, pct: r.changePercent ?? null });
      }

      const inds: Indicator[] = id?.indicators ?? [];
      for (const key of IND_SHOW) {
        const ind = inds.find((x) => x.key === key);
        if (ind) next.push({ label: ind.name, value: ind.unit === '%' ? `${ind.value}%` : `${ind.value}`, change: ind.change ?? null, pct: ind.changePercent ?? null });
      }

      if (rd?.date) setAsOf(rd.date);
      setChips(next.length > 0 ? next : null);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="border-b border-[#E5E5E0] bg-white">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="flex items-center overflow-x-auto scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0">
          {chips === null ? (
            <>
              <SkeletonChip />
              <SkeletonChip />
              <SkeletonChip />
              <SkeletonChip />
            </>
          ) : (
            chips.map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-2 shrink-0 px-4 py-2.5 border-r border-[#E5E5E0] last:border-r-0 text-[13px]"
              >
                <span className="font-semibold text-[#333]">{c.label}</span>
                <span className="font-bold tabular-nums text-[#0A0A0A]">{c.value}</span>
                {c.change != null && (
                  <span className={`tabular-nums font-medium text-[12px] ${c.change >= 0 ? 'text-[#00A650]' : 'text-[#D91400]'}`}>
                    {c.change >= 0 ? '+' : ''}{fmt(c.change)}
                    {c.pct != null && <span className="ml-0.5">({c.change >= 0 ? '+' : ''}{fmt(c.pct)}%)</span>}
                  </span>
                )}
              </div>
            ))
          )}

          {asOf && (
            <span className="ml-auto shrink-0 pl-4 text-[10px] text-[#AAA] font-medium whitespace-nowrap">
              CBL data &middot; as of {asOf}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
