import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { newsItems } from '@/data/news';
import CommoditiesClient from './CommoditiesClient';

export const metadata = {
  title: 'Commodities — TrueRate',
  description: 'Live commodity prices for rubber, iron ore, gold, and palm oil with Liberia export data and market analysis.',
};

const COMMODITY_NEWS = newsItems
  .filter(n => n.category === 'commodities' || n.category === 'economy')
  .slice(0, 6);

const MARKET_COMMENTARY = [
  {
    quote: 'Rubber continues to be Liberia\'s most reliable FX earner. If Thai supply disruptions persist through Q3, expect a meaningful appreciation tailwind for the LRD.',
    analyst: 'Dr. Amara Koroma',
    role: 'Chief Economist, Ecobank Liberia',
    date: 'Apr 1, 2026',
  },
  {
    quote: 'Iron ore at $108/tonne is below the fiscal breakeven for ArcelorMittal\'s Nimba expansion economics. The expansion thesis depends on a recovery to $115+ by H2.',
    analyst: 'James Tweh',
    role: 'Senior Commodities Analyst, TrueRate Research',
    date: 'Mar 30, 2026',
  },
  {
    quote: 'Gold is the quiet performer. Bea Mountain\'s production ramp and artisanal sector formalisation could add $40–60M to Liberia\'s annual export receipts by 2027.',
    analyst: 'Bintu Massaquoi',
    role: 'Director of Research, AfDB West Africa Desk',
    date: 'Mar 28, 2026',
  },
  {
    quote: 'Palm oil faces structural headwinds from RSPO sustainability requirements and the EU deforestation regulation. Liberian producers need certification support urgently.',
    analyst: 'Fatima Kollie',
    role: 'Agricultural Economist, World Bank Liberia',
    date: 'Mar 25, 2026',
  },
];

const GLOBAL_DRIVERS = [
  {
    driver: 'China Steel Slowdown',
    commodity: 'Iron Ore',
    impact: 'Bearish',
    detail: 'Chinese property construction contraction has pushed iron ore spot prices down 12% since January — directly threatening Liberia\'s largest export earner.',
    up: false,
  },
  {
    driver: 'Thai Rubber Disruption',
    commodity: 'Rubber',
    impact: 'Bullish',
    detail: 'Flooding in southern Thailand reduced latex output by an estimated 8% in Q1 2026, supporting global natural rubber prices and benefiting Firestone Harbel.',
    up: true,
  },
  {
    driver: 'Fed Rate Hold',
    commodity: 'Gold',
    impact: 'Bullish',
    detail: 'The Federal Reserve\'s extended pause keeps real rates elevated, but a weaker-than-expected US jobs print boosted gold as a store of value in March.',
    up: true,
  },
  {
    driver: 'EU Deforestation Regulation',
    commodity: 'Palm Oil',
    impact: 'Bearish',
    detail: 'The EU EUDR law, effective December 2024, requires due diligence proof that palm oil is deforestation-free — raising compliance costs for Liberian exporters.',
    up: false,
  },
];

const SECTOR_POLICY = [
  { date: 'Apr 3, 2026',  title: 'NIC approves two new rubber concession extensions in Grand Bassa',        tag: 'Agriculture' },
  { date: 'Mar 22, 2026', title: 'ArcelorMittal submits Phase 2 expansion environmental impact study',      tag: 'Mining' },
  { date: 'Mar 18, 2026', title: 'Liberia joins Africa Mining Vision implementation framework',              tag: 'Policy' },
  { date: 'Mar 10, 2026', title: 'FDA issues 4 new community forestry management agreements in Lofa County', tag: 'Timber' },
  { date: 'Mar 5, 2026',  title: 'Bea Mountain Mining announces $30M processing plant upgrade at Weasua',   tag: 'Mining' },
];

function timeAgo(d: string) {
  const days = Math.floor((new Date('2026-04-16').getTime() - new Date(d).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export default function CommoditiesPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Commodities' }]} />

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[26px] sm:text-[30px] font-black text-white leading-tight mb-1">Commodities</h1>
        <p className="text-[13px] text-gray-500">Live prices, export data, and market analysis for Liberia&apos;s commodity economy</p>
      </div>

      {/* Interactive client section */}
      <CommoditiesClient />

      {/* ── Global Price Drivers ── */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-black text-white border-l-[3px] border-brand-accent pl-3">Global Price Drivers</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GLOBAL_DRIVERS.map((d, i) => (
            <div key={i} className="rounded-xl border border-white/[0.07] bg-brand-card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-0.5">{d.commodity}</div>
                  <h3 className="text-[14px] font-bold text-white">{d.driver}</h3>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  d.up ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                }`}>
                  {d.impact}
                </span>
              </div>
              <p className="text-[12px] leading-relaxed text-gray-400 font-montserrat">{d.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Market Commentary ── */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-black text-white border-l-[3px] border-brand-accent pl-3">Market Commentary</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MARKET_COMMENTARY.map((c, i) => (
            <div key={i} className="rounded-xl border border-white/[0.07] bg-brand-card p-5">
              <p className="text-[13px] leading-relaxed text-gray-300 border-l-2 border-white/[0.10] pl-4 mb-4 font-montserrat line-clamp-4">{c.quote}</p>
              <div className="border-t border-white/[0.06] pt-3">
                <div className="text-[13px] font-semibold text-white">{c.analyst}</div>
                <div className="text-[11px] text-gray-500">{c.role} · {c.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sector Policy Updates ── */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-black text-white border-l-[3px] border-brand-accent pl-3">Sector Policy Updates</h2>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden divide-y divide-white/[0.05]">
          {SECTOR_POLICY.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="shrink-0 w-[100px]">
                <span className="text-[11px] text-gray-400">{item.date}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white leading-snug">{item.title}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                item.tag === 'Mining'       ? 'bg-orange-500/15 text-orange-400' :
                item.tag === 'Agriculture'  ? 'bg-lime-500/15 text-lime-400'     :
                item.tag === 'Timber'       ? 'bg-green-500/15 text-green-400'   :
                                              'bg-white/[0.07] text-gray-400'
              }`}>{item.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Related News ── */}
      {COMMODITY_NEWS.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[18px] font-black text-white border-l-[3px] border-brand-accent pl-3">Commodities News</h2>
            <Link href="/news" className="text-[12px] text-gray-400 hover:text-white transition-colors no-underline">All news ›</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMMODITY_NEWS.map(item => (
              <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col no-underline rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden hover:border-white/20 transition-colors">
                <div className="overflow-hidden">
                  <NewsThumbnail category={item.category} className="w-full h-[140px]" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1.5">{item.category}</span>
                  <h3 className="text-[13px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-2 flex-1">{item.title}</h3>
                  <div className="text-[11px] text-gray-500">{item.source} · {timeAgo(item.date)}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
