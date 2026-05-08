import Link from 'next/link';

/** Bold uppercase title with a red underline rule — site-wide section header. */
export default function SectionHead({
  title,
  action,
  actionLabel = 'See more',
}: {
  title: string;
  action?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex items-baseline justify-between mb-4">
      <h2 className="relative text-[16px] font-bold uppercase tracking-wide text-gray-900 pb-2 border-b-2 border-red-700">
        {title}
      </h2>
      {action && (
        <Link
          href={action}
          className="text-[12px] font-semibold text-red-700 hover:text-red-900 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
        >
          {actionLabel} ›
        </Link>
      )}
    </div>
  );
}
