'use client';

import { useState, useMemo } from 'react';
import { newsItems } from '@/data/news';
import { stocks } from '@/data/stocks';

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */

type SortKey = 'name' | 'price' | 'change' | 'changePercent' | 'volume' | 'marketCap';

const INDICATORS = [
  { label: 'LRD/USD',    value: '192.50',    change: '+1.25',  pct: '+0.65%', up: true,  spark: [186,188,187,190,189,191,190,192,191,193,192,192.5] },
  { label: 'LRD/EUR',    value: '209.85',    change: '-0.92',  pct: '-0.44%', up: false, spark: [212,211,210,211,209,210,209,210,208,209,210,209.85] },
  { label: 'LRD/GBP',    value: '243.15',    change: '+2.10',  pct: '+0.87%', up: true,  spark: [238,240,239,241,240,242,241,243,242,244,243,243.15] },
  { label: 'GDP Growth',  value: '4.5%',      change: '+0.2pp', pct: 'YoY',    up: true,  spark: [3.2,3.4,3.5,3.7,3.8,3.9,4.0,4.1,4.2,4.3,4.4,4.5] },
  { label: 'Inflation',   value: '10.2%',     change: '-0.8pp', pct: 'YoY',    up: true,  spark: [12.5,12.2,11.8,11.5,11.2,11.0,10.8,10.6,10.5,10.4,10.3,10.2] },
  { label: 'Gold',        value: '2,285.40',  change: '+18.60', pct: '+0.82%', up: true,  spark: [2240,2255,2250,2265,2260,2270,2268,2278,2275,2282,2284,2285] },
  { label: 'Iron Ore',    value: '108.50',    change: '-2.30',  pct: '-2.08%', up: false, spark: [115,114,113,112,111,110,109,109,108,108,108,108.5] },
  { label: 'Rubber',      value: '1.72',      change: '+0.04',  pct: '+2.38%', up: true,  spark: [1.60,1.62,1.63,1.65,1.66,1.67,1.68,1.69,1.70,1.71,1.72,1.72] },
  { label: 'CBL Rate',    value: '17.50%',    change: '0.00',   pct: 'Steady', up: true,  spark: [17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5,17.5] },
];

const TRENDING = [
  { ticker: 'Iron Ore',    name: 'Nimba County Exports',       price: '108.50', change: '-2.30',  pct: '-2.08%', up: false },
  { ticker: 'Rubber',      name: 'Firestone Liberia Output',   price: '1.72',   change: '+0.04',  pct: '+2.38%', up: true  },
  { ticker: 'LRD/USD',     name: 'Exchange Rate',              price: '192.50', change: '+1.25',  pct: '+0.65%', up: true  },
  { ticker: 'Gold',        name: 'Global Gold Futures',        price: '2,285',  change: '+18.60', pct: '+0.82%', up: true  },
  { ticker: 'Palm Oil',    name: 'Global Benchmark',           price: '865.00', change: '-12.50', pct: '-1.42%', up: false },
  { ticker: 'Remittances', name: 'Diaspora Inflows (Q1)',      price: '$680M',  change: '+$45M',  pct: '+7.1%',  up: true  },
  { ticker: 'CBL Rate',    name: 'Central Bank Policy Rate',   price: '17.50%', change: '0.00',   pct: 'Steady', up: true  },
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
  { title: 'CBL signals readiness to intervene if LRD weakens past 195', source: 'Reuters', time: '16m ago', tags: ['Monetary Policy'] },
  { title: 'Liberia Petroleum Refining Corp reports Q1 revenue rise of 12%', source: 'Daily Observer', time: '23m ago', tags: ['Energy', '+12%'] },
  { title: 'ArcelorMittal Liberia ships first expanded-capacity iron ore batch', source: 'Bloomberg', time: '46m ago', tags: ['Mining'] },
  { title: 'World Bank approves $45M grant for Liberia infrastructure bonds', source: 'World Bank', time: '59m ago', tags: ['Development'] },
  { title: 'Ecobank Transnational raises dividend after strong West Africa quarter', source: 'FrontPage Africa', time: '1h ago', tags: ['Banking'] },
  { title: 'Liberia joins ECOWAS digital payments pilot with 5 other nations', source: 'Liberian Observer', time: '1h ago', tags: ['Trade'] },
  { title: 'Firestone Liberia rubber output hits decade high on favorable weather', source: 'The New Dawn', time: '3h ago', tags: ['Agriculture'] },
  { title: 'IMF praises Liberia fiscal consolidation, urges revenue reform', source: 'IMF', time: '5h ago', tags: ['Policy'] },
];

