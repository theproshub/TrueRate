import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import TechnologyTopicTabs from '@/components/TechnologyTopicTabs';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import { getNewsItems } from '@/lib/news-source';
import { timeAgo } from '@/lib/utils';
import { TECHNOLOGY_TOPIC_BY_SLUG, TECHNOLOGY_TOPICS } from '@/lib/technology-topics';

export const revalidate = 0; // always read the latest articles from the DB

export function generateStaticParams() {
  return TECHNOLOGY_TOPICS.map(t => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = TECHNOLOGY_TOPIC_BY_SLUG[slug];
  if (!topic) return { title: 'Technology — TrueRate' };
  return {
    title: `${topic.label} — Technology | TrueRate`,
    description: topic.blurb,
  };
}

export default async function TechnologyTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const topic = TECHNOLOGY_TOPIC_BY_SLUG[slug];
  if (!topic) notFound();

  const items = (await getNewsItems())
    .filter(topic.matches)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <main className="mx-auto max-w-container px-4 py-6">
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Technology', href: '/technology' }, { label: topic.label }]} />
        <TechnologyTopicTabs activeSlug={topic.slug} />
      </div>

      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-accent-ink mb-2">Technology &middot; {topic.label}</p>
        <h1 className="text-3xl sm:text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 mb-3">{topic.label}</h1>
        <p className="text-md text-gray-600 leading-relaxed max-w-[720px]">{topic.blurb}</p>
        <p className="mt-3 text-sm text-gray-500 tabular-nums">
          {items.length} {items.length === 1 ? 'story' : 'stories'} matched from the TrueRate newsroom.
        </p>
      </header>

      {items.length === 0 ? (
        <section className="border-t border-gray-200 pt-6 pb-10 text-center">
          <p className="text-md text-gray-600 mb-2">No published stories tagged for this topic yet.</p>
          <p className="text-base text-gray-500 mb-6">Browse the newsroom or check back as coverage develops.</p>
          <Link href="/news" className="inline-block rounded-lg bg-brand-accent px-5 py-2.5 text-base font-bold text-brand-dark hover:bg-brand-accent-hover transition-colors no-underline">
            All news
          </Link>
        </section>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {items.map(item => (
            <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col no-underline">
              <div className="overflow-hidden rounded-xl mb-3">
                <NewsThumbnail category={item.category} src={item.image} className="w-full h-[170px]" />
              </div>
              <p className={`text-2xs font-bold uppercase tracking-widest mb-1.5 ${getCatColor(item.category)}`}>{item.category}</p>
              <h2 className="text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-900/75 transition-colors line-clamp-3 mb-2">{item.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">{item.summary}</p>
              <div className="mt-auto text-xs text-gray-500">{item.source} &middot; {timeAgo(item.date)}</div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
