import Link from 'next/link';

const EARNINGS = [
  { ticker: 'AMTL', name: 'ArcelorMittal Liberia',  date: 'Apr 8, 2026',  eps: '$0.42', est: '$0.38', beat: true,  sector: 'Mining'     },
  { ticker: 'ETI',  name: 'Ecobank Transnational',  date: 'Apr 10, 2026', eps: '$1.15', est: '$1.12', beat: true,  sector: 'Banking'    },
  { ticker: 'LPRC', name: 'Liberia Petroleum',      date: 'Apr 14, 2026', eps: '$0.08', est: '$0.10', beat: false, sector: 'Energy'     },
  { ticker: 'FSLR', name: 'Firestone Liberia',      date: 'Apr 17, 2026', eps: '$2.80', est: '$2.85', beat: false, sector: 'Agriculture'},
  { ticker: 'LSCM', name: 'Lonestar Cell MTN',      date: 'Apr 22, 2026', eps: '$0.34', est: '$0.32', beat: true,  sector: 'Telecom'    },
  { ticker: 'BOAB', name: 'Bank of Africa BRVM',    date: 'Apr 25, 2026', eps: '₣0.95', est: '₣0.90', beat: true,  sector: 'Banking'    },
  { ticker: 'GOLD', name: 'Gold Futures (expiry)',  date: 'Apr 30, 2026', eps: '—',     est: '—',     beat: true,  sector: 'Commodities'},
];

export default function EarningsPage() {
  const upcoming = EARNINGS.filter((_, i) => i >= 2);
  const recent   = EARNINGS.filter((_, i) => i < 2);

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8">
      <h1 className="mb-1 text-[24px] font-black text-white">Earnings Calendar</h1>
      <p className="mb-8 text-[13px] text-[#666]">Upcoming and recent earnings reports · West Africa listed companies</p>

      {/* Recent */}
      <section className="mb-8">
        <h2 className="mb-3 text-[15px] font-bold text-white">Recent Results</h2>
        <div className="rounded-lg border border-[#2a2a2a] bg-[#161618] divide-y divide-[#1e1e20] overflow-hidden">
          {recent.map(e => (
            <div key={e.ticker} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[#1c1c1e] transition-colors">
              <div className="min-w-0 flex-1">
                <Link href={`/markets?symbol=${e.ticker}`} className="text-[14px] font-bold text-[#a78bfa] no-underline hover:underline">{e.ticker}</Link>
                <span className="ml-2 text-[13px] text-[#777]">{e.name}</span>
                <span className="ml-2 rounded bg-[#2a2a2a] px-2 py-0.5 text-[10px] text-[#555]">{e.sector}</span>
              </div>
              <div className="flex shrink-0 items-center gap-6 text-right">
                <div><div className="text-[10px] text-[#555]">Date</div><div className="text-[13px] font-semibold text-white">{e.date}</div></div>
                <div><div className="text-[10px] text-[#555]">EPS</div><div className="tabular-nums text-[13px] font-bold text-white">{e.eps}</div></div>
                <div className="hidden sm:block"><div className="text-[10px] text-[#555]">Est.</div><div className="tabular-nums text-[13px] text-[#777]">{e.est}</div></div>
                <span className={`rounded px-2.5 py-1 text-[12px] font-bold ${e.beat ? 'bg-[#4ade80]/15 text-[#4ade80]' : 'bg-[#f87171]/15 text-[#f87171]'}`}>
                  {e.beat ? 'BEAT' : 'MISS'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming */}
      <section>
        <h2 className="mb-3 text-[15px] font-bold text-white">Upcoming Reports</h2>
        <div className="rounded-lg border border-[#2a2a2a] bg-[#161618] divide-y divide-[#1e1e20] overflow-hidden">
          {upcoming.map(e => (
            <div key={e.ticker} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[#1c1c1e] transition-colors">
              <div className="min-w-0 flex-1">
                <Link href={`/markets?symbol=${e.ticker}`} className="text-[14px] font-bold text-[#a78bfa] no-underline hover:underline">{e.ticker}</Link>
                <span className="ml-2 text-[13px] text-[#777]">{e.name}</span>
                <span className="ml-2 rounded bg-[#2a2a2a] px-2 py-0.5 text-[10px] text-[#555]">{e.sector}</span>
              </div>
              <div className="flex shrink-0 items-center gap-6 text-right">
                <div><div className="text-[10px] text-[#555]">Date</div><div className="text-[13px] font-semibold text-white">{e.date}</div></div>
                <div><div className="text-[10px] text-[#555]">Est. EPS</div><div className="tabular-nums text-[13px] font-bold text-[#777]">{e.est}</div></div>
                <span className="rounded bg-[#6001d2]/20 px-2.5 py-1 text-[12px] font-bold text-[#a78bfa]">UPCOMING</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
