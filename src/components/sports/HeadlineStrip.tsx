import Link from 'next/link';
import type { Story } from '@/lib/sports-data';
import { Heading, Text } from '@/components/ui';

/**
 * Six tight one-liner headlines as horizontal cards, no images.
 * Mirrors Yahoo's 6-headline strip directly above the lead story.
 */
export default function HeadlineStrip({ items }: { items: Story[] }) {
  return (
    <section aria-label="Top sports headlines" className="border-y border-white/[0.08] bg-white/[0.02]">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-white/[0.06] sm:divide-y-0 sm:divide-x sm:divide-white/[0.06] sm:[&>*:nth-child(-n+3)]:border-b sm:[&>*:nth-child(-n+3)]:border-white/[0.06] lg:[&>*:nth-child(-n+3)]:border-b-0">
        {items.map(s => (
          <li key={s.href} className="border-white/[0.06]">
            <Link
              href={s.href}
              className="group flex items-start gap-3 px-3 py-3 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050d11]"
            >
              <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-500" />
              <div className="min-w-0 flex-1">
                <Text variant="caption" className="font-bold uppercase tracking-wide text-lime-400 mb-1">{s.category}</Text>
                <Heading level={6} className="text-gray-100 leading-snug group-hover:text-white transition-colors">
                  {s.title}
                </Heading>
                <Text variant="meta" className="mt-1 text-gray-500">
                  <span className="font-semibold text-gray-400">{s.source}</span>
                  <span className="mx-1">·</span>
                  {s.time}
                </Text>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
