import Link from 'next/link';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import type { Card } from '@/lib/builders-data';

type Props = {
  id: string;
  title: string;
  /** Optional 1-letter brand badge shown to the left of the title (e.g. "E", "H") */
  badge?: string;
  /** Optional secondary subtitle after the pipe — for "Entrepreneur | Build Your Business" */
  subtitle?: string;
  items: Card[];
};

export default function SectionFourCards({ id, title, badge, subtitle, items }: Props) {
  return (
    <section aria-labelledby={id} className="mb-10">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-5">
        {badge && (
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-white text-brand-ink text-xs font-bold"
          >
            {badge}
          </span>
        )}
        <h2 id={id} className="text-md font-bold text-gray-900">
          {title}
          {subtitle && (
            <>
              {' '}
              <span className="font-light text-gray-500 mx-1">|</span>{' '}
              <span>{subtitle}</span>
            </>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((c, i) => (
          <Link key={i} href={c.href} className="group no-underline flex flex-col">
            <NewsThumbnail category={c.category} className="w-full aspect-[16/10] rounded-lg mb-3" />
            <h3 className="text-sm sm:text-base font-semibold leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-3 mb-1.5 flex-1">
              {c.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">{c.source}</span>
              {c.badge && (
                <span className="text-2xs font-bold tabular-nums text-pos border border-pos/30 rounded px-1.5 py-0.5">
                  {c.badge}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
