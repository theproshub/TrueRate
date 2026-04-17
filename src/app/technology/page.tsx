'use client';

import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { useState } from 'react';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';

const HERO = {
  category: 'Fintech',
  title: "Liberia's mobile money market hits $2.1B in annual transactions as Orange Money leads expansion",
  summary: 'Orange Money Liberia crossed the billion-dollar transaction threshold in Q1 2026, driven by rural adoption and merchant payment integrations across 12 counties.',
  source: 'TrueRate Tech',
  time: '1h ago',
};

const SUB_NAV = ['Startups', 'Fintech', 'AI & Innovation', 'Digital Economy', 'Infrastructure'];

const STRIP_CARDS = [
  { category: 'Fintech',    title: 'Monrovia startup Ducor Pay raises $4.2M Series A to expand USSD lending across West Africa', source: 'TechCabal',      time: '2h ago' },
  { category: 'AI',         title: 'Liberia joins AU AI Task Force — plans national AI policy framework by Q3 2026',             source: 'The New Dawn',   time: '3h ago' },
  { category: 'Telecom',    title: 'Lonestar MTN rolls out 4G to 8 new counties, bringing coverage to 74% of the population',    source: 'FrontPage Africa', time: '5h ago' },
  { category: 'Startups',   title: "Liberia's first tech hub, iCampus, secures $1.5M from USAID to expand coding bootcamps",     source: 'Liberian Observer', time: '7h ago' },
  { category: 'E-Commerce', title: "Jumia Liberia's GMV rises 28% YoY as smartphone penetration crosses 40% threshold",          source: 'Reuters',        time: '9h ago' },
];

const STARTUP_TRACKER = [
  { name: 'Ducor Pay',       sector: 'Fintech',       raise: '$4.2M',    stage: 'Series A', investors: 'Partech Africa · Ventures Platform', date: 'Apr 2026'  },
  { name: 'AgriLink LR',     sector: 'AgriTech',      raise: '$800K',    stage: 'Seed',     investors: 'GreenTec Capital',                   date: 'Mar 2026'  },
  { name: 'HealthBridge',    sector: 'HealthTech',     raise: '$1.2M',    stage: 'Seed',     investors: 'Chandaria Capital · Angel network',  date: 'Mar 2026'  },
  { name: 'TruckersPro LR',  sector: 'Logistics',     raise: '$500K',    stage: 'Pre-seed', investors: 'Self-funded + grants',               date: 'Feb 2026'  },
  { name: 'LernerAI',        sector: 'EdTech',        raise: '$350K',    stage: 'Pre-seed', investors: 'MEST Africa',                        date: 'Jan 2026'  },
];

const MOBILE_MONEY = [
  { operator: 'Orange Money',    users: '2.4M', txVolume: '$1.1B', qChange: '+22%', up: true  },
  { operator: 'Lonestar M-Pesa', users: '1.8M', txVolume: '$710M', qChange: '+14%', up: true  },
  { operator: 'EcoBank Mobile',  users: '620K', txVolume: '$290M', qChange: '+9%',  up: true  },
];

const FEED = [
  { category: 'AI',         title: "Can Liberia leapfrog traditional banking with AI credit scoring?",                         summary: 'Three Monrovia fintechs are deploying machine-learning models trained on mobile money data to extend micro-loans to unbanked Liberians in under 90 seconds.',  source: 'TrueRate',         time: '8 min read' },
  { category: 'Startups',   title: "The iCampus generation: how Liberia's first tech hub is producing founders",               summary: 'Since 2020, iCampus Monrovia has trained 1,400 developers and seen 38 startups emerge. A look at what is — and isn\'t — working.',                         source: 'TechCabal',        time: '10 min read' },
  { category: 'Fintech',    title: "Orange Money Liberia's billion-dollar quarter: inside the numbers",                        summary: 'An in-depth breakdown of transaction volumes, merchant acceptance rates, and the rural rollout strategy that put Liberia\'s mobile money market in focus.',   source: 'TrueRate',         time: '7 min read' },
  { category: 'Telecom',    title: "4G coverage hits 74%: what it means for Liberia's digital economy",                       summary: 'Lonestar MTN\'s latest rural expansion is reshaping access. But data costs remain among the highest in West Africa, limiting actual usage growth.',             source: 'The New Dawn',     time: '6 min read' },
  { category: 'E-Commerce', title: "Jumia Liberia vs. local platforms: who is winning the last-mile battle?",                  summary: 'Despite Jumia\'s GMV growth, local logistics startup TruckersPro claims faster last-mile delivery in Margibi and Bong counties.',                              source: 'FrontPage Africa', time: '5 min read' },
  { category: 'AI',         title: "AI in Liberia's classrooms: USAID pilots adaptive learning tools in 40 public schools",   summary: 'An $800K pilot in Montserrado County is testing AI-adaptive reading software. Early results show a 1.4-grade-level improvement in 6 months.',                source: 'Liberian Observer', time: '9 min read' },
];

