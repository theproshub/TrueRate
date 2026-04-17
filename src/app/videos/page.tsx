'use client';

import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { VideoThumbnail, NewsThumbnail } from '@/components/NewsThumbnail';

/* ── data ── */
const HERO = {
  title: "From Zero to $4M: How Sandra Kollie Built Liberia's Fastest-Growing Logistics Company",
  desc: "TrueRate sits down with founder Sandra Kollie to talk grit, capital access, and what it really takes to scale a business in Monrovia's emerging market.",
  duration: '24:18',
  category: 'Entrepreneurship',
  source: 'TrueRate Interviews',
  time: '2h ago',
  badge: 'Featured Interview',
};

const LATEST = [
  { title: "Marcus Doe: Why I Left Wall Street to Build a Fintech in Monrovia", duration: '18:44', category: 'Technology', time: '4h ago' },
  { title: "5 Investing Mistakes Every Liberian First-Timer Makes — And How to Avoid Them", duration: '11:02', category: 'Investing', time: '7h ago' },
  { title: "ArcelorMittal CFO on Why They're Doubling Down on Liberia Through 2030", duration: '14:30', category: 'Business', time: '1d ago' },
  { title: "Orange Money's Record Quarter — VP of Digital Finance on What Comes Next", duration: '9:55', category: 'Technology', time: '1d ago' },
];

const ORIGINALS = [
  { show: 'The Founders Lab', title: "Building in Liberia: Three Entrepreneurs on Capital, Risk & the Long Game", category: 'Entrepreneurship', duration: '42:11', ep: 'Ep. 31' },
  { show: 'Invest Liberia', title: "Where to Put Your Money in 2026 — Equities, Real Estate, or Commodities?", category: 'Investing', duration: '28:47', ep: 'Ep. 19' },
  { show: 'The Leadership Circle', title: "Ecobank West Africa CEO on Leading Through Uncertainty in Emerging Markets", category: 'Leadership', duration: '35:22', ep: 'Ep. 14' },
];

const ENTREPRENEUR_SPOTLIGHTS = [
  { title: "How James Tarr Turned a $500 Idea into Liberia's Top Catering Brand", duration: '16:05', category: 'Entrepreneurship', source: 'TrueRate Interviews', time: '3d ago' },
  { title: "The Woman Digitising Liberia's Informal Market — One Receipt at a Time", duration: '20:33', category: 'Technology', source: 'TrueRate Interviews', time: '4d ago' },
  { title: "From Farming to Exporting: How One Bong County Family Built a $1M Agribusiness", duration: '13:48', category: 'Business', source: 'TrueRate Video', time: '5d ago' },
  { title: "Leadership Lessons from Liberia's Most Decorated Female CEO", duration: '22:10', category: 'Leadership', source: 'TrueRate Interviews', time: '6d ago' },
];

const INVESTING_INSIGHTS = [
  { title: "How to Build a Portfolio on the Liberia Stock Exchange With Under $500", duration: '17:20', category: 'Investing', source: 'TrueRate Video', time: '1d ago' },
  { title: "Gold, Rubber & Iron Ore: Which Commodity Play Makes Sense in 2026?", duration: '12:44', category: 'Investing', source: 'TrueRate Video', time: '2d ago' },
  { title: "AfDB Upgrades Liberia to 5.8% Growth — What It Means for Your Investments", duration: '8:55', category: 'Business', source: 'TrueRate Analysis', time: '3d ago' },
  { title: "Real Estate vs Equities in Monrovia: A Practical Guide for New Investors", duration: '19:07', category: 'Investing', source: 'TrueRate Video', time: '4d ago' },
];

const PODCASTS = [
  { title: 'The Monrovia Entrepreneur', ep: 'Ep. 88', duration: '44:02', category: 'Entrepreneurship', desc: "This week: bootstrapping vs. venture capital — which path is right for Liberian founders?" },
  { title: 'Founders & Funders', ep: 'Ep. 34', duration: '51:30', category: 'Technology', desc: "Three investors share what they're looking for in West Africa's startup ecosystem right now." },
  { title: 'West Africa Investor Weekly', ep: 'Ep. 112', duration: '38:14', category: 'Investing', desc: "LRD watch, equity picks, and the sectors TrueRate analysts are watching this quarter." },
  { title: 'The Leadership Brief', ep: 'Ep. 22', duration: '27:55', category: 'Leadership', desc: "Executive coach Dr. Pewu on the mindset shifts that separate good managers from great ones." },
  { title: 'Tech Disruptors: West Africa', ep: 'Ep. 17', duration: '33:20', category: 'Technology', desc: "Mobile money, AI adoption, and the infrastructure gap — Liberia's tech moment is now." },
];


