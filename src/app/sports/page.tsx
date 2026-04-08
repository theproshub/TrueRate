'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ── data ── */
const SPORT_TABS = ['All', 'Football', 'Basketball', 'Athletics', 'Cricket', 'Tennis', 'Golf', 'Fantasy'];

const SCORES = [
  { home: 'Liberia', away: 'Ghana', homeScore: 2, awayScore: 1, status: 'FT', competition: 'WAFU Cup', sport: 'Football' },
  { home: 'Nigeria', away: 'Ivory Coast', homeScore: 0, awayScore: 0, status: '67\'', competition: 'AFCON Qual.', sport: 'Football' },
  { home: 'Monrovia FC', away: 'LISCR FC', homeScore: 1, awayScore: 1, status: 'HT', competition: 'LFA League', sport: 'Football' },
  { home: 'Rivers Hoopers', away: 'Bayelsa Wave', homeScore: 78, awayScore: 65, status: 'Q3', competition: 'NBL Africa', sport: 'Basketball' },
  { home: 'Senegal', away: 'Kenya', homeScore: 3, awayScore: 1, status: 'FT', competition: 'Africa Cup', sport: 'Cricket' },
];

const HERO = {
  category: 'Football',
  title: "Liberia qualifies for AFCON 2027 — Lone Star secures historic berth in dramatic finale",
  summary: "George Weah's national squad sealed qualification with a last-minute winner against Sierra Leone in front of a packed Antoinette Tubman Stadium, sending fans into rapturous celebration across Monrovia.",
  source: 'TrueRate Sports',
  time: '1h ago',
  img: 'https://picsum.photos/seed/sports-hero/900/506',
  label: 'Breaking',
};

const TOP_STORIES = [
  { category: 'Basketball', title: 'Rivers Hoopers sign Liberian point guard Marcus Pewee to 2-year deal', source: 'Hoops Africa', time: '2h ago', img: 'https://picsum.photos/seed/sp2/400/225' },
  { category: 'Football', title: "African Cup of Nations draw: Liberia lands in tough Group C with Egypt and Senegal", source: 'CAF Online', time: '4h ago', img: 'https://picsum.photos/seed/sp3/400/225' },
  { category: 'Athletics', title: 'Liberian sprinter Comfort Brown breaks West African 100m record in Dakar', source: 'World Athletics', time: '6h ago', img: 'https://picsum.photos/seed/sp4/400/225' },
];

const FEED = [
  { category: 'Football', title: 'LFA League Week 22 recap: Monrovia FC extend lead at the top', summary: 'A hat-trick from striker Emmanuel Kollie powered Monrovia FC to a 3-0 win that stretched their lead to seven points.', source: 'LFA', time: '3h ago', img: 'https://picsum.photos/seed/spf1/300/170' },
  { category: 'Football', title: "WAFU Cup: Liberia coach Wolo on the squad's evolution — 'These boys believe'", summary: "Head coach Wolo reflects on a transformed squad mentality after the Lone Star's emphatic group-stage run.", source: 'TrueRate Sports', time: '5h ago', img: 'https://picsum.photos/seed/spf2/300/170' },
  { category: 'Basketball', title: 'NBL Africa expansion: Two West African franchises to join 2027 season', summary: 'The NBA-backed league announces franchise expansion including a potential Monrovia-based team pending arena approval.', source: 'NBA Africa', time: '7h ago', img: 'https://picsum.photos/seed/spf3/300/170' },
  { category: 'Cricket', title: 'Liberia Cricket Association joins ICC Development Programme', summary: 'The ICC confirms Liberia as one of six new development nations, unlocking coaching funds and youth academies.', source: 'ICC', time: '9h ago', img: 'https://picsum.photos/seed/spf4/300/170' },
  { category: 'Tennis', title: "West African Tennis Tour: Monrovia Open to debut in August 2026", summary: 'The new ITF-sanctioned grass-court tournament will be held at the Liberia Tennis Federation complex in Sinkor.', source: 'ITF', time: '1d ago', img: 'https://picsum.photos/seed/spf5/300/170' },
  { category: 'Golf', title: "Liberia Golf Classic tees off with record 140-player field", summary: 'The annual tournament at Monrovia Golf Club draws the largest field in its 12-year history with players from 18 nations.', source: 'TrueRate Sports', time: '1d ago', img: 'https://picsum.photos/seed/spf6/300/170' },
];

