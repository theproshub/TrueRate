import Link from 'next/link';
import type { Story } from '@/lib/sports-data';

/**
 * Six tight one-liner headlines as horizontal cards, no images.
 * Mirrors Yahoo's 6-headline strip directly above the lead story.
 */
export default function HeadlineStrip({ items }: { items: Story[] }) {
  return (
    <section aria-label="Top sports headlines" className="border-y border-gray-200">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-gray-100 sm:divide-y-0 sm:divide-x sm:[&>*:nth-child(-n+3)]:border-b sm:[&>*:nth-child(-n+3)]:border-gray-100 lg:[&>*:nth-child(-n+3)]:border-b-0">
        {items.map(s => (
          <li key={s.href} className="border-gray-100">
            <Link
              href={s.href}
              className="group flex items-start gap-3 px-3 py-3 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-1"
            >
              <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-700" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-red-700 mb-1">{s.category}</p>
                <h3 className="text-[13px] font-semibold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">
                  {s.title}
                </h3>
                <p className="mt-1 text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-700">{s.source}</span>
                  <span className="mx-1">·</span>
                  {s.time}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
