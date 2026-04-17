'use client';

import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { useState } from 'react';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { getCatColor as CATEGORY_COLORS_FN } from '@/lib/category-colors';

/* ── data ── */
const HERO = {
  category: 'Movies',
  title: "'Lagos After Midnight' crosses $14M — the economics behind West Africa's biggest box office hit",
  summary: "The Nigerian thriller has outgrossed every African film in history outside South Africa. We break down the production budget, distributor split, and what the returns mean for Nollywood financing.",
  source: 'TrueRate Culture',
  time: '2h ago',
};

const SUB_NAV = ['Box Office', 'Streaming', 'Music Industry', 'Film Finance', 'Deals'];

const STRIP_CARDS = [
  { category: 'Movies',    title: "Africa Magic parent MultiChoice posts 8% revenue decline as streaming competition bites", source: 'Reuters', time: '45m ago' },
  { category: 'Music',     title: "Universal Music Group signs five West African artists in $30M regional expansion push", source: 'Billboard', time: '1h ago' },
  { category: 'TV',        title: "Netflix Africa content spend hits $180M in 2025 — Liberia among targeted markets", source: 'The Guardian', time: '3h ago' },
  { category: 'Movies',    title: "Cannes co-production market: African projects attract record European investment in 2026", source: 'Variety', time: '5h ago' },
  { category: 'Music',     title: "Spotify streams from West Africa up 34% YoY — but royalty payouts remain under $0.001 per play", source: 'Pulse Africa', time: '6h ago' },
];

const BOX_OFFICE = [
  { rank: 1, title: 'Lagos After Midnight',    gross: '$14.2M', weeklyChange: '+18%', weeks: 3,  screens: 420, up: true  },
  { rank: 2, title: 'The Monrovia Files',      gross: '$6.8M',  weeklyChange: '-9%',  weeks: 5,  screens: 180, up: false },
  { rank: 3, title: 'Pepper Coast: The Movie', gross: '$4.1M',  weeklyChange: '+4%',  weeks: 2,  screens: 210, up: true  },
  { rank: 4, title: 'Accra Nights',            gross: '$3.3M',  weeklyChange: '-14%', weeks: 4,  screens: 155, up: false },
  { rank: 5, title: 'Sacred Ground (Liberia)', gross: '$1.9M',  weeklyChange: '-21%', weeks: 7,  screens: 80,  up: false },
];

const STREAMING = [
  { platform: 'Netflix Africa',  subscribers: '4.2M',  qChange: '+310K', revenue: '$38M', market: 'Sub-Saharan Africa', up: true  },
  { platform: 'Showmax',         subscribers: '2.8M',  qChange: '-90K',  revenue: '$19M', market: 'Pan-Africa',         up: false },
  { platform: 'Africa Magic',    subscribers: '6.1M',  qChange: '+40K',  revenue: '$54M', market: 'Pan-Africa',         up: true  },
  { platform: 'Prime Video',     subscribers: '1.1M',  qChange: '+180K', revenue: '$12M', market: 'Nigeria + Ghana',    up: true  },
];

const DEALS = [
  { date: 'Apr 8',  type: 'Acquisition', headline: 'MTN Group acquires 40% stake in Afrostream for $22M', value: '$22M',  up: true  },
  { date: 'Apr 5',  type: 'Label Deal',  headline: 'Sony Music West Africa signs Liberian artist Mamy Victory in multi-album deal', value: 'Undisclosed', up: true },
  { date: 'Mar 30', type: 'Co-Production', headline: 'France 24 and TrueRate partner on West Africa documentary series', value: '$4.5M', up: true },
  { date: 'Mar 25', type: 'Rights Sale', headline: "'Pepper Coast' Season 2 global rights sold to Apple TV+ for estimated $8M", value: '$8M', up: true },
  { date: 'Mar 20', type: 'Funding',     headline: 'Monrovia-based production house Ducor Films raises $3M seed round', value: '$3M', up: true },
];

