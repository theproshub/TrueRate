'use client';

import Link from 'next/link';

/* ── data ── */
const HERO = {
  category: 'Monetary Policy',
  title: 'CBL Holds Rate at 17.5% as Food Prices Keep Inflation Elevated',
  desc: 'The Central Bank of Liberia left its benchmark rate unchanged for a third consecutive meeting, citing stubborn food inflation despite easing pressure from imported goods.',
  author: 'James Kollie',
  time: '2 hours ago',
  thumb: 'https://picsum.photos/seed/eco-hero/1200/600',
};

const TOP_STORIES = [
  {
    category: 'Growth',
    title: 'IMF Raises Liberia Growth Forecast to 5.1% on Mining Rebound',
    author: 'Sarah Pewee',
    time: '4h ago',
    thumb: 'https://picsum.photos/seed/eco1/600/340',
  },
  {
    category: 'Trade',
    title: 'Iron Ore Exports Jump 18% in Q1, Boosting Current Account',
    author: 'David Toe',
    time: '6h ago',
    thumb: 'https://picsum.photos/seed/eco2/600/340',
  },
  {
    category: 'Fiscal',
    title: "Liberia's 2026 Budget Deficit Narrows to 2.8% of GDP",
    author: 'Monica Wreh',
    time: '9h ago',
    thumb: 'https://picsum.photos/seed/eco3/600/340',
  },
  {
    category: 'Banking',
    title: 'Ecobank Liberia Reports 14% Deposit Growth in Q1 2026',
    author: 'J. Kollie',
    time: '11h ago',
    thumb: 'https://picsum.photos/seed/eco4/600/340',
  },
  {
    category: 'Energy',
    title: 'Liberia Energy Authority Approves Two New 40MW Solar Projects',
    author: 'FrontPage Africa',
    time: '1d ago',
    thumb: 'https://picsum.photos/seed/eco5/600/340',
  },
];

const INDICATORS = [
  { label: 'GDP Growth',    value: '4.5%',   change: '+0.3pp', up: true  },
  { label: 'Inflation',     value: '10.2%',  change: '-0.4pp', up: true  },
  { label: 'CBL Rate',      value: '17.50%', change: 'Steady', up: true  },
  { label: 'LRD/USD',       value: '192.50', change: '+0.65%', up: true  },
  { label: 'Unemployment',  value: '3.6%',   change: '-0.2pp', up: true  },
  { label: 'Trade Deficit', value: '$0.82B', change: '-8.1%',  up: true  },
];

const LIBERIA_STORIES = [
  { title: 'Rubber Sector Revival: Firestone Expansion Adds 2,400 Jobs',           time: '1d ago', thumb: 'https://picsum.photos/seed/lib1/400/225' },
  { title: 'Diaspora Remittances Hit Record $680M, Cushioning External Shock',      time: '2d ago', thumb: 'https://picsum.photos/seed/lib2/400/225' },
  { title: 'Monrovia Port Expansion Breaks Ground, $200M Chinese-Backed Project',  time: '3d ago', thumb: 'https://picsum.photos/seed/lib3/400/225' },
];

const WEST_AFRICA_STORIES = [
  { title: 'ECOWAS Single Currency Talks Resume After Two-Year Pause',              time: '5h ago',  thumb: 'https://picsum.photos/seed/wa1/400/225' },
  { title: "Nigeria's Naira Stabilises as CBN Tightens FX Market Controls",         time: '8h ago',  thumb: 'https://picsum.photos/seed/wa2/400/225' },
  { title: "Ghana's IMF Programme Reaches Third Review Milestone",                  time: '12h ago', thumb: 'https://picsum.photos/seed/wa3/400/225' },
];

const CENTRAL_BANK_STORIES = [
  { title: 'CBL Launches New Digital Payment Infrastructure Pilot in Monrovia',     time: '2d ago', thumb: 'https://picsum.photos/seed/cb1/400/225' },
  { title: 'Reserve Requirements Raised to 20% to Tighten Excess Liquidity',       time: '4d ago', thumb: 'https://picsum.photos/seed/cb2/400/225' },
  { title: 'Liberia Joins African Central Banks Digital Currency Working Group',    time: '5d ago', thumb: 'https://picsum.photos/seed/cb3/400/225' },
];

