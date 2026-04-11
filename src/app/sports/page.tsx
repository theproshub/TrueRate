'use client';

import Link from 'next/link';
import { useState } from 'react';
import { NewsThumbnail, HeroVisual, VideoThumbnail } from '@/components/NewsThumbnail';
import { getCatColor as CATEGORY_COLORS_FN } from '@/lib/category-colors';

/* ── data ── */
const SPORT_TABS = ['All', 'Transfers & Deals', 'Broadcast Rights', 'Club Finance', 'Sponsorship'];

const SCORES = [
  { home: 'Liberia',         away: 'Ghana',          homeScore: 2, awayScore: 1, status: 'FT',  competition: 'WAFU Cup' },
  { home: 'Nigeria',         away: 'Ivory Coast',    homeScore: 0, awayScore: 0, status: "67'", competition: 'AFCON Qual.' },
  { home: 'Monrovia FC',     away: 'LISCR FC',       homeScore: 1, awayScore: 1, status: 'HT',  competition: 'LFA League' },
  { home: 'Rivers Hoopers',  away: 'Bayelsa Wave',   homeScore: 78, awayScore: 65, status: 'Q3', competition: 'NBL Africa' },
  { home: 'Senegal',         away: 'Kenya',          homeScore: 3, awayScore: 1, status: 'FT',  competition: 'Africa Cup' },
];

const HERO = {
  category: 'Football',
  title: "AFCON 2027 broadcast rights: who's paying — and what Liberia's qualification is worth to CAF",
  summary: "Liberia's historic qualification has boosted regional viewership projections for AFCON 2027 by an estimated 12%. We break down the $340M broadcast deal, CAF's prize money structure, and what the Lone Star stands to earn.",
  source: 'TrueRate Sports Business',
  time: '1h ago',
};

const TOP_STORIES = [
  { category: 'Football',   title: "Premier League Africa TV rights renewal: beIN Sports vs SuperSport bidding war nears $180M", source: 'Reuters', time: '2h ago' },
  { category: 'Basketball', title: "NBA Africa Series 2026 confirmed for Monrovia — estimated $4.2M economic impact", source: 'NBA Africa', time: '4h ago' },
  { category: 'Athletics',  title: "World Athletics signs $80M West Africa development sponsorship with MTN Group", source: 'World Athletics', time: '6h ago' },
];

const FEED = [
  { category: 'Football',   title: "Monrovia FC's new stadium deal: $18M PPP project explained",                                    summary: "The club's groundbreaking public-private partnership with the Liberian government and a Ghanaian construction firm could transform club revenues within three seasons.",    source: 'TrueRate Sports', time: '3h ago' },
  { category: 'Football',   title: "LFA commercial revenue up 31% — but the league still runs at a $2.1M annual deficit",           summary: "Growing sponsorship and gate receipts mask a structural funding gap that the Football Association has yet to close with broadcast income.",                          source: 'LFA / TrueRate', time: '5h ago' },
  { category: 'Basketball', title: "NBL Africa franchise expansion: what a Monrovia team would cost and generate",                   summary: "A new NBA Africa-backed franchise report estimates $6M entry fee and $2.8M annual operating costs against projected $4.1M in revenue by year three.",               source: 'NBA Africa', time: '7h ago' },
  { category: 'Football',   title: "How Marcus Pewee became the most valuable Liberian player since Weah — the numbers",            summary: "Rivers Hoopers' $840K contract and pre-draft NBA valuation make Pewee the highest-earning Liberian athlete in active competition.",                               source: 'TrueRate Sports', time: '9h ago' },
  { category: 'Football',   title: "Shirt sponsorship in West African football: deals, values, and the brands that pay the most",  summary: "A survey of 40 top-flight clubs finds median jersey deal values of $120K/year — with Monrovia FC's Orange partnership among the region's top 10.",            source: 'Sportcal', time: '1d ago' },
  { category: 'Athletics',  title: "Comfort Brown's commercial value: sponsorship worth $220K — and growing fast",                  summary: "After breaking the West African 100m record, the sprinter has attracted Puma, MTN, and Liberia Petroleum as sponsors in a six-month window.",                    source: 'TrueRate Sports', time: '1d ago' },
];

