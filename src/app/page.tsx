'use client';

import { useState, useMemo } from 'react';
import { newsItems } from '@/data/news';
import { stocks } from '@/data/stocks';

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */

type SortKey = 'name' | 'price' | 'change' | 'changePercent' | 'volume' | 'marketCap';

const INDICATORS = [
  { label: 'GDP Growth',  value: '4.5%',      change: '+0.2pp', pct: 'YoY',    up: true,  group: 'economy', spark: [3.2,3.4,3.5,3.7,3.8,3.9,4.0,4.1,4.2,4.3,4.4,4.5] },
  { label: 'Inflation',   value: '10.2%',     change: '-0.8pp', pct: 'YoY',    up: true,  group: 'economy', spark: [12.5,12.2,11.8,11.5,11.2,11.0,10.8,10.6,10.5,10.4,10.3,10.2] },
  { label: 'CBL Rate',    value: '17.50%',    change: '0.00',   pct: 'Steady', up: true,  group: 'economy', spark: [17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5] },
  { label: 'LRD/USD',    value: '192.50',    change: '+1.25',  pct: '+0.65%', up: true,  group: 'fx',      spark: [186,188,187,190,189,191,190,192,191,193,192,192.5] },
  { label: 'LRD/EUR',    value: '209.85',    change: '-0.92',  pct: '-0.44%', up: false, group: 'fx',      spark: [212,211,210,211,209,210,209,210,208,209,210,209.85] },
  { label: 'LRD/GBP',    value: '243.15',    change: '+2.10',  pct: '+0.87%', up: true,  group: 'fx',      spark: [238,240,239,241,240,242,241,243,242,244,243,243.15] },
  { label: 'Iron Ore',    value: '108.50',    change: '-2.30',  pct: '-2.08%', up: false, group: 'commodity', spark: [115,114,113,112,111,110,109,109,108,108,108,108.5] },
  { label: 'Rubber',      value: '1.72',      change: '+0.04',  pct: '+2.38%', up: true,  group: 'commodity', spark: [1.60,1.62,1.63,1.65,1.66,1.67,1.68,1.69,1.70,1.71,1.72,1.72] },
  { label: 'Gold',        value: '2,285.40',  change: '+18.60', pct: '+0.82%', up: true,  group: 'commodity', spark: [2240,2255,2250,2265,2260,2270,2268,2278,2275,2282,2284,2285] },
];

const ECONOMY_PULSE = [
  { topic: 'GDP Growth',    context: 'Liberia economy',        value: '4.5%',    change: '+0.2pp', up: true,  tag: 'Economy'  },
  { topic: 'Inflation',     context: 'Consumer prices YoY',   value: '10.2%',   change: '-0.8pp', up: true,  tag: 'Economy'  },
  { topic: 'Iron Ore',      context: 'Nimba County exports',  value: '$108.50', change: '-2.08%', up: false, tag: 'Mining'   },
  { topic: 'Rubber',        context: 'Firestone output',      value: '$1.72',   change: '+2.38%', up: true,  tag: 'Agri'     },
  { topic: 'Remittances',   context: 'Diaspora inflows Q1',   value: '$680M',   change: '+7.1%',  up: true,  tag: 'Trade'    },
  { topic: 'LRD/USD',       context: 'Exchange rate',         value: '192.50',  change: '+0.65%', up: true,  tag: 'FX'       },
  { topic: 'CBL Rate',      context: 'Policy rate',           value: '17.50%',  change: 'Steady', up: true,  tag: 'Policy'   },
];

const RATES: Record<string, number> = { LRD: 1, USD: 192.50, EUR: 209.85, GBP: 243.15, NGN: 0.124, GHS: 14.82 };

const COMMODITIES = [
  { name: 'Rubber',   unit: 'USD/kg', price: '1.72',     pct: '+2.38%', up: true  },
  { name: 'Iron Ore', unit: 'USD/t',  price: '108.50',   pct: '-2.08%', up: false },
  { name: 'Gold',     unit: 'USD/oz', price: '2,285.40', pct: '+0.82%', up: true  },
  { name: 'Palm Oil', unit: 'USD/t',  price: '865.00',   pct: '-1.42%', up: false },
  { name: 'Diamonds', unit: 'USD/ct', price: '135.00',   pct: '+1.89%', up: true  },
  { name: 'Cocoa',    unit: 'USD/t',  price: '4,820.00', pct: '+1.79%', up: true  },
  { name: 'Timber',   unit: 'USD/m³', price: '245.00',   pct: '-1.29%', up: false },
];

const NEWS_IMGS = [
  'https://loremflickr.com/800/420/central,bank,economy/all?lock=10',   // hero: CBL rate
  'https://loremflickr.com/200/120/currency,exchange,money/all?lock=11', // LRD/currency
  'https://loremflickr.com/200/120/iron,ore,mining/all?lock=12',         // ArcelorMittal
  'https://loremflickr.com/200/120/road,construction,bridge/all?lock=13',// World Bank infra
  'https://loremflickr.com/200/120/bank,finance,africa/all?lock=14',     // Ecobank
  'https://loremflickr.com/200/120/mobile,payment,technology/all?lock=15',// ECOWAS digital
  'https://loremflickr.com/200/120/rubber,plantation,harvest/all?lock=16',// Firestone rubber
  'https://loremflickr.com/200/120/parliament,government,policy/all?lock=17',// IMF policy
];

const LATEST_NEWS = [
  { title: 'CBL signals readiness to intervene if LRD weakens past 195', source: 'Reuters', time: '16m ago', tags: ['Monetary Policy'], img: 'https://loremflickr.com/300/200/central,bank,monetary,policy/all?lock=20', chips: [{ label: 'CBL Rate', pct: 'Steady', up: true }, { label: 'LRD/USD', pct: '+0.65%', up: true }] },
  { title: 'Liberia Petroleum Refining Corp reports Q1 revenue rise of 12%', source: 'Daily Observer', time: '23m ago', tags: ['Energy', '+12%'], img: 'https://loremflickr.com/300/200/petroleum,oil,refinery/all?lock=21', chips: [{ label: 'Energy', pct: '+12%', up: true }] },
  { title: 'ArcelorMittal Liberia ships first expanded-capacity iron ore batch', source: 'Bloomberg', time: '46m ago', tags: ['Mining'], img: 'https://loremflickr.com/300/200/iron,ore,mining,africa/all?lock=22', chips: [{ label: 'Iron Ore', pct: '-2.08%', up: false }, { label: 'Gold', pct: '+0.82%', up: true }] },
  { title: 'World Bank approves $45M grant for Liberia infrastructure bonds', source: 'World Bank', time: '59m ago', tags: ['Development'], img: 'https://loremflickr.com/300/200/bridge,road,infrastructure/all?lock=23', chips: [] },
  { title: 'Ecobank Transnational raises dividend after strong West Africa quarter', source: 'FrontPage Africa', time: '1h ago', tags: ['Banking'], img: 'https://loremflickr.com/300/200/bank,finance,africa/all?lock=24', chips: [{ label: 'Ecobank', pct: '+3.1%', up: true }] },
  { title: 'Liberia joins ECOWAS digital payments pilot with 5 other nations', source: 'Liberian Observer', time: '1h ago', tags: ['Trade'], img: 'https://loremflickr.com/300/200/mobile,payment,digital,fintech/all?lock=25', chips: [{ label: 'LRD/USD', pct: '+0.65%', up: true }] },
  { title: 'Firestone Liberia rubber output hits decade high on favorable weather', source: 'The New Dawn', time: '3h ago', tags: ['Agriculture'], img: 'https://loremflickr.com/300/200/rubber,plantation,harvest/all?lock=26', chips: [{ label: 'Rubber', pct: '+2.38%', up: true }] },
  { title: 'IMF praises Liberia fiscal consolidation, urges revenue reform', source: 'IMF', time: '5h ago', tags: ['Policy'], img: 'https://loremflickr.com/300/200/government,finance,policy/all?lock=27', chips: [] },
];

