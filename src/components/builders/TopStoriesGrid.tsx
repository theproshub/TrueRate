import Link from 'next/link';
import { HeroVisual, NewsThumbnail } from '@/components/NewsThumbnail';
import { HERO_STORY, SECONDARY_STORIES } from '@/lib/builders-data';
import { Text } from '@/components/ui';

export default function TopStoriesGrid() {
  return (
    <section aria-labelledby="builders-top-stories" className="mb-8">
      <h2
        id="builders-top-stories"
        className="text-md font-bold text-gray-900 border-b border-gray-200 pb-3 mb-5"
      >
        Entrepreneurship <span className="font-light text-gray-500 mx-1">|</span> Top Stories
      </h2>

      {/* Hero: image left, headline right */}
      <Link href={HERO_STORY.href} className="group no-underline grid grid-cols-1 sm:grid-cols-2 gap-6 mb-7">
        <HeroVisual category={HERO_STORY.category} className="h-[220px] sm:h-[280px] rounded-lg" />
        <div className="flex flex-col justify-center">
          <h3 className="text-xl sm:text-2xl font-bold leading-[1.2] tracking-tight text-gray-900 group-hover:text-brand-accent-ink transition-colors mb-2">
            {HERO_STORY.title}
          </h3>
          {HERO_STORY.dek && (
            <Text className="text-gray-500 leading-relaxed mb-2 line-clamp-3">{HERO_STORY.dek}</Text>
          )}
          <span className="text-xs text-gray-500">{HERO_STORY.source}</span>
        </div>
      </Link>

      {/* Secondary 3-up row, image-left horizontal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5 border-t border-gray-200">
        {SECONDARY_STORIES.map((s, i) => (
          <Link key={i} href={s.href} className="group flex gap-3 no-underline">
            <NewsThumbnail category={s.category} className="w-[88px] h-[88px] rounded shrink-0" />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm sm:text-base font-semibold leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-3 mb-1">{s.title}</h4>
              <span className="text-xs text-gray-500">{s.source}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