const FEED = [
  { category: 'Music',      title: "The hidden economics of Afrobeats: how much do Liberian artists actually earn?",       summary: "Streaming royalties, live revenue splits, and sync licensing fees — a breakdown of where the money goes in West Africa's fastest-growing music export.",               source: 'TrueRate', time: '12 min read' },
  { category: 'Movies',     title: "Nollywood's budget problem: why most films never recoup their production costs",        summary: "Despite record box office headlines, fewer than 20% of Nigerian films turn a profit. We examine the financing models, distribution costs, and piracy losses.",    source: 'Variety Africa', time: '9 min read' },
  { category: 'TV',         title: "'Pepper Coast' said no to Netflix — and the numbers suggest it was the right call",    summary: "Showrunner James Dahn explains how a regional Africa Magic deal delivered better per-episode margins than the streamer's standard offer structure.",                   source: 'TrueRate', time: '6 min read' },
  { category: 'Music',      title: "Liberia's gospel streaming surge: 210% growth but artists see little of the revenue",  summary: "The data shows Liberian gospel acts growing rapidly on Spotify and Apple Music. But the royalty structure means most artists earn under $500/month.",             source: 'Pulse Africa', time: '7 min read' },
  { category: 'Movies',     title: "Film incentives: how Ghana and Nigeria lure productions — and why Liberia is losing out", summary: "Ghana offers a 25% production rebate. Nigeria has state studio infrastructure. Liberia has neither — and the investment gap is widening.",                    source: 'The New Dawn', time: '8 min read' },
  { category: 'TV',         title: "MultiChoice Q1 results: Showmax losses widen as Netflix gains West African ground",    summary: "MultiChoice reported a $41M operating loss for Showmax in Q1 2026, up from $28M a year earlier, as Netflix's African subscriber base accelerates.",             source: 'FrontPage Africa', time: '5 min read' },
];

const MUSIC_REVENUE = [
  { artist: 'Burna Boy',      streams: '4.2B',  estRoyalty: '$4.1M',  label: 'Atlantic / Warner', territory: 'Global'     },
  { artist: 'Davido',         streams: '3.8B',  estRoyalty: '$3.7M',  label: 'Sony Music Africa', territory: 'Global'     },
  { artist: 'Tiwa Savage',    streams: '2.9B',  estRoyalty: '$2.8M',  label: 'Universal Music',   territory: 'Global'     },
  { artist: 'Mamy Victory',   streams: '310M',  estRoyalty: '$290K',  label: 'Sony Music WA',     territory: 'West Africa' },
];

const INDUSTRY_METRICS = [
  { label: 'W. Africa Box Office (Q1 2026)', value: '$84M',   change: '+22% YoY', up: true  },
  { label: 'Nollywood Avg. Production Cost', value: '$420K',  change: '+8% YoY',  up: false },
  { label: 'Africa Streaming Revenue (2025)', value: '$1.4B', change: '+31% YoY', up: true  },
  { label: 'Music Export Value (Liberia)',    value: '$18M',   change: '+41% YoY', up: true  },
];