const MORE_NEWS = [
  { category: 'Banking', title: 'Liberia\'s banking sector sees 14% deposit growth in Q1 2026', summary: 'Central Bank data shows rising household savings and business deposits, driven by mobile money adoption and renewed investor confidence.', source: 'FrontPage Africa', time: '2h ago', img: 'https://loremflickr.com/200/120/bank,savings,deposit/all?lock=30' },
  { category: 'Infrastructure', title: 'Government awards $120M contract for Monrovia ring road expansion', summary: 'The contract, funded by the African Development Bank, covers 48km of new road and is expected to cut freight costs by up to 25%.', source: 'Daily Observer', time: '3h ago', img: 'https://loremflickr.com/200/120/road,construction,highway/all?lock=31' },
  { category: 'Energy', title: 'Liberia Energy Authority approves two new solar projects totaling 40MW', summary: 'The projects, led by a consortium of West African investors, will serve Bong and Nimba counties and reduce reliance on diesel generators.', source: 'The New Dawn', time: '5h ago', img: 'https://loremflickr.com/200/120/solar,panel,energy/all?lock=32' },
  { category: 'Agriculture', title: 'Palm oil exports up 18% — smallholders benefit from new pricing policy', summary: 'A revised farmgate pricing scheme introduced by the Ministry of Agriculture has boosted incomes for over 12,000 smallholder farmers.', source: 'Liberian Observer', time: '7h ago', img: 'https://loremflickr.com/200/120/palm,oil,plantation/all?lock=33' },
  { category: 'Trade', title: 'Liberia-EU trade deal talks advance as both sides agree on tariff framework', summary: 'Negotiations in Brussels produced a draft tariff schedule covering rubber, cocoa and timber exports, potentially boosting annual trade by $180M.', source: 'Reuters', time: '9h ago', img: 'https://loremflickr.com/200/120/port,shipping,trade/all?lock=34' },
  { category: 'Mining', title: 'Gold exploration licenses issued for Grand Cape Mount region', summary: 'Three international mining firms have been granted exploration licenses covering 240 square kilometers in Grand Cape Mount County.', source: 'Bloomberg', time: '11h ago', img: 'https://loremflickr.com/200/120/gold,mining,exploration/all?lock=35' },
  { category: 'Tech', title: 'Monrovia fintech startup raises $4.2M Series A to expand mobile lending', summary: 'PayLink Liberia plans to use the funding to reach 150,000 new borrowers across rural counties through its USSD-based lending platform.', source: 'TechCabal', time: '13h ago', img: 'https://loremflickr.com/200/120/mobile,fintech,smartphone/all?lock=36' },
  { category: 'Policy', title: 'Finance Ministry tables revised budget with 12% increase in capital spending', summary: 'The supplementary budget allocates an additional $62M to infrastructure, health and education, funded partly by improved revenue collection.', source: 'Daily Observer', time: '15h ago', img: 'https://loremflickr.com/200/120/government,budget,parliament/all?lock=37' },
];

const QUICK_READS = [
  { tag: 'FOREX', headline: 'Dollar steady at 192.50 — CBL watching closely', time: '30m' },
  { tag: 'MINING', headline: 'Nimba ships 2.1M tonnes of iron ore in Q1, best quarter since 2019', time: '1h' },
  { tag: 'BANKING', headline: 'Ecobank pushes into Lofa and Grand Bassa with two new branches', time: '2h' },
  { tag: 'TRADE', headline: 'Freeport of Monrovia posts strongest quarter in five years', time: '3h' },
  { tag: 'ENERGY', headline: 'Power cuts in Paynesville ease after LEC completes grid repairs', time: '4h' },
  { tag: 'AGRI', headline: 'Cocoa farmers push for $2.80/kg floor price ahead of harvest season', time: '6h' },
];

const VIDEOS = [
  { title: "CBL Governor on rate outlook: 'We're watching food prices closely'", duration: '2:48', thumb: 'https://loremflickr.com/320/180/central,bank,governor,economics/all?lock=40', source: 'TrueRate', time: '55m ago' },
  { title: 'ArcelorMittal Nimba expansion — what it means for Liberia GDP', duration: '1:52', thumb: 'https://loremflickr.com/320/180/iron,ore,mining,excavator/all?lock=41', source: 'TrueRate', time: '3h ago' },
  { title: 'Rubber prices surge: how Liberia benefits from record output', duration: '3:14', thumb: 'https://loremflickr.com/320/180/rubber,plantation,africa/all?lock=42', source: 'TrueRate', time: '8h ago' },
  { title: 'Diaspora remittances hit $680M — a new record for Liberia', duration: '2:31', thumb: 'https://loremflickr.com/320/180/money,transfer,remittance/all?lock=43', source: 'TrueRate', time: '3h ago' },
];

const KEY_SECTORS = [
  { sector: 'Mining & Minerals',  contrib: '12.8%', growth: '+6.2%', up: true,  desc: 'Iron ore, gold, diamonds' },
  { sector: 'Agriculture',        contrib: '34.2%', growth: '+3.8%', up: true,  desc: 'Rubber, palm oil, cocoa, timber' },
  { sector: 'Services',           contrib: '42.5%', growth: '+5.1%', up: true,  desc: 'Telecoms, banking, trade' },
  { sector: 'Manufacturing',      contrib: '6.3%',  growth: '+2.4%', up: true,  desc: 'Beverages, cement, food processing' },
  { sector: 'Construction',       contrib: '4.2%',  growth: '+8.5%', up: true,  desc: 'Infrastructure, housing, roads' },
];

