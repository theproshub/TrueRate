'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-[720px] px-4 py-12 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400 mb-4">Something went wrong</p>
      <h1 className="text-3xl sm:text-3xl font-bold leading-tight text-gray-900 mb-4">
        We hit an error loading this page.
      </h1>
      <p className="text-md text-gray-500 leading-relaxed mb-8 max-w-[520px] mx-auto">
        Try again, or head back to the homepage. If this keeps happening, please let us know from the feedback page.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-brand-accent px-5 py-2.5 text-base font-bold text-brand-dark hover:bg-brand-accent-hover transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-base font-semibold text-gray-900 hover:bg-white transition-colors no-underline"
        >
          Back to homepage
        </Link>
        <Link
          href="/feedback"
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-base font-semibold text-gray-900 hover:bg-white transition-colors no-underline"
        >
          Report this
        </Link>
      </div>
      {error.digest && (
        <p className="mt-10 text-xs text-gray-600 tabular-nums">Error ID: {error.digest}</p>
      )}
    </main>
  );
}
