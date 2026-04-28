'use client';

import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { useState } from 'react';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';

/* ─── data ─── */

const HERO = {
  href: '/news/15',
  category: 'Founders',
  title: "From Monrovia market stalls to $4M in funding: the Liberian founders rewriting the startup playbook",
  desc: 'A new cohort of entrepreneurs is attracting pan-African venture capital by solving hyper-local problems — from last-mile logistics to rural credit access — without waiting for institutional support.',
  author: 'Sarah Pewee',
  time: '3 hours ago',
};

const TOP_STORIES = [
  { href: '/news/15', category: 'Funding',  title: 'Ducor Pay closes $4.2M Series A — largest fintech raise in Liberia to date',              author: 'James Kollie',      time: '1h ago'  },
  { href: '/news/7',  category: 'SMEs',     title: "Liberia's SME sector employs 68% of workforce but receives under 8% of bank credit",      author: 'World Bank',        time: '4h ago'  },
  { href: '/news/3',  category: 'Founders', title: 'TruckersPro founder on building a 200-truck logistics network with no seed funding',       author: 'TrueRate',          time: '6h ago'  },
  { href: '/news/27', category: 'Women',    title: 'Women-led firms now 31% of new Liberia Business Registry applications',                    author: 'Liberian Observer', time: '8h ago'  },
  { href: '/news/5',  category: 'Growth',   title: 'AgriLink LR triples farmer network to 14,000 after closing $800K seed round',             author: 'The New Dawn',      time: '11h ago' },
];

const ECOSYSTEM_STATS = [
  { label: 'Registered SMEs',        value: '42,000', change: '+12% YoY', up: true  },
  { label: 'Startup Funding (2025)', value: '$7.1M',  change: '+63% YoY', up: true  },
  { label: 'SME Credit Gap',         value: '$380M',  change: 'Unchanged',up: false },
  { label: 'Women-led Businesses',   value: '31%',    change: '+4pp YoY', up: true  },
  { label: 'iCampus Graduates',      value: '1,400',  change: '+18% YoY', up: true  },
  { label: 'Active Angel Investors', value: '34',     change: '+11 YoY',  up: true  },
];

const TOPICS = ['All', 'Founders', 'Funding', 'SMEs', 'Women in Business', 'West Africa'];

const LIBERIA_STARTUPS = [
  { href: '/news/15', title: 'Ducor Pay raises $4.2M Series A to expand USSD lending across West Africa',       time: '1h ago',  category: 'Fintech'   },
  { href: '/news/5',  title: 'AgriLink LR connects 14,000 smallholder farmers to Monrovia fresh produce buyers',time: '11h ago', category: 'AgriTech'  },
  { href: '/news/3',  title: 'TruckersPro bootstraps 200-truck network before taking first investment',          time: '1d ago',  category: 'Logistics' },
];

const DEALS_FEED = [
  { date: 'Apr 10', type: 'Series A', company: 'Ducor Pay',       sector: 'Fintech',    amount: '$4.2M', investors: 'Partech Africa · Ventures Platform' },
  { date: 'Mar 22', type: 'Seed',     company: 'HealthBridge LR', sector: 'HealthTech', amount: '$1.2M', investors: 'Chandaria Capital · Angel network'  },
  { date: 'Mar 14', type: 'Seed',     company: 'AgriLink LR',     sector: 'AgriTech',   amount: '$800K', investors: 'GreenTec Capital'                   },
  { date: 'Feb 28', type: 'Grant',    company: 'LernerAI',        sector: 'EdTech',     amount: '$350K', investors: 'MEST Africa'                        },
  { date: 'Feb 10', type: 'Pre-seed', company: 'TruckersPro LR',  sector: 'Logistics',  amount: '$500K', investors: 'Self-funded + grants'               },
  { date: 'Jan 30', type: 'Grant',    company: 'SolarMon',        sector: 'CleanTech',  amount: '$280K', investors: 'USAID Power Africa'                 },
];

