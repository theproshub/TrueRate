import Link from 'next/link';
import HeroLede from '@/components/sports/HeroLede';
import FlagChip from '@/components/sports/FlagChip';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import type { StoryFlag } from '@/lib/sports-finance-data';

/**
 * The /sports front page's signature package: a scannable index rail
 * (The Brief) · a dominant photo lead · a Second Story with follow headlines.
 * Deliberately exclusive to the section front — each desk page has its own
 * signature layout instead (see SportsDeskHero variants), so every page in the
 * section is visually distinct. Columns degrade gracefully: the lead widens
 * (and side rails drop) when fewer stories are supplied.
 */

export type PackageItem = {
  category: string;
  /** Slug used for the category colour/gradient (falls back to `category`). */
  categorySlug?: string;
  title: string;
  href: string;
  dek?: string;
  source?: string;
  author?: string;
  authorRole?: string;
  time?: string;
  flag?: StoryFlag;
  dateline?: string;
  readTime?: string;
  image?: string | null;
};

/** lead + 5 brief + 3 second. Callers slice overflow past this into their grid. */
export const PACKAGE_CAPACITY = 9;

const cat = (s: PackageItem) => s.categorySlug ?? s.category;

/** The Brief — compact index row: category kicker + headline + credit, no image. */
function BriefRow({ s }: { s: PackageItem }) {
  return (
    <Link href={s.href} className="group block py-3 first:pt-0 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">
      <span className={`block text-2xs font-bold uppercase tracking-wider mb-1 ${getCatColor(cat(s))}`}>{s.category}</span>
      <h3 className="text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors text-pretty line-clamp-3">{s.title}</h3>
      {(s.source || s.author || s.time) && (
        <p className="mt-1 text-2xs text-gray-400">{s.author ? `By ${s.author}` : s.source}{(s.author || s.source) && s.time ? ' · ' : ''}{s.time}</p>
      )}
    </Link>
  );
}

/** Second story — a true secondary focal point: medium image lead + follow headlines. */
function SecondStory({ items }: { items: PackageItem[] }) {
  if (items.length === 0) return null;
  const [lead, ...rest] = items;
  return (
    <section aria-label="Second story" className="min-w-0">
      <Link href={lead.href} className="group block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">
        <div className="overflow-hidden rounded-md mb-2.5">
          <NewsThumbnail category={cat(lead)} src={lead.image} className="w-full h-[150px] transition-transform motion-safe:group-hover:scale-[1.03]" />
        </div>
        <div className="flex items-center gap-2 mb-1">
          {lead.flag && <FlagChip flag={lead.flag} />}
          <span className={`text-2xs font-bold uppercase tracking-wider ${getCatColor(cat(lead))}`}>{lead.category}</span>
        </div>
        <h3 className="text-lg font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors text-pretty">{lead.title}</h3>
        {lead.dek && <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-3">{lead.dek}</p>}
        {(lead.source || lead.author || lead.time) && (
          <p className="mt-1.5 text-2xs text-gray-400">{lead.author ? `By ${lead.author}` : lead.source}{(lead.author || lead.source) && lead.time ? ' · ' : ''}{lead.time}</p>
        )}
      </Link>
      {rest.length > 0 && (
        <div className="mt-3 flex flex-col divide-y divide-gray-200 border-t border-gray-200">
          {rest.map((s) => (
            <Link key={s.href} href={s.href} className="group block py-3 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">
              <span className={`block text-2xs font-bold uppercase tracking-wider mb-1 ${getCatColor(cat(s))}`}>{s.category}</span>
              <h4 className="text-sm font-semibold leading-snug text-gray-800 group-hover:text-gray-600 transition-colors line-clamp-2">{s.title}</h4>
              {(s.source || s.author || s.time) && (
                <p className="mt-1 text-2xs text-gray-400">{s.author ? `By ${s.author}` : s.source}{(s.author || s.source) && s.time ? ' · ' : ''}{s.time}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default function SportsFrontPackage({
  items,
  leadAs = 'h2',
}: {
  items: PackageItem[];
  leadAs?: 'h1' | 'h2';
}) {
  if (items.length === 0) return null;

  const [lead, ...restAll] = items;
  const rest = restAll.slice(0, 8);
  const brief = rest.slice(0, 5);
  const second = rest.slice(5, 8);

  // Lead widens as side rails drop away, so thin desks never leave empty columns.
  const sides = (brief.length > 0 ? 1 : 0) + (second.length > 0 ? 1 : 0);
  const leadSpan = sides === 2 ? 'lg:col-span-6' : sides === 1 ? 'lg:col-span-9' : 'lg:col-span-12';

  return (
    <div className="grid grid-cols-1 gap-8 lg:gap-0 lg:grid-cols-12 pb-8 sm:pb-10 border-b-2 border-gray-900">
      {/* Lead first in the DOM so the page's lead heading precedes the rails. */}
      <div className={`order-1 lg:order-2 min-w-0 ${leadSpan} ${brief.length > 0 ? 'lg:border-l lg:border-gray-900/15 lg:pl-8' : ''} ${second.length > 0 ? 'lg:border-r lg:border-gray-900/15 lg:pr-8' : ''}`}>
        <HeroLede
          as={leadAs}
          category={lead.category}
          imageCategory={cat(lead)}
          image={lead.image}
          title={lead.title}
          dek={lead.dek ?? ''}
          source={lead.source ?? ''}
          time={lead.time ?? ''}
          href={lead.href}
          flag={lead.flag}
          dateline={lead.dateline}
          author={lead.author}
          authorRole={lead.authorRole}
          readTime={lead.readTime}
        />
      </div>

      {brief.length > 0 && (
        <section aria-labelledby="brief-h" className="order-2 lg:order-1 lg:col-span-3 min-w-0 lg:pr-8">
          <h2 id="brief-h" className="text-sm font-black uppercase tracking-[0.16em] text-gray-900 border-b-2 border-gray-900 pb-2 mb-2">The Brief</h2>
          <div className="flex flex-col divide-y divide-gray-200">
            {brief.map((s) => <BriefRow key={s.href} s={s} />)}
          </div>
        </section>
      )}

      {second.length > 0 && (
        <div className="order-3 lg:col-span-3 min-w-0 lg:pl-8">
          <SecondStory items={second} />
        </div>
      )}
    </div>
  );
}
