import Link from 'next/link';
import { Heading, Text } from '@/components/ui';

export default function ArticleNotFound() {
  return (
    <div className="bg-brand-surface min-h-screen">
      <main className="mx-auto max-w-[720px] px-4 py-12 text-center">
        <Text variant="meta" className="font-bold uppercase tracking-[0.18em] text-gray-500 mb-4">404 — Article Not Found</Text>
        <Heading level={1} className="font-bold leading-tight text-gray-900 mb-4">
          This article doesn&apos;t exist.
        </Heading>
        <Text className="text-md text-gray-500 leading-relaxed mb-8 max-w-[480px] mx-auto">
          The story you&apos;re looking for may have been removed or the link might be wrong. Browse our latest coverage instead.
        </Text>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/news" className="rounded-lg bg-[#1E1E1E] px-5 py-2.5 text-base font-bold text-white hover:bg-[#2a2a2a] transition-colors no-underline">
            All news
          </Link>
          <Link href="/" className="rounded-lg border border-gray-300 px-5 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-100 transition-colors no-underline">
            Homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
