/**
 * Page header for a sports-intelligence vertical (club finance, sponsorship,
 * transfers, broadcast). Renders the page <h1>, an optional headline figure,
 * the summary deck, and byline. Light editorial styling.
 */
export default function VerticalHero({
  kicker,
  title,
  dek,
  source,
  time,
  bigNumber,
  bigNumberLabel,
}: {
  kicker: string;
  title: string;
  dek: string;
  source: string;
  time: string;
  bigNumber?: string;
  bigNumberLabel?: string;
}) {
  return (
    <header className="pb-8 mb-10 border-b border-gray-900/15">
      <p className="text-2xs font-bold uppercase tracking-[0.18em] text-brand-accent-ink mb-3">{kicker}</p>
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="min-w-0">
          <h1 className="text-3xl sm:text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 text-balance max-w-[40ch]">{title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600 max-w-[68ch]">{dek}</p>
          <p className="mt-4 text-sm">
            <span className="font-semibold text-gray-900">{source}</span>
            <span className="mx-1.5 text-gray-300">·</span>
            <time className="text-gray-500">{time}</time>
          </p>
        </div>
        {bigNumber && (
          <div className="lg:text-right">
            <div className="inline-flex flex-col border-l-2 lg:border-l-0 lg:border-r-2 border-brand-accent-ink pl-4 lg:pl-0 lg:pr-4">
              <span className="text-stat-xl font-black tabular-nums text-gray-900 leading-none">{bigNumber}</span>
              {bigNumberLabel && <span className="mt-1.5 text-sm text-gray-500 max-w-[22ch] lg:ml-auto">{bigNumberLabel}</span>}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