function timeAgo(d: string) {
  const days = Math.floor((new Date('2026-04-01').getTime() - new Date(d).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   MICRO COMPONENTS
───────────────────────────────────────────────────────────────────────────── */

function Spark({ data, up, w = 64, h = 28 }: { data: number[]; up: boolean; w?: number; h?: number }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="block shrink-0">
      <polyline points={pts} fill="none" stroke={up ? '#4ade80' : '#f87171'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Pill({ text, up }: { text: string; up: boolean }) {
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${up ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-400/15 text-red-400'}`}>
      {up ? '▲' : '▼'} {text}
    </span>
  );
}

const TAG_COLORS: Record<string, string> = {
  economy:    'bg-blue-500/15 text-blue-300',
  policy:     'bg-white/20 text-white/70',
  forex:      'bg-cyan-500/15 text-cyan-300',
  commodities:'bg-amber-500/15 text-amber-300',
  trade:      'bg-teal-500/15 text-teal-300',
  banking:    'bg-indigo-500/15 text-indigo-300',
  mining:     'bg-orange-500/15 text-orange-300',
  agriculture:'bg-green-500/15 text-green-300',
};

function TagPill({ label }: { label: string }) {
  if (label.startsWith('+')) return <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 tabular-nums">{label}</span>;
  if (label.startsWith('-')) return <span className="rounded-full bg-red-400/15 px-2 py-0.5 text-[11px] font-semibold text-red-400 tabular-nums">{label}</span>;
  const color = TAG_COLORS[label.toLowerCase()] ?? 'bg-white/20 text-white/70';
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${color}`}>{label}</span>;
}

function SmallTag({ label }: { label: string }) {
  const colorMap: Record<string, string> = {
    'Economy': 'bg-blue-500/15 text-blue-300',
    'Policy':  'bg-white/20 text-white/70',
    'FX':      'bg-cyan-500/15 text-cyan-300',
    'Mining':  'bg-orange-500/15 text-orange-300',
    'Agri':    'bg-green-500/15 text-green-300',
    'Trade':   'bg-teal-500/15 text-teal-300',
  };
  const color = colorMap[label] ?? 'bg-white/10 text-gray-400';
  return <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${color}`}>{label}</span>;
}

function SectionHeading({ title, action, actionLabel = 'View all' }: { title: string; action?: string; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[17px] font-bold text-white tracking-tight">{title}</h2>
      {action && <a href={action} className="text-[12px] font-medium text-white hover:text-white/70 hover:underline transition-colors">{actionLabel} ›</a>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HEADER
───────────────────────────────────────────────────────────────────────────── */

const FOOTER_SECTIONS: Record<string, string[]> = {
  'Business':  ['Top Stories', 'Companies', 'Startups', 'Banking & Finance'],
  'Economy':   ['GDP & Growth', 'Inflation', 'Trade & Exports', 'Development'],
  'Explore':   ['Currency Converter', 'Economic Data', 'Commodities', 'Sector Analysis'],
  'About':     ['About TrueRate', 'Sitemap', 'Help', 'Feedback', 'Licensing'],
};

function Header() {
  const NAV = ['Business', 'Economy', 'Policy', 'Trade', 'Markets', 'Commodities', 'News', 'Videos'];
  const [active, setActive] = useState('Business');
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-[#131316] border-b border-white/[0.06]">
      {/* Top bar */}
      <div className="mx-auto flex max-w-[1320px] items-center px-4 py-3 relative gap-3">
        {/* Hamburger — mobile only */}
        <button
          className="sm:hidden flex shrink-0 flex-col justify-center gap-[5px] p-1 z-10"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Open menu"
        >
          <span className={`block h-[2px] w-5 bg-white transition-transform origin-center ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-[2px] w-5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-[2px] w-5 bg-white transition-transform origin-center ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>

        {/* Logo — absolutely centered on mobile, static on desktop */}
        <a href="/" className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 flex shrink-0 items-center gap-2 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="TrueRate" className="shrink-0 brightness-0 invert" style={{height: '52px', width: 'auto'}} />
          <span className="hidden sm:inline ml-1.5 rounded border border-white/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white/70">Liberia</span>
        </a>

        {/* Desktop search bar */}
        <div className="hidden sm:flex flex-1 max-w-[360px] ml-2 items-center gap-2.5 rounded-xl bg-white/[0.06] px-4 py-2 border border-white/[0.06] transition focus-within:bg-white/[0.08] focus-within:border-white/30">
          <svg className="h-4 w-4 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search news, sectors, topics"
            className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-gray-600" />
        </div>

        {/* Super nav links — desktop only, after search */}
        <div className="hidden sm:flex items-center gap-0.5">
          {['Entertainment', 'Finance', 'Sports'].map(item => (
            <a key={item} href="#" className={`px-3 py-1.5 rounded text-[13px] font-medium no-underline transition-colors whitespace-nowrap ${
              item === 'Finance' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
            }`}>
              {item}
            </a>
          ))}
          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(o => !o)}
              className="flex items-center gap-1 px-3 py-1.5 rounded text-[13px] font-medium text-gray-400 hover:text-white transition-colors whitespace-nowrap"
            >
              More
              <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {moreOpen && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                {/* Dropdown */}
                <div className="absolute left-0 top-full mt-2 z-50 w-[520px] rounded-2xl border border-white/[0.08] bg-[#131316] shadow-2xl shadow-black/50 px-6 py-6">
                  <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                    {Object.entries(FOOTER_SECTIONS).map(([section, links]) => (
                      <div key={section}>
                        <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">{section}</h4>
                        <ul className="space-y-2">
                          {links.map(link => (
                            <li key={link}>
                              <a href="#" onClick={() => setMoreOpen(false)}
                                className="text-[13px] text-gray-600 hover:text-white transition-colors no-underline">
                                {link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: bell + Mail + Sign in + Subscribe */}
        <div className="ml-auto flex items-center gap-2 z-10">
          {/* Bell — desktop only */}
          <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          {/* Sign in */}
          <button className="rounded-lg border border-white/20 px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-white/[0.06]">
            Sign in
          </button>
          {/* Subscribe — desktop only */}
          <button className="hidden sm:block rounded-lg bg-white px-5 py-2 text-[13px] font-semibold text-[#0a0a0d] shadow-lg shadow-white/10 transition hover:shadow-white/15 hover:brightness-110">
            Subscribe
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="sm:hidden px-4 pb-3">
        <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.07] px-4 py-2.5 border border-white/[0.06]">
          <svg className="h-4 w-4 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search for news or tickers"
            className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-gray-600" />
        </div>
      </div>
      {/* Nav tabs — hidden on mobile, visible sm+ */}
      <div className="hidden sm:block border-t border-white/[0.04] bg-[#0f0f12]">
        <div className="mx-auto flex max-w-[1320px] overflow-x-auto px-5">
          {NAV.map(tab => (
            <button key={tab} onClick={() => setActive(tab)}
              className={`whitespace-nowrap px-4 py-3 text-[13px] font-medium transition-colors ${
                active === tab
                  ? 'border-b-2 border-white text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
      {/* Mobile drawer — full screen overlay */}
      {menuOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          {/* Panel */}
          <div className="relative flex flex-col w-[300px] max-w-[85vw] bg-[#131316] h-full shadow-2xl overflow-y-auto">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="TrueRate" className="brightness-0 invert" style={{height: '40px', width: 'auto'}} />
              <button onClick={() => setMenuOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-gray-400 hover:text-white transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Nav items */}
            <nav className="flex-1 px-3 py-4">
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">Sections</p>
              {NAV.map(tab => (
                <button key={tab} onClick={() => { setActive(tab); setMenuOpen(false); }}
                  className={`flex w-full items-center justify-between px-3 py-3 rounded-lg text-[15px] font-medium transition-colors mb-0.5 ${
                    active === tab
                      ? 'bg-white/[0.08] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}>
                  <span>{tab}</span>
                  {active === tab && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </button>
              ))}
            </nav>
            {/* Footer CTAs */}
            <div className="border-t border-white/[0.06] px-5 py-5 space-y-3">
              <button className="w-full rounded-xl bg-white py-3 text-[14px] font-bold text-[#0a0a0d]">
                Subscribe
              </button>
              <button className="w-full rounded-xl border border-white/15 py-3 text-[14px] font-medium text-white/70 hover:text-white transition-colors">
                Sign in
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ECONOMIC INDICATORS STRIP
───────────────────────────────────────────────────────────────────────────── */

const INDICATOR_GROUPS: { key: string; label: string; accent: string; bg: string }[] = [
  { key: 'economy',   label: 'Economy',     accent: 'text-blue-400',   bg: 'bg-blue-500/[0.04]'   },
  { key: 'fx',        label: 'Foreign Exchange', accent: 'text-cyan-400',    bg: 'bg-cyan-500/[0.04]'   },
  { key: 'commodity', label: 'Commodities', accent: 'text-amber-400',  bg: 'bg-amber-500/[0.04]'  },
];

function IndicatorsStrip() {
  return (
    <div className="bg-[#0a0a0d] border-b border-white/[0.05]">
      <div className="mx-auto max-w-[1320px]">

        {/* Mobile: auto-scrolling marquee ticker */}
        <div className="sm:hidden overflow-hidden">
          <div className="ticker-scroll flex">
            {[...INDICATORS, ...INDICATORS].map((item, i) => (
              <div key={i} className="shrink-0 flex flex-col px-4 py-2.5 border-r border-white/[0.07]">
                <span className="text-[12px] font-semibold text-white whitespace-nowrap">{item.label}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="tabular-nums text-[12px] text-gray-400 whitespace-nowrap">{item.value}</span>
                  <span className={`tabular-nums text-[11px] font-bold whitespace-nowrap ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {item.pct}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: pill chips */}
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {INDICATORS.map(item => (
            <a key={item.label} href="#"
              className="shrink-0 flex items-center gap-2.5 rounded-full bg-white/[0.07] px-4 py-2 no-underline transition hover:bg-white/[0.11] cursor-pointer">
              <span className="text-[13px] font-bold text-white whitespace-nowrap">{item.label}</span>
              <span className="tabular-nums text-[13px] font-bold text-white whitespace-nowrap">{item.value}</span>
              <span className={`flex items-center gap-0.5 tabular-nums text-[12px] font-semibold whitespace-nowrap ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.up ? '▲' : '▼'}{item.pct}
              </span>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FEATURED ARTICLE
───────────────────────────────────────────────────────────────────────────── */

function FeaturedColumn() {
  const featured = newsItems[0];
  const sub1 = newsItems[1];
  const sub2 = newsItems[2];

  return (
    <div className="flex flex-col gap-5">
      {/* Hero article */}
      <article className="group cursor-pointer">
        <div className="overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={NEWS_IMGS[0]} alt={featured.title} className="w-full h-[220px] lg:h-[300px] object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-white">Economy</span>
            <span className="text-gray-700">·</span>
            <span className="text-[11px] text-gray-500">{featured.source}</span>
            <span className="text-gray-700">·</span>
            <span className="text-[11px] text-gray-500">{timeAgo(featured.date)}</span>
          </div>
          <h2 className="text-[22px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors">
            <a href="#" className="no-underline">{featured.title}</a>
          </h2>
          <p className="mt-2.5 line-clamp-2 text-[14px] leading-relaxed text-gray-500">{featured.summary}</p>
        </div>
      </article>

      {/* Two sub-articles */}
      <div className="border-t border-white/[0.06] pt-5 flex flex-col sm:grid sm:grid-cols-2 gap-4">
        {[sub1, sub2].map((item, i) => (
          <article key={item.id} className="group cursor-pointer flex gap-3.5 sm:block">
            <div className="flex-1 min-w-0 order-1 sm:order-none">
              <h3 className="sm:mt-2.5 line-clamp-3 text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors">
                <a href="#" className="no-underline">{item.title}</a>
              </h3>
              <div className="mt-1.5 text-[11px] text-gray-600">{item.source} · {timeAgo(item.date)}</div>
            </div>
            <div className="shrink-0 overflow-hidden rounded-lg order-2 sm:order-none sm:mb-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={NEWS_IMGS[i + 1]} alt="" className="h-[76px] w-[100px] sm:w-full sm:h-[100px] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          </article>
        ))}
      </div>

      {/* More sub-articles */}
      <div className="border-t border-white/[0.06] pt-5 flex flex-col sm:grid sm:grid-cols-2 gap-4">
        {[newsItems[3], newsItems[4]].map((item, i) => (
          <article key={item.id} className="group cursor-pointer flex gap-3.5 sm:block">
            <div className="flex-1 min-w-0 order-1 sm:order-none">
              <h3 className="sm:mt-2.5 line-clamp-3 text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors">
                <a href="#" className="no-underline">{item.title}</a>
              </h3>
              <div className="mt-1.5 text-[11px] text-gray-600">{item.source} · {timeAgo(item.date)}</div>
            </div>
            <div className="shrink-0 overflow-hidden rounded-lg order-2 sm:order-none sm:mb-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={NEWS_IMGS[i + 3]} alt="" className="h-[76px] w-[100px] sm:w-full sm:h-[100px] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NEWS LIST COLUMN
───────────────────────────────────────────────────────────────────────────── */

function NewsListColumn() {
  const items = newsItems.slice(3, 7);
  return (
    <div className="flex flex-col divide-y divide-white/[0.05]">
      {items.map((item, i) => (
        <article key={item.id} className="group flex gap-3.5 py-4 first:pt-0 cursor-pointer">
          <div className="overflow-hidden rounded-xl shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={NEWS_IMGS[(i + 3) % NEWS_IMGS.length]} alt=""
              className="h-[90px] w-[130px] object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="min-w-0 flex-1">
            {item.category && <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-white/40">{item.category}</p>}
            <h3 className="line-clamp-3 text-[14px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors">
              <a href="#" className="no-underline">{item.title}</a>
            </h3>
            <p className="mt-1 text-[12px] text-gray-500">{item.source} · {timeAgo(item.date)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LATEST COLUMN
───────────────────────────────────────────────────────────────────────────── */

function LatestColumn() {
  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-[14px] font-bold text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
        Latest
      </h2>

      {/* Large-card style — all viewports */}
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {LATEST_NEWS.map((item, i) => (
          <a key={i} href="#" className="flex gap-3.5 py-4 first:pt-0 no-underline group">
            {/* Thumbnail */}
            <div className="shrink-0 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.img} alt="" className="h-[90px] w-[130px] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-bold leading-snug text-white line-clamp-3 group-hover:text-white/80 transition-colors">{item.title}</h3>
              <p className="mt-1 text-[12px] text-gray-500">{item.source} · {item.time}</p>
              {item.chips.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.chips.map(chip => (
                    <span key={chip.label} className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold">
                      <span className="text-white/90">{chip.label}</span>
                      <span className={chip.up ? 'text-emerald-400' : 'text-red-400'}>{chip.pct}</span>
                      <svg className="h-3 w-3 shrink-0 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR: TRENDING
───────────────────────────────────────────────────────────────────────────── */

const BRIEFING = [
  {
    label: 'MONETARY POLICY',
    headline: 'CBL holds rate at 17.50% for third consecutive quarter',
    summary: 'The Central Bank of Liberia cited easing food prices but flagged currency risks ahead of Q2 budget disbursements.',
    time: '2h ago',
  },
  {
    label: 'TRADE',
    headline: 'Liberia joins ECOWAS digital payments pilot',
    summary: 'Five other West African nations are participating. The pilot aims to cut cross-border transaction costs by up to 30%.',
    time: '4h ago',
  },
  {
    label: 'COMMODITIES',
    headline: 'Rubber output at decade high — what it means for GDP',
    summary: 'Firestone Liberia reports record production driven by favorable weather. Agriculture\'s GDP share may rise to 35%.',
    time: '8h ago',
  },
];

function EconomyPulseWidget() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-bold text-white">Today's Briefing</h2>
          <p className="text-[11px] text-gray-600 mt-0.5">Key stories · Apr 3, 2026</p>
        </div>
        <a href="#" className="text-[12px] text-white/50 hover:text-white transition-colors">All ›</a>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {BRIEFING.map((b, i) => (
          <a key={i} href="#" className="block px-5 py-4 hover:bg-white/[0.02] transition-colors no-underline group">
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-600 mb-1.5">{b.label}</div>
            <div className="text-[13px] font-semibold text-white leading-snug group-hover:text-white/80 mb-1.5">{b.headline}</div>
            <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-2">{b.summary}</p>
            <div className="mt-2 text-[11px] text-gray-700">{b.time}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   KEY SECTORS
───────────────────────────────────────────────────────────────────────────── */

function KeySectorsWidget() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-bold text-white">GDP by Sector</h2>
          <p className="text-[11px] text-gray-600 mt-0.5">Liberia · 2026 estimate</p>
        </div>
        <a href="#" className="text-[12px] font-medium text-white/50 hover:text-white transition-colors">Details ›</a>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {KEY_SECTORS.map(s => (
          <div key={s.sector} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-white">{s.sector}</div>
              <div className="text-[11px] text-gray-600 mt-0.5">{s.desc}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[13px] font-bold text-white tabular-nums">{s.contrib} <span className="text-[11px] font-normal text-gray-600">GDP</span></div>
              <div className={`text-[12px] font-semibold tabular-nums ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>{s.growth}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAJOR ENTERPRISES TABLE
───────────────────────────────────────────────────────────────────────────── */

function BusinessOverview() {
  const [sortKey, setSortKey] = useState<SortKey>('changePercent');
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    const copy = [...stocks];
    copy.sort((a, b) => {
      let av: string | number = a[sortKey];
      let bv: string | number = b[sortKey];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      return sortAsc ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
    });
    return copy;
  }, [sortKey, sortAsc]);

  const SH = ({ k, label, right = true }: { k: SortKey; label: string; right?: boolean }) => (
    <th onClick={() => { if (sortKey === k) { setSortAsc(!sortAsc); } else { setSortKey(k); setSortAsc(false); } }}
      className={`cursor-pointer select-none px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-600 hover:text-gray-400 transition-colors ${right ? 'text-right' : 'text-left'}`}>
      {label}{sortKey === k ? <span className="ml-1 text-gray-700">{sortAsc ? '↑' : '↓'}</span> : null}
    </th>
  );

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-bold text-white">Market Data</h2>
          <p className="text-[11px] text-gray-600 mt-0.5">Liberia · West Africa · Sources: CBL, GSE, BRVM</p>
        </div>
        <a href="#" className="text-[12px] font-medium text-white/50 hover:text-white transition-colors">Full table ›</a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead className="border-b border-white/[0.04]">
            <tr>
              <SH k="name" label="Company" right={false} />
              <SH k="price" label="Price (LRD)" />
              <SH k="changePercent" label="Change" />
              <SH k="marketCap" label="Mkt Cap" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {sorted.map(s => (
              <tr key={s.ticker} className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <a href="#" className="text-[12px] font-bold text-white no-underline">{s.ticker}</a>
                  <div className="text-[11px] text-gray-600 truncate max-w-[160px]">{s.name}</div>
                </td>
                <td className="tabular-nums px-4 py-3 text-right font-semibold text-white">
                  {s.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className={`tabular-nums px-4 py-3 text-right font-semibold ${s.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                </td>
                <td className="tabular-nums px-4 py-3 text-right text-gray-500">{s.marketCap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CURRENCY CONVERTER
───────────────────────────────────────────────────────────────────────────── */

const FX_RATES = [
  { pair: 'USD / LRD', rate: '192.50', change: '+1.25', up: true,  note: 'Dollar strengthening on diaspora inflows' },
  { pair: 'EUR / LRD', rate: '209.85', change: '-0.92', up: false, note: 'Euro softens on ECB rate signals' },
  { pair: 'GBP / LRD', rate: '243.15', change: '+2.10', up: true,  note: 'Sterling up on UK trade data' },
  { pair: 'NGN / LRD', rate: '0.124',  change: '+0.002', up: true, note: 'Naira holds steady this week' },
];

function ForexWidget() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-bold text-white">Exchange Rates</h2>
          <p className="text-[11px] text-gray-600 mt-0.5">Liberian Dollar (LRD) · CBL · Apr 3, 2026</p>
        </div>
        <a href="#" className="text-[12px] text-white/50 hover:text-white transition-colors">Converter ›</a>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {FX_RATES.map(r => (
          <a key={r.pair} href="#" className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-white tabular-nums">{r.pair}</div>
              <div className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">{r.note}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[14px] font-bold text-white tabular-nums">{r.rate}</div>
              <div className={`text-[12px] font-semibold tabular-nums ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>{r.up ? '+' : ''}{r.change}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMMODITIES
───────────────────────────────────────────────────────────────────────────── */

const COMMODITIES_WITH_CONTEXT = [
  { name: 'Rubber',   unit: 'USD/kg', price: '1.72',     pct: '+2.38%', up: true,  note: 'Decade high on Firestone output surge' },
  { name: 'Iron Ore', unit: 'USD/t',  price: '108.50',   pct: '-2.08%', up: false, note: 'Weak China demand weighs on prices' },
  { name: 'Gold',     unit: 'USD/oz', price: '2,285.40', pct: '+0.82%', up: true,  note: 'Safe-haven demand on global uncertainty' },
  { name: 'Palm Oil', unit: 'USD/t',  price: '865.00',   pct: '-1.42%', up: false, note: 'Supply recovery from SE Asia' },
  { name: 'Cocoa',    unit: 'USD/t',  price: '4,820.00', pct: '+1.79%', up: true,  note: 'West Africa crop concerns persist' },
];

function CommoditiesWidget() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-bold text-white">Commodities</h2>
          <p className="text-[11px] text-gray-600 mt-0.5">Liberia-relevant · Apr 3, 2026</p>
        </div>
        <a href="#" className="text-[12px] text-white/50 hover:text-white transition-colors">All ›</a>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {COMMODITIES_WITH_CONTEXT.map(c => (
          <a key={c.name} href="#" className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-white">{c.name} <span className="text-[11px] font-normal text-gray-600">{c.unit}</span></div>
              <div className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">{c.note}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[13px] font-bold text-white tabular-nums">${c.price}</div>
              <div className={`text-[12px] font-semibold tabular-nums ${c.up ? 'text-emerald-400' : 'text-red-400'}`}>{c.pct}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ECONOMIC INDICATORS
───────────────────────────────────────────────────────────────────────────── */

function EconomicWidget() {
  const rows = [
    { label: 'GDP',           value: '$4.33B',  pct: '+4.34%', up: true,  note: 'Fastest growth in 5 years' },
    { label: 'Inflation',     value: '10.2%',   pct: '-0.8pp', up: true,  note: 'Declining — CBL target is 8%' },
    { label: 'CBL Rate',      value: '17.50%',  pct: 'Steady', up: true,  note: 'Held for 3rd consecutive quarter' },
    { label: 'Unemployment',  value: '3.6%',    pct: '-0.2pp', up: true,  note: 'Mining & construction hiring up' },
    { label: 'Trade Balance', value: '-$0.82B', pct: 'Improving', up: true, note: 'Export growth outpacing imports' },
    { label: 'Debt / GDP',    value: '55.4%',   pct: '+2.2pp', up: false, note: 'IMF urges fiscal discipline' },
  ];
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-bold text-white">Liberia at a Glance</h2>
          <p className="text-[11px] text-gray-600 mt-0.5">Key indicators · Sources: CBL, World Bank, IMF</p>
        </div>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {rows.map(r => (
          <a key={r.label} href="#" className="flex items-start gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-white">{r.label}</div>
              <div className="text-[11px] text-gray-600 mt-0.5">{r.note}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="tabular-nums text-[13px] font-bold text-white">{r.value}</div>
              <div className={`tabular-nums text-[12px] font-semibold ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>{r.pct}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   VIDEOS
───────────────────────────────────────────────────────────────────────────── */

function VideosSection() {
  const [active, setActive] = useState(0);
  const v = VIDEOS[active];
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[17px] font-bold text-white tracking-tight">Today's Videos</h2>
        <button className="rounded-full border border-white/20 px-4 py-1.5 text-[12px] font-medium text-white/70 hover:border-white/40 hover:text-white transition-colors">Explore More</button>
      </div>
      {/* Card */}
      <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-[#141418]">
        {/* Thumbnail */}
        <div className="relative cursor-pointer group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={v.thumb} alt="" className="w-full h-[220px] object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/40 to-transparent">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg">
                <svg className="h-4 w-4 translate-x-0.5 text-[#0a0a0d]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="tabular-nums text-[15px] font-bold text-white drop-shadow">{v.duration}</span>
            </div>
          </div>
        </div>
        {/* Title */}
        <div className="px-5 py-4">
          <h3 className="text-[15px] font-bold leading-snug text-white">{v.title}</h3>
        </div>
        {/* Dots + arrows */}
        <div className="flex items-center justify-between px-5 pb-4">
          <div className="flex items-center gap-2">
            {VIDEOS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`h-2 w-2 rounded-full transition-colors ${i === active ? 'bg-white' : 'bg-white/25'}`} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActive(i => (i - 1 + VIDEOS.length) % VIDEOS.length)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 hover:border-white/40 hover:text-white transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => setActive(i => (i + 1) % VIDEOS.length)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 hover:border-white/40 hover:text-white transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────────────────────── */

function Footer() {
  const trending = ['Liberia GDP', 'Iron Ore', 'Rubber', 'CBL Rate', 'LRD/USD', 'Inflation', 'Remittances', 'ECOWAS Trade', 'Mining Policy', 'Agriculture'];
  const sections: Record<string, string[]> = {
    'Business': ['Top Stories', 'Companies', 'Startups', 'Banking & Finance'],
    'Economy': ['GDP & Growth', 'Inflation', 'Trade & Exports', 'Development'],
    'Explore': ['Currency Converter', 'Economic Data', 'Commodities', 'Sector Analysis'],
    'About': ['About TrueRate', 'Sitemap', 'Help', 'Feedback', 'Licensing'],
  };
  return (
    <footer className="mt-10 border-t border-white/[0.06] bg-[#0a0a0d]">
      {/* Newsletter */}
      <div className="border-b border-white/[0.05] bg-gradient-to-r from-[#001428]/30 via-[#141418] to-[#001428]/30 px-5 py-10">
        <div className="mx-auto max-w-[1320px] flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-white">TrueRate Daily Brief</h3>
            <p className="mt-1 text-[14px] text-gray-500">Business and economy news from Liberia, delivered daily</p>
          </div>
          <div className="flex w-full max-w-[420px] gap-2.5">
            <input type="email" placeholder="Email address"
              className="flex-1 rounded-lg bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-[13px] text-white placeholder:text-gray-600 outline-none focus:border-white/40 transition-colors" />
            <button className="shrink-0 rounded-lg bg-white px-6 py-3 text-[13px] font-semibold text-[#0a0a0d] shadow-lg shadow-white/10 hover:shadow-white/15 hover:brightness-110 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-5 py-10">
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-4 mb-10">
          {Object.entries(sections).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">{title}</h4>
              <ul className="space-y-2">
                {links.map(l => (
                  <li key={l}><a href="#" className="text-[13px] text-gray-600 hover:text-white no-underline transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-8 border-t border-white/[0.05] pt-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-600">Trending topics</p>
          <div className="flex flex-wrap gap-2">
            {trending.map(t => (
              <a key={t} href="#" className="rounded-lg border border-white/[0.06] px-3.5 py-1.5 text-[12px] text-gray-500 hover:border-white/30 hover:text-white hover:bg-white/5 transition-all no-underline">{t}</a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-6">
          <div className="flex flex-wrap gap-x-5 gap-y-1 mb-3">
            {['Data Disclaimer', 'Help', 'Feedback', 'Sitemap', 'Terms and Privacy Policy', 'Privacy Dashboard'].map(l => (
              <a key={l} href="#" className="text-[11px] text-gray-700 hover:text-white no-underline transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-[11px] text-gray-800">Copyright © 2026 TrueRate. All rights reserved. · Not investment advice</p>
          <p className="mt-1 text-[10px] text-gray-800">Data: Central Bank of Liberia · World Bank · IMF · Ghana Stock Exchange · BRVM</p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DEEP READS (center column filler)
───────────────────────────────────────────────────────────────────────────── */

const DEEP_READS = [
  {
    category: 'Analysis',
    title: 'Why Liberia\'s 4.5% GDP growth rate may be hiding structural weakness',
    summary: 'Strong headline numbers mask an economy still heavily dependent on two export commodities. Economists warn that without services sector diversification, growth remains fragile.',
    source: 'TrueRate Analysis',
    time: '1h ago',
    img: 'https://loremflickr.com/400/220/economy,gdp,growth,africa/all?lock=50',
    large: true,
  },
  {
    category: 'Policy',
    title: 'CBL\'s rate hold: prudent caution or missed opportunity?',
    summary: 'With inflation easing to 10.2%, some economists argue the Central Bank has room to cut. Others say the LRD remains too vulnerable.',
    source: 'Daily Observer',
    time: '3h ago',
    img: 'https://loremflickr.com/200/120/central,bank,interest,rate/all?lock=51',
    large: false,
  },
  {
    category: 'Trade',
    title: 'ECOWAS payments integration could unlock $2B in cross-border commerce',
    summary: 'A new digital payments corridor linking six West African nations stands to benefit Liberian exporters the most, according to a World Bank assessment.',
    source: 'World Bank',
    time: '6h ago',
    img: 'https://loremflickr.com/200/120/digital,payment,west,africa/all?lock=52',
    large: false,
  },
  {
    category: 'Mining',
    title: 'ArcelorMittal\'s Nimba expansion: Liberia\'s biggest industrial moment in a decade',
    summary: 'The expanded iron ore operation could add $320M annually to export revenues and create 1,800 permanent jobs in the region.',
    source: 'Bloomberg',
    time: '8h ago',
    img: 'https://loremflickr.com/200/120/iron,ore,steel,industry/all?lock=53',
    large: false,
  },
  {
    category: 'Banking',
    title: 'Mobile money is reshaping how Liberians save, borrow, and invest',
    summary: 'With smartphone penetration rising above 60%, mobile-first financial services are pulling millions of unbanked Liberians into the formal economy.',
    source: 'FrontPage Africa',
    time: '10h ago',
    img: 'https://loremflickr.com/200/120/mobile,banking,smartphone,africa/all?lock=54',
    large: false,
  },
  {
    category: 'Agriculture',
    title: 'Can Liberia become West Africa\'s next rubber powerhouse?',
    summary: 'Record Firestone output and favorable global prices are creating an opening. But analysts say infrastructure bottlenecks could cap the opportunity.',
    source: 'TrueRate Analysis',
    time: '12h ago',
    img: 'https://loremflickr.com/200/120/rubber,tree,plantation,harvest/all?lock=55',
    large: false,
  },
  {
    category: 'Development',
    title: 'IMF program review: what the next tranche means for Liberia\'s fiscal path',
    summary: 'The Fund praised revenue reforms but flagged risks around public wage bills and off-budget spending ahead of the $38M disbursement.',
    source: 'IMF',
    time: '1d ago',
    img: 'https://loremflickr.com/200/120/imf,fiscal,development,economy/all?lock=56',
    large: false,
  },
];

const MOST_READ = [
  { rank: 1, title: 'CBL holds rate at 17.5% for third consecutive quarter', source: 'Reuters', time: '2h ago' },
  { rank: 2, title: 'ArcelorMittal ships first expanded-capacity iron ore batch from Nimba', source: 'Bloomberg', time: '46m ago' },
  { rank: 3, title: 'Rubber output hits decade high — what it means for Liberia GDP', source: 'TrueRate', time: '8h ago' },
  { rank: 4, title: 'World Bank approves $45M grant for Liberia infrastructure bonds', source: 'World Bank', time: '59m ago' },
  { rank: 5, title: 'Liberia joins ECOWAS digital payments pilot with 5 other nations', source: 'Liberian Observer', time: '1h ago' },
];

const UPCOMING_EVENTS = [
  { date: 'Apr 7', label: 'CBL Monetary Policy Meeting', type: 'Policy' },
  { date: 'Apr 10', label: 'Q1 GDP Advance Estimate — Ministry of Finance', type: 'Economy' },
  { date: 'Apr 14', label: 'Liberia Investment Forum — Monrovia', type: 'Trade' },
  { date: 'Apr 18', label: 'World Bank Liberia Country Dialogue', type: 'Development' },
  { date: 'Apr 25', label: 'ECOWAS Finance Ministers Summit', type: 'Trade' },
];

function DeepReadsColumn() {
  const [lead, ...rest] = DEEP_READS;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-white">In Depth</h2>
        <a href="#" className="text-[12px] text-white/50 hover:text-white transition-colors">More ›</a>
      </div>
      {/* Lead story */}
      <a href="#" className="group block no-underline mb-5">
        <div className="overflow-hidden rounded-xl mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lead.img} alt="" className="w-full h-[180px] object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="text-[11px] font-bold uppercase tracking-wide text-white/40 mb-1.5">{lead.category}</div>
        <h3 className="text-[15px] font-bold leading-snug text-white group-hover:text-white/80 transition-colors mb-2">{lead.title}</h3>
        <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-3">{lead.summary}</p>
        <div className="mt-2 text-[11px] text-gray-700">{lead.source} · {lead.time}</div>
      </a>
      {/* Remaining stories */}
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {rest.map((item, i) => (
          <a key={i} href="#" className="group flex gap-3.5 py-4 first:pt-0 no-underline">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wide text-white/40 mb-1">{item.category}</div>
              <h3 className="text-[13px] font-bold leading-snug text-white group-hover:text-white/80 transition-colors mb-1.5">{item.title}</h3>
              <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-2">{item.summary}</p>
              <div className="mt-1.5 text-[11px] text-gray-700">{item.source} · {item.time}</div>
            </div>
            <div className="shrink-0 overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.img} alt="" className="h-[72px] w-[108px] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MORE NEWS (left column filler)
───────────────────────────────────────────────────────────────────────────── */

function MoreNewsColumn() {
  return (
    <div className="flex flex-col divide-y divide-white/[0.05]">
      {MORE_NEWS.map((item, i) => (
        <a key={i} href="#" className="group flex gap-4 py-4 first:pt-0 no-underline">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold uppercase tracking-wide text-white/40 mb-1">{item.category}</div>
            <h3 className="text-[14px] font-bold leading-snug text-white group-hover:text-white/80 transition-colors mb-1.5">{item.title}</h3>
            <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-2">{item.summary}</p>
            <div className="mt-2 text-[11px] text-gray-700">{item.source} · {item.time}</div>
          </div>
          <div className="shrink-0 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.img} alt="" className="h-[72px] w-[108px] object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        </a>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR: LATEST + IN FOCUS
───────────────────────────────────────────────────────────────────────────── */

const SIDEBAR_LATEST = [
  { time: '2h',  headline: 'CBL signals readiness to intervene if LRD weakens past 195' },
  { time: '4h',  headline: 'ArcelorMittal ships first expanded-capacity iron ore batch from Nimba' },
  { time: '6h',  headline: 'World Bank approves $45M grant for Liberia road infrastructure' },
  { time: '8h',  headline: 'Firestone rubber output hits decade high on favorable weather conditions' },
  { time: '10h', headline: 'Ecobank raises dividend after strong West Africa quarter earnings' },
  { time: '12h', headline: 'Liberia joins ECOWAS digital payments pilot with five other nations' },
  { time: '14h', headline: 'IMF praises Liberia fiscal consolidation, urges revenue reform plan' },
  { time: '21h', headline: 'Palm oil prices dip on Southeast Asia supply chain recovery' },
];

const IN_FOCUS_TOPICS = [
  'Iron Ore', 'LRD/USD', 'Rubber Prices', 'CBL Rate',
  'ECOWAS Trade', 'Liberia GDP', 'Mining Policy', 'Remittances',
];

function LatestSidebar() {
  return (
    <div className="flex flex-col gap-6">
      {/* Latest news list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-white">Latest</h2>
          <a href="#" className="text-[12px] text-white/50 hover:text-white transition-colors">See all latest ›</a>
        </div>
        <div className="flex flex-col divide-y divide-white/[0.05]">
          {SIDEBAR_LATEST.map((item, i) => (
            <a key={i} href="#" className="flex gap-3 py-3 first:pt-0 no-underline group">
              <span className="shrink-0 tabular-nums text-[12px] text-gray-600 w-8 pt-0.5">{item.time}</span>
              <span className="text-[13px] font-medium leading-snug text-white/80 group-hover:text-white transition-colors">{item.headline}</span>
            </a>
          ))}
        </div>
      </div>

      {/* In Focus */}
      <div className="border-t border-white/[0.05] pt-5">
        <h2 className="text-[15px] font-bold text-white mb-3">In Focus</h2>
        <div className="flex flex-wrap gap-2">
          {IN_FOCUS_TOPICS.map(t => (
            <a key={t} href="#" className="rounded border border-white/[0.12] px-3 py-1.5 text-[12px] text-white/70 hover:border-white/30 hover:text-white transition-colors no-underline">
              {t}
            </a>
          ))}
        </div>
      </div>

      {/* Data widgets below — desktop sidebar only */}
      <div className="hidden lg:flex flex-col gap-5 border-t border-white/[0.05] pt-5">
        <ForexWidget />
        <CommoditiesWidget />
        <EconomicWidget />
      </div>

      {/* Most Read — all viewports */}
      <MostReadWidget />

      {/* Upcoming Events — all viewports */}
      <UpcomingEventsWidget />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   QUICK READS
───────────────────────────────────────────────────────────────────────────── */

function QuickReadsColumn() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[17px] font-bold text-white tracking-tight">In Brief</h2>
        <a href="#" className="text-[12px] font-medium text-white/50 hover:text-white transition-colors">More ›</a>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {QUICK_READS.map((item, i) => (
          <a key={i} href="#" className="flex items-start gap-3 py-3.5 first:pt-0 no-underline group">
            <span className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-white/[0.06] text-white/50">
              {item.tag}
            </span>
            <span className="flex-1 text-[13px] font-medium leading-snug text-white/80 group-hover:text-white transition-colors line-clamp-2">
              {item.headline}
            </span>
            <span className="shrink-0 tabular-nums text-[11px] text-gray-600 pt-0.5">{item.time}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOST READ + UPCOMING EVENTS WIDGETS
───────────────────────────────────────────────────────────────────────────── */

function MostReadWidget() {
  return (
    <div className="border-t border-white/[0.05] pt-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-bold text-white">Most Read</h2>
        <a href="#" className="text-[12px] text-white/50 hover:text-white transition-colors">See all ›</a>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {MOST_READ.map(item => (
          <a key={item.rank} href="#" className="flex items-start gap-3.5 py-3 first:pt-0 no-underline group">
            <span className="shrink-0 tabular-nums text-[22px] font-black text-white/10 leading-none w-6 pt-0.5">{item.rank}</span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-snug text-white/80 group-hover:text-white transition-colors line-clamp-2">{item.title}</p>
              <p className="mt-1 text-[11px] text-gray-600">{item.source} · {item.time}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function UpcomingEventsWidget() {
  return (
    <div className="border-t border-white/[0.05] pt-5">
      <h2 className="text-[15px] font-bold text-white mb-3">Upcoming Events</h2>
      <div className="flex flex-col gap-2.5">
        {UPCOMING_EVENTS.map((ev, i) => (
          <a key={i} href="#" className="flex items-start gap-3 no-underline group">
            <div className="shrink-0 rounded-lg bg-white/[0.05] border border-white/[0.06] px-2 py-1.5 text-center min-w-[46px]">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{ev.date.split(' ')[0]}</p>
              <p className="text-[15px] font-black text-white leading-none">{ev.date.split(' ')[1]}</p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold leading-snug text-white/80 group-hover:text-white transition-colors">{ev.label}</p>
              <span className="mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-white/[0.06] text-white/50">{ev.type}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE BOTTOM TICKER BAR
───────────────────────────────────────────────────────────────────────────── */

function MobileTickerBar() {
  const pinned = INDICATORS.slice(0, 6);
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0d]/95 backdrop-blur-sm border-t border-white/[0.06] px-3 py-2">
      <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pinned.map(item => (
          <a key={item.label} href="#" className="no-underline shrink-0 flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5">
            <span className="text-[12px] font-bold text-white whitespace-nowrap">{item.label}</span>
            <span className={`tabular-nums text-[11px] font-bold whitespace-nowrap ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
              {item.pct}
            </span>
            <svg className="h-3 w-3 text-white/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0e0e11]">
      <Header />
      <IndicatorsStrip />

      <main className="mx-auto max-w-[1320px] px-5 py-6 pb-20 sm:pb-6">

        {/* Three-column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-5">

          {/* LEFT: Featured video + video list — col 1-5 */}
          <div className="order-1 lg:col-span-5 flex flex-col gap-5">
            <FeaturedColumn />
            <div className="border-t border-white/[0.05] pt-5">
              <VideosSection />
            </div>
            <div className="border-t border-white/[0.05] pt-5">
              <MoreNewsColumn />
            </div>
            <div className="border-t border-white/[0.05] pt-5">
              <QuickReadsColumn />
            </div>
          </div>

          {/* CENTER: News feed — col 6-9 */}
          <div className="order-2 lg:col-span-4 lg:border-l lg:border-white/[0.05] lg:pl-5 flex flex-col gap-5">
            <NewsListColumn />
            <div className="border-t border-white/[0.05] pt-5">
              <LatestColumn />
            </div>
            <div className="border-t border-white/[0.05] pt-5">
              <DeepReadsColumn />
            </div>
          </div>

          {/* RIGHT: Sidebar — col 10-12 */}
          <aside className="order-3 lg:col-span-3 lg:border-l lg:border-white/[0.05] lg:pl-5">
            <LatestSidebar />
          </aside>

        </div>

      </main>

      <Footer />
      <MobileTickerBar />
    </div>
  );
}
