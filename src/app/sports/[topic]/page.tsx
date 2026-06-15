import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import SportsMasthead from '@/components/sports/SportsMasthead';
import SectionHead from '@/components/sports/SectionHead';
import SidebarFooter from '@/components/sports/SidebarFooter';
import FlagChip from '@/components/sports/FlagChip';
import InterviewCard from '@/components/sports/InterviewCard';
import IntelTable from '@/components/sports/IntelTable';
import Delta from '@/components/sports/Delta';
import SportsDeskHero, { type HeroCard } from '@/components/sports/SportsDeskHero';
import SportsDeskSidebar from '@/components/sports/SportsDeskSidebar';
import SportsStoryList from '@/components/sports/SportsStoryList';
import { SPORTS_DESKS, getSportsDesk } from '@/lib/sports-desks';
import { fetchSportsArticles, timeAgo } from '@/lib/sports/feed';
import { fetchClubs, fetchAthletes } from '@/lib/sports/intel';
import { SPORTS_STORIES, sportsStoriesBySection, type SportsStory } from '@/data/sports-stories';
import { deskStoriesForTopic } from '@/data/sports-desk-stories';
import {
  EXECUTIVE_INTERVIEWS,
  type AthleteIntel,
  type ClubValuation,
} from '@/lib/sports-finance-data';

export const revalidate = 300;

