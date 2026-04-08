'use client';

import Link from 'next/link';
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


const NEWS_IMGS = [
  'https://picsum.photos/seed/cbl-rate/800/420',
  'https://picsum.photos/seed/lrd-currency/200/120',
  'https://picsum.photos/seed/iron-ore/200/120',
  'https://picsum.photos/seed/road-infra/200/120',
  'https://picsum.photos/seed/ecobank/200/120',
  'https://picsum.photos/seed/digital-pay/200/120',
  'https://picsum.photos/seed/rubber-farm/200/120',
  'https://picsum.photos/seed/imf-policy/200/120',
];

const LATEST_NEWS = [
  { title: 'CBL signals readiness to intervene if LRD weakens past 195', source: 'Reuters', time: '16m ago', tags: ['Monetary Policy'], img: 'https://picsum.photos/seed/ln-cbl/300/200', chips: [{ label: 'CBL Rate', pct: 'Steady', up: true }, { label: 'LRD/USD', pct: '+0.65%', up: true }] },
  { title: 'Liberia Petroleum Refining Corp reports Q1 revenue rise of 12%', source: 'Daily Observer', time: '23m ago', tags: ['Energy', '+12%'], img: 'https://picsum.photos/seed/ln-petro/300/200', chips: [{ label: 'Energy', pct: '+12%', up: true }] },
  { title: 'ArcelorMittal Liberia ships first expanded-capacity iron ore batch', source: 'Bloomberg', time: '46m ago', tags: ['Mining'], img: 'https://picsum.photos/seed/ln-ironore/300/200', chips: [{ label: 'Iron Ore', pct: '-2.08%', up: false }, { label: 'Gold', pct: '+0.82%', up: true }] },
  { title: 'World Bank approves $45M grant for Liberia infrastructure bonds', source: 'World Bank', time: '59m ago', tags: ['Development'], img: 'https://picsum.photos/seed/ln-bridge/300/200', chips: [] },
  { title: 'Ecobank Transnational raises dividend after strong West Africa quarter', source: 'FrontPage Africa', time: '1h ago', tags: ['Banking'], img: 'https://picsum.photos/seed/ln-ecobank/300/200', chips: [{ label: 'Ecobank', pct: '+3.1%', up: true }] },
  { title: 'Liberia joins ECOWAS digital payments pilot with 5 other nations', source: 'Liberian Observer', time: '1h ago', tags: ['Trade'], img: 'https://picsum.photos/seed/ln-ecowas/300/200', chips: [{ label: 'LRD/USD', pct: '+0.65%', up: true }] },
  { title: 'Firestone Liberia rubber output hits decade high on favorable weather', source: 'The New Dawn', time: '3h ago', tags: ['Agriculture'], img: 'https://picsum.photos/seed/ln-rubber/300/200', chips: [{ label: 'Rubber', pct: '+2.38%', up: true }] },
  { title: 'IMF praises Liberia fiscal consolidation, urges revenue reform', source: 'IMF', time: '5h ago', tags: ['Policy'], img: 'https://picsum.photos/seed/ln-imf/300/200', chips: [] },
];

