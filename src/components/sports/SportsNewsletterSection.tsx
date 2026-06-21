'use client';

import { useId, useState } from 'react';

export default function SportsNewsletterSection() {
  const id = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) { setError('Enter your email to subscribe.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setError('Enter a valid email address.'); return; }
    setError('');
    setDone(true);
  }

  return (
    <section aria-labelledby={`${id}-heading`} className="border-t-2 border-gray-900 pt-4">
      <h2 id={`${id}-heading`} className="text-sm font-black uppercase tracking-wide text-gray-900 mb-1">Sports Business Brief</h2>
      <p className="text-sm text-gray-500 mb-3">The money behind Liberian sport, in your inbox every week.</p>
      {done ? (
        <p role="status" className="flex items-center gap-2 text-sm font-semibold text-brand-accent-ink">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.79a1 1 0 0 1 1.4 0Z" clipRule="evenodd" /></svg>
          You&apos;re subscribed — watch your inbox Monday.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate aria-label="Sign up for the Sports Business Brief">
          <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
          <input
            id={`${id}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-err` : undefined}
            placeholder="Email address"
            className="w-full bg-transparent border-b border-gray-300 px-0 py-2 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 transition-colors mb-3"
          />
          {error && <p id={`${id}-err`} role="alert" className="text-sm text-red-500 mb-2">{error}</p>}
          <button type="submit" className="w-full rounded-md bg-gray-900 py-2.5 text-base font-bold text-white hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">
            Sign up free
          </button>
        </form>
      )}
    </section>
  );
}
