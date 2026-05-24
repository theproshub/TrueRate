import { VideoThumbnail } from '@/components/NewsThumbnail';
import type { VideoCard } from '@/lib/sports-data';
import { Heading, Text } from '@/components/ui';
import PlayableVideo from '@/components/PlayableVideo';
import { videoHref } from '@/lib/youtube';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

/**
 * Two layouts:
 *  - "rail"    (default) — horizontal scroll-snap carousel; cards play inline
 *  - "sidebar" — vertical stacked list (right rail); small thumbs link out
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
        {videos.map((v, i) => (
          <li key={i} className="py-2.5 first:pt-0">
            <a
              href={videoHref(v.youtubeId)}
              {...ext}
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
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:thin]">
      {videos.map((v, i) => (
        <div key={i} className="group snap-start shrink-0 w-[260px] sm:w-[300px]">
          <PlayableVideo id={v.youtubeId} label={v.title} className="overflow-hidden mb-2 h-[170px] sm:h-[180px]">
            <VideoThumbnail category={v.category} duration={v.duration} className="absolute inset-0 w-full h-full" />
          </PlayableVideo>
          <Text variant="meta" className="font-bold uppercase tracking-wide text-gray-400 mb-1">{v.category}</Text>
          <Heading level={5} as="h3" className="text-gray-100 leading-snug line-clamp-2">
            {v.title}
          </Heading>
          <Text variant="meta" className="mt-1 text-gray-500">
            <span className="font-semibold text-gray-400">{v.source}</span>
          </Text>
        </div>
      ))}
    </div>
  );
}
