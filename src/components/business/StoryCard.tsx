import Link from 'next/link';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import SourceLabel from './SourceLabel';

type Props = {
  category: string;
  categorySlug?: string;
  title: string;
  source: string;
  time: string;
  href: string;
  image?: string | null;
  /** Yahoo-style: small square thumbnail on the left, text on the right. */
  horizontal?: boolean;
};

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-1';

export default function StoryCard({ category, categorySlug, title, source, time, href, image, horizontal = false }: Props) {
  if (horizontal) {
    return (
      <article>
        <Link href={href} className={`group flex gap-3 sm:gap-3.5 no-underline ${focusRing}`}>
          <div className="shrink-0 overflow-hidden rounded-lg">
            <NewsThumbnail
              category={categorySlug ?? category}
              src={image ?? undefined}
              className="h-[72px] w-[72px] sm:h-[88px] sm:w-[88px] group-hover:scale-[1.03] transition-transform duration-300"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className={`block text-[10px] font-bold uppercase tracking-[0.06em] ${getCatColor(categorySlug ?? category)}`}>
              {category}
            </span>
            <h3 className="mt-0.5 text-[13px] sm:text-[14px] font-bold leading-[1.3] text-[#0A0A0A] group-hover:underline decoration-1 underline-offset-2 line-clamp-3">
              {title}
            </h3>
            <SourceLabel source={source} time="" className="mt-1" />
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article>
      <Link href={href} className={`group block no-underline ${focusRing}`}>
        <div className="overflow-hidden rounded-lg">
          <NewsThumbnail
            category={categorySlug ?? category}
            src={image ?? undefined}
            className="w-full h-[100px] sm:h-[110px] group-hover:scale-[1.03] transition-transform duration-300"
          />
        </div>
        <span className={`mt-2 block text-[11px] font-bold uppercase tracking-[0.06em] ${getCatColor(categorySlug ?? category)}`}>
          {category}
        </span>
        <h3 className="mt-1 text-[14px] font-bold leading-[1.3] text-[#0A0A0A] group-hover:underline decoration-1 underline-offset-2 line-clamp-2">
          {title}
        </h3>
        <SourceLabel source={source} time="" className="mt-1" />
      </Link>
    </article>
  );
}
