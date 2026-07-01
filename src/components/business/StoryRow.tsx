import Link from 'next/link';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import SourceLabel from './SourceLabel';

type Props = {
  category: string;
  categorySlug?: string;
  title: string;
  summary?: string;
  source: string;
  time: string;
  href: string;
  image?: string | null;
  compact?: boolean;
};

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-1';

export default function StoryRow({
  category,
  categorySlug,
  title,
  source,
  time,
  href,
  image,
  compact = false,
}: Props) {
  if (compact) {
    return (
      <article className="py-4 first:pt-0">
        <Link href={href} className={`group flex gap-3 sm:gap-4 no-underline ${focusRing}`}>
          <div className="shrink-0 overflow-hidden rounded-lg">
            <NewsThumbnail
              category={categorySlug ?? category}
              src={image ?? undefined}
              className="h-[90px] w-[120px] sm:h-[140px] sm:w-[185px]"
            />
          </div>
          <div className="min-w-0 flex-1 flex flex-col justify-start">
            <h3 className="text-[15px] sm:text-[18px] font-bold leading-[1.35] text-[#0A0A0A] group-hover:underline decoration-1 underline-offset-2 line-clamp-3 sm:line-clamp-2">
              {title}
            </h3>
            <SourceLabel source={source} time={time} className="mt-1.5 sm:mt-2" />
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="py-3.5 first:pt-0">
      <Link href={href} className={`group flex items-start gap-2 no-underline ${focusRing}`}>
        <span className="shrink-0 mt-[3px] h-1.5 w-1.5 rounded-full bg-gray-300" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold leading-[1.35] text-[#0A0A0A] group-hover:underline decoration-1 underline-offset-2 line-clamp-2">
            {title}
          </h3>
          <SourceLabel source={source} time={time} className="mt-1" />
        </div>
      </Link>
    </article>
  );
}
