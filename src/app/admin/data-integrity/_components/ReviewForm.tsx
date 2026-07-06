'use client';

import { useActionState } from 'react';
import { reviewFinding, type ReviewFindingState } from '../_actions';

const STATUSES = ['open', 'reviewing', 'resolved', 'dismissed'] as const;

export default function ReviewForm({
  id,
  status,
  resolutionNote,
}: {
  id: string;
  status: (typeof STATUSES)[number];
  resolutionNote: string | null;
}) {
  const [state, formAction, pending] = useActionState<ReviewFindingState, FormData>(
    reviewFinding,
    {},
  );

  return (
    <form action={formAction} className="mt-3 flex flex-wrap items-end gap-3">
      <input type="hidden" name="id" value={id} />
      <div>
        <label
          htmlFor={`status-${id}`}
          className="block text-2xs font-bold uppercase tracking-[0.12em] text-gray-500"
        >
          Status
        </label>
        <select
          id={`status-${id}`}
          name="status"
          defaultValue={status}
          className="mt-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-64 flex-1">
        <label
          htmlFor={`note-${id}`}
          className="block text-2xs font-bold uppercase tracking-[0.12em] text-gray-500"
        >
          Resolution note
        </label>
        <input
          id={`note-${id}`}
          name="resolution_note"
          type="text"
          defaultValue={resolutionNote ?? ''}
          placeholder="e.g. Confirmed against MoF March 2026 bulletin; ingestion re-run"
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-gray-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
      >
        {pending ? 'Saving…' : 'Save review'}
      </button>
      {state.error && (
        <p role="alert" aria-live="assertive" className="w-full text-sm text-neg">
          {state.error}
        </p>
      )}
    </form>
  );
}
