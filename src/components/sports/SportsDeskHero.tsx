import Link from 'next/link';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import FlagChip from '@/components/sports/FlagChip';
import { getCatColor } from '@/lib/category-colors';
import type { StoryFlag } from '@/lib/sports-finance-data';

/**
 * Signature hero layouts for the sports desk pages. Each desk is assigned ONE
 * variant explicitly (see SPORTS_DESKS in lib/sports-desks.ts) so every desk
 * front reads visually different at a glance:
 *
 *  bigLeft    — classic back page: big lead left, headline rail right
 *  overlay    — full-bleed photo with the headline set on the image
 *  grid       — 4-up card mosaic
 *  horizontal — split lead: image one side, text the other
 *  stacked    — magazine vertical lead + thumb rows
 *  ledger     — text-first numbered briefing, no photos (institutional)
 *  wire       — timestamped feed rows (newsroom wire)
 *  feature    — pull-quote + portrait (interviews)
 *  index      — dataset-index rows with mono numerals (data & research)
 *  essay      — serif, byline-led text columns, no photos (opinion)
 */

export type HeroCard = {
  category: string;
  categorySlug?: string;
  title: string;
  href?: string;
  image?: string | null;
  flag?: StoryFlag;
  author?: string;
  time?: string;
  dek?: string;
};

export type HeroVariant =
  | 'bigLeft' | 'overlay' | 'grid' | 'horizontal' | 'stacked'
  | 'ledger' | 'wire' | 'feature' | 'index' | 'essay';

export const HERO_VARIANTS: HeroVariant[] = [
  'bigLeft', 'overlay', 'grid', 'horizontal', 'stacked',
  'ledger', 'wire', 'feature', 'index', 'essay',
];

const slug = (c: HeroCard) => c.categorySlug ?? c.category;

function Cat({ c }: { c: HeroCard }) {
  return <span className={`text-2xs font-bold uppercase tracking-wider ${getCatColor(slug(c))}`}>{c.category}</span>;
}

function Meta({ c, light = false }: { c: HeroCard; light?: boolean }) {
  if (!c.author && !c.time) return null;
  return (
    <p className={`mt-1.5 text-2xs ${light ? 'text-white/70' : 'text-gray-500'}`}>
      {c.author ? `By ${c.author}` : ''}{c.author && c.time ? ' · ' : ''}{c.time}
    </p>
  );
}

const linkCls = 'group block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2 rounded-md';

/** Big vertical lead — image first, headline below. */
function LeadVertical({ c }: { c: HeroCard }) {
  return (
    <Link href={c.href ?? '#'} className={linkCls}>
      <div className="relative overflow-hidden rounded-xl mb-3">
        <HeroVisual category={slug(c)} src={c.image} className="w-full h-[230px] sm:h-[340px] lg:h-[400px] transition-transform motion-safe:group-hover:scale-[1.02]" />
        {c.flag && <span className="absolute left-3 top-3"><FlagChip flag={c.flag} /></span>}
      </div>
      <Cat c={c} />
      <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors text-balance">{c.title}</h2>
      {c.dek && <p className="mt-1.5 text-sm text-gray-600 leading-relaxed line-clamp-2">{c.dek}</p>}
      <Meta c={c} />
    </Link>
  );
}

/** Lead with headline overlaid on the image. */
function LeadOverlay({ c }: { c: HeroCard }) {
  return (
    <Link href={c.href ?? '#'} className={`${linkCls} relative block overflow-hidden rounded-xl`}>
      <HeroVisual category={slug(c)} src={c.image} className="w-full h-[300px] sm:h-[420px] transition-transform motion-safe:group-hover:scale-[1.02]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <div className="flex items-center gap-2 mb-2">
          {c.flag && <FlagChip flag={c.flag} />}
          <span className={`text-2xs font-bold uppercase tracking-wider ${getCatColor(slug(c))}`}>{c.category}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-lg text-balance max-w-[820px]">{c.title}</h2>
        <Meta c={c} light />
      </div>
    </Link>
  );
}

