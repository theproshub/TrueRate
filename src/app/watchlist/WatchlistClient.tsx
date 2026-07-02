'use client';

import { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { toggleWatchlistItem } from '@/app/analytics/watchlist-actions';
import { toggleSavedArticle } from '@/app/news/saved-actions';
import { formatValueWithUnit, formatPct, deltaColor, deltaArrow } from '@/lib/analytics/format';
import type { AnalyticsItem } from '@/lib/analytics/types';
import type { SavedRow } from '@/app/saved/SavedArticlesClient';
import StickySidebar from '@/components/StickySidebar';

/** A slim, serializable projection passed from the server component. */
export interface WatchRow {
  id: string;
  label: string;
  name: string;
  kind: 'currency' | 'commodity' | 'macro';
  unit: string;
  format: AnalyticsItem['format'];
  current: number | null;
  changePct: number | null;
}

interface Props {
  authed: boolean;
  watched: WatchRow[];
  /** Everything available to add, grouped for the picker. */
  options: WatchRow[];
  savedArticles: SavedRow[];
}

const KIND_LABEL: Record<WatchRow['kind'], string> = {
  currency: 'Currency',
  commodity: 'Commodities',
  macro: 'Macro',
};
const KIND_ORDER: WatchRow['kind'][] = ['currency', 'commodity', 'macro'];

function fmtChange(r: WatchRow) {
  return { text: formatPct(r.changePct), cls: deltaColor(r.changePct), arr: deltaArrow(r.changePct) };
}

function Row({
  r,
  onRemove,
  pending,
}: {
  r: WatchRow;
  onRemove: (id: string) => void;
  pending: boolean;
}) {
  const c = fmtChange(r);
  return (
    <div className="flex items-center justify-between py-4">
      <div className="min-w-0">
        <div className="text-md font-bold text-gray-900">{r.label}</div>
        <div className="truncate text-xs text-gray-500">{r.name}</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-mono text-xl font-bold tabular-nums text-gray-900">
            {formatValueWithUnit(r.current, r)}
            {r.kind === 'commodity' && r.unit && (
              <span className="ml-1 text-sm font-normal text-gray-500">{r.unit}</span>
            )}
          </div>
          <div className={`font-mono text-2xs font-semibold tabular-nums ${c.cls}`}>
            {c.arr && <span className="mr-0.5">{c.arr}</span>}
            {c.text}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(r.id)}
          disabled={pending}
          aria-label={`Remove ${r.label} from watchlist`}
          className="flex h-11 w-11 items-center justify-center rounded text-gray-600 transition-colors hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent disabled:opacity-40"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function AddModal({
  options,
  watchedIds,
  onToggle,
  onClose,
  pendingId,
}: {
  options: WatchRow[];
  watchedIds: Set<string>;
  onToggle: (id: string) => void;
  onClose: () => void;
  pendingId: string | null;
}) {
  const [tab, setTab] = useState<WatchRow['kind']>('currency');
  const list = options.filter((o) => o.kind === tab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Add to watchlist">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Add to Watchlist</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-500 transition-colors hover:text-gray-900">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 flex rounded-lg border border-gray-200 bg-white p-0.5">
          {KIND_ORDER.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-md py-1.5 text-sm font-semibold transition-colors ${
                tab === t ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-gray-600'
              }`}
            >
              {KIND_LABEL[t]}
            </button>
          ))}
        </div>

        <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
          {list.map((opt) => {
            const already = watchedIds.has(opt.id);
            const isPending = pendingId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onToggle(opt.id)}
                disabled={isPending}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white disabled:opacity-50"
              >
                <div className="min-w-0">
                  <div className="text-base font-semibold text-gray-900">{opt.label}</div>
                  <div className="truncate text-xs text-gray-500">{opt.name}</div>
                </div>
                {already ? (
                  <span className="text-2xs font-bold uppercase text-pos">Watching ✓</span>
                ) : (
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatDate(d: string | null): string {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function SavedArticleRow({
  row,
  onRemove,
  pending,
}: {
  row: SavedRow;
  onRemove: (row: SavedRow) => void;
  pending: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <Link href={`/news/${row.slug}`} className="group min-w-0 no-underline">
        {row.categoryLabel && (
          <div className="mb-1 text-2xs font-bold uppercase tracking-wide text-brand-accent-ink">
            {row.categoryLabel}
          </div>
        )}
        <div className="text-md font-bold leading-snug text-gray-900 transition-colors line-clamp-2 group-hover:text-brand-accent-ink">
          {row.title}
        </div>
        {row.dek && <div className="mt-0.5 truncate text-xs text-gray-500">{row.dek}</div>}
        <div className="mt-1 text-2xs text-gray-600">
          {row.publishedAt && <span>{formatDate(row.publishedAt)}</span>}
          {row.savedAt && <span> · Saved {formatDate(row.savedAt)}</span>}
        </div>
      </Link>
      <button
        type="button"
        onClick={() => onRemove(row)}
        disabled={pending}
        aria-label={`Remove "${row.title}" from saved articles`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded text-gray-600 transition-colors hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent disabled:opacity-40"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function WatchlistClient({ authed, watched, options, savedArticles }: Props) {
  const [items, setItems] = useState<WatchRow[]>(watched);
  const [saved, setSaved] = useState<SavedRow[]>(savedArticles);
  const [showModal, setShowModal] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pendingSavedId, setPendingSavedId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const optionById = useMemo(() => new Map(options.map((o) => [o.id, o])), [options]);
  const watchedIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);

  function toggle(id: string) {
    const wasWatching = watchedIds.has(id);
    setItems((prev) =>
      wasWatching ? prev.filter((i) => i.id !== id) : [...prev, optionById.get(id)!].filter(Boolean),
    );
    setPendingId(id);
    startTransition(async () => {
      const res = await toggleWatchlistItem(id);
      setPendingId(null);
      if (!res.ok) {
        setItems((prev) =>
          wasWatching ? [...prev, optionById.get(id)!].filter(Boolean) : prev.filter((i) => i.id !== id),
        );
      }
    });
  }

  function removeSaved(row: SavedRow) {
    const prev = saved;
    setPendingSavedId(row.id);
    setSaved((rs) => rs.filter((r) => r.id !== row.id));
    startTransition(async () => {
      const res = await toggleSavedArticle(row.articleId);
      setPendingSavedId(null);
      if (!res.ok || res.saved) setSaved(prev);
    });
  }

  // ── Signed out ──
  if (!authed) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
        <h2 className="mb-1 text-lg font-bold text-gray-900">Sign in to build your watchlist</h2>
        <p className="mb-6 text-base text-gray-500">
          Track exchange rates, commodities and macro indicators across devices. Your watchlist is saved to your account.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/sign-in?next=/watchlist"
            className="rounded-lg bg-brand-accent px-5 py-2.5 text-base font-semibold text-brand-accent-ink no-underline transition hover:brightness-90"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up?next=/watchlist"
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-base font-semibold text-gray-900 no-underline transition hover:bg-white"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  const grouped = KIND_ORDER.map((k) => ({ kind: k, rows: items.filter((i) => i.kind === k) })).filter((g) => g.rows.length > 0);
  const isEmpty = items.length === 0;

  return (
    <>
      {showModal && (
        <AddModal
          options={options}
          watchedIds={watchedIds}
          onToggle={toggle}
          onClose={() => setShowModal(false)}
          pendingId={pendingId}
        />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {isEmpty ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
              <h2 className="mb-1 text-lg font-bold text-gray-900">Your watchlist is empty</h2>
              <p className="mb-6 text-base text-gray-500">
                Add exchange rates, commodities, or macro indicators to track them here.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-2.5 text-base font-semibold text-brand-accent-ink transition hover:brightness-90"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add your first item
              </button>
            </div>
          ) : (
            grouped.map((g) => (
              <section key={g.kind}>
                <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                  {KIND_LABEL[g.kind]}
                </h2>
                <div className="divide-y divide-gray-200">
                  {g.rows.map((r) => (
                    <Row key={r.id} r={r} onRemove={toggle} pending={pendingId === r.id} />
                  ))}
                </div>
              </section>
            ))
          )}

          {/* ── Saved Articles ── */}
          <section>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
              Saved Articles
            </h2>
            {saved.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center">
                <p className="text-base text-gray-500">No saved articles yet.</p>
                <Link
                  href="/news"
                  className="mt-3 inline-flex items-center gap-1.5 text-base font-semibold text-brand-accent-ink no-underline transition hover:brightness-90"
                >
                  Browse news
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {saved.map((r) => (
                  <SavedArticleRow
                    key={r.id}
                    row={r}
                    onRemove={removeSaved}
                    pending={pendingSavedId === r.id}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="w-full lg:w-[300px] shrink-0">
          <StickySidebar>
            {!isEmpty && (
              <button
                onClick={() => setShowModal(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 bg-white py-4 text-base font-semibold text-gray-500 transition-colors hover:border-brand-accent/50 hover:text-brand-accent-ink"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add to watchlist
              </button>
            )}

            <section aria-label="Quick links" className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.12em] border-b border-gray-200 pb-3 mb-3">Quick Links</h3>
              <ul className="list-none p-0 m-0 divide-y divide-gray-200">
                {[
                  { href: '/analytics', label: 'Trends & Analytics' },
                  { href: '/markets', label: 'Markets' },
                  { href: '/economy', label: 'Economy Dashboard' },
                ].map((l) => (
                  <li key={l.href} className="py-2.5 first:pt-0 last:pb-0">
                    <Link href={l.href} className="flex items-center justify-between text-base text-gray-500 no-underline transition-colors hover:text-gray-900">
                      {l.label}
                      <span className="text-gray-600" aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </StickySidebar>
        </aside>
      </div>
    </>
  );
}
