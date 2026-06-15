import type { Metadata } from 'next';
import Link from 'next/link';
import SportsMasthead from '@/components/sports/SportsMasthead';
import SectionHead from '@/components/sports/SectionHead';
import SidebarFooter from '@/components/sports/SidebarFooter';
import Delta from '@/components/sports/Delta';
import { fetchClubs, fetchAthletes } from '@/lib/sports/intel';
import { DASHBOARD_DEAL_FEED, type DealFeedItem } from '@/lib/sports-finance-data';

export const metadata: Metadata = {
  title: 'Search — TrueRate Sports',
  description: 'Search Liberian and West African clubs, athletes, and deals across TrueRate Sports.',
  alternates: { canonical: '/sports/search' },
  robots: { index: false },
};

export const revalidate = 300;

const norm = (s: string) => s.toLowerCase();
const has = (q: string, ...fields: (string | undefined)[]) =>
  fields.some((f) => f && norm(f).includes(q));

export default async function SportsSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: raw } = await searchParams;
  const query = (raw ?? '').trim();
  const q = norm(query);

  const [{ valuations }, athletes] = await Promise.all([fetchClubs(), fetchAthletes()]);

  const clubs = q ? valuations.filter((c) => has(q, c.club)) : [];
  const people = q ? athletes.filter((a) => has(q, a.name, a.pos, a.club)) : [];
  const deals: DealFeedItem[] = q
    ? DASHBOARD_DEAL_FEED.filter((d) => has(q, d.party, d.detail, d.type))
    : [];

  const total = clubs.length + people.length + deals.length;

  return (
    <div className="min-h-screen bg-brand-surface text-gray-800">
      <SportsMasthead />

      <main className="mx-auto max-w-container px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          {query ? <>Search results for <span className="text-brand-accent-ink">“{query}”</span></> : 'Search TrueRate Sports'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">Use the search bar in the header to find clubs, athletes &amp; deals across Liberian and West African sport.</p>

        {/* Results — the single search input lives in the site header. */}
        <div className="mt-8" aria-live="polite">
          {!query ? (
            <p className="text-sm text-gray-500">Type a club, athlete, or deal to search — e.g. “Barrolle”, “Williams”, or “Orange”.</p>
          ) : total === 0 ? (
            <p className="text-base text-gray-700">
              No clubs, athletes, or deals match <span className="font-semibold text-gray-900">“{query}”</span>.
            </p>
          ) : (
            <>
              <p className="mb-8 text-sm text-gray-500">
                {total} result{total === 1 ? '' : 's'} for <span className="font-semibold text-gray-900">“{query}”</span>
              </p>

              <div className="grid gap-10 lg:grid-cols-3">
                {/* Clubs */}
                {clubs.length > 0 && (
                  <section aria-labelledby="res-clubs">
                    <SectionHead id="res-clubs" title={`Clubs (${clubs.length})`} />
                    <ul className="divide-y divide-gray-200 border-t border-gray-200">
                      {clubs.map((c) => (
                        <li key={c.club}>
                          <Link href="/sports/club-finance" className="group flex items-center justify-between gap-3 py-3 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-1">
                            <span className="min-w-0">
                              <span className="block text-sm font-bold text-gray-900 group-hover:text-gray-600 transition-colors">{c.club}</span>
                              <span className="block text-2xs uppercase tracking-wide text-gray-400">Est. value {c.estValue}</span>
                            </span>
                            <Delta text={c.yoy} up={c.up} className="text-xs shrink-0" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Athletes */}
                {people.length > 0 && (
                  <section aria-labelledby="res-athletes">
                    <SectionHead id="res-athletes" title={`Athletes (${people.length})`} />
                    <ul className="divide-y divide-gray-200 border-t border-gray-200">
                      {people.map((a) => (
                        <li key={a.name}>
                          <Link href="/sports/transfers-deals" className="group flex items-center justify-between gap-3 py-3 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-1">
                            <span className="min-w-0">
                              <span className="block text-sm font-bold text-gray-900 group-hover:text-gray-600 transition-colors">{a.name}</span>
                              <span className="block text-2xs uppercase tracking-wide text-gray-400">{a.pos} · {a.club}</span>
                            </span>
                            <span className="shrink-0 text-sm font-mono tabular-nums text-gray-900">{a.marketValue}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Deals */}
                {deals.length > 0 && (
                  <section aria-labelledby="res-deals">
                    <SectionHead id="res-deals" title={`Deals (${deals.length})`} />
                    <ul className="divide-y divide-gray-200 border-t border-gray-200">
                      {deals.map((d) => (
                        <li key={`${d.type}-${d.party}`}>
                          <Link href={d.href} className="group block py-3 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-1">
                            <span className="flex items-center justify-between gap-3">
                              <span className="text-2xs font-bold uppercase tracking-wide text-brand-accent-ink">{d.type}</span>
                              <span className="text-sm font-mono tabular-nums text-gray-900">{d.fee}</span>
                            </span>
                            <span className="mt-0.5 block text-sm font-bold text-gray-900 group-hover:text-gray-600 transition-colors">{d.party}</span>
                            <span className="block text-2xs uppercase tracking-wide text-gray-400">{d.detail}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-14">
          <SidebarFooter />
        </div>
      </main>
    </div>
  );
}