export function generateStaticParams() {
  return SPORTS_DESKS.map((d) => ({ topic: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const desk = getSportsDesk(topic);
  if (!desk) return { title: 'Sports — TrueRate' };
  return {
    title: `${desk.label} — TrueRate Sports`,
    description: desk.blurb,
    alternates: { canonical: `/sports/${desk.slug}` },
  };
}

/** Image-led story card (thumbnail + headline) for the grid. */
function StoryCard({ s }: { s: HeroCard }) {
  return (
    <Link href={s.href ?? '#'} className="group flex flex-col no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2 rounded-md">
      <div className="relative overflow-hidden rounded-lg mb-3">
        <NewsThumbnail category={s.categorySlug ?? s.category} src={s.image} className="w-full h-[150px] transition-transform motion-safe:group-hover:scale-[1.03]" />
        {s.flag && <span className="absolute left-2 top-2"><FlagChip flag={s.flag} /></span>}
      </div>
      <span className={`text-2xs font-bold uppercase tracking-wider mb-1 ${getCatColor(s.categorySlug ?? s.category)}`}>{s.category}</span>
      <h3 className="text-base font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors text-pretty line-clamp-3">{s.title}</h3>
      {s.dek && <p className="mt-1 text-sm text-gray-600 leading-relaxed line-clamp-2">{s.dek}</p>}
      {(s.author || s.time) && <p className="mt-1.5 text-2xs text-gray-500">{s.author ? `By ${s.author}` : ''}{s.author && s.time ? ' · ' : ''}{s.time}</p>}
    </Link>
  );
}

/** Readable stories for a desk topic (preview mode) — always link to /sports/news/<slug>.
 *  Merges category-specific desk stories with category matches so each page is
 *  genuinely about its topic AND deep enough to fill a hero plus a stream. */
function storiesForDesk(slug: string, label: string): SportsStory[] {
  if (slug === 'sponsorship') return sportsStoriesBySection('sponsorship', { includeHero: true });
  if (slug === 'transfers' || slug === 'transfers-deals') return sportsStoriesBySection('transfers', { includeHero: true });
  if (slug === 'broadcast' || slug === 'broadcast-rights') return sportsStoriesBySection('broadcast', { includeHero: true });
  const deskSpecific = deskStoriesForTopic(slug);
  const byCategory = SPORTS_STORIES.filter((s) => s.category.toLowerCase() === label.toLowerCase());
  const seen = new Set<string>();
  const merged = [...deskSpecific, ...byCategory].filter((s) => !seen.has(s.slug) && seen.add(s.slug));
  if (merged.length > 0) return merged;
  return sportsStoriesBySection('main', { includeHero: true });
}

export default async function SportsDeskPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const desk = getSportsDesk(topic);
  if (!desk) notFound();

  const [db, clubs, athletes] = await Promise.all([
    fetchSportsArticles({ slugs: [desk.slug], limit: 13 }),
    fetchClubs(),
    fetchAthletes(),
  ]);
  const useDb = db.length > 0;

  // Preview-mode stories come from the sports-stories dataset so every headline
  // opens a full article at /sports/news/<slug>.
  const mock = useDb ? [] : storiesForDesk(desk.slug, desk.label);

  const cards: HeroCard[] = useDb
    ? db.map((a) => ({
        category: a.category?.label ?? desk.label,
        categorySlug: a.category?.slug ?? desk.slug,
        title: a.title,
        dek: a.dek ?? undefined,
        author: a.author?.name ?? 'TrueRate Sports',
        time: timeAgo(a.published_at),
        href: `/news/${a.slug}`,
        image: a.hero_image,
      }))
    : mock.map((s) => ({
        category: s.category,
        categorySlug: s.category,
        title: s.title,
        dek: s.summary,
        author: s.author ?? s.source,
        time: s.time,
        href: `/sports/news/${s.slug}`,
        flag: s.flag,
      }));

  const heroCards = cards.slice(0, 4);
  const gridCards = cards.slice(4);

  const shownSlugs = new Set(mock.map((s) => s.slug));
  const moreStories = SPORTS_STORIES.filter((s) => !shownSlugs.has(s.slug)).slice(0, 6);

  return (
    <div className="min-h-screen bg-brand-surface text-gray-800">
      <SportsMasthead />
      <main className="mx-auto max-w-container px-4 py-6">
        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label: desk.label }]} />

        {/* Desk standfirst */}
        <div className="mt-4 mb-8 pb-6 border-b-2 border-gray-900">
          <p className="text-2xs font-bold uppercase tracking-[0.18em] text-brand-accent-ink mb-2">TrueRate Sports</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{desk.label}</h1>
          <p className="mt-3 text-base sm:text-lg leading-relaxed text-gray-600 max-w-[68ch]">{desk.blurb}</p>
        </div>

        {/* Desk hero — each desk's own signature layout (explicit, not rotated) */}
        <SportsDeskHero variant={desk.variant} cards={heroCards} />

        {/* Below the hero: desk stream + modules, with the reader rail alongside */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-2 min-w-0">

        {/* Story stream */}
        {gridCards.length > 0 && (
          <section aria-labelledby="desk-latest">
            <SectionHead id="desk-latest" title={`More in ${desk.label}`} />
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
              {gridCards.map((s, i) => (
                <StoryCard key={`${s.title}-${i}`} s={s} />
              ))}
            </div>
          </section>
        )}

        {/* Interviews module */}
        {desk.module === 'interviews' && (
          <section aria-labelledby="desk-interviews" className="mt-12 first:mt-0">
            <SectionHead id="desk-interviews" title="Executive Interviews" />
            <div className="grid gap-5 sm:grid-cols-2">
              {EXECUTIVE_INTERVIEWS.map((it) => (
                <InterviewCard key={it.name} item={it} />
              ))}
            </div>
          </section>
        )}

        {/* Data module */}
        {desk.module === 'data' && (
          <section aria-labelledby="desk-data" className="mt-12 first:mt-0">
            <SectionHead id="desk-data" title="Datasets" />
            <div className="grid gap-8 xl:grid-cols-2">
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-3">Athlete market values</h2>
                <IntelTable<AthleteIntel>
                  caption="Estimated market values of leading Liberian athletes"
                  rows={athletes}
                  getRowKey={(r) => r.name}
                  columns={[
                    { key: 'rank', label: '#', render: (r) => <span className="text-gray-400">{r.rank}</span> },
                    { key: 'name', label: 'Athlete', primary: true },
                    { key: 'club', label: 'Club', hideOnMobile: true, render: (r) => <span className="text-gray-500">{r.club}</span> },
                    { key: 'marketValue', label: 'Est. value', numeric: true, primary: true },
                    { key: 'trend', label: 'Trend', numeric: true, render: (r) => <Delta text={r.trend} up={r.up} className="text-xs justify-end" /> },
                  ]}
                />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-3">Club valuations</h2>
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
              </div>
            </div>
            <p className="mt-3 text-2xs text-gray-500">
              Illustrative sample data for design preview.{' '}
              <Link href="/sports/club-finance" className="text-brand-accent-ink hover:text-brand-ink no-underline">Full club intelligence ›</Link>
            </p>
          </section>
        )}

        {/* More from Sports — image-led, readable */}
        {moreStories.length > 0 && (
          <section aria-labelledby="desk-more" className="mt-12 first:mt-0">
            <SectionHead id="desk-more" title="More from TrueRate Sports" action="/sports" actionLabel="All sports" />
            <SportsStoryList stories={moreStories} />
          </section>
        )}

          </div>{/* /left column */}

          {/* Reader rail — about this desk, most read, newsletter, cross-desk nav */}
          <SportsDeskSidebar
            label={desk.label}
            coverage={desk.coverage}
            mostRead={cards.slice(0, 5).map((c) => ({ title: c.title, href: c.href ?? '#' }))}
            currentHref={`/sports/${desk.slug}`}
          />
        </div>{/* /grid */}

        <div className="mt-12">
          <SidebarFooter />
        </div>
      </main>
    </div>
  );
}
