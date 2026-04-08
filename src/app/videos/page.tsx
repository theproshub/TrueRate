'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ── data ── */
const HERO = {
  title: "CBL Governor on rate outlook: 'We're watching food prices closely'",
  desc: 'The Central Bank of Liberia Governor addresses concerns around food inflation and its impact on monetary policy decisions.',
  duration: '2:48',
  thumb: 'https://picsum.photos/seed/v-hero/900/506',
  source: 'TrueRate Video',
  time: '55m ago',
  tags: ['LRD=X', 'CBL'],
};

const LATEST = [
  { title: 'ArcelorMittal Nimba expansion — what it means for Liberia GDP', duration: '1:52', thumb: 'https://picsum.photos/seed/vl1/400/225', time: '3h ago', tags: ['MT'] },
  { title: 'Rubber prices surge: Firestone investors react to record output', duration: '3:14', thumb: 'https://picsum.photos/seed/vl2/400/225', time: '8h ago', tags: ['RUB'] },
  { title: 'Diaspora remittances hit $680M — a new record for Liberia', duration: '2:31', thumb: 'https://picsum.photos/seed/vl3/400/225', time: '12h ago', tags: ['USD'] },
  { title: 'Ecobank West Africa Q1 earnings: What analysts are saying', duration: '4:05', thumb: 'https://picsum.photos/seed/vl4/400/225', time: '1d ago', tags: ['ETI'] },
];

const ORIGINALS = [
  { show: 'Morning Brief', title: 'Markets Open — Liberia Edition', thumb: 'https://picsum.photos/seed/orig1/600/340', duration: '18:22', ep: 'Ep. 214' },
  { show: 'Market Catalysts', title: 'Iron Ore Prices and the West Africa Mining Boom', thumb: 'https://picsum.photos/seed/orig2/600/340', duration: '24:15', ep: 'Ep. 88' },
  { show: 'Opening Bid', title: "Liberia's 2026 Budget: Winners and Losers", thumb: 'https://picsum.photos/seed/orig3/600/340', duration: '31:07', ep: 'Ep. 52' },
];

const EDITORS_PICKS = [
  { title: 'Liberia infrastructure bonds — who\'s buying?', duration: '2:19', thumb: 'https://picsum.photos/seed/ep1/400/225', source: 'TrueRate Video', time: '2d ago' },
  { title: 'Port of Monrovia expansion: $200M project breaks ground', duration: '3:44', thumb: 'https://picsum.photos/seed/ep2/400/225', source: 'Reuters Africa', time: '3d ago' },
  { title: 'Rice import tariffs: a breakdown for consumers and traders', duration: '2:07', thumb: 'https://picsum.photos/seed/ep3/400/225', source: 'TrueRate Video', time: '4d ago' },
  { title: 'ECOWAS trade deal — what Liberian exporters need to know', duration: '5:11', thumb: 'https://picsum.photos/seed/ep4/400/225', source: 'Bloomberg Africa', time: '5d ago' },
];

const MARKET_INSIGHTS = [
  { title: 'Gold rally continues: Liberian miners positioned to benefit', duration: '2:55', thumb: 'https://picsum.photos/seed/mi1/400/225', source: 'TrueRate Video', time: '6h ago' },
  { title: 'African Development Bank raises Liberia growth forecast to 5.8%', duration: '1:47', thumb: 'https://picsum.photos/seed/mi2/400/225', source: 'AfDB', time: '1d ago' },
  { title: 'Palm oil markets: West Africa supply update', duration: '3:22', thumb: 'https://picsum.photos/seed/mi3/400/225', source: 'TrueRate Video', time: '2d ago' },
  { title: "Mobile money in Liberia: Orange Money's record Q1 numbers", duration: '2:40', thumb: 'https://picsum.photos/seed/mi4/400/225', source: 'Pulse Africa', time: '3d ago' },
];

const TABS = ['Latest', 'Originals', "Editor's Picks", 'Market Insights', 'Economy', 'Policy'];