const MORE_NEWS = [
  { category: 'Banking', title: 'Liberia\'s banking sector sees 14% deposit growth in Q1 2026', summary: 'Central Bank data shows rising household savings and business deposits, driven by mobile money adoption and renewed investor confidence.', source: 'FrontPage Africa', time: '2h ago', img: 'https://picsum.photos/seed/mn-banking/200/120' },
  { category: 'Infrastructure', title: 'Government awards $120M contract for Monrovia ring road expansion', summary: 'The contract, funded by the African Development Bank, covers 48km of new road and is expected to cut freight costs by up to 25%.', source: 'Daily Observer', time: '3h ago', img: 'https://picsum.photos/seed/mn-road/200/120' },
  { category: 'Energy', title: 'Liberia Energy Authority approves two new solar projects totaling 40MW', summary: 'The projects, led by a consortium of West African investors, will serve Bong and Nimba counties and reduce reliance on diesel generators.', source: 'The New Dawn', time: '5h ago', img: 'https://picsum.photos/seed/mn-solar/200/120' },
  { category: 'Agriculture', title: 'Palm oil exports up 18% — smallholders benefit from new pricing policy', summary: 'A revised farmgate pricing scheme introduced by the Ministry of Agriculture has boosted incomes for over 12,000 smallholder farmers.', source: 'Liberian Observer', time: '7h ago', img: 'https://picsum.photos/seed/mn-palmoil/200/120' },
  { category: 'Trade', title: 'Liberia-EU trade deal talks advance as both sides agree on tariff framework', summary: 'Negotiations in Brussels produced a draft tariff schedule covering rubber, cocoa and timber exports, potentially boosting annual trade by $180M.', source: 'Reuters', time: '9h ago', img: 'https://picsum.photos/seed/mn-port/200/120' },
  { category: 'Mining', title: 'Gold exploration licenses issued for Grand Cape Mount region', summary: 'Three international mining firms have been granted exploration licenses covering 240 square kilometers in Grand Cape Mount County.', source: 'Bloomberg', time: '11h ago', img: 'https://picsum.photos/seed/mn-gold/200/120' },
  { category: 'Tech', title: 'Monrovia fintech startup raises $4.2M Series A to expand mobile lending', summary: 'PayLink Liberia plans to use the funding to reach 150,000 new borrowers across rural counties through its USSD-based lending platform.', source: 'TechCabal', time: '13h ago', img: 'https://picsum.photos/seed/mn-fintech/200/120' },
  { category: 'Policy', title: 'Finance Ministry tables revised budget with 12% increase in capital spending', summary: 'The supplementary budget allocates an additional $62M to infrastructure, health and education, funded partly by improved revenue collection.', source: 'Daily Observer', time: '15h ago', img: 'https://picsum.photos/seed/mn-budget/200/120' },
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
  { title: "CBL Governor on rate outlook: 'We're watching food prices closely'", duration: '2:48', thumb: 'https://picsum.photos/seed/vid-cbl/320/180', source: 'TrueRate', time: '55m ago' },
  { title: 'ArcelorMittal Nimba expansion — what it means for Liberia GDP', duration: '1:52', thumb: 'https://picsum.photos/seed/vid-nimba/320/180', source: 'TrueRate', time: '3h ago' },
  { title: 'Rubber prices surge: how Liberia benefits from record output', duration: '3:14', thumb: 'https://picsum.photos/seed/vid-rubber/320/180', source: 'TrueRate', time: '8h ago' },
  { title: 'Diaspora remittances hit $680M — a new record for Liberia', duration: '2:31', thumb: 'https://picsum.photos/seed/vid-remit/320/180', source: 'TrueRate', time: '3h ago' },
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
  const sub1 = newsItems[1];
  const sub2 = newsItems[2];

  return (
    <div className="flex flex-col gap-5">
      {/* Hero article */}
      <article className="group cursor-pointer">
        {/* Edge-to-edge image on mobile, rounded on desktop */}
        <div className="overflow-hidden -mx-4 sm:mx-0 sm:rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={NEWS_IMGS[0]} alt={featured.title} className="w-full h-[200px] sm:h-[260px] object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="mt-3">
          <h2 className="text-[20px] sm:text-[24px] font-bold leading-snug text-white text-center sm:text-left group-hover:text-white/80 transition-colors mb-2">
            <Link href={`/news/${featured.id}`} className="no-underline">{featured.title}</Link>
          </h2>
          <p className="line-clamp-2 text-[14px] leading-relaxed text-gray-400 text-center sm:text-left">{featured.summary}</p>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2">
            <span className="text-[12px] text-gray-500">{featured.source}</span>
            <span className="text-gray-700">·</span>
            <span className="text-[12px] text-gray-500">{timeAgo(featured.date)}</span>
          </div>
        </div>
      </article>

      {/* Two sub-articles */}
      <div className="border-t border-white/[0.06] pt-5 flex flex-col sm:grid sm:grid-cols-2 gap-4">
        {[sub1, sub2].map((item, i) => (
          <article key={item.id} className="group cursor-pointer flex gap-3.5 sm:block">
            <div className="flex-1 min-w-0 order-1 sm:order-none">
              <h3 className="sm:mt-2.5 line-clamp-3 text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors">
                <Link href={`/news/${item.id}`} className="no-underline">{item.title}</Link>
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
                <Link href={`/news/${item.id}`} className="no-underline">{item.title}</Link>
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
          <Link key={i} href="/news" className="flex gap-3.5 py-4 first:pt-0 no-underline group">
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
        <Link href="/economy" className="text-[12px] font-medium text-white/50 hover:text-white transition-colors no-underline">Full table ›</Link>
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
                  <Link href="/economy" className="text-[12px] font-bold text-white no-underline">{s.ticker}</Link>
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
        <Link href="/forex" className="text-[12px] text-white/50 hover:text-white transition-colors no-underline">Converter ›</Link>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {FX_RATES.map(r => (
          <Link key={r.pair} href="/forex" className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-white tabular-nums">{r.pair}</div>
              <div className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">{r.note}</div>
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
    <div className="rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-bold text-white">Commodities</h2>
          <p className="text-[11px] text-gray-600 mt-0.5">Liberia-relevant · Apr 3, 2026</p>
        </div>
        <Link href="/economy" className="text-[12px] text-white/50 hover:text-white transition-colors no-underline">All ›</Link>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {COMMODITIES_WITH_CONTEXT.map(c => (
          <Link key={c.name} href="/economy" className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-white">{c.name} <span className="text-[11px] font-normal text-gray-600">{c.unit}</span></div>
              <div className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">{c.note}</div>
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
    <div className="rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-bold text-white">Liberia at a Glance</h2>
          <p className="text-[11px] text-gray-600 mt-0.5">Key indicators · Sources: CBL, World Bank, IMF</p>
        </div>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {rows.map(r => (
          <Link key={r.label} href="/economy" className="flex items-start gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-white">{r.label}</div>
              <div className="text-[11px] text-gray-600 mt-0.5">{r.note}</div>
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
    img: 'https://picsum.photos/seed/dr-gdp/400/220',
    large: true,
  },
  {
    category: 'Policy',
    title: 'CBL\'s rate hold: prudent caution or missed opportunity?',
    summary: 'With inflation easing to 10.2%, some economists argue the Central Bank has room to cut. Others say the LRD remains too vulnerable.',
    source: 'Daily Observer',
    time: '3h ago',
    img: 'https://picsum.photos/seed/dr-cbl/200/120',
    large: false,
  },
  {
    category: 'Trade',
    title: 'ECOWAS payments integration could unlock $2B in cross-border commerce',
    summary: 'A new digital payments corridor linking six West African nations stands to benefit Liberian exporters the most, according to a World Bank assessment.',
    source: 'World Bank',
    time: '6h ago',
    img: 'https://picsum.photos/seed/dr-ecowas/200/120',
    large: false,
  },
  {
    category: 'Mining',
    title: 'ArcelorMittal\'s Nimba expansion: Liberia\'s biggest industrial moment in a decade',
    summary: 'The expanded iron ore operation could add $320M annually to export revenues and create 1,800 permanent jobs in the region.',
    source: 'Bloomberg',
    time: '8h ago',
    img: 'https://picsum.photos/seed/dr-nimba/200/120',
    large: false,
  },
  {
    category: 'Banking',
    title: 'Mobile money is reshaping how Liberians save, borrow, and invest',
    summary: 'With smartphone penetration rising above 60%, mobile-first financial services are pulling millions of unbanked Liberians into the formal economy.',
    source: 'FrontPage Africa',
    time: '10h ago',
    img: 'https://picsum.photos/seed/dr-mbank/200/120',
    large: false,
  },
  {
    category: 'Agriculture',
    title: 'Can Liberia become West Africa\'s next rubber powerhouse?',
    summary: 'Record Firestone output and favorable global prices are creating an opening. But analysts say infrastructure bottlenecks could cap the opportunity.',
    source: 'TrueRate Analysis',
    time: '12h ago',
    img: 'https://picsum.photos/seed/dr-rubber/200/120',
    large: false,
  },
  {
    category: 'Development',
    title: 'IMF program review: what the next tranche means for Liberia\'s fiscal path',
    summary: 'The Fund praised revenue reforms but flagged risks around public wage bills and off-budget spending ahead of the $38M disbursement.',
    source: 'IMF',
    time: '1d ago',
    img: 'https://picsum.photos/seed/dr-imf/200/120',
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
        <Link href="/news" className="text-[12px] text-white/50 hover:text-white transition-colors no-underline">More ›</Link>
      </div>
      {/* Lead story */}
      <Link href="/news" className="group block no-underline mb-5">
        <div className="overflow-hidden rounded-xl mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lead.img} alt="" className="w-full h-[180px] object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="text-[11px] font-bold uppercase tracking-wide text-white/40 mb-1.5">{lead.category}</div>
        <h3 className="text-[15px] font-bold leading-snug text-white group-hover:text-white/80 transition-colors mb-2">{lead.title}</h3>
        <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-3">{lead.summary}</p>
        <div className="mt-2 text-[11px] text-gray-700">{lead.source} · {lead.time}</div>
      </Link>
      {/* Remaining stories */}
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {rest.map((item, i) => (
          <Link key={i} href="/news" className="group flex gap-3.5 py-4 first:pt-0 no-underline">
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
        <Link key={i} href="/news" className="group flex gap-4 py-4 first:pt-0 no-underline">
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
        </Link>
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
          <Link href="/news" className="text-[12px] text-white/50 hover:text-white transition-colors no-underline">See all latest ›</Link>
        </div>
        <div className="flex flex-col divide-y divide-white/[0.05]">
          {SIDEBAR_LATEST.map((item, i) => (
            <Link key={i} href="/news" className="flex gap-3 py-3 first:pt-0 no-underline group">
              <span className="shrink-0 tabular-nums text-[12px] text-gray-600 w-8 pt-0.5">{item.time}</span>
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
          <Link key={i} href="/news" className="flex items-start gap-3 py-3.5 first:pt-0 no-underline group">
            <span className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-white/[0.06] text-white/50">
              {item.tag}
            </span>
            <span className="flex-1 text-[13px] font-medium leading-snug text-white/80 group-hover:text-white transition-colors line-clamp-2">
              {item.headline}
            </span>
            <span className="shrink-0 tabular-nums text-[11px] text-gray-600 pt-0.5">{item.time}</span>
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
          <Link key={item.rank} href="/news" className="flex items-start gap-3.5 py-3 first:pt-0 no-underline group">
            <span className="shrink-0 tabular-nums text-[22px] font-black text-white/10 leading-none w-6 pt-0.5">{item.rank}</span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-snug text-white/80 group-hover:text-white transition-colors line-clamp-2">{item.title}</p>
              <p className="mt-1 text-[11px] text-gray-600">{item.source} · {item.time}</p>
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
              <span className="mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-white/[0.06] text-white/50">{ev.type}</span>
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

function MobileTickerBar() {
  const pinned = INDICATORS.slice(0, 6);
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0d]/95 backdrop-blur-sm border-t border-white/[0.06] px-3 py-2">
      <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pinned.map(item => (
          <Link key={item.label} href="/economy" className="no-underline shrink-0 flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5">
            <span className="text-[12px] font-bold text-white whitespace-nowrap">{item.label}</span>
            <span className={`tabular-nums text-[11px] font-bold whitespace-nowrap ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
              {item.pct}
            </span>
            <svg className="h-3 w-3 text-white/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </Link>
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
          <aside className="order-3 lg:col-span-3 lg:border-l lg:border-white/[0.05] lg:pl-5 lg:self-start">
            <LatestSidebar />
          </aside>

        </div>

        {/* ── Full-width sections below the grid ── */}

        {/* Key Sectors */}
        <div className="mt-10 border-t border-white/[0.05] pt-8">
          <SectionHeading title="Key Sectors" action="/economy" actionLabel="Economy overview" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {KEY_SECTORS.map((s, i) => (
              <Link key={i} href="/economy" className="group rounded-xl border border-white/[0.07] bg-[#141418] p-4 no-underline hover:border-white/20 transition-colors">
                <div className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>{s.growth}</div>
                <div className="text-[14px] font-bold text-white leading-snug mb-1 group-hover:text-white/80 transition-colors">{s.sector}</div>
                <div className="text-[11px] text-gray-600 line-clamp-2">{s.desc}</div>
                <div className="mt-2 text-[12px] font-semibold text-white/50">{s.contrib} of GDP</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Regional Spotlight */}
        <div className="mt-10 border-t border-white/[0.05] pt-8">
          <SectionHeading title="West Africa in Focus" action="/news" actionLabel="More regional news" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { country: 'Ghana', flag: '🇬🇭', headline: 'Cedi hits 6-month high after IMF tranche release', stat: 'GHS/USD 14.82', time: '4h ago', img: 'https://picsum.photos/seed/gh-reg/400/220' },
              { country: 'Nigeria', flag: '🇳🇬', headline: 'NSE posts best month in 18 years as oil rebounds', stat: 'Brent $84.20/bbl', time: '6h ago', img: 'https://picsum.photos/seed/ng-reg/400/220' },
              { country: 'Sierra Leone', flag: '🇸🇱', headline: 'Freetown port expansion fast-tracked with $80M loan', stat: 'SLL/USD 22,100', time: '8h ago', img: 'https://picsum.photos/seed/sl-reg/400/220' },
              { country: "Côte d'Ivoire", flag: '🇨🇮', headline: "Abidjan bourse outperforms regional peers in Q1", stat: 'BRVM Index +3.4%', time: '10h ago', img: 'https://picsum.photos/seed/ci-reg/400/220' },
            ].map((r, i) => (
              <Link key={i} href="/news" className="group flex flex-col no-underline overflow-hidden rounded-xl border border-white/[0.07] bg-[#141418] hover:border-white/20 transition-colors">
                <div className="overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.img} alt="" className="w-full h-[120px] object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-3 flex-1">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[13px]">{r.flag}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">{r.country}</span>
                  </div>
                  <h3 className="text-[12px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-2">{r.headline}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white/50 tabular-nums">{r.stat}</span>
                    <span className="text-[10px] text-gray-600">{r.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Business Data strip */}
        <div className="mt-10 border-t border-white/[0.05] pt-8">
          <SectionHeading title="Market Data" action="/economy" actionLabel="Full markets" />
          <BusinessOverview />
        </div>

        {/* Trending Topics */}
        <div className="mt-10 border-t border-white/[0.05] pt-8 pb-4">
          <h2 className="text-[15px] font-bold text-white mb-3">Trending Topics</h2>
          <div className="flex flex-wrap gap-2">
            {['Iron Ore', 'LRD/USD', 'CBL Rate', 'Rubber Prices', 'ECOWAS Trade', 'Liberia GDP', 'Diaspora Remittances', 'Mining Policy', 'Inflation', 'Gold Prices', 'Firestone', 'ArcelorMittal', 'World Bank', 'IMF Program', 'Port of Monrovia', 'Ecobank', 'Mobile Money'].map(t => (
              <Link key={t} href="/news" className="rounded-lg border border-white/20 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-white/[0.06] transition-colors no-underline">{t}</Link>
            ))}
          </div>
        </div>

      </main>

      <MobileTickerBar />
    </div>
  );
}
