import Link from 'next/link';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import SourceLabel from './SourceLabel';

type Video = {
  title: string;
  summary?: string;
  source: string;
  time: string;
  href: string;
  duration?: string;
  category?: string;
  categorySlug?: string;
  image?: string | null;
};

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-1';

export default function VideoSection({ videos }: { videos: Video[] }) {
  if (videos.length === 0) return null;

  const lead = videos[0];
  const thumbs = videos.slice(1, 5);

  return (
    <section aria-labelledby="biz-videos-heading">
      <h2 id="biz-videos-heading" className="text-lg sm:text-xl font-extrabold text-[#0A0A0A] pb-3 border-b border-gray-300 mb-4 sm:mb-5">
        Top Videos
      </h2>

      <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
        <div className="lg:w-[55%] shrink-0">
          <Link href={lead.href} className={`group block no-underline ${focusRing}`}>
            <div className="relative overflow-hidden rounded-lg">
              <NewsThumbnail
                category={lead.categorySlug ?? lead.category ?? 'business'}
                src={lead.image ?? undefined}
                className="w-full aspect-[16/9] group-hover:scale-[1.02] transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 group-hover:bg-black/80 transition-colors">
                  <svg className="h-5 w-5 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              {lead.duration && (
                <span className="absolute bottom-2 right-2 tabular-nums text-[11px] font-semibold text-white rounded bg-black/70 px-1.5 py-0.5">
                  {lead.duration}
                </span>
              )}
              <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-[0.06em] text-white bg-[#0A0A0A] px-2 py-0.5 rounded">
                Now playing
              </span>
            </div>

            <h3 className="mt-3 text-[18px] sm:text-[24px] font-extrabold leading-[1.25] text-[#0A0A0A] group-hover:underline decoration-1 underline-offset-2">
              {lead.title}
            </h3>
            {lead.summary && (
              <p className="mt-2 text-[15px] leading-[1.5] text-gray-600 line-clamp-2">{lead.summary}</p>
            )}
            <SourceLabel source={lead.source} time={lead.time} className="mt-2" />
          </Link>
        </div>

        <div className="flex-1 min-w-0 flex flex-col divide-y divide-gray-200">
          {thumbs.map((v, i) => (
            <article key={v.href + i} className="py-3.5 first:pt-0 last:pb-0">
              <Link href={v.href} className={`group flex gap-3.5 no-underline ${focusRing}`}>
                <div className="shrink-0 relative overflow-hidden rounded-lg">
                  <NewsThumbnail
                    category={v.categorySlug ?? v.category ?? 'business'}
                    src={v.image ?? undefined}
                    className="h-[56px] w-[100px] sm:h-[72px] sm:w-[128px]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50">
                      <svg className="h-3 w-3 translate-x-px text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {v.duration && (
                    <span className="absolute bottom-1 right-1 tabular-nums text-[10px] font-semibold text-white rounded bg-black/70 px-1 py-px">
                      {v.duration}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-[13px] font-bold leading-[1.3] text-[#0A0A0A] group-hover:underline decoration-1 underline-offset-2 line-clamp-2">
                    {v.title}
                  </h3>
                  <SourceLabel source={v.source} time={v.time} className="mt-1" />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
