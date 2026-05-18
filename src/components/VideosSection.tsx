import Link from 'next/link';
import type { Video } from '@/data/todays-videos';
import { VideoThumbnail } from '@/components/NewsThumbnail';

export default function VideosSection({ videos }: { videos: Video[] }) {
  const [featured, ...rest] = videos;
  return (
    <section aria-labelledby="todays-videos">
      {/* Section header — matches homepage typography */}
      <div className="flex items-end justify-between border-b border-white/20 pb-3 mb-5">
        <h2 id="todays-videos" className="text-md font-bold text-white">Today&apos;s Videos</h2>
        <Link
          href="/videos"
          className="text-sm text-gray-300 hover:text-brand-accent transition-colors no-underline focus-visible:outline-none focus-visible:underline"
        >
          Explore more ›
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured */}
        <Link href="/videos" className="group flex flex-col no-underline">
          <div className="relative overflow-hidden rounded-xl mb-3">
            <VideoThumbnail category={featured.category} className="w-full aspect-video" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold text-white tabular-nums backdrop-blur-sm">
              {featured.duration}
            </span>
          </div>
          <h3 className="text-md sm:text-lg font-black leading-[1.25] tracking-tight text-white group-hover:text-white/80 transition-colors mb-2 line-clamp-2">
            {featured.title}
          </h3>
          {featured.description && (
            <p className="text-sm leading-relaxed text-gray-400 line-clamp-3 mb-3">
              {featured.description}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-auto">
            <span>{featured.source}</span>
            <span aria-hidden className="mx-1.5">·</span>
            <span>{featured.time}</span>
          </p>
        </Link>

        {/* Right list */}
        <div className="flex flex-col divide-y divide-white/[0.05]">
          {rest.map((v, i) => (
            <Link key={i} href="/videos" className="group flex gap-3 py-3 first:pt-0 no-underline">
              <div className="shrink-0 overflow-hidden rounded-lg w-[120px] h-[72px]">
                <VideoThumbnail category={v.category} duration={v.duration} className="w-full h-full" />
              </div>
              <div className="min-w-0 flex-1 flex flex-col justify-center">
                <h3 className="text-sm sm:text-base font-semibold leading-snug text-white group-hover:text-white/80 transition-colors line-clamp-2 mb-1">
                  {v.title}
                </h3>
                <p className="text-xs text-gray-500">
                  <span>{v.source}</span>
                  <span aria-hidden className="mx-1.5">·</span>
                  <span>{v.time}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
