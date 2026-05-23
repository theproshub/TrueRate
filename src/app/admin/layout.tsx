import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/admin';

export const metadata = {
  title: 'Admin — TrueRate',
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
      <header className="border-b border-white/[0.07] bg-brand-card">
        <div className="mx-auto flex max-w-[1320px] items-center gap-6 px-4 py-3">
          <Link
            href="/admin"
            className="text-base font-black tracking-tight text-white no-underline"
          >
            TrueRate Admin
          </Link>
          <nav aria-label="Admin navigation" className="flex gap-4 text-sm">
            <Link
              href="/admin/articles"
              className="text-gray-400 transition-colors hover:text-white focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              Articles
            </Link>
            <Link
              href="/admin/authors"
              className="text-gray-400 transition-colors hover:text-white focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              Authors
            </Link>
            <Link
              href="/admin/categories"
              className="text-gray-400 transition-colors hover:text-white focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              Categories
            </Link>
            <Link
              href="/admin/users"
              className="text-gray-400 transition-colors hover:text-white focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              Users
            </Link>
            <Link
              href="/admin/feed"
              className="text-gray-400 transition-colors hover:text-white focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              Feed
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <span className="text-gray-500">
              {profile.display_name ?? 'Admin'}
            </span>
            <Link
              href="/"
              className="text-gray-400 transition-colors hover:text-white focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1320px] px-4 py-8">{children}</main>
    </div>
  );
}