const FOUNDER_SPOTLIGHTS = [
  {
    href: '/news/3',
    label: 'Founder Story',
    category: 'Founders',
    title: "Moses Kpehe, TruckersPro: 'We built the route before we raised a dollar'",
    desc: 'The logistics founder bootstrapped a 200-truck network across six counties before approaching investors. He explains why product-market fit mattered more than pitch decks.',
    author: 'TrueRate',
    time: '1d ago',
  },
  {
    href: '/news/15',
    label: 'Analysis',
    category: 'Funding',
    title: "Why West African VCs are finally paying attention to Liberia",
    desc: 'Liberian startups closed $7.1M in 2025 — triple the 2023 figure. After years on the margins of pan-African VC activity, what changed?',
    author: 'TechCabal',
    time: '2d ago',
  },
];

const SME_STORIES = [
  { href: '/news/7',  title: "The credit gap killing Liberia's small businesses — and what three fintechs are doing", time: '2d ago', category: 'SMEs'    },
  { href: '/news/12', title: 'Ecobank Liberia launches $20M SME lending facility targeting Margibi and Bong',         time: '3d ago', category: 'Banking' },
  { href: '/news/29', title: 'LBDI introduces asset-backed micro-loans for market traders after CBL directive',        time: '4d ago', category: 'Finance' },
];

const WOMEN_STORIES = [
  {
    href: '/news/27',
    category: 'Women',
    title: "Liberia's women entrepreneurs outpace male peers on growth — but hit glass ceilings at Series A",
    summary: 'Women-founded companies grow 18% faster at seed stage but raise 40% less at follow-on rounds.',
    author: 'Liberian Observer',
    time: '8h ago',
  },
  {
    href: '/news/5',
    category: 'Women',
    title: "She Built It: the women-led businesses reshaping Monrovia's economy",
    summary: 'Five female entrepreneurs share how they scaled past the $100K revenue threshold.',
    author: 'TrueRate',
    time: '1d ago',
  },
];

const WEST_AFRICA_STARTUPS = [
  { href: '/news/1', title: 'Paystack-backed fund closes $40M to invest in Francophone West Africa startups', time: '6h ago',  category: 'Funding'  },
  { href: '/news/2', title: "Ghana's startup ecosystem raises $180M in Q1 2026 despite global VC slowdown",   time: '9h ago',  category: 'Startups' },
  { href: '/news/4', title: 'ECOWAS proposes unified startup visa to ease cross-border founder mobility',      time: '14h ago', category: 'Policy'   },
];

const MORE_STORIES = [
  { href: '/news/15', cat: 'Fintech',   title: "Ducor Pay's term sheet: what $4.2M looks like for a Liberian fintech",            src: 'TechCabal',         time: '1h ago'  },
  { href: '/news/27', cat: 'Women',     title: 'Women founders growing faster but raising 40% less — the data breakdown',          src: 'Liberian Observer', time: '8h ago'  },
  { href: '/news/3',  cat: 'Logistics', title: 'TruckersPro: from borrowed trucks to a $500K pre-seed and 6 county coverage',      src: 'TrueRate',          time: '1d ago'  },
  { href: '/news/5',  cat: 'AgriTech',  title: 'AgriLink LR triples farmer network — the unit economics behind the growth',         src: 'The New Dawn',      time: '2d ago'  },
  { href: '/news/7',  cat: 'SMEs',      title: 'CBL data: only $29M in new SME loans issued in Q1 against $380M estimated demand', src: 'FrontPage Africa',  time: '2d ago'  },
  { href: '/news/12', cat: 'Banking',   title: 'Ecobank SME lending facility: who qualifies and how to apply',                     src: 'Daily Observer',    time: '3d ago'  },
];

const ECOSYSTEM_DATA = [
  { label: 'Total 2025 Startup Funding', value: '$7.1M',  change: '+63%',   up: true,  period: '2025'     },
  { label: 'Active Startups',            value: '180+',   change: '+22%',   up: true,  period: '2025'     },
  { label: 'iCampus Companies Funded',   value: '38',     change: '+12',    up: true,  period: 'All time' },
  { label: 'SME Bank Credit Share',      value: '7.8%',   change: '-0.2pp', up: false, period: 'Q1 2026'  },
];

