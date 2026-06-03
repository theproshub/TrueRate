import { type HTMLAttributes, type ReactNode } from 'react';

type Level = 1 | 2 | 3 | 4 | 5 | 6;
type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type Weight = 'medium' | 'semibold' | 'bold' | 'black';

/** Default size class per level. Weight is applied separately so it can be overridden. */
const sizeMap: Record<Level, string> = {
  1: 'text-3xl',
  2: 'text-2xl',
  3: 'text-xl',
  4: 'text-lg',
  5: 'text-md',
  6: 'text-base',
};

/** Default weight per level. Override via `weight` prop when the design calls for it. */
const defaultWeightMap: Record<Level, Weight> = {
  1: 'bold',
  2: 'bold',
  3: 'semibold',
  4: 'semibold',
  5: 'semibold',
  6: 'semibold',
};

const weightClass: Record<Weight, string> = {
  medium:   'font-medium',
  semibold: 'font-semibold',
  bold:     'font-bold',
  black:    'font-bold',
};

type Props = HTMLAttributes<HTMLHeadingElement> & {
  /** Visual size level. Defaults to 2. */
  level?: Level;
  /** Override the rendered HTML tag while keeping the visual size. */
  as?: Tag;
  /** Override the default weight for this level. */
  weight?: Weight;
  children: ReactNode;
};

/**
 * Heading primitive — resolves to the correct token-based size class.
 * Accepts all standard HTML heading attributes (id, aria-*, role, etc.) via spread,
 * so it works with patterns like `aria-labelledby`.
 *
 * @example
 * <Heading level={1}>Markets</Heading>
 * <Heading level={3} as="h2" id="top-stories">Top Stories</Heading>
 * <Heading level={1} weight="black">Bold Hero</Heading>
 */
export function Heading({
  level = 2,
  as,
  weight,
  children,
  className = '',
  ...rest
}: Props) {
  const Tag: Tag = as ?? (`h${level}` as Tag);
  const resolvedWeight = weightClass[weight ?? defaultWeightMap[level]];
  return (
    <Tag className={`font-sans ${sizeMap[level]} ${resolvedWeight} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
