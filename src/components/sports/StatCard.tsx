import { Text } from '@/components/ui';

type Props = {
  label: string;
  value: string;
  delta?: string;
  /** true = up (green), false = down (red), null/undefined = neutral */
  up?: boolean | null;
  source?: string;
};

/**
 * KPI cell. No card chrome — borders come from the parent grid container,
 * which gives a clean newspaper-data-table feel rather than dashboard widgets.
 */
export default function StatCard({ label, value, delta, up, source }: Props) {
  const deltaClass =
    up === true  ? 'text-pos' :
    up === false ? 'text-neg' :
    'text-gray-500';
  return (
    <div className="px-4 py-3">
      <Text variant="meta" className="text-gray-500 leading-snug mb-1">{label}</Text>
      <p className="text-stat-sm font-bold text-gray-900 tabular-nums leading-tight">{value}</p>
      {delta && (
        <Text className={`mt-0.5 text-sm tabular-nums ${deltaClass}`}>{delta}</Text>
      )}
      {source && (
        <Text variant="meta" className="mt-0.5 text-gray-400">{source}</Text>
      )}
    </div>
  );
}
