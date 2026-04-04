'use client';

import { useState, useMemo } from 'react';
import { exchangeRates } from '@/data/exchangeRates';

function Pill({ text, up }: { text: string; up: boolean }) {
  return (
    <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${up ? 'bg-[#4ade80]/15 text-[#4ade80]' : 'bg-[#f87171]/15 text-[#f87171]'}`}>
      {up ? '▲' : '▼'} {text}
    </span>
  );
}

const RATES: Record<string, number> = { LRD: 1, USD: 192.50, EUR: 209.85, GBP: 243.15, NGN: 0.124, GHS: 14.82 };

export default function ForexPage() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('LRD');
  const currs = Object.keys(RATES);

  const converted = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    return ((amt * RATES[from]) / RATES[to]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, from, to]);

  const rate = (RATES[from] / RATES[to]).toFixed(4);

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8">
      <h1 className="mb-1 text-[24px] font-black text-white">Currency & Forex</h1>
      <p className="mb-8 text-[13px] text-[#666]">Live exchange rates · Liberian Dollar (LRD) base · Updated Apr 1, 2026</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Converter */}
        <div className="rounded-lg border border-[#2a2a2a] bg-[#161618] p-5">
          <h2 className="mb-4 text-[15px] font-bold text-white">Currency Converter</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#555]">Amount</label>
              <div className="flex overflow-hidden rounded border border-[#2a2a2a] transition focus-within:border-[#6001d2] focus-within:ring-1 focus-within:ring-[#6001d2]/20">
                <input type="number" value={amount} min="0" onChange={e => setAmount(e.target.value)}
                  className="tabular-nums w-full px-3 py-2.5 text-[14px] font-bold text-white outline-none bg-[#1c1c1e]" />
                <select value={from} onChange={e => setFrom(e.target.value)}
                  className="border-l border-[#2a2a2a] bg-[#222] px-2 py-2 text-[13px] font-bold text-white outline-none">
                  {currs.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[#222]" />
              <button onClick={() => { const tmp = from; setFrom(to); setTo(tmp); }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#1c1c1e] text-[#666] transition hover:border-[#6001d2] hover:text-[#a78bfa]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
              <div className="h-px flex-1 bg-[#222]" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#555]">Converted</label>
              <div className="flex overflow-hidden rounded border border-[#2a2a2a] bg-[#1c1c1e]">
                <div className="tabular-nums w-full px-3 py-2.5 text-[14px] font-bold text-white">{converted}</div>
                <select value={to} onChange={e => setTo(e.target.value)}
                  className="border-l border-[#2a2a2a] bg-[#222] px-2 py-2 text-[13px] font-bold text-white outline-none">
                  {currs.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <p className="text-center text-[12px] text-[#666]">
              1 {from} = <span className="tabular-nums font-bold text-white">{rate}</span> {to}
            </p>
          </div>
        </div>

        {/* Rate table */}
        <div className="lg:col-span-2 rounded-lg border border-[#2a2a2a] bg-[#161618] overflow-hidden">
          <div className="border-b border-[#222] px-5 py-3">
            <h2 className="text-[15px] font-bold text-white">Exchange Rate Table</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="border-b border-[#1e1e20] text-[11px] font-semibold uppercase tracking-wide text-[#555]">
                <tr>
                  <th className="px-5 py-3 text-left">Pair</th>
                  <th className="px-5 py-3 text-right">Rate</th>
                  <th className="px-5 py-3 text-right">Change</th>
                  <th className="px-5 py-3 text-right">% Chg</th>
                  <th className="hidden sm:table-cell px-5 py-3 text-right">52W High</th>
                  <th className="hidden sm:table-cell px-5 py-3 text-right">52W Low</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e20]">
                {exchangeRates.map(r => (
                  <tr key={r.pair} className="hover:bg-[#1c1c1e] transition-colors">
                    <td className="px-5 py-3 font-bold text-[#a78bfa]">{r.pair}</td>
                    <td className="tabular-nums px-5 py-3 text-right font-semibold text-white">{r.rate.toFixed(4)}</td>
                    <td className={`tabular-nums px-5 py-3 text-right font-semibold ${r.change >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                      {r.change >= 0 ? '+' : ''}{r.change.toFixed(4)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Pill text={`${Math.abs(r.changePercent).toFixed(2)}%`} up={r.changePercent >= 0} />
                    </td>
                    <td className="hidden sm:table-cell tabular-nums px-5 py-3 text-right text-[#777]">{r.high52w.toFixed(4)}</td>
                    <td className="hidden sm:table-cell tabular-nums px-5 py-3 text-right text-[#777]">{r.low52w.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-[#1e1e20] px-5 py-2 text-[11px] text-[#444]">
            Source: Central Bank of Liberia · Updated Apr 1, 2026
          </div>
        </div>
      </div>
    </main>
  );
}
