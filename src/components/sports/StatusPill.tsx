import type { DealStatus } from '@/lib/sports-finance-data';

const STYLES: Record<DealStatus, { dot: string; text: string; label: string }> = {
  done:        { dot: 'bg-pos', text: 'text-gray-700', label: 'Done'        },
  active:      { dot: 'bg-pos', text: 'text-gray-700', label: 'Active'      },
  expiring:    { dot: 'bg-red-600',     text: 'text-gray-700', label: 'Expiring'    },
  hot:         { dot: 'bg-red-600',     text: 'text-gray-700', label: 'Hot'         },
  negotiating: { dot: 'bg-amber-500',   text: 'text-gray-700', label: 'Negotiating' },
  rumour:      { dot: 'bg-gray-400',    text: 'text-gray-500', label: 'Rumour'      },
};

/** Plain text + a coloured dot. No box, no background. */
export default function StatusPill({ status, label }: { status: DealStatus; label?: string }) {
  const s = STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${s.text}`}>
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {label ?? s.label}
    </span>
  );
}
