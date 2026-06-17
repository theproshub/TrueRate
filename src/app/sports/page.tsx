import type { Metadata } from 'next';
import Link from 'next/link';
import SportsMasthead from '@/components/sports/SportsMasthead';
import SportsFrontPackage, { type PackageItem } from '@/components/sports/SportsFrontPackage';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import {
  sportsHero,
  sportsStoriesBySection,
  type SportsStory,
} from '@/data/sports-stories';

export const metadata: Metadata = {
  title: 'Sports — The Business of Liberian Sport',
  alternates: { canonical: '/sports' },
  description:
    'TrueRate Sports — the business of Liberian sport: club finance, sponsorship, transfers, broadcast rights and governance across Liberia and West Africa.',
};

export const revalidate = 300;

const EDITION_DATE = new Date().toLocaleDateString('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

const href = (s: SportsStory) => `/sports/news/${s.slug}`;

const DESKS: { label: string; href: string; section: 'sponsorship' | 'transfers' | 'broadcast' }[] = [
  { label: 'Sponsorship',       href: '/sports/sponsorship',      section: 'sponsorship' },
  { label: 'Transfers & Deals', href: '/sports/transfers-deals',  section: 'transfers' },
  { label: 'Broadcast Rights',  href: '/sports/broadcast-rights', section: 'broadcast' },
];

/** Newspaper-style section rule — thick top stroke + small-caps label. */
function Rule({ label, href: more, moreLabel = 'More' }: { label: string; href?: string; moreLabel?: string }) {
  return (
    <div className="flex items-baseline justify-between border-b-2 border-gray-900 pb-2 mb-5">
      <h2 className="text-sm font-black uppercase tracking-[0.16em] text-gray-900">{label}</h2>
      {more && <Link href={more} className="text-2xs font-semibold uppercase tracking-wide text-brand-accent-ink hover:text-brand-ink no-underline">{moreLabel} ›</Link>}
    </div>
  );
}

/** Map a SportsStory to the shared front-package item shape. */
const toPackageItem = (s: SportsStory): PackageItem => ({
  category: s.category,
  title: s.title,
  href: href(s),
  dek: s.summary,
  source: s.source,
  author: s.author,
  authorRole: s.authorRole,
  time: s.time,
  flag: s.flag,
  dateline: s.dateline,
  readTime: s.readTime,
});

/** Desk mini-section: labelled lead + supporting headlines — scan by topic. */
function DeskColumn({ label, href: deskHref, items }: { label: string; href: string; items: SportsStory[] }) {
  if (items.length === 0) return null;
  const [lead, ...rest] = items;
  return (
    <section aria-label={label} className="min-w-0">
      <div className="flex items-center justify-between border-b border-gray-900/20 pb-2 mb-3">
        <h3 className="text-xs font-black uppercase tracking-[0.16em] text-gray-900">{label}</h3>
        <Link href={deskHref} className="text-2xs font-semibold uppercase tracking-wide text-brand-accent-ink hover:text-brand-ink no-underline">More ›</Link>
      </div>
      <Link href={href(lead)} className="group block no-underline mb-3">
        <div className="overflow-hidden rounded-md mb-2.5">
          <NewsThumbnail category={lead.category} className="w-full h-[150px]" />
        </div>
        <span className={`block text-2xs font-bold uppercase tracking-wider mb-1 ${getCatColor(lead.category)}`}>{lead.category}</span>
        <h4 className="text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">{lead.title}</h4>
        <p className="mt-1 text-sm text-gray-500 leading-relaxed line-clamp-2">{lead.summary}</p>
        <p className="mt-1.5 text-2xs text-gray-400">{lead.source} · {lead.time}</p>
      </Link>
      <div className="flex flex-col divide-y divide-gray-200">
        {rest.map((s) => (
          <Link key={s.slug} href={href(s)} className="group block py-2.5 no-underline">
            <h4 className="text-sm font-semibold leading-snug text-gray-800 group-hover:text-gray-600 transition-colors line-clamp-2">{s.title}</h4>
            <p className="mt-1 text-2xs text-gray-400">{s.source} · {s.time}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function SportsPage() {
  const hero = sportsHero('main');
  const mainRest = sportsStoriesBySection('main'); // excludes hero
  const latest = mainRest.slice(8);
  const mostRead = [hero, ...mainRest].slice(0, 6);

  return (
    <div className="bg-brand-surface min-h-screen text-gray-800">
      <SportsMasthead />

      <main className="mx-auto max-w-container px-4 py-6">
        {/* Edition line — newsroom furniture */}
        <p className="pb-3 mb-5 sm:mb-6 border-b border-gray-900/15 text-2xs font-bold uppercase tracking-[0.18em] text-gray-500">
          Monrovia <span className="text-gray-300">·</span> {EDITION_DATE} <span className="text-gray-300">·</span> Sports Business Edition
        </p>

        {/* Front package: scannable index rail · dominant lead · second story */}
        <SportsFrontPackage items={[hero, ...mainRest].map(toPackageItem)} leadAs="h1" />

        {/* Across the Desks — the sports-business verticals */}
        <section aria-labelledby="desks-h" className="mt-10">
          <h2 id="desks-h" className="text-sm font-black uppercase tracking-[0.16em] text-gray-900 border-b-2 border-gray-900 pb-2 mb-6">Across the Desks</h2>
          <div className="grid grid-cols-1 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {DESKS.map((d) => (
              <DeskColumn key={d.label} label={d.label} href={d.href} items={sportsStoriesBySection(d.section, { includeHero: true }).slice(0, 3)} />
            ))}
          </div>
        </section>

        {/* Latest river + editorial sidebar */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          <section aria-labelledby="latest-h" className="lg:col-span-2 min-w-0">
            <Rule label="Latest in Sports Business" href="/sports/transfers-deals" />
            <div className="flex flex-col divide-y divide-gray-200">
              {latest.map((s) => (
                <Link key={s.slug} href={href(s)} className="group flex gap-4 sm:gap-5 py-5 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-md order-last">
                    <NewsThumbnail category={s.category} className="h-[84px] w-[120px] sm:h-[96px] sm:w-[150px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-2xs font-bold uppercase tracking-wider ${getCatColor(s.category)}`}>{s.category}</span>
                    <h3 className="mt-0.5 text-base font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 text-pretty">{s.title}</h3>
                    <p className="mt-1 hidden sm:block text-sm text-gray-500 leading-relaxed line-clamp-2">{s.summary}</p>
                    <p className="mt-1.5 text-2xs text-gray-400">{s.source} · {s.time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <aside aria-label="Most read and newsletter" className="lg:col-span-1 space-y-10">
            <section aria-labelledby="mr-h">
              <Rule label="Most Read" />
              <ol className="flex flex-col divide-y divide-gray-200">
                {mostRead.map((s, i) => (
                  <li key={s.slug} className="py-3 first:pt-0">
                    <Link href={href(s)} className="group flex items-start gap-3 no-underline">
                      <span aria-hidden className="shrink-0 w-6 font-mono text-lg font-black tabular-nums leading-none text-gray-300">{i + 1}</span>
                      <span className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3">{s.title}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="nl-h" className="border-t-2 border-gray-900 pt-5">
              <h2 id="nl-h" className="text-sm font-black uppercase tracking-wide text-gray-900 mb-1">Sports Business Brief</h2>
              <p className="text-sm text-gray-500 mb-3">The money behind Liberian sport, in your inbox every week.</p>
              <form aria-label="Sign up for the Sports Business Brief">
                <label htmlFor="sb-email" className="sr-only">Email address</label>
                <input id="sb-email" type="email" required placeholder="Email address" className="w-full bg-transparent border-b border-gray-300 px-0 py-2 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 transition-colors mb-3" />
                <button type="submit" className="w-full rounded-md bg-gray-900 py-2.5 text-base font-bold text-white hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">Sign up free</button>
              </form>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
