'use client';

import { useId, useState } from 'react';
import { submitFeedback } from './_actions';

const focusRing =
  'focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none';

const TYPE_OPTIONS = [
  { value: 'general', label: 'General feedback' },
  { value: 'data_error', label: 'Data error' },
  { value: 'feature_request', label: 'Feature request' },
  { value: 'bug_report', label: 'Bug report' },
  { value: 'content_issue', label: 'Content issue' },
];

export default function FeedbackForm() {
  const typeId = useId();
  const emailId = useId();
  const messageId = useId();
  const messageErrorId = useId();
  const statusId = useId();

  const [type, setType] = useState('general');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Inline validation — never no-op silently on an empty submission.
    if (message.trim().length < 5) {
      setMessageError('Please enter a message (at least 5 characters).');
      document.getElementById(messageId)?.focus();
      return;
    }
    setMessageError(null);
    setStatus('submitting');
    setStatusMessage('');

    const result = await submitFeedback({ type, email, message });

    if (result.ok) {
      setStatus('success');
      setStatusMessage('Thanks — your feedback has been received. We read every submission.');
      setType('general');
      setEmail('');
      setMessage('');
    } else {
      setStatus('error');
      setStatusMessage(result.error);
    }
  }

  const submitting = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor={typeId} className="mb-1.5 block text-sm font-semibold text-gray-500">
          Type
        </label>
        <select
          id={typeId}
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`w-full rounded-lg bg-white border border-gray-200 px-4 py-3 text-md text-gray-900 outline-none focus:border-brand-accent-ink/50 ${focusRing}`}
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-white">
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={emailId} className="mb-1.5 block text-sm font-semibold text-gray-500">
          Email <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <input
          id={emailId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className={`w-full rounded-lg bg-white border border-gray-200 px-4 py-3 text-md text-gray-900 outline-none focus:border-brand-accent-ink/50 focus:ring-1 focus:ring-brand-accent-ink/20 placeholder:text-gray-500 ${focusRing}`}
        />
      </div>

      <div>
        <label htmlFor={messageId} className="mb-1.5 block text-sm font-semibold text-gray-500">
          Message
        </label>
        <textarea
          id={messageId}
          rows={5}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (messageError) setMessageError(null);
          }}
          required
          aria-required="true"
          aria-invalid={messageError ? true : undefined}
          aria-describedby={messageError ? messageErrorId : undefined}
          placeholder="Tell us what you think…"
          className={`w-full rounded-lg bg-white border px-4 py-3 text-md text-gray-900 outline-none focus:ring-1 placeholder:text-gray-500 resize-none ${
            messageError
              ? 'border-neg focus:border-neg focus:ring-neg/20'
              : 'border-gray-200 focus:border-brand-accent-ink/50 focus:ring-brand-accent-ink/20'
          } ${focusRing}`}
        />
        {messageError && (
          <p id={messageErrorId} className="mt-1.5 text-sm text-neg">
            {messageError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full rounded-lg bg-white py-3 text-md font-semibold text-brand-ink transition hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed ${focusRing}`}
      >
        {submitting ? 'Submitting…' : 'Submit Feedback'}
      </button>

      {statusMessage && (
        <p
          id={statusId}
          role="status"
          aria-live={status === 'error' ? 'assertive' : 'polite'}
          className={`text-base ${status === 'error' ? 'text-neg' : 'text-pos'}`}
        >
          {statusMessage}
        </p>
      )}
    </form>
  );
}
