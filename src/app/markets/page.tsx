import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { getNewsCatColor } from '@/lib/category-colors';
import { fetchLiveRates, toLRDRates } from '@/lib/api/exchange';
import { fetchCommodities } from '@/lib/api/stooq';
import {
  fetchLiberiaIndicators,
  latestValue,
  WB_INDICATORS,
} from '@/lib/api/worldbank';
import { newsItems } from '@/data/news';
import type { NewsItem } from '@/lib/types';
import { Heading, Text } from '@/components/ui';

export const revalidate = 900; // 15 min

export const metadata: Metadata = {
  title: 'Markets & Finance — Liberia',
  alternates: { canonical: '/markets' },
  description:
    "Liberia’s markets and finance hub: live FX, commodities, macro indicators, and TrueRate desks’ coverage of forex, commodities, banking, and policy.",
};

const FX_DISPLAY: { from: string; label: string; note: string }[] = [
  { from: 'USD', label: 'USD/LRD', note: 'Anchor pair' },
  { from: 'EUR', label: 'EUR/LRD', note: 'EU goods invoicing' },
  { from: 'GBP', label: 'GBP/LRD', note: 'Diaspora corridor' },
  { from: 'CNY', label: 'CNY/LRD', note: 'Wholesale imports' },
  { from: 'GHS', label: 'GHS/LRD', note: 'Ghana cross-border' },
  { from: 'NGN', label: 'NGN/LRD', note: 'Nigeria capital flows' },
];

function formatUSD(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function formatPct(n: number): string {
  return `${n.toFixed(2)}%`;
}

function deltaClass(delta: number | null): string {
  if (delta === null) return 'text-gray-500';
  if (delta > 0) return 'text-pos';
  if (delta < 0) return 'text-neg';
  return 'text-gray-400';
}

function deltaArrow(delta: number | null): string {
  if (delta === null || delta === 0) return '';
  return delta > 0 ? '▲' : '▼';
}

function deltaSign(delta: number | null): string {
  if (delta === null) return '';
  if (delta > 0) return '+';
  return '';
}

function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

const byCategory = (cat: string) =>
  newsItems.filter(n => n.category.toLowerCase() === cat.toLowerCase());

// ── small story card / row helpers ──────────────────────────────────────────

/** Horizontal card: thumbnail left, category+title+meta right */
function StoryCard({ n, withByline = false }: { n: NewsItem; withByline?: boolean }) {
  return (
    <li className="border-b border-white/[0.06] last:border-0 pb-3.5 mb-3.5 last:pb-0 last:mb-0">
      <Link href={`/news/${n.id}`} className="group flex items-start gap-3 no-underline">
        <div className="shrink-0 overflow-hidden rounded-lg">
          <NewsThumbnail category={n.category} className="h-[60px] w-[88px]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-2xs font-semibold uppercase tracking-wide mb-0.5 ${getNewsCatColor(n.category)}`}>{n.category}</p>
          <h3 className="text-sm sm:text-md font-bold leading-snug text-white group-hover:text-white/75 transition-colors line-clamp-3">{n.title}</h3>
          <Text variant="meta" className="leading-relaxed text-gray-500 mt-1">
            {withByline && n.author ? <><span className="font-semibold text-gray-400">{n.author}</span><span className="mx-1 text-gray-700">·</span></> : null}
            {timeAgo(n.date)}
          </Text>
        </div>
      </Link>
    </li>
  );
}

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-white/20 pb-2 mb-4">
      <Heading level={5} className="text-white">{title}</Heading>
      {href && (
        <Link href={href} className="text-2xs uppercase tracking-wider text-brand-accent hover:underline no-underline">
          View all ›
        </Link>
      )}
    </div>
  );
}

/**
 * Yahoo-style desk column: a lead story with a large image, then a clean
 * headline list (no thumbnails) with author · time meta.
 */
