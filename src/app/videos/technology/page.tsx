import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { VideoThumbnail } from '@/components/NewsThumbnail';

export const metadata: Metadata = {
  title: 'Technology — TrueRate Videos',
  description: 'Fintech, mobile money, AI, and digital infrastructure \u2014 the tech reshaping how Liberia transacts and builds.',
};

const HERO = {
  title: "Inside Orange Money\u2019s record quarter \u2014 the VP of digital finance explains",
  desc: "Mobile money transactions hit $1.8B in Q1. The exec behind the growth walks through product decisions, the agent network buildout, and what fintech will do to Liberian banks by 2028.",
  duration: '21:45',
  category: 'Fintech',
  source: 'TrueRate Interviews',
  time: '5h ago',
};

const FEATURED = [
  { title: "The fintech map of West Africa in 2026", duration: '14:10', category: 'Fintech', time: '1d ago' },
  { title: "AI for small business in Liberia \u2014 hype vs. reality", duration: '12:44', category: 'AI', time: '2d ago' },
  { title: "How a cashier\u2019s terminal became Liberia\u2019s most-used app", duration: '9:55', category: 'Technology', time: '2d ago' },
  { title: "Mobile infrastructure: what 5G will (and won\u2019t) change", duration: '16:30', category: 'Telecom', time: '3d ago' },
];

const DEEP_DIVES = [
  { title: "Open banking in Liberia: where it stands, where it's going", duration: '22:18', desc: "A regulatory walk-through of the CBL\u2019s proposed open-banking framework.", category: 'Fintech', label: 'Deep Dive' },
  { title: "Building B2B SaaS for Monrovia\u2019s small businesses", duration: '18:20', desc: "Three founders on pricing, distribution, and the features that actually convert.", category: 'Startups', label: 'Playbook' },
  { title: "Cybersecurity for Liberian SMEs \u2014 practical guide", duration: '15:40', desc: "Password managers, phishing, and the $2k worth of protection every business should have.", category: 'Technology', label: 'Starter Guide' },
];

const LAUNCHES = [
  { title: "Paystack vs Flutterwave: how they\u2019re playing Liberia", duration: '13:12', category: 'Fintech', time: '4h ago' },
  { title: "The new LiberAgro export platform, reviewed", duration: '11:05', category: 'AgriTech', time: '1d ago' },
  { title: "Liberia\u2019s first e-commerce aggregator, inside look", duration: '10:28', category: 'E-Commerce', time: '2d ago' },
  { title: "Open-source tools we saw at WestAfricaHack 2026", duration: '8:15', category: 'Technology', time: '3d ago' },
];

function PlayIcon() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
      <svg className="h-6 w-6 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
    </div>
  );
}

export default function VideosTechnologyPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Videos', href: '/videos' }, { label: 'Technology' }]} />
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span className="rounded bg-sky-500/20 text-sky-300 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">Technology</span>
        <p className="text-[13px] text-gray-400">Fintech, mobile money, AI, and digital infrastructure in Liberia.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        <Link href="/videos" className="group flex-1 min-w-0 no-underline block overflow-hidden rounded-2xl">
          <div className="relative w-full" style={{ aspectRatio: '16/9', maxHeight: '420px' }}>
            <VideoThumbnail category={HERO.category} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center"><PlayIcon /></div>
            <span className="absolute top-4 right-4 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">{HERO.duration}</span>
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

        <div className="w-full lg:w-[280px] shrink-0 flex flex-col">
          <span className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-4">Featured</span>
          <div className="flex flex-col divide-y divide-white/[0.05] flex-1">
            {FEATURED.map((v, i) => (
              <Link key={i} href="/videos" className="group flex gap-3 py-3 first:pt-0 no-underline">
                <div className="relative shrink-0 overflow-hidden rounded-lg w-[100px]">
                  <VideoThumbnail category={v.category} duration={v.duration} className="w-full h-[58px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">{v.category}</div>
                  <h4 className="text-[12px] font-semibold leading-snug text-white group-hover:text-white/70 line-clamp-3 mb-1">{v.title}</h4>
                  <div className="text-[11px] text-gray-500">{v.time}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
            <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Deep dives</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {DEEP_DIVES.map((p, i) => (
            <Link key={i} href="/videos" className="group flex flex-col no-underline">
              <div className="relative overflow-hidden mb-4">
                <VideoThumbnail category={p.category} duration={p.duration} className="w-full aspect-video" />
                <span className="absolute top-3 left-3 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-brand-dark bg-brand-accent">{p.label}</span>
              </div>
              <h3 className="text-[14px] font-bold leading-snug text-white group-hover:text-white/70 mb-2 line-clamp-2">{p.title}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-3">{p.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Product launches & reviews</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-white/[0.05]">
          {LAUNCHES.map((v, i) => (
            <Link key={i} href="/videos" className="group flex gap-3.5 py-4 first:pt-0 no-underline">
              <div className="relative shrink-0 overflow-hidden rounded-lg">
                <VideoThumbnail category={v.category} duration={v.duration} className="h-[68px] w-[104px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">{v.category}</div>
                <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 line-clamp-2 mb-1">{v.title}</h3>
                <div className="text-[11px] text-gray-500">{v.time}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-sky-300 mb-1">Tech Disruptors podcast</p>
          <p className="text-[14px] text-white">A weekly deep-dive on mobile money, AI, and the builders to watch.</p>
        </div>
        <Link href="/videos" className="shrink-0 rounded-lg bg-brand-accent px-4 py-2 text-[13px] font-bold text-brand-dark no-underline hover:brightness-90 transition">Browse episodes</Link>
      </section>
    </main>
  );
}
