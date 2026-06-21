'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back to TrueRate
          </h1>
          <p className="mt-2 text-md text-gray-400">
            Liberia&apos;s financial data platform
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-white/[0.07] bg-brand-card p-6 shadow-2xl"
          noValidate
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(error) || undefined}
                className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-white placeholder:text-gray-500 focus-visible:border-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error) || undefined}
                aria-describedby={error ? 'signin-error' : undefined}
                className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-white placeholder:text-gray-500 focus-visible:border-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              />
            </div>
            {error && (
              <p id="signin-error" role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand-accent px-4 py-2.5 font-semibold text-brand-ink transition-colors hover:bg-brand-accent-hover disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
          <p className="mt-6 text-center text-sm text-gray-400">
            New to TrueRate?{' '}
            <Link href={next !== '/' ? `/sign-up?next=${encodeURIComponent(next)}` : '/sign-up'} className="text-brand-accent hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
