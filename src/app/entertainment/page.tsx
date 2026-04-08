'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ── data ── */
const HERO = {
  category: 'Movies',
  title: "Nollywood's biggest week yet — 'Lagos After Midnight' breaks African box office records",
  summary: "The Nigerian thriller crossed $12M in its opening weekend across West Africa, becoming the highest-grossing African film ever produced outside South Africa.",
  source: 'TrueRate Entertainment',
  time: '2h ago',
  img: 'https://picsum.photos/seed/ent-hero/900/540',
};

const SUB_NAV = ['Movies', 'TV', 'Music', 'Celebrity', 'How To Watch'];

const STRIP_CARDS = [
  { category: 'Celebrity', title: "Davido and Wizkid spotted together at Accra's biggest music summit", source: 'Billboard Africa', time: '45m ago', img: 'https://picsum.photos/seed/ent-c1/400/240' },
  { category: 'Music', title: "Burna Boy's new album 'Coastal Road' debuts at No. 1 in 14 countries", source: 'Rolling Stone', time: '1h ago', img: 'https://picsum.photos/seed/ent-c2/400/240' },
  { category: 'TV', title: "Africa Magic greenlights second season of hit Liberian drama 'Pepper Coast'", source: 'The Guardian', time: '3h ago', img: 'https://picsum.photos/seed/ent-c3/400/240' },
  { category: 'Movies', title: "Cannes selects Cameroonian director's debut for main competition", source: 'Variety', time: '5h ago', img: 'https://picsum.photos/seed/ent-c4/400/240' },
  { category: 'Celebrity', title: "Tiwa Savage announces Monrovia stop on her 2026 West Africa tour", source: 'Pulse Africa', time: '6h ago', img: 'https://picsum.photos/seed/ent-c5/400/240' },
];

const TOP_PICKS = [
  { rank: 1, title: "Lagos After Midnight", type: 'Movie', score: 94, genre: 'Thriller' },
  { rank: 2, title: "Pepper Coast S2", type: 'TV', score: 91, genre: 'Drama' },
  { rank: 3, title: "Coastal Road", type: 'Album', score: 89, genre: 'Afrobeats' },
  { rank: 4, title: "The Monrovia Files", type: 'Movie', score: 86, genre: 'Documentary' },
  { rank: 5, title: "Accra Beat", type: 'TV', score: 84, genre: 'Reality' },
];

const FEED = [
  { category: 'Music', title: "How Afrobeats became the soundtrack of Liberia's economic boom", summary: "From market stalls in Waterside to rooftop bars in Sinkor, a new sound is defining a generation of young Liberians.", source: 'TrueRate', time: '12 min read', img: 'https://picsum.photos/seed/ent-f1/300/200' },
  { category: 'Celebrity', title: "Former 'Big Brother Naija' winner opens restaurant chain in Monrovia", summary: "Reality TV star Chukwuemeka Obi is betting on Liberia's growing dining scene with two new locations and a franchise deal.", source: 'FrontPage Africa', time: '5 min read', img: 'https://picsum.photos/seed/ent-f2/300/200' },
  { category: 'Movies', title: "A Liberian filmmaker just got shortlisted for a BAFTA — here's her story", summary: "Director Amara Kollie grew up in Paynesville and studied film in London. Her debut short is changing how the world sees Liberian storytelling.", source: 'The New Dawn', time: '8 min read', img: 'https://picsum.photos/seed/ent-f3/300/200' },
  { category: 'TV', title: "'Pepper Coast' writer on Season 2: 'We're going darker, deeper, and more Liberian'", summary: "Showrunner James Dahn talks about the new cast additions, filming in Buchanan, and why the show refused a Netflix offer.", source: 'TrueRate', time: '6 min read', img: 'https://picsum.photos/seed/ent-f4/300/200' },
  { category: 'Music', title: "Liberia's Gospel music scene is exporting globally — and the numbers prove it", summary: "Streaming data from Spotify and Apple Music shows Liberian gospel acts growing 210% year-on-year internationally.", source: 'Pulse Africa', time: '4 min read', img: 'https://picsum.photos/seed/ent-f5/300/200' },
  { category: 'Celebrity', title: "Meet the Liberian influencer with 4M followers who's never left Monrovia", summary: "Yatta Kamara documents daily life in Congo Town and has built one of West Africa's most-watched lifestyle brands.", source: 'Billboard Africa', time: '7 min read', img: 'https://picsum.photos/seed/ent-f6/300/200' },
  { category: 'How To Watch', title: "Every African streaming service ranked — which ones work in Liberia?", summary: "We tested 11 platforms over 30 days on MTN and Orange data to find which offers the best value for Liberian viewers.", source: 'TrueRate', time: '10 min read', img: 'https://picsum.photos/seed/ent-f7/300/200' },
];

