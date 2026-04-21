import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { VideoThumbnail } from '@/components/NewsThumbnail';

export const metadata: Metadata = {
  title: 'Leadership — TrueRate Videos',
  description: 'The executives, ministers, and decision-makers whose choices are shaping Liberia\u2019s economy \u2014 on the record.',
};

const HERO = {
  title: "CBL Governor: \u201cThe next 18 months will define Liberia\u2019s credit standing for a decade\u201d",
  desc: "In a rare 36-minute interview, the Central Bank of Liberia governor addresses rate policy, FX reserves, and the fiscal reforms the IMF wants to see.",
  duration: '35:22',
  category: 'Leadership',
  source: 'The Leadership Circle',
  time: '6h ago',
};

const CONVERSATIONS = [
  { title: "Finance Minister on the mid-year budget review", duration: '28:55', category: 'Leadership', time: '1d ago' },
  { title: "ArcelorMittal CFO: why we\u2019re doubling down on Liberia", duration: '14:30', category: 'Business', time: '2d ago' },
  { title: "Ecobank West Africa CEO on leading through uncertainty", duration: '35:22', category: 'Banking', time: '3d ago' },
  { title: "Port of Monrovia MD on Phase II and the decade ahead", duration: '17:22', category: 'Infrastructure', time: '4d ago' },
];

const MASTERCLASS = [
  { title: "The first 90 days as CEO in a West African business", duration: '24:10', desc: "Practical frameworks for new leaders taking over in a mid-size company.", category: 'Leadership', label: 'Masterclass' },
  { title: "Managing across generations in a Monrovia team", duration: '19:25', desc: "How to lead when your team spans three age brackets and two work styles.", category: 'Leadership', label: 'Playbook' },
  { title: "Running a board: agendas, tempo, and decisions that ship", duration: '22:45', desc: "Board-meeting mechanics for SME leaders who have never done it before.", category: 'Leadership', label: 'Starter Guide' },
];

const PROFILES = [
  { title: "Liberia\u2019s most decorated female CEO on leadership lessons", duration: '22:10', category: 'Women', time: '4d ago' },
  { title: "Three COOs on executing fast without breaking things", duration: '18:45', category: 'Leadership', time: '5d ago' },
  { title: "What a great board chair looks like in a West African SME", duration: '21:12', category: 'Governance', time: '6d ago' },
  { title: "How two rival executives became co-CEOs \u2014 and made it work", duration: '27:05', category: 'Leadership', time: '1w ago' },
];

function PlayIcon() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
      <svg className="h-6 w-6 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
    </div>
  );
}

export default function VideosLeadershipPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Videos', href: '/videos' }, { label: 'Leadership' }]} />
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span className="rounded bg-amber-500/20 text-amber-300 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">Leadership</span>
        <p className="text-[13px] text-gray-400">Executives, ministers, and decision-makers shaping Liberia&rsquo;s economy.</p>
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
          <span className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-4">Boardroom conversations</span>
          <div className="flex flex-col divide-y divide-white/[0.05] flex-1">
            {CONVERSATIONS.map((v, i) => (
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
            <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Leadership masterclass</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {MASTERCLASS.map((p, i) => (
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
          <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Executive profiles</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-white/[0.05]">
          {PROFILES.map((v, i) => (
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
    </main>
  );
}