/** Wide horizontal lead — image one side, headline the other. */
function LeadHorizontal({ c }: { c: HeroCard }) {
  return (
    <Link href={c.href ?? '#'} className={`${linkCls} grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-center`}>
      <div className="relative overflow-hidden rounded-xl">
        <HeroVisual category={slug(c)} src={c.image} className="w-full h-[210px] sm:h-[300px] transition-transform motion-safe:group-hover:scale-[1.02]" />
        {c.flag && <span className="absolute left-3 top-3"><FlagChip flag={c.flag} /></span>}
      </div>
      <div className="min-w-0">
        <Cat c={c} />
        <h2 className="mt-1 text-2xl sm:text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors text-balance">{c.title}</h2>
        {c.dek && <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">{c.dek}</p>}
        <Meta c={c} />
      </div>
    </Link>
  );
}

/** Small vertical thumbnail card. */
function ThumbCard({ c, h = 'h-[150px]' }: { c: HeroCard; h?: string }) {
  return (
    <Link href={c.href ?? '#'} className={`${linkCls} flex flex-col`}>
      <div className="relative overflow-hidden rounded-lg mb-2.5">
        <NewsThumbnail category={slug(c)} src={c.image} className={`w-full ${h} transition-transform motion-safe:group-hover:scale-[1.03]`} />
        {c.flag && <span className="absolute left-2 top-2"><FlagChip flag={c.flag} /></span>}
      </div>
      <Cat c={c} />
      <h3 className="mt-1 text-base font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3 text-pretty">{c.title}</h3>
      <Meta c={c} />
    </Link>
  );
}

/** Horizontal small thumbnail row (thumb + text). */
function ThumbRow({ c }: { c: HeroCard }) {
  return (
    <Link href={c.href ?? '#'} className={`${linkCls} flex gap-3 py-3.5 first:pt-0`}>
      <div className="shrink-0 overflow-hidden rounded-md order-last">
        <NewsThumbnail category={slug(c)} src={c.image} className="h-[64px] w-[88px]" />
      </div>
      <div className="min-w-0 flex-1">
        <Cat c={c} />
        <h3 className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 text-pretty">{c.title}</h3>
        <Meta c={c} />
      </div>
    </Link>
  );
}

/** ledger — institutional text briefing: thick rules, numbered items, no photos. */
function LedgerHero({ lead, side }: { lead: HeroCard; side: HeroCard[] }) {
  return (
    <div className="border-t-4 border-gray-900 pt-5">
      <Link href={lead.href ?? '#'} className={`${linkCls} block max-w-[52rem]`}>
        <div className="flex items-center gap-2 mb-2">
          {lead.flag && <FlagChip flag={lead.flag} />}
          <Cat c={lead} />
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors text-balance">{lead.title}</h2>
        {lead.dek && <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">{lead.dek}</p>}
        <Meta c={lead} />
      </Link>
      {side.length > 0 && (
        <ol className="mt-6 border-t border-gray-900/20 grid grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-gray-200">
          {side.map((c, i) => (
            <li key={i} className="min-w-0 first:sm:pl-0 sm:px-5">
              <Link href={c.href ?? '#'} className={`${linkCls} flex items-start gap-3 py-4`}>
                <span aria-hidden className="shrink-0 font-mono text-2xl font-black tabular-nums leading-none text-gray-300">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0">
                  <Cat c={c} />
                  <span className="mt-0.5 block text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors">{c.title}</span>
                  <Meta c={c} />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/** wire — timestamped newsroom feed: mono times, tight rows, small thumb on the lead. */
function WireHero({ lead, side }: { lead: HeroCard; side: HeroCard[] }) {
  return (
    <div className="border border-gray-900/15 rounded-lg overflow-hidden">
      <p className="px-4 py-2 bg-gray-900 text-2xs font-bold uppercase tracking-[0.2em] text-white">Desk wire</p>
      <div className="px-4 divide-y divide-gray-200">
        <Link href={lead.href ?? '#'} className={`${linkCls} flex gap-4 py-4 items-start`}>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-2xs text-gray-500 mb-1">{lead.time ?? ''}</p>
            <div className="flex items-center gap-2 mb-1">
              {lead.flag && <FlagChip flag={lead.flag} />}
              <Cat c={lead} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold leading-snug tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors text-balance">{lead.title}</h2>
            {lead.dek && <p className="mt-1.5 text-sm text-gray-600 leading-relaxed line-clamp-2">{lead.dek}</p>}
          </div>
          <div className="shrink-0 hidden sm:block overflow-hidden rounded-md">
            <NewsThumbnail category={slug(lead)} src={lead.image} className="h-[110px] w-[170px]" />
          </div>
        </Link>
        {side.map((c, i) => (
          <Link key={i} href={c.href ?? '#'} className={`${linkCls} flex gap-4 py-3.5 items-baseline`}>
            <span className="shrink-0 font-mono text-2xs text-gray-500 w-20">{c.time ?? ''}</span>
            <span className="min-w-0">
              <Cat c={c} />
              <span className="mt-0.5 block text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors">{c.title}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** feature — pull-quote + portrait: the dek reads as the subject speaking. */
function FeatureHero({ lead, side }: { lead: HeroCard; side: HeroCard[] }) {
  return (
    <div>
      <Link href={lead.href ?? '#'} className={`${linkCls} grid grid-cols-1 sm:grid-cols-5 gap-6 items-center`}>
        <div className="sm:col-span-3 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            {lead.flag && <FlagChip flag={lead.flag} />}
            <Cat c={lead} />
          </div>
          {lead.dek && (
            <p className="text-xl sm:text-2xl font-serif italic leading-snug text-gray-900">
              <span aria-hidden className="text-4xl font-black text-gray-300 leading-none align-top mr-1">“</span>
              {lead.dek}
            </p>
          )}
          <h2 className="mt-4 text-lg sm:text-xl font-bold leading-snug tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors">{lead.title}</h2>
          <Meta c={lead} />
        </div>
        <div className="sm:col-span-2 relative overflow-hidden rounded-xl">
          <HeroVisual category={slug(lead)} src={lead.image} className="w-full h-[240px] sm:h-[340px] transition-transform motion-safe:group-hover:scale-[1.02]" />
        </div>
      </Link>
      {side.length > 0 && (
        <div className="mt-6 pt-5 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2">
          {side.map((c, i) => (
            <Link key={i} href={c.href ?? '#'} className={`${linkCls} py-2`}>
              <Cat c={c} />
              <span className="mt-0.5 block text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">{c.title}</span>
              <Meta c={c} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/** index — dataset-index rows: mono numerals, ruled like a table of contents. */
function IndexHero({ lead, side }: { lead: HeroCard; side: HeroCard[] }) {
  return (
    <div>
      <Link href={lead.href ?? '#'} className={`${linkCls} block border-y-2 border-gray-900 py-5`}>
        <div className="flex items-center gap-2 mb-2">
          {lead.flag && <FlagChip flag={lead.flag} />}
          <Cat c={lead} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors text-balance max-w-[48rem]">{lead.title}</h2>
        {lead.dek && <p className="mt-2 text-base text-gray-600 leading-relaxed max-w-[60ch]">{lead.dek}</p>}
        <Meta c={lead} />
      </Link>
      {side.length > 0 && (
        <ol className="divide-y divide-gray-200">
          {side.map((c, i) => (
            <li key={i}>
              <Link href={c.href ?? '#'} className={`${linkCls} flex items-baseline gap-4 py-3.5`}>
                <span aria-hidden className="shrink-0 font-mono text-sm font-bold tabular-nums text-gray-400">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors">{c.title}</span>
                </span>
                <span className="shrink-0 hidden sm:block"><Cat c={c} /></span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/** essay — opinion columns: serif headlines, prominent bylines, no photos. */
function EssayHero({ lead, side }: { lead: HeroCard; side: HeroCard[] }) {
  return (
    <div className="border-t border-b border-gray-900/20 divide-y divide-gray-200 sm:divide-y-0">
      <Link href={lead.href ?? '#'} className={`${linkCls} block py-6 text-center max-w-[44rem] mx-auto`}>
        <div className="flex items-center justify-center gap-2 mb-3">
          {lead.flag && <FlagChip flag={lead.flag} />}
          <Cat c={lead} />
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-[1.12] text-gray-900 group-hover:text-gray-700 transition-colors text-balance">{lead.title}</h2>
        {lead.dek && <p className="mt-3 font-serif italic text-base sm:text-lg text-gray-600 leading-relaxed">{lead.dek}</p>}
        {lead.author && <p className="mt-3 text-2xs font-bold uppercase tracking-[0.18em] text-gray-900">{lead.author}</p>}
      </Link>
      {side.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-gray-200 border-t border-gray-200">
          {side.map((c, i) => (
            <Link key={i} href={c.href ?? '#'} className={`${linkCls} py-4 sm:px-5 first:sm:pl-0 last:sm:pr-0`}>
              <Cat c={c} />
              <span className="mt-1 block font-serif text-base font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors">{c.title}</span>
              {c.author && <span className="mt-1.5 block text-2xs font-bold uppercase tracking-wider text-gray-500">{c.author}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SportsDeskHero({ variant, cards }: { variant: HeroVariant; cards: HeroCard[] }) {
  if (cards.length === 0) return null;
  const [lead, ...rest] = cards;
  const side = rest.slice(0, 3);

  if (variant === 'ledger') return <LedgerHero lead={lead} side={side} />;
  if (variant === 'wire') return <WireHero lead={lead} side={side} />;
  if (variant === 'feature') return <FeatureHero lead={lead} side={side} />;
  if (variant === 'index') return <IndexHero lead={lead} side={side} />;
  if (variant === 'essay') return <EssayHero lead={lead} side={side} />;

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.slice(0, 4).map((c, i) => <ThumbCard key={i} c={c} h="h-[160px]" />)}
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div>
        <LeadOverlay c={lead} />
        {side.length > 0 && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {side.map((c, i) => <ThumbCard key={i} c={c} />)}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div>
        <LeadHorizontal c={lead} />
        {side.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {side.map((c, i) => <ThumbCard key={i} c={c} />)}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div>
        <LeadVertical c={lead} />
        {side.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-x-6 sm:divide-x sm:divide-gray-200">
            {side.map((c, i) => (
              <div key={i} className="flex-1 min-w-0 sm:px-1 first:sm:pl-0"><ThumbRow c={c} /></div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // bigLeft (default)
  return (
    <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 min-w-0 lg:border-r lg:border-gray-900/15 lg:pr-8">
        <LeadVertical c={lead} />
      </div>
      {side.length > 0 && (
        <div className="flex flex-col divide-y divide-gray-200 min-w-0">
          {side.map((c, i) => <ThumbRow key={i} c={c} />)}
        </div>
      )}
    </div>
  );
}
