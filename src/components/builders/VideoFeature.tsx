import { VideoThumbnail } from '@/components/NewsThumbnail';
import PlayableVideo from '@/components/PlayableVideo';
import { FEATURED_VIDEO, VIDEO_THUMBS } from '@/lib/builders-data';
import { videoHref } from '@/lib/youtube';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function VideoFeature() {
  return (
    <section aria-labelledby="builders-videos" className="mb-10">
      <h2
        id="builders-videos"
        className="text-md font-bold text-white border-b border-white/20 pb-3 mb-5"
      >
        Entrepreneurship <span className="font-light text-white/40 mx-1">|</span> Top Videos
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured — plays inline */}
        <div className="group flex flex-col">
          <PlayableVideo id={FEATURED_VIDEO.youtubeId} label={FEATURED_VIDEO.title} className="rounded-lg mb-3 h-[200px] sm:h-[260px]">
            <VideoThumbnail
              category={FEATURED_VIDEO.category}
              duration={FEATURED_VIDEO.duration}
              className="absolute inset-0 w-full h-full"
            />
          </PlayableVideo>
          <h3 className="text-md sm:text-xl font-black leading-[1.2] tracking-tight text-white mb-1.5">
            {FEATURED_VIDEO.title}
          </h3>
          {FEATURED_VIDEO.dek && (
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-1">{FEATURED_VIDEO.dek}</p>
          )}
          <span className="text-xs text-gray-500">{FEATURED_VIDEO.source}</span>
        </div>

        {/* Thumbnail rows — link out */}
        <div className="flex flex-col">
          {VIDEO_THUMBS.map((v, i) => (
            <a key={i} href={videoHref(v.youtubeId)} {...ext} className="group flex gap-3 py-3 first:pt-0 last:pb-0 border-b border-white/[0.05] last:border-0 no-underline">
              <VideoThumbnail
                category={v.category}
                duration={v.duration === 'NOW' ? undefined : v.duration}
                className="w-[120px] h-[72px] rounded-md shrink-0"
              />
              <div className="min-w-0 flex-1 flex flex-col justify-center">
                {v.duration === 'NOW' && (
                  <span className="inline-flex w-fit items-center text-2xs font-bold uppercase tracking-wide text-white bg-brand-accent/90 px-1.5 py-0.5 rounded mb-1">
                    Now playing
                  </span>
                )}
                <h4 className="text-sm sm:text-base font-semibold leading-snug text-white group-hover:text-white/80 transition-colors line-clamp-2 mb-1">{v.title}</h4>
                <span className="text-xs text-gray-500">{v.source}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
