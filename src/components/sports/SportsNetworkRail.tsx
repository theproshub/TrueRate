import Link from 'next/link';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import type { Story } from '@/lib/sports-data';
import SectionHead from './SectionHead';

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
        {items.map((s, i) => (
          <li key={s.href} className="border-b border-white/[0.06] last:border-0">
            <Link
              href={s.href}
              className="group flex items-start gap-3 py-3 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050d11]"
            >
              <span aria-hidden className="shrink-0 text-[20px] font-bold text-emerald-400 leading-none w-6 tabular-nums pt-1">
                {i + 1}
              </span>
              <div className="shrink-0 overflow-hidden">
                <NewsThumbnail category={s.category} className="h-[56px] w-[80px]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-0.5">{s.category}</p>
                <h3 className="text-[13px] font-semibold text-gray-100 leading-snug group-hover:text-white transition-colors line-clamp-3">
                  {s.title}
                </h3>
                <p className="mt-1 text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-400">{s.source}</span>
                  <span className="mx-1">·</span>
                  {s.time}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
