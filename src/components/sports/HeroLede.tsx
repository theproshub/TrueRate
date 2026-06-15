import Link from 'next/link';
import { HeroVisual } from '@/components/NewsThumbnail';
import FlagChip from '@/components/sports/FlagChip';
import { getCatColor } from '@/lib/category-colors';
import type { StoryFlag } from '@/lib/sports-finance-data';

/**
 * Lead story for the section front — large photo, flag + category + dateline,
 * headline, executive summary, and a full byline with reading time. Editorial
 * (light) styling; no data dashboard furniture.
 */
export default function HeroLede({
  category,
  title,
  source,
  time,
  href,
  imageCategory = 'sports',
  image,
  flag,
  author,
  authorRole,
  readTime,
  updated,
  as = 'h1',
}: {
  category: string;
  title: string;
  dek: string;
  source: string;
  time: string;
  href: string;
  imageCategory?: string;
  /** Real hero photo (from CMS). Falls back to the category gradient when absent. */
  image?: string | null;
  flag?: StoryFlag;
  dateline?: string;
  author?: string;
  authorRole?: string;
  readTime?: string;
  updated?: string;
  /** Heading level for the lead title. Use 'h2' when the page already has an h1. */
  as?: 'h1' | 'h2';
}) {
  const Heading = as;
  return (
    <section aria-labelledby="sports-hero">
      <Link href={href} className="group block overflow-hidden rounded-xl no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">
        <HeroVisual category={imageCategory} src={image} className="w-full h-[210px] sm:h-[360px] lg:h-[440px] transition-transform motion-safe:group-hover:scale-[1.02]" />
      </Link>

      <div className="mt-5 max-w-[44rem]">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {flag && <FlagChip flag={flag} />}
          <span className={`text-2xs font-bold uppercase tracking-[0.18em] ${getCatColor(category)}`}>{category}</span>
        </div>

        <Link href={href} className="group no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">
          <Heading
            id="sports-hero"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.1] sm:leading-[1.08] tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors text-balance"
          >
            {title}
          </Heading>
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="font-semibold text-gray-900">{author ? `By ${author}` : source}</span>
          {authorRole && <span className="text-gray-500">, {authorRole}</span>}
          <span className="text-gray-300">·</span>
          <span className="text-gray-500">{source}</span>
          <span className="text-gray-300">·</span>
          <time className="text-gray-500">{time}</time>
          {readTime && <><span className="text-gray-300">·</span><span className="text-gray-500">{readTime}</span></>}
        </div>
        {updated && <p className="mt-1 text-2xs uppercase tracking-wide text-gray-400">{updated}</p>}
      </div>
    </section>
  );
}
