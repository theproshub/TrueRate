'use client';

import { useFeed, type FeedCard } from '@/hooks/useFeed';
import { getCatColor } from '@/lib/category-colors';

/* ── payload shapes (cast from FeedCard.payload) ── */
interface BreakingPayload { headline: string; summary: string; category: string; topicTag?: string; source: string }
interface ArticlePayload { headline: string; deck: string; readMinutes: number; category: string; topicTag?: string; tags: string[] }
interface QuotePayload { quote: string; speakerName: string; speakerTitle: string; speakerOrg: string; context: string; topicTag?: string }
interface BigStatPayload { value: string; descriptor: string; context: string; topicTag?: string; source: string }
interface Ticker { symbol: string; name: string; assetClass: string; price: number; change: number | null; changePct: number | null; sparkline: number[] }
interface MarketsPayload { tickers: Ticker[] }

function AiBadge({ card }: { card: FeedCard }) {
  if (!card.is_ai_generated) return null;
  return (
    <span className="rounded-full border border-amber-500/30 bg-amber-500/[0.08] px-2 py-0.5 text-2xs font-bold uppercase tracking-wide text-amber-400">
      AI-assisted
    </span>
  );
}

/** Fine-grained topic badge, colored from the canonical palette. */
function TopicBadge({ tag }: { tag?: string }) {
  if (!tag) return null;
  return (
    <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(tag)}`}>{tag}</span>
  );
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 64;
  const h = 20;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${(h - ((v - min) / range) * h).toFixed(1)}`)
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="overflow-visible">
      <polyline points={pts} fill="none" strokeWidth="1.5" className={positive ? 'stroke-emerald-500' : 'stroke-red-400'} />
    </svg>
  );
}

const SECTION_TITLE = 'text-base font-bold text-white uppercase tracking-[0.12em]';
const SECTION_BAR = 'flex items-center gap-3 border-b border-white/[0.07] pb-3 mb-5';

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className={SECTION_BAR}>
      <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
      <h2 className={SECTION_TITLE}>{children}</h2>
    </div>
  );
}

