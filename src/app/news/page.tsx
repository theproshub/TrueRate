'use client';

import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { newsItems } from '@/data/news';
import { NewsThumbnail, VideoThumbnail, AuthorAvatar } from '@/components/NewsThumbnail';
import { getNewsCatColor as getCatColor } from '@/lib/category-colors';
import { TrendingPanel, RightRail } from '@/components/NewsSidebars';

/* ── helpers ── */
function timeAgo(d: string) {
  const days = Math.floor((new Date('2026-04-04').getTime() - new Date(d).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

/* ── static data ── */

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
  { href: '/news/35', stat: '18%',   statLabel: 'Export surge', title: 'Iron Ore Exports Jump 18% in Q1 — The ArcelorMittal Expansion Is Already Paying Off',          time: '1d ago', category: 'Mining' },
  { href: '/news/10', stat: '$680M', statLabel: 'Remittances',  title: "The $680M Lifeline: How the Liberian Diaspora Outspends the Government's Development Budget",    time: '2d ago', category: 'economy' },
  { href: '/news/4',  stat: '5.1%',  statLabel: 'GDP forecast', title: 'IMF Upgrades Liberia to 5.1% Growth — But the Numbers Hide a Widening Inequality Story',        time: '3d ago', category: 'economy' },
  { href: '/news/5',  stat: '2,400', statLabel: 'New jobs',     title: 'Firestone Created 2,400 Jobs in One Quarter. It Should Inspire a National Conversation.',        time: '4d ago', category: 'Agriculture' },
  { href: '/news/28', stat: '$642M', statLabel: 'FX Reserves',  title: "Liberia's 13-Year Reserve High Is a Cushion — But the CBL Needs a Strategy for What Comes Next", time: '5d ago', category: 'policy' },
  { href: '/news/30', stat: '48MW',  statLabel: 'Solar added',  title: "Private Entrepreneurs Just Did What the Government Couldn't: Power 190,000 Liberian Homes",       time: '6d ago', category: 'economy' },
];

const EDITORS_PICKS = [
  {
    href: '/news/3',
    category: 'Deep Dive',
    title: "ArcelorMittal's $120M Nimba Bet: Three Scenarios for Liberia's Fiscal Future",
    excerpt: "This expansion is more than a mining story — it's a test of whether Liberia can finally translate a commodity boom into lasting public revenue. We model the optimistic case, the base case, and the scenario policymakers don't want to discuss.",
    author: 'TrueRate Analysis',
    readTime: '8 min read',
    time: '1d ago',
  },
  {
    href: '/news/4',
    category: 'Explainer',
    title: "The IMF Said 5.1%. Here's What That Number Actually Means for the Average Liberian.",
    excerpt: "GDP forecasts sound like good news. But the gains from mining-led growth have historically concentrated at the top. We map which sectors are driving the upgrade, who captures the upside — and where the economy is still failing most people.",
    author: 'TrueRate',
    readTime: '5 min read',
    time: '2d ago',
  },
  {
    href: '/news/18',
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

function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const slides = newsItems.slice(0, 5);
  const item = slides[idx];

  return (
    <div className="relative overflow-hidden group">
      <NewsThumbnail category={item.category} className="w-full h-[380px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className={`text-[10px] font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>{item.category}</span>
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
            <h3 className="mt-0.5 text-[12px] font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3">{item.title}</h3>
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
            <h3 className="mt-0.5 text-[12px] font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">{item.title}</h3>
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
            <div className="border-b border-gray-200 py-10 text-center">
              <h2 className="mb-1 text-[16px] font-bold text-gray-900">No results found</h2>
              <p className="text-[13px] text-gray-500">
                Try searching for &ldquo;inflation&rdquo;, &ldquo;forex&rdquo;, &ldquo;rubber&rdquo; or &ldquo;CBL&rdquo;.
              </p>
            </div>
          ) : (
            <div className="flex gap-6">
              <div className="flex-1 min-w-0 flex flex-col divide-y divide-gray-100">
                {searchResults.map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-4 py-4 first:pt-5 last:pb-5 no-underline">
                    <NewsThumbnail category={item.category} className="shrink-0 h-[90px] w-[140px] rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>
                        {item.category}
                      </span>
                      <h3 className="mt-0.5 text-[12px] font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
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
      <div className="mb-5 flex items-center gap-0 border-b border-gray-200 overflow-hidden">
        <div className="shrink-0 bg-brand-accent px-3 py-2.5 z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Live</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="ticker-scroll flex w-max">
            {[...BREAKING, ...BREAKING].map((b, i) => (
              <Link key={i} href="/news" className="flex items-center gap-2 px-5 py-2.5 no-underline whitespace-nowrap group shrink-0 border-l border-gray-200">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">{b.label}</span>
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
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">For You</h2>
              </div>
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
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Editor&apos;s Picks</h2>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {EDITORS_PICKS.map((p, i) => (
                <Link key={i} href={p.href} className="group flex gap-4 py-5 first:pt-0 no-underline hover:opacity-75 transition-opacity">
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
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">More Stories</h2>
              </div>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">All stories ›</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-gray-100 border-t border-b border-gray-100">
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
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Videos</h2>
              </div>
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
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Analysis &amp; Opinion</h2>
              </div>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">View all ›</Link>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {OPINION.map((op, i) => (
                <Link key={i} href="/news" className="group flex items-center gap-4 py-4 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-full">
                    <AuthorAvatar name={op.author} className="h-11 w-11 rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[12px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-1">{op.title}</h3>
                    <div className="text-[12px] text-gray-500">{op.author} · <span className="text-gray-400">{op.role}</span> · <span className="text-gray-400">{op.time}</span></div>
                  </div>
                  <svg className="shrink-0 h-4 w-4 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          </div>

          {/* West Africa section */}
          <div className="mt-10">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">From West Africa</h2>
              </div>
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
                    <h3 className="mt-0.5 text-[12px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3 mb-1">{w.title}</h3>
                    <div className="text-[11px] text-gray-400">{w.source} · {w.time}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Data Stories */}
          <div className="mt-10">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Data Stories</h2>
              </div>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DATA_STORIES.map((s, i) => (
                <Link key={i} href={s.href} className="group flex flex-col no-underline">
                  <div className="relative overflow-hidden mb-3">
                    <NewsThumbnail category={s.category} className="w-full h-[120px]" />
                  </div>
                  <div>
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
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">From the Archives</h2>
              </div>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Browse archive ›</Link>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {ARCHIVES.map((a, i) => (
                <Link key={i} href="/news" className="group flex gap-4 py-4 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-xl">
                    <NewsThumbnail category={a.category} className="h-[80px] w-[120px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[12px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-1.5">{a.title}</h3>
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
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Community Voices</h2>
              </div>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COMMUNITY_VOICES.map((cv, i) => (
                <Link key={i} href="/news" className="group flex flex-col no-underline border-t border-gray-100 pt-4">
                  <h3 className="text-[12px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-2">{cv.title}</h3>
                  <p className="text-[12px] text-gray-500 line-clamp-3 mb-3 flex-1">{cv.excerpt}</p>
                  <div className="flex items-center gap-3">
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
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Upcoming Economic Events</h2>
              </div>
              <Link href="/economy" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Full calendar ›</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {UPCOMING_EVENTS.map((ev, i) => (
                <Link key={i} href="/economy" className="group flex items-center gap-4 py-3.5 no-underline hover:opacity-75 transition-opacity">
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
