'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { toggleSavedArticle } from '@/app/news/saved-actions';

/** Slim, serializable projection passed from the server component. */
export interface SavedRow {
  id: string;
  articleId: string;
  slug: string;
  title: string;
  dek: string | null;
  categoryLabel: string | null;
  publishedAt: string | null;
  savedAt: string | null;
}

interface Props {
  authed: boolean;
  initialRows: SavedRow[];
}

function timeAgo(d: string | null): string {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export default function SavedArticlesClient({ authed, initialRows }: Props) {
  const [rows, setRows] = useState<SavedRow[]>(initialRows);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function remove(row: SavedRow) {
    const prev = rows;
    setPendingId(row.id);
    setRows((rs) => rs.filter((r) => r.id !== row.id)); // optimistic
    startTransition(async () => {
      const res = await toggleSavedArticle(row.articleId);
      setPendingId(null);
      // Roll back if the call failed, or if it somehow re-saved the article.
      if (!res.ok || res.saved) setRows(prev);
    });
  }

  // ── Signed out ──
  if (!authed) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.02] p-8 text-center">
        <h2 className="mb-1 text-lg font-bold text-white">Sign in to see your saved articles</h2>
        <p className="mb-6 text-base text-gray-500">
          Save articles to read later. Your saved list is tied to your account and syncs across devices.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/sign-in?next=/saved"
            className="rounded-lg bg-brand-accent px-5 py-2.5 text-base font-semibold text-brand-dark no-underline transition hover:brightness-90"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up?next=/saved"
            className="rounded-lg border border-white/20 px-5 py-2.5 text-base font-semibold text-white no-underline transition hover:bg-white/[0.06]"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  // ── Empty ──
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.02] p-8 text-center">
        <h2 className="mb-1 text-lg font-bold text-white">No saved articles yet</h2>
        <p className="mb-6 text-base text-gray-500">
          Tap “Save” on any article to keep it here for later.
        </p>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-2.5 text-base font-semibold text-brand-dark no-underline transition hover:brightness-90"
        >
          Browse news
        </Link>
      </div>
    );
  }

  // ── List ──
  return (
    <ul className="divide-y divide-white/[0.05]">
      {rows.map((r) => (
        <li key={r.id} className="flex items-start justify-between gap-4 py-4">
          <Link href={`/news/${r.slug}`} className="group min-w-0 no-underline">
            {r.categoryLabel && (
              <div className="mb-1 text-2xs font-bold uppercase tracking-wide text-brand-accent">
                {r.categoryLabel}
              </div>
            )}
            <div className="text-md font-bold leading-snug text-white transition-colors line-clamp-2 group-hover:text-gray-300">
              {r.title}
            </div>
            {r.dek && <div className="mt-0.5 truncate text-xs text-gray-500">{r.dek}</div>}
            <div className="mt-1 text-2xs text-gray-600">
              {r.publishedAt && <span>{timeAgo(r.publishedAt)}</span>}
              {r.savedAt && <span> · Saved {timeAgo(r.savedAt)}</span>}
            </div>
          </Link>

          <button
            type="button"
            onClick={() => remove(r)}
            disabled={pendingId === r.id}
            aria-label={`Remove “${r.title}” from saved articles`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded text-gray-600 transition-colors hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent disabled:opacity-40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}
