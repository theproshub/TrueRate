import Link from 'next/link';
import { HeroVisual } from '@/components/NewsThumbnail';
import type { TopicHub } from '@/lib/sports-data';

/**
 * Large promotional banner: image area + lead headline + 3 sub-stories.
 * Mirrors Yahoo's "NBA playoffs chase" / "Men's Final Four" blocks.
 */
export default function TopicHubBanner({ hub }: { hub: TopicHub }) {
  return (
    <section
      aria-label={hub.kicker}
      className="border border-white/[0.08] bg-white/[0.02]"
    >
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Left: image + kicker / title / dek */}
        <Link
          href={hub.href}
          className="md:col-span-7 group relative no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050d11]"
        >
          <div className="overflow-hidden">
            <HeroVisual category={hub.category} className="h-[200px] md:h-[240px]" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-300 mb-1.5">{hub.kicker}</p>
            <h3 className="text-[20px] sm:text-[24px] font-bold text-white leading-tight">
              {hub.title}
            </h3>
            <p className="hidden sm:block mt-1.5 text-[12px] text-gray-200 max-w-md">{hub.dek}</p>
          </div>
        </Link>

        {/* Right: lead + sub stories */}
        <div className="md:col-span-5 bg-white/[0.03] border-t md:border-t-0 md:border-l border-white/[0.08] p-4 sm:p-5 flex flex-col">
          <Link
            href={hub.lead.href}
            className="group block pb-3 mb-3 border-b border-white/[0.08] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050d11]"
          >
            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-400 mb-1">Featured</p>
            <h4 className="text-[15px] font-bold text-white leading-snug group-hover:text-gray-100 transition-colors">
              {hub.lead.title}
            </h4>
            <p className="mt-1 text-[11px] text-gray-500">
              <span className="font-semibold text-gray-400">{hub.lead.source}</span>
              <span className="mx-1">·</span>
              {hub.lead.time}
            </p>
          </Link>
          <ul className="flex flex-col">
            {hub.subs.map(s => (
              <li key={s.href} className="border-b border-white/[0.06] last:border-0">
                <Link
                  href={s.href}
                  className="group block py-2.5 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050d11]"
                >
                  <h5 className="text-[13px] font-semibold text-gray-100 leading-snug group-hover:text-white transition-colors">
                    {s.title}
                  </h5>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    <span className="font-semibold text-gray-400">{s.source}</span>
                    <span className="mx-1">·</span>
                    {s.time}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
