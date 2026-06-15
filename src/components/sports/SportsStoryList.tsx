import Link from 'next/link';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import type { SportsStory } from '@/data/sports-stories';

/**
 * Readable story grid used on the sports desk pages. Every card links to the
 * full article at /sports/news/<slug>, so a headline click always opens the
 * complete story (same reading experience as /news).
 */
export default function SportsStoryList({ stories }: { stories: SportsStory[] }) {
  if (stories.length === 0) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {stories.map((s) => (
        <Link key={s.slug} href={`/sports/news/${s.slug}`} className="group flex flex-col no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2 rounded-md">
          <div className="overflow-hidden rounded-md mb-2.5">
            <NewsThumbnail category={s.category} className="w-full h-[140px]" />
          </div>
          <span className={`text-2xs font-bold uppercase tracking-wide mb-1 ${getCatColor(s.category)}`}>{s.category}</span>
          <h3 className="text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3 mb-1.5">{s.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-2">{s.summary}</p>
          <span className="text-2xs text-gray-400 mt-auto">{s.source} · {s.time}</span>
        </Link>
      ))}
    </div>
  );
}