const CAT_COLORS: Record<string, string> = {
  'Entrepreneurship': 'text-violet-400',
  'Technology':       'text-sky-400',
  'Investing':        'text-brand-accent',
  'Leadership':       'text-amber-400',
  'Business':         'text-rose-400',
  'Mining':           'text-orange-400',
};

function catColor(c: string) {
  return CAT_COLORS[c] ?? 'text-gray-400';
}

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

function SectionHeader({ title, sub, href, label = 'View all ›' }: { title: string; sub?: string; href?: string; label?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
      <div className="flex items-center gap-3">
        <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
        <div>
          <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">{title}</h2>
          {sub && <p className="text-[12px] text-gray-500 mt-0.5">{sub}</p>}
        </div>
      </div>
      {href !== undefined && (
        <Link href={href || '/videos'} className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline shrink-0">{label}</Link>
      )}
    </div>
  );
}

function VideoCard({ title, duration, category, source, time }: { title: string; duration: string; category: string; source?: string; time: string }) {
  return (
    <Link href="/videos" className="group flex gap-3.5 py-3.5 first:pt-0 no-underline">
      <div className="relative shrink-0 overflow-hidden rounded-lg">
        <VideoThumbnail category={category} duration={duration} className="h-[68px] w-[104px]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${catColor(category)}`}>{category}</div>
        <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-1">{title}</h3>
        <div className="text-[11px] text-gray-500">{source ? `${source} · ` : ''}{time}</div>
      </div>
    </Link>
  );
}

