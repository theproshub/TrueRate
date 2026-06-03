import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { VideoThumbnail } from '@/components/NewsThumbnail';
import PlayableVideo from '@/components/PlayableVideo';
import { CHANNEL_URL } from '@/lib/youtube';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

export const metadata: Metadata = {
  title: 'Interviews — TrueRate Videos',
  description: 'Unfiltered conversations with the founders, executives, and policymakers shaping Liberia.',
};

const HERO = {
  title: "Ecobank West Africa CEO: “Liberia is our fastest-growing market in 2026”",
  desc: "In a 42-minute sit-down with TrueRate, the regional chief executive lays out a $120M expansion plan, the regulatory friction holding it back, and why he is doubling headcount in Monrovia.",
  duration: '42:11',
  category: 'Leadership',
  source: 'TrueRate Interviews',
  time: '3h ago',
  badge: 'Featured',
  youtubeId: '',
};

const LATEST = [
  { title: "Sandra Kollie: How I Built Liberia’s Fastest-Growing Logistics Company", duration: '24:18', category: 'Entrepreneurship', time: '1d ago' },
  { title: "CBL Governor on rates, reserves, and the road to 6% growth", duration: '31:40', category: 'Leadership', time: '2d ago' },
  { title: "Marcus Doe: Why I left Wall Street to build a fintech in Monrovia", duration: '18:44', category: 'Technology', time: '3d ago' },
  { title: "ArcelorMittal CFO: “We’re doubling down on Liberia through 2030”", duration: '14:30', category: 'Business', time: '4d ago' },
];

const SERIES = [
  { show: 'The Founders Lab', ep: 'Ep. 31', title: "Three Monrovia founders on capital, risk, and the long game", duration: '42:11', category: 'Entrepreneurship', youtubeId: '' },
  { show: 'The Leadership Circle', ep: 'Ep. 14', title: "Leading through uncertainty: Ecobank West Africa", duration: '35:22', category: 'Leadership', youtubeId: '' },
  { show: 'Policy Briefing', ep: 'Ep. 08', title: "The Finance Minister on the mid-year budget review", duration: '28:55', category: 'Policy', youtubeId: '' },
];

const MORE = [
  { title: "How James Tarr turned a $500 idea into Liberia’s top catering brand", duration: '16:05', category: 'Entrepreneurship', time: '5d ago' },
  { title: "The woman digitising Liberia’s informal market — one receipt at a time", duration: '20:33', category: 'Technology', time: '6d ago' },
  { title: "Bong County agribusiness built a $1M export engine from one family farm", duration: '13:48', category: 'Business', time: '1w ago' },
  { title: "Liberia’s most decorated female CEO on leadership lessons", duration: '22:10', category: 'Leadership', time: '1w ago' },
  { title: "Orange Money VP on mobile finance’s record quarter", duration: '9:55', category: 'Technology', time: '1w ago' },
  { title: "Port of Monrovia managing director on the Phase II rebuild", duration: '17:22', category: 'Infrastructure', time: '2w ago' },
];

function PlayIcon() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
      <svg className="h-6 w-6 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
    </div>
  );
}

export default function VideosInterviewsPage() {
  return (
    <main className="mx-auto max-w-container px-4 py-6">
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Videos', href: '/videos' }, { label: 'Interviews' }]} />
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span className="rounded bg-brand-accent px-2.5 py-1 text-2xs font-black uppercase tracking-widest text-brand-dark">Interviews</span>
        <p className="text-base text-gray-400">Unfiltered conversations with founders, executives, and policymakers.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <PlayableVideo id={HERO.youtubeId} label={HERO.title} className="flex-1 min-w-0 overflow-hidden rounded-2xl" style={{ aspectRatio: '16/9', maxHeight: '420px' }}>
          <VideoThumbnail category={HERO.category} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center"><PlayIcon /></div>
          <span className="absolute top-4 left-4 rounded-md bg-brand-accent px-2.5 py-1 text-2xs font-black uppercase tracking-widest text-brand-dark">{HERO.badge}</span>
          <span className="absolute top-4 right-4 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold text-white tabular-nums">{HERO.duration}</span>
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
            <h2 className="text-sm sm:text-2xl font-bold leading-tight text-white mb-2 line-clamp-2">{HERO.title}</h2>
            <p className="text-base text-white/60 line-clamp-2 mb-3 max-w-[600px] hidden sm:block">{HERO.desc}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-white/70">{HERO.source}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/40">{HERO.time}</span>
            </div>
          </div>
        </PlayableVideo>

        <div className="w-full lg:w-[280px] shrink-0 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-white/40">Latest interviews</span>
            <a href={CHANNEL_URL} {...ext} className="text-xs text-gray-500 hover:text-white no-underline">View more ›</a>
          </div>
          <div className="flex flex-col divide-y divide-white/[0.05] flex-1">
            {LATEST.map((v, i) => (
              <a key={i} href={CHANNEL_URL} {...ext} className="group flex gap-3 py-3 first:pt-0 no-underline">
                <div className="relative shrink-0 overflow-hidden rounded-lg w-[100px]">
                  <VideoThumbnail category={v.category} duration={v.duration} className="w-full h-[58px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-2xs font-bold uppercase tracking-wide text-gray-400 mb-0.5">{v.category}</div>
                  <h4 className="text-sm font-semibold leading-snug text-white group-hover:text-white/70 line-clamp-3 mb-1">{v.title}</h4>
                  <div className="text-xs text-gray-500">{v.time}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
            <h2 className="text-base font-bold text-white uppercase tracking-[0.12em]">TrueRate Originals</h2>
          </div>
          <a href={CHANNEL_URL} {...ext} className="text-sm text-gray-500 hover:text-white no-underline">All series ›</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SERIES.map((v, i) => (
            <PlayableVideo key={i} id={v.youtubeId} label={v.title} className="overflow-hidden rounded-2xl aspect-video">
              <VideoThumbnail category={v.category} duration={v.duration} className="absolute inset-0 w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <span className="absolute bottom-3 right-3 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold text-white tabular-nums">{v.duration}</span>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-2xs font-black uppercase tracking-widest text-white/60 mb-1">{v.show} · {v.ep}</div>
                <h3 className="text-sm font-bold leading-snug text-white line-clamp-2">{v.title}</h3>
              </div>
            </PlayableVideo>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
          <h2 className="text-base font-bold text-white uppercase tracking-[0.12em]">More interviews</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-white/[0.05]">
          {MORE.map((v, i) => (
            <a key={i} href={CHANNEL_URL} {...ext} className="group flex gap-3.5 py-4 first:pt-0 no-underline">
              <div className="relative shrink-0 overflow-hidden rounded-lg">
                <VideoThumbnail category={v.category} duration={v.duration} className="h-[68px] w-[104px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-2xs font-bold uppercase tracking-wide text-gray-400 mb-1">{v.category}</div>
                <h3 className="text-sm font-semibold leading-snug text-white group-hover:text-white/70 line-clamp-2 mb-1">{v.title}</h3>
                <div className="text-xs text-gray-500">{v.time}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-brand-accent mb-1">Nominate a guest</p>
          <p className="text-md text-white">Know a Liberian leader whose story should be told? We read every suggestion.</p>
        </div>
        <Link href="/feedback" className="shrink-0 rounded-lg bg-brand-accent px-4 py-2 text-base font-bold text-brand-dark no-underline hover:brightness-90 transition">Send a suggestion</Link>
      </section>
    </main>
  );
}
