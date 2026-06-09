import type { Metadata } from 'next';
import Link from 'next/link';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import SectionHead from '@/components/sports/SectionHead';
import SidebarFooter from '@/components/sports/SidebarFooter';
import SportsMasthead from '@/components/sports/SportsMasthead';
import HeroLede from '@/components/sports/HeroLede';
import FlagChip from '@/components/sports/FlagChip';
import WireFeed from '@/components/sports/WireFeed';
import MostRead from '@/components/sports/MostRead';
import PodcastModule from '@/components/sports/PodcastModule';
import NewsletterSignup from '@/components/sports/NewsletterSignup';
import IntelTable from '@/components/sports/IntelTable';
import InvestigationCard from '@/components/sports/InvestigationCard';
import InterviewCard from '@/components/sports/InterviewCard';
import Delta from '@/components/sports/Delta';
import { fetchSportsArticles, timeAgo, type SportsArticle } from '@/lib/sports/feed';
import { fetchClubs, fetchAthletes } from '@/lib/sports/intel';
import {
  DASHBOARD_HERO,
  DASHBOARD_TOP_STORIES,
  DASHBOARD_EDITORIAL,
  DASHBOARD_CALENDAR,
  DASHBOARD_WEST_AFRICA,
  DASHBOARD_MOST_READ,
  PODCAST_EPISODES,
  EXECUTIVE_INTERVIEWS,
  type TopStory,
  type EditorialItem,
  type StoryFlag,
  type ClubValuation,
  type AthleteIntel,
} from '@/lib/sports-finance-data';

export const metadata: Metadata = {
  title: 'Sports — The Business & Intelligence of Liberian Sport',
  alternates: { canonical: '/sports' },
  description:
    'TrueRate Sports — club finance, sponsorships, transfers, governance and athlete economics across Liberian and West African sport. Data-driven sports business journalism.',
};

export const revalidate = 300; // refresh every 5 min, like /economy

