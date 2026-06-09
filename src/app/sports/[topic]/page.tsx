import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import SportsMasthead from '@/components/sports/SportsMasthead';
import SectionHead from '@/components/sports/SectionHead';
import SidebarFooter from '@/components/sports/SidebarFooter';
import HeroLede from '@/components/sports/HeroLede';
import FlagChip from '@/components/sports/FlagChip';
import WireFeed from '@/components/sports/WireFeed';
import InterviewCard from '@/components/sports/InterviewCard';
import IntelTable from '@/components/sports/IntelTable';
import Delta from '@/components/sports/Delta';
import { SPORTS_DESKS, getSportsDesk } from '@/lib/sports-desks';
import { fetchSportsArticles, timeAgo } from '@/lib/sports/feed';
import { fetchClubs, fetchAthletes } from '@/lib/sports/intel';
import type { StoryFlag } from '@/lib/sports-finance-data';
import {
  DASHBOARD_WEST_AFRICA,
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

type DeskCard = {
  category: string;
  categorySlug?: string;
  title: string;
  dek?: string;
  author: string;
  time: string;
  href?: string;
  image?: string | null;
  flag?: StoryFlag;
};

function StoryCard({ s }: { s: DeskCard }) {
  const body = (
    <>
      <div className="relative overflow-hidden rounded-lg mb-3">
        <NewsThumbnail category={s.categorySlug ?? s.category} src={s.image} className="w-full h-[150px] transition-transform motion-safe:group-hover:scale-[1.03]" />
        {s.flag && <span className="absolute left-2 top-2"><FlagChip flag={s.flag} /></span>}
      </div>
      <span className={`text-2xs font-bold uppercase tracking-wider mb-1 ${getCatColor(s.categorySlug ?? s.category)}`}>{s.category}</span>
      <h3 className="text-base font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors text-pretty">{s.title}</h3>
      {s.dek && <p className="mt-1 text-sm text-gray-600 leading-relaxed line-clamp-2">{s.dek}</p>}
      <p className="mt-1.5 text-2xs text-gray-500">By {s.author}<span className="mx-1 text-gray-300">·</span>{s.time}</p>
    </>
  );
  return s.href ? (
    <Link href={s.href} className="group flex flex-col no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">{body}</Link>
  ) : (
    <article className="group flex flex-col">{body}</article>
  );
}

export default async function SportsDeskPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const desk = getSportsDesk(topic);
  if (!desk) notFound();

  // Backend-first: published articles in this desk's category drive the page.
  // Falls back to the mock desk content until real articles are published.
  const [db, clubs, athletes] = await Promise.all([
    fetchSportsArticles({ slugs: [desk.slug], limit: 13 }),
    fetchClubs(),
    fetchAthletes(),
  ]);
  const useDb = db.length > 0;

  const lead = db[0];
  const stories: DeskCard[] = useDb
    ? db.slice(1).map((a) => ({
        category: a.category?.label ?? desk.label,
        categorySlug: a.category?.slug ?? desk.slug,
        title: a.title,
        dek: a.dek ?? undefined,
        author: a.author?.name ?? 'TrueRate Sports',
        time: timeAgo(a.published_at),
        href: `/news/${a.slug}`,
        image: a.hero_image,
      }))
    : desk.stories.map((s) => ({ ...s, author: s.author }));

  return (
    <div className="min-h-screen bg-brand-surface text-gray-800">
      <SportsMasthead />
      <main className="mx-auto max-w-container px-4 py-6">
        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label: desk.label }]} />

        {/* Desk standfirst */}
        <div className="mt-4 mb-8 pb-6 border-b border-gray-900/15">
          <p className="text-2xs font-bold uppercase tracking-[0.18em] text-brand-accent-ink mb-2">TrueRate Sports</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{desk.label}</h1>
          <p className="mt-3 text-lg leading-relaxed text-gray-600 max-w-[68ch]">{desk.blurb}</p>
        </div>

        {/* Lead story */}
        <HeroLede
          category={useDb ? (lead.category?.label ?? desk.label) : desk.lead.category}
          title={useDb ? lead.title : desk.lead.title}
          dek={useDb ? (lead.dek ?? '') : desk.lead.dek}
          source={useDb ? (lead.author?.name ?? 'TrueRate Sports') : 'TrueRate Sports'}
          time={useDb ? timeAgo(lead.published_at) : desk.lead.time}
          href={useDb ? `/news/${lead.slug}` : '#'}
          imageCategory={useDb ? (lead.category?.slug ?? desk.imageCategory) : desk.imageCategory}
          image={useDb ? lead.hero_image : undefined}
          flag={useDb ? undefined : desk.lead.flag}
          author={useDb ? lead.author?.name : desk.lead.author}
          readTime={useDb ? undefined : '5 min read'}
        />

        {/* Story stream */}
        {stories.length > 0 && (
          <section aria-labelledby="desk-latest" className="mt-12">
            <SectionHead id="desk-latest" title={`Latest in ${desk.label}`} />
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((s, i) => (
                <StoryCard key={`${s.title}-${i}`} s={s} />
              ))}
            </div>
          </section>
        )}

        {/* Interviews module */}
        {desk.module === 'interviews' && (
          <section aria-labelledby="desk-interviews" className="mt-12">
            <SectionHead id="desk-interviews" title="Executive Interviews" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {EXECUTIVE_INTERVIEWS.map((it) => (
                <InterviewCard key={it.name} item={it} />
              ))}
            </div>
          </section>
        )}

        {/* Data module */}
        {desk.module === 'data' && (
          <section aria-labelledby="desk-data" className="mt-12">
            <SectionHead id="desk-data" title="Datasets" />
            <div className="grid gap-8 lg:grid-cols-2">
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

        {/* Regional wire */}
        <section aria-labelledby="desk-wire" className="mt-12">
          <SectionHead id="desk-wire" title="West Africa Wire" />
          <WireFeed items={DASHBOARD_WEST_AFRICA} />
        </section>

        <div className="mt-12">
          <SidebarFooter />
        </div>
      </main>
    </div>
  );
}
