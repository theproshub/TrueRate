import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { VideoThumbnail } from '@/components/NewsThumbnail';

export const metadata: Metadata = {
  title: 'Entrepreneurship — TrueRate Videos',
  description: 'Founder stories, bootstrapping playbooks, and capital access explained — for builders in Liberia.',
};

const HERO = {
  title: "From $500 to $4M: How Sandra Kollie built Liberia\u2019s fastest-growing logistics company",
  desc: "A step-by-step breakdown of pricing, payroll, and the three hires that turned a side business into a market leader.",
  duration: '24:18',
  category: 'Entrepreneurship',
  source: 'TrueRate Interviews',
  time: '4h ago',
};

const PLAYBOOKS = [
  { title: "Register, structure, and file: a step-by-step founder\u2019s guide", duration: '14:32', desc: 'From the Liberia Business Registry to choosing the right legal structure \u2014 every paperwork step, in order.', category: 'Entrepreneurship', label: 'Starter Guide' },
  { title: "Bootstrapping vs. venture capital in West Africa: which is right?", duration: '18:40', desc: 'Two Liberian founders make opposing cases, with real cap-table maths.', category: 'Entrepreneurship', label: 'Deep Dive' },
  { title: "Your first 10 hires: how to build a lean Monrovia team", duration: '16:12', desc: "Compensation, titles, and performance reviews for stage-one startups.", category: 'Entrepreneurship', label: 'Playbook' },
];

const SPOTLIGHTS = [
  { title: "James Tarr: $500 idea to Liberia\u2019s top catering brand", duration: '16:05', category: 'Entrepreneurship', time: '3d ago' },
  { title: "The woman digitising Liberia\u2019s informal market", duration: '20:33', category: 'Technology', time: '4d ago' },
  { title: "Bong County family built a $1M agribusiness from one farm", duration: '13:48', category: 'Business', time: '5d ago' },
  { title: "Inside Monrovia\u2019s most successful female-led startup", duration: '22:10', category: 'Leadership', time: '6d ago' },
  { title: "How three cofounders split equity without fighting", duration: '11:48', category: 'Entrepreneurship', time: '1w ago' },
  { title: "Paynesville\u2019s fastest-growing SME on unit economics", duration: '15:22', category: 'Business', time: '1w ago' },
];

const FUNDING_STORIES = [
  { title: "LiberAgro\u2019s $12M IPO: the cap table, step by step", duration: '19:40', category: 'Investing', time: '2d ago' },
  { title: "How to raise seed capital in Liberia without giving up control", duration: '14:10', category: 'Entrepreneurship', time: '5d ago' },
  { title: "Inside the Liberia Venture Forum \u2014 who wrote cheques", duration: '22:30', category: 'Investing', time: '1w ago' },
];

function PlayIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'h-14 w-14' : size === 'sm' ? 'h-8 w-8' : 'h-11 w-11';
  return (
    <div className={`flex ${dim} items-center justify-center rounded-full bg-black/60 backdrop-blur-sm`}>
      <svg className="h-5 w-5 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
    </div>
  );
}

export default function VideosEntrepreneurshipPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Videos', href: '/videos' }, { label: 'Entrepreneurship' }]} />
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span className="rounded bg-violet-500/20 text-violet-300 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">Entrepreneurship</span>
        <p className="text-[13px] text-gray-400">Founder stories, bootstrapping playbooks, and capital access explained.</p>
      </div>

      <div className="mb-12">
        <Link href="/videos" className="group block no-underline overflow-hidden rounded-2xl">
          <div className="relative w-full" style={{ aspectRatio: '16/9', maxHeight: '460px' }}>
            <VideoThumbnail category={HERO.category} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center"><PlayIcon size="lg" /></div>
            <span className="absolute top-4 right-4 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">{HERO.duration}</span>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
              <h2 className="text-[18px] sm:text-[32px] font-black leading-tight text-white mb-2 max-w-[720px]">{HERO.title}</h2>
              <p className="text-[14px] text-white/70 line-clamp-2 mb-3 max-w-[640px] hidden sm:block">{HERO.desc}</p>
              <div className="flex items-center gap-2 text-[12px] text-white/60">
                <span className="font-semibold">{HERO.source}</span>
                <span>·</span>
                <span>{HERO.time}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
            <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Founder playbooks</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PLAYBOOKS.map((p, i) => (
            <Link key={i} href="/videos" className="group flex flex-col no-underline">
              <div className="relative overflow-hidden mb-4">
                <VideoThumbnail category={p.category} duration={p.duration} className="w-full aspect-video" />
                <span className="absolute top-3 left-3 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-brand-dark bg-brand-accent">{p.label}</span>
              </div>
              <h3 className="text-[12px] font-bold leading-snug text-white group-hover:text-white/70 mb-2 line-clamp-2">{p.title}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-3">{p.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <section>
          <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
            <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Founder spotlights</h2>
          </div>
          <div className="flex flex-col divide-y divide-white/[0.05]">
            {SPOTLIGHTS.map((v, i) => (
              <Link key={i} href="/videos" className="group flex gap-3.5 py-3.5 first:pt-0 no-underline">
                <div className="relative shrink-0 overflow-hidden rounded-lg">
                  <VideoThumbnail category={v.category} duration={v.duration} className="h-[68px] w-[104px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">{v.category}</div>
                  <h3 className="text-[12px] font-semibold leading-snug text-white group-hover:text-white/70 line-clamp-2 mb-1">{v.title}</h3>
                  <div className="text-[11px] text-gray-500">{v.time}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
            <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Funding stories</h2>
          </div>
          <div className="flex flex-col divide-y divide-white/[0.05]">
            {FUNDING_STORIES.map((v, i) => (
              <Link key={i} href="/videos" className="group flex gap-3.5 py-3.5 first:pt-0 no-underline">
                <div className="relative shrink-0 overflow-hidden rounded-lg">
                  <VideoThumbnail category={v.category} duration={v.duration} className="h-[68px] w-[104px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">{v.category}</div>
                  <h3 className="text-[12px] font-semibold leading-snug text-white group-hover:text-white/70 line-clamp-2 mb-1">{v.title}</h3>
                  <div className="text-[11px] text-gray-500">{v.time}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
            <p className="text-[11px] font-black uppercase tracking-widest text-brand-accent mb-1">The Founders Lab</p>
            <p className="text-[13px] text-white mb-3">Our weekly podcast on building in West Africa. New episode every Thursday.</p>
            <Link href="/videos" className="text-[12px] font-bold text-brand-accent no-underline hover:brightness-110">Listen now ›</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
