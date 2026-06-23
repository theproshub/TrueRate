'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size    = 'sm' | 'md' | 'lg';

const variantMap: Record<Variant, string> = {
  primary:   'bg-brand-accent text-brand-ink hover:bg-brand-accent-hover',
  secondary: 'bg-gray-100     text-gray-900     hover:bg-gray-100',
  ghost:     'bg-transparent  text-gray-600  hover:bg-gray-50  hover:text-gray-900',
  outline:   'bg-transparent  text-gray-600  hover:text-gray-900 border border-gray-200 hover:border-gray-300',
};

const sizeMap: Record<Size, string> = {
  sm: 'text-xs  px-3   py-1.5 min-h-[32px]',
  md: 'text-sm  px-4   py-2   min-h-[40px]',
  lg: 'text-md  px-5   py-2.5 min-h-[44px]',
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

/**
 * Interactive button primitive. All colours resolve from design tokens.
 * Min-height enforces the 44×44px WCAG touch target on `size="lg"`.
 *
 * @example
 * <Button variant="primary" onClick={save}>Save</Button>
 * <Button variant="outline" size="sm">Cancel</Button>
 */
export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-sans font-semibold rounded-md',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantMap[variant],
        sizeMap[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
