import Link from 'next/link';
import type { Video } from '@/data/todays-videos';
import { VideoThumbnail } from '@/components/NewsThumbnail';
import PlayableVideo from '@/components/PlayableVideo';
import { videoHref } from '@/lib/youtube';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

const CAT_COLORS: Record<string, string> = {
  'Startups':         'text-violet-400',
  'Economy':          'text-brand-accent-ink',
  'Technology':       'text-sky-400',
  'Investing':        'text-emerald-400',
  'Entrepreneurship': 'text-violet-400',
  'Leadership':       'text-amber-400',
  'Business':         'text-rose-400',
};

function catColor(c: string) {
  return CAT_COLORS[c] ?? 'text-gray-500';
}

export default function VideosSection({ videos }: { videos: Video[] }) {
  const [featured, ...rest] = videos;
  return (
    <section aria-labelledby="todays-videos">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-3 mb-5">
        <Link
          href="/videos"
          className="text-sm font-semibold text-brand-accent-ink hover:text-gray-900 transition-colors no-underline focus-visible:outline-none focus-visible:underline flex items-center gap-1"
        >
          Watch NOW
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      <div className="flex flex-col gap-0">
        {/* Featured — large inline player */}
        <div className="group flex flex-col">
          <PlayableVideo id={featured.youtubeId} label={featured.title} autoPlay className="overflow-hidden rounded-xl mb-3 aspect-video">
            {featured.youtubeId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`https://img.youtube.com/vi/${featured.youtubeId}/maxresdefault.jpg`} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <VideoThumbnail category={featured.category} className="absolute inset-0 w-full h-full" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md ring-1 ring-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-200">
                <svg className="h-5 w-5 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {/* Duration badge */}
            <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-semibold text-white tabular-nums backdrop-blur-sm">
              {featured.duration}
            </span>
            {/* Category badge */}
            <span className={`absolute top-2.5 left-2.5 rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-2xs font-bold uppercase tracking-wider ${catColor(featured.category)}`}>
              {featured.category}
            </span>
          </PlayableVideo>
          <h3 className="text-base lg:text-lg font-bold leading-snug tracking-tight text-gray-900 mb-1.5 line-clamp-2">
            {featured.title}
          </h3>
          {featured.description && (
            <p className="text-sm leading-relaxed text-gray-600 line-clamp-2 mb-2">
              {featured.description}
            </p>
          )}
          <p className="text-xs text-gray-500">
            <span className="font-medium text-gray-600">{featured.source}</span>
            <span aria-hidden className="mx-1.5">·</span>
            <span>{featured.time}</span>
          </p>
        </div>

        {/* Up Next playlist */}
        {rest.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-2xs font-bold uppercase tracking-[0.14em] text-gray-500 mb-3">Up next</p>
            <div className="flex flex-col gap-3">
              {rest.map((v, i) => (
                <a key={i} href={videoHref(v.youtubeId)} {...ext} className="group flex gap-3 no-underline">
                  <div className="relative shrink-0 overflow-hidden rounded-lg w-[120px] h-[68px]">
                    {v.youtubeId ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <VideoThumbnail category={v.category} className="w-full h-full" />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-px text-[10px] font-semibold text-white tabular-nums backdrop-blur-sm">
                      {v.duration}
                    </span>
                    {/* Hover play icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
                        <svg className="h-3 w-3 translate-x-[0.5px] text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <h3 className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-1">
                      {v.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      <span>{v.source}</span>
                      <span aria-hidden className="mx-1">·</span>
                      <span>{v.time}</span>
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
