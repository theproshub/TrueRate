'use client';

import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { useState, useEffect } from 'react';
import type { NormalizedIndicator } from '@/lib/types/indicators';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';

/* ── data ── */
const HERO = {
  href: '/news/1',
  category: 'Monetary Policy',
  title: 'CBL Holds Rate at 20% as Food Prices Keep Inflation Elevated',
  desc: 'The Central Bank of Liberia left its benchmark rate unchanged for a third consecutive meeting, citing stubborn food inflation despite easing pressure from imported goods.',
  author: 'James Kollie',
  time: '2 hours ago',
};

const TOP_STORIES = [
  { href: '/news/4',  category: 'Growth',   title: 'IMF Raises Liberia Growth Forecast to 5.1% on Mining Rebound',   author: 'Sarah Pewee',      time: '4h ago'  },
  { href: '/news/35', category: 'Trade',    title: 'Iron Ore Exports Jump 18% in Q1, Boosting Current Account',       author: 'David Toe',        time: '6h ago'  },
  { href: '/news/31', category: 'Fiscal',   title: "Liberia's 2026 Budget Deficit Narrows to 2.8% of GDP",            author: 'Monica Wreh',      time: '9h ago'  },
  { href: '/news/12', category: 'Banking',  title: 'Ecobank Liberia Reports 14% Deposit Growth in Q1 2026',           author: 'J. Kollie',        time: '11h ago' },
  { href: '/news/30', category: 'Energy',   title: 'Liberia Energy Authority Approves Two New 40MW Solar Projects',   author: 'FrontPage Africa', time: '1d ago'  },
];

// Seed values — replaced with live World Bank data after mount
const SEED_INDICATORS = [
  { label: 'GDP',           value: '$4.27B', change: '+9.8%',  up: true  },
  { label: 'GDP Growth',    value: '4.5%',   change: '+0.3pp', up: true  },
  { label: 'Inflation',     value: '10.3%',  change: '+2.7pp', up: false },
  { label: 'CBL Rate',      value: '20.0%',  change: 'Steady', up: true  },
  { label: 'LRD/USD',       value: '192.50', change: '+0.42%', up: false },
  { label: 'Unemployment',  value: '2.7%',   change: '-0.3pp', up: true  },
  { label: 'Trade Balance', value: '-$0.78B',change: '+4.9%',  up: true  },
  { label: 'Reserves',      value: '$0.50B', change: '+2.5%',  up: true  },
];

const LIBERIA_STORIES = [
  { href: '/news/27', title: 'Rubber Sector Revival: Firestone Expansion Adds 2,400 Jobs',          time: '1d ago', category: 'Agriculture' },
  { href: '/news/10', title: 'Diaspora Remittances Hit Record $680M, Cushioning External Shock',     time: '2d ago', category: 'economy' },
  { href: '/news/26', title: 'Monrovia Port Expansion Breaks Ground, $200M Chinese-Backed Project', time: '3d ago', category: 'Trade' },
];

const WEST_AFRICA_STORIES = [
  { title: 'ECOWAS Single Currency Talks Resume After Two-Year Pause',              time: '5h ago',  category: 'economy' },
  { title: "Nigeria's Naira Stabilises as CBN Tightens FX Market Controls",         time: '8h ago',  category: 'forex' },
  { title: "Ghana's IMF Programme Reaches Third Review Milestone",                  time: '12h ago', category: 'policy' },
];

const CENTRAL_BANK_STORIES = [
  { href: '/news/21', title: 'CBL Launches New Digital Payment Infrastructure Pilot in Monrovia',  time: '2d ago', category: 'Monetary Policy' },
  { href: '/news/28', title: 'Reserve Requirements Raised to 20% to Tighten Excess Liquidity',    time: '4d ago', category: 'Monetary Policy' },
  { href: '/news/19', title: 'Liberia Joins African Central Banks Digital Currency Working Group', time: '5d ago', category: 'Monetary Policy' },
];

