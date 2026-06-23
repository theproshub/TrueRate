'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Factor } from '@supabase/supabase-js';

type Step = 'loading' | 'enrolled' | 'enroll' | 'verify' | 'done';

export default function SecurityPage() {
  const supabase = createClient();
  const [step, setStep] = useState<Step>('loading');
  const [factors, setFactors] = useState<Factor[]>([]);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [factorId, setFactorId] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFactors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadFactors() {
    const { data, error: err } = await supabase.auth.mfa.listFactors();
    if (err) {
      setError(err.message);
      setStep('enroll');
      return;
    }
    const verified = (data?.totp ?? []).filter((f) => f.status === 'verified');
    setFactors(verified);
    setStep(verified.length > 0 ? 'enrolled' : 'enroll');
  }

  async function startEnroll() {
    setError('');
    setBusy(true);

    // Clean up any stale unverified factors before enrolling
    const { data: existing } = await supabase.auth.mfa.listFactors();
    const unverified = (existing?.totp ?? []).filter((f) => (f.status as string) !== 'verified');
    for (const f of unverified) {
      await supabase.auth.mfa.unenroll({ factorId: f.id });
    }

    const { data, error: err } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'TrueRate Admin TOTP',
    });
    setBusy(false);
    if (err || !data) {
      setError(err?.message ?? 'Enrollment failed');
      return;
    }
    setFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setStep('verify');
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);

    const challenge = await supabase.auth.mfa.challenge({ factorId });
    if (challenge.error) {
      setError(challenge.error.message);
      setBusy(false);
      return;
    }

    const verification = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.data.id,
      code,
    });
    setBusy(false);

    if (verification.error) {
      setError(verification.error.message);
      return;
    }
    setStep('done');
  }

  async function unenroll(id: string) {
    if (!confirm('Remove this TOTP factor? You will need to re-enroll.')) return;
    setBusy(true);
    const { error: err } = await supabase.auth.mfa.unenroll({ factorId: id });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    await loadFactors();
  }

  return (
    <section aria-labelledby="security-heading" className="max-w-xl space-y-8">
      <header>
        <h1
          id="security-heading"
          className="text-2xl font-bold tracking-tight text-white"
        >
          Security
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Multi-factor authentication protects your admin account.
        </p>
      </header>

      {error && (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {step === 'loading' && (
        <div className="rounded-2xl border border-white/[0.07] bg-brand-card px-5 py-8 text-center text-sm text-gray-400">
          Loading MFA status…
        </div>
      )}

      {step === 'enrolled' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.07] bg-brand-card px-5 py-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pos/20 text-pos" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 4.5L6 12 2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-white">TOTP enabled</p>
                <p className="text-xs text-gray-400">
                  {factors.length} factor{factors.length !== 1 ? 's' : ''} enrolled
                </p>
              </div>
            </div>
            <ul className="mt-4 divide-y divide-white/[0.05]">
              {factors.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-4 py-2">
                  <span className="text-sm text-gray-300">
                    {f.friendly_name || 'TOTP factor'}
                  </span>
                  <button
                    type="button"
                    onClick={() => unenroll(f.id)}
                    disabled={busy}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent disabled:opacity-50"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {step === 'enroll' && (
        <div className="rounded-2xl border border-white/[0.07] bg-brand-card px-5 py-5">
          <p className="text-sm text-gray-300">
            No TOTP factor enrolled. Add one to secure your admin account.
          </p>
          <button
            type="button"
            onClick={startEnroll}
            disabled={busy}
            className="mt-4 rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-card disabled:opacity-50"
          >
            {busy ? 'Setting up…' : 'Set up TOTP'}
          </button>
        </div>
      )}

      {step === 'verify' && (
        <div className="rounded-2xl border border-white/[0.07] bg-brand-card px-5 py-5">
          <p className="mb-4 text-sm font-semibold text-white">
            Scan this QR code with your authenticator app
          </p>
          <div className="flex justify-center rounded-xl bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCode}
              alt="TOTP QR code — scan with your authenticator app"
              width={200}
              height={200}
            />
          </div>
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-300">
              Can&apos;t scan? Enter manually
            </summary>
            <code className="mt-2 block break-all rounded-lg bg-white/[0.05] px-3 py-2 text-xs text-gray-300">
              {secret}
            </code>
          </details>

          <form onSubmit={verify} className="mt-6">
            <label htmlFor="totp-code" className="block text-sm font-medium text-gray-300">
              Enter the 6-digit code
            </label>
            <div className="mt-2 flex gap-3">
              <input
                ref={inputRef}
                id="totp-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                pattern="\d{6}"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-32 rounded-xl border border-white/[0.12] bg-white/[0.05] px-4 py-2.5 text-center text-lg font-mono tracking-[0.3em] text-white placeholder-gray-600 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent"
                placeholder="000000"
              />
              <button
                type="submit"
                disabled={busy || code.length !== 6}
                className="rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-card disabled:opacity-50"
              >
                {busy ? 'Verifying…' : 'Verify'}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'done' && (
        <div className="rounded-2xl border border-pos/30 bg-pos/10 px-5 py-5 text-center">
          <span className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-pos/20 text-pos" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M13.5 4.5L6 12 2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <p className="text-sm font-semibold text-white">MFA enabled successfully</p>
          <p className="mt-1 text-xs text-gray-400">
            Your admin account is now protected with TOTP.
          </p>
        </div>
      )}
    </section>
  );
}
