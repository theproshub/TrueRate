'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleSavedArticle } from '@/app/news/saved-actions';

interface Props {
  /** articles.id — the FK target for saved_articles. */
  articleId: string;
  /** Server-resolved initial state for the signed-in user. */
  initialSaved: boolean;
  /** Whether a session exists; signed-out clicks route to sign-in. */
  authed: boolean;
  /** Where to return after sign-in (e.g. the article path). */
  returnTo: string;
}

/**
 * Save / unsave toggle for a DB-backed article. Styled for LIGHT surfaces
 * (article pages) using brand-accent-ink, which meets AA on white.
 *
 * Accessibility: 44px min target, visible focus ring, aria-pressed reflects
 * saved state, the icon fills (outline → solid) so colour is not the only
 * signal, and an aria-live region announces state changes to screen readers.
 */
export default function SaveArticleButton({ articleId, initialSaved, authed, returnTo }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!authed) {
      router.push(`/sign-in?next=${encodeURIComponent(returnTo)}`);
      return;
    }
    const next = !saved;
    setSaved(next); // optimistic
    setFailed(false);
    startTransition(async () => {
      const res = await toggleSavedArticle(articleId);
      if (!res.ok) {
        setSaved(!next); // roll back
        setFailed(true);
      } else {
        setSaved(res.saved);
      }
    });
  }

  return (
    <div className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-pressed={authed ? saved : undefined}
        aria-label={saved ? 'Remove this article from your saved articles' : 'Save this article'}
        className={[
          'inline-flex items-center gap-2 rounded-lg border px-4 py-2 min-h-[44px]',
          'text-sm font-semibold transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          saved
            ? 'border-brand-accent-ink bg-brand-accent-ink/10 text-brand-accent-ink'
            : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900',
        ].join(' ')}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-4-7 4V5z" />
        </svg>
        {saved ? 'Saved' : 'Save'}
      </button>

      <span role="status" aria-live="polite" className="sr-only">
        {saved ? 'Article saved to your account.' : 'Article removed from saved.'}
      </span>

      {failed && (
        <span className="mt-1 text-xs text-red-600">Couldn’t update — please try again.</span>
      )}
    </div>
  );
}