export default function VideosPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">

      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Videos' }]} />
      </div>

      {/* ── Hero + Latest ── */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12">

        {/* Hero */}
        <Link href="/videos" className="group flex-1 min-w-0 rounded-2xl no-underline block overflow-hidden">
          <div className="relative w-full" style={{ aspectRatio: '16/9', maxHeight: '420px' }}>
            <VideoThumbnail category={HERO.category} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayButton size="lg" />
            </div>
            {/* Badge */}
            <span className="absolute top-4 left-4 rounded-md bg-brand-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-brand-dark">
              {HERO.badge}
            </span>
            {/* Duration */}
            <span className="absolute top-4 right-4 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">
              {HERO.duration}
            </span>
            {/* Text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <h2 className="text-[18px] sm:text-[24px] font-black leading-tight text-white mb-2 line-clamp-2">{HERO.title}</h2>
              <p className="text-[13px] text-white/60 line-clamp-2 mb-3 max-w-[600px] hidden sm:block">{HERO.desc}</p>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="font-semibold text-white/70">{HERO.source}</span>
                <span className="text-white/30">·</span>
                <span className="text-white/40">{HERO.time}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Latest sidebar */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-white/40">Latest</span>
            <Link href="/videos" className="text-[11px] text-gray-500 hover:text-white transition-colors no-underline">View more ›</Link>
          </div>
          <div className="flex flex-col divide-y divide-white/[0.05] flex-1">
            {LATEST.map((v, i) => (
              <Link key={i} href="/videos" className="group flex gap-3 py-3 first:pt-0 no-underline">
                <div className="relative shrink-0 overflow-hidden rounded-lg w-[100px]">
                  <VideoThumbnail category={v.category} duration={v.duration} className="w-full h-[58px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-[10px] font-bold uppercase tracking-wide mb-0.5 ${catColor(v.category)}`}>{v.category}</div>
                  <h4 className="text-[12px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1">{v.title}</h4>
                  <div className="text-[11px] text-gray-500">{v.time}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── TrueRate Originals ── */}
      <section className="mb-12">
        <SectionHeader title="TrueRate Originals" sub="Exclusive series on business, entrepreneurship & investing" href="/videos" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ORIGINALS.map((v, i) => (
            <Link key={i} href="/videos" className="group relative overflow-hidden rounded-2xl no-underline block">
              <VideoThumbnail category={v.category} duration={v.duration} className="w-full aspect-video" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayButton size="md" />
              </div>
              <span className="absolute bottom-3 right-3 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">{v.duration}</span>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${catColor(v.category)}`}>{v.show} · {v.ep}</div>
                <h3 className="text-[14px] font-bold leading-snug text-white line-clamp-2">{v.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TrueRate Finance Network ── */}
      <section className="mb-12 -mx-4 px-4 py-8 bg-white/[0.02] border-y border-white/[0.05]">
        <div className="max-w-[1320px]">
          <SectionHeader title="TrueRate Finance Network" sub="Podcasts on entrepreneurship, investing, leadership & technology" href="/videos" label="All episodes ›" />
          <div className="divide-y divide-white/[0.06]">
            {PODCASTS.map((pod, i) => (
              <Link key={i} href="/videos" className="group flex gap-4 py-4 first:pt-0 no-underline">
                <div className="relative shrink-0 overflow-hidden w-[80px]">
                  <NewsThumbnail category={pod.category} className="w-full aspect-square" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayButton size="sm" />
                  </div>
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-semibold text-white tabular-nums">{pod.duration}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-[10px] font-black uppercase tracking-wide mb-0.5 ${catColor(pod.category)}`}>{pod.ep}</div>
                  <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-white/80 transition-colors line-clamp-2 mb-1">{pod.title}</h3>
                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{pod.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Entrepreneur Spotlights + Investing Insights ── */}
      <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <section>
          <SectionHeader title="Entrepreneur Spotlights" href="/videos" label="View more ›" />
          <div className="flex flex-col divide-y divide-white/[0.05]">
            {ENTREPRENEUR_SPOTLIGHTS.map((v, i) => (
              <VideoCard key={i} {...v} />
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Investing Insights" href="/videos" label="View more ›" />
          <div className="flex flex-col divide-y divide-white/[0.05]">
            {INVESTING_INSIGHTS.map((v, i) => (
              <VideoCard key={i} {...v} />
            ))}
          </div>
        </section>
      </div>

      {/* ── Live & Upcoming ── */}
      <section className="mb-12">
        <SectionHeader title="Live & Upcoming" href="/videos" label="View schedule ›" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Startup Pitch Live: Monrovia Edition — 8 Founders, One Stage', channel: 'TrueRate Live', time: '10:00 AM', date: 'Apr 7', category: 'Entrepreneurship', badge: 'LIVE NOW' },
            { title: "Liberia's Small Business Summit 2026 — Opening Keynote", channel: 'TrueRate Live', time: '2:30 PM', date: 'Apr 7', category: 'Leadership', badge: 'UPCOMING' },
            { title: 'CBL Governor Interview: Rates, Reserves & the Road Ahead', channel: 'TrueRate Interviews', time: '9:00 AM', date: 'Apr 8', category: 'Business', badge: 'UPCOMING' },
            { title: 'West Africa Tech Summit — Liberia Delegation Panel', channel: 'TrueRate Live', time: '11:00 AM', date: 'Apr 9', category: 'Technology', badge: 'UPCOMING' },
          ].map((item, i) => (
            <Link key={i} href="/videos" className="group flex flex-col no-underline">
              <div className="relative overflow-hidden mb-3">
                <VideoThumbnail category={item.category} className="w-full aspect-video" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2.5 left-2.5">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${item.badge === 'LIVE NOW' ? 'bg-red-600 text-white' : 'bg-black/70 text-white/60 border border-white/10'}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayButton size="sm" />
                </div>
              </div>
              <div className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${catColor(item.category)}`}>{item.category}</div>
              <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-1">{item.title}</h3>
              <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                <span>{item.channel}</span>
                <span>·</span>
                <span>{item.time} · {item.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Growth Playbook ── */}
      <section className="mb-10">
        <SectionHeader title="Growth Playbook" sub="Practical guides on building, investing & leading in Liberia" href="/videos" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { title: 'How to Register & Structure Your Business in Liberia — Step by Step', duration: '14:32', desc: 'From business registration at the Liberia Business Registry to choosing the right legal structure — a complete guide for first-time founders.', category: 'Entrepreneurship', label: 'Starter Guide' },
            { title: "Your First Investment in Liberia: Stocks, Bonds & Real Estate Explained", duration: '18:07', desc: "A plain-English breakdown of every asset class available to Liberian investors today — with honest risk assessments and where to start.", category: 'Investing', label: 'Beginner Guide' },
            { title: 'Leadership Fundamentals for Liberian Business Owners — Manage, Motivate & Scale', duration: '22:45', desc: 'Practical leadership frameworks adapted for West African business culture — from managing your first hire to running a team of 50.', category: 'Leadership', label: 'Deep Dive' },
          ].map((item, i) => (
            <Link key={i} href="/videos" className="group flex flex-col no-underline">
              <div className="relative overflow-hidden mb-4">
                <VideoThumbnail category={item.category} duration={item.duration} className="w-full aspect-video" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayButton size="md" />
                </div>
                <span className="absolute top-3 left-3 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-brand-dark bg-brand-accent">{item.label}</span>
              </div>
              <div className={`text-[10px] font-bold uppercase tracking-wide mb-1.5 ${catColor(item.category)}`}>{item.category}</div>
              <h3 className="text-[14px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-3">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