const EVENTS = [
  { month: 'Apr', day: '18', title: 'Liberia Entrepreneurship Forum',          type: 'Conference' },
  { month: 'Apr', day: '28', title: 'MEST Africa Liberia Demo Day',             type: 'Pitching'   },
  { month: 'May', day: '8',  title: 'World Bank SME Finance Conference',        type: 'Application'},
  { month: 'May', day: '20', title: 'Partech Africa — Monrovia cohort pitches', type: 'VC Event'   },
];

const MOST_READ = [
  { href: '/news/15', title: "Ducor Pay's $4.2M Series A — term sheet breakdown" },
  { href: '/news/3',  title: "Moses Kpehe: building TruckersPro without investors" },
  { href: '/news/7',  title: "Why VCs are finally looking at Liberia" },
  { href: '/news/27', title: "The SME credit gap: $380M and still growing" },
  { href: '/news/5',  title: "Women founders growing faster but raising less" },
];

const TOP_INVESTORS = [
  { name: 'Partech Africa',    stage: 'Series A+', focus: 'Fintech · Logistics'  },
  { name: 'Ventures Platform', stage: 'Seed–A',    focus: 'Consumer · Fintech'   },
  { name: 'GreenTec Capital',  stage: 'Seed',      focus: 'AgriTech · CleanTech' },
  { name: 'Chandaria Capital', stage: 'Seed',      focus: 'HealthTech · EdTech'  },
  { name: 'MEST Africa',       stage: 'Pre-seed',  focus: 'All sectors'           },
];

function SectionHeader({ title, href, label = 'More ›' }: { title: string; href?: string; label?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
      <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">{title}</h2>
      {href && (
        <Link href={href} className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">{label}</Link>
      )}
    </div>
  );
}

