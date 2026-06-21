'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

function SignedOutButtons({ isLight }: { isLight: boolean }) {
  return (
    <>
      <Link
        href="/sign-in"
        className={`inline-flex items-center min-h-[44px] rounded-lg border px-3 py-1.5 text-sm font-semibold transition no-underline whitespace-nowrap ${
          isLight
            ? 'border-gray-300 text-gray-700 hover:bg-gray-100'
            : 'border-white/20 text-white hover:bg-white/[0.06]'
        }`}
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className={`hidden sm:inline-flex items-center min-h-[44px] rounded-lg px-5 py-2 text-base font-semibold transition no-underline whitespace-nowrap ${
          isLight
            ? 'bg-gray-900 text-white hover:bg-gray-700'
            : 'bg-white text-brand-ink shadow-lg shadow-white/10 hover:brightness-110'
        }`}
      >
        Sign up
      </Link>
    </>
  );
}

function SignedInButtons({
  user,
  isLight,
  onSignOut,
}: {
  user: User;
  isLight: boolean;
  onSignOut: () => Promise<void>;
}) {
  const initial = (user.email ?? '?').slice(0, 1).toUpperCase();
  return (
    <>
      <Link
        href="/saved"
        className={`hidden sm:flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
          isLight
            ? 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
        }`}
        aria-label="Saved articles"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </Link>
      <span
        className={`hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ring-2 ${
          isLight
            ? 'bg-gray-200 text-gray-700 ring-gray-300'
            : 'bg-white/10 text-white ring-white/10'
        }`}
        title={user.email ?? ''}
        aria-hidden="true"
      >
        {initial}
      </span>
      <button
        type="button"
        onClick={() => void onSignOut()}
        className={`inline-flex items-center min-h-[44px] rounded-lg border px-3 py-1.5 text-sm font-semibold transition whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
          isLight
            ? 'border-gray-300 text-gray-700 hover:bg-gray-100'
            : 'border-white/20 text-white hover:bg-white/[0.06]'
        }`}
      >
        Sign out
      </button>
    </>
  );
}

export default function HeaderAuthButtons() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user);
      setLoaded(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const isLight =
    pathname.startsWith('/news') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/help');

  if (!loaded) {
    return <div aria-hidden="true" className="h-11 w-[140px]" />;
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return user
    ? <SignedInButtons user={user} isLight={isLight} onSignOut={handleSignOut} />
    : <SignedOutButtons isLight={isLight} />;
}