const VIDEOS = [
  { title: "CBL Governor on rate outlook: 'We're watching food prices closely'", duration: '2:48', thumb: 'https://picsum.photos/seed/v1/320/180', source: 'TrueRate', time: '55m ago' },
  { title: 'ArcelorMittal Nimba expansion — what it means for Liberia GDP', duration: '1:52', thumb: 'https://picsum.photos/seed/v2/320/180', source: 'TrueRate', time: '3h ago' },
  { title: 'Rubber prices surge: how Liberia benefits from record output', duration: '3:14', thumb: 'https://picsum.photos/seed/v3/320/180', source: 'TrueRate', time: '8h ago' },
  { title: 'Diaspora remittances hit $680M — a new record for Liberia', duration: '2:31', thumb: 'https://picsum.photos/seed/v4/320/180', source: 'TrueRate', time: '3h ago' },
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

function TagPill({ label }: { label: string }) {
  if (label.startsWith('+')) return <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 tabular-nums">{label}</span>;
  if (label.startsWith('-')) return <span className="rounded-full bg-red-400/15 px-2 py-0.5 text-[11px] font-semibold text-red-400 tabular-nums">{label}</span>;
  return <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[11px] font-semibold text-violet-300">{label}</span>;
}

function SectionHeading({ title, action, actionLabel = 'View all' }: { title: string; action?: string; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[17px] font-bold text-white tracking-tight">{title}</h2>
      {action && <a href={action} className="text-[12px] font-medium text-violet-400 hover:text-violet-300 hover:underline transition-colors">{actionLabel} ›</a>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HEADER
───────────────────────────────────────────────────────────────────────────── */

function Header() {
  const NAV = ['Business', 'Economy', 'Policy', 'Trade', 'Markets', 'Commodities', 'News', 'Videos'];
  const [active, setActive] = useState('Business');
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-[#131316] border-b border-white/[0.06]">
      {/* Top bar */}
      <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-5 py-3">
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
        <a href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
          <span className="text-[24px] font-black tracking-tight text-white">TrueRate</span>
          <span className="rounded-md bg-gradient-to-r from-violet-600 to-violet-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-violet-500/20">Liberia</span>
        </a>
        <div className="hidden sm:flex flex-1 max-w-[480px] items-center gap-2.5 rounded-xl bg-white/[0.06] px-4 py-2.5 border border-white/[0.06] transition focus-within:bg-white/[0.08] focus-within:border-violet-500/30">
          <svg className="h-4 w-4 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search business news, sectors, or topics"
            className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-gray-600" />
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <button className="rounded-lg border border-white/10 px-4 py-2 text-[13px] font-medium text-gray-300 transition hover:bg-white/[0.06] hover:text-white">
            Sign in
          </button>
          <button className="hidden sm:block rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-2 text-[13px] font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:shadow-violet-500/30 hover:brightness-110">
            Subscribe
          </button>
        </div>
      </div>
      {/* Mobile search bar */}
      <div className="sm:hidden px-5 pb-3">
        <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.06] px-4 py-2.5 border border-white/[0.06]">
          <svg className="h-4 w-4 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search business news, sectors, or topics"
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
                  ? 'border-b-2 border-violet-500 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
      {/* Mobile drawer */}
      {menuOpen && (
        <div className="sm:hidden absolute inset-x-0 top-full z-50 bg-[#131316] border-t border-white/[0.06] shadow-2xl shadow-black/50">
          {NAV.map(tab => (
            <button key={tab} onClick={() => { setActive(tab); setMenuOpen(false); }}
              className={`flex w-full items-center px-6 py-4 text-[14px] font-medium border-b border-white/[0.04] transition-colors ${
                active === tab
                  ? 'text-white bg-violet-500/10 border-l-2 border-l-violet-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}>
              {tab}
            </button>
          ))}
          <div className="px-6 py-5">
            <button className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 py-3 text-[13px] font-semibold text-white shadow-lg shadow-violet-500/20">
              Subscribe
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ECONOMIC INDICATORS STRIP
───────────────────────────────────────────────────────────────────────────── */

function IndicatorsStrip() {
  return (
    <div className="bg-[#0c0c0f] border-b border-white/[0.04]">
      <div className="mx-auto max-w-[1320px] px-5 py-2">
        <div className="flex overflow-x-auto gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {INDICATORS.map(item => (
            <a key={item.label} href="#"
              className="group shrink-0 flex flex-col min-w-[140px] rounded-lg px-3.5 py-2.5 no-underline transition hover:bg-white/[0.04] cursor-pointer">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{item.label}</span>
                <Spark data={item.spark} up={item.up} w={48} h={18} />
              </div>
              <div className="tabular-nums text-[15px] font-bold text-white leading-tight">{item.value}</div>
              <div className={`tabular-nums text-[11px] font-semibold mt-0.5 ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.change} <span className="text-gray-600">({item.pct})</span>
              </div>
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
          <div className="flex items-center gap-2 text-[11px] mb-2.5">
            <span className="font-bold uppercase tracking-[0.1em] text-violet-400">Economy</span>
            <span className="text-gray-700">·</span>
            <span className="text-gray-500">{featured.source}</span>
            <span className="text-gray-700">·</span>
            <span className="text-gray-500">{timeAgo(featured.date)}</span>
          </div>
          <h2 className="text-[22px] font-bold leading-snug text-white group-hover:text-violet-300 transition-colors">
            <a href="#" className="no-underline">{featured.title}</a>
          </h2>
          <p className="mt-2.5 line-clamp-2 text-[14px] leading-relaxed text-gray-500">{featured.summary}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['Monetary Policy', 'Inflation', 'CBL'].map(t => (
              <TagPill key={t} label={t} />
            ))}
          </div>
        </div>
      </article>

      {/* Two sub-articles */}
      <div className="grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-5">
        {[sub1, sub2].map((item, i) => (
          <article key={item.id} className="group cursor-pointer">
            <div className="overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={NEWS_IMGS[i + 1]} alt="" className="w-full h-[100px] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h3 className="mt-2.5 line-clamp-3 text-[13px] font-semibold leading-snug text-white group-hover:text-violet-300 transition-colors">
              <a href="#" className="no-underline">{item.title}</a>
            </h3>
            <div className="mt-1.5 text-[11px] text-gray-600">{item.source} · {timeAgo(item.date)}</div>
          </article>
        ))}
      </div>

      {/* More sub-articles */}
      <div className="grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-5">
        {[newsItems[3], newsItems[4]].map((item, i) => (
          <article key={item.id} className="group cursor-pointer">
            <div className="overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={NEWS_IMGS[i + 3]} alt="" className="w-full h-[100px] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h3 className="mt-2.5 line-clamp-3 text-[13px] font-semibold leading-snug text-white group-hover:text-violet-300 transition-colors">
              <a href="#" className="no-underline">{item.title}</a>
            </h3>
            <div className="mt-1.5 text-[11px] text-gray-600">{item.source} · {timeAgo(item.date)}</div>
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
        <article key={item.id} className="group flex gap-3.5 py-3.5 first:pt-0 cursor-pointer">
          <div className="overflow-hidden rounded-lg shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={NEWS_IMGS[(i + 3) % NEWS_IMGS.length]} alt="" className="h-[76px] w-[112px] object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-3 text-[13px] font-semibold leading-snug text-white group-hover:text-violet-300 transition-colors">
              <a href="#" className="no-underline">{item.title}</a>
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px]">
              <span className="text-gray-500">{item.source}</span>
              <span className="text-gray-700">·</span>
              <span className="text-gray-500">{timeAgo(item.date)}</span>
            </div>
            {item.category && (
              <div className="mt-2">
                <TagPill label={item.category} />
              </div>
            )}
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
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {LATEST_NEWS.map((item, i) => (
          <div key={i} className="group cursor-pointer py-3.5 first:pt-0">
            <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-violet-300 transition-colors">
              <a href="#" className="no-underline">{item.title}</a>
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px]">
              <span className="text-gray-500">{item.source}</span>
              <span className="text-gray-700">·</span>
              <span className="text-gray-500">{item.time}</span>
              {item.tags.map(tk => <TagPill key={tk} label={tk} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR: TRENDING
───────────────────────────────────────────────────────────────────────────── */

function TrendingWidget() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-3.5">
        <h2 className="text-[13px] font-bold text-white">Trending</h2>
        <a href="#" className="text-[11px] font-medium text-violet-400 hover:text-violet-300 hover:underline transition-colors">View all ›</a>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {TRENDING.map(t => (
          <div key={t.ticker} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer">
            <div className="min-w-0 flex-1">
              <a href="#" className="block text-[13px] font-bold text-violet-400 no-underline hover:underline">{t.ticker}</a>
              <span className="block truncate text-[11px] text-gray-600">{t.name}</span>
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
   KEY SECTORS
───────────────────────────────────────────────────────────────────────────── */

function KeySectorsWidget() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <h2 className="text-[15px] font-bold text-white">Key Sectors</h2>
        <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-violet-400">Liberia</span>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {KEY_SECTORS.map(s => (
          <div key={s.sector} className="px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center justify-between mb-1">
              <a href="#" className="text-[13px] font-semibold text-white no-underline hover:text-violet-300 transition-colors">
                {s.sector}
              </a>
              <Pill text={s.growth} up={s.up} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-600">{s.desc}</span>
              <span className="text-[11px] font-medium text-gray-500">{s.contrib} of GDP</span>
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
      className={`cursor-pointer select-none px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-600 hover:text-gray-300 transition-colors ${right ? 'text-right' : 'text-left'}`}>
      {label} <span className="text-[10px] text-gray-700">{sortKey === k ? (sortAsc ? '▲' : '▼') : '⇅'}</span>
    </th>
  );

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <h2 className="text-[15px] font-bold text-white">Major Enterprises</h2>
        <span className="hidden sm:inline text-[11px] text-gray-600">Prices in LRD · Sources: CBL, GSE, BRVM</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead className="border-b border-white/[0.05] bg-white/[0.01]">
            <tr>
              <SH k="name" label="Company" right={false} />
              <SH k="price" label="Price" />
              <SH k="change" label="Change" />
              <SH k="changePercent" label="% Chg" />
              <SH k="volume" label="Volume" />
              <SH k="marketCap" label="Mkt Cap" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {sorted.map(s => (
              <tr key={s.ticker} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3">
                  <a href="#" className="font-bold text-violet-400 no-underline hover:underline">{s.ticker}</a>
                  <span className="ml-2 text-[11px] text-gray-600">{s.name}</span>
                </td>
                <td className="tabular-nums px-5 py-3 text-right font-medium text-white">
                  {s.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className={`tabular-nums px-5 py-3 text-right font-medium ${s.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}
                </td>
                <td className="tabular-nums px-5 py-3 text-right">
                  <Pill text={`${Math.abs(s.changePercent).toFixed(2)}%`} up={s.changePercent >= 0} />
                </td>
                <td className="tabular-nums px-5 py-3 text-right text-gray-600">{s.volume}</td>
                <td className="tabular-nums px-5 py-3 text-right text-gray-600">{s.marketCap}</td>
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
    <div className="rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
      <div className="border-b border-white/[0.05] px-5 py-4">
        <h2 className="text-[15px] font-bold text-white">Currency Converter</h2>
      </div>
      <div className="p-5 space-y-3.5">
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">Amount</label>
          <div className="flex overflow-hidden rounded-lg border border-white/[0.08] transition focus-within:border-violet-500/40 focus-within:ring-1 focus-within:ring-violet-500/20">
            <input type="number" value={amount} min="0" onChange={e => setAmount(e.target.value)}
              className="tabular-nums w-full px-3.5 py-2.5 text-[15px] font-bold text-white outline-none bg-white/[0.03]" />
            <select value={from} onChange={e => setFrom(e.target.value)}
              className="border-l border-white/[0.08] bg-white/[0.05] px-3 py-2.5 text-[12px] font-bold text-white outline-none">
              {currs.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <button onClick={() => { setFrom(to); setTo(from); }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-gray-500 transition hover:border-violet-500/40 hover:text-violet-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">Converted</label>
          <div className="flex overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03]">
            <div className="tabular-nums w-full px-3.5 py-2.5 text-[15px] font-bold text-white">{converted}</div>
            <select value={to} onChange={e => setTo(e.target.value)}
              className="border-l border-white/[0.08] bg-white/[0.05] px-3 py-2.5 text-[12px] font-bold text-white outline-none">
              {currs.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <p className="text-center text-[11px] text-gray-600">
          1 {from} = <span className="tabular-nums font-bold text-white">{rate}</span> {to}
          <span className="ml-1 text-[10px] text-gray-700">· Apr 1, 2026</span>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMMODITIES
───────────────────────────────────────────────────────────────────────────── */

function CommoditiesWidget() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <h2 className="text-[15px] font-bold text-white">Commodities</h2>
        <a href="#" className="text-[12px] font-medium text-violet-400 hover:text-violet-300 hover:underline transition-colors">View all ›</a>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {COMMODITIES.map(c => (
          <div key={c.name} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
            <div>
              <a href="#" className="block text-[13px] font-semibold text-white no-underline hover:text-violet-300 transition-colors">{c.name}</a>
              <span className="text-[11px] text-gray-600">{c.unit}</span>
            </div>
            <div className="text-right">
              <div className="tabular-nums text-[13px] font-bold text-white">${c.price}</div>
              <Pill text={c.pct} up={c.up} />
            </div>
          </div>
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
    { label: 'GDP',           value: '$4.33B',  pct: '+4.34%', up: true  },
    { label: 'Inflation',     value: '10.2%',   pct: '-0.80pp', up: true  },
    { label: 'CBL Rate',      value: '17.50%',  pct: 'Steady',  up: true  },
    { label: 'Unemployment',  value: '3.6%',    pct: '-5.26%',  up: true  },
    { label: 'Trade Balance', value: '-$0.82B', pct: '+5.75%',  up: true  },
    { label: 'Debt / GDP',    value: '55.4%',   pct: '+2.21%',  up: false },
  ];
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <h2 className="text-[15px] font-bold text-white">Economic Indicators</h2>
        <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-violet-400">Liberia</span>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {rows.map(r => (
          <div key={r.label} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
            <span className="text-[13px] text-gray-400">{r.label}</span>
            <div className="flex items-center gap-3">
              <span className="tabular-nums text-[13px] font-bold text-white">{r.value}</span>
              <span className={`tabular-nums text-[11px] font-semibold ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>{r.pct}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.05] px-5 py-2.5">
        <span className="text-[10px] text-gray-700">Sources: CBL · World Bank · IMF · Updated Apr 1, 2026</span>
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
      <SectionHeading title="Videos" action="#" actionLabel="View more" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {VIDEOS.map((v, i) => (
          <div key={i} className="group flex gap-3.5 cursor-pointer">
            <div className="relative shrink-0 overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.thumb} alt="" className="h-[76px] w-[120px] object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                  <svg className="h-3 w-3 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white tabular-nums">{v.duration}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-white group-hover:text-violet-300 transition-colors">{v.title}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px]">
                <span className="text-gray-600">{v.source}</span>
                <span className="text-gray-700">·</span>
                <span className="text-gray-600">{v.time}</span>
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
      <div className="border-b border-white/[0.05] bg-gradient-to-r from-violet-950/30 via-[#141418] to-violet-950/30 px-5 py-10">
        <div className="mx-auto max-w-[1320px] flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-white">TrueRate Daily Brief</h3>
            <p className="mt-1 text-[14px] text-gray-500">Business and economy news from Liberia, delivered daily</p>
          </div>
          <div className="flex w-full max-w-[420px] gap-2.5">
            <input type="email" placeholder="Email address"
              className="flex-1 rounded-lg bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-[13px] text-white placeholder:text-gray-600 outline-none focus:border-violet-500/40 transition-colors" />
            <button className="shrink-0 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3 text-[13px] font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:brightness-110 transition">
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
                  <li key={l}><a href="#" className="text-[13px] text-gray-600 hover:text-violet-400 no-underline transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-8 border-t border-white/[0.05] pt-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-600">Trending topics</p>
          <div className="flex flex-wrap gap-2">
            {trending.map(t => (
              <a key={t} href="#" className="rounded-lg border border-white/[0.06] px-3.5 py-1.5 text-[12px] text-gray-500 hover:border-violet-500/30 hover:text-violet-400 hover:bg-violet-500/5 transition-all no-underline">{t}</a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-6">
          <div className="flex flex-wrap gap-x-5 gap-y-1 mb-3">
            {['Data Disclaimer', 'Help', 'Feedback', 'Sitemap', 'Terms and Privacy Policy', 'Privacy Dashboard'].map(l => (
              <a key={l} href="#" className="text-[11px] text-gray-700 hover:text-violet-400 no-underline transition-colors">{l}</a>
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
   PAGE
───────────────────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0e0e11]">
      <Header />
      <IndicatorsStrip />

      <main className="mx-auto max-w-[1320px] px-5 py-6">

        {/* 4-column news layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-5 mb-10">

          {/* News list — col 1-3 on desktop, 2nd on mobile */}
          <div className="order-2 lg:order-1 lg:col-span-3">
            <NewsListColumn />
          </div>

          {/* Featured — col 4-8 on desktop, 1st on mobile */}
          <div className="order-1 lg:order-2 lg:col-span-5 lg:border-l lg:border-white/[0.05] lg:pl-5">
            <FeaturedColumn />
          </div>

          {/* Latest — col 9-10 */}
          <div className="order-3 lg:col-span-2 lg:border-l lg:border-white/[0.05] lg:pl-5">
            <LatestColumn />
          </div>

          {/* Sidebar — col 11-12 */}
          <div className="order-4 lg:col-span-2 lg:border-l lg:border-white/[0.05] lg:pl-5 flex flex-col gap-4">
            <TrendingWidget />
          </div>

        </div>

        {/* Videos */}
        <div className="mb-10 border-t border-white/[0.05] pt-7">
          <VideosSection />
        </div>

        {/* Business data */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start border-t border-white/[0.05] pt-7">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <BusinessOverview />
            <KeySectorsWidget />
          </div>
          <aside className="flex w-full shrink-0 flex-col gap-5 lg:w-[340px]">
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
