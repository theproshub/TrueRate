import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';

export const metadata: Metadata = {
  title: 'Broadcast Rights — TrueRate Sports',
  description: 'The TV and streaming deals powering African football, basketball, and athletics \u2014 values, expiry dates, and who&rsquo;s bidding next.',
};

const HERO = {
  title: "AFCON 2027 broadcast rights: the $340M deal, fully explained",
  summary: "Liberia\u2019s qualification has lifted regional viewership projections 12%. We map the rights-holders, the prize pool, and what CAF\u2019s next auction cycle will look like.",
  category: 'Football',
  source: 'TrueRate Sports Business',
  time: '1h ago',
};

const RIGHTS = [
  { competition: 'AFCON 2027',         holder: 'SuperSport / beIN',    value: '$340M', territory: 'Global',      expiry: '2027', cagr: '+14%' },
  { competition: 'Premier League',     holder: 'SuperSport',           value: '$180M', territory: 'Sub-Saharan', expiry: '2028', cagr: '+8%'  },
  { competition: 'UEFA Champions League', holder: 'Canal+ / StarTimes', value: '$95M', territory: 'West Africa', expiry: '2027', cagr: '+6%'  },
  { competition: 'NBA Africa / NBL',   holder: 'NBA Africa / DStv',    value: '$22M',  territory: 'Pan-Africa',  expiry: '2027', cagr: '+20%' },
  { competition: 'WAFU Cup',           holder: 'CAF Media',            value: '$12M',  territory: 'West Africa', expiry: '2026', cagr: '+10%' },
  { competition: 'LFA League',         holder: 'ELBC / Orange',        value: '$1.8M', territory: 'Liberia',     expiry: '2026', cagr: '+5%'  },
];

const DEALS_AT_A_GLANCE = [
  { label: 'Total active rights value (W. Africa)', value: '$651M', delta: '+11% YoY',  up: true },
  { label: 'Deals expiring in 2026',                 value: '3',     delta: '$15.6M at stake', up: true },
  { label: 'Streaming share of rights spend',        value: '28%',   delta: '+9pp YoY',  up: true },
  { label: 'SuperSport regional footprint',          value: '17 mkts', delta: 'Steady',  up: true },
];

const STORIES = [
  { category: 'Football',   title: "SuperSport vs beIN: the AFCON auction strategy, decoded",              summary: "Two bidders, one territory, and a three-year negotiation. Inside the commercial playbook.", source: 'TrueRate Sports', time: '3h ago' },
  { category: 'Football',   title: "Why Canal+ lost the Premier League \u2014 and what it pays next",         summary: "Subscription churn, currency exposure, and the pivot to rugby and Ligue 1.",                 source: 'Sportcal',        time: '8h ago' },
  { category: 'Basketball', title: "NBA Africa\u2019s streaming push: DStv renewal or direct-to-consumer?",    summary: "Ad-supported streaming numbers look strong, but retention remains the open question.",        source: 'TrueRate Sports', time: '1d ago' },
  { category: 'Football',   title: "The LFA\u2019s $1.8M TV deal: is it enough to cover referee wages?",       summary: "A breakdown of where every dollar of broadcast revenue goes in Liberian football.",           source: 'TrueRate Sports', time: '2d ago' },
];

const UPCOMING_AUCTIONS = [
  { comp: 'WAFU Cup (next cycle)',   date: 'Q3 2026', status: 'RFP open',    est: '$16M' },
  { comp: 'LFA League renewal',       date: 'Q4 2026', status: 'Scoping',     est: '$2.4M' },
  { comp: 'AFCON 2029 \u2014 early bids', date: 'Q1 2027', status: 'Pre-market',  est: '$380M' },
  { comp: 'NBL Africa extension',     date: 'Q1 2027', status: 'Negotiating', est: '$28M' },
];

