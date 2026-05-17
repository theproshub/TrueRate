import { type ReactNode } from 'react';

type Variant = 'default' | 'surface' | 'transparent';
type Padding = 'none' | 'sm' | 'md' | 'lg';

const variantMap: Record<Variant, string> = {
  default:     'bg-brand-card border border-white/[0.06]',
  surface:     'bg-brand-surface border border-gray-200',    // light pages (news articles)
  transparent: 'bg-transparent',
};

const paddingMap: Record<Padding, string> = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
};

type Props = {
  variant?: Variant;
  padding?: Padding;
  rounded?: boolean;
  children: ReactNode;
  className?: string;
};

/**
 * Card container. Uses brand-card by default; use variant="surface" on
 * light-background pages (news / article pages).
 *
 * @example
 * <Card><NewsItem /></Card>
 * <Card variant="surface" padding="lg"><ArticleBody /></Card>
 */
export function Card({
  variant = 'default',
  padding = 'md',
  rounded = true,
  children,
  className = '',
}: Props) {
  return (
    <div
      className={[
        variantMap[variant],
        paddingMap[padding],
        rounded ? 'rounded-lg' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
