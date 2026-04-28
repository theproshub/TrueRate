import Link from 'next/link';

export default function ArticleNotFound() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <main className="mx-auto max-w-[720px] px-4 py-24 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-4">404 — Article Not Found</p>
        <h1 className="text-[32px] sm:text-[32px] font-black leading-tight text-gray-900 mb-4">
          This article doesn&apos;t exist.
        </h1>
        <p className="text-[14px] text-gray-500 leading-relaxed mb-8 max-w-[480px] mx-auto">
          The story you&apos;re looking for may have been removed or the link might be wrong. Browse our latest coverage instead.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/news" className="rounded-lg bg-gray-900 px-5 py-2.5 text-[13px] font-bold text-white hover:bg-black transition-colors no-underline">
            All news
          </Link>
          <Link href="/" className="rounded-lg border border-gray-300 px-5 py-2.5 text-[13px] font-semibold text-gray-900 hover:bg-gray-100 transition-colors no-underline">
            Homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