export default function BroadcastRightsPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <main className="mx-auto max-w-[1320px] px-4 py-6">
        <div className="mb-6">
          <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label: 'Broadcast Rights' }]} />
        </div>

        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-2">Sports Business</p>
          <h1 className="text-[28px] sm:text-[36px] font-black leading-tight tracking-tight text-gray-900 mb-2">Broadcast Rights</h1>
          <p className="text-[14px] text-gray-500 max-w-[720px] leading-relaxed">Who&rsquo;s paying for African sport on TV and streaming, what each deal is worth, and when the next auctions happen.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {DEALS_AT_A_GLANCE.map(s => (
            <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">{s.label}</p>
              <p className="text-[20px] font-black text-gray-900 tabular-nums">{s.value}</p>
              <p className="text-[11px] font-semibold tabular-nums mt-0.5 text-emerald-500">{s.delta}</p>
            </div>
          ))}
        </div>

        <Link href="/sports" className="group flex flex-col lg:flex-row gap-0 overflow-hidden border border-gray-200 bg-white no-underline mb-8">
          <div className="w-full lg:w-[55%] shrink-0">
            <HeroVisual category={HERO.category} className="w-full h-[200px] sm:h-[260px] lg:h-full" />
          </div>
          <div className="flex flex-col justify-center px-5 py-6 lg:px-8 lg:py-8 flex-1">
            <span className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-500">{HERO.category}</span>
            <h2 className="text-[22px] font-black leading-snug text-gray-900 group-hover:text-gray-700 mb-3">{HERO.title}</h2>
            <p className="text-[14px] leading-relaxed text-gray-500 line-clamp-3 mb-4">{HERO.summary}</p>
            <div className="flex items-center gap-2 mt-auto text-[12px] text-gray-500">
              <span>{HERO.source}</span><span>·</span><span>{HERO.time}</span>
            </div>
          </div>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div>
            <div className="mb-10">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-0">
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Current rights deals</h2>
                <span className="text-[11px] text-gray-400 uppercase tracking-wide font-bold">Live contracts</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    <tr>
                      <th className="px-5 py-3 text-left">Competition</th>
                      <th className="px-5 py-3 text-left">Rights holder</th>
                      <th className="px-5 py-3 text-right">Value</th>
                      <th className="hidden sm:table-cell px-5 py-3 text-left">Territory</th>
                      <th className="hidden sm:table-cell px-5 py-3 text-right">Expiry</th>
                      <th className="hidden md:table-cell px-5 py-3 text-right">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {RIGHTS.map(r => (
                      <tr key={r.competition} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-bold text-gray-900">{r.competition}</td>
                        <td className="px-5 py-3 text-gray-500">{r.holder}</td>
                        <td className="tabular-nums px-5 py-3 text-right font-bold text-gray-900">{r.value}</td>
                        <td className="hidden sm:table-cell px-5 py-3 text-gray-500">{r.territory}</td>
                        <td className="hidden sm:table-cell tabular-nums px-5 py-3 text-right text-gray-500">{r.expiry}</td>
                        <td className="hidden md:table-cell tabular-nums px-5 py-3 text-right text-emerald-500 font-semibold">{r.cagr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                  <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Analysis</h2>
                </div>
              </div>
              <div className="flex flex-col divide-y divide-gray-100">
                {STORIES.map((s, i) => (
                  <Link key={i} href="/sports" className="group flex gap-3 sm:gap-4 py-5 first:pt-0 no-underline">
                    <div className="shrink-0 overflow-hidden"><NewsThumbnail category={s.category} className="h-[80px] w-[100px] sm:h-[90px] sm:w-[140px]" /></div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1.5 block">{s.category}</span>
                      <h3 className="text-[15px] font-black leading-snug text-gray-900 group-hover:text-gray-700 mb-1.5 line-clamp-2">{s.title}</h3>
                      <p className="text-[13px] leading-relaxed text-gray-500 line-clamp-2 mb-2">{s.summary}</p>
                      <div className="text-[12px] text-gray-400">{s.source} · {s.time}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-5">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="text-[13px] font-bold text-gray-900 mb-3">Upcoming auctions</h3>
              <div className="divide-y divide-gray-100">
                {UPCOMING_AUCTIONS.map(a => (
                  <div key={a.comp} className="py-3">
                    <p className="text-[13px] font-bold text-gray-900">{a.comp}</p>
                    <p className="text-[11px] text-gray-500 mb-1">{a.date} · {a.status}</p>
                    <p className="text-[12px] font-semibold text-emerald-600 tabular-nums">Est. {a.est}</p>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/sports/sponsorship" className="rounded-xl border border-gray-200 bg-white p-4 no-underline hover:border-gray-400 transition-colors">
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1">Next: Sponsorship →</p>
              <p className="text-[13px] text-gray-700 leading-relaxed">Shirt, kit, and federation sponsorships across West Africa.</p>
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
