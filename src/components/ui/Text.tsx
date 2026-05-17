import { type HTMLAttributes, type ReactNode } from 'react';

type Variant = 'body' | 'body-sm' | 'meta' | 'label' | 'caption';
type As = 'p' | 'span' | 'div' | 'small' | 'label';

const variantMap: Record<Variant, string> = {
  body:      'text-base text-gray-300 font-body',
  'body-sm': 'text-sm   text-gray-500 font-body',           // smaller secondary body
  meta:      'text-xs   text-gray-400 font-body',
  label:     'text-sm   text-gray-400 font-sans font-medium uppercase tracking-wide',
  caption:   'text-2xs  text-gray-500 font-body',
};

type Props = HTMLAttributes<HTMLElement> & {
  variant?: Variant;
  as?: As;
  children: ReactNode;
};

/**
 * Body-copy primitive. Resolves variant → token-based class string.
 * Accepts all standard HTML attributes (id, aria-*, role, htmlFor on `as="label"`).
 *
 * @example
 * <Text>Article body</Text>
 * <Text variant="meta">Jan 12 · 3 min read</Text>
 * <Text variant="label" as="span">Category</Text>
 * <Text variant="body-sm">Secondary copy</Text>
 */
export function Text({ variant = 'body', as: Tag = 'p', children, className = '', ...rest }: Props) {
  return (
    <Tag className={`${variantMap[variant]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
