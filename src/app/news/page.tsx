'use client';

import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { newsItems } from '@/data/news';
import { NewsThumbnail, VideoThumbnail, AuthorAvatar } from '@/components/NewsThumbnail';
import { getNewsCatColor as getCatColor } from '@/lib/category-colors';

/* ── helpers ── */
function timeAgo(d: string) {
  const days = Math.floor((new Date('2026-04-04').getTime() - new Date(d).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

/* ── static data ── */
const TRENDING = [
  { rank: 1, title: "Why the CBL Governor isn't cutting rates — even as inflation falls", isNew: true },
  { rank: 2, title: "ArcelorMittal's $120M Nimba bet: the biggest wager on Liberia in a decade", isNew: true },
  { rank: 3, title: "Bea Mountain's 1.4M oz discovery: what happens next", isNew: true },
  { rank: 4, title: "How Firestone turned Harbel into Africa's most productive rubber estate", isNew: false },
  { rank: 5, title: "The $680M question: where is Liberia's diaspora money actually going?", isNew: false },
  { rank: 6, title: "Liberia's $50M green bond was oversubscribed 2.4x — now the hard part", isNew: false },
  { rank: 7, title: "Gold at $3,100: Liberia's miners are positioned for their best year in a decade", isNew: false },
  { rank: 8, title: "LiberAgro made history on the Ghana Stock Exchange. Nobody noticed.", isNew: false },
  { rank: 9, title: "Off-grid solar is quietly electrifying Liberia — without the government", isNew: false },
  { rank: 10, title: "CBL reserves at $642M: what the 13-year high means for monetary policy", isNew: false },
];

const TABS = ['For You', 'Economy', 'Markets', 'Policy', 'Trade', 'Mining', 'Agriculture'];

const BREAKING = [
  { label: 'FOREX', text: 'LRD/USD holds at 192.50 — CBL intervenes to anchor exchange rate ahead of budget review' },
  { label: 'MARKETS', text: "Iron ore drops 2.1% on weak Chinese demand data — ArcelorMittal Liberia watching closely" },
  { label: 'POLICY', text: 'Finance Ministry sets Apr 14 for mid-year budget review as revenue shortfall widens' },
  { label: 'TRADE', text: 'Freeport of Monrovia posts strongest weekly throughput since 2021 following Phase II completion' },
  { label: 'MINING', text: 'Bea Mountain confirms 1.4M oz high-grade deposit — Grand Cape Mount gold rush accelerates' },
  { label: 'ECONOMY', text: 'CBL gross reserves reach $642M, covering 4.3 months of imports — highest since 2013' },
  { label: 'ENERGY', text: 'Private mini-grids add 48MW of solar capacity, powering 190,000 homes outside the national grid' },
  { label: 'CAPITAL MARKETS', text: 'LiberAgro raises $12M in West Africa first cross-border IPO on Ghana Stock Exchange' },
];

const OPINION = [
  { title: "Liberia's rubber pricing model is broken. Here's exactly how to fix it.", author: 'Dr. Y. Kollie', role: 'Economic Adviser, GOL', time: '2d ago' },
  { title: "We need a sovereign wealth fund before the mining boom peaks. The window is closing.", author: 'Prof. A. Dahn', role: 'University of Liberia', time: '3d ago' },
  { title: "ECOWAS monetary union is coming. Liberia should lead the conversation, not follow it.", author: 'M. Wreh', role: 'Senior Economist, CBL', time: '4d ago' },
  { title: "5G will arrive before stable electricity does. That is not a technology problem — it's a governance failure.", author: 'E. Pewu', role: 'Tech Policy Analyst, LIPA', time: '5d ago' },
  { title: "The Freeport expansion doubled our capacity. The roads behind it haven't changed in 20 years.", author: 'S. Flomo', role: 'Logistics Economist, USAID', time: '6d ago' },
];

const WEST_AFRICA = [
  { country: 'Ghana', title: "Ghana cedi at a six-month high — and the IMF tranche is only part of the story", source: 'Ghana Business News', time: '4h ago' },
  { country: 'Nigeria', title: "Nigeria's bourse just posted its best month in 18 years. Here's who got rich.", source: 'BusinessDay NG', time: '6h ago' },
  { country: 'Sierra Leone', title: "Freetown's $80M port expansion is a direct challenge to Monrovia's trade ambitions", source: 'Awoko', time: '8h ago' },
  { country: "Côte d'Ivoire", title: "The Abidjan bourse outperformed every regional peer in Q1. These are the stocks that led.", source: 'Agence Ecofin', time: '10h ago' },
  { country: 'Senegal', title: "$2.4B in offshore oil revenue projected for 2026 — Dakar is about to have a lot of decisions to make", source: 'Jeune Afrique', time: '14h ago' },
  { country: 'Guinea', title: "Guinea surpasses 100M tonnes of bauxite output. The wealth is not staying in Guinea.", source: 'Mining Weekly Africa', time: '1d ago' },
  { country: 'Gambia', title: "Tourism receipts up 28% in Gambia — and Liberia's coast remains largely undiscovered", source: 'Daily Observer GM', time: '1d ago' },
  { country: 'Mali', title: "Gold output in Mali rises 9% despite the political crisis. Barrick calls it business as usual.", source: 'Reuters Africa', time: '2d ago' },
];

const DATA_STORIES = [
  { stat: '18%',   statLabel: 'Export surge',  title: 'Iron Ore Exports Jump 18% in Q1 — The ArcelorMittal Expansion Is Already Paying Off',          time: '1d ago',  category: 'Mining' },
  { stat: '$680M', statLabel: 'Remittances',   title: "The $680M Lifeline: How the Liberian Diaspora Outspends the Government's Development Budget",    time: '2d ago',  category: 'economy' },
  { stat: '5.1%',  statLabel: 'GDP forecast',  title: 'IMF Upgrades Liberia to 5.1% Growth — But the Numbers Hide a Widening Inequality Story',        time: '3d ago',  category: 'economy' },
  { stat: '2,400', statLabel: 'New jobs',       title: 'Firestone Created 2,400 Jobs in One Quarter. It Should Inspire a National Conversation.',        time: '4d ago',  category: 'Agriculture' },
  { stat: '$642M', statLabel: 'FX Reserves',   title: "Liberia's 13-Year Reserve High Is a Cushion — But the CBL Needs a Strategy for What Comes Next", time: '5d ago',  category: 'policy' },
  { stat: '48MW',  statLabel: 'Solar added',   title: "Private Entrepreneurs Just Did What the Government Couldn't: Power 190,000 Liberian Homes",       time: '6d ago',  category: 'economy' },
];

const EDITORS_PICKS = [
  {
    category: 'Deep Dive',
    title: "ArcelorMittal's $120M Nimba Bet: Three Scenarios for Liberia's Fiscal Future",
    excerpt: "This expansion is more than a mining story — it's a test of whether Liberia can finally translate a commodity boom into lasting public revenue. We model the optimistic case, the base case, and the scenario policymakers don't want to discuss.",
    author: 'TrueRate Analysis',
    readTime: '8 min read',
    time: '1d ago',
  },
  {
    category: 'Explainer',
    title: "The IMF Said 5.1%. Here's What That Number Actually Means for the Average Liberian.",
    excerpt: "GDP forecasts sound like good news. But the gains from mining-led growth have historically concentrated at the top. We map which sectors are driving the upgrade, who captures the upside — and where the economy is still failing most people.",
    author: 'TrueRate',
    readTime: '5 min read',
    time: '2d ago',
  },
  {
    category: 'Investigation',
    title: "Liberia's $50M Green Bond Is Oversubscribed. Now We Need to Talk About Accountability.",
    excerpt: "International investors want a piece of Liberian sovereign paper. But a debut ESG bond is only as credible as its accountability mechanisms. We review every project in the pipeline, the reporting obligations, and the gaps that could cost Liberia its next issuance.",
    author: 'TrueRate Investigation',
    readTime: '11 min read',
    time: '3d ago',
  },
];

const ARCHIVES = [
  { title: "Thirty Years of Missed Opportunity: Why Liberia's Rubber Sector Has Never Matched Its Potential",   date: 'Jan 2026', category: 'Agriculture', readTime: '12 min read' },
  { title: "From Post-War Reconstruction to Rate Decisions: The Long Road to CBL Independence",                  date: 'Nov 2025', category: 'policy',      readTime: '15 min read' },
  { title: "Iron Ore, Timber, Rubber: The Three-Commodity Trap That Has Defined Liberia's Economy for 60 Years", date: 'Sep 2025', category: 'Mining',      readTime: '10 min read' },
  { title: "The Invisible Economy: How Monrovia's Informal Sector Powers Half the City — and Gets None of the Credit", date: 'Jul 2025', category: 'economy', readTime: '9 min read' },
];

const UPCOMING_EVENTS = [
  { date: 'Apr 7',  title: 'CBL Monetary Policy Committee Meeting',     type: 'Monetary Policy' },
  { date: 'Apr 10', title: 'Q1 2026 GDP Advance Estimate Release',       type: 'Data' },
  { date: 'Apr 12', title: 'LTA 5G Spectrum Consultation — Monrovia',    type: 'Tech' },
  { date: 'Apr 14', title: 'Mid-Year Budget Review — Legislature',        type: 'Fiscal' },
  { date: 'Apr 14', title: 'Liberia Investment Forum — Monrovia',         type: 'Trade' },
  { date: 'Apr 18', title: 'West Africa Trade Facilitation Summit',       type: 'Trade' },
  { date: 'Apr 22', title: 'IMF Staff Mission Begins',                    type: 'IMF' },
  { date: 'Apr 28', title: 'ArcelorMittal Q1 Earnings Call',             type: 'Markets' },
  { date: 'May 5',  title: 'African Development Bank Annual Meetings',    type: 'Development' },
];

const VIDEOS = [
  { title: "CBL Governor: 'We're watching food prices. We're not ready to cut.'", duration: '2:48', category: 'policy', time: '55m ago' },
  { title: "Inside ArcelorMittal's Nimba Expansion: The $120M Bet Explained in Under 2 Minutes", duration: '1:52', category: 'Mining', time: '3h ago' },
  { title: "$680M and Counting: How the Liberian Diaspora Became the Country's Biggest Investor", duration: '2:31', category: 'economy', time: '12h ago' },
  { title: "West Africa's Digital Payments Revolution — And Why Liberia Must Move Fast", duration: '3:14', category: 'Trade', time: '1d ago' },
  { title: "1.4 Million Ounces: What Bea Mountain's Grand Cape Mount Discovery Means for Liberia", duration: '4:05', category: 'commodities', time: '2d ago' },
  { title: "The Freeport Is Built. Now Who Captures the Trade?", duration: '3:22', category: 'economy', time: '3d ago' },
];

const COMMUNITY_VOICES = [
  {
    title: "Foreign Contractors Still Win Every Mining Ancillary Contract. Our Local Content Law Is a Fiction.",
    excerpt: "We have the legislation. We have the rhetoric. What we don't have is enforcement. Until that changes, local business development in the mining sector will remain a line item in a press release.",
    author: 'Korto Williams',
    role: 'President, Liberia Business Association',
    time: '3d ago',
  },
  {
    title: "Mobile Money Is Reaching Rural Liberia. Electricity and Connectivity Are Not.",
    excerpt: "The adoption curve outside Monrovia is real — but every agent I've spoken to in Bong and Lofa tells the same story: generator costs are eating the margin, and data is unreliable. The infrastructure has to come before the fintech.",
    author: 'James T. Kollie',
    role: 'Co-Founder, PayLink Liberia',
    time: '4d ago',
  },
  {
    title: "Agriculture Has Grown 7% Annually for Three Years Running. When Does It Get the Headline?",
    excerpt: "Mining is the story that foreign investors tell. But smallholder farming and agro-processing are the story that feeds Liberia. It's time the national economic narrative caught up with the reality on the ground.",
    author: 'Miatta Fallah',
    role: 'CEO, LiberAgro Ltd',
    time: '5d ago',
  },
  {
    title: "The Lofa Corridor Could Generate $200M a Year. The Roads Have Been Unpaved for Two Decades.",
    excerpt: "Every study says the same thing: connect Lofa's agricultural belt to Monrovia with cold-chain logistics and you unlock one of West Africa's most underexploited food production corridors. Yet we keep writing the study instead of building the road.",
    author: 'David Tarr',
    role: 'Supply Chain Adviser, USAID Liberia',
    time: '6d ago',
  },
];

/* ── components ── */

function TrendingPanel() {
  return (
    <aside className="hidden lg:block w-[270px] shrink-0 sticky" style={{ top: 'calc(var(--header-h, 124px) + 16px)' }}>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <h2 className="text-[14px] font-bold text-gray-900 uppercase tracking-wide">Trending</h2>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
          {TRENDING.map(item => (
            <Link key={item.rank} href="/news" className="flex items-start gap-3 px-4 py-3.5 no-underline group hover:bg-gray-50 transition-colors">
              <span className="shrink-0 tabular-nums text-[20px] font-black text-gray-300 leading-none w-5 pt-0.5">{item.rank}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-snug text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-2">{item.title}</p>
              </div>
            </Link>
          ))}
          <Link href="/news" className="flex items-center justify-between px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
            <span className="text-[13px] text-gray-500 group-hover:text-gray-900 transition-colors">See more stories</span>
            <svg className="h-4 w-4 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Mini market widget */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-3">Markets</h3>
          {[
            { label: 'LRD/USD', value: '192.50', pct: '+0.65%', up: true },
            { label: 'Iron Ore', value: '$108.50', pct: '-2.08%', up: false },
            { label: 'Rubber', value: '$1.72/kg', pct: '+2.38%', up: true },
            { label: 'Gold', value: '$3,108', pct: '+1.12%', up: true },
            { label: 'Palm Oil', value: '$922/t', pct: '-1.40%', up: false },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-[12px] font-semibold text-gray-900">{r.label}</span>
              <div className="text-right">
                <div className="text-[12px] tabular-nums text-gray-900">{r.value}</div>
                <div className={`text-[11px] font-bold tabular-nums ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>{r.pct}</div>
              </div>
            </div>
          ))}
          <Link href="/economy" className="mt-3 block text-center text-[12px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Full markets ›</Link>
        </div>

        {/* In Focus topics */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-[13px] font-bold text-gray-900 mb-3">In Focus</h3>
          <div className="flex flex-wrap gap-2">
            {['Iron Ore', 'LRD/USD', 'Rubber', 'CBL Rate', 'Remittances', 'ECOWAS', 'Mining Policy', 'Inflation', 'Gold', 'ESG Bonds'].map(t => (
              <Link key={t} href="/news" className="rounded-lg border border-gray-300 px-4 py-1.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors no-underline">{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const slides = newsItems.slice(0, 5);
  const item = slides[idx];

  return (
    <div className="relative overflow-hidden group">
      <NewsThumbnail category={item.category} className="w-full h-[380px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className={`text-[11px] font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>{item.category}</span>
      </div>
      <div className="absolute top-4 right-4 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white tabular-nums">
        {idx + 1} / {slides.length}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <Link href={`/news/${item.id}`} className="no-underline">
          <h2 className="text-[22px] font-bold leading-snug text-white hover:text-white/80 transition-colors drop-shadow-lg line-clamp-3">{item.title}</h2>
        </Link>
        <p className="mt-1.5 text-[13px] text-white/70 line-clamp-1">{item.source} · {timeAgo(item.date)}</p>
      </div>
      <button onClick={() => setIdx(i => (i - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={() => setIdx(i => (i + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
      <div className="absolute bottom-4 right-5 flex gap-1.5">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />
        ))}
      </div>
    </div>
  );
}

function SubStoryRow() {
  const items = newsItems.slice(5, 8);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      {items.map((item) => (
        <Link key={item.id} href={`/news/${item.id}`} className="group no-underline">
          <div className="overflow-hidden rounded-xl">
            <NewsThumbnail category={item.category} className="w-full h-[130px]" />
          </div>
          <div className="mt-2.5">
            <span className={`text-[10px] font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>{item.category}</span>
            <h3 className="mt-0.5 text-[13px] font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3">{item.title}</h3>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-gray-400">
              <span>{item.source}</span><span>·</span><span>{timeAgo(item.date)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function FeedList({ tab }: { tab: string }) {
  const all = newsItems.slice(8);
  const filtered = tab === 'For You' ? all : all.filter(n => n.category === tab.toLowerCase());
  const items = filtered.length ? filtered : all;

  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {items.map((item) => (
        <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-4 py-4 first:pt-0 no-underline">
          <NewsThumbnail category={item.category} className="shrink-0 h-[90px] w-[140px] rounded-xl" />
          <div className="min-w-0 flex-1">
            <span className={`text-[10px] font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>{item.category}</span>
            <h3 className="mt-0.5 text-[15px] font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">{item.title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-gray-500 line-clamp-2">{item.summary}</p>
            <div className="mt-2 flex items-center gap-2 text-[12px] text-gray-400">
              <span className="font-medium text-gray-500">{item.source}</span>
              <span>·</span>
              <span>{timeAgo(item.date)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function RightRail() {
  return (
    <aside className="hidden xl:block w-[300px] shrink-0 sticky" style={{ top: 'calc(var(--header-h, 124px) + 16px)' }}>
      <div className="flex flex-col gap-5">

        {/* Newsletter */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-[14px] font-bold text-gray-900 mb-1">TrueRate Daily Brief</h3>
          <p className="text-[12px] text-gray-500 mb-3">Liberia business & economy, delivered every morning.</p>
          <input type="email" placeholder="Email address"
            className="w-full rounded-lg bg-gray-100 border border-gray-200 px-3 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors mb-2" />
          <button className="w-full rounded-lg bg-white py-2.5 text-[13px] font-semibold text-[#0a0a0d] hover:brightness-90 transition">Subscribe</button>
        </div>

        {/* Upcoming events */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100">
            <h3 className="text-[13px] font-bold text-gray-900">Upcoming Events</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { date: 'Apr 7',  label: 'CBL Monetary Policy Meeting',     type: 'Policy' },
              { date: 'Apr 10', label: 'Q1 GDP Advance Estimate',          type: 'Economy' },
              { date: 'Apr 14', label: 'Mid-Year Budget Review',            type: 'Policy' },
              { date: 'Apr 14', label: 'Liberia Investment Forum',          type: 'Trade' },
              { date: 'Apr 18', label: 'World Bank Country Dialogue',       type: 'Development' },
              { date: 'Apr 22', label: 'ArcelorMittal Q1 Earnings Call',    type: 'Markets' },
            ].map((ev, i) => (
              <Link key={i} href="/economy" className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                <div className="shrink-0 rounded-lg bg-gray-100 border border-gray-200 px-2 py-1 text-center min-w-[40px]">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">{ev.date.split(' ')[0]}</p>
                  <p className="text-[14px] font-black text-gray-900 leading-none">{ev.date.split(' ')[1]}</p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors leading-snug">{ev.label}</p>
                  <span className="mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase bg-gray-100 text-gray-500">{ev.type}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Most read */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100">
            <h3 className="text-[13px] font-bold text-gray-900">Most Read</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {newsItems.slice(0, 5).map((item, i) => (
              <Link key={item.id} href={`/news/${item.id}`} className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                <span className="shrink-0 text-[20px] font-black text-gray-300 tabular-nums w-5 leading-none pt-0.5">{i + 1}</span>
                <p className="text-[12px] font-bold leading-snug text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-3">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Premium CTA */}
        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5">
          <h3 className="text-[14px] font-bold text-gray-900 mb-1">Go Premium</h3>
          <p className="text-[12px] text-gray-500 mb-4">Unlock deep-dive analysis, exclusive data, and ad-free reading.</p>
          <Link href="/signin" className="block w-full rounded-lg bg-white py-2.5 text-center text-[13px] font-semibold text-[#0a0a0d] hover:bg-white/90 transition no-underline">
            See plans
          </Link>
        </div>

        {/* Compact site footer */}
        <div className="pt-2 pb-4">
          <div className="flex items-center justify-center gap-4 mb-3">
            {[
              { label: 'X', href: '#', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              { label: 'Facebook', href: '#', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              { label: 'Instagram', href: '#', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
              { label: 'YouTube', href: '#', path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
              { label: 'TikTok', href: '#', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
            ].map(s => (
              <a key={s.label} href={s.href} className="text-gray-400 hover:text-gray-700 transition-colors" aria-label={s.label}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
            {['About', 'Advertise', 'Careers', 'Help', 'Feedback', 'Privacy', 'Terms'].map(l => (
              <Link key={l} href="/about" className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors no-underline">{l}</Link>
            ))}
          </div>
          <p className="text-center text-[11px] text-gray-400">© 2026 TrueRate. All rights reserved.</p>
        </div>

      </div>
    </aside>
  );
}

function NewsPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';
  const [activeTab, setActiveTab] = useState('For You');

  // Reset tab when search query changes
  useEffect(() => {
    if (query) setActiveTab('For You');
  }, [query]);

  // Search results: match against title, summary, category, source
  const searchResults = query
    ? newsItems.filter(n => {
        const q = query.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.source.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <main className="mx-auto max-w-[1320px] px-4 py-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'News' }]} light />

      {/* ── Search results view ── */}
      {query && (
        <div className="mb-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-[22px] font-bold text-gray-900">
                Search results for{' '}
                <span className="text-emerald-400">&ldquo;{query}&rdquo;</span>
              </h1>
              <p className="mt-1 text-[13px] text-gray-500">
                {searchResults.length} article{searchResults.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <Link href="/news" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">
              ← All news
            </Link>
          </div>

          {searchResults.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
              <h2 className="mb-1 text-[16px] font-bold text-gray-900">No results found</h2>
              <p className="text-[13px] text-gray-500">
                Try searching for &ldquo;inflation&rdquo;, &ldquo;forex&rdquo;, &ldquo;rubber&rdquo; or &ldquo;CBL&rdquo;.
              </p>
            </div>
          ) : (
            <div className="flex gap-6">
              <div className="flex-1 min-w-0 flex flex-col divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white px-5">
                {searchResults.map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-4 py-4 first:pt-5 last:pb-5 no-underline">
                    <NewsThumbnail category={item.category} className="shrink-0 h-[90px] w-[140px] rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>
                        {item.category}
                      </span>
                      <h3 className="mt-0.5 text-[15px] font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-gray-500 line-clamp-2">{item.summary}</p>
                      <div className="mt-2 flex items-center gap-2 text-[12px] text-gray-400">
                        <span className="font-medium text-gray-500">{item.source}</span>
                        <span>·</span>
                        <span>{timeAgo(item.date)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Normal news view (hidden when searching) ── */}
      {!query && (<>

      {/* Breaking ticker */}
      <div className="mb-5 flex items-center gap-0 rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="shrink-0 bg-emerald-500 px-3 py-2.5 z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Live</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="ticker-scroll flex w-max">
            {[...BREAKING, ...BREAKING].map((b, i) => (
              <Link key={i} href="/news" className="flex items-center gap-2 px-5 py-2.5 no-underline whitespace-nowrap group shrink-0 border-l border-gray-200">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{b.label}</span>
                <span className="text-[13px] font-medium text-gray-700 group-hover:text-gray-950 transition-colors">{b.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex gap-6 items-start">

        {/* Left: Trending */}
        <TrendingPanel />

        {/* Center: main feed */}
        <div className="flex-1 min-w-0 pb-8">

          {/* Hero carousel */}
          <HeroCarousel />

          {/* 3 sub-stories */}
          <SubStoryRow />

          {/* Tab bar + feed */}
          <div className="mt-8 mb-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[18px] font-bold text-gray-900">For You</h2>
              <div className="hidden sm:flex items-center gap-1 rounded-lg border border-gray-200 p-0.5">
                {['Feed', 'Cards'].map(v => (
                  <button key={v} className="px-3 py-1 rounded text-[12px] font-medium text-gray-500 hover:text-gray-900 transition-colors">{v}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-0 overflow-x-auto border-b border-gray-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === tab ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <FeedList tab={activeTab} />

          {/* Editor's Picks */}
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <svg className="h-4 w-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <h2 className="text-[18px] font-bold text-gray-900">Editor&apos;s Picks</h2>
            </div>
            <div className="flex flex-col gap-4">
              {EDITORS_PICKS.map((p, i) => (
                <Link key={i} href="/news" className="group flex gap-4 rounded-xl border border-gray-200 bg-white p-5 no-underline hover:border-gray-300 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">{p.category}</span>
                      <span className="text-[11px] text-gray-400">{p.readTime}</span>
                    </div>
                    <h3 className="text-[16px] font-bold leading-snug text-gray-900 group-hover:text-gray-700 transition-colors mb-2">{p.title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-3">{p.excerpt}</p>
                    <div className="text-[12px] text-gray-400">{p.author} · {p.time}</div>
                  </div>
                  <div className="shrink-0 overflow-hidden rounded-xl">
                    <NewsThumbnail category={i === 0 ? 'Mining' : i === 1 ? 'economy' : 'policy'} className="h-[110px] w-[160px]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* More Stories grid */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-gray-900">More Stories</h2>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">All stories ›</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 rounded-xl border border-gray-200 bg-white overflow-hidden divide-x divide-gray-100">
              {newsItems.slice(20, 24).map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col gap-2.5 p-4 no-underline hover:bg-gray-50 transition-colors">
                  <div className="overflow-hidden rounded-lg">
                    <NewsThumbnail category={item.category} className="w-full h-[80px]" />
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>{item.category}</div>
                  <h3 className="text-[12px] font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3">{item.title}</h3>
                  <div className="text-[10px] text-gray-400 mt-auto">{item.source} · {timeAgo(item.date)}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Videos strip */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-gray-900">Videos</h2>
              <Link href="/videos" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">View all ›</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {VIDEOS.map((v, i) => (
                <Link key={i} href="/videos" className="group flex flex-col no-underline">
                  <div className="relative overflow-hidden rounded-xl mb-2">
                    <VideoThumbnail category={v.category} duration={v.duration} className="w-full h-[110px]" />
                  </div>
                  <h3 className="text-[12px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-1">{v.title}</h3>
                  <span className="text-[11px] text-gray-400">{v.time}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Analysis & Opinion */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-gray-900">Analysis &amp; Opinion</h2>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">View all ›</Link>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {OPINION.map((op, i) => (
                <Link key={i} href="/news" className="group flex items-center gap-4 py-4 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-full">
                    <AuthorAvatar name={op.author} className="h-11 w-11 rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[14px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-1">{op.title}</h3>
                    <div className="text-[12px] text-gray-500">{op.author} · <span className="text-gray-400">{op.role}</span> · <span className="text-gray-400">{op.time}</span></div>
                  </div>
                  <svg className="shrink-0 h-4 w-4 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          </div>

          {/* West Africa section */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-gray-900">From West Africa</h2>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">More regional news ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WEST_AFRICA.map((w, i) => (
                <Link key={i} href="/news" className="group flex gap-3 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-xl">
                    <NewsThumbnail category="economy" className="h-[80px] w-[120px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">{w.country}</span>
                    <h3 className="mt-0.5 text-[13px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3 mb-1">{w.title}</h3>
                    <div className="text-[11px] text-gray-400">{w.source} · {w.time}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Data Stories */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-gray-900">Data Stories</h2>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DATA_STORIES.map((s, i) => (
                <Link key={i} href="/news" className="group flex flex-col no-underline rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <div className="relative overflow-hidden">
                    <NewsThumbnail category={s.category} className="w-full h-[120px]" />
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-[32px] font-black text-gray-900 tabular-nums leading-none">{s.stat}</span>
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">{s.statLabel}</span>
                    </div>
                    <h3 className="text-[12px] font-semibold leading-snug text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-3 mb-1.5">{s.title}</h3>
                    <span className="text-[11px] text-gray-400">{s.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* From the Archives */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-gray-900">From the Archives</h2>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Browse archive ›</Link>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {ARCHIVES.map((a, i) => (
                <Link key={i} href="/news" className="group flex gap-4 py-4 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-xl">
                    <NewsThumbnail category={a.category} className="h-[80px] w-[120px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[14px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-1.5">{a.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      <span>{a.date}</span>
                      <span>·</span>
                      <span>{a.readTime}</span>
                    </div>
                  </div>
                  <svg className="shrink-0 h-4 w-4 text-gray-500 group-hover:text-gray-400 transition-colors self-center" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Community Voices */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-gray-900">Community Voices</h2>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COMMUNITY_VOICES.map((cv, i) => (
                <Link key={i} href="/news" className="group flex flex-col no-underline rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="text-[14px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-2">{cv.title}</h3>
                  <p className="text-[12px] text-gray-500 line-clamp-3 mb-4 flex-1">{cv.excerpt}</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <div className="shrink-0 overflow-hidden rounded-full">
                      <AuthorAvatar name={cv.author} className="h-8 w-8 rounded-full" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-gray-700 truncate">{cv.author}</p>
                      <p className="text-[11px] text-gray-400 truncate">{cv.role} · {cv.time}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Economic Events */}
          <div className="mt-10 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-gray-900">Upcoming Economic Events</h2>
              <Link href="/economy" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Full calendar ›</Link>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
              {UPCOMING_EVENTS.map((ev, i) => (
                <Link key={i} href="/economy" className="group flex items-center gap-4 px-5 py-3.5 no-underline hover:bg-gray-50 transition-colors">
                  <span className="shrink-0 w-[52px] text-[12px] font-bold text-emerald-400 tabular-nums">{ev.date}</span>
                  <p className="flex-1 text-[13px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors leading-snug">{ev.title}</p>
                  <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase bg-gray-100 text-gray-500">{ev.type}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right rail */}
        <RightRail />
      </div>
    </>)}

    </main>
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={null}>
      <NewsPageInner />
    </Suspense>
  );
}
