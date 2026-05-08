import Link from 'next/link';
import { TRENDING_GROUPS } from '@/lib/sports-data';
import TeamCrest from './TeamCrest';
import SectionHead from './SectionHead';

/**
 * Yahoo-style left rail: TRENDING.
 * League/topic groups, each with a leading crest and sub-bullet stories.
 */
export default function TrendingSidebar() {
  return (
    <section aria-label="Trending in Liberian sports">
      <SectionHead title="Trending" />
      <ul className="border-y border-white/[0.08]">
        {TRENDING_GROUPS.map(g => (
          <li key={g.label} className="border-b border-white/[0.06] last:border-0 py-3">
            <Link
              href={g.href}
              className="group flex items-center gap-2 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050d11]"
            >
              <TeamCrest short={g.short} size={22} />
              <span className="text-[13px] font-bold text-white group-hover:text-emerald-300 transition-colors">
                {g.label}
              </span>
            </Link>
            <ul className="mt-2 ml-1 flex flex-col gap-1.5 border-l border-white/[0.08] pl-3">
              {g.items.map(it => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className="block text-[12px] text-gray-300 leading-snug hover:text-white transition-colors no-underline focus-visible:outline-none focus-visible:text-emerald-300"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