const ANALYSIS = [
  {
    label: 'Analysis',
    title: "Why Liberia's Rate Pause May Last Longer Than Markets Expect",
    desc: 'With food prices accounting for over 60% of the CPI basket, the CBL faces structural limits on how quickly inflation can return to target.',
    author: 'Emmanuel Flomo',
    time: '3h ago',
    thumb: 'https://picsum.photos/seed/an1/800/450',
  },
  {
    label: 'Opinion',
    title: 'The Case for a Liberian Sovereign Wealth Fund',
    desc: 'As iron ore revenues surge, policymakers have a narrow window to establish a resource fund before the commodity cycle turns.',
    author: 'Yvonne Kollie',
    time: '1d ago',
    thumb: 'https://picsum.photos/seed/an2/800/450',
  },
];

const GLOBAL_MACRO = [
  {
    category: 'China',
    title: 'China Steel Demand Slowdown Weighs on Iron Ore Prices, Hits Liberia Export Revenue',
    summary: 'A contraction in Chinese property construction has pushed iron ore spot prices down 12% since January, directly threatening Liberia\'s largest export earner.',
    thumb: 'https://picsum.photos/seed/gm1/600/340',
  },
  {
    category: 'US Fed',
    title: 'Federal Reserve Hold Lifts Dollar, Tightens Liberia\'s LRD Defence Costs',
    summary: 'The Fed\'s decision to keep rates elevated sustains dollar strength, increasing the CBL\'s cost of maintaining LRD stability and compressing import purchasing power.',
    thumb: 'https://picsum.photos/seed/gm2/600/340',
  },
  {
    category: 'EU Trade',
    title: 'EU Carbon Border Mechanism May Reshape Liberia\'s Rubber and Timber Export Markets',
    summary: 'Brussels\' new carbon levy on imports could disadvantage Liberian exporters unless supply chains meet stricter sustainability standards by 2027.',
    thumb: 'https://picsum.photos/seed/gm3/600/340',
  },
];

const POLICY_TIMELINE = [
  { date: 'Apr 7, 2026',  title: 'CBL Monetary Policy Committee Meeting',          status: 'Upcoming' },
  { date: 'Mar 28, 2026', title: 'IMF Article IV Consultation — Final Review',      status: 'Completed' },
  { date: 'Mar 15, 2026', title: '2026 Supplementary Budget Submitted to Legislature', status: 'Active' },
  { date: 'Feb 22, 2026', title: 'CBL Reserve Requirement Increase to 20%',         status: 'Completed' },
  { date: 'Feb 10, 2026', title: 'ECOWAS Trade Protocol Ratification Tabled',       status: 'Active' },
];

const INFRA_STORIES = [
  { category: 'Ports',   title: 'Monrovia Port Phase 2 Expansion Breaks Ground — $200M Chinese-Backed Contract', time: '3d ago', thumb: 'https://picsum.photos/seed/inf1/600/340' },
  { category: 'Roads',   title: 'AfDB Awards $85M Road Contract Linking Buchanan to Grand Bassa Mining Corridor', time: '5d ago', thumb: 'https://picsum.photos/seed/inf2/600/340' },
  { category: 'Energy',  title: 'Liberia Attracts First Utility-Scale Solar Bid — 50MW Project Near Monrovia',    time: '6d ago', thumb: 'https://picsum.photos/seed/inf3/600/340' },
];

const EXPORT_STATS = [
  { label: 'Iron Ore Volume',  value: '4.8Mt',  change: '+18%',  up: true,  period: 'Q1 2026' },
  { label: 'Rubber Revenue',   value: '$142M',  change: '+6.2%', up: true,  period: 'Q1 2026' },
  { label: 'Gold Exports',     value: '$38M',   change: '+22%',  up: true,  period: 'Q1 2026' },
  { label: 'Total Exports',    value: '$312M',  change: '+14%',  up: true,  period: 'Q1 2026' },
];