const TRANSFERS = [
  { player: 'Emmanuel Kollie', from: 'Monrovia FC',   to: 'LISCR FC',             fee: '$280K',      status: 'Rumour',    confirmed: false },
  { player: 'James Dolo',      from: 'BYC FC',        to: 'Barrack Young',        fee: '$45K',       status: 'Confirmed', confirmed: true  },
  { player: 'Marcus Pewee',    from: 'Free Agent',    to: 'Rivers Hoopers',       fee: '$840K / 2yr',status: 'Done',      confirmed: true  },
  { player: 'Eric Kpah',       from: 'LISCR FC',      to: 'Club de Foot Abidjan', fee: '$190K',      status: 'Confirmed', confirmed: true  },
  { player: 'Samuel Toe',      from: 'FC Nimba',      to: 'Monrovia FC',          fee: 'Undisclosed', status: 'Rumour',   confirmed: false },
];

const BROADCAST = [
  { competition: 'AFCON 2027',          rightsholder: 'SuperSport / beIN',   value: '$340M', territory: 'Global',      expiry: '2027' },
  { competition: 'Premier League',      rightsholder: 'SuperSport',          value: '$180M', territory: 'Sub-Saharan', expiry: '2028' },
  { competition: 'LFA League',          rightsholder: 'ELBC / Orange',       value: '$1.8M', territory: 'Liberia',     expiry: '2026' },
  { competition: 'NBL Africa',          rightsholder: 'NBA Africa / DStv',   value: '$22M',  territory: 'Pan-Africa',  expiry: '2027' },
  { competition: 'WAFU Cup',            rightsholder: 'CAF Media',           value: '$12M',  territory: 'West Africa', expiry: '2026' },
];

const SPONSORSHIP = [
  { club: 'Monrovia FC',  sponsor: 'Orange Liberia',      category: 'Shirt',       value: '$320K/yr', since: '2023' },
  { club: 'LISCR FC',     sponsor: 'Lonestar Cell MTN',   category: 'Kit',         value: '$180K/yr', since: '2024' },
  { club: 'LFA',          sponsor: 'CBL / Govt. Liberia', category: 'Federation',  value: '$600K/yr', since: '2022' },
  { club: 'NBL Africa',   sponsor: 'NBA / SAP Africa',    category: 'Title',       value: '$8M/yr',   since: '2021' },
];

const VIDEOS = [
  { title: "Lone Star's AFCON qualifier — and the $4M prize money on the line", duration: '4:22', category: 'Football' },
  { title: 'NBA Africa Monrovia 2026: the business case explained', duration: '6:10', category: 'Basketball' },
  { title: 'Comfort Brown and the economics of African sprint sponsorship', duration: '3:15', category: 'Athletics' },
];

const STANDINGS = [
  { pos: 1, team: 'Monrovia FC',   p: 22, w: 14, d: 5, l: 3,  pts: 47 },
  { pos: 2, team: 'LISCR FC',      p: 22, w: 12, d: 6, l: 4,  pts: 42 },
  { pos: 3, team: 'BYC FC',        p: 22, w: 11, d: 5, l: 6,  pts: 38 },
  { pos: 4, team: 'Barrack Young', p: 22, w: 9,  d: 7, l: 6,  pts: 34 },
  { pos: 5, team: 'FC Nimba',      p: 22, w: 8,  d: 6, l: 8,  pts: 30 },
];

const BUSINESS_METRICS = [
  { label: 'LFA Total Prize Pool (2025/26)',   value: '$1.2M',  change: '+15% YoY', up: true  },
  { label: 'W. Africa Sports Sponsorship',     value: '$340M',  change: '+22% YoY', up: true  },
  { label: 'Monrovia FC Est. Valuation',       value: '$8.4M',  change: '+11% YoY', up: true  },
  { label: 'CAF Prize Money (AFCON 2027)',     value: '$22.5M', change: '+18% YoY', up: true  },
];

