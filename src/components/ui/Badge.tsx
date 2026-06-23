import { type ReactNode } from 'react';

type Variant = 'accent' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
type Size = 'sm' | 'md';

const variantMap: Record<Variant, string> = {
  accent:  'bg-brand-accent  text-brand-ink',
  success: 'bg-pos/10        text-pos    border border-pos/30',
  danger:  'bg-neg/10        text-neg    border border-neg/30',
  warning: 'bg-warning/10    text-warning border border-warning/30',
  info:    'bg-info/10       text-info    border border-info/30',
  neutral: 'bg-gray-100      text-gray-600 border border-gray-200',
};

const sizeMap: Record<Size, string> = {
  sm: 'text-2xs px-1.5 py-px  rounded-sm',
  md: 'text-xs  px-2   py-0.5 rounded',
};

type Props = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

/**
 * Inline badge / pill. All colors are resolved from design tokens.
 *
 * @example
 * <Badge variant="accent">LIVE</Badge>
 * <Badge variant="success" size="sm">+2.4%</Badge>
 * <Badge variant="danger">−0.8%</Badge>
 */
export function Badge({ variant = 'neutral', size = 'md', children, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center font-sans font-semibold uppercase tracking-wide ${sizeMap[size]} ${variantMap[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