const POLICY_CALENDAR = [
  { month: 'Apr', day: '7',  title: 'CBL MPC Meeting',             type: 'Monetary Policy' },
  { month: 'Apr', day: '10', title: 'Q1 GDP Advance Estimate',      type: 'Data Release' },
  { month: 'Apr', day: '14', title: 'Mid-Year Budget Review',        type: 'Fiscal' },
  { month: 'Apr', day: '22', title: 'IMF Staff Visit — Monrovia',    type: 'IMF' },
];

const MOST_READ = [
  'CBL Holds Rate at 17.5% — Full Statement',
  'IMF Growth Upgrade: What the Numbers Really Mean',
  "Liberia's Debt Burden: A Closer Look at the $2.1B Figure",
  'Iron Ore Price Surge: How Long Can It Last?',
  'ECOWAS Trade Deal — Winners and Losers for Liberia',
];

const TOPICS = ['All', 'Monetary Policy', 'Growth', 'Inflation', 'Trade', 'Fiscal', 'West Africa'];

function StoryCard({ title, time, thumb, category }: { title: string; time: string; thumb: string; category?: string }) {
  return (
    <Link href="/economy" className="group flex flex-col no-underline">
      <div className="relative overflow-hidden rounded-xl mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb} alt="" className="w-full h-[170px] object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      {category && <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-1">{category}</span>}
      <h3 className="text-[14px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1.5">{title}</h3>
      <span className="text-[11px] text-gray-600">{time}</span>
    </Link>
  );
}

export default function EconomyPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">

      {/* Section header */}
      <div className="mb-6 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-[28px] font-black text-white tracking-tight">Economics</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Liberia &amp; West Africa · Macro, Policy, Trade</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {TOPICS.map((t, i) => (
              <button key={t} className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-colors ${i === 0 ? 'bg-white text-[#0a0a0d]' : 'text-white border border-white/20 hover:bg-white/[0.06]'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Indicators strip */}
      <div className="mb-8 flex flex-wrap gap-2">
        {INDICATORS.map(ind => (
          <span key={ind.label} className="rounded-lg border border-white/20 px-3 py-1 text-[12px] font-semibold text-white hover:bg-white/[0.06] transition-colors cursor-default">
            {ind.label}
          </span>
        ))}
      </div>

      {/* Hero + Top Stories */}
      <div className="flex flex-col sm:flex-row gap-6 mb-10">
        {/* Hero */}
        <Link href="/economy" className="group relative flex-1 min-w-0 overflow-hidden rounded-2xl no-underline block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO.thumb} alt="" className="w-full h-[340px] object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-2 block">{HERO.category}</span>
            <h2 className="text-[22px] lg:text-[26px] font-black leading-snug text-white mb-3 line-clamp-3">{HERO.title}</h2>
            <p className="text-[13px] text-white/60 line-clamp-2 mb-3 hidden sm:block">{HERO.desc}</p>
            <div className="text-[12px] text-white/40">{HERO.author} · {HERO.time}</div>
          </div>
        </Link>

        {/* Top stories */}
        <div className="w-full sm:w-[280px] shrink-0 flex flex-col justify-between">
          {TOP_STORIES.map((s, i) => (
            <Link key={i} href="/economy" className="group flex gap-3 no-underline">
              <div className="relative shrink-0 overflow-hidden rounded-lg w-[100px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.thumb} alt="" className="w-full h-[60px] object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1 block">{s.category}</span>
                <h4 className="text-[13px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1">{s.title}</h4>
                <span className="text-[11px] text-gray-600">{s.author} · {s.time}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content + right rail */}
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-10">

          {/* Liberia Economy */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-black text-white border-l-[3px] border-emerald-400 pl-3">Liberia Economy</h2>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {LIBERIA_STORIES.map((s, i) => <StoryCard key={i} {...s} />)}
            </div>
          </section>

          {/* Analysis & Opinion */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-black text-white border-l-[3px] border-white pl-3">Analysis &amp; Opinion</h2>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {ANALYSIS.map((a, i) => (
                <Link key={i} href="/economy" className="group flex flex-col no-underline rounded-2xl border border-white/[0.07] bg-[#141418] overflow-hidden">
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.thumb} alt="" className="w-full h-[180px] object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-2 block">{a.label}</span>
                    <h3 className="text-[15px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors mb-2">{a.title}</h3>
                    <p className="text-[12px] text-gray-500 line-clamp-2 mb-3">{a.desc}</p>
                    <span className="text-[11px] text-gray-600">{a.author} · {a.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* West Africa */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-black text-white border-l-[3px] border-emerald-400 pl-3">West Africa</h2>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {WEST_AFRICA_STORIES.map((s, i) => <StoryCard key={i} {...s} />)}
            </div>
          </section>

          {/* Central Bank */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-black text-white border-l-[3px] border-emerald-400 pl-3">Central Bank</h2>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {CENTRAL_BANK_STORIES.map((s, i) => <StoryCard key={i} {...s} />)}
            </div>
          </section>

          {/* Global Macro Impact */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-black text-white border-l-[3px] border-emerald-400 pl-3">Global Macro Impact</h2>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {GLOBAL_MACRO.map((s, i) => (
                <Link key={i} href="/economy" className="group flex flex-col no-underline rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.thumb} alt="" className="w-full h-[150px] object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1.5 block">{s.category}</span>
                    <h3 className="text-[13px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-2">{s.title}</h3>
                    <p className="text-[12px] text-gray-500 line-clamp-3">{s.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Policy Tracker */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-black text-white border-l-[3px] border-emerald-400 pl-3">Policy Tracker</h2>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">Full timeline ›</Link>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden divide-y divide-white/[0.05]">
              {POLICY_TIMELINE.map((item, i) => (
                <Link key={i} href="/economy" className="group flex items-center gap-4 px-5 py-4 no-underline hover:bg-white/[0.03] transition-colors">
                  <div className="shrink-0 w-[90px]">
                    <span className="text-[11px] text-gray-600">{item.date}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-white group-hover:text-white/70 transition-colors leading-snug">{item.title}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    item.status === 'Active'    ? 'bg-emerald-500/15 text-emerald-400' :
                    item.status === 'Completed' ? 'bg-white/[0.07] text-gray-400'     :
                                                  'bg-blue-500/15 text-blue-400'
                  }`}>{item.status}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Infrastructure & Investment */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-black text-white border-l-[3px] border-emerald-400 pl-3">Infrastructure &amp; Investment</h2>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {INFRA_STORIES.map((s, i) => (
                <Link key={i} href="/economy" className="group flex flex-col no-underline rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.thumb} alt="" className="w-full h-[150px] object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1.5 block">{s.category}</span>
                    <h3 className="text-[13px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1.5">{s.title}</h3>
                    <span className="text-[11px] text-gray-600">{s.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Data Focus: Liberia's Exports */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-black text-white border-l-[3px] border-emerald-400 pl-3">Data Focus: Liberia&apos;s Exports</h2>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">Full data ›</Link>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-white/[0.05]" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {EXPORT_STATS.map((stat, i) => (
                  <div key={i} className="p-5 flex flex-col gap-1">
                    <span className="text-[11px] text-gray-500 uppercase tracking-wide">{stat.label}</span>
                    <span className="text-[28px] font-black text-white tabular-nums leading-none">{stat.value}</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[12px] font-bold ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stat.up ? '▲' : '▼'} {stat.change}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-700 mt-0.5">{stat.period}</span>
                  </div>
                ))}
              </div>
              <p className="px-5 py-3 text-[10px] text-gray-700 border-t border-white/[0.05]">Sources: Ministry of Commerce · CBL · ArcelorMittal · Apr 2026</p>
            </div>
          </section>

        </div>

        {/* Right rail */}
        <aside className="w-full sm:w-[260px] shrink-0 space-y-8">

          {/* Most Read */}
          <div className="rounded-xl border border-white/[0.07] bg-[#141418] p-5">
            <h3 className="text-[13px] font-black text-white uppercase tracking-wide mb-4">Most Read</h3>
            <ol className="space-y-4">
              {MOST_READ.map((title, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[22px] font-black text-white/10 tabular-nums leading-none shrink-0 w-6">{i + 1}</span>
                  <Link href="/economy" className="text-[13px] font-semibold text-gray-300 hover:text-white transition-colors no-underline leading-snug">{title}</Link>
                </li>
              ))}
            </ol>
          </div>

          {/* Data snapshot */}
          <div className="rounded-xl border border-white/[0.07] bg-[#141418] p-5">
            <h3 className="text-[13px] font-black text-white uppercase tracking-wide mb-4">Data Snapshot</h3>
            <div className="space-y-3">
              {INDICATORS.map(ind => (
                <div key={ind.label} className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500">{ind.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-white tabular-nums">{ind.value}</span>
                    <span className={`text-[11px] font-semibold ${ind.up ? 'text-emerald-400' : 'text-red-400'}`}>{ind.change}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-700 mt-4">Sources: CBL · World Bank · IMF · Apr 2026</p>
          </div>

          {/* Newsletter */}
          <div className="rounded-xl border border-white/[0.07] bg-[#141418] p-5">
            <h3 className="text-[13px] font-black text-white uppercase tracking-wide mb-1">Economy Brief</h3>
            <p className="text-[12px] text-gray-500 mb-4">The week&apos;s key economic stories from Liberia and West Africa, every Friday.</p>
            <input type="email" placeholder="Your email" className="w-full rounded-lg bg-white/[0.06] border border-white/[0.08] px-3 py-2 text-[13px] text-white placeholder:text-gray-600 outline-none focus:border-white/30 mb-2" />
            <button className="w-full rounded-lg bg-white py-2 text-[13px] font-bold text-[#0a0a0d] hover:brightness-90 transition-all">
              Subscribe
            </button>
          </div>

          {/* Policy Calendar */}
          <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
            <div className="px-4 py-3.5 border-b border-white/[0.05]">
              <h3 className="text-[13px] font-black text-white uppercase tracking-wide">Policy Calendar</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {POLICY_CALENDAR.map((ev, i) => (
                <Link key={i} href="/economy" className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-white/[0.02] transition-colors">
                  <div className="shrink-0 rounded-lg bg-white/[0.05] border border-white/[0.06] px-2 py-1 text-center min-w-[40px]">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-gray-600">{ev.month}</p>
                    <p className="text-[14px] font-black text-white leading-none">{ev.day}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors leading-snug">{ev.title}</p>
                    <span className="mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase bg-white/[0.06] text-white/40">{ev.type}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* IMF Program Status */}
          <div className="rounded-xl border border-white/[0.07] bg-[#141418] p-5">
            <h3 className="text-[13px] font-black text-white uppercase tracking-wide mb-3">IMF Program Status</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-gray-500">Program</span>
              <span className="text-[12px] font-semibold text-white">ECF — $270M</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] text-gray-500">Current Tranche</span>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">3rd — Approved</span>
            </div>
            <div className="rounded-lg bg-white/[0.04] border border-white/[0.05] p-3 space-y-2">
              {[
                { tranche: '1st', amount: '$45M', status: 'Disbursed', up: true },
                { tranche: '2nd', amount: '$45M', status: 'Disbursed', up: true },
                { tranche: '3rd', amount: '$45M', status: 'Disbursed', up: true },
                { tranche: '4th', amount: '$45M', status: 'Pending',   up: false },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">{t.tranche} Tranche · {t.amount}</span>
                  <span className={`text-[11px] font-bold ${t.up ? 'text-emerald-400' : 'text-gray-600'}`}>{t.status}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-700 mt-3">Next review: May 2026 · Source: IMF</p>
          </div>

        </aside>
      </div>

    </main>
  );
}
