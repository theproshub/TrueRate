import { type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Adds vertical padding top/bottom */
  padded?: boolean;
  className?: string;
};

/**
 * Top-level page wrapper — max-w matches --container-max-w (1320px), centred,
 * with consistent horizontal padding. Use this instead of raw max-w-[1320px].
 */
export function Container({ children, padded = false, className = '' }: Props) {
  return (
    <div
      className={[
        'w-full mx-auto px-4 sm:px-6',
        'max-w-[1320px]',
        padded ? 'py-6' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
