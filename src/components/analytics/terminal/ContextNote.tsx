/**
 * <ContextNote/> — static editorial one-liner (never AI-generated per load).
 * `variant="meaning"` = what the number means for a decision.
 * `variant="liberia"` = export-relevance angle (commodities), accent-marked.
 */
export default function ContextNote({
  text,
  variant = 'meaning',
}: {
  text: string;
  variant?: 'meaning' | 'liberia';
}) {
  if (variant === 'liberia') {
    return (
      <p className="border-l-2 border-brand-accent/60 pl-2.5 text-sm leading-relaxed text-gray-300">
        <span className="mr-1.5 text-2xs font-semibold uppercase tracking-wide text-brand-accent">
          Liberia
        </span>
        {text}
      </p>
    );
  }
  return <p className="text-sm leading-relaxed text-gray-400">{text}</p>;
}