function DeskColumn({ title, href, items }: { title: string; href: string; items: NewsItem[] }) {
  const [lead, ...rest] = items;
  if (!lead) return null;
  return (
    <div>
      <SectionHeader title={title} href={href} />

      {/* Lead — large image + headline */}
      <Link href={`/news/${lead.id}`} className="group block no-underline mb-4">
        <div className="overflow-hidden rounded-xl mb-3">
          <NewsThumbnail category={lead.category} className="w-full h-[200px]" />
        </div>
        <h3 className="text-md sm:text-lg font-bold leading-snug text-white group-hover:text-white/80 transition-colors mb-1.5 text-balance">
          {lead.title}
        </h3>
        <Text variant="meta" className="text-gray-500">
          {lead.author && <><span className="text-gray-400">{lead.author}</span><span className="mx-1.5 text-gray-700">·</span></>}
          {timeAgo(lead.date)}
        </Text>
      </Link>

      {/* Follow list — headline-only rows with hairline dividers */}
      <div className="flex flex-col divide-y divide-white/[0.06] border-t border-white/[0.06]">
        {rest.map(n => (
          <Link key={n.id} href={`/news/${n.id}`} className="group block py-3 no-underline">
            <h4 className="text-sm font-bold leading-snug text-white group-hover:text-white/80 transition-colors line-clamp-2 mb-1">
              {n.title}
            </h4>
            <Text variant="meta" className="text-gray-500">
              {n.author && <><span className="text-gray-400">{n.author}</span><span className="mx-1.5 text-gray-700">·</span></>}
              {timeAgo(n.date)}
            </Text>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── page ────────────────────────────────────────────────────────────────────

export default async function MarketsPage() {
  const [liveRates, commodities, indicators] = await Promise.all([
    fetchLiveRates(),
    fetchCommodities(),
    fetchLiberiaIndicators().catch(() => ({} as Record<string, { date: string; value: number }[]>)),
  ]);

  // When both FX feeds are down we get hardcoded fallback rates. Honor the
  // page's "never silently substitute stale or fabricated data" promise by
  // treating those as unavailable (the panel renders a dash).
  const fxStale = !!liveRates.stale;
  const lrdRates = fxStale ? {} : toLRDRates(liveRates);

  // ── Top Movers (commodities sorted by intraday change) ──
  const movers = commodities
    .filter(c => c.changePercent !== null)
    .map(c => ({ ...c, change: c.changePercent as number }));
  const leaders = [...movers].sort((a, b) => b.change - a.change).slice(0, 5);
  const laggards = [...movers].sort((a, b) => a.change - b.change).slice(0, 5);

  // ── News by category ──
  const forexNews       = byCategory('forex');
  const commoditiesNews = byCategory('commodities');
  const economyNews     = byCategory('economy');
  const policyNews      = byCategory('policy');
  const analysisNews    = byCategory('analysis');
  const bankingNews     = byCategory('banking');
  const investingNews   = byCategory('investing');

  // Lead block — pinned to FT-style flagship stories
  const findById = (id: string) => newsItems.find(n => n.id === id)!;
  const lead        = findById('36');  // CBL rate dilemma — analysis lead
  const subFeatures = ['51', '41'].map(findById);
  const whatsNews   = ['42', '46', '52', '38', '47', '43'].map(findById);

  // Section feeds — FT-style thematic desks
  const heardOnTheStreet   = analysisNews.slice(0, 5);
  const banking            = bankingNews.slice(0, 5);
  const investing          = investingNews.slice(0, 5);
  const stocks             = economyNews.slice(0, 5);
  const commoditiesStories = commoditiesNews.slice(0, 5);
  const currenciesStories  = forexNews.slice(0, 5);
  const regulation         = policyNews.slice(0, 4);

  // Most recent desks (top authors by article count)
  const authorCounts: Record<string, { count: number; latest: NewsItem }> = {};
  for (const item of newsItems) {
    if (!item.author) continue;
    const existing = authorCounts[item.author];
    if (existing) {
      existing.count += 1;
      if (new Date(item.date) > new Date(existing.latest.date)) existing.latest = item;
    } else {
      authorCounts[item.author] = { count: 1, latest: item };
    }
  }
  const topAuthors = Object.entries(authorCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3)
    .map(([author, info]) => ({ author, ...info }));

  // Pull "More in Markets" from the new FT-style desks for variety
  const morePickIds = ['36', '41', '46', '51', '38', '42', '47', '52'];
  const morePicks = morePickIds
    .map(id => newsItems.find(n => n.id === id))
    .filter((n): n is NonNullable<typeof n> => !!n);

  return (
    <main className="mx-auto max-w-container px-4 py-6 pb-10">
      <h1 className="sr-only">Markets &amp; Finance</h1>

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Markets & Finance' }]} />

      {/* ── Top Movers + Today's Markets ── */}
      <section className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 border-b border-white/[0.08]" aria-labelledby="movers-heading">
        {/* Top Movers — Leaders / Laggards */}
        <div className="lg:col-span-2">
          <div className="flex items-baseline justify-between border-b border-white/20 pb-2 mb-4">
            <h2 id="movers-heading" className="text-md font-bold text-white">Top Movers · Commodities</h2>
            <Link href="/analytics" className="text-2xs uppercase tracking-wider text-brand-accent hover:underline no-underline">
              Trends &amp; Analytics ›
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Leaders */}
            <div>
              <Text variant="meta" className="font-bold uppercase tracking-wider text-pos mb-2">Leaders</Text>
              <table className="w-full text-base tabular-nums">
                <caption className="sr-only">Commodities leading by intraday percent change.</caption>
                <thead>
                  <tr className="text-2xs uppercase tracking-wider text-gray-500 border-b border-white/[0.08]">
                    <th scope="col" className="py-1.5 text-left font-semibold">Commodity</th>
                    <th scope="col" className="py-1.5 text-right font-semibold">Last</th>
                    <th scope="col" className="py-1.5 pl-2 text-right font-semibold">Chg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {leaders.map(c => (
                    <tr key={c.symbol} className="hover:bg-white/[0.02]">
                      <td className="py-2 pr-2 font-bold text-white">{c.name}</td>
                      <td className="py-2 text-right font-bold text-white">
                        {c.price !== null ? c.price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—'}
                      </td>
                      <td className={`py-2 pl-2 text-right font-semibold ${deltaClass(c.change)}`}>
                        {deltaArrow(c.change)} {deltaSign(c.change)}{c.change.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Laggards */}
            <div>
              <Text variant="meta" className="font-bold uppercase tracking-wider text-neg mb-2">Laggards</Text>
              <table className="w-full text-base tabular-nums">
                <caption className="sr-only">Commodities lagging by intraday percent change.</caption>
                <thead>
                  <tr className="text-2xs uppercase tracking-wider text-gray-500 border-b border-white/[0.08]">
                    <th scope="col" className="py-1.5 text-left font-semibold">Commodity</th>
                    <th scope="col" className="py-1.5 text-right font-semibold">Last</th>
                    <th scope="col" className="py-1.5 pl-2 text-right font-semibold">Chg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {laggards.map(c => (
                    <tr key={c.symbol} className="hover:bg-white/[0.02]">
                      <td className="py-2 pr-2 font-bold text-white">{c.name}</td>
                      <td className="py-2 text-right font-bold text-white">
                        {c.price !== null ? c.price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—'}
                      </td>
                      <td className={`py-2 pl-2 text-right font-semibold ${deltaClass(c.change)}`}>
                        {deltaArrow(c.change)} {deltaSign(c.change)}{c.change.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Text variant="caption" className="mt-3 leading-relaxed">
            Source: <a className="underline decoration-dotted underline-offset-2 hover:text-white" href="https://stooq.com" target="_blank" rel="noopener noreferrer">Stooq</a> EOD feed · cached 15 min · iron ore proxied via BHP ADR. Liberia-relevant futures only — no equities feed available for the LSE.
          </Text>
        </div>

        {/* Today's Markets — FX + Macro side panel */}
        <aside className="lg:border-l lg:border-white/[0.08] lg:pl-8">
          <Heading level={5} className="text-white mb-3 pb-2 border-b-2 border-white/30">Today&rsquo;s Markets</Heading>

          {/* FX */}
          <Text variant="caption" className="font-bold uppercase tracking-wider text-brand-accent mb-2">FX · vs LRD</Text>
          <ul className="m-0 p-0 list-none divide-y divide-white/[0.06] text-sm tabular-nums mb-5">
            {FX_DISPLAY.map(({ from, label }) => {
              const r = lrdRates[from];
              return (
                <li key={from} className="flex items-baseline justify-between py-1.5">
                  <span className="font-semibold text-white">{label}</span>
                  <span className="font-bold text-white">{r ? r.toLocaleString('en-US', { maximumFractionDigits: 4 }) : '—'}</span>
                </li>
              );
            })}
          </ul>

          {/* Macro */}
          <Text variant="caption" className="font-bold uppercase tracking-wider text-brand-accent mb-2">Macro · World Bank</Text>
          <ul className="m-0 p-0 list-none divide-y divide-white/[0.06] text-sm tabular-nums">
            {[
              { key: WB_INDICATORS.GDP_GROWTH, label: 'GDP growth' },
              { key: WB_INDICATORS.INFLATION,  label: 'Inflation (CPI)' },
              { key: WB_INDICATORS.RESERVES,   label: 'Reserves' },
              { key: WB_INDICATORS.UNEMPLOYMENT, label: 'Unemployment' },
              { key: WB_INDICATORS.GDP,        label: 'GDP' },
              { key: WB_INDICATORS.GOVT_DEBT,  label: 'Govt debt %GDP' },
            ].map(({ key, label }) => {
              const v = latestValue(indicators[key] ?? []);
              const isUsd = key === WB_INDICATORS.GDP || key === WB_INDICATORS.RESERVES;
              return (
                <li key={key} className="flex items-baseline justify-between py-1.5">
                  <span className="font-semibold text-white">{label}</span>
                  <span className="font-bold text-white">{v != null ? (isUsd ? formatUSD(v) : formatPct(v)) : '—'}</span>
                </li>
              );
            })}
          </ul>

          <Text variant="caption" className="mt-4 leading-relaxed">
            USD/LRD from the <a className="underline decoration-dotted underline-offset-2 hover:text-white" href="https://www.cbl.org.lr/research/buying-selling-rates" target="_blank" rel="noopener noreferrer">Central Bank of Liberia</a> (mid of daily buying/selling); EUR/GBP/CNY via <a className="underline decoration-dotted underline-offset-2 hover:text-white" href="https://frankfurter.dev" target="_blank" rel="noopener noreferrer">Frankfurter (ECB)</a>; GHS/NGN via <a className="underline decoration-dotted underline-offset-2 hover:text-white" href="https://github.com/fawazahmed0/exchange-api" target="_blank" rel="noopener noreferrer">@fawazahmed0/currency-api</a>; macro from <a className="underline decoration-dotted underline-offset-2 hover:text-white" href="https://data.worldbank.org/country/LR" target="_blank" rel="noopener noreferrer">World Bank</a>.
          </Text>
        </aside>
      </section>

      {/* ── Lead + What's News ── */}
      <section className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 border-b border-white/[0.08]">
        {/* Lead feature */}
        <div className="lg:col-span-2">
          {/* Flagship lead story — FT-style hero */}
          <Link href={`/news/${lead.id}`} className="group block no-underline">
            <div className="overflow-hidden rounded-xl mb-4">
              <NewsThumbnail category={lead.category} className="w-full h-[280px] sm:h-[360px]" />
            </div>
            <Text variant="caption" className={`font-semibold uppercase tracking-[0.18em] mb-2 ${getNewsCatColor(lead.category)}`}>
              <span>Markets lead</span>
              <span className="mx-2 text-gray-700">·</span>
              <span>{lead.category}</span>
            </Text>
            <h2 className="text-xl sm:text-2xl font-bold leading-[1.15] tracking-tight text-white group-hover:text-white/80 transition-colors mb-3 text-balance">
              {lead.title}
            </h2>
            <p className="text-md leading-relaxed text-gray-400 mb-3 line-clamp-3 max-w-[680px]">
              {lead.summary}
            </p>
            <Text variant="meta" className="text-gray-500">
              {lead.author && <><span className="font-semibold text-gray-300">{lead.author}</span><span className="mx-1.5 text-gray-700">·</span></>}
              <span>{lead.source}</span>
              <span className="mx-1.5 text-gray-700">·</span>
              <time>{timeAgo(lead.date)}</time>
            </Text>
          </Link>

          {/* Sub-features — vertical card style with large thumbnail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6 pt-6 border-t border-white/[0.06]">
            {subFeatures.map(s => (
              <Link key={s.id} href={`/news/${s.id}`} className="group block no-underline">
                <div className="overflow-hidden rounded-xl mb-3">
                  <NewsThumbnail category={s.category} className="w-full h-[180px] sm:h-[220px]" />
                </div>
                <p className={`text-2xs font-semibold uppercase tracking-wide mb-0.5 ${getNewsCatColor(s.category)}`}>{s.category}</p>
                <h3 className="text-sm sm:text-md font-bold leading-snug text-white group-hover:text-white/75 transition-colors line-clamp-3 mb-1">{s.title}</h3>
                <Text variant="meta" className="leading-relaxed text-gray-500">{timeAgo(s.date)}</Text>
              </Link>
            ))}
          </div>
        </div>

        {/* What's News sidebar — horizontal card list */}
        <aside className="lg:border-l lg:border-white/[0.08] lg:pl-8">
          <Heading level={5} className="text-white mb-3 pb-2 border-b-2 border-white/30">What&rsquo;s News</Heading>
          <ul className="m-0 p-0 list-none">
            {whatsNews.map(n => (
              <StoryCard key={n.id} n={n} />
            ))}
          </ul>
        </aside>
      </section>

      {/* ── Desk grid: Heard / Banking / Investing — Yahoo-style lead + list ── */}
      <section className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 pb-6 border-b border-white/[0.08]">
        <DeskColumn title="Heard on the Street" href="/news" items={heardOnTheStreet} />
        <DeskColumn title="Banking & Capital" href="/news" items={banking} />
        <DeskColumn title="Investing" href="/news" items={investing} />
      </section>

      {/* ── Desk grid: Macro / Commodities / Currencies ── */}
      <section className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 pb-6 border-b border-white/[0.08]">
        <DeskColumn title="Macro & Growth" href="/economy" items={stocks} />
        <DeskColumn title="Commodities & Futures" href="/news" items={commoditiesStories} />
        <DeskColumn title="Currencies" href="/news" items={currenciesStories} />
      </section>

      {/* ── Regulation + Most Recent Desks + Related Topics ── */}
      <section className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <SectionHeader title="Regulation &amp; Policy" href="/news" />
          <ul className="m-0 p-0 list-none">
            {regulation.map(n => <StoryCard key={n.id} n={n} withByline />)}
          </ul>
        </div>
        <div>
          <SectionHeader title="Most Recent Desks" />
          <ul className="m-0 p-0 list-none space-y-3">
            {topAuthors.map(({ author, count, latest }) => (
              <li key={author} className="flex gap-3 items-start border-b border-white/[0.06] pb-3 last:border-0">
                <div className="h-10 w-10 rounded-full bg-brand-accent/15 border border-brand-accent/30 text-brand-accent text-sm font-bold flex items-center justify-center shrink-0">
                  {author.split(' ').map(w => w[0]).slice(0, 2).join('')}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-white">{author}</p>
                  <Text variant="caption" className="uppercase tracking-wider mb-1">{count} {count === 1 ? 'story' : 'stories'} this month</Text>
                  <Link href={`/news/${latest.id}`} className="text-sm text-gray-300 hover:text-white no-underline line-clamp-2">{latest.title}</Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHeader title="Related Topics" />
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Forex',         href: '/news' },
              { label: 'Commodities',   href: '/news' },
              { label: 'Iron Ore',      href: '/news' },
              { label: 'Rubber',        href: '/news' },
              { label: 'CBL',           href: '/news' },
              { label: 'World Bank',    href: '/news' },
              { label: 'IMF',           href: '/news' },
              { label: 'Diaspora',      href: '/news' },
              { label: 'GDP',           href: '/news' },
              { label: 'Inflation',     href: '/news' },
              { label: 'Banking',       href: '/news' },
              { label: 'Mining',        href: '/news' },
              { label: 'Trade',         href: '/news' },
              { label: 'Policy',        href: '/news' },
            ].map(t => (
              <Link
                key={t.label}
                href={t.href}
                className="inline-block rounded-sm border border-white/15 px-2.5 py-1 text-xs font-semibold text-white/80 hover:bg-white/[0.06] hover:text-white no-underline transition-colors"
              >
                {t.label}
              </Link>
            ))}
          </div>

          <Text variant="caption" className="mt-6 font-bold uppercase tracking-wider mb-2">TrueRate Desks</Text>
          <ul className="m-0 p-0 list-none flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
            {Array.from(new Set(newsItems.map(n => n.author).filter(Boolean) as string[])).slice(0, 8).map(a => (
              <li key={a}>
                <span className="text-gray-300">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── More in Markets & Finance ── */}
      <section className="mb-8">
        <div className="flex items-baseline justify-between border-b-2 border-white/30 pb-2 mb-5">
          <Heading level={5} className="text-white">More in Markets &amp; Finance</Heading>
          <Link href="/news" className="text-xs uppercase tracking-wider text-brand-accent hover:underline no-underline">All news ›</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          {morePicks.map(n => (
            <Link key={n.id} href={`/news/${n.id}`} className="group block no-underline">
              <div className="overflow-hidden rounded-xl mb-3">
                <NewsThumbnail category={n.category} className="w-full h-[140px]" />
              </div>
              <article>
                <p className={`text-2xs font-semibold uppercase tracking-wide mb-1.5 ${getNewsCatColor(n.category)}`}>{n.category}</p>
                <h3 className="text-base sm:text-md font-bold leading-snug text-white group-hover:text-white/75 transition-colors mb-2">{n.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-2">{n.summary}</p>
                <Text variant="meta" className="text-gray-500">
                  {n.author && <><span className="font-semibold text-gray-300">{n.author}</span><span className="mx-1 text-gray-700">·</span></>}
                  {timeAgo(n.date)}
                </Text>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Methodology ── */}
      <section className="mt-8 border-t border-white/[0.08] pt-5" aria-labelledby="method-heading">
        <h2 id="method-heading" className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400 mb-3">How this page works</h2>
        <ul className="space-y-2 text-base text-gray-300 leading-relaxed max-w-[760px]">
          <li>· The USD/LRD anchor is the Central Bank of Liberia&rsquo;s published daily mid-rate; EUR/GBP/CNY use ECB reference rates (Frankfurter) and GHS/NGN a free CDN feed, both refreshed hourly; commodities every 15 minutes from Stooq; macro indicators every 24 hours from the World Bank.</li>
          <li>· If an upstream feed is unreachable, the affected card shows a dash &mdash; we never silently substitute stale or fabricated data.</li>
          <li>· LRD cross-rates are computed from USD-base rates; mid-market reference only, not a dealing rate.</li>
          <li>· No equities feed for the Liberian Stock Exchange is available; Top Movers is restricted to the commodities universe relevant to Liberia&rsquo;s export economy.</li>
          <li>· Tip a deal or correction: <a className="text-brand-accent hover:underline" href="mailto:tips@truerateliberia.com">tips@truerateliberia.com</a></li>
        </ul>
      </section>

    </main>
  );
}
