import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { VideoThumbnail } from '@/components/NewsThumbnail';
import PlayableVideo from '@/components/PlayableVideo';
import { CHANNEL_URL } from '@/lib/youtube';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

export const metadata: Metadata = {
  title: 'Entrepreneurship — TrueRate Videos',
  description: 'Founder stories, bootstrapping playbooks, and capital access explained — for builders in Liberia.',
};

const HERO = {
  title: "From $500 to $4M: How Sandra Kollie built Liberia’s fastest-growing logistics company",
  desc: "A step-by-step breakdown of pricing, payroll, and the three hires that turned a side business into a market leader.",
  duration: '24:18',
  category: 'Entrepreneurship',
  source: 'TrueRate Interviews',
  time: 'Jun 20, 2026',
  youtubeId: '',
};

const PLAYBOOKS = [
  { title: "Register, structure, and file: a step-by-step founder’s guide", duration: '14:32', desc: 'From the Liberia Business Registry to choosing the right legal structure — every paperwork step, in order.', category: 'Entrepreneurship', label: 'Starter Guide', youtubeId: '' },
  { title: "Bootstrapping vs. venture capital in West Africa: which is right?", duration: '18:40', desc: 'Two Liberian founders make opposing cases, with real cap-table maths.', category: 'Entrepreneurship', label: 'Deep Dive', youtubeId: '' },
  { title: "Your first 10 hires: how to build a lean Monrovia team", duration: '16:12', desc: "Compensation, titles, and performance reviews for stage-one startups.", category: 'Entrepreneurship', label: 'Playbook', youtubeId: '' },
];

const SPOTLIGHTS = [
  { title: "James Tarr: $500 idea to Liberia’s top catering brand", duration: '16:05', category: 'Entrepreneurship', time: 'Jun 17, 2026' },
  { title: "The woman digitising Liberia’s informal market", duration: '20:33', category: 'Technology', time: 'Jun 16, 2026' },
  { title: "Bong County family built a $1M agribusiness from one farm", duration: '13:48', category: 'Business', time: 'Jun 15, 2026' },
  { title: "Inside Monrovia’s most successful female-led startup", duration: '22:10', category: 'Leadership', time: 'Jun 14, 2026' },
  { title: "How three cofounders split equity without fighting", duration: '11:48', category: 'Entrepreneurship', time: 'Jun 13, 2026' },
  { title: "Paynesville’s fastest-growing SME on unit economics", duration: '15:22', category: 'Business', time: 'Jun 13, 2026' },
];

const FUNDING_STORIES = [
  { title: "LiberAgro’s $12M IPO: the cap table, step by step", duration: '19:40', category: 'Investing', time: 'Jun 18, 2026' },
  { title: "How to raise seed capital in Liberia without giving up control", duration: '14:10', category: 'Entrepreneurship', time: 'Jun 15, 2026' },
  { title: "Inside the Liberia Venture Forum — who wrote cheques", duration: '22:30', category: 'Investing', time: 'Jun 13, 2026' },
];

function PlayIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'h-14 w-14' : size === 'sm' ? 'h-8 w-8' : 'h-11 w-11';
  return (
    <div className={`flex ${dim} items-center justify-center rounded-full bg-black/60 backdrop-blur-sm`}>
      <svg className="h-5 w-5 translate-x-0.5 text-gray-900" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
    </div>
  );
}

export default function VideosEntrepreneurshipPage() {
  return (
    <main className="mx-auto max-w-container px-4 py-6">
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Videos', href: '/videos' }, { label: 'Entrepreneurship' }]} />
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span className="rounded bg-violet-500/20 text-violet-300 px-2.5 py-1 text-2xs font-black uppercase tracking-widest">Entrepreneurship</span>
        <p className="text-base text-gray-500">Founder stories, bootstrapping playbooks, and capital access explained.</p>
      </div>

      {/* Hero — plays inline */}
      <div className="mb-8">
        <PlayableVideo id={HERO.youtubeId} label={HERO.title} className="overflow-hidden rounded-2xl w-full" style={{ aspectRatio: '16/9', maxHeight: '460px' }}>
          <VideoThumbnail category={HERO.category} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center"><PlayIcon size="lg" /></div>
          <span className="absolute top-4 right-4 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold text-gray-900 tabular-nums">{HERO.duration}</span>
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
            <h2 className="text-xl sm:text-3xl font-bold leading-tight text-gray-900 mb-2 max-w-[720px]">{HERO.title}</h2>
            <p className="text-md text-gray-600 line-clamp-2 mb-3 max-w-[640px] hidden sm:block">{HERO.desc}</p>
            <div className="flex items-center gap-2 text-sm text-gray-900/60">
              <span className="font-semibold">{HERO.source}</span>
              <span>·</span>
              <span>{HERO.time}</span>
            </div>
          </div>
        </PlayableVideo>
      </div>

      {/* Founder playbooks — play inline */}
      <section className="mb-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">Founder playbooks</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PLAYBOOKS.map((p, i) => (
            <div key={i} className="group flex flex-col">
              <PlayableVideo id={p.youtubeId} label={p.title} className="overflow-hidden mb-4 aspect-video rounded-xl">
                <VideoThumbnail category={p.category} duration={p.duration} className="absolute inset-0 w-full h-full" />
                <span className="absolute top-3 left-3 rounded-md px-2 py-0.5 text-2xs font-black uppercase tracking-wide text-brand-dark bg-brand-accent">{p.label}</span>
              </PlayableVideo>
              <h3 className="text-sm font-bold leading-snug text-gray-900 mb-2 line-clamp-2">{p.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <section>
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">Founder spotlights</h2>
          </div>
          <div className="flex flex-col divide-y divide-gray-200">
            {SPOTLIGHTS.map((v, i) => (
              <a key={i} href={CHANNEL_URL} {...ext} className="group flex gap-3.5 py-3.5 first:pt-0 no-underline">
                <div className="relative shrink-0 overflow-hidden rounded-lg">
                  <VideoThumbnail category={v.category} duration={v.duration} className="h-[68px] w-[104px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-2xs font-bold uppercase tracking-wide text-gray-500 mb-1">{v.category}</div>
                  <h3 className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-gray-900/70 line-clamp-2 mb-1">{v.title}</h3>
                  <div className="text-xs text-gray-500">{v.time}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">Funding stories</h2>
          </div>
          <div className="flex flex-col divide-y divide-gray-200">
            {FUNDING_STORIES.map((v, i) => (
              <a key={i} href={CHANNEL_URL} {...ext} className="group flex gap-3.5 py-3.5 first:pt-0 no-underline">
                <div className="relative shrink-0 overflow-hidden rounded-lg">
                  <VideoThumbnail category={v.category} duration={v.duration} className="h-[68px] w-[104px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-2xs font-bold uppercase tracking-wide text-gray-500 mb-1">{v.category}</div>
                  <h3 className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-gray-900/70 line-clamp-2 mb-1">{v.title}</h3>
                  <div className="text-xs text-gray-500">{v.time}</div>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-widest text-brand-accent-ink mb-1">The Founders Lab</p>
            <p className="text-base text-gray-900 mb-3">Our weekly podcast on building in West Africa. New episode every Thursday.</p>
            <Link href="/videos" className="text-sm font-bold text-brand-accent-ink no-underline hover:brightness-110">Listen now ›</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
