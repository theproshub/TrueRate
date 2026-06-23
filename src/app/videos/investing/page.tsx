import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { VideoThumbnail } from '@/components/NewsThumbnail';
import PlayableVideo from '@/components/PlayableVideo';
import { CHANNEL_URL } from '@/lib/youtube';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

export const metadata: Metadata = {
  title: 'Investing — TrueRate Videos',
  description: 'Markets explained, portfolio building, and the data that matters for investors in Liberia and West Africa.',
};

const HERO = {
  title: "Where to put your money in 2026 — equities, real estate, or commodities?",
  desc: "A TrueRate analyst panel walks through five asset classes available to Liberian investors, with honest risk assessments and a sample $5,000 portfolio.",
  duration: '28:47',
  category: 'Investing',
  source: 'Invest Liberia',
  time: 'Jun 20, 2026',
  youtubeId: '',
};

const EXPLAINERS = [
  { title: "How to read the CBL monetary policy statement in 5 minutes", duration: '6:12', category: 'Policy', time: 'Jun 19, 2026' },
  { title: "Rubber vs iron ore vs gold: which commodity play makes sense now?", duration: '12:44', category: 'Commodities', time: 'Jun 18, 2026' },
  { title: "Understanding the LRD/USD peg — the basics, and the risks", duration: '9:20', category: 'Forex', time: 'Jun 17, 2026' },
  { title: "What the GSE Composite really tells you about West Africa", duration: '14:08', category: 'Markets', time: 'Jun 16, 2026' },
];

const GUIDES = [
  { title: "Your first investment in Liberia: stocks, bonds, real estate", duration: '18:07', desc: "A plain-English walkthrough of every asset class available to Liberian investors today.", category: 'Investing', label: 'Beginner Guide', youtubeId: '' },
  { title: "Build a portfolio on the GSE with under $500", duration: '17:20', desc: "Three realistic sample portfolios, with expected risk and dividend yield.", category: 'Investing', label: 'Playbook', youtubeId: '' },
  { title: "Real estate vs equities in Monrovia: a practical guide", duration: '19:07', desc: "Returns, liquidity, and management headaches compared — with local numbers.", category: 'Investing', label: 'Deep Dive', youtubeId: '' },
];

const MARKET_DESK = [
  { title: "Weekly market wrap: what moved LRD this week", duration: '8:55', category: 'Markets', time: 'Jun 20, 2026' },
  { title: "AfDB upgrades Liberia to 5.8% growth — portfolio implications", duration: '7:30', category: 'Analysis', time: 'Jun 19, 2026' },
  { title: "ArcelorMittal’s capex plan and what it means for iron ore", duration: '11:10', category: 'Mining', time: 'Jun 18, 2026' },
  { title: "Ecobank’s record quarter — reading the bank’s numbers", duration: '13:45', category: 'Banking', time: 'Jun 17, 2026' },
];

function PlayIcon() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
      <svg className="h-6 w-6 translate-x-0.5 text-gray-900" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
    </div>
  );
}

export default function VideosInvestingPage() {
  return (
    <main className="mx-auto max-w-container px-4 py-6">
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Videos', href: '/videos' }, { label: 'Investing' }]} />
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span className="rounded bg-brand-accent-ink/20 text-brand-accent-ink px-2.5 py-1 text-2xs font-black uppercase tracking-widest">Investing</span>
        <p className="text-base text-gray-500">Markets explained, portfolios built, and the data that matters.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <PlayableVideo id={HERO.youtubeId} label={HERO.title} className="flex-1 min-w-0 overflow-hidden rounded-2xl" style={{ aspectRatio: '16/9', maxHeight: '420px' }}>
          <VideoThumbnail category={HERO.category} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center"><PlayIcon /></div>
          <span className="absolute top-4 right-4 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold text-gray-900 tabular-nums">{HERO.duration}</span>
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
            <h2 className="text-sm sm:text-2xl font-bold leading-tight text-gray-900 mb-2 line-clamp-2">{HERO.title}</h2>
            <p className="text-base text-gray-900/60 line-clamp-2 mb-3 max-w-[600px] hidden sm:block">{HERO.desc}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-600">{HERO.source}</span>
              <span className="text-gray-900/30">·</span>
              <span className="text-gray-500">{HERO.time}</span>
            </div>
          </div>
        </PlayableVideo>

        <div className="w-full lg:w-[280px] shrink-0 flex flex-col">
          <span className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Quick explainers</span>
          <div className="flex flex-col divide-y divide-gray-200 flex-1">
            {EXPLAINERS.map((v, i) => (
              <a key={i} href={CHANNEL_URL} {...ext} className="group flex gap-3 py-3 first:pt-0 no-underline">
                <div className="relative shrink-0 overflow-hidden rounded-lg w-[100px]">
                  <VideoThumbnail category={v.category} duration={v.duration} className="w-full h-[58px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-2xs font-bold uppercase tracking-wide text-gray-500 mb-0.5">{v.category}</div>
                  <h4 className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-gray-900/70 line-clamp-3 mb-1">{v.title}</h4>
                  <div className="text-xs text-gray-500">{v.time}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">Investor guides</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {GUIDES.map((p, i) => (
            <div key={i} className="group flex flex-col">
              <PlayableVideo id={p.youtubeId} label={p.title} className="overflow-hidden mb-4 aspect-video rounded-xl">
                <VideoThumbnail category={p.category} duration={p.duration} className="absolute inset-0 w-full h-full" />
                <span className="absolute top-3 left-3 rounded-md px-2 py-0.5 text-2xs font-black uppercase tracking-wide text-brand-accent-ink bg-brand-accent">{p.label}</span>
              </PlayableVideo>
              <h3 className="text-sm font-bold leading-snug text-gray-900 mb-2 line-clamp-2">{p.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
          <h2 className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">Market desk</h2>
          <Link href="/markets" className="text-sm text-gray-500 hover:text-gray-900 no-underline">Live rates ›</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-gray-200">
          {MARKET_DESK.map((v, i) => (
            <a key={i} href={CHANNEL_URL} {...ext} className="group flex gap-3.5 py-4 first:pt-0 no-underline">
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

      <section className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
        <p className="text-xs font-black uppercase tracking-widest text-amber-300 mb-2">Not investment advice</p>
        <p className="text-base text-gray-500 leading-relaxed">
          Everything in this section is published for informational purposes only. Consult a licensed adviser before making any investment decision. <Link href="/about/data-disclaimer" className="text-brand-accent-ink no-underline hover:brightness-110">Read our data disclaimer →</Link>
        </p>
      </section>
    </main>
  );
}
