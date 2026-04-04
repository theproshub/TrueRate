'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { stocks } from '@/data/stocks';

type SortKey = 'name' | 'price' | 'change' | 'changePercent' | 'volume' | 'marketCap';

function Pill({ text, up }: { text: string; up: boolean }) {
  return (
    <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${up ? 'bg-[#4ade80]/15 text-[#4ade80]' : 'bg-[#f87171]/15 text-[#f87171]'}`}>
      {up ? '▲' : '▼'} {text}
    </span>
  );
}

export default function MarketsPage() {
  const [sortKey, setSortKey] = useState<SortKey>('changePercent');
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState('');

  const sorted = useMemo(() => {
    const filtered = stocks.filter(s =>
      s.ticker.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
    );
    return filtered.sort((a, b) => {
      let av: string | number = a[sortKey];
      let bv: string | number = b[sortKey];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      return sortAsc ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
    });
  }, [sortKey, sortAsc, search]);

  const SH = ({ k, label, right = true }: { k: SortKey; label: string; right?: boolean }) => (
    <th
      onClick={() => { if (sortKey === k) { setSortAsc(!sortAsc); } else { setSortKey(k); setSortAsc(false); } }}
      className={`cursor-pointer select-none px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#555] hover:text-[#ccc] transition-colors ${right ? 'text-right' : 'text-left'}`}
    >
      {label} <span className="text-[10px]">{sortKey === k ? (sortAsc ? '▲' : '▼') : '⇅'}</span>
    </th>
  );

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-black text-white">West Africa Markets</h1>
          <p className="mt-0.5 text-[13px] text-[#666]">Prices in LRD · 15-minute delay</p>
        </div>
        <input
          type="text"
          placeholder="Search symbol or company…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded bg-[#1c1c1e] border border-[#2a2a2a] px-4 py-2 text-[13px] text-white outline-none focus:border-[#6001d2] placeholder:text-[#555] w-full sm:w-[260px]"
        />
      </div>

      <div className="rounded-lg border border-[#2a2a2a] bg-[#161618] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="border-b border-[#222] bg-[#111]">
              <tr>
                <SH k="name" label="Symbol" right={false} />
                <SH k="price" label="Price" />
                <SH k="change" label="Change" />
                <SH k="changePercent" label="% Chg" />
                <SH k="volume" label="Volume" />
                <SH k="marketCap" label="Market Cap" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e20]">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#555]">No results for &quot;{search}&quot;</td>
                </tr>
              ) : sorted.map(s => (
                <tr key={s.ticker} className="hover:bg-[#1c1c1e] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/markets?symbol=${s.ticker}`} className="font-bold text-[#a78bfa] no-underline hover:underline">{s.ticker}</Link>
                    <span className="ml-2 text-[12px] text-[#555]">{s.name}</span>
                  </td>
                  <td className="tabular-nums px-4 py-3 text-right font-semibold text-white">
                    {s.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`tabular-nums px-4 py-3 text-right font-semibold ${s.change >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                    {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}
                  </td>
                  <td className="tabular-nums px-4 py-3 text-right">
                    <Pill text={`${Math.abs(s.changePercent).toFixed(2)}%`} up={s.changePercent >= 0} />
                  </td>
                  <td className="tabular-nums px-4 py-3 text-right text-[#777]">{s.volume}</td>
                  <td className="tabular-nums px-4 py-3 text-right text-[#777]">{s.marketCap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[12px] text-[#555]">
        <span>Showing {sorted.length} of {stocks.length} securities</span>
        <Link href="/screener" className="text-[#a78bfa] no-underline hover:underline">Advanced Screener →</Link>
      </div>
    </main>
  );
}