const ANALYSIS = [
  {
    href: '/news/1',
    label: 'Analysis',
    category: 'Analysis',
    title: "Why Liberia's Rate Pause May Last Longer Than Markets Expect",
    desc: 'With food prices accounting for over 60% of the CPI basket, the CBL faces structural limits on how quickly inflation can return to target.',
    author: 'Emmanuel Flomo',
    time: '3h ago',
  },
  {
    href: '/news/18',
    label: 'Opinion',
    category: 'policy',
    title: 'The Case for a Liberian Sovereign Wealth Fund',
    desc: 'As iron ore revenues surge, policymakers have a narrow window to establish a resource fund before the commodity cycle turns.',
    author: 'Yvonne Kollie',
    time: '1d ago',
  },
];

const GLOBAL_MACRO = [
  {
    href: '/news/35',
    category: 'China',
    displayCategory: 'commodities',
    title: 'China Steel Demand Slowdown Weighs on Iron Ore Prices, Hits Liberia Export Revenue',
    summary: 'A contraction in Chinese property construction has pushed iron ore spot prices down 12% since January, directly threatening Liberia\'s largest export earner.',
  },
  {
    href: '/news/2',
    category: 'US Fed',
    displayCategory: 'forex',
    title: 'Federal Reserve Hold Lifts Dollar, Tightens Liberia\'s LRD Defence Costs',
    summary: 'The Fed\'s decision to keep rates elevated sustains dollar strength, increasing the CBL\'s cost of maintaining LRD stability and compressing import purchasing power.',
  },
  {
    href: '/news/29',
    category: 'EU Trade',
    displayCategory: 'Trade',
    title: 'EU Carbon Border Mechanism May Reshape Liberia\'s Rubber and Timber Export Markets',
    summary: 'Brussels\' new carbon levy on imports could disadvantage Liberian exporters unless supply chains meet stricter sustainability standards by 2027.',
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
  { href: '/news/26', category: 'Ports',  displayCategory: 'Infrastructure', title: 'Monrovia Port Phase 2 Expansion Breaks Ground — $200M Chinese-Backed Contract', time: '3d ago' },
  { href: '/news/16', category: 'Roads',  displayCategory: 'Infrastructure', title: 'AfDB Awards $85M Road Contract Linking Buchanan to Grand Bassa Mining Corridor', time: '5d ago' },
  { href: '/news/30', category: 'Energy', displayCategory: 'Energy',         title: 'Liberia Attracts First Utility-Scale Solar Bid — 50MW Project Near Monrovia',    time: '6d ago' },
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
  { href: '/news/1',  title: 'CBL Holds Rate at 17.5% — Full Statement' },
  { href: '/news/4',  title: 'IMF Growth Upgrade: What the Numbers Really Mean' },
  { href: '/news/19', title: "Liberia's Debt Burden: A Closer Look at the $2.1B Figure" },
  { href: '/news/35', title: 'Iron Ore Price Surge: How Long Can It Last?' },
  { href: '/news/29', title: 'ECOWAS Trade Deal — Winners and Losers for Liberia' },
];

const TOPICS = ['All', 'Monetary Policy', 'Growth', 'Inflation', 'Trade', 'Fiscal', 'West Africa'];

function StoryCard({ title, time, category, href }: { title: string; time: string; category?: string; href?: string }) {
  return (
    <Link href={href ?? '/economy'} className="group flex flex-col no-underline">
      <div className="relative overflow-hidden rounded-xl mb-3">
        <NewsThumbnail category={category ?? 'economy'} className="w-full h-[170px]" />
      </div>
      {category && <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-1">{category}</span>}
      <h3 className="text-[14px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1.5">{title}</h3>
      <span className="text-[11px] text-gray-400">{time}</span>
    </Link>
  );
}

function formatIndicatorValue(ind: NormalizedIndicator): string {
  const v = ind.value;
  const u = ind.unit;
  if (u === 'B USD') return `$${v.toFixed(2)}B`;
  if (u === 'M') return `${v.toFixed(2)}M`;
  if (u === '%') return `${v.toFixed(1)}%`;
  return `${v}`;
}

function formatIndicatorChange(ind: NormalizedIndicator): string {
  if (ind.change === null || ind.changePercent === null) return 'Steady';
  const unit = ind.unit;
  if (unit === '%') {
    const pp = ind.change.toFixed(1);
    return `${ind.change >= 0 ? '+' : ''}${pp}pp`;
  }
  const pct = ind.changePercent.toFixed(1);
  return `${ind.changePercent >= 0 ? '+' : ''}${pct}%`;
}

export default function EconomyPage() {
  const [indicators, setIndicators] = useState(SEED_INDICATORS);
  const [isLive, setIsLive] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState('All');

  useEffect(() => {
    fetch('/api/indicators')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.indicators?.length) return;
        if (data.updatedAt) setUpdatedAt(data.updatedAt);
        const live: NormalizedIndicator[] = data.indicators;
        // Map live data onto the seed indicator labels
        const keyToLabel: Record<string, string> = {
          GDP: 'GDP',
          GDP_GROWTH: 'GDP Growth',
          INFLATION: 'Inflation',
          CBL_POLICY_RATE: 'CBL Rate',
          UNEMPLOYMENT: 'Unemployment',
          TRADE_BALANCE: 'Trade Balance',
          RESERVES: 'Reserves',
        };
        const updated = SEED_INDICATORS.map(seed => {
          const match = live.find(
            l => Object.entries(keyToLabel).find(([k, label]) => label === seed.label && k === l.key)
          );
          if (!match) return seed;
          return {
            label: seed.label,
            value: formatIndicatorValue(match),
            change: formatIndicatorChange(match),
            up: (match.changePercent ?? 0) >= 0,
          };
        });
        setIndicators(updated);
        setIsLive(true);
      })
      .catch(() => { /* keep seed data */ });
  }, []);

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Economy' }]} />

      {/* Topic filter */}
      <div className="mb-6 flex items-center gap-2 flex-wrap border-b border-white/[0.06] pb-4">
        {TOPICS.map(t => (
          <button key={t} onClick={() => setActiveTopic(t)}
            className={`px-4 py-1.5 text-[13px] font-semibold transition-colors rounded-full ${
              activeTopic === t
                ? 'bg-white text-[#0a0a0d]'
                : 'text-gray-400 hover:text-white'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Indicators strip */}
      <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 items-baseline border-b border-white/[0.06] pb-5">
        {isLive ? (
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
            Seed data
          </span>
        )}
        {updatedAt && (
          <span className="text-[11px] text-gray-500">
            · Updated {new Date(updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )}
        {indicators.map(ind => (
          <div key={ind.label} className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-gray-500 uppercase tracking-wide">{ind.label}</span>
            <span className={`text-[13px] font-bold tabular-nums ${ind.up ? 'text-white' : 'text-red-400'}`}>{ind.value}</span>
            <span className={`text-[11px] ${ind.up ? 'text-emerald-400' : 'text-red-400'}`}>{ind.change}</span>
          </div>
        ))}
      </div>

      {/* Hero + Top Stories */}
      <div className="flex flex-col sm:flex-row gap-6 mb-10">
        {/* Hero */}
        <Link href={HERO.href} className="group relative flex-1 min-w-0 overflow-hidden -mx-2 sm:mx-0 no-underline block">
          <HeroVisual category={HERO.category} className="w-full h-[200px] sm:h-[260px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-1.5 block">{HERO.category}</span>
            <h2 className="text-[20px] sm:text-[24px] font-bold leading-snug text-white mb-2 line-clamp-2">{HERO.title}</h2>
            <p className="text-[13px] text-white/60 line-clamp-2 mb-2 hidden sm:block">{HERO.desc}</p>
            <div className="text-[12px] text-white/60">{HERO.author} · {HERO.time}</div>
          </div>
        </Link>

        {/* Top stories */}
        <div className="w-full sm:w-[280px] shrink-0 flex flex-col justify-between">
          {TOP_STORIES.map((s, i) => (
            <Link key={i} href={s.href ?? '/economy'} className="group flex gap-3 no-underline">
              <div className="relative shrink-0 overflow-hidden rounded-lg w-[100px]">
                <NewsThumbnail category={s.category} className="w-full h-[60px]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1 block">{s.category}</span>
                <h4 className="text-[13px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1">{s.title}</h4>
                <span className="text-[11px] text-gray-400">{s.author} · {s.time}</span>
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
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Liberia Economy</h2>
              </div>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {LIBERIA_STORIES.map((s, i) => <StoryCard key={i} {...s} />)}
            </div>
          </section>

          {/* Analysis & Opinion */}
          <section>
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Analysis &amp; Opinion</h2>
              </div>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {ANALYSIS.map((a, i) => (
                <Link key={i} href={a.href ?? '/economy'} className="group flex flex-col no-underline overflow-hidden">
                  <div className="relative overflow-hidden">
                    <NewsThumbnail category={a.category} className="w-full h-[180px]" />
                  </div>
                  <div className="pt-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-2 block">{a.label}</span>
                    <h3 className="text-[15px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors mb-2">{a.title}</h3>
                    <p className="text-[12px] text-gray-500 line-clamp-2 mb-3">{a.desc}</p>
                    <span className="text-[11px] text-gray-400">{a.author} · {a.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* West Africa */}
          <section>
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">West Africa</h2>
              </div>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {WEST_AFRICA_STORIES.map((s, i) => <StoryCard key={i} {...s} />)}
            </div>
          </section>

          {/* Central Bank */}
          <section>
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Central Bank</h2>
              </div>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {CENTRAL_BANK_STORIES.map((s, i) => <StoryCard key={i} {...s} />)}
            </div>
          </section>

          {/* Global Macro Impact */}
          <section>
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Global Macro Impact</h2>
              </div>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {GLOBAL_MACRO.map((s, i) => (
                <Link key={i} href={s.href} className="group flex flex-col no-underline overflow-hidden">
                  <div className="relative overflow-hidden">
                    <NewsThumbnail category={s.displayCategory} className="w-full h-[150px]" />
                  </div>
                  <div className="pt-3">
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
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Policy Tracker</h2>
              </div>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">Full timeline ›</Link>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {POLICY_TIMELINE.map((item, i) => (
                <Link key={i} href="/economy" className="group flex items-center gap-4 py-4 no-underline hover:bg-white/[0.03] transition-colors">
                  <div className="shrink-0 w-[90px]">
                    <span className="text-[11px] text-gray-400">{item.date}</span>
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
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Infrastructure &amp; Investment</h2>
              </div>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {INFRA_STORIES.map((s, i) => (
                <Link key={i} href={s.href} className="group flex flex-col no-underline overflow-hidden">
                  <div className="relative overflow-hidden">
                    <NewsThumbnail category={s.displayCategory} className="w-full h-[150px]" />
                  </div>
                  <div className="pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1.5 block">{s.category}</span>
                    <h3 className="text-[13px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1.5">{s.title}</h3>
                    <span className="text-[11px] text-gray-400">{s.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* More Stories */}
          <section>
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">More Stories</h2>
              </div>
              <Link href="/news" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">All stories ›</Link>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {[
                { href: '/news/33', cat: 'Banking',     title: "Liberia's banking sector sees 14% deposit growth in Q1 2026",                  src: 'FrontPage Africa',  time: '2h ago'  },
                { href: '/news/30', cat: 'Energy',      title: 'Liberia Energy Authority approves two new solar projects totaling 40MW',       src: 'The New Dawn',      time: '5h ago'  },
                { href: '/news/7',  cat: 'Agriculture', title: 'Palm oil exports up 18% — smallholders benefit from new pricing policy',       src: 'Liberian Observer', time: '7h ago'  },
                { href: '/news/29', cat: 'Trade',       title: 'Liberia-EU trade deal talks advance as both sides agree on tariff framework',  src: 'Reuters',           time: '9h ago'  },
                { href: '/news/15', cat: 'Tech',        title: 'Monrovia fintech startup raises $4.2M Series A to expand mobile lending',      src: 'TechCabal',         time: '13h ago' },
                { href: '/news/31', cat: 'Policy',      title: 'Finance Ministry tables revised budget with 12% increase in capital spending', src: 'Daily Observer',    time: '15h ago' },
              ].map((s, i) => (
                <Link key={i} href={s.href} className="group flex items-start gap-4 py-3.5 no-underline hover:bg-white/[0.02] transition-colors">
                  <div className="shrink-0 overflow-hidden rounded-lg">
                    <NewsThumbnail category={s.cat} className="h-[64px] w-[90px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-[10px] font-bold uppercase tracking-wide ${getCatColor(s.cat)} mb-1`}>{s.cat}</div>
                    <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-1">{s.title}</h3>
                    <div className="text-[11px] text-gray-400">{s.src} · {s.time}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Data Focus: Liberia's Exports */}
          <section>
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Data Focus: Liberia&apos;s Exports</h2>
              </div>
              <Link href="/economy" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">Full data ›</Link>
            </div>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-white/[0.05]">
                {EXPORT_STATS.map((stat, i) => (
                  <div key={i} className="p-5 flex flex-col gap-1">
                    <span className="text-[11px] text-gray-500 uppercase tracking-wide">{stat.label}</span>
                    <span className="text-[22px] sm:text-[28px] font-black text-white tabular-nums leading-none">{stat.value}</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[12px] font-bold ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stat.up ? '▲' : '▼'} {stat.change}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-0.5">{stat.period}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-600 mt-2">Sources: Ministry of Commerce · CBL · ArcelorMittal · Apr 2026</p>
            </div>
          </section>

        </div>

        {/* Right rail */}
        <aside className="w-full sm:w-[260px] shrink-0 space-y-8">

          {/* Most Read */}
          <div>
            <h3 className="text-[13px] font-black text-white uppercase tracking-wide border-b border-white/[0.07] pb-3 mb-4">Most Read</h3>
            <ol className="space-y-4">
              {MOST_READ.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[22px] font-black text-white/10 tabular-nums leading-none shrink-0 w-6">{i + 1}</span>
                  <Link href={item.href} className="text-[13px] font-semibold text-gray-300 hover:text-white transition-colors no-underline leading-snug">{item.title}</Link>
                </li>
              ))}
            </ol>
          </div>

          {/* Latest Updates */}
          <div>
            <h3 className="text-[13px] font-bold text-white border-b border-white/[0.07] pb-3 mb-0">Latest Updates</h3>
            <div className="divide-y divide-white/[0.04]">
              {[
                { href: '/news/1',  time: '16m', headline: 'CBL signals readiness to intervene if LRD weakens past 195' },
                { href: '/news/3',  time: '46m', headline: 'ArcelorMittal ships first expanded-capacity iron ore batch' },
                { href: '/news/16', time: '1h',  headline: 'World Bank approves $45M grant for Liberia road infrastructure' },
                { href: '/news/5',  time: '2h',  headline: 'Firestone rubber output hits decade high on favorable weather' },
                { href: '/news/12', time: '3h',  headline: 'Ecobank raises dividend after strong West Africa quarter' },
                { href: '/news/8',  time: '5h',  headline: 'IMF praises Liberia fiscal consolidation, urges revenue reform' },
              ].map((item, i) => (
                <Link key={i} href={item.href} className="group flex items-start gap-3 py-3 no-underline hover:bg-white/[0.02] transition-colors">
                  <span className="shrink-0 tabular-nums text-[11px] text-gray-400 w-7 pt-0.5">{item.time}</span>
                  <span className="text-[12px] font-medium leading-snug text-white/80 group-hover:text-white transition-colors">{item.headline}</span>
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-white/[0.04]">
              <Link href="/news" className="text-[12px] text-gray-400 hover:text-white transition-colors no-underline">See all updates ›</Link>
            </div>
          </div>

          {/* Data snapshot */}
          <div>
            <h3 className="text-[13px] font-black text-white uppercase tracking-wide border-b border-white/[0.07] pb-3 mb-4">Data Snapshot</h3>
            <div className="space-y-3">
              {indicators.map(ind => (
                <div key={ind.label} className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500">{ind.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-white tabular-nums">{ind.value}</span>
                    <span className={`text-[11px] font-semibold ${ind.up ? 'text-emerald-400' : 'text-red-400'}`}>{ind.change}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-600 mt-4">Sources: CBL · World Bank · IMF · Apr 2026</p>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[13px] font-black text-white uppercase tracking-wide border-b border-white/[0.07] pb-3 mb-4">Economy Brief</h3>
            <p className="text-[12px] text-gray-500 mb-4">The week&apos;s key economic stories from Liberia and West Africa, every Friday.</p>
            <input type="email" placeholder="Your email" className="w-full rounded-lg bg-white/[0.06] border border-white/[0.08] px-3 py-2 text-[13px] text-white placeholder:text-gray-400 outline-none focus:border-white/30 mb-2" />
            <button className="w-full rounded-lg bg-white py-2 text-[13px] font-bold text-[#0a0a0d] hover:brightness-90 transition-all">
              Sign up free
            </button>
          </div>

          {/* Policy Calendar */}
          <div>
            <h3 className="text-[13px] font-black text-white uppercase tracking-wide border-b border-white/[0.07] pb-3 mb-0">Policy Calendar</h3>
            <div className="divide-y divide-white/[0.04]">
              {POLICY_CALENDAR.map((ev, i) => (
                <Link key={i} href="/economy" className="flex items-start gap-3 py-3 no-underline group hover:bg-white/[0.02] transition-colors">
                  <div className="shrink-0 rounded-lg bg-white/[0.05] border border-white/[0.06] px-2 py-1 text-center min-w-[40px]">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">{ev.month}</p>
                    <p className="text-[14px] font-black text-white leading-none">{ev.day}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors leading-snug">{ev.title}</p>
                    <span className="mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase bg-white/[0.06] text-white/60">{ev.type}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* IMF Program Status */}
          <div>
            <h3 className="text-[13px] font-black text-white uppercase tracking-wide border-b border-white/[0.07] pb-3 mb-4">IMF Program Status</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-gray-500">Program</span>
              <span className="text-[12px] font-semibold text-white">ECF — $270M</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] text-gray-500">Current Tranche</span>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">3rd — Approved</span>
            </div>
            <div className="space-y-2">
              {[
                { tranche: '1st', amount: '$45M', status: 'Disbursed', up: true },
                { tranche: '2nd', amount: '$45M', status: 'Disbursed', up: true },
                { tranche: '3rd', amount: '$45M', status: 'Disbursed', up: true },
                { tranche: '4th', amount: '$45M', status: 'Pending',   up: false },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">{t.tranche} Tranche · {t.amount}</span>
                  <span className={`text-[11px] font-bold ${t.up ? 'text-emerald-400' : 'text-gray-400'}`}>{t.status}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-600 mt-3">Next review: May 2026 · Source: IMF</p>
          </div>

        </aside>
      </div>

    </main>
  );
}
