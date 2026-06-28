'use client';

import { useId, useState } from 'react';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-1';

export default function NewsletterInline() {
  const id = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) { setError('Enter your email.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setError('Enter a valid email address.'); return; }
    setError('');
    setDone(true);
  }

  if (done) {
    return (
      <div className="py-5 border-t border-[#E5E5E0]">
        <p role="status" className="text-[13px] font-semibold text-[#0A0A0A]">
          You&apos;re subscribed to Business Brief.
        </p>
      </div>
    );
  }

  return (
    <div className="py-5 border-t border-[#E5E5E0]">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-[#0A0A0A] mb-0.5">
            Business Brief
          </p>
          <p className="text-[12px] text-[#888] font-montserrat">
            Liberia&apos;s business and trade stories, weekly.
          </p>
        </div>
        <form onSubmit={onSubmit} noValidate className="flex gap-2 sm:w-auto w-full">
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
            className={`flex-1 sm:w-[220px] border border-[#D5D5D3] bg-white px-3 py-2 text-[13px] text-[#0A0A0A] placeholder:text-[#BBB] outline-none focus:border-[#0A0A0A] transition-colors rounded-sm ${focusRing}`}
          />
          <button
            type="submit"
            className={`px-4 py-2 bg-[#0A0A0A] text-white text-[12px] font-bold tracking-[0.04em] hover:bg-[#333] transition-colors whitespace-nowrap rounded-sm ${focusRing}`}
          >
            Sign up
          </button>
        </form>
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-[12px] text-[#D91400]">
          {error}
        </p>
      )}
    </div>
  );
}
