'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { exchangeRates } from '@/data/exchangeRates';

function Pill({ text, up }: { text: string; up: boolean }) {
  return (
    <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${up ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
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
    <main className="mx-auto max-w-[1320px] px-4 py-8">
      <h1 className="mb-1 text-[26px] font-bold text-white">Currency & Forex</h1>
      <p className="mb-8 text-[13px] text-gray-500">Live exchange rates · Liberian Dollar (LRD) base · Updated Apr 1, 2026</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Converter */}
        <div className="rounded-xl border border-white/[0.07] bg-[#141418] p-5">
          <h2 className="mb-4 text-[15px] font-bold text-white">Currency Converter</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-600">Amount</label>
              <div className="flex overflow-hidden rounded border border-white/[0.07] transition focus-within:border-[#6001d2] focus-within:ring-1 focus-within:ring-[#6001d2]/20">
                <input type="number" value={amount} min="0" onChange={e => setAmount(e.target.value)}
                  className="tabular-nums w-full px-3 py-2.5 text-[14px] font-bold text-white outline-none bg-white/[0.05]" />
                <select value={from} onChange={e => setFrom(e.target.value)}
                  className="border-l border-white/[0.07] bg-[#222] px-2 py-2 text-[13px] font-bold text-white outline-none">
                  {currs.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[#222]" />
              <button onClick={() => { const tmp = from; setFrom(to); setTo(tmp); }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.05] text-gray-500 transition hover:border-[#6001d2] hover:text-[#a78bfa]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
              <div className="h-px flex-1 bg-[#222]" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-600">Converted</label>
              <div className="flex overflow-hidden rounded border border-white/[0.07] bg-white/[0.05]">
                <div className="tabular-nums w-full px-3 py-2.5 text-[14px] font-bold text-white">{converted}</div>
                <select value={to} onChange={e => setTo(e.target.value)}
                  className="border-l border-white/[0.07] bg-[#222] px-2 py-2 text-[13px] font-bold text-white outline-none">
                  {currs.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <p className="text-center text-[12px] text-gray-500">
              1 {from} = <span className="tabular-nums font-bold text-white">{rate}</span> {to}
            </p>
          </div>
        </div>

        {/* Rate table */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-3">
            <h2 className="text-[15px] font-bold text-white">Exchange Rate Table</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="border-b border-white/[0.05] text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="px-5 py-3 text-left">Pair</th>
                  <th className="px-5 py-3 text-right">Rate</th>
                  <th className="px-5 py-3 text-right">Change</th>
                  <th className="px-5 py-3 text-right">% Chg</th>
                  <th className="hidden sm:table-cell px-5 py-3 text-right">52W High</th>
                  <th className="hidden sm:table-cell px-5 py-3 text-right">52W Low</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {exchangeRates.map(r => (
                  <tr key={r.pair} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3 font-bold text-[#a78bfa]">{r.pair}</td>
                    <td className="tabular-nums px-5 py-3 text-right font-semibold text-white">{r.rate.toFixed(4)}</td>
                    <td className={`tabular-nums px-5 py-3 text-right font-semibold ${r.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {r.change >= 0 ? '+' : ''}{r.change.toFixed(4)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Pill text={`${Math.abs(r.changePercent).toFixed(2)}%`} up={r.changePercent >= 0} />
                    </td>
                    <td className="hidden sm:table-cell tabular-nums px-5 py-3 text-right text-gray-500">{r.high52w.toFixed(4)}</td>
                    <td className="hidden sm:table-cell tabular-nums px-5 py-3 text-right text-gray-500">{r.low52w.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-white/[0.05] px-5 py-2 text-[11px] text-gray-700">
            Source: Central Bank of Liberia · Updated Apr 1, 2026
          </div>
        </div>
      </div>

      {/* CBL Policy Updates */}
      <section className="mt-8">
        <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-3 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-white">CBL Policy Updates</h2>
            <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">Official</span>
          </div>
          <ul className="divide-y divide-white/[0.05]">
            {[
              {
                seed: 'cbl1',
                title: 'CBL intervenes with $4.2M in open-market operations to stabilise LRD',
                desc: 'The Central Bank of Liberia conducted its second forex intervention of Q2 2026, injecting US dollars into the interbank market to curb LRD depreciation pressure.',
                tag: 'Forex Intervention',
                date: 'Apr 2, 2026',
              },
              {
                seed: 'cbl2',
                title: 'Monetary Policy Committee holds benchmark rate at 20% amid inflation watch',
                desc: 'The MPC voted unanimously to maintain the policy rate, citing stabilising food prices and a gradual improvement in the current account balance.',
                tag: 'Policy Statement',
                date: 'Mar 28, 2026',
              },
              {
                seed: 'cbl3',
                title: 'CBL issues new guidelines on foreign-currency lending by commercial banks',
                desc: 'New prudential rules cap USD-denominated loans at 60% of a bank\'s total loan book, aiming to reduce dollarisation and support LRD circulation.',
                tag: 'Regulation',
                date: 'Mar 20, 2026',
              },
            ].map((item, i) => (
              <li key={i}>
                <Link href="/forex" className="group flex items-start gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors no-underline">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/seed/${item.seed}/120/68`}
                    alt=""
                    className="shrink-0 w-[110px] h-[62px] rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">{item.tag}</span>
                      <span className="text-[11px] text-gray-600">{item.date}</span>
                    </div>
                    <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-1">{item.title}</h3>
                    <p className="text-[12px] text-gray-500 line-clamp-2">{item.desc}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Market Commentary */}
      <section className="mt-8">
        <h2 className="mb-4 text-[17px] font-bold text-white">Market Commentary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              quote: 'The LRD has shown remarkable resilience in Q1 despite mounting import costs. CBL\'s proactive interventions are building credibility with the market.',
              analyst: 'Dr. Amara Koroma',
              role: 'Chief Economist, Ecobank Liberia',
              date: 'Apr 1, 2026',
            },
            {
              quote: 'Watch the rubber export window closely. Any positive surprise in Malaysian demand will translate directly into LRD strength — probably 1–2% appreciation.',
              analyst: 'Fatima Kollie',
              role: 'FX Strategist, GT Bank West Africa',
              date: 'Mar 31, 2026',
            },
            {
              quote: 'Remittance inflows are the unsung hero of Liberian FX stability. The diaspora corridor from the US continues to outperform every forecast.',
              analyst: 'James Tweh',
              role: 'Senior Analyst, Liberia Financial Intelligence Unit',
              date: 'Mar 29, 2026',
            },
            {
              quote: 'Dollarisation remains the structural risk. Until LRD is used for more domestic transactions, the CBL will keep fighting an uphill battle on volatility.',
              analyst: 'Bintu Massaquoi',
              role: 'Director of Research, AfDB West Africa Desk',
              date: 'Mar 27, 2026',
            },
          ].map((card, i) => (
            <Link key={i} href="/forex" className="group block rounded-xl border border-white/[0.07] bg-[#141418] p-5 hover:border-white/[0.15] transition-colors no-underline">
              <svg className="mb-3 h-5 w-5 text-[#6001d2] opacity-70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="mb-4 text-[13px] leading-relaxed text-gray-300 line-clamp-4 group-hover:text-white/80 transition-colors">{card.quote}</p>
              <div className="border-t border-white/[0.06] pt-3">
                <div className="text-[13px] font-semibold text-white">{card.analyst}</div>
                <div className="text-[11px] text-gray-500">{card.role} · {card.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Commodity-linked FX */}
      <section className="mt-8">
        <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-3">
            <h2 className="text-[15px] font-bold text-white">Commodity-Linked FX</h2>
            <p className="mt-0.5 text-[11px] text-gray-600">How Liberia&apos;s commodity export performance influences LRD strength</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="border-b border-white/[0.05] text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="px-5 py-3 text-left">Commodity</th>
                  <th className="px-5 py-3 text-right">Export Value (2025)</th>
                  <th className="px-5 py-3 text-right">% of Total Exports</th>
                  <th className="px-5 py-3 text-right">LRD Sensitivity</th>
                  <th className="px-5 py-3 text-left">Impact Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {[
                  { commodity: 'Rubber', icon: '🌿', value: '$312M', share: '28.4%', sensitivity: 'High', up: true, note: 'Every 10% rise in global rubber prices correlates with ~1.8% LRD appreciation over 60 days.' },
                  { commodity: 'Iron Ore', icon: '⛏️', value: '$278M', share: '25.3%', sensitivity: 'High', up: true, note: 'ArcelorMittal Nimba shipments drive the largest single FX inflow per export season.' },
                  { commodity: 'Gold', icon: '🥇', value: '$196M', share: '17.8%', sensitivity: 'Moderate', up: true, note: 'Artisanal and industrial mining proceeds; USD-denominated, providing partial natural hedge.' },
                  { commodity: 'Palm Oil', icon: '🌴', value: '$143M', share: '13.0%', sensitivity: 'Moderate', up: false, note: 'Declining global prices in 2025 exerted mild downward pressure on Q3 LRD performance.' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3 font-bold text-white">
                      <span className="mr-2">{row.icon}</span>{row.commodity}
                    </td>
                    <td className="tabular-nums px-5 py-3 text-right font-semibold text-white">{row.value}</td>
                    <td className="tabular-nums px-5 py-3 text-right text-gray-400">{row.share}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold ${row.up ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                        {row.sensitivity}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-gray-500 max-w-[320px]">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-white/[0.05] px-5 py-2 text-[11px] text-gray-700">
            Source: Liberia Revenue Authority · National Bureau of Statistics · Apr 2026
          </div>
        </div>
      </section>

      {/* West Africa FX Comparison */}
      <section className="mt-8 mb-2">
        <h2 className="mb-4 text-[17px] font-bold text-white">West Africa FX Comparison</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { flag: '🇱🇷', country: 'Liberia', currency: 'LRD', name: 'Liberian Dollar', rateVsUSD: '192.50', change30d: '+0.42%', up: true,  stability: 'Moderate', color: '#6001d2' },
            { flag: '🇳🇬', country: 'Nigeria',  currency: 'NGN', name: 'Nigerian Naira',  rateVsUSD: '1,605.30', change30d: '-3.12%', up: false, stability: 'Volatile',  color: '#ef4444' },
            { flag: '🇬🇭', country: 'Ghana',    currency: 'GHS', name: 'Ghanaian Cedi',   rateVsUSD: '15.84', change30d: '-1.07%', up: false, stability: 'Moderate', color: '#f59e0b' },
            { flag: '🇸🇱', country: 'Sierra Leone', currency: 'SLL', name: 'Sierra Leonean Leone', rateVsUSD: '22,750', change30d: '+0.18%', up: true, stability: 'Stable', color: '#10b981' },
          ].map((item, i) => (
            <Link key={i} href="/forex" className="group block rounded-xl border border-white/[0.07] bg-[#141418] p-5 hover:border-white/[0.15] transition-colors no-underline">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl leading-none">{item.flag}</span>
                <div>
                  <div className="text-[13px] font-bold text-white">{item.country}</div>
                  <div className="text-[11px] text-gray-500">{item.name}</div>
                </div>
              </div>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-600">Rate vs USD</div>
              <div className="tabular-nums mb-3 text-[22px] font-bold text-white leading-none">
                {item.rateVsUSD}
                <span className="ml-1.5 text-[12px] font-semibold text-gray-500">{item.currency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${item.up ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                  {item.up ? '▲' : '▼'} {item.change30d} 30d
                </span>
                <span className="text-[11px] font-semibold text-gray-500">{item.stability}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
