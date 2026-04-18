'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-[720px] px-4 py-24 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-400 mb-4">Something went wrong</p>
      <h1 className="text-[32px] sm:text-[44px] font-black leading-tight text-white mb-4">
        We hit an error loading this page.
      </h1>
      <p className="text-[15px] text-gray-400 leading-relaxed mb-8 max-w-[520px] mx-auto">
        Try again, or head back to the homepage. If this keeps happening, please let us know from the feedback page.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-brand-accent px-5 py-2.5 text-[13px] font-bold text-brand-dark hover:bg-[#a8d42a] transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-white/[0.06] transition-colors no-underline"
        >
          Back to homepage
        </Link>
        <Link
          href="/feedback"
          className="rounded-lg border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-white/[0.06] transition-colors no-underline"
        >
          Report this
        </Link>
      </div>
      {error.digest && (
        <p className="mt-10 text-[11px] text-gray-600 tabular-nums">Error ID: {error.digest}</p>
      )}
    </main>
  );
}
