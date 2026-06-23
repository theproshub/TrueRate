import Breadcrumb from '@/components/Breadcrumb';
import SectionEndNav from '@/components/SectionEndNav';
import { VideoThumbnail, NewsThumbnail } from '@/components/NewsThumbnail';
import PlayableVideo from '@/components/PlayableVideo';
import { CHANNEL_URL, videoHref } from '@/lib/youtube';

export const metadata = {
  title: 'Videos',
  description: 'Watch the latest from TrueRate — interviews, market explainers, and on-the-ground reporting from Liberia.',
  alternates: { canonical: '/videos' },
};

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

/* ── data ── */
const HERO = {
  title: "From Zero to $4M: How Sandra Kollie Built Liberia's Fastest-Growing Logistics Company",
  desc: "TrueRate sits down with founder Sandra Kollie to talk grit, capital access, and what it really takes to scale a business in Monrovia's emerging market.",
  duration: '24:18',
  category: 'Entrepreneurship',
  source: 'TrueRate Interviews',
  time: 'Jun 20, 2026',
  badge: 'Featured Interview',
  youtubeId: '',
};

const LATEST = [
  { title: "Marcus Doe: Why I Left Wall Street to Build a Fintech in Monrovia", duration: '18:44', category: 'Technology', time: 'Jun 20, 2026', youtubeId: '' },
  { title: "5 Investing Mistakes Every Liberian First-Timer Makes — And How to Avoid Them", duration: '11:02', category: 'Investing', time: 'Jun 20, 2026', youtubeId: '' },
  { title: "ArcelorMittal CFO on Why They're Doubling Down on Liberia Through 2030", duration: '14:30', category: 'Business', time: 'Jun 19, 2026', youtubeId: '' },
  { title: "Orange Money's Record Quarter — VP of Digital Finance on What Comes Next", duration: '9:55', category: 'Technology', time: 'Jun 19, 2026', youtubeId: '' },
];

const ORIGINALS = [
  { show: 'The Founders Lab', title: "Building in Liberia: Three Entrepreneurs on Capital, Risk & the Long Game", category: 'Entrepreneurship', duration: '42:11', ep: 'Ep. 31', youtubeId: '' },
  { show: 'Invest Liberia', title: "Where to Put Your Money in 2026 — Equities, Real Estate, or Commodities?", category: 'Investing', duration: '28:47', ep: 'Ep. 19', youtubeId: '' },
  { show: 'The Leadership Circle', title: "Ecobank West Africa CEO on Leading Through Uncertainty in Emerging Markets", category: 'Leadership', duration: '35:22', ep: 'Ep. 14', youtubeId: '' },
];

const ENTREPRENEUR_SPOTLIGHTS = [
  { title: "How James Tarr Turned a $500 Idea into Liberia's Top Catering Brand", duration: '16:05', category: 'Entrepreneurship', source: 'TrueRate Interviews', time: 'Jun 17, 2026', youtubeId: '' },
  { title: "The Woman Digitising Liberia's Informal Market — One Receipt at a Time", duration: '20:33', category: 'Technology', source: 'TrueRate Interviews', time: 'Jun 16, 2026', youtubeId: '' },
  { title: "From Farming to Exporting: How One Bong County Family Built a $1M Agribusiness", duration: '13:48', category: 'Business', source: 'TrueRate Video', time: 'Jun 15, 2026', youtubeId: '' },
  { title: "Leadership Lessons from Liberia's Most Decorated Female CEO", duration: '22:10', category: 'Leadership', source: 'TrueRate Interviews', time: 'Jun 14, 2026', youtubeId: '' },
];

const INVESTING_INSIGHTS = [
  { title: "How to Build a Portfolio on the Liberia Stock Exchange With Under $500", duration: '17:20', category: 'Investing', source: 'TrueRate Video', time: 'Jun 19, 2026', youtubeId: '' },
  { title: "Gold, Rubber & Iron Ore: Which Commodity Play Makes Sense in 2026?", duration: '12:44', category: 'Investing', source: 'TrueRate Video', time: 'Jun 18, 2026', youtubeId: '' },
  { title: "AfDB Upgrades Liberia to 5.8% Growth — What It Means for Your Investments", duration: '8:55', category: 'Business', source: 'TrueRate Analysis', time: 'Jun 17, 2026', youtubeId: '' },
  { title: "Real Estate vs Equities in Monrovia: A Practical Guide for New Investors", duration: '19:07', category: 'Investing', source: 'TrueRate Video', time: 'Jun 16, 2026', youtubeId: '' },
];

