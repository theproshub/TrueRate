'use client';

import { useId, useState } from 'react';

/**
 * "The Brief" newsletter signup — engagement + monetization-ready surface.
 * Real <form> with a labelled input, inline validation (aria-invalid +
 * aria-describedby), and a polite live confirmation. No network call yet —
 * this is a design-preview surface — but it never silently no-ops. Light.
 */
export default function NewsletterSignup() {
  const id = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return setError('Enter your email to subscribe.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return setError('Enter a valid email address.');
    setError('');
    setDone(true);
  }

  return (
    <div className="rounded-xl border border-gray-900/15 bg-gray-900 text-white p-6 h-full flex flex-col justify-center">
      <p className="text-2xs font-bold uppercase tracking-widest text-brand-accent mb-1">Newsletter</p>
      <h3 className="text-xl font-bold tracking-tight">The TrueRate Sports Brief</h3>
      <p className="mt-1.5 text-sm text-gray-300 leading-relaxed">
        The money behind Liberian sport — deals, club finances and governance, in your inbox every Monday.
      </p>

      {done ? (
        <p role="status" className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-accent">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.79a1 1 0 0 1 1.4 0Z" clipRule="evenodd" /></svg>
          You&apos;re subscribed — watch your inbox Monday.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-4">
          <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id={`${id}-email`}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-err` : undefined}
              placeholder="you@example.com"
              className="min-h-[44px] flex-1 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            />
            <button
              type="submit"
              className="min-h-[44px] rounded-lg bg-brand-accent px-5 text-sm font-bold text-brand-dark hover:bg-brand-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              Subscribe
            </button>
          </div>
          {error && (
            <p id={`${id}-err`} role="alert" className="mt-2 text-sm text-red-300">{error}</p>
          )}
        </form>
      )}
    </div>
  );
}
