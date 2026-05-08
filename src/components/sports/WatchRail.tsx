import Link from 'next/link';
import { VideoThumbnail } from '@/components/NewsThumbnail';
import type { VideoCard } from '@/lib/sports-data';

/** Horizontal rail of video cards — mirrors Yahoo's video carousel. */
export default function WatchRail({ videos }: { videos: VideoCard[] }) {
  return (
    <section aria-label="Sports videos">
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:thin]">
        {videos.map(v => (
          <Link
            key={v.href}
            href={v.href}
            className="group snap-start shrink-0 w-[260px] sm:w-[300px] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050d11]"
          >
            <div className="overflow-hidden mb-2">
              <VideoThumbnail category={v.category} duration={v.duration} className="w-full h-[170px] sm:h-[180px]" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-400 mb-1">{v.category}</p>
            <h3 className="text-[14px] font-semibold text-gray-100 leading-snug group-hover:text-white transition-colors line-clamp-2">
              {v.title}
            </h3>
            <p className="mt-1 text-[11px] text-gray-500">
              <span className="font-semibold text-gray-400">{v.source}</span>
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
