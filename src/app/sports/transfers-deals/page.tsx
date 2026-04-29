import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { sportsHero, sportsStoriesBySection } from "@/data/sports-stories";

export const metadata: Metadata = {
  title: 'Transfers & Deals — TrueRate Sports',
  description: 'Player moves, fees, contract lengths, and the business behind West African football and basketball transfers.',
};

const HERO = sportsHero("transfers");
const STORIES = sportsStoriesBySection("transfers");

const DEALS = [
  { player: 'Marcus Pewee',    pos: 'SF',  from: 'Free Agent',      to: 'Rivers Hoopers',        fee: '$840K / 2yr', status: 'Done',        confirmed: true },
  { player: 'Eric Kpah',       pos: 'CM',  from: 'LISCR FC',        to: 'Club de Foot Abidjan',  fee: '$310K',       status: 'Confirmed',   confirmed: true },
  { player: 'Emmanuel Kollie', pos: 'ST',  from: 'Monrovia FC',     to: 'LISCR FC',              fee: '$280K',       status: 'Rumour',      confirmed: false },
  { player: 'Ibrahim Kamara',  pos: 'DEF', from: 'LISCR FC',        to: 'Williamsville AC (CIV)', fee: '$190K',      status: 'Negotiating', confirmed: false },
  { player: 'Alvin Sumo',      pos: 'GK',  from: 'Barrack Young',   to: 'Semassi FC (Togo)',     fee: '$60K',        status: 'Confirmed',   confirmed: true },
  { player: 'James Dolo',      pos: 'WG',  from: 'BYC FC',          to: 'Barrack Young',         fee: '$45K',        status: 'Confirmed',   confirmed: true },
  { player: 'Samuel Toe',      pos: 'CB',  from: 'FC Nimba',        to: 'Monrovia FC',           fee: 'Undisclosed', status: 'Rumour',      confirmed: false },
  { player: 'George Flomo',    pos: 'LB',  from: 'Free Agent',      to: 'BYC FC',               fee: '$22K',        status: 'Done',        confirmed: true },
];


const TOP_SIGNINGS = [
  { pos: 1, name: 'Marcus Pewee',     club: 'Rivers Hoopers',    fee: '$840K', sport: 'Basketball' },
  { pos: 2, name: 'Eric Kpah',        club: 'CF Abidjan',        fee: '$310K', sport: 'Football' },
  { pos: 3, name: 'Emmanuel Kollie',  club: 'LISCR FC',          fee: '$280K', sport: 'Football' },
  { pos: 4, name: 'Ibrahim Kamara',   club: 'Williamsville AC',  fee: '$190K', sport: 'Football' },
  { pos: 5, name: 'Alvin Sumo',       club: 'Semassi FC',        fee: '$60K',  sport: 'Football' },
];

export default function TransfersDealsPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <main className="mx-auto max-w-[1320px] px-4 py-6">
        <div className="mb-6">
          <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label: 'Transfers & Deals' }]} />
        </div>

        <h1 className="sr-only">Transfers & Deals \u2014 Sports Business</h1>

        <Link href={`/sports/story/${HERO.slug}`} className="group flex flex-col lg:flex-row gap-0 overflow-hidden border border-gray-200 bg-white no-underline mb-8">
          <div className="w-full lg:w-[55%] shrink-0">
            <HeroVisual category={HERO.category} className="w-full h-[200px] sm:h-[260px] lg:h-full" />
          </div>
          <div className="flex flex-col justify-center px-5 py-6 lg:px-8 lg:py-8 flex-1">
            <span className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">{HERO.category}</span>
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
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Live transfer tracker</h2>
                <span className="text-[11px] text-gray-400 uppercase tracking-wide font-bold">Deal values · Apr 2026</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    <tr>
                      <th className="px-3 sm:px-5 py-3 text-left">Player</th>
                      <th className="hidden sm:table-cell px-3 py-3 text-left">Pos</th>
                      <th className="hidden sm:table-cell px-5 py-3 text-left">From</th>
                      <th className="px-3 sm:px-5 py-3 text-left">To</th>
                      <th className="px-3 sm:px-5 py-3 text-right">Fee</th>
                      <th className="hidden sm:table-cell px-5 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {DEALS.map(t => (
                      <tr key={t.player} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-5 py-3 font-bold text-gray-900">{t.player}</td>
                        <td className="hidden sm:table-cell px-3 py-3 text-gray-400">{t.pos}</td>
                        <td className="hidden sm:table-cell px-5 py-3 text-gray-400">{t.from}</td>
                        <td className="px-3 sm:px-5 py-3 text-gray-400">{t.to}</td>
                        <td className="tabular-nums px-3 sm:px-5 py-3 text-right font-bold text-gray-900">{t.fee}</td>
                        <td className={`hidden sm:table-cell px-5 py-3 text-right text-[12px] font-semibold ${t.confirmed ? 'text-emerald-500' : 'text-gray-500'}`}>{t.status}</td>
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
                {STORIES.map(s => (
                  <Link key={s.slug} href={`/sports/story/${s.slug}`} className="group flex gap-3 sm:gap-4 py-5 first:pt-0 no-underline">
                    <div className="shrink-0 overflow-hidden"><NewsThumbnail category={s.category} className="h-[80px] w-[100px] sm:h-[90px] sm:w-[140px]" /></div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1.5 block">{s.category}</span>
                      <h3 className="text-[12px] font-black leading-snug text-gray-900 group-hover:text-gray-700 mb-1.5 line-clamp-2">{s.title}</h3>
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
              <h3 className="text-[12px] font-bold text-gray-900 mb-3">Top signings this window</h3>
              <div className="divide-y divide-gray-100">
                {TOP_SIGNINGS.map(s => (
                  <div key={s.pos} className="flex items-center gap-3 py-2.5">
                    <span className="shrink-0 text-[18px] font-black text-gray-300 tabular-nums w-5 leading-none">{s.pos}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-gray-900 truncate">{s.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{s.club} · {s.sport}</p>
                    </div>
                    <span className="shrink-0 text-[13px] font-bold text-gray-900 tabular-nums">{s.fee}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/sports/broadcast-rights" className="rounded-xl border border-gray-200 bg-white p-4 no-underline hover:border-gray-400 transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1">Next: Broadcast Rights →</p>
              <p className="text-[13px] text-gray-700 leading-relaxed">TV deals powering African football \u2014 who&apos;s paying what.</p>
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
