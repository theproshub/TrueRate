import StatCell from './StatCell';
import type { StatView } from './view-model';

/**
 * <StatSection/> — a labeled group (Macro / Currency / Commodities): a column of
 * two-tier stat cells separated by hairline dividers.
 */
export default function StatSection({
  title,
  views,
  activeId,
  onSelect,
}: {
  title: string;
  views: StatView[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const secId = `sec-${title.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <section aria-labelledby={secId}>
      <h2
        id={secId}
        className="mb-1 border-b border-white/15 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400"
      >
        {title}
      </h2>
      <div className="divide-y divide-white/[0.07]">
        {views.map((view) => (
          <StatCell key={view.id} view={view} active={view.id === activeId} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