function PlayButton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'h-14 w-14' : size === 'sm' ? 'h-8 w-8' : 'h-11 w-11';
  const icon = size === 'lg' ? 'h-6 w-6' : size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  return (
    <div className={`flex ${dim} items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110 group-hover:bg-black/80`}>
      <svg className={`${icon} translate-x-0.5 text-white`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
}

function Duration({ label }: { label: string }) {
  return (
    <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">
      {label}
    </span>
  );
}

function VideoCard({ title, duration, thumb, source, time }: { title: string; duration: string; thumb: string; source?: string; time: string }) {
  return (
    <Link href="/videos" className="group flex flex-col no-underline">
      <div className="relative overflow-hidden rounded-xl mb-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb} alt="" className="w-full h-[140px] object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayButton size="sm" />
        </div>
        <Duration label={duration} />
      </div>
      <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-1.5">{title}</h3>
      <div className="text-[11px] text-gray-600">{source ? `${source} · ` : ''}{time}</div>
    </Link>
  );
}

export default function VideosPage() {
  const [activeTab, setActiveTab] = useState('Latest');

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">

      {/* Page title + tabs */}
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-white mb-4">Videos</h1>
        <div className="flex gap-0 border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map(tab => (
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

      {/* Hero + Latest list */}
      <div className="flex flex-col lg:flex-row gap-5 mb-10">

        {/* Hero video */}
        <Link href="/videos" className="group relative flex-1 min-w-0 overflow-hidden -mx-2 sm:mx-0 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO.thumb} alt="" className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" style={{ aspectRatio: '16/9' }} />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayButton size="lg" />
          </div>
          <Duration label={HERO.duration} />
          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              {HERO.tags.map(t => (
                <span key={t} className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70 uppercase tracking-wide">{t}</span>
              ))}
            </div>
            <h2 className="text-[20px] font-bold leading-snug text-white mb-2 line-clamp-2">{HERO.title}</h2>
            <p className="text-[13px] text-white/60 line-clamp-2 mb-3">{HERO.desc}</p>
            <div className="text-[12px] text-white/50">{HERO.source} · {HERO.time}</div>
          </div>
        </Link>

        {/* Latest list */}
        <div className="w-full lg:w-[300px] shrink-0 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-white uppercase tracking-wide">Latest</h3>
            <Link href="/videos" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">View more ›</Link>
          </div>
          <div className="flex flex-col divide-y divide-white/[0.05] flex-1">
            {LATEST.map((v, i) => (
              <Link key={i} href="/videos" className="group flex gap-3 py-3 first:pt-0 no-underline">
                <div className="relative shrink-0 overflow-hidden rounded-lg w-[110px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.thumb} alt="" className="w-full h-[62px] object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayButton size="sm" />
                  </div>
                  <Duration label={v.duration} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[12px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1">{v.title}</h4>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {v.tags.map(t => (
                      <span key={t} className="text-[10px] font-bold text-emerald-400">{t}</span>
                    ))}
                  </div>
                  <div className="text-[11px] text-gray-600">{v.time}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* TrueRate Originals */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-bold text-white">TrueRate Original Shows</h2>
          <Link href="/videos" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">View all ›</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ORIGINALS.map((v, i) => (
            <Link key={i} href="/videos" className="group relative overflow-hidden rounded-2xl no-underline">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.thumb} alt="" className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" style={{ aspectRatio: '16/9' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayButton size="md" />
              </div>
              <Duration label={v.duration} />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">{v.show} · {v.ep}</div>
                <h3 className="text-[14px] font-bold leading-snug text-white line-clamp-2">{v.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editor's Picks */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-bold text-white">Editor&apos;s Picks</h2>
          <Link href="/videos" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">View more ›</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {EDITORS_PICKS.map((v, i) => (
            <VideoCard key={i} {...v} />
          ))}
        </div>
      </section>

      {/* Investing & Market Insights */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-bold text-white">Investing &amp; Market Insights</h2>
          <Link href="/videos" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">View more ›</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MARKET_INSIGHTS.map((v, i) => (
            <VideoCard key={i} {...v} />
          ))}
        </div>
      </section>

      {/* Live & Upcoming */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-bold text-white">Live &amp; Upcoming</h2>
          <Link href="/videos" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">View schedule ›</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'CBL Press Conference: Q2 Monetary Policy Decision', channel: 'TrueRate Live', time: '10:00 AM', date: 'Apr 7', seed: 'live1', badge: 'LIVE TODAY' },
            { title: 'ECOWAS Finance Ministers Summit — Opening Remarks', channel: 'TrueRate Live', time: '2:30 PM', date: 'Apr 7', seed: 'live2', badge: 'UPCOMING' },
            { title: "Liberia Stock Exchange: Opening Bell & Q1 Earnings Roundup", channel: 'LSE Channel', time: '9:00 AM', date: 'Apr 8', seed: 'live3', badge: 'UPCOMING' },
            { title: 'Iron Ore Investor Day — ArcelorMittal Nimba Expansion', channel: 'TrueRate Live', time: '11:00 AM', date: 'Apr 9', seed: 'live4', badge: 'UPCOMING' },
          ].map((item, i) => (
            <Link key={i} href="/videos" className="group block rounded-xl overflow-hidden border border-white/[0.07] bg-[#141418] hover:border-white/[0.15] transition-colors no-underline">
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://picsum.photos/seed/${item.seed}/400/225`} alt="" className="w-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ aspectRatio: '16/9' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2 left-2">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${item.badge === 'LIVE TODAY' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/80 backdrop-blur-sm'}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayButton size="md" />
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-2">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-semibold">{item.channel}</span>
                  <span className="text-[11px] text-gray-500 tabular-nums">{item.time} · {item.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Business Explainers */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-bold text-white">Business Explainers</h2>
          <Link href="/videos" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">View all ›</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              title: 'How the CBL Sets Interest Rates — A Plain-English Guide',
              duration: '14:32',
              desc: 'Walk through the full monetary policy transmission mechanism, from the MPC vote to the impact on your savings account and business loan rates.',
              seed: 'expl1',
              label: 'Explainer',
            },
            {
              title: "Liberia's Balance of Payments: Why Exports & Remittances Matter",
              duration: '18:07',
              desc: 'An accessible breakdown of current account dynamics — who sends money in, who spends it on imports, and what that means for the LRD exchange rate.',
              seed: 'expl2',
              label: 'Deep Dive',
            },
            {
              title: 'Understanding the Liberia Stock Exchange — From IPO to Trading',
              duration: '22:45',
              desc: 'Everything a first-time investor needs to know: how shares are listed, how prices are set, and how to place your first trade on the LSE.',
              seed: 'expl3',
              label: 'Beginner Guide',
            },
          ].map((item, i) => (
            <Link key={i} href="/videos" className="group flex flex-col rounded-xl overflow-hidden border border-white/[0.07] bg-[#141418] hover:border-white/[0.15] transition-colors no-underline">
              <div className="relative overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://picsum.photos/seed/${item.seed}/600/340`} alt="" className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" style={{ aspectRatio: '16/9' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayButton size="md" />
                </div>
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">{item.duration}</span>
                <span className="absolute top-2 left-2 rounded bg-[#6001d2]/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">{item.label}</span>
              </div>
              <div className="flex flex-col flex-1 p-4">
                <h3 className="text-[14px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-3 flex-1">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Podcasts */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-bold text-white">Podcasts</h2>
          <Link href="/videos" className="text-[13px] text-gray-500 hover:text-white transition-colors no-underline">All episodes ›</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            { title: 'The Monrovia Money Show', ep: 'Ep. 112', duration: '38:14', seed: 'pod1', desc: 'Rates, rubber, and the road to fiscal balance — this week\'s deep dive with the FM.' },
            { title: 'West Africa Markets Weekly', ep: 'Ep. 67',  duration: '44:02', seed: 'pod2', desc: 'Regional macro wrap: Nigeria\'s fiscal deficit, Ghana\'s IMF review, and LRD watch.' },
            { title: 'The Liberia Investor Podcast', ep: 'Ep. 29', duration: '51:30', seed: 'pod3', desc: 'Venture capital in Monrovia: three founders share how they\'re raising in 2026.' },
            { title: 'CBL Conversations', ep: 'Ep. 18', duration: '27:55', seed: 'pod4', desc: 'Official commentary from Central Bank economists on monetary policy and FX reserves.' },
            { title: 'Trade Winds: Africa', ep: 'Ep. 44',  duration: '33:20', seed: 'pod5', desc: 'ECOWAS trade flows, port congestion at Monrovia, and iron ore shipping trends.' },
          ].map((pod, i) => (
            <Link key={i} href="/videos" className="group shrink-0 w-[200px] flex flex-col rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden hover:border-white/[0.15] transition-colors no-underline">
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://picsum.photos/seed/${pod.seed}/400/400`} alt="" className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayButton size="md" />
                </div>
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">{pod.duration}</span>
              </div>
              <div className="flex flex-col flex-1 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-400 mb-1">{pod.ep}</div>
                <h3 className="text-[12px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-1.5">{pod.title}</h3>
                <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed flex-1">{pod.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse all CTA */}
      <div className="flex justify-center py-8">
        <Link href="/videos" className="rounded-lg border border-white/20 px-8 py-3 text-[13px] font-semibold text-white hover:bg-white/[0.06] transition-colors no-underline">
          Browse all videos ›
        </Link>
      </div>

    </main>
  );
}