const BOX_OFFICE = [
  { rank: 1, title: 'Lagos After Midnight', gross: '$14.2M', weeks: 3, trend: 'up' },
  { rank: 2, title: 'The Monrovia Files', gross: '$6.8M', weeks: 5, trend: 'down' },
  { rank: 3, title: 'Pepper Coast: The Movie', gross: '$4.1M', weeks: 2, trend: 'up' },
  { rank: 4, title: 'Accra Nights', gross: '$3.3M', weeks: 4, trend: 'down' },
  { rank: 5, title: 'Sacred Ground (Liberia)', gross: '$1.9M', weeks: 7, trend: 'down' },
];

const NEW_MUSIC = [
  { artist: 'Eddy Kenzo', album: 'East Meets West', date: 'Apr 1, 2026', genre: 'Afrobeats', img: 'https://picsum.photos/seed/nm1/200/200' },
  { artist: 'Mamy Victory', album: 'Monrovia Soul', date: 'Mar 28, 2026', genre: 'Gospel', img: 'https://picsum.photos/seed/nm2/200/200' },
  { artist: 'Mr. Eazi', album: 'Detty December Vol. 2', date: 'Mar 22, 2026', genre: 'Afropop', img: 'https://picsum.photos/seed/nm3/200/200' },
  { artist: 'Tiwa Savage', album: 'Coastal Road Remix EP', date: 'Mar 15, 2026', genre: 'R&B', img: 'https://picsum.photos/seed/nm4/200/200' },
];

const UPCOMING_EVENTS = [
  { date: 'Apr 12', event: 'Tiwa Savage Live in Monrovia', venue: 'Antoinette Tubman Stadium', status: 'On Sale', available: true },
  { date: 'Apr 19', event: 'Afrobeats Fest West Africa — Accra', venue: 'Accra Sports Stadium, Ghana', status: 'Limited', available: true },
  { date: 'May 3', event: 'Pepper Coast Season 2 Premiere Night', venue: 'Ducor Hotel, Monrovia', status: 'Invite Only', available: false },
  { date: 'May 17', event: 'Monrovia Jazz & Blues Festival', venue: 'Centennial Memorial Pavilion', status: 'On Sale', available: true },
  { date: 'Jun 7', event: 'Nollywood Night — Liberia Edition', venue: 'RLJ Kendeja Resort, Monrovia', status: 'Coming Soon', available: false },
];

