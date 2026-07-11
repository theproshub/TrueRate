'use client';

import { useId, useState } from 'react';
import { subscribeNewsletter } from '@/lib/newsletter/actions';

export default function NewsletterWidget({ title = 'TrueRate Daily Brief', description = 'Liberia business & economy, delivered every morning.' }: { title?: string; description?: string } = {}) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) { setError('Enter your email to subscribe.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setError('Enter a valid email address.'); return; }
    setError('');
    setSubmitting(true);
    const result = await subscribeNewsletter({ email: value, source: 'daily_brief' });
    setSubmitting(false);
    if (result.ok) setDone(true);
    else setError(result.error);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      {done ? (
        <p role="status" className="flex items-center gap-2 text-sm font-semibold text-brand-accent-ink">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.79a1 1 0 0 1 1.4 0Z" clipRule="evenodd" /></svg>
          You&apos;re subscribed!
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
          <input
            id={`${id}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-err` : undefined}
            placeholder="Email address"
            className="w-full rounded-lg bg-gray-100 border border-gray-200 px-3 py-2.5 text-base text-gray-900 placeholder:text-gray-500 outline-none focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-brand-accent-ink transition-colors mb-2"
          />
          {error && <p id={`${id}-err`} role="alert" className="text-sm text-neg mb-2">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
          >
            {submitting ? 'Signing up…' : 'Sign up free'}
          </button>
        </form>
      )}
    </div>
  );
}
