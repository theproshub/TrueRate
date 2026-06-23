import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[720px] px-4 py-12 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-accent-ink mb-4">404 — Page Not Found</p>
      <h1 className="text-3xl sm:text-3xl font-bold leading-tight text-gray-900 mb-4">
        We couldn&apos;t find that page.
      </h1>
      <p className="text-md text-gray-500 leading-relaxed mb-8 max-w-[520px] mx-auto">
        The page may have been moved, renamed, or never existed. Try one of these instead:
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="rounded-lg bg-brand-accent px-5 py-2.5 text-base font-bold text-brand-accent-ink hover:bg-brand-accent-hover transition-colors no-underline">
          Homepage
        </Link>
        <Link href="/news" className="rounded-lg border border-gray-200 px-5 py-2.5 text-base font-semibold text-gray-900 hover:bg-white transition-colors no-underline">
          Latest news
        </Link>
        <Link href="/economy" className="rounded-lg border border-gray-200 px-5 py-2.5 text-base font-semibold text-gray-900 hover:bg-white transition-colors no-underline">
          Economy
        </Link>
        <Link href="/markets" className="rounded-lg border border-gray-200 px-5 py-2.5 text-base font-semibold text-gray-900 hover:bg-white transition-colors no-underline">
          Live markets
        </Link>
      </div>
    </main>
  );
}
