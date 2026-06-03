import { feedAdminClient } from '@/lib/feed/db';
import { publishCard, unpublishCard, deleteCard } from './_actions';

interface PageProps {
  searchParams: Promise<{ ok?: string; error?: string }>;
}

type CardType = 'breaking' | 'article' | 'quote' | 'big_stat' | 'markets';

interface CardRow {
  id: string;
  type: CardType;
  category: string | null;
  payload: Record<string, unknown>;
  status: 'draft' | 'published' | 'expired';
  is_ai_generated: boolean;
  source_note: string | null;
  published_at: string | null;
  created_at: string;
}

const OK_NOTICE: Record<string, string> = {
  published: 'Card published — now live on the feed.',
  unpublished: 'Card moved back to drafts.',
  deleted: 'Card deleted.',
};

const TYPE_LABEL: Record<CardType, string> = {
  breaking: 'Breaking',
  article: 'Article',
  quote: 'Quote',
  big_stat: 'Big Stat',
  markets: 'Markets',
};

function CardPreview({ card }: { card: CardRow }) {
  const p = card.payload;
  switch (card.type) {
    case 'breaking':
      return (
        <>
          <p className="font-bold text-white">{String(p.headline ?? '')}</p>
          <p className="mt-1 text-sm text-gray-400">{String(p.summary ?? '')}</p>
        </>
      );
    case 'article':
      return (
        <>
          <p className="font-bold text-white">{String(p.headline ?? '')}</p>
          <p className="mt-1 text-sm text-gray-400">{String(p.deck ?? '')}</p>
          <p className="mt-1 text-xs text-gray-500">
            {String(p.readMinutes ?? '?')} min · {Array.isArray(p.tags) ? p.tags.join(', ') : ''}
          </p>
        </>
      );
    case 'quote':
      return (
        <>
          <p className="font-medium italic text-white">&ldquo;{String(p.quote ?? '')}&rdquo;</p>
          <p className="mt-1 text-sm text-gray-400">
            — {String(p.speakerName ?? '')}, {String(p.speakerTitle ?? '')}, {String(p.speakerOrg ?? '')}
          </p>
        </>
      );
    case 'big_stat':
      return (
        <>
          <p className="text-2xl font-black text-white tabular-nums">{String(p.value ?? '')}</p>
          <p className="mt-1 text-sm text-gray-400">{String(p.descriptor ?? '')} · {String(p.context ?? '')}</p>
        </>
      );
    case 'markets': {
      const tickers = Array.isArray(p.tickers) ? (p.tickers as Array<{ symbol: string }>) : [];
      return (
        <p className="text-sm text-gray-300">
          Markets snapshot — {tickers.length} tickers: {tickers.map((t) => t.symbol).join(', ')}
        </p>
      );
    }
  }
}

export default async function AdminFeedPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const supabase = feedAdminClient();

  const { data, error } = await supabase
    .from('content_cards')
    .select('id, type, category, payload, status, is_ai_generated, source_note, published_at, created_at')
    .in('status', ['draft', 'published'])
    .order('created_at', { ascending: false })
    .limit(100);

  // content_cards is created by migration 008 — surface a clear message if it
  // isn't applied yet rather than a raw Postgres error.
  if (error) {
    return (
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-white">Content Feed</h1>
        <div role="alert" className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-6 text-sm text-amber-200">
          Couldn&apos;t load feed cards: {error.message}
          <p className="mt-2 text-amber-300/80">
            If this says the relation doesn&apos;t exist, apply{' '}
            <code className="text-amber-100">supabase/migrations/008_content_feed.sql</code> in the Supabase SQL editor.
          </p>
        </div>
      </section>
    );
  }

  const cards = (data ?? []) as unknown as CardRow[];
  const drafts = cards.filter((c) => c.status === 'draft');
  const published = cards.filter((c) => c.status === 'published');

  return (
    <section aria-labelledby="feed-heading">
      {sp.ok && OK_NOTICE[sp.ok] && (
        <div role="status" aria-live="polite" className="mb-4 rounded-lg border border-pos/30 bg-pos/[0.06] p-3 text-sm text-pos">
          {OK_NOTICE[sp.ok]}
        </div>
      )}
      {sp.error && (
        <div role="alert" aria-live="assertive" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/[0.06] p-3 text-sm text-red-300">
          {sp.error}
        </div>
      )}

      <header className="mb-6">
        <h1 id="feed-heading" className="text-2xl font-bold tracking-tight text-white">Content Feed</h1>
        <p className="mt-1 text-sm text-gray-400">
          Review AI-drafted cards before they go live. {drafts.length} pending · {published.length} live.
        </p>
      </header>

      {/* Draft review queue */}
      <h2 className="mb-3 text-2xs font-bold uppercase tracking-[0.12em] text-gray-500">Pending review</h2>
      {drafts.length === 0 ? (
        <div className="mb-8 rounded-2xl border border-white/[0.07] bg-brand-card p-8 text-center text-sm text-gray-400">
          No drafts awaiting review. The daily cron adds AI-drafted cards here.
        </div>
      ) : (
        <ul className="mb-10 space-y-3">
          {drafts.map((card) => (
            <li key={card.id} className="rounded-2xl border border-white/[0.07] bg-brand-card p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/[0.1] px-2 py-0.5 text-2xs font-bold uppercase tracking-wide text-gray-300">
                  {TYPE_LABEL[card.type]}
                </span>
                {card.category && <span className="text-2xs font-bold uppercase tracking-wide text-gray-500">{card.category}</span>}
                {card.is_ai_generated && (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/[0.08] px-2 py-0.5 text-2xs font-bold uppercase tracking-wide text-amber-400">
                    AI draft
                  </span>
                )}
              </div>
              <CardPreview card={card} />
              {card.source_note && <p className="mt-2 text-xs text-gray-600">Source: {card.source_note}</p>}
              <div className="mt-4 flex items-center gap-2">
                <form action={publishCard.bind(null, card.id)}>
                  <button type="submit" className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
                    Publish
                  </button>
                </form>
                <form action={deleteCard.bind(null, card.id)}>
                  <button type="submit" className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Currently live */}
      <h2 className="mb-3 text-2xs font-bold uppercase tracking-[0.12em] text-gray-500">Live on feed</h2>
      {published.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-brand-card p-8 text-center text-sm text-gray-400">
          Nothing published yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {published.map((card) => (
            <li key={card.id} className="rounded-2xl border border-white/[0.07] bg-brand-card p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-pos/30 bg-pos/[0.08] px-2 py-0.5 text-2xs font-bold uppercase tracking-wide text-pos">
                  {TYPE_LABEL[card.type]} · Live
                </span>
                {card.is_ai_generated && (
                  <span className="text-2xs font-bold uppercase tracking-wide text-amber-400/70">AI</span>
                )}
              </div>
              <CardPreview card={card} />
              <div className="mt-4 flex items-center gap-2">
                <form action={unpublishCard.bind(null, card.id)}>
                  <button type="submit" className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
                    Unpublish
                  </button>
                </form>
                <form action={deleteCard.bind(null, card.id)}>
                  <button type="submit" className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
