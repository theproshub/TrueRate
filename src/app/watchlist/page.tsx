/**
 * /watchlist — protected page (middleware enforces auth).
 *
 * Server Component: reads the signed-in user from Clerk,
 * renders their watchlist. Items are stored in localStorage
 * on the client for now (no DB yet) — the server sets up the
 * shell and the client component manages the list.
 */

import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import WatchlistClient from './WatchlistClient';

export default async function WatchlistPage() {
  const user = await currentUser();

  // Middleware already handles unauthenticated requests,
  // but this is an explicit server-side guard.
  if (!user) redirect('/sign-in');

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-8">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-[13px] text-gray-500">
            Welcome back, {user.firstName ?? user.emailAddresses[0]?.emailAddress?.split('@')[0] ?? 'there'} ·
            Track rates, indicators, and commodities
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
          Live data
        </div>
      </div>

      {/* Client component handles localStorage state */}
      <WatchlistClient />
    </main>
  );
}
