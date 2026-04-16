'use client';

import Link from 'next/link';
import { useState } from 'react';
import { newsItems } from '@/data/news';
import { getCatColor } from '@/lib/category-colors';

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */


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


// ── Category visuals imported from shared component ───────────────────────────
const CAT_STYLE: Record<string, { bg: string; accent: string; label: string }> = {
  policy:         { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',   accent: 'text-slate-300',   label: 'Policy' },
  forex:          { bg: 'bg-gradient-to-br from-emerald-950 to-[#050f08]', accent: 'text-emerald-400', label: 'Forex' },
  economy:        { bg: 'bg-gradient-to-br from-blue-950 to-[#04060f]',    accent: 'text-blue-300',    label: 'Economy' },
  commodities:    { bg: 'bg-gradient-to-br from-orange-950 to-[#100700]',  accent: 'text-orange-300',  label: 'Commodities' },
  Mining:         { bg: 'bg-gradient-to-br from-orange-950 to-[#100700]',  accent: 'text-orange-300',  label: 'Mining' },
  Banking:        { bg: 'bg-gradient-to-br from-emerald-950 to-[#050f08]', accent: 'text-emerald-400', label: 'Banking' },
  Agriculture:    { bg: 'bg-gradient-to-br from-lime-950 to-[#060e00]',    accent: 'text-lime-400',    label: 'Agriculture' },
  Energy:         { bg: 'bg-gradient-to-br from-yellow-950 to-[#0f0b00]',  accent: 'text-yellow-300',  label: 'Energy' },
  Trade:          { bg: 'bg-gradient-to-br from-purple-950 to-[#07000f]',  accent: 'text-purple-300',  label: 'Trade' },
  Tech:           { bg: 'bg-gradient-to-br from-sky-950 to-[#030a12]',     accent: 'text-sky-300',     label: 'Tech' },
  Analysis:       { bg: 'bg-gradient-to-br from-indigo-950 to-[#04000f]',  accent: 'text-indigo-300',  label: 'Analysis' },
  Development:    { bg: 'bg-gradient-to-br from-teal-950 to-[#030f0b]',    accent: 'text-teal-300',    label: 'Development' },
  Infrastructure: { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',   accent: 'text-slate-300',   label: 'Infrastructure' },
  Policy:         { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',   accent: 'text-slate-300',   label: 'Policy' },
  'Monetary Policy': { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]', accent: 'text-slate-300', label: 'Monetary Policy' },
};
function getCatStyle(cat: string) {
  return CAT_STYLE[cat] ?? CAT_STYLE['economy'];
}

/** Replaces random stock photo thumbnails with intentional category treatments */
function NewsThumbnail({ category, className }: { category: string; className: string }) {
  const s = getCatStyle(category);
  return (
    <div className={`relative overflow-hidden ${s.bg} ${className}`}>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
    </div>
  );
}
/** Large hero visual — replaces the big top-of-page stock photo */
function HeroVisual({ category }: { category: string }) {
  const s = getCatStyle(category);
  return (
    <div className={`w-full h-[200px] sm:h-[260px] relative overflow-hidden ${s.bg}`}>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
    </div>
  );
}
/** Video thumbnail — category-gradient with centred play button */
function VideoThumbnail({ category }: { category: string }) {
  const s = getCatStyle(category);
  return (
    <div className={`relative w-full h-[220px] overflow-hidden flex items-center justify-center ${s.bg}`}>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-2xl">
        <svg className="h-5 w-5 translate-x-0.5 text-[#0a0a0d]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}

const LATEST_NEWS = [
  { href: '/news/1',  title: "CBL Ready to Defend the LRD If It Breaches 195 — Governor Signals Intervention Threshold", source: 'TrueRate', time: '16m ago', tags: ['Monetary Policy'], chips: [{ label: 'CBL Rate', pct: 'Steady', up: true }, { label: 'LRD/USD', pct: '+0.65%', up: true }] },
  { href: '/news/30', title: "Liberia Petroleum Refining Corp Posts 12% Revenue Gain — First Quarterly Growth in Three Years", source: 'Daily Observer', time: '23m ago', tags: ['Energy'], chips: [{ label: 'Energy', pct: '+12%', up: true }] },
  { href: '/news/3',  title: "ArcelorMittal Ships First Expanded-Capacity Ore Batch — The Nimba Ramp-Up Has Officially Begun", source: 'Bloomberg', time: '46m ago', tags: ['Mining'], chips: [{ label: 'Iron Ore', pct: '-2.08%', up: false }, { label: 'Gold', pct: '+0.82%', up: true }] },
  { href: '/news/16', title: "World Bank Approves $45M Grant for Liberia — Here's Exactly Where the Money Will Go", source: 'World Bank', time: '59m ago', tags: ['Development'], chips: [] },
  { href: '/news/12', title: "Ecobank Transnational Raises Its Dividend After the Strongest West Africa Quarter in Five Years", source: 'FrontPage Africa', time: '1h ago', tags: ['Banking'], chips: [{ label: 'Ecobank', pct: '+3.1%', up: true }] },
  { href: '/news/11', title: "Liberia Joins the ECOWAS Digital Payments Corridor — What It Means for Cross-Border Commerce", source: 'Liberian Observer', time: '1h ago', tags: ['Trade'], chips: [{ label: 'LRD/USD', pct: '+0.65%', up: true }] },
  { href: '/news/5',  title: "Firestone's Harbel Plantation Just Had Its Best Quarter in a Decade. The Replanting Strategy Worked.", source: 'The New Dawn', time: '3h ago', tags: ['Agriculture'], chips: [{ label: 'Rubber', pct: '+2.38%', up: true }] },
  { href: '/news/8',  title: "The IMF Praised Liberia's Fiscal Progress. It Also Left a Long List of Unfinished Business.", source: 'IMF / TrueRate', time: '5h ago', tags: ['Policy'], chips: [] },
];

const MORE_NEWS = [
  { href: '/news/33', category: 'Banking',        title: "Liberia's Banking Sector Grew Deposits 14% in Q1 — The Mobile Money Effect Is Real", summary: "Central Bank data points to rising household savings and first-time account openings, driven by mobile money integration and renewed business confidence in the financial system's stability.", source: 'FrontPage Africa', time: '2h ago' },
  { href: '/news/16', category: 'Infrastructure',  title: "Government Awards $120M Monrovia Ring Road Contract — AfDB Calls It 'Transformative for Freight'", summary: "The 48km road contract, backed by the African Development Bank, is expected to cut logistics costs by up to 25% and open industrial zones north of Monrovia that have been effectively inaccessible to heavy cargo.", source: 'Daily Observer', time: '3h ago' },
  { href: '/news/30', category: 'Energy',          title: "40MW of New Solar Just Got Approved for Bong and Nimba — Without a Single Dollar from LEC", summary: "The Liberia Energy Authority has cleared two privately financed solar projects that will serve the two counties simultaneously. It's a model the government should be replicating across every underserved county.", source: 'The New Dawn', time: '5h ago' },
  { href: '/news/7',  category: 'Agriculture',     title: "Palm Oil Exports Up 18% After Liberia Finally Fixed Its Farmgate Pricing. Here's the Policy That Did It.", summary: "A revised pricing scheme from the Ministry of Agriculture has moved an additional $8M annually into the hands of 12,000 smallholder farmers — and demonstrated that getting the incentives right works better than subsidies.", source: 'Liberian Observer', time: '7h ago' },
  { href: '/news/29', category: 'Trade',           title: "Liberia-EU Tariff Framework Is Agreed. A $180M Annual Trade Boost Hangs on the Final Signature.", summary: "Negotiators in Brussels reached consensus on rubber, cocoa, and timber export schedules. The deal would be transformative for Liberia's export economy — but it has been 'almost agreed' before.", source: 'Reuters', time: '9h ago' },
  { href: '/news/22', category: 'Mining',          title: "Three International Firms Just Got Grand Cape Mount Exploration Licenses. The Gold Rush Is On.", summary: "240 square kilometres of prospective territory now has foreign capital behind it. Combined with Bea Mountain's 1.4M oz discovery, Grand Cape Mount County is becoming Liberia's most competitive mining frontier.", source: 'Bloomberg', time: '11h ago' },
  { href: '/news/15', category: 'Tech',            title: "PayLink Liberia Raised $4.2M to Reach 150,000 Rural Borrowers. Monrovia's Fintech Scene Is No Longer a Joke.", summary: "The Series A, led by a pan-African VC, will fund USSD-based credit expansion into Bong, Lofa, and Nimba counties — populations that traditional banks have written off for decades.", source: 'TechCabal', time: '13h ago' },
  { href: '/news/31', category: 'Policy',          title: "The Finance Ministry's Revised Budget Has $62M More for Capital Spending — and Nobody Is Asking Where It Came From", summary: "A 12% uplift in capital expenditure sounds like good news. But the supplementary budget's revenue assumptions rely on customs projections that are tracking below target. Analysts are concerned.", source: 'Daily Observer', time: '15h ago' },
];

const QUICK_READS = [
  { href: '/news/2',  tag: 'FOREX',   headline: 'LRD/USD anchored at 192.50 — CBL has intervened twice this week to defend the floor', time: '30m' },
  { href: '/news/35', tag: 'MINING',  headline: "Nimba ships 2.1M tonnes of iron ore in Q1 — ArcelorMittal's best quarter since 2019", time: '1h' },
  { href: '/news/12', tag: 'BANKING', headline: "Ecobank opens two new branches in Lofa and Grand Bassa — the bank is going where others won't", time: '2h' },
  { href: '/news/26', tag: 'TRADE',   headline: 'Freeport throughput at a five-year high — Phase II expansion is already delivering results', time: '3h' },
  { href: '/news/30', tag: 'ENERGY',  headline: 'Paynesville power cuts eased after LEC completes long-delayed grid repair. Residents are cautiously relieved.', time: '4h' },
  { href: '/news/32', tag: 'AGRI',    headline: "Cocoa farmers are pushing for a $2.80/kg floor price. The ministry hasn't responded. Harvest is in six weeks.", time: '6h' },
];

const VIDEOS = [
  { title: "CBL Governor: 'We're Not Ready to Cut Rates. Here's What We're Waiting For.'", duration: '2:48', category: 'policy',   source: 'TrueRate', time: '55m ago' },
  { title: "ArcelorMittal's Nimba Expansion, Explained: What $120M Buys Liberia — and What It Doesn't",  duration: '1:52', category: 'Mining',    source: 'TrueRate', time: '3h ago' },
  { title: "Rubber at a Decade High: Why Liberia Is Winning — and How Long It Can Last",                  duration: '3:14', category: 'commodities', source: 'TrueRate', time: '8h ago' },
  { title: "$680M and Rising: Inside the Liberian Diaspora's Outsized Role in the National Economy",      duration: '2:31', category: 'economy',   source: 'TrueRate', time: '3h ago' },
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


function SectionHeading({ title, action, actionLabel = 'View all' }: { title: string; action?: string; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[17px] font-bold text-white tracking-tight">{title}</h2>
      {action && <a href={action} className="text-[12px] font-medium text-white hover:text-white/70 hover:underline transition-colors">{actionLabel} ›</a>}
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   ECONOMIC INDICATORS STRIP
───────────────────────────────────────────────────────────────────────────── */


function IndicatorsStrip() {
  return (
    <div className="bg-brand-dark border-b border-white/[0.05]">
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

        {/* Desktop: same scrolling marquee as mobile */}
        <div className="hidden sm:block overflow-hidden">
          <div className="ticker-scroll flex">
            {[...INDICATORS, ...INDICATORS].map((item, i) => (
              <div key={i} className="shrink-0 flex flex-col px-5 py-2.5 border-r border-white/[0.07]">
                <span className="text-[13px] font-semibold text-white whitespace-nowrap">{item.label}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="tabular-nums text-[13px] text-gray-400 whitespace-nowrap">{item.value}</span>
                  <span className={`flex items-center gap-0.5 tabular-nums text-[12px] font-bold whitespace-nowrap ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {item.up ? '▲' : '▼'}{item.pct}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
  const subs = [newsItems[1], newsItems[2], newsItems[3], newsItems[4]];

  return (
    <div className="flex flex-col gap-0">

      {/* ── Cover Story Hero ── */}
      <Link href={`/news/${featured.id}`} className="group block no-underline">
        {/* Visual */}
        <div className="overflow-hidden -mx-2 sm:mx-0 rounded-none sm:rounded-xl mb-4">
          <HeroVisual category={featured.category} />
        </div>

        {/* Kicker */}
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-brand-accent text-[#050d11]">
            Cover Story
          </span>
          <span className={`text-[11px] font-bold uppercase tracking-widest ${getCatColor(featured.category)}`}>
            {featured.category}
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-[22px] sm:text-[26px] font-black leading-tight text-white group-hover:text-white/80 transition-colors mb-2.5 tracking-tight">
          {featured.title}
        </h2>

        {/* Deck */}
        <p className="font-montserrat line-clamp-3 text-[14px] leading-relaxed text-gray-400 mb-3">
          {featured.summary}
        </p>

        {/* Byline */}
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <span className="font-semibold text-gray-400">{featured.source}</span>
          <span>·</span>
          <span>{timeAgo(featured.date)}</span>
          <span>·</span>
          <span>8 min read</span>
        </div>
      </Link>

      {/* ── Sub-stories grid ── */}
      <div className="mt-6 border-t border-white/[0.06] pt-5 flex flex-col divide-y divide-white/[0.06]">
        {subs.map((item) => (
          <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-3.5 py-4 first:pt-0 no-underline">
            <div className="shrink-0 overflow-hidden rounded-lg">
              <NewsThumbnail category={item.category} className="h-[72px] w-[108px]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className={`text-[10px] font-bold uppercase tracking-wide ${getCatColor(item.category)} mb-1 block`}>
                {item.category}
              </span>
              <h3 className="text-[13px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3">
                {item.title}
              </h3>
              <div className="mt-1.5 text-[11px] text-gray-500">{item.source} · {timeAgo(item.date)}</div>
            </div>
          </Link>
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
      {items.map((item) => (
        <article key={item.id} className="group flex gap-3.5 py-4 first:pt-0 cursor-pointer">
          <div className="overflow-hidden rounded-xl shrink-0">
            <NewsThumbnail category={item.category} className="h-[90px] w-[130px]" />
          </div>
          <div className="min-w-0 flex-1">
            {item.category && <p className={`mb-1 text-[11px] font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>{item.category}</p>}
            <h3 className="line-clamp-3 text-[14px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors">
              <Link href={`/news/${item.id}`} className="no-underline">{item.title}</Link>
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
          <Link key={i} href={item.href} className="flex gap-3.5 py-4 first:pt-0 no-underline group">
            {/* Thumbnail */}
            <div className="shrink-0 overflow-hidden rounded-xl">
              <NewsThumbnail category={item.tags?.[0] ?? 'economy'} className="h-[90px] w-[130px]" />
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-bold leading-snug text-white line-clamp-3 group-hover:text-white/80 transition-colors">{item.title}</h3>
              <p className="mt-1 text-[12px] text-gray-500">{item.source} · {item.time}</p>
              {item.chips.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {item.chips.map(chip => (
                    <span key={chip.label} className="text-[11px] text-gray-400">
                      {chip.label} <span className={chip.up ? 'text-emerald-400' : 'text-red-400'}>{chip.pct}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR: TRENDING
───────────────────────────────────────────────────────────────────────────── */




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
    <div className="rounded-xl border border-white/[0.06] bg-brand-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-bold text-white">Exchange Rates</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Liberian Dollar (LRD) · CBL · Apr 3, 2026</p>
        </div>
        <Link href="/forex" className="text-[12px] text-white/50 hover:text-white transition-colors no-underline">Converter ›</Link>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {FX_RATES.map(r => (
          <Link key={r.pair} href="/forex" className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-white tabular-nums">{r.pair}</div>
              <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{r.note}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[14px] font-bold text-white tabular-nums">{r.rate}</div>
              <div className={`text-[12px] font-semibold tabular-nums ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>{r.up ? '+' : ''}{r.change}</div>
            </div>
          </Link>
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
    <div className="rounded-xl border border-white/[0.06] bg-brand-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-bold text-white">Commodities</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Liberia-relevant · Apr 3, 2026</p>
        </div>
        <Link href="/commodities" className="text-[12px] text-white/50 hover:text-white transition-colors no-underline">All ›</Link>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {COMMODITIES_WITH_CONTEXT.map(c => (
          <Link key={c.name} href="/commodities" className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-white">{c.name} <span className="text-[11px] font-normal text-gray-400">{c.unit}</span></div>
              <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{c.note}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[13px] font-bold text-white tabular-nums">${c.price}</div>
              <div className={`text-[12px] font-semibold tabular-nums ${c.up ? 'text-emerald-400' : 'text-red-400'}`}>{c.pct}</div>
            </div>
          </Link>
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
    <div className="rounded-xl border border-white/[0.06] bg-brand-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-bold text-white">Liberia at a Glance</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Key indicators · Sources: CBL, World Bank, IMF</p>
        </div>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {rows.map(r => (
          <Link key={r.label} href="/economy" className="flex items-start gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-white">{r.label}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{r.note}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="tabular-nums text-[13px] font-bold text-white">{r.value}</div>
              <div className={`tabular-nums text-[12px] font-semibold ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>{r.pct}</div>
            </div>
          </Link>
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
        <h2 className="text-[17px] font-bold text-white tracking-tight">Today&apos;s Videos</h2>
        <Link href="/videos" className="rounded-lg border border-white/20 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-white/[0.06] transition-colors no-underline">Explore More</Link>
      </div>
      {/* Card */}
      <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-brand-card">
        {/* Thumbnail */}
        <div className="relative cursor-pointer group">
          <VideoThumbnail category={v.category} />
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <span className="tabular-nums text-[14px] font-bold text-white/80 drop-shadow">{v.duration}</span>
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


/* ─────────────────────────────────────────────────────────────────────────────
   DEEP READS (center column filler)
───────────────────────────────────────────────────────────────────────────── */

const DEEP_READS = [
  { href: '/news/4',  category: 'Analysis',     title: "4.5% Growth Is the Headline. The Structural Weakness Underneath It Is the Story.", summary: "Liberia's GDP numbers look good on paper — but the economy is still running on two commodities. Economists say that without a services and manufacturing base, every growth forecast comes with an asterisk.", source: 'TrueRate Analysis', time: '1h ago', large: true },
  { href: '/news/1',  category: 'Policy',       title: "The CBL Held Rates Again. Was That the Right Call?", summary: "Inflation is falling and reserves are at a 13-year high. The case for an easing cycle is getting harder to ignore — but the CBL Governor is watching the LRD and the food price index more closely than the headline CPI.", source: 'Daily Observer', time: '3h ago', large: false },
  { href: '/news/11', category: 'Trade',        title: "ECOWAS Payments Integration Could Unlock $2B in Trade. Liberia Has the Most to Gain.", summary: "A World Bank assessment puts Liberian cross-border exporters at the top of the beneficiary list. The corridor is live — the question is whether Liberian businesses are ready to use it.", source: 'World Bank', time: '6h ago', large: false },
  { href: '/news/35', category: 'Mining',       title: "The $320M Annual Revenue Case for ArcelorMittal's Nimba Expansion", summary: "Full ramp-up at the expanded Nimba operation would add $320M to Liberia's export ledger and create 1,800 permanent jobs. The caveat: it depends on iron ore staying above $100/t.", source: 'Bloomberg', time: '8h ago', large: false },
  { href: '/news/15', category: 'Banking',      title: "How Mobile Money Is Quietly Rebuilding Liberia's Financial System From the Ground Up", summary: "Smartphone penetration above 60%. Orange Money at 1M users. LiberBank's fintech pivot. The unbanked population is shrinking — faster than any policy has achieved.", source: 'FrontPage Africa', time: '10h ago', large: false },
  { href: '/news/27', category: 'Agriculture',  title: "Liberia Has Everything It Takes to Be West Africa's Rubber Leader. Here's What's Stopping It.", summary: "Record Firestone output, rising global prices, a replanting fund. The ingredients are there. But port delays, land tenure disputes, and aging infrastructure keep the ceiling lower than it should be.", source: 'TrueRate Analysis', time: '12h ago', large: false },
  { href: '/news/8',  category: 'Development',  title: "The Next IMF Tranche Is Coming. What Liberia Promised — and What It Still Owes.", summary: "The Fund praised revenue reforms. It also flagged public wage bill creep, off-budget spending, and a procurement regime that still has too many loopholes. The $38M disbursement comes with conditions.", source: 'IMF / TrueRate', time: '1d ago', large: false },
];

const MOST_READ = [
  { rank: 1, href: '/news/1',  title: "The Man Who Holds Liberia's Interest Rates — And Why He's Not Moving Them", source: 'TrueRate Analysis', time: '2h ago' },
  { rank: 2, href: '/news/3',  title: "ArcelorMittal's Nimba Ramp-Up Has Officially Begun — First Expanded-Capacity Batch Shipped", source: 'Bloomberg', time: '46m ago' },
  { rank: 3, href: '/news/5',  title: "How Firestone Turned Harbel Into Africa's Most Productive Rubber Estate", source: 'TrueRate', time: '8h ago' },
  { rank: 4, href: '/news/16', title: "The World Bank Is Pouring $45M Into Liberia's Roads. Here's Exactly Where It Goes.", source: 'World Bank', time: '59m ago' },
  { rank: 5, href: '/news/11', title: "West Africa's Cross-Border Payment Revolution Is Live — And Liberia Has a Seat at the Table", source: 'Liberian Observer', time: '1h ago' },
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
        <Link href="/news" className="text-[12px] text-white/50 hover:text-white transition-colors no-underline">More ›</Link>
      </div>
      {/* Lead story */}
      <Link href={lead.href} className="group block no-underline mb-5">
        <div className="overflow-hidden rounded-xl mb-3">
          <NewsThumbnail category={lead.category} className="w-full h-[180px]" />
        </div>
        <div className={`text-[11px] font-bold uppercase tracking-wide ${getCatColor(lead.category)} mb-1.5`}>{lead.category}</div>
        <h3 className="text-[15px] font-bold leading-snug text-white group-hover:text-white/80 transition-colors mb-2">{lead.title}</h3>
        <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-3">{lead.summary}</p>
        <div className="mt-2 text-[11px] text-gray-500">{lead.source} · {lead.time}</div>
      </Link>
      {/* Remaining stories */}
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {rest.map((item, i) => (
          <Link key={i} href={item.href} className="group flex gap-3.5 py-4 first:pt-0 no-underline">
            <div className="min-w-0 flex-1">
              <div className={`text-[11px] font-bold uppercase tracking-wide ${getCatColor(item.category)} mb-1`}>{item.category}</div>
              <h3 className="text-[13px] font-bold leading-snug text-white group-hover:text-white/80 transition-colors mb-1.5">{item.title}</h3>
              <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-2">{item.summary}</p>
              <div className="mt-1.5 text-[11px] text-gray-500">{item.source} · {item.time}</div>
            </div>
            <div className="shrink-0 overflow-hidden rounded-lg">
              <NewsThumbnail category={item.category} className="h-[72px] w-[108px]" />
            </div>
          </Link>
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
        <Link key={i} href={item.href} className="group flex gap-4 py-4 first:pt-0 no-underline">
          <div className="min-w-0 flex-1">
            <div className={`text-[11px] font-bold uppercase tracking-wide ${getCatColor(item.category)} mb-1`}>{item.category}</div>
            <h3 className="text-[14px] font-bold leading-snug text-white group-hover:text-white/80 transition-colors mb-1.5">{item.title}</h3>
            <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-2">{item.summary}</p>
            <div className="mt-2 text-[11px] text-gray-500">{item.source} · {item.time}</div>
          </div>
          <div className="shrink-0 overflow-hidden rounded-lg">
            <NewsThumbnail category={item.category} className="h-[72px] w-[108px]" />
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR: LATEST + IN FOCUS
───────────────────────────────────────────────────────────────────────────── */

const SIDEBAR_LATEST = [
  { href: '/news/1',  time: '2h',  headline: "CBL Governor signals intervention if LRD breaches 195 — the threshold that matters" },
  { href: '/news/3',  time: '4h',  headline: "ArcelorMittal's first expanded-capacity Nimba shipment is out — the ramp-up is real" },
  { href: '/news/16', time: '6h',  headline: "$45M World Bank road grant approved — 320km of feeder roads connecting farm to market" },
  { href: '/news/5',  time: '8h',  headline: "Firestone's decade-best quarter: the replanting strategy that took 10 years to pay off" },
  { href: '/news/12', time: '10h', headline: "Ecobank raises its dividend — the bank's best West Africa result in five years" },
  { href: '/news/11', time: '12h', headline: "Liberia is live on the ECOWAS payments corridor — what cross-border traders need to know" },
  { href: '/news/8',  time: '14h', headline: "The IMF's Liberia review: what it praised, what it flagged, and what it left unsaid" },
  { href: '/news/7',  time: '21h', headline: "Palm oil margins squeezed by Southeast Asian supply — Liberian smallholders absorb the shock" },
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
          <Link href="/news" className="text-[12px] text-white/50 hover:text-white transition-colors no-underline">See all latest ›</Link>
        </div>
        <div className="flex flex-col divide-y divide-white/[0.05]">
          {SIDEBAR_LATEST.map((item, i) => (
            <Link key={i} href={item.href} className="flex gap-3 py-3 first:pt-0 no-underline group">
              <span className="shrink-0 tabular-nums text-[12px] text-gray-400 w-8 pt-0.5">{item.time}</span>
              <span className="text-[13px] font-medium leading-snug text-white/80 group-hover:text-white transition-colors">{item.headline}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* In Focus */}
      <div className="border-t border-white/[0.05] pt-5">
        <h2 className="text-[15px] font-bold text-white mb-3">In Focus</h2>
        <div className="flex flex-wrap gap-2">
          {IN_FOCUS_TOPICS.map(t => (
            <Link key={t} href="/news" className="rounded-lg border border-white/20 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-white/[0.06] transition-colors no-underline">
              {t}
            </Link>
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
        <Link href="/news" className="text-[12px] font-medium text-white/50 hover:text-white transition-colors no-underline">More ›</Link>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {QUICK_READS.map((item, i) => (
          <Link key={i} href={item.href} className="flex items-start gap-3 py-3.5 first:pt-0 no-underline group">
            <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-white/[0.06] ${getCatColor(item.tag)}`}>
              {item.tag}
            </span>
            <span className="flex-1 text-[13px] font-medium leading-snug text-white/80 group-hover:text-white transition-colors line-clamp-2">
              {item.headline}
            </span>
            <span className="shrink-0 tabular-nums text-[11px] text-gray-400 pt-0.5">{item.time}</span>
          </Link>
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
        <Link href="/news" className="text-[12px] text-white/50 hover:text-white transition-colors no-underline">See all ›</Link>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {MOST_READ.map(item => (
          <Link key={item.rank} href={item.href} className="flex items-start gap-3.5 py-3 first:pt-0 no-underline group">
            <span className="shrink-0 tabular-nums text-[22px] font-black text-white/10 leading-none w-6 pt-0.5">{item.rank}</span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-snug text-white/80 group-hover:text-white transition-colors line-clamp-2">{item.title}</p>
              <p className="mt-1 text-[11px] text-gray-400">{item.source} · {item.time}</p>
            </div>
          </Link>
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
          <Link key={i} href="/economy" className="flex items-start gap-3 no-underline group">
            <div className="shrink-0 rounded-lg bg-white/[0.05] border border-white/[0.06] px-2 py-1.5 text-center min-w-[46px]">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{ev.date.split(' ')[0]}</p>
              <p className="text-[15px] font-black text-white leading-none">{ev.date.split(' ')[1]}</p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold leading-snug text-white/80 group-hover:text-white transition-colors">{ev.label}</p>
              <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-white/[0.06] ${getCatColor(ev.type)}`}>{ev.type}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE BOTTOM TICKER BAR
───────────────────────────────────────────────────────────────────────────── */



/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen">
      <IndicatorsStrip />

      <main className="mx-auto max-w-[1320px] px-5 py-6 pb-14 sm:pb-6">

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
          <aside className="order-3 lg:col-span-3 lg:border-l lg:border-white/[0.05] lg:pl-5 lg:self-start lg:sticky lg:top-[calc(var(--header-h,124px)+16px)] lg:max-h-[calc(100vh-var(--header-h,124px)-32px)] lg:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <LatestSidebar />
          </aside>

        </div>

        {/* ── Full-width sections below the grid ── */}


        {/* Regional Spotlight */}
        <div className="mt-10 border-t border-white/[0.05] pt-8">
          <SectionHeading title="West Africa in Focus" action="/news" actionLabel="More regional news" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { country: 'Ghana',         headline: "Ghana cedi at a six-month high — and the IMF tranche is only part of the story", stat: 'GHS/USD 14.82', time: '4h ago', cat: 'forex' },
              { country: 'Nigeria',       headline: "Nigeria's bourse just had its best month in 18 years. Here's who captured the gains.", stat: 'Brent $84.20/bbl', time: '6h ago', cat: 'commodities' },
              { country: 'Sierra Leone',  headline: "Freetown's $80M port expansion is a direct challenge to Monrovia's trade lead", stat: 'SLL/USD 22,100', time: '8h ago', cat: 'Development' },
              { country: "Côte d'Ivoire", headline: "The Abidjan bourse outperformed every regional peer in Q1. These are the stocks that led.", stat: 'BRVM Index +3.4%', time: '10h ago', cat: 'economy' },
            ].map((r, i) => (
              <Link key={i} href="/news" className="group flex flex-col no-underline overflow-hidden rounded-xl border border-white/[0.07] bg-brand-card hover:border-white/20 transition-colors">
                <div className="overflow-hidden">
                  <NewsThumbnail category={r.cat} className="w-full h-[120px]" />
                </div>
                <div className="p-3 flex-1">
                  <div className="mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-white/50">{r.country}</span>
                  </div>
                  <h3 className="text-[12px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-2">{r.headline}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white/50 tabular-nums">{r.stat}</span>
                    <span className="text-[10px] text-gray-400">{r.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>


        {/* Trending Topics */}
        <div className="mt-8 border-t border-white/[0.05] pt-8 pb-4">
          <h2 className="text-[15px] font-bold text-white mb-3">Topics</h2>
          <div className="flex flex-wrap gap-2">
            {['Iron Ore', 'LRD/USD', 'CBL Rate', 'Rubber Prices', 'ECOWAS Trade', 'Liberia GDP', 'Diaspora Remittances', 'Mining Policy', 'Inflation', 'Gold Prices', 'Firestone', 'ArcelorMittal', 'World Bank', 'IMF Program', 'Port of Monrovia', 'Ecobank', 'Mobile Money'].map(t => (
              <Link key={t} href="/news" className="rounded-lg border border-white/20 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-white/[0.06] transition-colors no-underline">{t}</Link>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}
