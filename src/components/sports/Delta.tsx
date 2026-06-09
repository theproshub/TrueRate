/**
 * Movement indicator for the sports-intelligence kit.
 * Pairs colour with an arrow/sign so up/down is never colour-only (WCAG 1.4.1).
 */
export default function Delta({
  text,
  up,
  className = '',
}: {
  text: string;
  /** true = positive, false = negative, null/undefined = neutral */
  up?: boolean | null;
  className?: string;
}) {
  const tone =
    up === true ? 'text-pos' : up === false ? 'text-neg' : 'text-gray-400';
  const glyph = up === true ? '▲' : up === false ? '▼' : '•';
  return (
    <span className={`inline-flex items-center gap-1 tabular-nums ${tone} ${className}`}>
      <span aria-hidden="true" className="text-2xs leading-none">{glyph}</span>
      {text}
    </span>
  );
}
