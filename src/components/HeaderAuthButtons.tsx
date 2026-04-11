'use client';

/**
 * HeaderAuthButtons — conditionally renders Clerk auth UI or plain static links.
 *
 * When NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is a real key → Clerk components.
 * When the key is missing or still a placeholder → plain Sign in / Subscribe links.
 * This lets the app run fully without Clerk configured.
 */

import Link from 'next/link';
import { Show, UserButton } from '@clerk/nextjs';

const isClerkConfigured =
  (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '').startsWith('pk_') &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('replace_me');

/* ── Static fallback (no Clerk keys) ── */
function StaticAuthButtons() {
  return (
    <>
      <Link
        href="/sign-in"
        className="rounded-lg border border-white/20 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-white/[0.06] no-underline whitespace-nowrap"
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="hidden sm:block rounded-lg bg-white px-5 py-2 text-[13px] font-semibold text-[#0a0a0d] shadow-lg shadow-white/10 transition hover:brightness-110 no-underline"
      >
        Subscribe
      </Link>
    </>
  );
}

/* ── Live Clerk auth buttons ── */
function ClerkAuthButtons() {
  return (
    <>
      {/* Watchlist icon — signed-in only */}
      <Show when="signed-in">
        <Link
          href="/watchlist"
          className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          title="My Watchlist"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </Link>
      </Show>

      {/* Signed-out: Sign in + Subscribe */}
      <Show when="signed-out">
        <Link
          href="/sign-in"
          className="rounded-lg border border-white/20 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-white/[0.06] no-underline whitespace-nowrap"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="hidden sm:block rounded-lg bg-white px-5 py-2 text-[13px] font-semibold text-[#0a0a0d] shadow-lg shadow-white/10 transition hover:brightness-110 no-underline"
        >
          Subscribe
        </Link>
      </Show>

      {/* Signed-in: Clerk avatar */}
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-8 w-8 rounded-full ring-2 ring-white/10 hover:ring-white/30 transition-all',
              userButtonPopoverCard: 'bg-brand-card border border-white/[0.08] shadow-2xl',
              userButtonPopoverActionButton: 'text-gray-300 hover:text-white hover:bg-white/[0.05]',
              userButtonPopoverActionButtonText: 'text-[13px]',
              userButtonPopoverFooter: 'hidden',
            },
          }}
          userProfileUrl="/watchlist"
          userProfileMode="navigation"
        />
      </Show>
    </>
  );
}

export default function HeaderAuthButtons() {
  return isClerkConfigured ? <ClerkAuthButtons /> : <StaticAuthButtons />;
}