export default function SportsPage() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">

      {/* Breadcrumb + header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-4">
          <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
          <span>/</span>
          <span className="text-gray-400">Sports</span>
        </div>
        <div className="flex gap-0 border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SPORT_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-5 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Scores ticker */}
      <div className="mb-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3 min-w-max">
          {SCORES.map((s, i) => (
            <Link key={i} href="/sports" className="group flex flex-col items-center border border-white/[0.07] bg-brand-card px-4 py-3 no-underline hover:border-white/20 transition-colors min-w-[170px]">
              <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">{s.competition}</div>
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-white truncate">{s.home}</div>
                  <div className="text-[13px] font-bold text-white truncate">{s.away}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-[14px] font-black tabular-nums ${s.homeScore > s.awayScore ? 'text-white' : 'text-gray-500'}`}>{s.homeScore}</div>
                  <div className={`text-[14px] font-black tabular-nums ${s.awayScore > s.homeScore ? 'text-white' : 'text-gray-500'}`}>{s.awayScore}</div>
                </div>
              </div>
              <div className={`mt-2 text-[10px] font-bold ${s.status === 'FT' ? 'text-gray-400' : 'text-brand-accent'}`}>
                {s.status}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0">

          {/* Hero */}
          <Link href="/sports" className="group flex flex-col lg:flex-row gap-0 overflow-hidden border border-white/[0.07] bg-brand-card no-underline mb-6">
            <div className="w-full lg:w-[55%] shrink-0">
              <HeroVisual category={HERO.category} className="w-full h-[200px] sm:h-[260px] lg:h-full" />
            </div>
            <div className="flex flex-col justify-center px-5 py-6 lg:px-8 lg:py-8 flex-1">
              <span className={`mb-3 text-[11px] font-bold uppercase tracking-widest ${CATEGORY_COLORS_FN(HERO.category)}`}>{HERO.category}</span>
              <h2 className="text-[24px] font-black leading-snug text-white group-hover:text-white/80 transition-colors mb-4">{HERO.title}</h2>
              <p className="text-[14px] leading-relaxed text-gray-400 line-clamp-3 mb-4">{HERO.summary}</p>
              <div className="flex items-center gap-2 mt-auto text-[12px] text-gray-500">
                <span>{HERO.source}</span>
                <span className="text-gray-500">·</span>
                <span>{HERO.time}</span>
              </div>
            </div>
          </Link>

          {/* Top stories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {TOP_STORIES.map((s, i) => (
              <Link key={i} href="/sports" className="group flex flex-col no-underline">
                <div className="overflow-hidden mb-2.5">
                  <NewsThumbnail category={s.category} className="w-full h-[130px]" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${CATEGORY_COLORS_FN(s.category)}`}>{s.category}</span>
                <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 flex-1 mb-1.5">{s.title}</h3>
                <div className="text-[11px] text-gray-400">{s.source} · {s.time}</div>
              </Link>
            ))}
          </div>

          {/* Transfer table */}
          <div className="rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden mb-8">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <h2 className="text-[15px] font-bold text-white">Transfer Tracker</h2>
              <span className="text-[11px] text-gray-400 uppercase tracking-wide font-bold">Deal values · Apr 2026</span>
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full min-w-[520px] text-[13px]">
                <thead className="border-b border-white/[0.05] text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-5 py-3 text-left">Player</th>
                    <th className="px-5 py-3 text-left">From</th>
                    <th className="px-5 py-3 text-left">To</th>
                    <th className="px-5 py-3 text-right">Fee</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {TRANSFERS.map((t, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 font-bold text-white">{t.player}</td>
                      <td className="px-5 py-3 text-gray-400">{t.from}</td>
                      <td className="px-5 py-3 text-gray-400">{t.to}</td>
                      <td className="tabular-nums px-5 py-3 text-right font-bold text-white">{t.fee}</td>
                      <td className={`px-5 py-3 text-right text-[12px] font-semibold ${t.confirmed ? 'text-brand-accent' : 'text-gray-500'}`}>
                        {t.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Broadcast rights */}
          <div className="rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden mb-8">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <h2 className="text-[15px] font-bold text-white">Broadcast Rights</h2>
              <span className="text-[11px] text-gray-400 uppercase tracking-wide font-bold">Current deals</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="border-b border-white/[0.05] text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-5 py-3 text-left">Competition</th>
                    <th className="px-5 py-3 text-left">Rights Holder</th>
                    <th className="px-5 py-3 text-right">Deal Value</th>
                    <th className="hidden sm:table-cell px-5 py-3 text-left">Territory</th>
                    <th className="hidden sm:table-cell px-5 py-3 text-right">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {BROADCAST.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 font-bold text-white">{row.competition}</td>
                      <td className="px-5 py-3 text-gray-400">{row.rightsholder}</td>
                      <td className="tabular-nums px-5 py-3 text-right font-bold text-white">{row.value}</td>
                      <td className="hidden sm:table-cell px-5 py-3 text-gray-500">{row.territory}</td>
                      <td className="hidden sm:table-cell tabular-nums px-5 py-3 text-right text-gray-400">{row.expiry}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feed */}
          <div className="mb-8">
            <h2 className="text-[17px] font-bold text-white mb-5">Analysis</h2>
            <div className="flex flex-col divide-y divide-white/[0.05]">
              {FEED.map((item, i) => (
                <Link key={i} href="/sports" className="group flex gap-4 py-5 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden">
                    <NewsThumbnail category={item.category} className="h-[90px] w-[140px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide mb-1.5 block ${CATEGORY_COLORS_FN(item.category)}`}>{item.category}</span>
                    <h3 className="text-[15px] font-black leading-snug text-white group-hover:text-white/75 transition-colors mb-1.5 line-clamp-2">{item.title}</h3>
                    <p className="text-[13px] leading-relaxed text-gray-500 line-clamp-2 mb-2">{item.summary}</p>
                    <div className="flex items-center gap-2 text-[12px] text-gray-400">
                      <span className="text-gray-500">{item.source}</span>
                      <span>·</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sponsorship */}
          <div className="rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden mb-8">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <h2 className="text-[15px] font-bold text-white">Major Sponsorship Deals</h2>
              <span className="text-[11px] text-gray-400 uppercase tracking-wide font-bold">Liberia &amp; West Africa</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="border-b border-white/[0.05] text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-5 py-3 text-left">Club / Body</th>
                    <th className="px-5 py-3 text-left">Sponsor</th>
                    <th className="px-5 py-3 text-left">Category</th>
                    <th className="px-5 py-3 text-right">Annual Value</th>
                    <th className="hidden sm:table-cell px-5 py-3 text-right">Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {SPONSORSHIP.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 font-bold text-white">{row.club}</td>
                      <td className="px-5 py-3 text-gray-400">{row.sponsor}</td>
                      <td className="px-5 py-3 text-gray-500">{row.category}</td>
                      <td className="tabular-nums px-5 py-3 text-right font-bold text-white">{row.value}</td>
                      <td className="hidden sm:table-cell tabular-nums px-5 py-3 text-right text-gray-400">{row.since}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Videos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-white">Videos</h2>
              <Link href="/videos" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">View all ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {VIDEOS.map((v, i) => (
                <Link key={i} href="/videos" className="group flex flex-col no-underline">
                  <div className="relative overflow-hidden mb-2.5">
                    <VideoThumbnail category={v.category} duration={v.duration} className="w-full h-[130px]" />
                  </div>
                  <h3 className="text-[12px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2">{v.title}</h3>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right rail */}
        <aside className="hidden xl:block w-[290px] shrink-0">
          <div className="sticky top-[120px] flex flex-col gap-5">

            {/* Business snapshot */}
            <div className="rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden">
              <div className="px-4 py-3.5 border-b border-white/[0.05]">
                <h3 className="text-[13px] font-bold text-white">Sports Business Snapshot</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {BUSINESS_METRICS.map((m, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <span className="text-[12px] text-gray-500 pr-3">{m.label}</span>
                    <div className="text-right shrink-0">
                      <div className="text-[14px] font-bold text-white tabular-nums">{m.value}</div>
                      <div className={`text-[11px] tabular-nums ${m.up ? 'text-brand-accent' : 'text-red-400'}`}>{m.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LFA Standings */}
            <div className="rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
                <div>
                  <h3 className="text-[13px] font-bold text-white">LFA League</h3>
                  <p className="text-[10px] text-gray-400">Week 22</p>
                </div>
                <Link href="/sports" className="text-[11px] text-gray-500 hover:text-white transition-colors no-underline">Full table ›</Link>
              </div>
              <div className="px-4 py-2">
                <div className="flex text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1 gap-0">
                  <span className="w-5 shrink-0">#</span>
                  <span className="flex-1">Team</span>
                  <span className="w-5 text-center">P</span>
                  <span className="w-5 text-center">W</span>
                  <span className="w-5 text-center">D</span>
                  <span className="w-5 text-center">L</span>
                  <span className="w-8 text-right font-black">Pts</span>
                </div>
                {STANDINGS.map(row => (
                  <div key={row.pos} className="flex items-center py-2 border-t border-white/[0.03] text-[12px] gap-0">
                    <span className="w-5 shrink-0 text-gray-400 font-bold">{row.pos}</span>
                    <span className="flex-1 font-semibold text-white truncate pr-1">{row.team}</span>
                    <span className="w-5 text-center text-gray-500">{row.p}</span>
                    <span className="w-5 text-center text-gray-500">{row.w}</span>
                    <span className="w-5 text-center text-gray-500">{row.d}</span>
                    <span className="w-5 text-center text-gray-500">{row.l}</span>
                    <span className="w-8 text-right font-black text-white">{row.pts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming fixtures */}
            <div className="rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
                <h3 className="text-[13px] font-bold text-white">Upcoming Fixtures</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {[
                  { home: 'Liberia',       away: 'Guinea',          date: 'Apr 8',  time: '18:00', competition: 'WAFU Cup SF' },
                  { home: 'Monrovia FC',   away: 'FC Nimba',        date: 'Apr 9',  time: '15:00', competition: 'LFA League' },
                  { home: 'LISCR FC',      away: 'BYC FC',          date: 'Apr 10', time: '16:00', competition: 'LFA League' },
                  { home: 'Rivers Hoopers', away: 'Monrovia Ballers', date: 'Apr 11', time: '20:00', competition: 'NBL Africa' },
                ].map((f, i) => (
                  <Link key={i} href="/sports" className="flex flex-col px-4 py-3 no-underline group hover:bg-white/[0.02] transition-colors">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">{f.competition}</div>
                    <div className="text-[12px] font-semibold text-white group-hover:text-white/80">{f.home} <span className="text-gray-400 font-normal">vs</span> {f.away}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{f.date} · {f.time} WAT</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Most read */}
            <div className="rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden">
              <div className="px-4 py-3.5 border-b border-white/[0.05]">
                <h3 className="text-[13px] font-bold text-white">Most Read</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {[
                  { rank: 1, title: "AFCON 2027 broadcast rights: the $340M deal",          tag: 'Football' },
                  { rank: 2, title: "NBA Africa Monrovia — $4.2M impact study",              tag: 'Basketball' },
                  { rank: 3, title: "LFA's $2.1M annual deficit explained",                  tag: 'Football' },
                  { rank: 4, title: "Marcus Pewee's $840K deal — how it compares",           tag: 'Basketball' },
                  { rank: 5, title: "Comfort Brown sponsorship value: $220K and rising",     tag: 'Athletics' },
                ].map(t => (
                  <Link key={t.rank} href="/sports" className="flex items-center gap-3 px-4 py-3 no-underline group hover:bg-white/[0.02] transition-colors">
                    <span className="shrink-0 text-[20px] font-black text-white/10 tabular-nums w-5 leading-none">{t.rank}</span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors line-clamp-2 leading-snug">{t.title}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${CATEGORY_COLORS_FN(t.tag)}`}>{t.tag}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </aside>
      </div>
    </main>
  );
}
