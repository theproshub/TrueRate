import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import SportsMasthead from '@/components/sports/SportsMasthead';
import SportsDeskHero, { type HeroCard, type HeroVariant } from '@/components/sports/SportsDeskHero';
import SportsDeskSidebar from '@/components/sports/SportsDeskSidebar';
import SportsStoryList from '@/components/sports/SportsStoryList';
import SidebarFooter from '@/components/sports/SidebarFooter';
import { SPORTS_STORIES, type SportsStory } from '@/data/sports-stories';

/**
 * Shared EDITORIAL layout for the sports data-desk pages (club finance,
 * sponsorship, transfers, broadcast). Each page passes its own `variant` so the
 * four desks read visually different, followed by a single "By the Numbers"
 * data module and a "More from Sports" grid. Every headline opens the full
 * article at /sports/news/<slug>. Numbers stay confined to the one data module
 * (not scattered), per the section's editorial goals.
 */

const href = (s: SportsStory) => `/sports/news/${s.slug}`;

const toHeroCard = (s: SportsStory): HeroCard => ({
  category: s.category,
  title: s.title,
  href: href(s),
  dek: s.summary,
  author: s.author ?? s.source,
  time: s.time,
  flag: s.flag,
});

export default function SportsDeskLayout({
  label,
  blurb,
  stories,
  variant = 'bigLeft',
  dataTitle,
  dataNote,
  children,
}: {
  label: string;
  blurb: string;
  stories: SportsStory[];
  /** This desk's signature hero layout — pass a different one per page. */
  variant?: HeroVariant;
  dataTitle: string;
  dataNote: string;
  children: React.ReactNode;
}) {
  const lead = stories[0];
  const shown = new Set(stories.slice(0, 4).map((s) => s.slug));
  const more = SPORTS_STORIES.filter((s) => !shown.has(s.slug)).slice(0, 6);

  return (
    <div className="min-h-screen bg-brand-surface text-gray-800">
      <SportsMasthead />
      <main className="mx-auto max-w-container px-4 py-6">
        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label }]} />

        {/* Standfirst */}
        <header className="mt-4 mb-8 pb-6 border-b-2 border-gray-900">
          <p className="text-2xs font-bold uppercase tracking-[0.18em] text-brand-accent-ink mb-2">TrueRate Sports</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{label}</h1>
          <p className="mt-3 text-base sm:text-lg leading-relaxed text-gray-600 max-w-[68ch]">{blurb}</p>
        </header>

        {/* Desk hero — this desk's signature layout */}
        {lead && (
          <div className="mb-12">
            <SportsDeskHero variant={variant} cards={stories.slice(0, 4).map(toHeroCard)} />
          </div>
        )}

        {/* Below the hero: data module + more, with the reader rail alongside */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-2 min-w-0">

        {/* By the Numbers — the single data module for this desk */}
        <section aria-labelledby="desk-data" className="mb-12">
          <div className="flex items-baseline justify-between border-b-2 border-gray-900 pb-2 mb-5">
            <h2 id="desk-data" className="text-sm font-black uppercase tracking-[0.16em] text-gray-900">{dataTitle}</h2>
            <span className="text-2xs font-semibold uppercase tracking-wide text-gray-400">By the numbers</span>
          </div>
          {children}
          <p className="mt-3 text-2xs text-gray-400">{dataNote}</p>
        </section>

        {/* More from Sports */}
        {more.length > 0 && (
          <section aria-labelledby="desk-more" className="mb-12">
            <div className="flex items-baseline justify-between border-b-2 border-gray-900 pb-2 mb-5">
              <h2 id="desk-more" className="text-sm font-black uppercase tracking-[0.16em] text-gray-900">More from TrueRate Sports</h2>
              <Link href="/sports" className="text-2xs font-semibold uppercase tracking-wide text-brand-accent-ink hover:text-brand-ink no-underline">All sports ›</Link>
            </div>
            <SportsStoryList stories={more} />
          </section>
        )}

          </div>{/* /left column */}

          {/* Reader rail — most read on this desk, newsletter, cross-desk nav */}
          <SportsDeskSidebar
            label={label}
            blurb={blurb}
            mostRead={stories.slice(0, 5).map((s) => ({ title: s.title, href: href(s) }))}
          />
        </div>{/* /grid */}

        <SidebarFooter />
      </main>
    </div>
  );
}