const TECH_METRICS = [
  { label: 'Internet Penetration',    value: '38%',   change: '+6pp YoY',   up: true  },
  { label: 'Mobile Money Tx (Q1)',    value: '$2.1B',  change: '+19% YoY',  up: true  },
  { label: 'Active Mobile Subs',      value: '4.9M',   change: '+11% YoY',  up: true  },
  { label: 'Tech Startup Funding',    value: '$7.1M',  change: '+63% YoY',  up: true  },
];

const UPCOMING = [
  { date: 'Apr 22', event: 'Digital Liberia Summit — Monrovia Convention Center' },
  { date: 'May 5',  event: 'MEST Africa Liberia Demo Day' },
  { date: 'May 12', event: 'CBL Digital Finance Policy Update' },
  { date: 'Jun 2',  event: 'Africa Tech Summit — Kigali (Liberian delegation)' },
];

export default function TechnologyPage() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">

      {/* Breadcrumb + tabs */}
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Technology' }]} />
        <div className="flex gap-0 border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
          <Link href="/news" className="group flex flex-col lg:flex-row gap-6 no-underline mb-8 pb-8 border-b border-white/[0.07]">
            <div className="w-full lg:w-[55%] shrink-0">
              <HeroVisual category={HERO.category} className="w-full h-[200px] sm:h-[280px]" />
            </div>
            <div className="flex flex-col justify-center flex-1">
              <span className={`mb-3 text-[11px] font-bold uppercase tracking-widest ${getCatColor(HERO.category)}`}>
                {HERO.category}
              </span>
              <h2 className="text-[22px] sm:text-[26px] font-black leading-tight text-white group-hover:text-white/80 transition-colors mb-3">
                {HERO.title}
              </h2>
              <p className="text-[14px] leading-relaxed text-gray-400 line-clamp-3 mb-4">{HERO.summary}</p>
              <div className="flex items-center gap-2 mt-auto text-[12px] text-gray-500">
                <span>{HERO.source}</span>
                <span>·</span>
                <span>{HERO.time}</span>
              </div>
            </div>
          </Link>

          {/* Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {STRIP_CARDS.map((card, i) => (
              <Link key={i} href="/news" className="group flex flex-col no-underline">
                <div className="overflow-hidden mb-2.5">
                  <NewsThumbnail category={card.category} className="w-full h-[120px]" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${getCatColor(card.category)}`}>
                  {card.category}
                </span>
                <h3 className="text-[12px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 flex-1">
                  {card.title}
                </h3>
                <div className="mt-1.5 text-[11px] text-gray-400">{card.source} · {card.time}</div>
              </Link>
            ))}
          </div>

          {/* Startup Tracker */}
          <section className="mb-10">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-4">
              <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Startup Funding Tracker</h2>
              <span className="text-[11px] text-gray-500 uppercase tracking-wide font-bold">2026 Rounds</span>
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
              <table className="w-full min-w-[500px] text-[13px]">
                <thead className="border-b border-white/[0.07] text-[11px] font-bold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="pb-3 text-left pr-4">Company</th>
                    <th className="pb-3 text-left pr-4">Sector</th>
                    <th className="pb-3 text-right pr-4">Raise</th>
                    <th className="pb-3 text-left pr-4">Stage</th>
                    <th className="hidden sm:table-cell pb-3 text-left pr-4">Investors</th>
                    <th className="hidden sm:table-cell pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {STARTUP_TRACKER.map((s, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-bold text-white pr-4">{s.name}</td>
                      <td className={`py-3 text-[11px] font-bold uppercase tracking-wide pr-4 ${getCatColor(s.sector)}`}>{s.sector}</td>
                      <td className="tabular-nums py-3 text-right font-bold text-emerald-400 pr-4">{s.raise}</td>
                      <td className="py-3 text-gray-400 pr-4">{s.stage}</td>
                      <td className="hidden sm:table-cell py-3 text-gray-500 text-[12px] pr-4">{s.investors}</td>
                      <td className="hidden sm:table-cell tabular-nums py-3 text-right text-gray-400">{s.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Mobile Money */}
          <section className="mb-10">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-4">
              <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Mobile Money Market</h2>
              <span className="text-[11px] text-gray-500 uppercase tracking-wide font-bold">Q1 2026</span>
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
              <table className="w-full min-w-[380px] text-[13px]">
                <thead className="border-b border-white/[0.07] text-[11px] font-bold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="pb-3 text-left pr-4">Operator</th>
                    <th className="pb-3 text-right pr-4">Active Users</th>
                    <th className="pb-3 text-right pr-4">Tx Volume (Annual)</th>
                    <th className="pb-3 text-right">Qtr Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {MOBILE_MONEY.map((m, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-bold text-white pr-4">{m.operator}</td>
                      <td className="tabular-nums py-3 text-right text-gray-300 pr-4">{m.users}</td>
                      <td className="tabular-nums py-3 text-right font-bold text-white pr-4">{m.txVolume}</td>
                      <td className={`tabular-nums py-3 text-right font-semibold ${m.up ? 'text-emerald-400' : 'text-red-400'}`}>
                        {m.qChange}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-600 mt-3">Source: CBL Financial Inclusion Report · Apr 2026</p>
          </section>

          {/* Analysis feed */}
          <div className="mb-8">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">In-Depth Analysis</h2>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-white/[0.05]">
              {FEED.map((item, i) => (
                <Link key={i} href="/news" className="group flex gap-4 py-5 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden">
                    <NewsThumbnail category={item.category} className="h-[90px] w-[140px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide mb-1.5 block ${getCatColor(item.category)}`}>
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

        </div>

        {/* Right rail */}
        <aside className="hidden xl:block w-[260px] shrink-0">
          <div className="sticky top-[120px] flex flex-col gap-8">

            {/* Digital snapshot */}
            <div>
              <h3 className="text-[12px] font-bold text-white uppercase tracking-[0.12em] border-b border-white/[0.07] pb-3 mb-4">Digital Economy Snapshot</h3>
              <div className="space-y-3">
                {TECH_METRICS.map((m, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-500 pr-3">{m.label}</span>
                    <div className="text-right shrink-0">
                      <div className="text-[13px] font-bold text-white tabular-nums">{m.value}</div>
                      <div className={`text-[11px] tabular-nums ${m.up ? 'text-emerald-400' : 'text-red-400'}`}>{m.change}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-600 mt-3">Sources: CBL · LRDC · Apr 2026</p>
            </div>

            {/* Most Read */}
            <div>
              <h3 className="text-[12px] font-bold text-white uppercase tracking-[0.12em] border-b border-white/[0.07] pb-3 mb-4">Most Read</h3>
              <ol className="space-y-4">
                {[
                  { rank: 1, title: "Ducor Pay's $4.2M raise: what the term sheet looked like", tag: 'Fintech' },
                  { rank: 2, title: 'Orange Money crosses $1B quarterly milestone',              tag: 'Fintech' },
                  { rank: 3, title: "iCampus: Liberia's 38 startups and what comes next",         tag: 'Startups' },
                  { rank: 4, title: '4G at 74% — but data costs still block adoption',            tag: 'Telecom' },
                  { rank: 5, title: "Liberia's AI policy framework: what's proposed",             tag: 'AI' },
                ].map(t => (
                  <li key={t.rank} className="flex gap-3">
                    <span className="shrink-0 text-[20px] font-black text-white/10 tabular-nums w-5 leading-none">{t.rank}</span>
                    <div className="min-w-0">
                      <Link href="/news" className="text-[12px] font-semibold text-gray-400 hover:text-white transition-colors no-underline line-clamp-2 leading-snug block">{t.title}</Link>
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${getCatColor(t.tag)}`}>{t.tag}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Calendar */}
            <div>
              <h3 className="text-[12px] font-bold text-white uppercase tracking-[0.12em] border-b border-white/[0.07] pb-3 mb-4">Tech Calendar</h3>
              <div className="space-y-3">
                {UPCOMING.map((ev, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="shrink-0 text-[11px] font-bold text-gray-400 w-12">{ev.date}</span>
                    <p className="text-[12px] text-gray-400 leading-snug">{ev.event}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="border-t border-white/[0.07] pt-6">
              <h3 className="text-[13px] font-black text-white uppercase tracking-wide mb-1">Tech Brief</h3>
              <p className="text-[12px] text-gray-500 mb-4">Liberia&apos;s digital economy stories, weekly in your inbox.</p>
              <input type="email" placeholder="Your email" className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-[13px] text-white placeholder:text-gray-500 outline-none focus:border-white/60 transition-colors mb-3" />
              <button className="w-full rounded-lg bg-white py-2 text-[13px] font-bold text-[#0a0a0d] hover:brightness-90 transition-all">
                Sign up free
              </button>
            </div>

          </div>
        </aside>
      </div>
    </main>
  );
}