const STANDINGS = [
  { pos: 1, team: 'Monrovia FC',   p: 22, w: 14, d: 5, l: 3,  pts: 47, form: ['W','W','W','D','W'] },
  { pos: 2, team: 'LISCR FC',      p: 22, w: 12, d: 6, l: 4,  pts: 42, form: ['W','D','W','L','W'] },
  { pos: 3, team: 'BYC FC',        p: 22, w: 11, d: 5, l: 6,  pts: 38, form: ['D','W','L','W','D'] },
  { pos: 4, team: 'Barrack Young', p: 22, w: 9,  d: 7, l: 6,  pts: 34, form: ['L','W','D','W','W'] },
  { pos: 5, team: 'FC Nimba',      p: 22, w: 8,  d: 6, l: 8,  pts: 30, form: ['W','L','D','L','W'] },
];

const UPCOMING = [
  { home: 'Liberia', away: 'Guinea', date: 'Apr 8', time: '18:00', competition: 'WAFU Cup SF' },
  { home: 'Monrovia FC', away: 'FC Nimba', date: 'Apr 9', time: '15:00', competition: 'LFA League' },
  { home: 'LISCR FC', away: 'BYC FC', date: 'Apr 10', time: '16:00', competition: 'LFA League' },
  { home: 'Rivers Hoopers', away: 'Monrovia Ballers', date: 'Apr 11', time: '20:00', competition: 'NBL Africa' },
];

const VIDEOS = [
  { title: "Lone Star's historic AFCON qualifier goal — extended highlights", duration: '4:22', thumb: 'https://picsum.photos/seed/sv1/400/225' },
  { title: 'Marcus Pewee NBA pre-draft workout — full session', duration: '8:15', thumb: 'https://picsum.photos/seed/sv2/400/225' },
  { title: 'Comfort Brown 100m world-record attempt: race breakdown', duration: '2:47', thumb: 'https://picsum.photos/seed/sv3/400/225' },
];

const PLAYER_SPOTLIGHT = [
  { name: 'Emmanuel Kollie', position: 'Striker', club: 'Monrovia FC', nationality: 'Liberia', stat: '18 Goals', statLabel: 'Season', img: 'https://picsum.photos/seed/ps1/300/300' },
  { name: 'Marcus Pewee', position: 'Point Guard', club: 'Rivers Hoopers', nationality: 'Liberia', stat: '22.4 PPG', statLabel: 'Avg', img: 'https://picsum.photos/seed/ps2/300/300' },
  { name: 'Comfort Brown', position: 'Sprinter', club: 'Team Liberia', nationality: 'Liberia', stat: '10.87s', statLabel: '100m PB', img: 'https://picsum.photos/seed/ps3/300/300' },
];

const TRANSFERS = [
  { player: 'Emmanuel Kollie', from: 'Monrovia FC', to: 'LISCR FC', status: 'Rumour', confirmed: false },
  { player: 'James Dolo', from: 'BYC FC', to: 'Barrack Young', status: 'Confirmed', confirmed: true },
  { player: 'Marcus Pewee', from: 'Free Agent', to: 'Rivers Hoopers', status: 'Done', confirmed: true },
  { player: 'Samuel Toe', from: 'FC Nimba', to: 'Monrovia FC', status: 'Rumour', confirmed: false },
  { player: 'Eric Kpah', from: 'LISCR FC', to: 'Club de Foot Abidjan', status: 'Confirmed', confirmed: true },
];

const ATHLETICS_STORIES = [
  { category: 'Athletics', title: 'Comfort Brown targets sub-10.8s at Dakar Diamond League', time: '4h ago', img: 'https://picsum.photos/seed/ath1/300/170' },
  { category: 'Cricket', title: 'Liberia U19 cricket side wins first ICC qualifying match', time: '8h ago', img: 'https://picsum.photos/seed/ath2/300/170' },
  { category: 'Tennis', title: 'Monrovia Open ITF draw revealed — six Liberian wildcards', time: '1d ago', img: 'https://picsum.photos/seed/ath3/300/170' },
  { category: 'Golf', title: 'Liberia Golf Classic: Day 2 leaderboard shows tight three-way tie', time: '2d ago', img: 'https://picsum.photos/seed/ath4/300/170' },
];

const TOP_SCORERS = [
  { rank: 1, name: 'Emmanuel Kollie', club: 'Monrovia FC', goals: 18 },
  { rank: 2, name: 'Roland Nah', club: 'LISCR FC', goals: 14 },
  { rank: 3, name: 'Joseph Gayflor', club: 'BYC FC', goals: 11 },
  { rank: 4, name: 'Samuel Toe', club: 'FC Nimba', goals: 9 },
  { rank: 5, name: 'Eric Kpah', club: 'LISCR FC', goals: 8 },
];