export default function EntrepreneurshipPage() {
  const [activeTopic, setActiveTopic] = useState('All');

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Entrepreneurship' }]} />

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

      {/* Ecosystem metrics strip */}
      <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-white/[0.06] pb-5">
        {ECOSYSTEM_STATS.map(stat => (
          <div key={stat.label} className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-gray-500 uppercase tracking-wide">{stat.label}</span>
            <span className={`text-[13px] font-bold tabular-nums ${stat.up ? 'text-white' : 'text-red-400'}`}>{stat.value}</span>
            <span className={`text-[11px] ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Hero + Top Stories */}
      <div className="flex flex-col sm:flex-row gap-8 mb-12 border-b border-white/[0.06] pb-10">
        {/* Hero */}
        <Link href={HERO.href} className="group flex-1 min-w-0 no-underline block">
          <HeroVisual category={HERO.category} className="w-full h-[220px] sm:h-[300px] mb-4" />
          <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${getCatColor(HERO.category)}`}>{HERO.category}</span>
          <h2 className="text-[22px] sm:text-[22px] font-black leading-tight text-white group-hover:text-white/80 transition-colors mb-3">{HERO.title}</h2>
          <p className="text-[14px] leading-relaxed text-gray-400 mb-3 hidden sm:block">{HERO.desc}</p>
          <div className="text-[12px] text-gray-500">{HERO.author} · {HERO.time}</div>
        </Link>

        {/* Top stories */}
        <div className="w-full sm:w-[300px] shrink-0 divide-y divide-white/[0.06]">
          {TOP_STORIES.map((s, i) => (
            <Link key={i} href={s.href} className="group flex gap-3 py-3 first:pt-0 no-underline">
              <NewsThumbnail category={s.category} className="w-[80px] h-[54px] shrink-0" />
              <div className="min-w-0 flex-1">
                <span className={`text-[10px] font-bold uppercase tracking-wide mb-0.5 block ${getCatColor(s.category)}`}>{s.category}</span>
                <h4 className="text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2">{s.title}</h4>
                <span className="text-[11px] text-gray-500 mt-0.5 block">{s.author} · {s.time}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content + right rail */}
      <div className="flex flex-col sm:flex-row gap-12">
        <div className="flex-1 min-w-0 space-y-12">

          {/* Liberia Startup Ecosystem */}
          <section>
            <SectionHeader title="Liberia Startup Ecosystem" href="/entrepreneurship" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {LIBERIA_STARTUPS.map((s, i) => (
                <Link key={i} href={s.href} className="group no-underline flex flex-col">
                  <NewsThumbnail category={s.category} className="w-full h-[160px] mb-3" />
                  <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${getCatColor(s.category)}`}>{s.category}</span>
                  <h3 className="text-[12px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1.5">{s.title}</h3>
                  <span className="text-[11px] text-gray-500">{s.time}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Founder Spotlights */}
          <section>
            <SectionHeader title="Founder Spotlights" href="/entrepreneurship" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {FOUNDER_SPOTLIGHTS.map((a, i) => (
                <Link key={i} href={a.href} className="group no-underline flex flex-col">
                  <NewsThumbnail category={a.category} className="w-full h-[180px] mb-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">{a.label}</span>
                  <h3 className="text-[16px] font-black leading-snug text-white group-hover:text-white/70 transition-colors mb-2">{a.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed mb-3 line-clamp-3">{a.desc}</p>
                  <span className="text-[11px] text-gray-500 mt-auto">{a.author} · {a.time}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Funding Tracker */}
          <section>
            <SectionHeader title="Funding Tracker" href="/entrepreneurship" label="Full database ›" />
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
              <table className="w-full min-w-[480px] text-[13px]">
                <thead className="border-b border-white/[0.07] text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="pb-3 text-left pr-4">Date</th>
                    <th className="pb-3 text-left pr-4">Company</th>
                    <th className="pb-3 text-left pr-4">Sector</th>
                    <th className="pb-3 text-right pr-4">Amount</th>
                    <th className="pb-3 text-left hidden sm:table-cell pr-4">Investors</th>
                    <th className="pb-3 text-left hidden sm:table-cell">Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {DEALS_FEED.map((deal, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 text-[11px] text-gray-500 tabular-nums pr-4">{deal.date}</td>
                      <td className="py-3 font-bold text-white pr-4">{deal.company}</td>
                      <td className={`py-3 text-[10px] font-bold uppercase tracking-wide pr-4 ${getCatColor(deal.sector)}`}>{deal.sector}</td>
                      <td className="py-3 text-right font-bold text-emerald-400 tabular-nums pr-4">{deal.amount}</td>
                      <td className="py-3 text-gray-500 text-[12px] hidden sm:table-cell pr-4">{deal.investors}</td>
                      <td className="py-3 text-gray-400 hidden sm:table-cell">{deal.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-600 mt-3">Sources: Company announcements · Crunchbase · TechCabal · Apr 2026</p>
          </section>

          {/* SME Watch */}
          <section>
            <SectionHeader title="SME Watch" href="/entrepreneurship" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {SME_STORIES.map((s, i) => (
                <Link key={i} href={s.href} className="group no-underline flex flex-col">
                  <NewsThumbnail category={s.category} className="w-full h-[160px] mb-3" />
                  <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${getCatColor(s.category)}`}>{s.category}</span>
                  <h3 className="text-[12px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1.5">{s.title}</h3>
                  <span className="text-[11px] text-gray-500">{s.time}</span>
                </Link>
              ))}
            </div>
            {/* SME data strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-b border-white/[0.07] py-6">
              {ECOSYSTEM_DATA.map((stat, i) => (
                <div key={i}>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">{stat.label}</p>
                  <p className={`text-[22px] font-black tabular-nums leading-none mb-1 ${stat.up ? 'text-white' : 'text-red-400'}`}>{stat.value}</p>
                  <p className={`text-[12px] font-semibold ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>{stat.up ? '▲' : '▼'} {stat.change}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{stat.period}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-600 mt-2">Sources: Liberia Business Registry · World Bank · iCampus · CBL · Apr 2026</p>
          </section>

          {/* Women in Business */}
          <section>
            <SectionHeader title="Women in Business" href="/entrepreneurship" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {WOMEN_STORIES.map((s, i) => (
                <Link key={i} href={s.href} className="group no-underline flex flex-col">
                  <NewsThumbnail category={s.category} className="w-full h-[160px] mb-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400 mb-2">{s.category}</span>
                  <h3 className="text-[12px] font-black leading-snug text-white group-hover:text-white/70 transition-colors mb-2">{s.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-2">{s.summary}</p>
                  <span className="text-[11px] text-gray-500 mt-auto">{s.author} · {s.time}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* West Africa */}
          <section>
            <SectionHeader title="West Africa Startup Scene" href="/entrepreneurship" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {WEST_AFRICA_STARTUPS.map((s, i) => (
                <Link key={i} href={s.href} className="group no-underline flex flex-col">
                  <NewsThumbnail category={s.category} className="w-full h-[160px] mb-3" />
                  <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${getCatColor(s.category)}`}>{s.category}</span>
                  <h3 className="text-[12px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1.5">{s.title}</h3>
                  <span className="text-[11px] text-gray-500">{s.time}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* More Stories */}
          <section>
            <SectionHeader title="More Stories" href="/news" label="All stories ›" />
            <div className="divide-y divide-white/[0.06]">
              {MORE_STORIES.map((s, i) => (
                <Link key={i} href={s.href} className="group flex gap-4 py-4 no-underline">
                  <NewsThumbnail category={s.cat} className="h-[60px] w-[88px] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${getCatColor(s.cat)} mb-0.5 block`}>{s.cat}</span>
                    <h3 className="text-[12px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-1">{s.title}</h3>
                    <span className="text-[11px] text-gray-500">{s.src} · {s.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>

        {/* Right rail */}
        <aside className="w-full sm:w-[240px] shrink-0 space-y-8">

          {/* Most Read */}
          <div>
            <h3 className="text-[12px] font-bold text-white uppercase tracking-[0.12em] border-b border-white/[0.07] pb-3 mb-4">Most Read</h3>
            <ol className="space-y-4">
              {MOST_READ.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[18px] font-black text-white/10 tabular-nums leading-none shrink-0 w-5">{i + 1}</span>
                  <Link href={item.href} className="text-[13px] font-semibold text-gray-400 hover:text-white transition-colors no-underline leading-snug">{item.title}</Link>
                </li>
              ))}
            </ol>
          </div>

          {/* SME Snapshot */}
          <div>
            <h3 className="text-[12px] font-bold text-white uppercase tracking-[0.12em] border-b border-white/[0.07] pb-3 mb-4">SME Snapshot</h3>
            <div className="space-y-3">
              {[
                { label: 'Registered SMEs',      value: '42,000', up: true  },
                { label: 'SME Credit Gap',        value: '$380M',  up: false },
                { label: 'Women-led Share',        value: '31%',    up: true  },
                { label: 'Avg. SME Loan Size',    value: '$8,400', up: true  },
                { label: 'Startup Funding (2025)',value: '$7.1M',  up: true  },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500">{row.label}</span>
                  <span className={`text-[13px] font-bold tabular-nums ${row.up ? 'text-white' : 'text-red-400'}`}>{row.value}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-600 mt-3">Sources: LBR · CBL · World Bank · Apr 2026</p>
          </div>

          {/* Active Investors */}
          <div>
            <h3 className="text-[12px] font-bold text-white uppercase tracking-[0.12em] border-b border-white/[0.07] pb-3 mb-4">Active Investors in Liberia</h3>
            <div className="space-y-4">
              {TOP_INVESTORS.map((inv, i) => (
                <div key={i}>
                  <p className="text-[13px] font-bold text-white">{inv.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{inv.stage} · {inv.focus}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div>
            <h3 className="text-[12px] font-bold text-white uppercase tracking-[0.12em] border-b border-white/[0.07] pb-3 mb-4">Events Calendar</h3>
            <div className="space-y-4">
              {EVENTS.map((ev, i) => (
                <div key={i} className="flex gap-3">
                  <div className="shrink-0 text-center w-10">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{ev.month}</p>
                    <p className="text-[18px] font-black text-white leading-none">{ev.day}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-gray-300 leading-snug">{ev.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">{ev.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="border-t border-white/[0.07] pt-6">
            <h3 className="text-[12px] font-black text-white uppercase tracking-wide mb-1">Founder Brief</h3>
            <p className="text-[12px] text-gray-500 mb-4">Liberia&apos;s startup and SME stories, every Friday.</p>
            <input type="email" placeholder="Your email" className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-[13px] text-white placeholder:text-gray-500 outline-none focus:border-white/60 transition-colors mb-3" />
            <button className="w-full rounded-lg bg-white py-2 text-[13px] font-bold text-[#0a0a0d] hover:brightness-90 transition-all">
              Sign up free
            </button>
          </div>

        </aside>
      </div>
    </main>
  );
}
