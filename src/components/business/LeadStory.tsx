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
};

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2';

export default function LeadStory({ category, categorySlug, title, summary, source, time, href, image }: Props) {
  return (
    <article>
      <Link href={href} className={`group flex flex-col md:flex-row gap-4 md:gap-6 no-underline ${focusRing}`}>
        <div className="md:w-[48%] shrink-0 overflow-hidden rounded-lg">
          <NewsThumbnail
            category={categorySlug ?? category}
            src={image ?? undefined}
            className="w-full aspect-[16/9] group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span className={`text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.08em] ${getCatColor(categorySlug ?? category)}`}>
            {category}
          </span>
          <h3 className="mt-1 sm:mt-1.5 text-[20px] sm:text-[28px] lg:text-[30px] font-black leading-[1.15] text-[#0A0A0A] group-hover:underline decoration-2 underline-offset-2">
            {title}
          </h3>
          {summary && (
            <p className="mt-1.5 sm:mt-2 text-[14px] sm:text-[15px] leading-[1.55] text-[#555] line-clamp-2 sm:line-clamp-3 font-semibold font-montserrat">
              {summary}
            </p>
          )}
          <SourceLabel source={source} time={time} className="mt-2 sm:mt-3" />
        </div>
      </Link>
    </article>
  );
}
