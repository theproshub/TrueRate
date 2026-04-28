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

  const Item = ({ item }: { item: TickerItem }) => {
    const isDirectional = item.pct.startsWith('+') || item.pct.startsWith('-');
    const changeColor = item.up ? 'text-emerald-400' : 'text-red-400';
    const arrow = isDirectional ? (item.up ? '▲' : '▼') : '';
    return (
      <span className="shrink-0 inline-flex items-baseline gap-1.5 px-4 whitespace-nowrap">
        <span className="text-[12px] font-semibold text-white">{item.label}</span>
        <span className="text-[12px] tabular-nums text-gray-300">{item.value}</span>
        <span className={`text-[11px] tabular-nums font-semibold ${changeColor}`}>
          {arrow && <span className="mr-0.5">{arrow}</span>}
          {item.pct}
        </span>
      </span>
    );
  };

  const Separator = () => (
    <span aria-hidden="true" className="shrink-0 self-center h-3 w-px bg-white/10" />
  );

  return (
    <div
      role="region"
      aria-label="Live Liberian markets ticker"
      className="bg-[#040c10] border-b border-white/[0.05]"
    >
      <div className="mx-auto max-w-[1320px] overflow-hidden">
        <div className="ticker-scroll flex items-center h-9">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="flex items-center">
              <Item item={item} />
              <Separator />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