const PODCASTS = [
  { title: 'The Monrovia Entrepreneur', ep: 'Ep. 88', duration: '44:02', category: 'Entrepreneurship', desc: "This week: bootstrapping vs. venture capital — which path is right for Liberian founders?", youtubeId: '' },
  { title: 'Founders & Funders', ep: 'Ep. 34', duration: '51:30', category: 'Technology', desc: "Three investors share what they're looking for in West Africa's startup ecosystem right now.", youtubeId: '' },
  { title: 'West Africa Investor Weekly', ep: 'Ep. 112', duration: '38:14', category: 'Investing', desc: "LRD watch, equity picks, and the sectors TrueRate analysts are watching this quarter.", youtubeId: '' },
  { title: 'The Leadership Brief', ep: 'Ep. 22', duration: '27:55', category: 'Leadership', desc: "Executive coach Dr. Pewu on the mindset shifts that separate good managers from great ones.", youtubeId: '' },
  { title: 'Tech Disruptors: West Africa', ep: 'Ep. 17', duration: '33:20', category: 'Technology', desc: "Mobile money, AI adoption, and the infrastructure gap — Liberia's tech moment is now.", youtubeId: '' },
];

const LIVE_UPCOMING = [
  { title: 'Startup Pitch Live: Monrovia Edition — 8 Founders, One Stage', channel: 'TrueRate Live', time: '10:00 AM', date: 'Apr 7', category: 'Entrepreneurship', badge: 'LIVE NOW', youtubeId: '' },
  { title: "Liberia's Small Business Summit 2026 — Opening Keynote", channel: 'TrueRate Live', time: '2:30 PM', date: 'Apr 7', category: 'Leadership', badge: 'UPCOMING', youtubeId: '' },
  { title: 'CBL Governor Interview: Rates, Reserves & the Road Ahead', channel: 'TrueRate Interviews', time: '9:00 AM', date: 'Apr 8', category: 'Business', badge: 'UPCOMING', youtubeId: '' },
  { title: 'West Africa Tech Summit — Liberia Delegation Panel', channel: 'TrueRate Live', time: '11:00 AM', date: 'Apr 9', category: 'Technology', badge: 'UPCOMING', youtubeId: '' },
];

const GROWTH_PLAYBOOK = [
  { title: 'How to Register & Structure Your Business in Liberia — Step by Step', duration: '14:32', desc: 'From business registration at the Liberia Business Registry to choosing the right legal structure — a complete guide for first-time founders.', category: 'Entrepreneurship', label: 'Starter Guide', youtubeId: '' },
  { title: "Your First Investment in Liberia: Stocks, Bonds & Real Estate Explained", duration: '18:07', desc: "A plain-English breakdown of every asset class available to Liberian investors today — with honest risk assessments and where to start.", category: 'Investing', label: 'Beginner Guide', youtubeId: '' },
  { title: 'Leadership Fundamentals for Liberian Business Owners — Manage, Motivate & Scale', duration: '22:45', desc: 'Practical leadership frameworks adapted for West African business culture — from managing your first hire to running a team of 50.', category: 'Leadership', label: 'Deep Dive', youtubeId: '' },
];

const CAT_COLORS: Record<string, string> = {
  'Entrepreneurship': 'text-violet-400',
  'Technology':       'text-sky-400',
  'Investing':        'text-brand-accent-ink',
  'Leadership':       'text-amber-400',
  'Business':         'text-rose-400',
  'Mining':           'text-orange-400',
};

function catColor(c: string) {
  return CAT_COLORS[c] ?? 'text-gray-500';
}

function PlayIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'h-14 w-14' : size === 'sm' ? 'h-8 w-8' : 'h-11 w-11';
  const icon = size === 'lg' ? 'h-6 w-6' : size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  return (
    <div className={`flex ${dim} items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110 group-hover:bg-black/80`}>
      <svg className={`${icon} translate-x-0.5 text-gray-900`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
}

function SectionHeader({ title, sub, href, label = 'View all ›' }: { title: string; sub?: string; href?: string; label?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
      <div>
        <h2 className="text-md font-bold text-gray-900">{title}</h2>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
      {href !== undefined && (
        <a href={href} {...ext} className="text-sm text-gray-500 hover:text-brand-accent-ink transition-colors no-underline shrink-0 focus-visible:outline-none focus-visible:underline">{label}</a>
      )}
    </div>
  );
}

// Small list card — links out (a tiny inline player is poor UX).
function VideoCard({ title, duration, category, source, time, youtubeId }: { title: string; duration: string; category: string; source?: string; time: string; youtubeId?: string }) {
  return (
    <a href={videoHref(youtubeId)} {...ext} className="group flex gap-3.5 py-3 first:pt-0 no-underline">
      <div className="shrink-0 overflow-hidden rounded-lg w-[120px] h-[72px]">
        <VideoThumbnail category={category} duration={duration} className="w-full h-full" />
      </div>
      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <h3 className="text-sm sm:text-base font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-1">{title}</h3>
        <div className="text-xs text-gray-500">{source ? `${source} · ` : ''}{time}</div>
      </div>
    </a>
  );
}

export default function VideosPage() {
  return (
    <>
      <div role="note" aria-label="Sample data notice" className="bg-amber-400 text-amber-950">
        <div className="mx-auto max-w-container px-4 py-2 flex items-start gap-2 text-sm">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <p className="leading-snug">
            <span className="font-bold uppercase tracking-wide">Sample data</span>
            {' — '}
            this section uses placeholder content for design preview. Video titles and descriptions are
            illustrative, not real reporting. They will be replaced once video content is published.
          </p>
        </div>
      </div>
    <main className="mx-auto max-w-container px-4 py-6">

      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Videos' }]} />
      </div>

      {/* ── Hero + Latest ── */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">

        {/* Hero — plays inline */}
        <div className="flex-1 min-w-0">
          <PlayableVideo id={HERO.youtubeId} label={HERO.title} className="w-full overflow-hidden rounded-2xl max-h-[280px] sm:max-h-[360px] lg:max-h-[420px]" style={{ aspectRatio: '16/9' }}>
            <VideoThumbnail category={HERO.category} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayIcon size="lg" />
            </div>
            <span className="absolute top-4 left-4 rounded-md bg-brand-accent px-2.5 py-1 text-2xs font-black uppercase tracking-widest text-brand-accent-ink">
              {HERO.badge}
            </span>
            <span className="absolute top-4 right-4 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold text-gray-900 tabular-nums">
              {HERO.duration}
            </span>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <h1 className="text-xl sm:text-2xl font-bold leading-[1.2] tracking-tight text-gray-900 mb-2 line-clamp-2">{HERO.title}</h1>
              <p className="text-base text-gray-900/60 line-clamp-2 mb-3 max-w-[600px] hidden sm:block">{HERO.desc}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-gray-600">{HERO.source}</span>
                <span className="text-gray-900/30">·</span>
                <span className="text-gray-500">{HERO.time}</span>
              </div>
            </div>
          </PlayableVideo>
        </div>

        {/* Latest sidebar — links out */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
            <span className="text-md font-bold text-gray-900">Latest</span>
            <a href={CHANNEL_URL} {...ext} className="text-sm text-gray-500 hover:text-brand-accent-ink transition-colors no-underline focus-visible:outline-none focus-visible:underline">View more ›</a>
          </div>
          <div className="flex flex-col divide-y divide-gray-200 flex-1">
            {LATEST.map((v, i) => (
              <a key={i} href={videoHref(v.youtubeId)} {...ext} className="group flex gap-3 py-3 first:pt-0 no-underline">
                <div className="shrink-0 overflow-hidden rounded-lg w-[100px] h-[60px]">
                  <VideoThumbnail category={v.category} duration={v.duration} className="w-full h-full" />
                </div>
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                  <h3 className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3 mb-0.5">{v.title}</h3>
                  <div className="text-xs text-gray-500">{v.time}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── TrueRate Originals — play inline ── */}
      <section className="mb-10" aria-labelledby="videos-originals">
        <SectionHeader title="TrueRate Originals" sub="Exclusive series on business, entrepreneurship & investing" href={CHANNEL_URL} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ORIGINALS.map((v, i) => (
            <PlayableVideo key={i} id={v.youtubeId} label={v.title} className="overflow-hidden rounded-xl aspect-video">
              <VideoThumbnail category={v.category} className="absolute inset-0 w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayIcon size="md" />
              </div>
              <span className="absolute bottom-3 right-3 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold text-gray-900 tabular-nums">{v.duration}</span>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className={`text-2xs font-black uppercase tracking-widest mb-1 ${catColor(v.category)}`}>{v.show} · {v.ep}</div>
                <h3 className="text-sm sm:text-base font-semibold leading-snug text-gray-900 line-clamp-2">{v.title}</h3>
              </div>
            </PlayableVideo>
          ))}
        </div>
      </section>

      {/* ── Entrepreneur Spotlights + Investing Insights — link out ── */}
      <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <section aria-labelledby="videos-spotlights">
          <SectionHeader title="Entrepreneur Spotlights" href={CHANNEL_URL} label="View more ›" />
          <div className="flex flex-col divide-y divide-gray-200">
            {ENTREPRENEUR_SPOTLIGHTS.map((v, i) => (
              <VideoCard key={i} {...v} />
            ))}
          </div>
        </section>
        <section aria-labelledby="videos-investing">
          <SectionHeader title="Investing Insights" href={CHANNEL_URL} label="View more ›" />
          <div className="flex flex-col divide-y divide-gray-200">
            {INVESTING_INSIGHTS.map((v, i) => (
              <VideoCard key={i} {...v} />
            ))}
          </div>
        </section>
      </div>

      {/* ── TrueRate Finance Network (Podcasts) — play inline ── */}
      <section className="mb-10 -mx-4 px-4 py-8 bg-white border-y border-gray-200" aria-labelledby="videos-podcasts">
        <div className="max-w-container">
          <SectionHeader title="TrueRate Finance Network" sub="Podcasts on entrepreneurship, investing, leadership & technology" href={CHANNEL_URL} label="All episodes ›" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {PODCASTS.map((pod, i) => (
              <div key={i} className="group flex flex-col">
                <PlayableVideo id={pod.youtubeId} label={pod.title} className="overflow-hidden rounded-xl mb-3 aspect-square">
                  <NewsThumbnail category={pod.category} className="absolute inset-0 w-full h-full" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayIcon size="md" />
                  </div>
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-2xs font-semibold text-gray-900 tabular-nums backdrop-blur-sm">
                    {pod.duration}
                  </span>
                </PlayableVideo>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-2xs font-black uppercase tracking-wide ${catColor(pod.category)}`}>{pod.ep}</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold leading-snug text-gray-900 line-clamp-2 mb-1.5">{pod.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-auto">{pod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live & Upcoming — play inline ── */}
      <section className="mb-10" aria-labelledby="videos-live">
        <SectionHeader title="Live & Upcoming" href={CHANNEL_URL} label="View schedule ›" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LIVE_UPCOMING.map((item, i) => (
            <div key={i} className="group flex flex-col">
              <PlayableVideo id={item.youtubeId} label={item.title} className="overflow-hidden rounded-xl mb-3 aspect-video">
                <VideoThumbnail category={item.category} className="absolute inset-0 w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2.5 left-2.5">
                  <span className={`rounded px-2 py-0.5 text-2xs font-bold uppercase tracking-wide ${item.badge === 'LIVE NOW' ? 'bg-red-600 text-gray-900' : 'bg-black/70 text-gray-900/60 border border-gray-200'}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayIcon size="sm" />
                </div>
              </PlayableVideo>
              <div className={`text-2xs font-bold uppercase tracking-wide mb-1 ${catColor(item.category)}`}>{item.category}</div>
              <h3 className="text-sm sm:text-base font-semibold leading-snug text-gray-900 line-clamp-2 mb-1">{item.title}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span>{item.channel}</span>
                <span>·</span>
                <span>{item.time} · {item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Growth Playbook — play inline ── */}
      <section className="mb-10" aria-labelledby="videos-playbook">
        <SectionHeader title="Growth Playbook" sub="Practical guides on building, investing & leading in Liberia" href={CHANNEL_URL} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {GROWTH_PLAYBOOK.map((item, i) => (
            <div key={i} className="group flex flex-col">
              <PlayableVideo id={item.youtubeId} label={item.title} className="overflow-hidden rounded-xl mb-4 aspect-video">
                <VideoThumbnail category={item.category} className="absolute inset-0 w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayIcon size="md" />
                </div>
                <span className="absolute top-3 left-3 rounded-md px-2 py-0.5 text-2xs font-black uppercase tracking-wide text-brand-accent-ink bg-brand-accent">{item.label}</span>
              </PlayableVideo>
              <div className={`text-2xs font-bold uppercase tracking-wide mb-1.5 ${catColor(item.category)}`}>{item.category}</div>
              <h3 className="text-sm sm:text-base font-semibold leading-snug text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionEndNav currentHref="/videos" />

    </main>
    </>
  );
}
