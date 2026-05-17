import Link from 'next/link';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import type { Story } from '@/lib/sports-data';
import SectionHead from './SectionHead';
import { Heading, Text } from '@/components/ui';

/**
 * Numbered right-rail list with thumbnails.
 * Mirrors Yahoo's "Yahoo! Sports Network" panel.
 */
export default function SportsNetworkRail({ items }: { items: Story[] }) {
  return (
    <section aria-labelledby="sports-network">
      <SectionHead title="TrueRate Sports Network" />
      <span id="sports-network" className="sr-only">TrueRate Sports Network</span>
      <ol className="border-y border-white/[0.08]">
        {items.map((s) => (
          <li key={s.href} className="border-b border-white/[0.06] last:border-0">
            <Link
              href={s.href}
              className="group flex items-start gap-3 py-3 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050d11]"
            >
<div className="shrink-0 overflow-hidden">
                <NewsThumbnail category={s.category} className="h-[56px] w-[80px]" />
              </div>
              <div className="min-w-0 flex-1">
                <Text variant="meta" className="font-bold uppercase tracking-wide text-gray-500 mb-0.5">{s.category}</Text>
                <Heading level={6} className="text-gray-100 leading-snug group-hover:text-white group-hover:underline group-hover:decoration-white/50 underline-offset-2 transition-colors line-clamp-3">
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
      </ol>
    </section>
  );
}
