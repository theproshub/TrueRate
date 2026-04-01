'use client';

import { useState, useMemo } from 'react';
import { newsItems } from '@/data/news';
import { stocks } from '@/data/stocks';

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */

type SortKey = 'name' | 'price' | 'change' | 'changePercent' | 'volume' | 'marketCap';

const INDICES = [
  { label: 'LRD/USD',  value: '192.50',   change: '+1.25',  pct: '+0.65%', up: true,  spark: [186,188,187,190,189,191,190,192,191,193,192,192.5] },
  { label: 'LRD/EUR',  value: '209.85',   change: '-0.92',  pct: '-0.44%', up: false, spark: [212,211,210,211,209,210,209,210,208,209,210,209.85] },
  { label: 'LRD/GBP',  value: '243.15',   change: '+2.10',  pct: '+0.87%', up: true,  spark: [238,240,239,241,240,242,241,243,242,244,243,243.15] },
  { label: 'GSE-CI',   value: '3,456.12', change: '+42.30', pct: '+1.24%', up: true,  spark: [3380,3400,3390,3420,3410,3430,3440,3450,3445,3460,3455,3456] },
  { label: 'BRVM-CI',  value: '234.80',   change: '-1.20',  pct: '-0.51%', up: false, spark: [238,237,236,236,235,235,234,235,234,235,234,234.8] },
  { label: 'Gold',     value: '2,285.40', change: '+18.60', pct: '+0.82%', up: true,  spark: [2240,2255,2250,2265,2260,2270,2268,2278,2275,2282,2284,2285] },
  { label: 'Iron Ore', value: '108.50',   change: '-2.30',  pct: '-2.08%', up: false, spark: [115,114,113,112,111,110,109,109,108,108,108,108.5] },
  { label: 'Rubber',   value: '1.72',     change: '+0.04',  pct: '+2.38%', up: true,  spark: [1.60,1.62,1.63,1.65,1.66,1.67,1.68,1.69,1.70,1.71,1.72,1.72] },
  { label: 'CBL Rate', value: '17.50%',   change: '0.00',   pct: 'Steady', up: true,  spark: [17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5] },
];