export default function EntertainmentPage() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">

      {/* Breadcrumb + header */}
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Culture' }]} />
        <div className="flex gap-0 border-b border-white/[0.07] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {['All', ...SUB_NAV].map(tab => (
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

      <div className="flex gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0">

          {/* Hero */}
          <Link href="/news" className="group flex flex-col lg:flex-row gap-0 overflow-hidden no-underline mb-6">
            <div className="w-full lg:w-[55%] shrink-0">
              <HeroVisual category={HERO.category} className="w-full h-[200px] sm:h-[260px] lg:h-full" />
            </div>
            <div className="flex flex-col justify-center px-5 py-6 lg:px-8 lg:py-8 flex-1">
              <span className={`mb-3 text-[11px] font-bold uppercase tracking-widest ${CATEGORY_COLORS_FN(HERO.category)}`}>
                {HERO.category}
              </span>
              <h2 className="text-[24px] font-black leading-snug text-white group-hover:text-white/80 transition-colors mb-4">
                {HERO.title}
              </h2>
              <p className="text-[14px] leading-relaxed text-gray-400 line-clamp-3 mb-4">{HERO.summary}</p>
              <div className="flex items-center gap-2 mt-auto text-[12px] text-gray-500">
                <span>{HERO.source}</span>
                <span className="text-gray-500">·</span>
                <span>{HERO.time}</span>
              </div>
            </div>
          </Link>

          {/* Strip */}
          <div className="flex flex-col divide-y divide-white/[0.06] mb-8">
            {STRIP_CARDS.map((card, i) => (
              <Link key={i} href="/news" className="group flex gap-4 py-4 first:pt-0 no-underline">
                <div className="shrink-0 overflow-hidden">
                  <NewsThumbnail category={card.category} className="h-[72px] w-[108px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wide mb-1 block ${CATEGORY_COLORS_FN(card.category)}`}>
                    {card.category}
                  </span>
                  <h3 className="text-[13px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2">
                    {card.title}
                  </h3>
                  <div className="mt-1 text-[11px] text-gray-400">{card.source} · {card.time}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Box Office */}
          <div className="mb-8">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-0">
              <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Box Office</h2>
              <span className="text-[11px] text-gray-400 uppercase tracking-wide font-bold">West Africa Weekend</span>
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full min-w-[420px] text-[13px]">
                <thead className="border-b border-white/[0.05] text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="pr-5 py-3 text-left w-6">#</th>
                    <th className="px-5 py-3 text-left">Title</th>
                    <th className="px-5 py-3 text-right">Cumulative Gross</th>
                    <th className="px-5 py-3 text-right">Wk Change</th>
                    <th className="hidden sm:table-cell px-5 py-3 text-right">Screens</th>
                    <th className="hidden sm:table-cell px-5 py-3 text-right">Week</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {BOX_OFFICE.map(film => (
                    <tr key={film.rank} className="hover:bg-white/[0.02] transition-colors">
                      <td className="pr-5 py-3 text-[18px] font-black text-white/10 tabular-nums">{film.rank}</td>
                      <td className="px-5 py-3 font-semibold text-white">{film.title}</td>
                      <td className="tabular-nums px-5 py-3 text-right font-bold text-white">{film.gross}</td>
                      <td className={`tabular-nums px-5 py-3 text-right font-semibold ${film.up ? 'text-emerald-400' : 'text-red-400'}`}>
                        {film.weeklyChange}
                      </td>
                      <td className="hidden sm:table-cell tabular-nums px-5 py-3 text-right text-gray-500">{film.screens}</td>
                      <td className="hidden sm:table-cell px-5 py-3 text-right text-gray-400">{film.weeks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Streaming platforms */}
          <div className="mb-8">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-0">
              <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Streaming Platform Performance</h2>
              <span className="text-[11px] text-gray-400 uppercase tracking-wide font-bold">Q1 2026</span>
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full min-w-[440px] text-[13px]">
                <thead className="border-b border-white/[0.05] text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="py-3 text-left">Platform</th>
                    <th className="px-5 py-3 text-right">Subscribers</th>
                    <th className="px-5 py-3 text-right">Qtr Change</th>
                    <th className="px-5 py-3 text-right">Est. Revenue</th>
                    <th className="hidden sm:table-cell px-5 py-3 text-left">Market</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {STREAMING.map((s, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-bold text-white">{s.platform}</td>
                      <td className="tabular-nums px-5 py-3 text-right font-semibold text-white">{s.subscribers}</td>
                      <td className={`tabular-nums px-5 py-3 text-right font-semibold ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
                        {s.up ? '+' : ''}{s.qChange}
                      </td>
                      <td className="tabular-nums px-5 py-3 text-right text-gray-300">{s.revenue}</td>
                      <td className="hidden sm:table-cell px-5 py-3 text-gray-500">{s.market}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stories */}
          <div className="mb-8">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Industry Analysis</h2>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-white/[0.05]">
              {FEED.map((item, i) => (
                <Link key={i} href="/news" className="group flex gap-4 py-5 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden">
                    <NewsThumbnail category={item.category} className="h-[90px] w-[140px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide mb-1.5 block ${CATEGORY_COLORS_FN(item.category)}`}>
                      {item.category}
                    </span>
                    <h3 className="text-[15px] font-black leading-snug text-white group-hover:text-white/75 transition-colors mb-1.5 line-clamp-2">
                      {item.title}
                    </h3>
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

          {/* Music streaming revenue */}
          <div className="mb-8">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-0">
              <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Music Streaming Revenue</h2>
              <span className="text-[11px] text-gray-400 uppercase tracking-wide font-bold">Est. 2025 earnings</span>
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full min-w-[400px] text-[13px]">
                <thead className="border-b border-white/[0.05] text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="py-3 text-left">Artist</th>
                    <th className="px-5 py-3 text-right">Streams</th>
                    <th className="px-5 py-3 text-right">Est. Royalty</th>
                    <th className="hidden sm:table-cell px-5 py-3 text-left">Label</th>
                    <th className="hidden sm:table-cell px-5 py-3 text-left">Territory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {MUSIC_REVENUE.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-bold text-white">{row.artist}</td>
                      <td className="tabular-nums px-5 py-3 text-right text-gray-300">{row.streams}</td>
                      <td className="tabular-nums px-5 py-3 text-right font-bold text-white">{row.estRoyalty}</td>
                      <td className="hidden sm:table-cell px-5 py-3 text-gray-500">{row.label}</td>
                      <td className="hidden sm:table-cell px-5 py-3 text-gray-500">{row.territory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-gray-600 mt-2">Estimated based on Spotify/Apple Music stream counts at ~$0.004/stream average · Not audited figures</p>
          </div>

          {/* Deals */}
          <div className="mb-2">
            <div className="border-b border-white/[0.07] pb-3 mb-0">
              <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Recent Deals</h2>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {DEALS.map((deal, i) => (
                <Link key={i} href="/news" className="group flex items-start gap-4 py-4 no-underline hover:bg-white/[0.02] transition-colors">
                  <div className="shrink-0 text-right w-14">
                    <span className="text-[11px] text-gray-400">{deal.date}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1 block">{deal.type}</span>
                    <p className="text-[13px] font-semibold text-white group-hover:text-white/75 transition-colors leading-snug">{deal.headline}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[13px] font-bold text-white tabular-nums">{deal.value}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right rail */}
        <aside className="hidden xl:block w-[280px] shrink-0">
          <div className="sticky top-[120px] flex flex-col gap-8">

            {/* Industry snapshot */}
            <div>
              <h3 className="text-[13px] font-bold text-white border-b border-white/[0.07] pb-3 mb-0">Industry Snapshot</h3>
              <div className="divide-y divide-white/[0.04]">
                {INDUSTRY_METRICS.map((m, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <span className="text-[12px] text-gray-500 pr-3">{m.label}</span>
                    <div className="text-right shrink-0">
                      <div className="text-[14px] font-bold text-white tabular-nums">{m.value}</div>
                      <div className={`text-[11px] tabular-nums ${m.up ? 'text-emerald-400' : 'text-red-400'}`}>{m.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <h3 className="text-[13px] font-bold text-white border-b border-white/[0.07] pb-3 mb-0">Most Read</h3>
              <div className="divide-y divide-white/[0.04]">
                {[
                  { rank: 1, title: "MultiChoice Showmax losses widen to $41M",     tag: 'Streaming' },
                  { rank: 2, title: "UMG's $30M West Africa signing spree",          tag: 'Music' },
                  { rank: 3, title: "'Pepper Coast' Apple TV+ rights deal",          tag: 'TV' },
                  { rank: 4, title: "Nollywood's 80% flop rate explained",           tag: 'Film Finance' },
                  { rank: 5, title: "MTN acquires Afrostream stake for $22M",        tag: 'Deals' },
                ].map(t => (
                  <Link key={t.rank} href="/news" className="flex items-center gap-3 py-3 no-underline group hover:bg-white/[0.02] transition-colors">
                    <span className="shrink-0 text-[20px] font-black text-white/10 tabular-nums w-5 leading-none">{t.rank}</span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors line-clamp-2 leading-snug">{t.title}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${CATEGORY_COLORS_FN(t.tag)}`}>{t.tag}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Key dates */}
            <div>
              <h3 className="text-[13px] font-bold text-white border-b border-white/[0.07] pb-3 mb-0">Industry Calendar</h3>
              <div className="divide-y divide-white/[0.04]">
                {[
                  { date: 'Apr 14', event: 'MultiChoice Q2 earnings call' },
                  { date: 'Apr 19', event: 'Afrobeats Fest — sponsorship revenue data released' },
                  { date: 'May 3',  event: 'Cannes Film Market opens — African co-production sessions' },
                  { date: 'May 24', event: 'AFRIMA Awards 2026 — broadcast rights auction' },
                  { date: 'Jun 14', event: 'Africa Movie Academy Awards — box office retrospective' },
                ].map((ev, i) => (
                  <div key={i} className="flex items-start gap-3 py-3">
                    <span className="shrink-0 text-[11px] font-bold text-gray-400 w-12">{ev.date}</span>
                    <p className="text-[12px] text-gray-400 leading-snug">{ev.event}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </aside>
      </div>
    </main>
  );
}
