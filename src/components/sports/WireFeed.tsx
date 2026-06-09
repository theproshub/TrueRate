import Link from 'next/link';
import { getCatColor } from '@/lib/category-colors';
import type { WestAfricaCard } from '@/lib/sports-finance-data';

/**
 * Regional wire — a reverse-chron, dateline-led feed in the style of an agency
 * wire (Reuters/AP). Each item carries a dateline, category, byline and
 * timestamp so it reads like reported copy, not a data table. Light styling.
 */
export default function WireFeed({ items }: { items: WestAfricaCard[] }) {
  return (
    <ol className="divide-y divide-gray-200 border-t border-gray-200">
      {items.map((w, i) => (
        <li key={`${w.country}-${i}`}>
          <Link
            href={w.href}
            className="block py-4 no-underline group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xs font-bold uppercase tracking-widest text-gray-900">{w.dateline}</span>
              <span className={`text-2xs font-bold uppercase tracking-wider ${getCatColor(w.category)}`}>{w.category}</span>
              <span className="ml-auto text-2xs text-gray-400 tabular-nums">{w.time}</span>
            </div>
            <p className="text-base leading-snug font-semibold text-gray-900 group-hover:text-gray-600 transition-colors text-pretty max-w-[60rem]">
              {w.headline}
            </p>
            <p className="mt-1 text-2xs text-gray-500">By {w.byline}</p>
          </Link>
        </li>
      ))}
    </ol>
  );
}
