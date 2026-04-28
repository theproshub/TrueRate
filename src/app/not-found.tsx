import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[720px] px-4 py-24 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-4">404 — Page Not Found</p>
      <h1 className="text-[32px] sm:text-[32px] font-black leading-tight text-white mb-4">
        We couldn&apos;t find that page.
      </h1>
      <p className="text-[14px] text-gray-400 leading-relaxed mb-8 max-w-[520px] mx-auto">
        The page may have been moved, renamed, or never existed. Try one of these instead:
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="rounded-lg bg-brand-accent px-5 py-2.5 text-[13px] font-bold text-brand-dark hover:bg-[#a8d42a] transition-colors no-underline">
          Homepage
        </Link>
        <Link href="/news" className="rounded-lg border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-white/[0.06] transition-colors no-underline">
          Latest news
        </Link>
        <Link href="/economy" className="rounded-lg border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-white/[0.06] transition-colors no-underline">
          Economy
        </Link>
        <Link href="/markets" className="rounded-lg border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-white/[0.06] transition-colors no-underline">
          Live markets
        </Link>
      </div>
    </main>
  );
}
