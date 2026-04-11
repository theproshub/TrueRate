import Link from 'next/link';

const REPORTS = [
  { title: 'Liberia Mining Sector Outlook Q2 2026', category: 'Sector', date: 'Apr 1, 2026', pages: 18, premium: false },
  { title: 'ArcelorMittal Liberia: Initiation of Coverage', category: 'Equity', date: 'Mar 28, 2026', pages: 24, premium: true  },
  { title: 'LRD Stability Analysis: CBL Reserve Management', category: 'Macro', date: 'Mar 25, 2026', pages: 12, premium: false },
  { title: 'West Africa Banking Sector: ETI & BOAB Comparison', category: 'Sector', date: 'Mar 20, 2026', pages: 31, premium: true  },
  { title: 'Rubber Market Dynamics: Firestone Harbel Study', category: 'Commodity', date: 'Mar 15, 2026', pages: 16, premium: false },
  { title: 'Liberia Sovereign Debt Sustainability Analysis', category: 'Fixed Income', date: 'Mar 10, 2026', pages: 22, premium: true  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Sector:       'text-[#60a5fa] bg-[#60a5fa]/10',
  Equity:       'text-brand-accent bg-[#a78bfa]/10',
  Macro:        'text-[#34d399] bg-[#34d399]/10',
  Commodity:    'text-[#fbbf24] bg-[#fbbf24]/10',
  'Fixed Income':'text-[#fb923c] bg-[#fb923c]/10',
};

export default function ResearchPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-8">
      <h1 className="mb-1 text-[26px] font-bold text-white">Research</h1>
      <p className="mb-8 text-[13px] text-gray-500">Equity research, macro analysis, and sector reports on Liberia & West Africa</p>

      <div className="flex flex-col gap-3">
        {REPORTS.map(r => (
          <div key={r.title} className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-brand-card px-5 py-4 hover:bg-white/[0.03] transition-colors">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${CATEGORY_COLORS[r.category] ?? 'text-brand-accent bg-[#a78bfa]/10'}`}>
                  {r.category}
                </span>
                {r.premium && (
                  <span className="rounded bg-[#6001d2]/30 px-2 py-0.5 text-[10px] font-bold text-brand-accent">Premium</span>
                )}
              </div>
              <h3 className="text-[14px] font-semibold text-white">{r.title}</h3>
              <div className="mt-1 text-[12px] text-gray-400">{r.date} · {r.pages} pages</div>
            </div>
            {r.premium ? (
              <Link href="/signin" className="shrink-0 rounded-xl border border-[#6001d2] px-4 py-2 text-[12px] font-semibold text-brand-accent transition hover:bg-[#6001d2]/20 no-underline">
                Unlock
              </Link>
            ) : (
              <button className="shrink-0 rounded-lg bg-white/[0.05] border border-white/[0.07] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-white/[0.04]">
                Read
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-[#6001d2]/40 bg-[#6001d2]/10 p-6 text-center">
        <h2 className="mb-2 text-[16px] font-bold text-white">Get access to all premium research</h2>
        <p className="mb-4 text-[13px] text-gray-500">Unlock all equity reports, macro analysis, and sector deep-dives with a Premium subscription.</p>
        <Link href="/signin" className="inline-block rounded-full bg-[#6001d2] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#490099] no-underline">
          Get Premium
        </Link>
      </div>
    </main>
  );
}
