import Link from 'next/link';
import type { Video } from '@/data/todays-videos';
import { VideoThumbnail } from '@/components/NewsThumbnail';
import PlayableVideo from '@/components/PlayableVideo';
import { videoHref } from '@/lib/youtube';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

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

      {/* Stacked: full-width featured player with a large headline below
          (Yahoo-style on desktop), then the list. Mobile was already
          stacked, so only desktop changes from the old side-by-side split. */}
      <div className="flex flex-col gap-5">
        {/* Featured — plays inline */}
        <div className="group flex flex-col">
          <PlayableVideo id={featured.youtubeId} label={featured.title} className="overflow-hidden rounded-xl mb-3 aspect-video">
            {featured.youtubeId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`https://img.youtube.com/vi/${featured.youtubeId}/maxresdefault.jpg`} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <VideoThumbnail category={featured.category} className="absolute inset-0 w-full h-full" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/50 pointer-events-none" />
            {/* Yahoo-style title caption on the player (desktop only) */}
            <span className="hidden lg:block absolute top-3 left-4 right-4 text-md font-semibold leading-snug text-white drop-shadow-lg line-clamp-2 pointer-events-none">
              {featured.title}
            </span>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm group-hover:bg-black/70 transition-colors">
                <svg className="h-5 w-5 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold text-white tabular-nums backdrop-blur-sm">
              {featured.duration}
            </span>
          </PlayableVideo>
          <h3 className="text-md lg:text-2xl font-bold leading-[1.25] lg:leading-[1.2] tracking-tight text-white mb-2 lg:mb-3 line-clamp-2">
            {featured.title}
          </h3>
          {featured.description && (
            <p className="text-sm lg:text-md leading-relaxed text-gray-400 line-clamp-3 mb-3">
              {featured.description}
            </p>
          )}
          <p className="text-xs lg:text-sm text-gray-500 mt-auto">
            <span>{featured.source}</span>
            <span aria-hidden className="mx-1.5">·</span>
            <span>{featured.time}</span>
          </p>
        </div>

        {/* List below the featured — links out */}
        <div className="flex flex-col divide-y divide-white/[0.05]">
          {rest.map((v, i) => (
            <a key={i} href={videoHref(v.youtubeId)} {...ext} className="group flex gap-3 py-3 first:pt-0 no-underline">
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