export default function FeedClient() {
  const { cards, updatedAt, count, isLoading, error } = useFeed();

  if (isLoading && !cards) {
    return (
      <div role="status" aria-live="polite" className="rounded-2xl border border-white/[0.07] bg-brand-card p-10 text-center text-sm text-gray-400">
        Loading the feed…
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/[0.06] p-6 text-sm text-red-300">
        Couldn&apos;t load the feed. Please try again shortly.
      </div>
    );
  }

  if (!cards || count === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-brand-card p-10 text-center">
        <p className="text-base text-gray-400">No cards published yet.</p>
        <p className="mt-1 text-sm text-gray-500">
          The daily generator runs at 06:00 UTC; markets publish automatically and editorial cards appear after review.
        </p>
      </div>
    );
  }

  const breaking = cards.breaking ?? [];
  const markets = cards.markets ?? [];
  const bigStats = cards.big_stat ?? [];
  const articles = cards.article ?? [];
  const quotes = cards.quote ?? [];

  return (
    <div className="space-y-10">
      {/* Breaking */}
      {breaking.length > 0 && (
        <section aria-labelledby="feed-breaking" aria-live="polite">
          <SectionHeader><span id="feed-breaking">Breaking</span></SectionHeader>
          <ul className="space-y-3">
            {breaking.map((card) => {
              const p = card.payload as BreakingPayload;
              return (
                <li key={card.id} className="rounded-xl border border-white/[0.07] bg-brand-card p-4">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-2xs font-bold uppercase tracking-wide text-red-400">Breaking</span>
                    {p.category && <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(p.category)}`}>{p.category}</span>}
                    <TopicBadge tag={p.topicTag} />
                    <AiBadge card={card} />
                  </div>
                  <p className="font-bold leading-snug text-white">{p.headline}</p>
                  <p className="mt-1 text-sm text-gray-400">{p.summary}</p>
                  {p.source && <p className="mt-1.5 text-xs text-gray-600">{p.source}</p>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Markets */}
      {markets.length > 0 && (() => {
        const p = markets[0].payload as MarketsPayload;
        return (
          <section aria-labelledby="feed-markets">
            <SectionHeader><span id="feed-markets">Markets</span></SectionHeader>
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-brand-card">
              <table className="w-full">
                <caption className="sr-only">Live market snapshot</caption>
                <thead className="border-b border-white/[0.07] text-left text-2xs font-bold uppercase tracking-[0.12em] text-gray-500">
                  <tr>
                    <th scope="col" className="px-4 py-3">Symbol</th>
                    <th scope="col" className="px-4 py-3">Price</th>
                    <th scope="col" className="px-4 py-3">Change</th>
                    <th scope="col" className="px-4 py-3 text-right">7-day</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-sm">
                  {p.tickers.map((t) => {
                    const positive = (t.changePct ?? 0) >= 0;
                    const changeColor = t.changePct == null ? 'text-gray-400' : positive ? 'text-emerald-500' : 'text-red-400';
                    const sign = t.changePct == null ? '' : positive ? '+' : '−';
                    return (
                      <tr key={t.symbol} className="text-white">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs uppercase">{t.symbol}</span>
                          <span className="ml-2 text-xs text-gray-500">{t.name}</span>
                        </td>
                        <td className="px-4 py-3 tabular-nums">{t.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                        <td className={`px-4 py-3 tabular-nums font-semibold ${changeColor}`}>
                          {t.changePct == null ? '—' : `${sign}${Math.abs(t.changePct).toFixed(2)}%`}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end">
                            <Sparkline data={t.sparkline} positive={positive} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-2xs text-gray-600">{markets[0].source_note}</p>
          </section>
        );
      })()}

      {/* Big Stats */}
      {bigStats.length > 0 && (
        <section aria-labelledby="feed-stats">
          <SectionHeader><span id="feed-stats">By the Numbers</span></SectionHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bigStats.map((card) => {
              const p = card.payload as BigStatPayload;
              return (
                <div key={card.id} className="rounded-2xl border border-white/[0.07] bg-brand-card p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <TopicBadge tag={p.topicTag} />
                    <AiBadge card={card} />
                  </div>
                  <p className="text-3xl font-black text-white tabular-nums leading-none">{p.value}</p>
                  <p className="mt-2 text-sm font-medium text-gray-300">{p.descriptor}</p>
                  <p className="mt-1 text-xs text-gray-500">{p.context}</p>
                  {p.source && <p className="mt-2 text-2xs text-gray-600">{p.source}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Articles */}
      {articles.length > 0 && (
        <section aria-labelledby="feed-articles">
          <SectionHeader><span id="feed-articles">Analysis &amp; Features</span></SectionHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((card) => {
              const p = card.payload as ArticlePayload;
              return (
                <article key={card.id} className="rounded-2xl border border-white/[0.07] bg-brand-card p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {p.category && <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(p.category)}`}>{p.category}</span>}
                    <TopicBadge tag={p.topicTag} />
                    <AiBadge card={card} />
                  </div>
                  <h3 className="font-bold leading-snug text-white">{p.headline}</h3>
                  <p className="mt-1.5 text-sm text-gray-400 line-clamp-3">{p.deck}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {p.readMinutes} min read{Array.isArray(p.tags) && p.tags.length > 0 ? ` · ${p.tags.join(' · ')}` : ''}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Quotes */}
      {quotes.length > 0 && (
        <section aria-labelledby="feed-quotes">
          <SectionHeader><span id="feed-quotes">Voices</span></SectionHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {quotes.map((card) => {
              const p = card.payload as QuotePayload;
              return (
                <figure key={card.id} className="rounded-2xl border border-white/[0.07] bg-brand-card p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <TopicBadge tag={p.topicTag} />
                    <AiBadge card={card} />
                  </div>
                  <blockquote className="text-lg font-medium leading-snug text-white">&ldquo;{p.quote}&rdquo;</blockquote>
                  <figcaption className="mt-3 text-sm text-gray-400">
                    — {p.speakerName}, {p.speakerTitle}, {p.speakerOrg}
                    {p.context && <span className="mt-1 block text-xs text-gray-600">{p.context}</span>}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      )}

      {updatedAt && (
        <p className="text-2xs text-gray-600">
          Updated {new Date(updatedAt).toLocaleString()}.
        </p>
      )}
    </div>
  );
}
