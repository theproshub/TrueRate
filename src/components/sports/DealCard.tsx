import Link from 'next/link';
import StatusPill from './StatusPill';
import type { DealFeedItem } from '@/lib/sports-finance-data';
import { Text } from '@/components/ui';

/**
 * Plain row: tiny type label, party text, fee right-aligned, status + age beneath.
 * No coloured pills, no surface chrome — just a hover state.
 */
export default function DealCard({ deal }: { deal: DealFeedItem }) {
  return (
    <Link
      href={deal.href}
      className="group flex items-baseline gap-3 px-4 py-3 no-underline border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
    >
      <div className="min-w-0 flex-1">
        <Text variant="caption" className="uppercase tracking-wide text-gray-400 mb-0.5">
          {deal.type}
        </Text>
        <Text className="text-base font-semibold text-gray-900 group-hover:text-gray-700 leading-snug">
          {deal.party}
        </Text>
        <Text className="text-sm text-gray-500 mt-0.5">
          {deal.detail}
        </Text>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-md font-bold text-gray-900 tabular-nums leading-none">
          {deal.fee}
        </p>
        <div className="mt-1 flex items-center justify-end gap-2">
          <StatusPill status={deal.status} />
          <span className="text-xs tabular-nums text-gray-400">{deal.age}</span>
        </div>
      </div>
    </Link>
  );
}