const EDITION_DATE = new Date().toLocaleDateString('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

/** Common card shape — satisfied by both CMS articles and the mock TopStory. */
type CardStory = {
  category: string;
  categorySlug?: string;
  title: string;
  dek?: string;
  author?: string;
  source?: string;
  time: string;
  href: string;
  flag?: StoryFlag;
  dateline?: string;
  image?: string | null;
};

function articleToCard(a: SportsArticle): CardStory {
  return {
    category: a.category?.label ?? 'Sports',
    categorySlug: a.category?.slug ?? 'sports',
    title: a.title,
    dek: a.dek ?? undefined,
    author: a.author?.name ?? undefined,
    time: timeAgo(a.published_at),
    href: `/news/${a.slug}`,
    image: a.hero_image,
  };
}

function articleToEditorial(a: SportsArticle): EditorialItem {
  return {
    category: a.category?.label ?? 'Sports',
    title: a.title,
    dek: a.dek ?? '',
    source: a.author?.name ?? 'TrueRate Sports',
    time: timeAgo(a.published_at),
    href: `/news/${a.slug}`,
    image: a.hero_image,
  };
}

/** Editorial headline card — photo, flag, category, dateline, headline, byline. */
function StoryCard({ s, size = 'md' }: { s: CardStory; size?: 'md' | 'sm' }) {
  return (
    <Link href={s.href} className="group flex flex-col no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">
      <div className="relative overflow-hidden rounded-lg mb-3">
        <NewsThumbnail category={s.categorySlug ?? s.category} src={s.image} className={`w-full ${size === 'sm' ? 'h-[130px]' : 'h-[180px]'} transition-transform motion-safe:group-hover:scale-[1.03]`} />
        {s.flag && <span className="absolute left-2 top-2"><FlagChip flag={s.flag} /></span>}
      </div>
      <span className={`text-2xs font-bold uppercase tracking-wider mb-1 ${getCatColor(s.categorySlug ?? s.category)}`}>{s.category}</span>
      <h3 className={`${size === 'sm' ? 'text-sm' : 'text-base'} font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3 text-pretty`}>
        {s.dateline && <span className="text-gray-500">{s.dateline} — </span>}{s.title}
      </h3>
      <p className="mt-1.5 text-2xs text-gray-500">
        {s.author ? `By ${s.author}` : (s.source ?? 'TrueRate Sports')}<span className="mx-1 text-gray-300">·</span>{s.time}
      </p>
    </Link>
  );
}

/** Compact text headline (no image) for the secondary lead column. */
function HeadlineRow({ s }: { s: CardStory }) {
  return (
    <Link href={s.href} className="group block py-3.5 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">
      <div className="flex items-center gap-2 mb-1">
        {s.flag && <FlagChip flag={s.flag} />}
        <span className={`text-2xs font-bold uppercase tracking-wider ${getCatColor(s.categorySlug ?? s.category)}`}>{s.category}</span>
      </div>
      <h3 className="text-base font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors text-pretty">
        {s.title}
      </h3>
      <p className="mt-1 text-2xs text-gray-500">{s.author ? `By ${s.author}` : (s.source ?? 'TrueRate Sports')}<span className="mx-1 text-gray-300">·</span>{s.time}</p>
    </Link>
  );
}

export default async function SportsPage() {
  // Backend-first: real published sports articles drive the editorial surfaces.
  // Until any are published, the mock content keeps the design preview full.
  const [db, clubs, athletes] = await Promise.all([
    fetchSportsArticles({ limit: 18 }),
    fetchClubs(),
    fetchAthletes(),
  ]);
  const useDb = db.length > 0;

  const heroProps: React.ComponentProps<typeof HeroLede> = useDb
    ? {
        category: db[0].category?.label ?? 'Sports',
        imageCategory: db[0].category?.slug ?? 'sports',
        image: db[0].hero_image,
        title: db[0].title,
        dek: db[0].dek ?? '',
        source: 'TrueRate Sports',
        author: db[0].author?.name,
        time: timeAgo(db[0].published_at),
        href: `/news/${db[0].slug}`,
      }
    : {
        category: DASHBOARD_HERO.kicker,
        imageCategory: 'sponsorship',
        title: DASHBOARD_HERO.title,
        dek: DASHBOARD_HERO.dek,
        source: DASHBOARD_HERO.source,
        time: DASHBOARD_HERO.time,
        href: DASHBOARD_HERO.href,
        flag: DASHBOARD_HERO.flag,
        dateline: DASHBOARD_HERO.dateline,
        author: DASHBOARD_HERO.author,
        authorRole: DASHBOARD_HERO.authorRole,
        readTime: DASHBOARD_HERO.readTime,
        updated: DASHBOARD_HERO.updated,
      };

  const secondaryLeads: CardStory[] = useDb
    ? db.slice(1, 5).map(articleToCard)
    : (DASHBOARD_TOP_STORIES.slice(0, 4) as TopStory[]);
  const investigations: EditorialItem[] = useDb
    ? db.slice(5, 8).map(articleToEditorial)
    : DASHBOARD_EDITORIAL;
  const latest: CardStory[] = useDb
    ? db.slice(8, 18).map(articleToCard)
    : (DASHBOARD_TOP_STORIES.slice(0, 6) as TopStory[]);

  const [leadInvestigation, ...restInvestigations] = investigations;

  return (
    <div className="min-h-screen bg-brand-surface text-gray-800">
      <SportsMasthead />

      <main className="mx-auto max-w-container px-4 py-6">
        {/* Edition line */}
        <p className="pb-3 mb-6 border-b border-gray-900/15 text-2xs font-bold uppercase tracking-[0.16em] text-gray-500">
          Monrovia <span className="text-gray-300">·</span> {EDITION_DATE} <span className="text-gray-300">·</span> Sports Business Edition
        </p>

        {/* 1 — Lead: hero + secondary headlines */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 pb-10 border-b border-gray-900/15">
          <div className="min-w-0 lg:col-span-2 lg:border-r lg:border-gray-900/15 lg:pr-8">
            <HeroLede {...heroProps} />
          </div>
          {secondaryLeads.length > 0 && (
            <div className="flex flex-col divide-y divide-gray-200 min-w-0">
              {secondaryLeads.map((s, i) => (
                <HeadlineRow key={`${s.href}-${i}`} s={s} />
              ))}
            </div>
          )}
        </div>

        {/* 2 — Featured investigations */}
        {leadInvestigation && (
          <section aria-labelledby="investigations" className="mt-12">
            <SectionHead id="investigations" title="Featured Investigations" />
            <div className="grid gap-8 lg:grid-cols-2">
              <InvestigationCard item={leadInvestigation} imageCategory="investigation" />
              <div className="flex flex-col divide-y divide-gray-200">
                {restInvestigations.map((e) => (
                  <InvestigationCard key={e.title} item={e} variant="row" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3 — Latest + right rail (Most Read, Calendar) */}
        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          {latest.length > 0 && (
            <section aria-labelledby="latest-intel" className="lg:col-span-2">
              <SectionHead id="latest-intel" title="Latest Sports Intelligence" />
              <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {latest.map((s, i) => (
                  <StoryCard key={`latest-${s.href}-${i}`} s={s} size="sm" />
                ))}
              </div>
            </section>
          )}

          <aside aria-label="Most read and schedule" className={latest.length > 0 ? 'space-y-10' : 'space-y-10 lg:col-span-3'}>
            <section aria-labelledby="most-read">
              <SectionHead id="most-read" title="Most Read" />
              <MostRead items={DASHBOARD_MOST_READ} />
            </section>
            <section aria-labelledby="calendar-rail">
              <SectionHead id="calendar-rail" title="Industry Calendar" />
              <ol className="border-t border-gray-200 divide-y divide-gray-200">
                {DASHBOARD_CALENDAR.map((c) => (
                  <li key={c.title} className="flex items-start gap-3 py-3">
                    <span className="shrink-0 w-12 text-2xs font-bold uppercase tracking-wide text-brand-accent-ink tabular-nums pt-0.5">{c.date}</span>
                    <span className="min-w-0">
                      <span className="block text-sm text-gray-900 leading-snug">{c.title}</span>
                      <span className="block text-2xs uppercase tracking-wide text-gray-400 mt-0.5">{c.type}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>

        {/* 4 — West Africa wire */}
        <section aria-labelledby="wa-wire" className="mt-12">
          <SectionHead id="wa-wire" title="West Africa Wire" />
          <WireFeed items={DASHBOARD_WEST_AFRICA} />
        </section>

        {/* 5 — Podcast + newsletter */}
        <section aria-labelledby="engage" className="mt-12">
          <h2 id="engage" className="sr-only">Listen and subscribe</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <PodcastModule episodes={PODCAST_EPISODES} />
            <NewsletterSignup />
          </div>
        </section>

        {/* 6 — Executive interviews */}
        <section id="interviews" aria-labelledby="exec-interviews" className="mt-12 scroll-mt-24">
          <SectionHead id="exec-interviews" title="Executive Interviews" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {EXECUTIVE_INTERVIEWS.map((it) => (
              <InterviewCard key={it.name} item={it} />
            ))}
          </div>
        </section>

        {/* 7 — Data center (the one place numbers live) */}
        <section id="data-center" aria-labelledby="data-center-h" className="mt-12 scroll-mt-24">
          <SectionHead id="data-center-h" title="Sports Data Center" action="/sports/club-finance" actionLabel="Full data" />
          <p className="-mt-2 mb-5 text-sm text-gray-500 max-w-[60ch]">
            The numbers behind the stories — athlete market values and club valuations, updated as deals are reported.
          </p>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Athlete market values</h3>
              <IntelTable<AthleteIntel>
                caption="Estimated market values of leading Liberian athletes"
                rows={athletes}
                getRowKey={(r) => r.name}
                columns={[
                  { key: 'rank', label: '#', render: (r) => <span className="text-gray-400">{r.rank}</span> },
                  { key: 'name', label: 'Athlete', primary: true },
                  { key: 'pos', label: 'Discipline', hideOnMobile: true, render: (r) => <span className="text-gray-500">{r.pos}</span> },
                  { key: 'club', label: 'Club', hideOnMobile: true, render: (r) => <span className="text-gray-500">{r.club}</span> },
                  { key: 'marketValue', label: 'Est. value', numeric: true, primary: true },
                  { key: 'trend', label: 'Trend', numeric: true, render: (r) => <Delta text={r.trend} up={r.up} className="text-xs justify-end" /> },
                ]}
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Club valuations</h3>
              <IntelTable<ClubValuation>
                caption="Liberian Premier League club valuations"
                rows={clubs.valuations}
                getRowKey={(r) => r.club}
                columns={[
                  { key: 'rank', label: '#', render: (r) => <span className="text-gray-400">{r.rank}</span> },
                  { key: 'club', label: 'Club', primary: true },
                  { key: 'estValue', label: 'Est. value', numeric: true, primary: true },
                  { key: 'yoy', label: 'YoY', numeric: true, render: (r) => <Delta text={r.yoy} up={r.up} className="text-xs justify-end" /> },
                ]}
              />
              <p className="mt-3 text-2xs text-gray-500">
                Illustrative sample data for design preview.{' '}
                <Link href="/sports/club-finance" className="text-brand-accent-ink hover:text-brand-ink no-underline">Full club intelligence ›</Link>
              </p>
            </div>
          </div>
        </section>

        <div className="mt-14">
          <SidebarFooter />
        </div>
      </main>
    </div>
  );
}
