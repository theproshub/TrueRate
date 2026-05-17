'use client';

import { type InputHTMLAttributes, useId } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  /** Hides the label visually but keeps it for screen readers */
  labelHidden?: boolean;
  error?: string;
};

/**
 * Labelled text input. Every input must have a visible or sr-only label (WCAG 1.3.1).
 * Error string wires aria-invalid + aria-describedby automatically.
 *
 * @example
 * <Input label="Email" type="email" value={email} onChange={...} />
 * <Input label="Search" labelHidden placeholder="Search…" />
 */
export function Input({ label, labelHidden = false, error, className = '', id: externalId, ...rest }: Props) {
  const autoId = useId();
  const id = externalId ?? autoId;
  const errId = `${id}-err`;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className={
          labelHidden
            ? 'sr-only'
            : 'text-sm text-gray-400 font-sans font-medium'
        }
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        className={[
          'w-full rounded-md px-3 py-2',
          'bg-white/5 border border-white/10',
          'text-base text-white placeholder:text-gray-500',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent',
          'transition-colors duration-150',
          error ? 'border-neg/50' : 'hover:border-white/20',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {error && (
        <p id={errId} role="alert" className="text-xs text-neg">
          {error}
        </p>
      )}
    </div>
  );
}
