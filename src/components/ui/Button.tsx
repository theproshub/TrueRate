'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size    = 'sm' | 'md' | 'lg';

const variantMap: Record<Variant, string> = {
  primary:   'bg-brand-accent text-brand-ink hover:bg-brand-accent-hover',
  secondary: 'bg-white/10     text-white     hover:bg-white/15',
  ghost:     'bg-transparent  text-gray-300  hover:bg-white/5  hover:text-white',
  outline:   'bg-transparent  text-gray-300  hover:text-white border border-white/20 hover:border-white/40',
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
