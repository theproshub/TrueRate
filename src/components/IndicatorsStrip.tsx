'use client';

import { useEffect, useState } from 'react';
import type { TickerItem } from '@/data/ticker-seed';

export default function IndicatorsStrip({ initial }: { initial: TickerItem[] }) {
  const [items, setItems] = useState<TickerItem[]>(initial);

  useEffect(() => {
    Promise.all([
      fetch('/api/rates').then(r => r.json()).catch(() => null),
      fetch('/api/indicators').then(r => r.json()).catch(() => null),
    ]).then(([ratesData, indicatorsData]) => {
      const next: TickerItem[] = [...initial];

      if (ratesData?.rates?.length) {
        const rMap: Record<string, { rate: number; changePercent: number }> = {};
        for (const r of ratesData.rates) rMap[r.from] = r;

        const fxMap: Record<string, string> = { USD: 'LRD/USD', EUR: 'LRD/EUR', GBP: 'LRD/GBP' };
        for (const [from, label] of Object.entries(fxMap)) {
          const r = rMap[from];
          if (!r) continue;
          const idx = next.findIndex(x => x.label === label);
          if (idx === -1) continue;
          const pct = r.changePercent;
          next[idx] = {
            label,
            value: r.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            pct: `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`,
            up: pct >= 0,
          };
        }
      }

      if (indicatorsData?.indicators?.length) {
        const iMap: Record<string, { value: number; changePercent: number | null }> = {};
        for (const ind of indicatorsData.indicators) iMap[ind.key] = ind;

        const macroMap: Record<string, { label: string; fmt: (v: number) => string; pctLabel: string }> = {
          GDP_GROWTH: { label: 'GDP Growth', fmt: v => `${v.toFixed(1)}%`, pctLabel: 'YoY' },
          INFLATION:  { label: 'Inflation',  fmt: v => `${v.toFixed(1)}%`, pctLabel: 'YoY' },
        };
        for (const [key, meta] of Object.entries(macroMap)) {
          const ind = iMap[key];
          if (!ind) continue;
          const idx = next.findIndex(x => x.label === meta.label);
          if (idx === -1) continue;
          const cp = ind.changePercent;
          next[idx] = {
            label: meta.label,
            value: meta.fmt(ind.value),
            pct: meta.pctLabel,
            up: cp !== null ? cp >= 0 : true,
          };
        }
      }

      setItems(next);
    });
  }, [initial]);

  const Tile = ({ item, size }: { item: TickerItem; size: 'sm' | 'lg' }) => (
    <div className={`shrink-0 flex flex-col border-r border-white/[0.07] ${size === 'lg' ? 'px-5 py-2.5' : 'px-4 py-2.5'}`}>
      <span className={`font-semibold text-white whitespace-nowrap ${size === 'lg' ? 'text-[13px]' : 'text-[12px]'}`}>{item.label}</span>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className={`tabular-nums text-gray-400 whitespace-nowrap ${size === 'lg' ? 'text-[13px]' : 'text-[12px]'}`}>{item.value}</span>
        <span className={`tabular-nums font-bold whitespace-nowrap ${size === 'lg' ? 'text-[12px]' : 'text-[11px]'} ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
          {size === 'lg' && (item.up ? '▲' : '▼')}{item.pct}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-[#040c10] border-b border-white/[0.05]">
      <div className="mx-auto max-w-[1320px]">
        <div className="sm:hidden overflow-hidden">
          <div className="ticker-scroll flex">
            {[...items, ...items].map((item, i) => <Tile key={i} item={item} size="sm" />)}
          </div>
        </div>
        <div className="hidden sm:block overflow-hidden">
          <div className="ticker-scroll flex">
            {[...items, ...items].map((item, i) => <Tile key={i} item={item} size="lg" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
