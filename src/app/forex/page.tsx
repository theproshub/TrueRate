/**
 * Forex page — Server Component.
 */

import Link from 'next/link';
import ForexClient from './ForexClient';
import CurrencyConverter from '@/components/CurrencyConverter';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { exchangeRates } from '@/data/exchangeRates';
import type { NormalizedRate } from '@/app/api/rates/route';

export const revalidate = 3600;

function seedToNormalized(): NormalizedRate[] {
  return exchangeRates.map(r => ({
    pair: r.pair,
    from: r.from,
    to: r.to,
    rate: r.rate,
    change: r.change,
    changePercent: r.changePercent,
    high52w: r.high52w,
    low52w: r.low52w,
  }));
}

export default function ForexPage() {
  const seedRates = seedToNormalized();

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-5">
        <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
        <span>/</span>
        <span className="text-gray-400">Forex</span>
      </div>

      <ForexClient seedRates={seedRates} seedDate={null} />

      {/* CBL Policy Updates */}
      <section className="mt-8">
        <div className="rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-3 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-white">CBL Policy Updates</h2>
            <span className="text-[11px] text-gray-500">Central Bank of Liberia</span>
          </div>
          <ul className="divide-y divide-white/[0.05]">
            {[
              {
                title: 'CBL intervenes with $4.2M in open-market operations to stabilise LRD',
                desc: 'The Central Bank of Liberia conducted its second forex intervention of Q2 2026, injecting US dollars into the interbank market to curb LRD depreciation pressure.',
                tag: 'Forex Intervention',
                date: 'Apr 2, 2026',
              },
              {
                title: 'Monetary Policy Committee holds benchmark rate at 20% amid inflation watch',
                desc: 'The MPC voted unanimously to maintain the policy rate, citing stabilising food prices and a gradual improvement in the current account balance.',
                tag: 'Policy Statement',
                date: 'Mar 28, 2026',
              },
              {
                title: 'CBL issues new guidelines on foreign-currency lending by commercial banks',
                desc: 'New prudential rules cap USD-denominated loans at 60% of a bank\'s total loan book, aiming to reduce dollarisation and support LRD circulation.',
                tag: 'Regulation',
                date: 'Mar 20, 2026',
              },
            ].map((item, i) => (
              <li key={i}>
                <Link href="/forex" className="group flex items-start gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors no-underline">
                  <NewsThumbnail
                    category="forex"
                    className="shrink-0 w-[110px] h-[62px]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{item.tag}</span>
                      <span className="text-gray-500">·</span>
                      <span className="text-[11px] text-gray-400">{item.date}</span>
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

      {/* Currency Converter */}
      <section className="mt-8">
        <CurrencyConverter />
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
            <div key={i} className="rounded-xl border border-white/[0.07] bg-brand-card p-5">
              <p className="mb-4 text-[13px] leading-relaxed text-gray-300 line-clamp-4 border-l-2 border-white/[0.10] pl-4">{card.quote}</p>
              <div className="border-t border-white/[0.06] pt-3">
                <div className="text-[13px] font-semibold text-white">{card.analyst}</div>
                <div className="text-[11px] text-gray-500">{card.role} · {card.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commodity-Linked FX */}
      <section className="mt-8">
        <div className="rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-3">
            <h2 className="text-[15px] font-bold text-white">Commodity-Linked FX</h2>
            <p className="mt-0.5 text-[11px] text-gray-400">How Liberia&apos;s commodity export performance influences LRD strength</p>
          </div>
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full min-w-[580px] text-[13px]">
              <thead className="border-b border-white/[0.05] text-[11px] font-semibold uppercase tracking-wide text-gray-400">
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
                  { commodity: 'Rubber',    value: '$312M', share: '28.4%', sensitivity: 'High',     up: true,  note: 'Every 10% rise in global rubber prices correlates with ~1.8% LRD appreciation over 60 days.' },
                  { commodity: 'Iron Ore',  value: '$278M', share: '25.3%', sensitivity: 'High',     up: true,  note: 'ArcelorMittal Nimba shipments drive the largest single FX inflow per export season.' },
                  { commodity: 'Gold',      value: '$196M', share: '17.8%', sensitivity: 'Moderate', up: true,  note: 'Artisanal and industrial mining proceeds; USD-denominated, providing partial natural hedge.' },
                  { commodity: 'Palm Oil',  value: '$143M', share: '13.0%', sensitivity: 'Moderate', up: false, note: 'Declining global prices in 2025 exerted mild downward pressure on Q3 LRD performance.' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3 font-bold text-white">{row.commodity}</td>
                    <td className="tabular-nums px-5 py-3 text-right font-semibold text-white">{row.value}</td>
                    <td className="tabular-nums px-5 py-3 text-right text-gray-400">{row.share}</td>
                    <td className={`px-5 py-3 text-right text-[13px] font-semibold ${row.up ? 'text-brand-accent' : 'text-red-400'}`}>
                      {row.sensitivity}
                    </td>
                    <td className="px-5 py-3 text-[12px] text-gray-500 max-w-[320px]">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-white/[0.05] px-5 py-2 text-[11px] text-gray-500">
            Source: Liberia Revenue Authority · National Bureau of Statistics · 2025
          </div>
        </div>
      </section>

      {/* West Africa FX Comparison */}
      <section className="mt-8 mb-2">
        <h2 className="mb-4 text-[17px] font-bold text-white">West Africa FX Comparison</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { country: 'Liberia',      currency: 'LRD', name: 'Liberian Dollar',        rateVsUSD: '192.50',    change30d: '+0.42%', up: true  },
            { country: 'Nigeria',      currency: 'NGN', name: 'Nigerian Naira',          rateVsUSD: '1,605.30',  change30d: '-3.12%', up: false },
            { country: 'Ghana',        currency: 'GHS', name: 'Ghanaian Cedi',           rateVsUSD: '15.84',     change30d: '-1.07%', up: false },
            { country: 'Sierra Leone', currency: 'SLL', name: 'Sierra Leonean Leone',    rateVsUSD: '22,750',    change30d: '+0.18%', up: true  },
          ].map((item, i) => (
            <Link key={i} href="/forex" className="group block rounded-xl border border-white/[0.07] bg-brand-card p-5 hover:border-white/[0.14] transition-colors no-underline">
              <div className="mb-3">
                <div className="text-[13px] font-bold text-white">{item.country}</div>
                <div className="text-[11px] text-gray-500">{item.name}</div>
              </div>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">Rate vs USD</div>
              <div className="tabular-nums mb-3 text-[22px] font-bold text-white leading-none">
                {item.rateVsUSD}
                <span className="ml-1.5 text-[12px] font-semibold text-gray-500">{item.currency}</span>
              </div>
              <span className={`tabular-nums text-[12px] font-semibold ${item.up ? 'text-brand-accent' : 'text-red-400'}`}>
                {item.up ? '▲' : '▼'} {item.change30d} 30d
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
