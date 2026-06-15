import Link from 'next/link';

/**
 * Right-hand reader rail for the sports desk pages. Gives every desk real
 * information density beyond the hero: what the desk covers, what's most read
 * on it, the newsletter, and cross-desk navigation. Pure presentational —
 * everything is passed in from the page's existing data.
 */

export type SidebarStory = { title: string; href: string };

const DESK_LINKS: { label: string; href: string }[] = [
  { label: 'Football',        href: '/sports/football' },
  { label: 'Basketball',      href: '/sports/basketball' },
  { label: 'Athletics',       href: '/sports/athletics' },
  { label: 'Youth Sports',    href: '/sports/youth-sports' },
  { label: "Women's Sports",  href: '/sports/womens-sports' },
  { label: 'Transfers',       href: '/sports/transfers-deals' },
  { label: 'Sponsorship',     href: '/sports/sponsorship' },
  { label: 'Club Finance',    href: '/sports/club-finance' },
  { label: 'Broadcast',       href: '/sports/broadcast-rights' },
  { label: 'Governance',      href: '/sports/governance' },
  { label: 'Technology',      href: '/sports/technology' },
  { label: 'Interviews',      href: '/sports/interviews' },
  { label: 'Data & Research', href: '/sports/data-research' },
  { label: 'Opinion',         href: '/sports/opinion' },
];

export default function SportsDeskSidebar({
  label,
  blurb,
  coverage,
  mostRead,
  currentHref,
}: {
  label: string;
  blurb?: string;
  /** Short "what this desk covers" bullets — shown when provided. */
  coverage?: string[];
  mostRead: SidebarStory[];
  /** This desk's own href, filtered out of the Browse desks chips. */
  currentHref?: string;
}) {
  return (
    <aside aria-label={`About and more from ${label}`} className="space-y-8">
      {/* About this desk */}
      {(blurb || (coverage && coverage.length > 0)) && (
        <section aria-labelledby="desk-about" className="border-t-2 border-gray-900 pt-4">
          <h2 id="desk-about" className="text-sm font-black uppercase tracking-[0.16em] text-gray-900 mb-2">About this desk</h2>
          {blurb && <p className="text-sm text-gray-600 leading-relaxed">{blurb}</p>}
          {coverage && coverage.length > 0 && (
            <ul className="mt-3 space-y-2">
              {coverage.map((c) => (
                <li key={c} className="flex gap-2.5 text-sm text-gray-700 leading-snug">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent-ink" />
                  {c}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Most read on this desk */}
      {mostRead.length > 0 && (
        <section aria-labelledby="desk-mostread" className="border-t-2 border-gray-900 pt-4">
          <h2 id="desk-mostread" className="text-sm font-black uppercase tracking-[0.16em] text-gray-900 mb-1">Most read in {label}</h2>
          <ol className="flex flex-col divide-y divide-gray-200">
            {mostRead.map((s, i) => (
              <li key={s.href} className="py-3">
                <Link href={s.href} className="group flex items-start gap-3 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">
                  <span aria-hidden className="shrink-0 w-6 font-mono text-lg font-black tabular-nums leading-none text-gray-300">{i + 1}</span>
                  <span className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3">{s.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Newsletter */}
      <section aria-labelledby="desk-nl" className="border-t-2 border-gray-900 pt-4">
        <h2 id="desk-nl" className="text-sm font-black uppercase tracking-wide text-gray-900 mb-1">Sports Business Brief</h2>
        <p className="text-sm text-gray-500 mb-3">The money behind Liberian sport, in your inbox every week.</p>
        <form aria-label="Sign up for the Sports Business Brief">
          <label htmlFor="desk-nl-email" className="sr-only">Email address</label>
          <input id="desk-nl-email" type="email" required placeholder="Email address" className="w-full bg-transparent border-b border-gray-300 px-0 py-2 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 transition-colors mb-3" />
          <button type="submit" className="w-full rounded-md bg-gray-900 py-2.5 text-base font-bold text-white hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">Sign up free</button>
        </form>
      </section>

      {/* Browse desks */}
      <nav aria-label="Browse sports desks" className="border-t-2 border-gray-900 pt-4">
        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-gray-900 mb-3">Browse desks</h2>
        <div className="flex flex-wrap gap-2">
          {DESK_LINKS.filter((d) => d.href !== currentHref).map((d) => (
            <Link key={d.href} href={d.href} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:border-gray-400 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink">
              {d.label}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