const TRENDING = [
  { ticker: 'ETI',  name: 'Ecobank Transnational', price: '18.45', change: '+0.65',  pct: '+3.65%', up: true,  spark: [16.8,17.1,17.0,17.4,17.3,17.7,17.9,18.1,18.0,18.3,18.4,18.45] },
  { ticker: 'AMTL', name: 'ArcelorMittal Liberia', price: '12.85', change: '+0.35',  pct: '+2.80%', up: true,  spark: [11.9,12.1,12.0,12.2,12.3,12.4,12.5,12.6,12.5,12.7,12.8,12.85] },
  { ticker: 'GOLD', name: 'Gold Futures',           price: '2,285', change: '+18.60', pct: '+0.82%', up: true,  spark: [2240,2255,2250,2265,2260,2270,2268,2278,2275,2282,2284,2285] },
  { ticker: 'LPRC', name: 'Liberia Petroleum',      price: '3.25',  change: '+0.10',  pct: '+3.17%', up: true,  spark: [2.9,2.95,3.0,3.0,3.05,3.1,3.1,3.15,3.2,3.2,3.23,3.25] },
  { ticker: 'FSLR', name: 'Firestone Liberia',      price: '45.20', change: '-0.80',  pct: '-1.74%', up: false, spark: [47.5,47.2,47.0,46.8,46.5,46.3,46.1,46.0,45.8,45.6,45.4,45.2] },
  { ticker: 'LSCM', name: 'Lonestar Cell MTN',      price: '8.60',  change: '-0.15',  pct: '-1.71%', up: false, spark: [9.1,9.0,8.95,8.9,8.85,8.8,8.75,8.7,8.7,8.65,8.62,8.60] },
  { ticker: 'BOAB', name: 'Bank of Africa BRVM',    price: '5,450', change: '+75.00', pct: '+1.39%', up: true,  spark: [5200,5250,5280,5300,5320,5350,5370,5390,5400,5420,5440,5450] },
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

const EARNINGS = [
  { ticker: 'AMTL', name: 'ArcelorMittal Liberia', date: 'Apr 8',  eps: '$0.42', est: '$0.38', beat: true  },
  { ticker: 'ETI',  name: 'Ecobank Transnational', date: 'Apr 10', eps: '$1.15', est: '$1.12', beat: true  },
  { ticker: 'LPRC', name: 'Liberia Petroleum',     date: 'Apr 14', eps: '$0.08', est: '$0.10', beat: false },
  { ticker: 'FSLR', name: 'Firestone Liberia',     date: 'Apr 17', eps: '$2.80', est: '$2.85', beat: false },
];

const NEWS_IMGS = [
  'https://picsum.photos/seed/lr1/800/420',
  'https://picsum.photos/seed/lr2/200/120',
  'https://picsum.photos/seed/lr3/200/120',
  'https://picsum.photos/seed/lr4/200/120',
  'https://picsum.photos/seed/lr5/200/120',
  'https://picsum.photos/seed/lr6/200/120',
  'https://picsum.photos/seed/lr7/200/120',
  'https://picsum.photos/seed/lr8/200/120',
];

const LATEST_NEWS = [
  { title: 'CBL signals readiness to intervene if LRD weakens past 195', source: 'Reuters', time: '16m ago', tickers: ['LRD/USD'] },
  { title: 'Liberia Petroleum Refining Corp reports Q1 revenue rise of 12%', source: 'Daily Observer', time: '23m ago', tickers: ['LPRC', '+3.17%'] },
  { title: 'ArcelorMittal Liberia ships first expanded-capacity iron ore batch', source: 'Bloomberg', time: '46m ago', tickers: ['AMTL'] },
  { title: 'World Bank approves $45M grant for Liberia infrastructure bonds', source: 'World Bank', time: '59m ago', tickers: ['LRD/USD'] },
  { title: 'Ecobank Transnational raises dividend after strong West Africa quarter', source: 'FrontPage Africa', time: '1h ago', tickers: ['ETI', '+3.65%'] },
  { title: 'Liberia joins ECOWAS digital payments pilot with 5 other nations', source: 'Liberian Observer', time: '1h ago', tickers: [] },
  { title: 'Firestone Liberia rubber output hits decade high on favorable weather', source: 'The New Dawn', time: '3h ago', tickers: ['FSLR'] },
  { title: 'IMF praises Liberia fiscal consolidation, urges revenue reform', source: 'IMF', time: '5h ago', tickers: [] },
];

const VIDEOS = [
  { title: "CBL Governor on rate outlook: 'We're watching food prices closely'", duration: '2:48', thumb: 'https://picsum.photos/seed/v1/320/180', source: 'TrueRate Video', time: '55m ago', tickers: ['CBL Rate'] },
  { title: 'ArcelorMittal Nimba expansion — what it means for Liberia GDP', duration: '1:52', thumb: 'https://picsum.photos/seed/v2/320/180', source: 'TrueRate Video', time: '3h ago', tickers: ['AMTL', '+2.80%'] },
  { title: 'Rubber prices surge: Firestone investors react to record output', duration: '3:14', thumb: 'https://picsum.photos/seed/v3/320/180', source: 'TrueRate Video', time: '8h ago', tickers: ['FSLR', 'Rubber'] },
  { title: 'Diaspora remittances hit $680M — a new record for Liberia', duration: '2:31', thumb: 'https://picsum.photos/seed/v4/320/180', source: 'TrueRate Video', time: '3h ago', tickers: ['LRD/USD'] },
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
    <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${up ? 'bg-[#4ade80]/15 text-[#4ade80]' : 'bg-[#f87171]/15 text-[#f87171]'}`}>
      {up ? '▲' : '▼'} {text}
    </span>
  );
}

function TickerPill({ label }: { label: string }) {
  if (label.startsWith('+')) return <span className="rounded bg-[#4ade80]/15 px-1.5 py-0.5 text-[11px] font-semibold text-[#4ade80] tabular-nums">{label}</span>;
  if (label.startsWith('-')) return <span className="rounded bg-[#f87171]/15 px-1.5 py-0.5 text-[11px] font-semibold text-[#f87171] tabular-nums">{label}</span>;
  return <span className="rounded bg-[#6001d2]/30 px-1.5 py-0.5 text-[11px] font-semibold text-[#a78bfa]">{label}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   HEADER
───────────────────────────────────────────────────────────────────────────── */

function Header() {
  const NAV = ['My Portfolio', 'News', 'Markets', 'Research', 'Community', 'Personal Finance', 'Videos', 'Watch Now'];
  const [active, setActive] = useState('My Portfolio');
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-[#1b1b1b]">
      {/* Top bar */}
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-2.5">
        {/* Hamburger — mobile only */}
        <button
          className="sm:hidden flex shrink-0 flex-col justify-center gap-[5px] p-1"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Open menu"
        >
          <span className={`block h-[2px] w-5 bg-white transition-transform origin-center ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-[2px] w-5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-[2px] w-5 bg-white transition-transform origin-center ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
        <a href="/" className="flex shrink-0 items-center gap-2 no-underline">
          <span className="text-[22px] font-black tracking-tight text-white">TrueRate</span>
          <span className="rounded bg-[#6001d2] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">Liberia</span>
        </a>
        <div className="hidden sm:flex flex-1 max-w-[500px] items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-transparent transition focus-within:bg-white/15 focus-within:ring-[#6001d2]/50">
          <svg className="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search for news, symbols or companies"
            className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-gray-500" />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-1.5 text-[12px] text-gray-300 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80] shadow-[0_0_5px_#4ade80]" />
            WAT Markets open
          </div>
          <button className="rounded-full border border-white/25 px-4 py-1.5 text-[13px] font-medium text-white transition hover:bg-white/10">
            Sign in
          </button>
          <button className="hidden rounded-full bg-[#6001d2] px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[#490099] sm:block">
            Get Premium
          </button>
        </div>
      </div>
      {/* Mobile search bar */}
      <div className="sm:hidden px-4 pb-2.5">
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-transparent transition focus-within:bg-white/15 focus-within:ring-[#6001d2]/50">
          <svg className="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search for news, symbols or companies"
            className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-gray-500" />
        </div>
      </div>
      {/* Nav tabs — hidden on mobile, visible sm+ */}
      <div className="hidden sm:block border-t border-white/10 bg-[#111]">
        <div className="mx-auto flex max-w-[1280px] overflow-x-auto px-4">
          {NAV.map(tab => (
            <button key={tab} onClick={() => setActive(tab)}
              className={`whitespace-nowrap px-3.5 py-2.5 text-[13px] font-medium transition-colors ${
                active === tab
                  ? 'border-b-2 border-[#6001d2] text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}>
              {tab}
            </button>
          ))}
          <div className="ml-auto flex items-center py-1">
            <button className="whitespace-nowrap rounded px-3 py-1.5 text-[12px] font-medium text-gray-400 hover:text-white">
              My Portfolio +
            </button>
          </div>
        </div>
      </div>
      {/* Mobile drawer */}
      {menuOpen && (
        <div className="sm:hidden absolute inset-x-0 top-full z-50 bg-[#111] border-t border-white/10 shadow-xl">
          {NAV.map(tab => (
            <button key={tab} onClick={() => { setActive(tab); setMenuOpen(false); }}
              className={`flex w-full items-center px-5 py-3.5 text-[14px] font-medium border-b border-white/5 transition-colors ${
                active === tab
                  ? 'text-white border-l-2 border-l-[#6001d2] bg-white/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              {tab}
            </button>
          ))}
          <div className="px-5 py-4">
            <button className="w-full rounded-full bg-[#6001d2] py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#490099]">
              Get Premium
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MARKET SUMMARY STRIP (Yahoo Finance style — replaces ticker tape)
───────────────────────────────────────────────────────────────────────────── */

function MarketSummaryStrip() {
  return (
    <div className="border-b border-[#222] bg-[#161618]">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {INDICES.map(item => (
            <a key={item.label} href="#"
              className="group shrink-0 flex flex-col justify-between min-w-[130px] border-r border-[#222] px-4 py-3 no-underline transition hover:bg-[#1c1c1e] cursor-pointer">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[12px] font-semibold text-white truncate">{item.label}</span>
                <Spark data={item.spark} up={item.up} w={56} h={22} />
              </div>
              <div className="tabular-nums text-[13px] font-bold text-white">{item.value}</div>
              <div className={`tabular-nums text-[11px] font-semibold mt-0.5 ${item.up ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                {item.change} ({item.pct})
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FEATURED ARTICLE (left column)
───────────────────────────────────────────────────────────────────────────── */

function FeaturedColumn() {
  const featured = newsItems[0];
  const sub1 = newsItems[1];
  const sub2 = newsItems[2];

  return (
    <div className="flex flex-col gap-4">
      {/* Hero article */}
      <article className="group cursor-pointer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={NEWS_IMGS[0]} alt={featured.title} className="w-full h-[220px] lg:h-[280px] object-cover rounded-lg" />
        <div className="mt-3">
          <div className="flex items-center gap-1.5 text-[11px] mb-2">
            <span className="font-bold uppercase tracking-wide text-[#a78bfa]">Monetary Policy</span>
            <span className="text-[#444]">·</span>
            <span className="text-[#777]">{featured.source}</span>
            <span className="text-[#444]">·</span>
            <span className="text-[#777]">{timeAgo(featured.date)}</span>
          </div>
          <h2 className="text-[20px] font-bold leading-snug text-white group-hover:text-[#a78bfa] transition-colors">
            <a href="#" className="no-underline">{featured.title}</a>
          </h2>
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#999]">{featured.summary}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {['CBL Rate', 'LRD/USD', 'Inflation'].map(t => (
              <TickerPill key={t} label={t} />
            ))}
          </div>
        </div>
      </article>

      {/* Two sub-articles */}
      <div className="grid grid-cols-2 gap-3 border-t border-[#222] pt-4">
        {[sub1, sub2].map((item, i) => (
          <article key={item.id} className="group cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={NEWS_IMGS[i + 1]} alt="" className="w-full h-[100px] object-cover rounded" />
            <h3 className="mt-2 line-clamp-3 text-[12px] font-semibold leading-snug text-white group-hover:text-[#a78bfa] transition-colors">
              <a href="#" className="no-underline">{item.title}</a>
            </h3>
            <div className="mt-1 text-[11px] text-[#666]">{item.source} · {timeAgo(item.date)}</div>
          </article>
        ))}
      </div>

      {/* More sub-articles */}
      <div className="grid grid-cols-2 gap-3 border-t border-[#222] pt-4">
        {[newsItems[3], newsItems[4]].map((item, i) => (
          <article key={item.id} className="group cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={NEWS_IMGS[i + 3]} alt="" className="w-full h-[100px] object-cover rounded" />
            <h3 className="mt-2 line-clamp-3 text-[12px] font-semibold leading-snug text-white group-hover:text-[#a78bfa] transition-colors">
              <a href="#" className="no-underline">{item.title}</a>
            </h3>
            <div className="mt-1 text-[11px] text-[#666]">{item.source} · {timeAgo(item.date)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NEWS LIST COLUMN (middle-left)
───────────────────────────────────────────────────────────────────────────── */

function NewsListColumn() {
  const items = newsItems.slice(3, 7);
  return (
    <div className="flex flex-col divide-y divide-[#1e1e20]">
      {items.map((item, i) => (
        <article key={item.id} className="group flex gap-3 py-3 first:pt-0 cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={NEWS_IMGS[(i + 3) % NEWS_IMGS.length]} alt="" className="h-[72px] w-[108px] shrink-0 rounded object-cover" />
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-3 text-[13px] font-semibold leading-snug text-white group-hover:text-[#a78bfa] transition-colors">
              <a href="#" className="no-underline">{item.title}</a>
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px]">
              <span className="text-[#777]">{item.source}</span>
              <span className="text-[#444]">·</span>
              <span className="text-[#777]">{timeAgo(item.date)}</span>
            </div>
            {item.category && (
              <div className="mt-1.5">
                <TickerPill label={item.category} />
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LATEST COLUMN (middle-right)
───────────────────────────────────────────────────────────────────────────── */

function LatestColumn() {
  return (
    <div>
      <h2 className="mb-3 text-[15px] font-bold text-white">Latest</h2>
      <div className="flex flex-col divide-y divide-[#1e1e20]">
        {LATEST_NEWS.map((item, i) => (
          <div key={i} className="group cursor-pointer py-3 first:pt-0">
            <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-[#a78bfa] transition-colors">
              <a href="#" className="no-underline">{item.title}</a>
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px]">
              <span className="text-[#777]">{item.source}</span>
              <span className="text-[#444]">·</span>
              <span className="text-[#777]">{item.time}</span>
              {item.tickers.map(tk => <TickerPill key={tk} label={tk} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   QUOTE LOOKUP WIDGET
───────────────────────────────────────────────────────────────────────────── */

function QuoteLookup() {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 rounded-full bg-[#1c1c1e] border border-[#2a2a2a] px-4 py-2.5 ring-1 ring-transparent transition focus-within:border-[#6001d2]/50 focus-within:ring-[#6001d2]/20">
        <svg className="h-3.5 w-3.5 shrink-0 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Quote Lookup"
          className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-[#555]" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR: TRENDING TICKERS
───────────────────────────────────────────────────────────────────────────── */

function TrendingWidget() {
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#161618] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#222] px-4 py-3">
        <h2 className="text-[13px] font-bold text-white">Trending tickers</h2>
        <a href="#" className="text-[11px] text-[#a78bfa] hover:underline">View all ›</a>
      </div>
      <div className="divide-y divide-[#1e1e20]">
        {TRENDING.map(t => (
          <div key={t.ticker} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#1c1c1e] transition-colors cursor-pointer">
            <div className="min-w-0 flex-1">
              <a href="#" className="block text-[13px] font-bold text-[#a78bfa] no-underline hover:underline">{t.ticker}</a>
              <span className="block truncate text-[11px] text-[#666]">{t.name}</span>
            </div>
            <div className="shrink-0 text-right">
              <div className="tabular-nums text-[12px] font-semibold text-white">{t.price}</div>
              <Pill text={t.pct} up={t.up} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR: PORTFOLIO
───────────────────────────────────────────────────────────────────────────── */

function PortfolioWidget() {
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#161618] overflow-hidden">
      <div className="border-b border-[#222] px-4 py-3">
        <h2 className="text-[13px] font-bold text-white">Portfolio</h2>
      </div>
      <div className="px-4 py-6 text-center">
        <p className="text-[13px] text-[#777] mb-3">Sign in to access your portfolio</p>
        <button className="rounded-full border border-[#6001d2] px-5 py-2 text-[12px] font-semibold text-[#a78bfa] transition hover:bg-[#6001d2]/20">
          Sign in
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MARKET MOVERS
───────────────────────────────────────────────────────────────────────────── */

function MarketMovers() {
  const [tab, setTab] = useState<'gainers' | 'losers' | 'active'>('gainers');
  const gainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const losers  = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const active  = [...stocks].sort((a, b) => b.volume.localeCompare(a.volume)).slice(0, 5);
  const rows    = tab === 'losers' ? losers : tab === 'active' ? active : gainers;

  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#161618] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#222] px-4 py-3">
        <h2 className="text-[14px] font-bold text-white">Market Movers</h2>
        <a href="#" className="text-[12px] text-[#a78bfa] hover:underline">View all ›</a>
      </div>
      <div className="flex border-b border-[#222] px-4">
        {(['gainers', 'losers', 'active'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`mr-5 py-2.5 text-[12px] font-medium capitalize transition-colors ${
              tab === t ? 'border-b-2 border-[#6001d2] text-[#a78bfa]' : 'text-[#666] hover:text-[#ccc]'
            }`}>
            {t === 'gainers' ? 'Top Gainers' : t === 'losers' ? 'Top Losers' : 'Most Active'}
          </button>
        ))}
      </div>
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-[#1e1e20] text-[11px] font-semibold uppercase tracking-wide text-[#555]">
            <th className="px-4 py-2 text-left">Symbol</th>
            <th className="px-4 py-2 text-right">Price</th>
            <th className="hidden sm:table-cell px-4 py-2 text-right">Change</th>
            <th className="px-4 py-2 text-right">% Chg</th>
            <th className="hidden sm:table-cell px-4 py-2 text-right">Volume</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e1e20]">
          {rows.map(s => (
            <tr key={s.ticker} className="hover:bg-[#1c1c1e] transition-colors">
              <td className="px-4 py-2.5">
                <a href="#" className="block text-[13px] font-bold text-[#a78bfa] no-underline hover:underline">{s.ticker}</a>
                <span className="text-[11px] text-[#555] hidden sm:inline">{s.name}</span>
              </td>
              <td className="tabular-nums px-4 py-2.5 text-right font-semibold text-white">
                {s.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
              <td className={`hidden sm:table-cell tabular-nums px-4 py-2.5 text-right font-semibold ${s.change >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}
              </td>
              <td className="tabular-nums px-4 py-2.5 text-right">
                <Pill text={`${Math.abs(s.changePercent).toFixed(2)}%`} up={s.changePercent >= 0} />
              </td>
              <td className="hidden sm:table-cell tabular-nums px-4 py-2.5 text-right text-[#555]">{s.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCREENER TABLE
───────────────────────────────────────────────────────────────────────────── */

function ScreenerTable() {
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
      className={`cursor-pointer select-none px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#555] hover:text-[#ccc] transition-colors ${right ? 'text-right' : 'text-left'}`}>
      {label} <span className="text-[10px]">{sortKey === k ? (sortAsc ? '▲' : '▼') : '⇅'}</span>
    </th>
  );

  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#161618] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#222] px-4 py-3">
        <h2 className="text-[14px] font-bold text-white">West Africa Markets</h2>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] text-[#555]">Prices in LRD · 15 min delay</span>
          <a href="#" className="text-[12px] text-[#a78bfa] hover:underline">Screener ›</a>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead className="border-b border-[#1e1e20]">
            <tr>
              <SH k="name" label="Symbol" right={false} />
              <SH k="price" label="Price" />
              <SH k="change" label="Change" />
              <SH k="changePercent" label="% Chg" />
              <SH k="volume" label="Volume" />
              <SH k="marketCap" label="Mkt Cap" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e20]">
            {sorted.map(s => (
              <tr key={s.ticker} className="hover:bg-[#1c1c1e] transition-colors">
                <td className="px-4 py-2.5">
                  <a href="#" className="font-bold text-[#a78bfa] no-underline hover:underline">{s.ticker}</a>
                  <span className="ml-1.5 text-[11px] text-[#555]">{s.name}</span>
                </td>
                <td className="tabular-nums px-4 py-2.5 text-right font-medium text-white">
                  {s.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className={`tabular-nums px-4 py-2.5 text-right font-medium ${s.change >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                  {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}
                </td>
                <td className="tabular-nums px-4 py-2.5 text-right">
                  <Pill text={`${Math.abs(s.changePercent).toFixed(2)}%`} up={s.changePercent >= 0} />
                </td>
                <td className="tabular-nums px-4 py-2.5 text-right text-[#555]">{s.volume}</td>
                <td className="tabular-nums px-4 py-2.5 text-right text-[#555]">{s.marketCap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EARNINGS CALENDAR
───────────────────────────────────────────────────────────────────────────── */

function EarningsCalendar() {
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#161618] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#222] px-4 py-3">
        <h2 className="text-[14px] font-bold text-white">Earnings Calendar</h2>
        <a href="#" className="text-[12px] text-[#a78bfa] hover:underline">Full calendar ›</a>
      </div>
      <div className="divide-y divide-[#1e1e20]">
        {EARNINGS.map(e => (
          <div key={e.ticker} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#1c1c1e] transition-colors">
            <div className="min-w-0">
              <a href="#" className="block text-[13px] font-bold text-[#a78bfa] no-underline hover:underline">{e.ticker}</a>
              <span className="block truncate text-[11px] text-[#555]">{e.name}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-4 text-right">
              <div>
                <div className="text-[10px] text-[#555]">EPS</div>
                <div className="tabular-nums text-[12px] font-bold text-white">{e.eps}</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-[10px] text-[#555]">Est.</div>
                <div className="tabular-nums text-[12px] text-[#777]">{e.est}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#555]">Date</div>
                <div className="text-[12px] font-semibold text-white">{e.date}</div>
              </div>
              <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${e.beat ? 'bg-[#4ade80]/15 text-[#4ade80]' : 'bg-[#f87171]/15 text-[#f87171]'}`}>
                {e.beat ? 'BEAT' : 'MISS'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR: CURRENCY CONVERTER
───────────────────────────────────────────────────────────────────────────── */

function ForexWidget() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('LRD');
  const currs = Object.keys(RATES);

  const converted = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    return ((amt * RATES[from]) / RATES[to]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, from, to]);

  const rate = (RATES[from] / RATES[to]).toFixed(4);

  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#161618] overflow-hidden">
      <div className="border-b border-[#222] px-4 py-3">
        <h2 className="text-[14px] font-bold text-white">Currency Converter</h2>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#555]">Amount</label>
          <div className="flex overflow-hidden rounded border border-[#2a2a2a] transition focus-within:border-[#6001d2] focus-within:ring-1 focus-within:ring-[#6001d2]/20">
            <input type="number" value={amount} min="0" onChange={e => setAmount(e.target.value)}
              className="tabular-nums w-full px-3 py-2 text-[14px] font-bold text-white outline-none bg-[#1c1c1e]" />
            <select value={from} onChange={e => setFrom(e.target.value)}
              className="border-l border-[#2a2a2a] bg-[#222] px-2 py-2 text-[12px] font-bold text-white outline-none">
              {currs.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[#222]" />
          <button onClick={() => { setFrom(to); setTo(from); }}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#1c1c1e] text-[#666] transition hover:border-[#6001d2] hover:text-[#a78bfa]">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
          <div className="h-px flex-1 bg-[#222]" />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#555]">Converted</label>
          <div className="flex overflow-hidden rounded border border-[#2a2a2a] bg-[#1c1c1e]">
            <div className="tabular-nums w-full px-3 py-2 text-[14px] font-bold text-white">{converted}</div>
            <select value={to} onChange={e => setTo(e.target.value)}
              className="border-l border-[#2a2a2a] bg-[#222] px-2 py-2 text-[12px] font-bold text-white outline-none">
              {currs.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <p className="text-center text-[11px] text-[#666]">
          1 {from} = <span className="tabular-nums font-bold text-white">{rate}</span> {to}
          <span className="ml-1 text-[10px] text-[#444]">· Apr 1, 2026</span>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR: COMMODITIES
───────────────────────────────────────────────────────────────────────────── */

function CommoditiesWidget() {
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#161618] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#222] px-4 py-3">
        <h2 className="text-[14px] font-bold text-white">Liberia Commodities</h2>
        <a href="#" className="text-[12px] text-[#a78bfa] hover:underline">View all ›</a>
      </div>
      <div className="divide-y divide-[#1e1e20]">
        {COMMODITIES.map(c => (
          <div key={c.name} className="flex items-center justify-between px-4 py-2.5 hover:bg-[#1c1c1e] transition-colors">
            <div>
              <a href="#" className="block text-[12px] font-semibold text-white no-underline hover:text-[#a78bfa]">{c.name}</a>
              <span className="text-[11px] text-[#555]">{c.unit}</span>
            </div>
            <div className="text-right">
              <div className="tabular-nums text-[12px] font-bold text-white">${c.price}</div>
              <Pill text={c.pct} up={c.up} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR: ECONOMIC INDICATORS
───────────────────────────────────────────────────────────────────────────── */

function EconomicWidget() {
  const rows = [
    { label: 'GDP',           value: '$4.33B',  pct: '+4.34%', up: true  },
    { label: 'Inflation',     value: '10.2%',   pct: '-0.80pp', up: true  },
    { label: 'CBL Rate',      value: '17.50%',  pct: 'Steady',  up: true  },
    { label: 'Unemployment',  value: '3.6%',    pct: '-5.26%',  up: true  },
    { label: 'Trade Balance', value: '-$0.82B', pct: '+5.75%',  up: true  },
    { label: 'Debt / GDP',    value: '55.4%',   pct: '+2.21%',  up: false },
  ];
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#161618] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#222] px-4 py-3">
        <h2 className="text-[14px] font-bold text-white">Economic Indicators</h2>
        <span className="rounded bg-[#6001d2]/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#a78bfa]">Liberia</span>
      </div>
      <div className="divide-y divide-[#1e1e20]">
        {rows.map(r => (
          <div key={r.label} className="flex items-center justify-between px-4 py-2.5 hover:bg-[#1c1c1e] transition-colors">
            <span className="text-[12px] text-[#777]">{r.label}</span>
            <div className="flex items-center gap-2">
              <span className="tabular-nums text-[12px] font-bold text-white">{r.value}</span>
              <span className={`tabular-nums text-[11px] font-semibold ${r.up ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>{r.pct}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-[#1e1e20] px-4 py-2">
        <span className="text-[10px] text-[#444]">Sources: CBL · World Bank · IMF · Updated Apr 1, 2026</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   VIDEOS
───────────────────────────────────────────────────────────────────────────── */

function VideosSection() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between border-b border-[#222] pb-2">
        <h2 className="text-[15px] font-bold text-white">Videos</h2>
        <a href="#" className="text-[12px] text-[#a78bfa] hover:underline">View More</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {VIDEOS.map((v, i) => (
          <div key={i} className="group flex gap-3 cursor-pointer">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.thumb} alt="" className="h-[72px] w-[114px] rounded object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60">
                  <svg className="h-3 w-3 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[10px] font-semibold text-white">{v.duration}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-[12px] font-semibold leading-snug text-white group-hover:text-[#a78bfa] transition-colors">{v.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px]">
                <span className="text-[#666]">{v.source}</span>
                <span className="text-[#444]">·</span>
                <span className="text-[#666]">{v.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────────────────────── */

function Footer() {
  const trending = ['LRD/USD', 'Iron Ore', 'AMTL', 'ETI', 'Rubber', 'CBL Rate', 'Gold', 'LPRC', 'Remittances', 'Liberia GDP'];
  const sections: Record<string, string[]> = {
    'Mortgages': ['Best Rates', 'Calculators', 'Refinance', 'Home Equity'],
    'Financial News': ['Top Stories', 'Economy', 'Policy', 'Mining', 'Agriculture'],
    'Explore More': ['Currency Converter', 'Screener', 'Watchlist', 'Economic Data'],
    'About': ['About TrueRate', 'Sitemap', 'Help', 'Feedback', 'Licensing'],
  };
  return (
    <footer className="mt-8 border-t border-[#222] bg-[#0e0e10]">
      {/* Newsletter */}
      <div className="border-b border-[#222] bg-[#161618] px-4 py-8">
        <div className="mx-auto max-w-[1280px] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-white">TrueRate Morning Brief</h3>
            <p className="mt-0.5 text-[13px] text-[#666]">Sign up for the TrueRate Morning Brief</p>
          </div>
          <div className="flex w-full max-w-[400px] gap-2">
            <input type="email" placeholder="Email address"
              className="flex-1 rounded bg-[#1c1c1e] border border-[#2a2a2a] px-4 py-2.5 text-[13px] text-white placeholder:text-[#444] outline-none focus:border-[#6001d2]" />
            <button className="shrink-0 rounded bg-[#6001d2] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#490099] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-8">
        <div className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4 mb-8">
          {Object.entries(sections).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-[#888]">{title}</h4>
              <ul className="space-y-1.5">
                {links.map(l => (
                  <li key={l}><a href="#" className="text-[12px] text-[#555] hover:text-[#a78bfa] no-underline hover:underline">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-6 border-t border-[#222] pt-5">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#555]">What&apos;s trending</p>
          <div className="flex flex-wrap gap-2">
            {trending.map(t => (
              <a key={t} href="#" className="rounded border border-[#2a2a2a] px-3 py-1 text-[12px] text-[#555] hover:border-[#6001d2]/50 hover:text-[#a78bfa] transition-colors no-underline">{t}</a>
            ))}
          </div>
        </div>

        <div className="border-t border-[#222] pt-5">
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
            {['Data Disclaimer', 'Help', 'Feedback', 'Sitemap', 'Terms and Privacy Policy', 'Privacy Dashboard', 'About Our Ads'].map(l => (
              <a key={l} href="#" className="text-[11px] text-[#444] hover:text-[#a78bfa] no-underline">{l}</a>
            ))}
          </div>
          <p className="text-[11px] text-[#333]">Copyright © 2026 TrueRate. All rights reserved. · Quotes delayed 15 min · Not investment advice</p>
          <p className="mt-1 text-[10px] text-[#333]">Data: Central Bank of Liberia · World Bank · IMF · Ghana Stock Exchange · BRVM</p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0e0e10]">
      <Header />
      <MarketSummaryStrip />

      <main className="mx-auto max-w-[1280px] px-4 py-5">

        {/* 4-column news layout */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-4 mb-8">

          {/* News list — col 1-3 on desktop, 2nd on mobile */}
          <div className="order-2 lg:order-1 lg:col-span-3">
            <NewsListColumn />
          </div>

          {/* Featured — col 4-8 on desktop, 1st on mobile */}
          <div className="order-1 lg:order-2 lg:col-span-5 lg:border-l lg:border-[#1e1e20] lg:pl-4">
            <FeaturedColumn />
          </div>

          {/* Latest — col 9-10 */}
          <div className="order-3 lg:col-span-2 lg:border-l lg:border-[#1e1e20] lg:pl-4">
            <LatestColumn />
          </div>

          {/* Sidebar — col 11-12 */}
          <div className="order-4 lg:col-span-2 lg:border-l lg:border-[#1e1e20] lg:pl-4 flex flex-col gap-4">
            <QuoteLookup />
            <TrendingWidget />
            <PortfolioWidget />
          </div>

        </div>

        {/* Videos */}
        <div className="mb-8 border-t border-[#1e1e20] pt-6">
          <VideosSection />
        </div>

        {/* Market data tables */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start border-t border-[#1e1e20] pt-6">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <MarketMovers />
            <ScreenerTable />
            <EarningsCalendar />
          </div>
          <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[320px]">
            <ForexWidget />
            <CommoditiesWidget />
            <EconomicWidget />
          </aside>
        </div>

      </main>

      <Footer />
    </div>
  );
}
