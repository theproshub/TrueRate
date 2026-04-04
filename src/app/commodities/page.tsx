import { commodities } from '@/data/commodities';

function Pill({ text, up }: { text: string; up: boolean }) {
  return (
    <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${up ? 'bg-[#4ade80]/15 text-[#4ade80]' : 'bg-[#f87171]/15 text-[#f87171]'}`}>
      {up ? '▲' : '▼'} {text}
    </span>
  );
}

function Bar({ pct, up }: { pct: number; up: boolean }) {
  const width = Math.min(Math.abs(pct) * 12, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-[80px] rounded-full bg-[#222] overflow-hidden">
        <div className={`h-full rounded-full ${up ? 'bg-[#4ade80]' : 'bg-[#f87171]'}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function CommoditiesPage() {
  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8">
      <h1 className="mb-1 text-[24px] font-black text-white">Liberia Commodities</h1>
      <p className="mb-8 text-[13px] text-[#666]">Key export commodities · Prices in USD · Updated Apr 1, 2026</p>

      <div className="rounded-lg border border-[#2a2a2a] bg-[#161618] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="border-b border-[#222] bg-[#111] text-[11px] font-semibold uppercase tracking-wide text-[#555]">
              <tr>
                <th className="px-5 py-3 text-left">Commodity</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-right">Unit</th>
                <th className="px-5 py-3 text-right">Change</th>
                <th className="px-5 py-3 text-right">% Chg</th>
                <th className="hidden sm:table-cell px-5 py-3 text-left">Trend</th>
                <th className="hidden md:table-cell px-5 py-3 text-right">52W High</th>
                <th className="hidden md:table-cell px-5 py-3 text-right">52W Low</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e20]">
              {commodities.map(c => (
                <tr key={c.name} className="hover:bg-[#1c1c1e] transition-colors">
                  <td className="px-5 py-3 font-semibold text-white">{c.name}</td>
                  <td className="tabular-nums px-5 py-3 text-right font-bold text-white">
                    {c.currency === 'USD' ? '$' : ''}{c.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3 text-right text-[#555]">{c.unit}</td>
                  <td className={`tabular-nums px-5 py-3 text-right font-semibold ${c.change >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                    {c.change >= 0 ? '+' : ''}{c.change.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Pill text={`${Math.abs(c.changePercent).toFixed(2)}%`} up={c.changePercent >= 0} />
                  </td>
                  <td className="hidden sm:table-cell px-5 py-3">
                    <Bar pct={c.changePercent} up={c.changePercent >= 0} />
                  </td>
                  <td className="hidden md:table-cell tabular-nums px-5 py-3 text-right text-[#777]">
                    {c.currency === 'USD' ? '$' : ''}{c.high52w.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="hidden md:table-cell tabular-nums px-5 py-3 text-right text-[#777]">
                    {c.currency === 'USD' ? '$' : ''}{c.low52w.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#1e1e20] px-5 py-2 text-[11px] text-[#444]">
          Sources: World Bank · CBL · LME · Updated Apr 1, 2026
        </div>
      </div>
    </main>
  );
}
