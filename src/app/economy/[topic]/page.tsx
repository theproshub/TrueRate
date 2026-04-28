import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import EconomyTopicTabs from '@/components/EconomyTopicTabs';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import { newsItems } from '@/data/news';
import { timeAgo } from '@/lib/utils';
import { ECONOMY_TOPIC_BY_SLUG, ECONOMY_TOPICS } from '@/lib/economy-topics';

export function generateStaticParams() {
  return ECONOMY_TOPICS.map(t => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = ECONOMY_TOPIC_BY_SLUG[slug];
  if (!topic) return { title: 'Economy — TrueRate' };
  return {
    title: `${topic.label} — Economy | TrueRate`,
    description: topic.blurb,
  };
}

export default async function EconomyTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const topic = ECONOMY_TOPIC_BY_SLUG[slug];
  if (!topic) notFound();

  const items = newsItems
    .filter(topic.matches)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Economy', href: '/economy' }, { label: topic.label }]} />

      <EconomyTopicTabs activeSlug={topic.slug} />

      <header className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-2">Economy &middot; {topic.label}</p>
        <h1 className="text-[32px] sm:text-[32px] font-black leading-[1.1] tracking-tight text-white mb-3">{topic.label}</h1>
        <p className="text-[14px] text-gray-300 leading-relaxed max-w-[720px]">{topic.blurb}</p>
        <p className="mt-3 text-[12px] text-gray-500 tabular-nums">
          {items.length} {items.length === 1 ? 'story' : 'stories'} matched from the TrueRate newsroom.
        </p>
      </header>

      {items.length === 0 ? (
        <section className="border-t border-white/[0.06] pt-10 pb-16 text-center">
          <p className="text-[14px] text-gray-300 mb-2">No published stories tagged for this topic yet.</p>
          <p className="text-[13px] text-gray-500 mb-6">Browse the newsroom or check back as coverage develops.</p>
          <Link href="/news" className="inline-block rounded-lg bg-brand-accent px-5 py-2.5 text-[13px] font-bold text-brand-dark hover:bg-[#a8d42a] transition-colors no-underline">
            All news
          </Link>
        </section>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {items.map(item => (
            <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col no-underline">
              <div className="overflow-hidden rounded-xl mb-3">
                <NewsThumbnail category={item.category} className="w-full h-[170px]" />
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${getCatColor(item.category)}`}>{item.category}</p>
              <h2 className="text-[12px] font-bold leading-snug text-white group-hover:text-white/75 transition-colors line-clamp-3 mb-2">{item.title}</h2>
              <p className="text-[12px] text-gray-400 line-clamp-2 mb-2">{item.summary}</p>
              <div className="mt-auto text-[11px] text-gray-500">{item.source} &middot; {timeAgo(item.date)}</div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
