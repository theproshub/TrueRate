'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { newsItems } from '@/data/news';
import { NewsThumbnail, VideoThumbnail, AuthorAvatar } from '@/components/NewsThumbnail';

/* ── helpers ── */
function timeAgo(d: string) {
  const days = Math.floor((new Date('2026-04-04').getTime() - new Date(d).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

const CATEGORY_COLOR: Record<string, string> = {
  policy:      'text-purple-400',
  economy:     'text-emerald-400',
  commodities: 'text-orange-400',
  forex:       'text-blue-400',
  markets:     'text-cyan-400',
  trade:       'text-yellow-400',
};

/* ── static data ── */
const TRENDING = [
  { rank: 1, title: 'CBL holds rate for third straight quarter', isNew: true },
  { rank: 2, title: 'ArcelorMittal Nimba expansion lifts exports', isNew: true },
  { rank: 3, title: 'Rubber output hits decade high on Firestone surge', isNew: false },
  { rank: 4, title: 'World Bank approves $45M infrastructure grant', isNew: false },
  { rank: 5, title: 'ECOWAS digital payments pilot goes live', isNew: false },
  { rank: 6, title: 'Gold passes $3,100 — miners positioned to gain', isNew: false },
  { rank: 7, title: 'Diaspora remittances hit record $680M', isNew: false },
];

const TABS = ['For You', 'Economy', 'Markets', 'Policy', 'Trade', 'Mining', 'Agriculture'];

const BREAKING = [
  { label: 'FOREX', text: 'LRD/USD steady at 192.50 after CBL open market op' },
  { label: 'MARKETS', text: 'Iron ore spot price falls 2.1% on China demand data' },
  { label: 'POLICY', text: 'Finance Ministry confirms mid-year budget review set for Apr 14' },
  { label: 'TRADE', text: 'Port of Monrovia reports busiest week since 2021' },
];

const OPINION = [
  { title: "Why Liberia's rubber sector needs a pricing overhaul — now", author: 'Dr. Y. Kollie', role: 'Economic Adviser', time: '2d ago' },
  { title: 'The case for a Liberia sovereign wealth fund before the mining boom peaks', author: 'Prof. A. Dahn', role: 'University of Liberia', time: '3d ago' },
  { title: "ECOWAS monetary union: Liberia should lead, not follow", author: 'M. Wreh', role: 'Senior Economist, CBL', time: '4d ago' },
];

const WEST_AFRICA = [
  { country: 'Ghana', title: 'Ghana cedi hits six-month high after IMF tranche release', source: 'Ghana Business News', time: '4h ago' },
  { country: 'Nigeria', title: 'Nigerian stock exchange posts best month in 18 years on oil rebound', source: 'BusinessDay NG', time: '6h ago' },
  { country: 'Sierra Leone', title: "Freetown port expansion fast-tracked with $80M Chinese loan", source: 'Awoko', time: '8h ago' },
  { country: "Côte d'Ivoire", title: "Abidjan bourse outperforms regional peers in Q1 2026", source: 'Agence Ecofin', time: '10h ago' },
];

const DATA_STORIES = [
  { stat: '18%',   statLabel: 'Export surge',  title: 'Iron Ore Exports Jump 18% in Q1 as ArcelorMittal Ramps Output',             time: '1d ago',  category: 'Mining' },
  { stat: '$680M', statLabel: 'Remittances',   title: 'Diaspora Remittances Hit Record $680M — Highest in Liberia\'s History',       time: '2d ago',  category: 'economy' },
  { stat: '5.1%',  statLabel: 'GDP forecast',  title: 'IMF Upgrades Liberia Growth Forecast to 5.1% on Mining Rebound',             time: '3d ago',  category: 'economy' },
  { stat: '2,400', statLabel: 'New jobs',       title: 'Firestone Expansion Creates 2,400 Jobs as Rubber Output Hits Decade High',   time: '4d ago',  category: 'Agriculture' },
];

const ARCHIVES = [
  { title: "Why Liberia's Rubber Sector Has Never Reached Its Potential — A 30-Year Retrospective",     date: 'Jan 2026', category: 'Agriculture', readTime: '12 min read' },
  { title: "The History of CBL Independence: From Post-War Reconstruction to Modern Monetary Policy",   date: 'Nov 2025', category: 'policy',      readTime: '15 min read' },
  { title: 'Iron Ore, Timber, Rubber: How Liberia Became Dependent on Three Commodities',              date: 'Sep 2025', category: 'Mining',      readTime: '10 min read' },
  { title: "Monrovia's Informal Economy: The Hidden Engine Powering Half of Urban Liberia",            date: 'Jul 2025', category: 'economy',     readTime: '9 min read' },
];

const COMMUNITY_VOICES = [
  {
    title: "We Need a Local Content Law With Teeth — Not Just Words",
    excerpt: "Foreign contractors still dominate mining ancillary contracts. Without real enforcement, local business development remains a slogan.",
    author: 'Korto Williams',
    role: 'Liberia Business Association',
    time: '3d ago',
  },
  {
    title: "Digital Banking Is Transforming Rural Commerce — But Infrastructure Must Follow",
    excerpt: "Mobile money adoption is accelerating outside Monrovia, but unreliable electricity and poor connectivity cap its impact on livelihoods.",
    author: 'James T. Kollie',
    role: 'Fintech Entrepreneur, Monrovia',
    time: '4d ago',
  },
  {
    title: "Agriculture Is Liberia's Quiet Growth Story — It Deserves the Headline",
    excerpt: "While mining grabs the spotlight, smallholder farming and agro-processing have quietly grown 7% annually for three consecutive years.",
    author: 'Miatta Fallah',
    role: 'CEO, LiberAgro Ltd',
    time: '5d ago',
  },
];

const UPCOMING_EVENTS = [
  { date: 'Apr 7',  title: 'CBL Monetary Policy Committee Meeting',     type: 'Monetary Policy' },
  { date: 'Apr 10', title: 'Q1 2026 GDP Advance Estimate Release',       type: 'Data' },
  { date: 'Apr 14', title: 'Mid-Year Budget Review — Legislature',        type: 'Fiscal' },
  { date: 'Apr 14', title: 'Liberia Investment Forum — Monrovia',         type: 'Trade' },
  { date: 'Apr 22', title: 'IMF Staff Mission Begins',                    type: 'IMF' },
];

const VIDEOS = [
  { title: 'CBL Governor on rate outlook and food inflation', duration: '2:48', category: 'policy', time: '55m ago' },
  { title: 'ArcelorMittal expansion — what it means for Liberia GDP', duration: '1:52', category: 'Mining', time: '3h ago' },
  { title: 'Diaspora remittances hit $680M — a new record', duration: '2:31', category: 'economy', time: '12h ago' },
  { title: 'ECOWAS digital payment pilot: live from Lagos', duration: '3:14', category: 'Trade', time: '1d ago' },
];

/* ── components ── */

function TrendingPanel() {
  return (
    <aside className="hidden lg:block w-[270px] shrink-0">
      <div className="sticky top-[120px]">
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <h2 className="text-[14px] font-bold text-white uppercase tracking-wide">Trending</h2>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden divide-y divide-white/[0.05]">
          {TRENDING.map(item => (
            <Link key={item.rank} href="/news" className="flex items-start gap-3 px-4 py-3.5 no-underline group hover:bg-white/[0.03] transition-colors">
              <span className="shrink-0 tabular-nums text-[20px] font-black text-white/10 leading-none w-5 pt-0.5">{item.rank}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-snug text-white/80 group-hover:text-white transition-colors line-clamp-2">{item.title}</p>
              </div>
            </Link>
          ))}
          <Link href="/news" className="flex items-center justify-between px-4 py-3 no-underline group hover:bg-white/[0.03] transition-colors">
            <span className="text-[13px] text-gray-500 group-hover:text-white transition-colors">See more stories</span>
            <svg className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Mini market widget */}
        <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#141418] p-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-3">Markets</h3>
          {[
            { label: 'LRD/USD', value: '192.50', pct: '+0.65%', up: true },
            { label: 'Iron Ore', value: '$108.50', pct: '-2.08%', up: false },
            { label: 'Rubber', value: '$1.72/kg', pct: '+2.38%', up: true },
            { label: 'Gold', value: '$3,108', pct: '+1.12%', up: true },
            { label: 'Palm Oil', value: '$922/t', pct: '-1.40%', up: false },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <span className="text-[12px] font-semibold text-white">{r.label}</span>
              <div className="text-right">
                <div className="text-[12px] tabular-nums text-white">{r.value}</div>
                <div className={`text-[11px] font-bold tabular-nums ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>{r.pct}</div>
              </div>
            </div>
          ))}
          <Link href="/economy" className="mt-3 block text-center text-[12px] text-gray-500 hover:text-white transition-colors no-underline">Full markets ›</Link>
        </div>

        {/* In Focus topics */}
        <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#141418] p-4">
          <h3 className="text-[13px] font-bold text-white mb-3">In Focus</h3>
          <div className="flex flex-wrap gap-2">
            {['Iron Ore', 'LRD/USD', 'Rubber', 'CBL Rate', 'Remittances', 'ECOWAS', 'Mining Policy', 'Inflation', 'Gold', 'ESG Bonds'].map(t => (
              <Link key={t} href="/news" className="rounded-lg border border-white/20 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-white/[0.06] transition-colors no-underline">{t}</Link>
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
        <span className={`text-[11px] font-bold uppercase tracking-wide ${CATEGORY_COLORS[item.category] ?? 'text-white'}`}>{item.category}</span>
      </div>
      <div className="absolute top-4 right-4 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white tabular-nums">
        {idx + 1} / {slides.length}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <Link href={`/news/${item.id}`} className="no-underline">
          <h2 className="text-[22px] font-bold leading-snug text-white hover:text-white/80 transition-colors drop-shadow-lg line-clamp-3">{item.title}</h2>
        </Link>
        <p className="mt-1.5 text-[13px] text-white/60 line-clamp-1">{item.source} · {timeAgo(item.date)}</p>
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
            <span className={`text-[10px] font-bold uppercase tracking-wide ${CATEGORY_COLOR[item.category] ?? 'text-white/60'}`}>{item.category}</span>
            <h3 className="mt-0.5 text-[13px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3">{item.title}</h3>
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
    <div className="flex flex-col divide-y divide-white/[0.05]">
      {items.map((item) => (
        <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-4 py-4 first:pt-0 no-underline">
          <NewsThumbnail category={item.category} className="shrink-0 h-[90px] w-[140px] rounded-xl" />
          <div className="min-w-0 flex-1">
            <span className={`text-[10px] font-bold uppercase tracking-wide ${CATEGORY_COLOR[item.category] ?? 'text-white/60'}`}>{item.category}</span>
            <h3 className="mt-0.5 text-[15px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2">{item.title}</h3>
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
    <aside className="hidden xl:block w-[300px] shrink-0">
      <div className="sticky top-[120px] flex flex-col gap-5">

        {/* Newsletter */}
        <div className="rounded-xl border border-white/[0.07] bg-[#141418] p-5">
          <h3 className="text-[14px] font-bold text-white mb-1">TrueRate Daily Brief</h3>
          <p className="text-[12px] text-gray-500 mb-3">Liberia business & economy, delivered every morning.</p>
          <input type="email" placeholder="Email address"
            className="w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2.5 text-[13px] text-white placeholder:text-gray-400 outline-none focus:border-white/30 transition-colors mb-2" />
          <button className="w-full rounded-lg bg-white py-2.5 text-[13px] font-semibold text-[#0a0a0d] hover:brightness-90 transition">Subscribe</button>
        </div>

        {/* Upcoming events */}
        <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
          <div className="px-4 py-3.5 border-b border-white/[0.05]">
            <h3 className="text-[13px] font-bold text-white">Upcoming Events</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {[
              { date: 'Apr 7',  label: 'CBL Monetary Policy Meeting',     type: 'Policy' },
              { date: 'Apr 10', label: 'Q1 GDP Advance Estimate',          type: 'Economy' },
              { date: 'Apr 14', label: 'Mid-Year Budget Review',            type: 'Policy' },
              { date: 'Apr 14', label: 'Liberia Investment Forum',          type: 'Trade' },
              { date: 'Apr 18', label: 'World Bank Country Dialogue',       type: 'Development' },
              { date: 'Apr 22', label: 'ArcelorMittal Q1 Earnings Call',    type: 'Markets' },
            ].map((ev, i) => (
              <Link key={i} href="/economy" className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-white/[0.02] transition-colors">
                <div className="shrink-0 rounded-lg bg-white/[0.05] border border-white/[0.06] px-2 py-1 text-center min-w-[40px]">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">{ev.date.split(' ')[0]}</p>
                  <p className="text-[14px] font-black text-white leading-none">{ev.date.split(' ')[1]}</p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors leading-snug">{ev.label}</p>
                  <span className="mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase bg-white/[0.06] text-white/60">{ev.type}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Most read */}
        <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
          <div className="px-4 py-3.5 border-b border-white/[0.05]">
            <h3 className="text-[13px] font-bold text-white">Most Read</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {newsItems.slice(0, 5).map((item, i) => (
              <Link key={item.id} href={`/news/${item.id}`} className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-white/[0.02] transition-colors">
                <span className="shrink-0 text-[20px] font-black text-white/10 tabular-nums w-5 leading-none pt-0.5">{i + 1}</span>
                <p className="text-[12px] font-semibold leading-snug text-white/80 group-hover:text-white transition-colors line-clamp-3">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Premium CTA */}
        <div className="rounded-xl border border-white/[0.12] bg-gradient-to-br from-white/[0.06] to-transparent p-5">
          <h3 className="text-[14px] font-bold text-white mb-1">Go Premium</h3>
          <p className="text-[12px] text-gray-500 mb-4">Unlock deep-dive analysis, exclusive data, and ad-free reading.</p>
          <Link href="/signin" className="block w-full rounded-lg bg-white py-2.5 text-center text-[13px] font-semibold text-[#0a0a0d] hover:bg-white/90 transition no-underline">
            See plans
          </Link>
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
    <main className="mx-auto max-w-[1320px] px-4 py-6">

      {/* ── Search results view ── */}
      {query && (
        <div className="mb-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-[22px] font-bold text-white">
                Search results for{' '}
                <span className="text-[#a78bfa]">&ldquo;{query}&rdquo;</span>
              </h1>
              <p className="mt-1 text-[13px] text-gray-500">
                {searchResults.length} article{searchResults.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <Link href="/news" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">
              ← All news
            </Link>
          </div>

          {searchResults.length === 0 ? (
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] p-10 text-center">
              <h2 className="mb-1 text-[16px] font-bold text-white">No results found</h2>
              <p className="text-[13px] text-gray-500">
                Try searching for &ldquo;inflation&rdquo;, &ldquo;forex&rdquo;, &ldquo;rubber&rdquo; or &ldquo;CBL&rdquo;.
              </p>
            </div>
          ) : (
            <div className="flex gap-6">
              <div className="flex-1 min-w-0 flex flex-col divide-y divide-white/[0.05] rounded-xl border border-white/[0.07] bg-[#141418] px-5">
                {searchResults.map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-4 py-4 first:pt-5 last:pb-5 no-underline">
                    <NewsThumbnail category={item.category} className="shrink-0 h-[90px] w-[140px] rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${CATEGORY_COLOR[item.category] ?? 'text-white/60'}`}>
                        {item.category}
                      </span>
                      <h3 className="mt-0.5 text-[15px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2">
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
      <div className="mb-5 flex items-center gap-0 rounded-xl border border-white/[0.06] bg-[#141418] overflow-hidden">
        <div className="shrink-0 bg-emerald-500 px-3 py-2.5 z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Live</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="ticker-scroll flex w-max">
            {[...BREAKING, ...BREAKING].map((b, i) => (
              <Link key={i} href="/news" className="flex items-center gap-2 px-5 py-2.5 no-underline whitespace-nowrap group shrink-0 border-l border-white/[0.06]">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{b.label}</span>
                <span className="text-[12px] text-gray-400 group-hover:text-white transition-colors">{b.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex gap-6">

        {/* Left: Trending */}
        <TrendingPanel />

        {/* Center: main feed */}
        <div className="flex-1 min-w-0">

          {/* Hero carousel */}
          <HeroCarousel />

          {/* 3 sub-stories */}
          <SubStoryRow />

          {/* Tab bar + feed */}
          <div className="mt-8 mb-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[18px] font-bold text-white">For You</h2>
              <div className="hidden sm:flex items-center gap-1 rounded-lg border border-white/[0.08] p-0.5">
                {['Feed', 'Cards'].map(v => (
                  <button key={v} className="px-3 py-1 rounded text-[12px] font-medium text-gray-500 hover:text-white transition-colors">{v}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-0 overflow-x-auto border-b border-white/[0.06] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === tab ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <FeedList tab={activeTab} />

          {/* More Stories grid */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-white">More Stories</h2>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">All stories ›</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden divide-x divide-white/[0.05]">
              {newsItems.slice(0, 4).map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col gap-2.5 p-4 no-underline hover:bg-white/[0.02] transition-colors">
                  <div className="overflow-hidden rounded-lg">
                    <NewsThumbnail category={item.category} className="w-full h-[80px]" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-white/35">{item.category}</div>
                  <h3 className="text-[12px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3">{item.title}</h3>
                  <div className="text-[10px] text-gray-400 mt-auto">{item.source} · {timeAgo(item.date)}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Videos strip */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-white">Videos</h2>
              <Link href="/videos" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">View all ›</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {VIDEOS.map((v, i) => (
                <Link key={i} href="/videos" className="group flex flex-col no-underline">
                  <div className="relative overflow-hidden rounded-xl mb-2">
                    <VideoThumbnail category={v.category} duration={v.duration} className="w-full h-[110px]" />
                  </div>
                  <h3 className="text-[12px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-1">{v.title}</h3>
                  <span className="text-[11px] text-gray-400">{v.time}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Analysis & Opinion */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-white">Analysis &amp; Opinion</h2>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">View all ›</Link>
            </div>
            <div className="flex flex-col divide-y divide-white/[0.05]">
              {OPINION.map((op, i) => (
                <Link key={i} href="/news" className="group flex items-center gap-4 py-4 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-full">
                    <AuthorAvatar name={op.author} className="h-11 w-11 rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[14px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-1">{op.title}</h3>
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
              <h2 className="text-[17px] font-bold text-white">From West Africa</h2>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">More regional news ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WEST_AFRICA.map((w, i) => (
                <Link key={i} href="/news" className="group flex gap-3 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-xl">
                    <NewsThumbnail category="economy" className="h-[80px] w-[120px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">{w.country}</span>
                    <h3 className="mt-0.5 text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1">{w.title}</h3>
                    <div className="text-[11px] text-gray-400">{w.source} · {w.time}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Data Stories */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-white">Data Stories</h2>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DATA_STORIES.map((s, i) => (
                <Link key={i} href="/news" className="group flex flex-col no-underline rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
                  <div className="relative overflow-hidden">
                    <NewsThumbnail category={s.category} className="w-full h-[120px]" />
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-[32px] font-black text-white tabular-nums leading-none">{s.stat}</span>
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">{s.statLabel}</span>
                    </div>
                    <h3 className="text-[12px] font-semibold leading-snug text-white/80 group-hover:text-white transition-colors line-clamp-3 mb-1.5">{s.title}</h3>
                    <span className="text-[11px] text-gray-400">{s.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* From the Archives */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-white">From the Archives</h2>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">Browse archive ›</Link>
            </div>
            <div className="flex flex-col divide-y divide-white/[0.05]">
              {ARCHIVES.map((a, i) => (
                <Link key={i} href="/news" className="group flex gap-4 py-4 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-xl">
                    <NewsThumbnail category={a.category} className="h-[80px] w-[120px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[14px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-1.5">{a.title}</h3>
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
              <h2 className="text-[17px] font-bold text-white">Community Voices</h2>
              <Link href="/news" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {COMMUNITY_VOICES.map((cv, i) => (
                <Link key={i} href="/news" className="group flex flex-col no-underline rounded-xl border border-white/[0.07] bg-[#141418] p-5">
                  <h3 className="text-[14px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-2">{cv.title}</h3>
                  <p className="text-[12px] text-gray-500 line-clamp-3 mb-4 flex-1">{cv.excerpt}</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                    <div className="shrink-0 overflow-hidden rounded-full">
                      <AuthorAvatar name={cv.author} className="h-8 w-8 rounded-full" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-white/80 truncate">{cv.author}</p>
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
              <h2 className="text-[17px] font-bold text-white">Upcoming Economic Events</h2>
              <Link href="/economy" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">Full calendar ›</Link>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden divide-y divide-white/[0.05]">
              {UPCOMING_EVENTS.map((ev, i) => (
                <Link key={i} href="/economy" className="group flex items-center gap-4 px-5 py-3.5 no-underline hover:bg-white/[0.03] transition-colors">
                  <span className="shrink-0 w-[52px] text-[12px] font-bold text-emerald-400 tabular-nums">{ev.date}</span>
                  <p className="flex-1 text-[13px] font-semibold text-white/80 group-hover:text-white transition-colors leading-snug">{ev.title}</p>
                  <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase bg-white/[0.06] text-white/60">{ev.type}</span>
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
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={null}>
      <NewsPageInner />
    </Suspense>
  );
}