const AWARDS_SEASON = [
  { name: 'AFRIMA Awards 2026', date: 'May 24', category: 'Music' },
  { name: 'Africa Movie Academy Awards', date: 'Jun 14', category: 'Film' },
  { name: 'Soundcity MVP Awards', date: 'Jul 5', category: 'Music' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Movies:        'text-orange-400',
  TV:            'text-blue-400',
  Music:         'text-purple-400',
  Celebrity:     'text-pink-400',
  'How To Watch':'text-cyan-400',
};

const CATEGORY_BG: Record<string, string> = {
  Movies:        'bg-orange-500/15 text-orange-400',
  TV:            'bg-blue-500/15 text-blue-400',
  Music:         'bg-purple-500/15 text-purple-400',
  Celebrity:     'bg-pink-500/15 text-pink-400',
  'How To Watch':'bg-cyan-500/15 text-cyan-400',
};

export default function EntertainmentPage() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">

      {/* Page header + sub-nav */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-[26px] font-bold text-white tracking-tight">Entertainment</h1>
        </div>
        {/* Sub-nav */}
        <div className="flex gap-0 border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {['All', ...SUB_NAV].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-5 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0">

          {/* Hero — image left, text right */}
          <Link href="/news" className="group flex flex-col lg:flex-row gap-0 rounded-2xl overflow-hidden border border-white/[0.07] bg-[#141418] no-underline mb-6 -mx-2 sm:mx-0">
            <div className="w-full lg:w-[55%] shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO.img} alt="" className="w-full h-[200px] sm:h-[260px] lg:h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <div className="flex flex-col justify-center px-5 py-6 lg:px-8 lg:py-8 flex-1">
              <span className={`mb-3 text-[11px] font-bold uppercase tracking-widest ${CATEGORY_COLORS[HERO.category] ?? 'text-white/50'}`}>
                {HERO.category}
              </span>
              <h2 className="text-[26px] font-black leading-snug text-white group-hover:text-white/80 transition-colors mb-4">
                {HERO.title}
              </h2>
              <p className="text-[14px] leading-relaxed text-gray-400 line-clamp-3 mb-4">{HERO.summary}</p>
              <div className="flex items-center gap-2 mt-auto text-[12px] text-gray-500">
                <span>{HERO.source}</span>
                <span className="text-gray-700">·</span>
                <span className="text-gray-600">{HERO.time}</span>
              </div>
            </div>
          </Link>

          {/* Horizontal card strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {STRIP_CARDS.map((card, i) => (
              <Link key={i} href="/news" className="group flex flex-col no-underline">
                <div className="overflow-hidden rounded-xl mb-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.img} alt="" className="w-full h-[120px] object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${CATEGORY_COLORS[card.category] ?? 'text-white/40'}`}>
                  {card.category}
                </span>
                <h3 className="text-[12px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 flex-1">
                  {card.title}
                </h3>
                <div className="mt-1.5 text-[11px] text-gray-600">{card.source} · {card.time}</div>
              </Link>
            ))}
          </div>

          {/* Top Picks ranking */}
          <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden mb-8">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold text-white">Top Picks: Best of West Africa right now</h2>
              </div>
              <Link href="/news" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">
                View full ranking ›
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-white/[0.05]">
              {TOP_PICKS.map(item => (
                <Link key={item.rank} href="/news" className="group flex flex-col items-center text-center p-5 no-underline hover:bg-white/[0.02] transition-colors">
                  <div className="mb-3">
                    <span className="text-[42px] font-black text-white/8 leading-none tabular-nums select-none">{item.rank}</span>
                  </div>
                  <div className="w-full h-[90px] rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://picsum.photos/seed/rank-${item.rank}/200/200`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${
                    item.type === 'Movie' ? 'text-orange-400' :
                    item.type === 'TV' ? 'text-blue-400' : 'text-purple-400'
                  }`}>{item.type}</div>
                  <p className="text-[12px] font-bold text-white leading-snug mb-2 line-clamp-2">{item.title}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[13px] font-black text-white tabular-nums">{item.score}</span>
                    <span className="text-[10px] text-gray-600">/ 100</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Stories for you */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-[17px] font-bold text-white">Stories for you</h2>
            </div>
            <div className="flex flex-col divide-y divide-white/[0.05]">
              {FEED.map((item, i) => (
                <Link key={i} href="/news" className="group flex gap-4 py-5 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.img} alt="" className="h-[100px] w-[160px] object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide mb-1.5 ${CATEGORY_BG[item.category] ?? 'bg-white/10 text-white/50'}`}>
                      {item.category}
                    </span>
                    <h3 className="text-[16px] font-black leading-snug text-white group-hover:text-white/75 transition-colors mb-1.5 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-gray-500 line-clamp-2 mb-2">{item.summary}</p>
                    <div className="flex items-center gap-2 text-[12px] text-gray-600">
                      <span className="font-medium text-gray-500">{item.source}</span>
                      <span>·</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Box Office */}
          <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden mt-8 mb-8">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <h2 className="text-[15px] font-bold text-white">Box Office</h2>
              <span className="text-[11px] text-gray-600 uppercase tracking-wide font-bold">West Africa Weekend</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {BOX_OFFICE.map(film => (
                <Link key={film.rank} href="/news" className="group flex items-center gap-4 px-5 py-3.5 no-underline hover:bg-white/[0.02] transition-colors">
                  <span className="shrink-0 text-[22px] font-black text-white/10 tabular-nums w-6 leading-none">{film.rank}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-white group-hover:text-white/75 transition-colors truncate">{film.title}</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">Week {film.weeks} in release</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-black text-white tabular-nums">{film.gross}</p>
                    <p className={`text-[11px] font-bold mt-0.5 ${film.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {film.trend === 'up' ? '▲' : '▼'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* New Music Releases */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-[17px] font-bold text-white">New Music Releases</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {NEW_MUSIC.map((release, i) => (
                <Link key={i} href="/news" className="group flex flex-col no-underline rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden hover:border-white/20 transition-colors">
                  <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={release.img} alt="" className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-purple-500/15 text-purple-400 mb-1.5">{release.genre}</span>
                    <p className="text-[12px] font-bold text-white group-hover:text-white/75 transition-colors line-clamp-1">{release.album}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">{release.artist}</p>
                    <p className="text-[10px] text-gray-700 mt-1">{release.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden mb-8">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <h2 className="text-[15px] font-bold text-white">Upcoming Events</h2>
              <span className="text-[11px] text-gray-600 uppercase tracking-wide font-bold">Monrovia &amp; West Africa</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {UPCOMING_EVENTS.map((ev, i) => (
                <Link key={i} href="/news" className="group flex items-center gap-4 px-5 py-4 no-underline hover:bg-white/[0.02] transition-colors">
                  <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 leading-none">{ev.date.split(' ')[0]}</span>
                    <span className="text-[16px] font-black text-white leading-none mt-0.5">{ev.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-white group-hover:text-white/75 transition-colors line-clamp-1">{ev.event}</p>
                    <p className="text-[11px] text-gray-600 mt-0.5 truncate">{ev.venue}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    ev.available
                      ? ev.status === 'Limited' ? 'bg-orange-500/15 text-orange-400' : 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-white/[0.05] text-gray-600'
                  }`}>{ev.status}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right rail */}
        <aside className="hidden xl:block w-[280px] shrink-0">
          <div className="sticky top-[120px] flex flex-col gap-5">

            {/* Newsletter */}
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] p-5">
              <h3 className="text-[14px] font-bold text-white mb-1">Entertainment News</h3>
              <p className="text-[12px] text-gray-500 mb-3">Stay in the know on West Africa entertainment.</p>
              <input type="email" placeholder="Enter your email"
                className="w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2.5 text-[13px] text-white placeholder:text-gray-600 outline-none focus:border-white/30 transition-colors mb-2" />
              <button className="w-full rounded-lg bg-white py-2.5 text-[13px] font-semibold text-[#0a0a0d] hover:bg-white/90 transition">
                Sign up
              </button>
              <p className="mt-2 text-[10px] text-gray-700 text-center">A few times a week</p>
            </div>

            {/* Trending */}
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
              <div className="px-4 py-3.5 border-b border-white/[0.05]">
                <h3 className="text-[13px] font-bold text-white">Trending Now</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {[
                  { rank: 1, title: 'Davido × Wizkid summit', tag: 'Celebrity' },
                  { rank: 2, title: 'Burna Boy No.1 globally', tag: 'Music' },
                  { rank: 3, title: "Lagos After Midnight record", tag: 'Movies' },
                  { rank: 4, title: "Pepper Coast Season 2", tag: 'TV' },
                  { rank: 5, title: "Tiwa Savage Monrovia tour", tag: 'Celebrity' },
                ].map(t => (
                  <Link key={t.rank} href="/news" className="flex items-center gap-3 px-4 py-3 no-underline group hover:bg-white/[0.02] transition-colors">
                    <span className="shrink-0 text-[20px] font-black text-white/10 tabular-nums w-5 leading-none">{t.rank}</span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors line-clamp-2 leading-snug">{t.title}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${CATEGORY_COLORS[t.tag] ?? 'text-white/40'}`}>{t.tag}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* What to watch */}
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] p-4">
              <h3 className="text-[13px] font-bold text-white mb-3">What to Watch</h3>
              <div className="flex flex-col gap-3">
                {[
                  { title: 'Lagos After Midnight', where: 'Cinemas', type: 'Movie', img: 'https://picsum.photos/seed/wtw1/80/80' },
                  { title: 'Pepper Coast S2', where: 'Africa Magic', type: 'TV', img: 'https://picsum.photos/seed/wtw2/80/80' },
                  { title: 'The Monrovia Files', where: 'Netflix Africa', type: 'Doc', img: 'https://picsum.photos/seed/wtw3/80/80' },
                ].map((w, i) => (
                  <Link key={i} href="/news" className="flex items-center gap-3 no-underline group">
                    <div className="shrink-0 overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={w.img} alt="" className="h-12 w-12 object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-white group-hover:text-white/70 transition-colors line-clamp-1">{w.title}</p>
                      <p className="text-[11px] text-gray-600">{w.where} · {w.type}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/news" className="mt-4 block text-center text-[12px] text-gray-500 hover:text-white transition-colors no-underline">
                Full guide ›
              </Link>
            </div>

            {/* Awards Season */}
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
              <div className="px-4 py-3.5 border-b border-white/[0.05]">
                <h3 className="text-[13px] font-bold text-white">Awards Season</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {AWARDS_SEASON.map((award, i) => (
                  <Link key={i} href="/news" className="flex items-center gap-3 px-4 py-3 no-underline group hover:bg-white/[0.02] transition-colors">
                    <div className="shrink-0 flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                      <span className="text-[8px] font-bold uppercase text-gray-600 leading-none">{award.date.split(' ')[0]}</span>
                      <span className="text-[13px] font-black text-white leading-none mt-0.5">{award.date.split(' ')[1]}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors line-clamp-2 leading-snug">{award.name}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${CATEGORY_COLORS[award.category] ?? 'text-white/40'}`}>{award.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </aside>
      </div>
    </main>
  );
}
