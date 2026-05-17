import Link from 'next/link';
import { VideoThumbnail } from '@/components/NewsThumbnail';
import type { VideoCard } from '@/lib/sports-data';
import { Heading, Text } from '@/components/ui';

/**
 * Two layouts:
 *  - "rail"    (default) — horizontal scroll-snap carousel (full-width sections)
 *  - "sidebar" — vertical stacked list (right rail)
 */
export default function WatchRail({
  videos,
  layout = 'rail',
}: {
  videos: VideoCard[];
  layout?: 'rail' | 'sidebar';
}) {
  if (layout === 'sidebar') {
    return (
      <ul className="flex flex-col divide-y divide-white/[0.06]">
        {videos.map(v => (
          <li key={v.href} className="py-2.5 first:pt-0">
            <Link
              href={v.href}
              className="group flex items-start gap-2.5 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050d11]"
            >
              <div className="shrink-0 overflow-hidden">
                <VideoThumbnail
                  category={v.category}
                  duration={v.duration}
                  className="w-[80px] h-[52px]"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Heading level={6} className="text-gray-100 leading-snug group-hover:text-white group-hover:underline group-hover:decoration-white/50 underline-offset-2 transition-colors line-clamp-2">
                  {v.title}
                </Heading>
                <Text variant="caption" className="mt-0.5 text-gray-500">
                  {v.duration && <span className="text-gray-300 font-semibold mr-1.5">{v.duration}</span>}
                  {v.source}
                </Text>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:thin]">
      {videos.map(v => (
        <Link
          key={v.href}
          href={v.href}
          className="group snap-start shrink-0 w-[260px] sm:w-[300px] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050d11]"
        >
          <div className="overflow-hidden mb-2">
            <VideoThumbnail category={v.category} duration={v.duration} className="w-full h-[170px] sm:h-[180px]" />
          </div>
          <Text variant="meta" className="font-bold uppercase tracking-wide text-gray-400 mb-1">{v.category}</Text>
          <Heading level={5} as="h3" className="text-gray-100 leading-snug group-hover:text-white transition-colors line-clamp-2">
            {v.title}
          </Heading>
          <Text variant="meta" className="mt-1 text-gray-500">
            <span className="font-semibold text-gray-400">{v.source}</span>
          </Text>
        </Link>
      ))}
    </div>
  );
}
