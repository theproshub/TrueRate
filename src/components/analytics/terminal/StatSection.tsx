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
    <section aria-labelledby={secId} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
      <h2
        id={secId}
        className="text-sm font-bold text-white uppercase tracking-[0.12em] border-b border-white/[0.07] pb-3 mb-3"
      >
        {title}
      </h2>
      <div className="divide-y divide-white/[0.05]">
        {views.map((view) => (
          <StatCell key={view.id} view={view} active={view.id === activeId} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
