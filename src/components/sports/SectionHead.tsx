import Link from 'next/link';

/**
 * Yahoo-style section header: lime left-bar accent + full-width bottom divider.
 * Pass `id` when the parent section uses `aria-labelledby`.
 */
export default function SectionHead({
  id,
  title,
  action,
  actionLabel = 'See more',
}: {
  id?: string;
  title: string;
  action?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between pb-2.5 mb-5 border-b border-white/[0.08]">
      <h2
        id={id}
        className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-widest text-white"
      >
        <span aria-hidden="true" className="shrink-0 h-3.5 w-[3px] rounded-sm bg-brand-accent" />
        {title}
      </h2>
      {action && (
        <Link
          href={action}
          className="text-sm font-semibold text-brand-accent hover:text-brand-accent transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
        >
          {actionLabel} ›
        </Link>
      )}
    </div>
  );
}
