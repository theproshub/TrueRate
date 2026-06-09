import Link from 'next/link';
import { getCatColor } from '@/lib/category-colors';

/**
 * Numbered "Most Read" rail — classic engagement furniture. Big rank numerals
 * give it the feel of a real, trafficked newsroom front. Light styling.
 */
export default function MostRead({
  items,
}: {
  items: { title: string; category: string; href: string }[];
}) {
  return (
    <ol className="flex flex-col divide-y divide-gray-200">
      {items.map((s, i) => (
        <li key={s.href + i} className="py-3 first:pt-0">
          <Link
            href={s.href}
            className="group flex items-start gap-3 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-1"
          >
            <span aria-hidden="true" className="shrink-0 text-stat-sm font-black tabular-nums text-gray-300 leading-none w-7">
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className={`block text-2xs font-bold uppercase tracking-wider mb-0.5 ${getCatColor(s.category)}`}>{s.category}</span>
              <span className="block text-sm font-semibold text-gray-900 leading-snug group-hover:text-gray-600 transition-colors line-clamp-2 text-pretty">{s.title}</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
