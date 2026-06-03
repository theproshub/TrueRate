'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          typeof window !== 'undefined'
            ? `${window.location.origin}/auth/callback`
            : undefined,
      },
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push('/');
      router.refresh();
      return;
    }
    setInfo('Check your email for a confirmation link to finish signing up.');
  }

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">Join TrueRate</h1>
          <p className="mt-2 text-md text-gray-400">
            Track LRD rates, save indicators, and get market alerts
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['Watchlists', 'Rate Alerts', 'Economic Data', 'Liberia-focused'].map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-sm font-medium text-gray-400"
              >
                {pill}
              </span>
            ))}
          </div>
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
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error) || undefined}
                aria-describedby={error ? 'signup-error' : 'signup-password-hint'}
                className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-white placeholder:text-gray-500 focus-visible:border-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              />
              <p id="signup-password-hint" className="mt-1 text-xs text-gray-500">
                Minimum 8 characters.
              </p>
            </div>
            {error && (
              <p id="signup-error" role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
            {info && (
              <p role="status" className="text-sm text-pos">
                {info}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand-accent px-4 py-2.5 font-semibold text-brand-ink transition-colors hover:bg-brand-accent-hover disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              {submitting ? 'Creating account…' : 'Sign up'}
            </button>
          </div>
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-brand-accent hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
