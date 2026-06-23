import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/admin';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <div className="min-h-screen bg-brand-dark">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-container items-center gap-3 sm:gap-6 px-4 py-3">
          <Link
            href="/admin"
            className="text-base font-bold tracking-tight text-gray-900 no-underline shrink-0"
          >
            TrueRate Admin
          </Link>
          <nav aria-label="Admin navigation" className="flex gap-3 sm:gap-4 text-sm overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link
              href="/admin/articles"
              className="whitespace-nowrap text-gray-500 transition-colors hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
            >
              Articles
            </Link>
            <Link
              href="/admin/authors"
              className="whitespace-nowrap text-gray-500 transition-colors hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
            >
              Authors
            </Link>
            <Link
              href="/admin/categories"
              className="whitespace-nowrap text-gray-500 transition-colors hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
            >
              Categories
            </Link>
            <Link
              href="/admin/users"
              className="whitespace-nowrap text-gray-500 transition-colors hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
            >
              Users
            </Link>
            <Link
              href="/admin/feed"
              className="whitespace-nowrap text-gray-500 transition-colors hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
            >
              Feed
            </Link>
            <Link
              href="/admin/security"
              className="whitespace-nowrap text-gray-500 transition-colors hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
            >
              Security
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-4 text-sm shrink-0">
            <span className="text-gray-500 hidden sm:inline">
              {profile.display_name ?? 'Admin'}
            </span>
            <Link
              href="/"
              className="whitespace-nowrap text-gray-500 transition-colors hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-container px-4 py-8">{children}</main>
    </div>
  );
}
