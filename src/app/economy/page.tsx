import { economicIndicators } from '@/data/economicIndicators';

function Pill({ text, up }: { text: string; up: boolean }) {
  return (
    <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${up ? 'bg-[#4ade80]/15 text-[#4ade80]' : 'bg-[#f87171]/15 text-[#f87171]'}`}>
      {up ? '▲' : '▼'} {text}
    </span>
  );
}

const SUMMARY_STATS = [
  { label: 'GDP (2025)',         value: '$4.33B',  sub: '+4.34% growth',   up: true  },
  { label: 'Inflation Rate',     value: '10.2%',   sub: 'Year-on-year',    up: false },
  { label: 'CBL Policy Rate',    value: '17.50%',  sub: 'Steady',          up: true  },
  { label: 'Unemployment',       value: '3.6%',    sub: '-5.26% vs prior', up: true  },
  { label: 'Trade Balance',      value: '-$0.82B', sub: 'Improving',       up: true  },
  { label: 'Debt / GDP',         value: '55.4%',   sub: '+2.21pp',         up: false },
];

export default function EconomyPage() {
  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8">
      <h1 className="mb-1 text-[24px] font-black text-white">Liberia Economy</h1>
      <p className="mb-8 text-[13px] text-[#666]">Key macroeconomic indicators · Sources: CBL, World Bank, IMF · Updated Apr 1, 2026</p>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SUMMARY_STATS.map(s => (
          <div key={s.label} className="rounded-lg border border-[#2a2a2a] bg-[#161618] p-4">
            <div className="text-[11px] text-[#555] mb-1">{s.label}</div>
            <div className="text-[20px] font-black tabular-nums text-white">{s.value}</div>
            <div className={`mt-1 text-[11px] font-semibold ${s.up ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Indicators table */}
      <div className="rounded-lg border border-[#2a2a2a] bg-[#161618] overflow-hidden">
        <div className="border-b border-[#222] px-5 py-3">
          <h2 className="text-[15px] font-bold text-white">Economic Indicators</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="border-b border-[#1e1e20] text-[11px] font-semibold uppercase tracking-wide text-[#555]">
              <tr>
                <th className="px-5 py-3 text-left">Indicator</th>
                <th className="px-5 py-3 text-right">Value</th>
                <th className="px-5 py-3 text-right">Unit</th>
                <th className="px-5 py-3 text-right">Change</th>
                <th className="px-5 py-3 text-right">% Chg</th>
                <th className="hidden sm:table-cell px-5 py-3 text-left">Period</th>
                <th className="hidden md:table-cell px-5 py-3 text-left">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e20]">
              {economicIndicators.map(ind => (
                <tr key={ind.name} className="hover:bg-[#1c1c1e] transition-colors">
                  <td className="px-5 py-3 font-semibold text-white">{ind.name}</td>
                  <td className="tabular-nums px-5 py-3 text-right font-bold text-white">
                    {ind.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3 text-right text-[#555]">{ind.unit}</td>
                  <td className={`tabular-nums px-5 py-3 text-right font-semibold ${ind.change >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                    {ind.change >= 0 ? '+' : ''}{ind.change.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Pill text={`${Math.abs(ind.changePercent).toFixed(2)}%`} up={ind.changePercent >= 0} />
                  </td>
                  <td className="hidden sm:table-cell px-5 py-3 text-[#666]">{ind.period}</td>
                  <td className="hidden md:table-cell px-5 py-3 text-[#555]">{ind.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#1e1e20] px-5 py-2 text-[11px] text-[#444]">
          Sources: Central Bank of Liberia · World Bank · IMF · Updated Apr 1, 2026
        </div>
      </div>
    </main>
  );
}