const SPORT_CALENDAR = [
  { event: 'WAFU Cup Semi-Final', date: 'Apr 8', sport: 'Football' },
  { event: 'NBL Africa Playoffs Begin', date: 'Apr 15', sport: 'Basketball' },
  { event: 'Dakar Diamond League', date: 'Apr 27', sport: 'Athletics' },
  { event: 'AFCON 2027 Qualifier Draw', date: 'May 10', sport: 'Football' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Football:   'text-emerald-400',
  Basketball: 'text-orange-400',
  Athletics:  'text-yellow-400',
  Cricket:    'text-blue-400',
  Tennis:     'text-cyan-400',
  Golf:       'text-lime-400',
};

const FORM_COLOR: Record<string, string> = {
  W: 'bg-emerald-500/20 text-emerald-400',
  D: 'bg-gray-500/20 text-gray-400',
  L: 'bg-red-500/20 text-red-400',
};

export default function SportsPage() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">

      {/* Page header + sport tabs */}
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-white mb-4">Sports</h1>
        <div className="flex gap-0 border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SPORT_TABS.map(tab => (
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

      {/* Scores ticker */}
      <div className="mb-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3 min-w-max">
          {SCORES.map((s, i) => (
            <Link key={i} href="/sports" className="group flex flex-col items-center rounded-xl border border-white/[0.07] bg-[#141418] px-4 py-3 no-underline hover:border-white/20 transition-colors min-w-[170px]">
              <div className="text-[10px] font-bold uppercase tracking-wide text-gray-600 mb-2">{s.competition}</div>
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-white truncate">{s.home}</div>
                  <div className="text-[13px] font-bold text-white truncate">{s.away}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-[14px] font-black tabular-nums ${s.homeScore > s.awayScore ? 'text-white' : 'text-gray-500'}`}>{s.homeScore}</div>
                  <div className={`text-[14px] font-black tabular-nums ${s.awayScore > s.homeScore ? 'text-white' : 'text-gray-500'}`}>{s.awayScore}</div>
                </div>
              </div>
              <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded ${s.status === 'FT' ? 'text-gray-500' : 'text-emerald-400 bg-emerald-400/10'}`}>
                {s.status}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0">

          {/* Hero story */}
          <Link href="/sports" className="group flex flex-col lg:flex-row gap-0 rounded-2xl overflow-hidden border border-white/[0.07] bg-[#141418] no-underline mb-6 -mx-2 sm:mx-0">
            <div className="w-full lg:w-[55%] shrink-0 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO.img} alt="" className="w-full h-[200px] sm:h-[260px] lg:h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            <div className="flex flex-col justify-center px-8 py-8 flex-1">
              <span className={`mb-3 text-[11px] font-bold uppercase tracking-widest ${CATEGORY_COLORS[HERO.category] ?? 'text-white/50'}`}>{HERO.category}</span>
              <h2 className="text-[20px] font-bold leading-snug text-white group-hover:text-white/80 transition-colors mb-3">{HERO.title}</h2>
              <p className="text-[14px] leading-relaxed text-gray-400 line-clamp-2 mb-3">{HERO.summary}</p>
              <div className="text-[12px] text-gray-500">{HERO.source} · {HERO.time}</div>
            </div>
          </Link>

          {/* Top stories — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {TOP_STORIES.map((s, i) => (
              <Link key={i} href="/sports" className="group flex flex-col no-underline">
                <div className="overflow-hidden rounded-xl mb-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt="" className="w-full h-[130px] object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${CATEGORY_COLORS[s.category] ?? 'text-white/40'}`}>{s.category}</span>
                <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 flex-1 mb-1.5">{s.title}</h3>
                <div className="text-[11px] text-gray-600">{s.source} · {s.time}</div>
              </Link>
            ))}
          </div>

          {/* News feed */}
          <div className="mb-6">
            <h2 className="text-[17px] font-bold text-white mb-4">Latest Stories</h2>
            <div className="flex flex-col divide-y divide-white/[0.05]">
              {FEED.map((item, i) => (
                <Link key={i} href="/sports" className="group flex gap-4 py-5 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.img} alt="" className="h-[90px] w-[150px] object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide mb-1 inline-block ${CATEGORY_COLORS[item.category] ?? 'text-white/40'}`}>{item.category}</span>
                    <h3 className="text-[15px] font-semibold leading-snug text-white group-hover:text-white/75 transition-colors mb-1.5 line-clamp-2">{item.title}</h3>
                    <p className="text-[13px] leading-relaxed text-gray-500 line-clamp-2 mb-2">{item.summary}</p>
                    <div className="text-[12px] text-gray-600">{item.source} · {item.time}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Videos strip */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-white">Videos</h2>
              <Link href="/videos" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">View all ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {VIDEOS.map((v, i) => (
                <Link key={i} href="/videos" className="group flex flex-col no-underline">
                  <div className="relative overflow-hidden rounded-xl mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.thumb} alt="" className="w-full h-[130px] object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 group-hover:bg-black/80 transition-colors">
                        <svg className="h-4 w-4 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">{v.duration}</span>
                  </div>
                  <h3 className="text-[12px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2">{v.title}</h3>
                </Link>
              ))}
            </div>
          </div>

          {/* Player Spotlight */}
          <div className="mt-8 mb-8">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-[17px] font-bold text-white">Player Spotlight</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PLAYER_SPOTLIGHT.map((player, i) => (
                <Link key={i} href="/sports" className="group flex flex-col rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden no-underline hover:border-white/20 transition-colors">
                  <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={player.img} alt="" className="w-full h-[160px] object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <p className="text-[14px] font-bold text-white group-hover:text-white/75 transition-colors">{player.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{player.position} · {player.club}</p>
                    <p className="text-[10px] text-gray-700 mt-0.5">{player.nationality}</p>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-[20px] font-black text-white tabular-nums">{player.stat}</span>
                      <span className="text-[10px] text-gray-600 uppercase tracking-wide font-bold">{player.statLabel}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Transfer News */}
          <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden mb-8">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <h2 className="text-[15px] font-bold text-white">Transfer News</h2>
              <span className="text-[11px] text-gray-600 uppercase tracking-wide font-bold">Latest rumours &amp; deals</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {TRANSFERS.map((t, i) => (
                <Link key={i} href="/sports" className="group flex items-center gap-3 px-5 py-3.5 no-underline hover:bg-white/[0.02] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-white group-hover:text-white/75 transition-colors">{t.player}</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      <span className="text-gray-400">{t.from}</span>
                      <span className="mx-1.5 text-gray-700">→</span>
                      <span className="text-gray-400">{t.to}</span>
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    t.status === 'Done' ? 'bg-emerald-500/15 text-emerald-400' :
                    t.status === 'Confirmed' ? 'bg-blue-500/15 text-blue-400' :
                    'bg-orange-500/15 text-orange-400'
                  }`}>{t.status}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Athletics & Other Sports */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-[17px] font-bold text-white">Athletics &amp; Other Sports</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ATHLETICS_STORIES.map((story, i) => (
                <Link key={i} href="/sports" className="group flex gap-3 rounded-xl border border-white/[0.07] bg-[#141418] p-3 no-underline hover:border-white/20 transition-colors">
                  <div className="shrink-0 overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={story.img} alt="" className="h-[80px] w-[110px] object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide mb-1 inline-block ${CATEGORY_COLORS[story.category] ?? 'text-white/40'}`}>{story.category}</span>
                    <h3 className="text-[12px] font-semibold leading-snug text-white group-hover:text-white/75 transition-colors line-clamp-3">{story.title}</h3>
                    <p className="text-[10px] text-gray-700 mt-1.5">{story.time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right rail */}
        <aside className="hidden xl:block w-[290px] shrink-0">
          <div className="sticky top-[120px] flex flex-col gap-5">

            {/* LFA Standings */}
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
                <div>
                  <h3 className="text-[13px] font-bold text-white">LFA League</h3>
                  <p className="text-[10px] text-gray-600">Liberia Football Association · Week 22</p>
                </div>
                <Link href="/sports" className="text-[11px] text-gray-500 hover:text-white transition-colors no-underline">Full table ›</Link>
              </div>
              <div className="px-4 py-2">
                <div className="flex text-[10px] font-bold uppercase tracking-wide text-gray-600 mb-1 px-0 gap-0">
                  <span className="w-5 shrink-0">#</span>
                  <span className="flex-1">Team</span>
                  <span className="w-5 text-center">P</span>
                  <span className="w-5 text-center">W</span>
                  <span className="w-5 text-center">D</span>
                  <span className="w-5 text-center">L</span>
                  <span className="w-8 text-right font-black">Pts</span>
                </div>
                {STANDINGS.map(row => (
                  <div key={row.pos} className="flex items-center py-2 border-t border-white/[0.03] text-[12px] gap-0">
                    <span className="w-5 shrink-0 text-gray-600 font-bold">{row.pos}</span>
                    <span className="flex-1 font-semibold text-white truncate pr-1">{row.team}</span>
                    <span className="w-5 text-center text-gray-500">{row.p}</span>
                    <span className="w-5 text-center text-gray-500">{row.w}</span>
                    <span className="w-5 text-center text-gray-500">{row.d}</span>
                    <span className="w-5 text-center text-gray-500">{row.l}</span>
                    <span className="w-8 text-right font-black text-white">{row.pts}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-white/[0.05]">
                <div className="flex gap-1.5 flex-wrap">
                  {STANDINGS[0].form.map((f, i) => (
                    <span key={i} className={`rounded text-[9px] font-black px-1.5 py-0.5 ${FORM_COLOR[f]}`}>{f}</span>
                  ))}
                  <span className="text-[10px] text-gray-600 ml-1 self-center">Last 5 (Leader)</span>
                </div>
              </div>
            </div>

            {/* Upcoming fixtures */}
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
                <h3 className="text-[13px] font-bold text-white">Upcoming Fixtures</h3>
                <Link href="/sports" className="text-[11px] text-gray-500 hover:text-white transition-colors no-underline">Full schedule ›</Link>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {UPCOMING.map((f, i) => (
                  <Link key={i} href="/sports" className="flex flex-col px-4 py-3 no-underline group hover:bg-white/[0.02] transition-colors">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-gray-600 mb-1">{f.competition}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-[12px] font-semibold text-white group-hover:text-white/80">{f.home} <span className="text-gray-600 font-normal">vs</span> {f.away}</div>
                    </div>
                    <div className="text-[11px] text-gray-600 mt-0.5">{f.date} · {f.time} WAT</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Fantasy promo */}
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] p-4">
              <h3 className="text-[13px] font-bold text-white mb-1">TrueRate Fantasy</h3>
              <p className="text-[12px] text-gray-500 mb-3">Pick your West Africa XI and compete weekly with real match data.</p>
              <Link href="/sports" className="block w-full rounded-lg bg-white py-2.5 text-center text-[13px] font-semibold text-[#0a0a0d] hover:bg-white/90 transition no-underline">
                Play now
              </Link>
            </div>

            {/* Top Scorers */}
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
                <div>
                  <h3 className="text-[13px] font-bold text-white">Top Scorers</h3>
                  <p className="text-[10px] text-gray-600">LFA League · 2025/26 Season</p>
                </div>
                <Link href="/sports" className="text-[11px] text-gray-500 hover:text-white transition-colors no-underline">Full list ›</Link>
              </div>
              <div className="px-4 py-2">
                <div className="flex text-[10px] font-bold uppercase tracking-wide text-gray-600 mb-1 gap-0">
                  <span className="w-5 shrink-0">#</span>
                  <span className="flex-1">Player</span>
                  <span className="w-16 truncate text-gray-700">Club</span>
                  <span className="w-6 text-right font-black">G</span>
                </div>
                {TOP_SCORERS.map(row => (
                  <Link key={row.rank} href="/sports" className="flex items-center py-2 border-t border-white/[0.03] text-[12px] gap-0 no-underline group hover:bg-white/[0.02] transition-colors -mx-4 px-4">
                    <span className="w-5 shrink-0 text-gray-600 font-bold">{row.rank}</span>
                    <span className="flex-1 font-semibold text-white truncate pr-1 group-hover:text-white/75 transition-colors">{row.name}</span>
                    <span className="w-16 text-gray-500 text-[11px] truncate">{row.club}</span>
                    <span className="w-6 text-right font-black text-emerald-400">{row.goals}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sport Calendar */}
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
              <div className="px-4 py-3.5 border-b border-white/[0.05]">
                <h3 className="text-[13px] font-bold text-white">Sport Calendar</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {SPORT_CALENDAR.map((ev, i) => (
                  <Link key={i} href="/sports" className="flex items-center gap-3 px-4 py-3 no-underline group hover:bg-white/[0.02] transition-colors">
                    <div className="shrink-0 flex flex-col items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                      <span className="text-[7px] font-bold uppercase text-gray-600 leading-none">{ev.date.split(' ')[0]}</span>
                      <span className="text-[12px] font-black text-white leading-none mt-0.5">{ev.date.split(' ')[1]}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors line-clamp-2 leading-snug">{ev.event}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${CATEGORY_COLORS[ev.sport] ?? 'text-white/40'}`}>{ev.sport}</span>
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
