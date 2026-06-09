import Link from 'next/link';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import type { EditorialItem } from '@/lib/sports-finance-data';

/**
 * Featured long-form / investigation card. `variant="lead"` renders a larger
 * image-led block; `variant="row"` renders a compact text row for stacks.
 * Light editorial styling.
 */
export default function InvestigationCard({
  item,
  variant = 'lead',
  imageCategory = 'investigation',
}: {
  item: EditorialItem;
  variant?: 'lead' | 'row';
  imageCategory?: string;
}) {
  if (variant === 'row') {
    return (
      <Link href={item.href} className="group flex flex-col gap-1 py-4 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">
        <span className="text-2xs font-bold uppercase tracking-wider text-brand-accent-ink">{item.category}</span>
        <h3 className="text-base font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors text-pretty">{item.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{item.dek}</p>
        <p className="text-2xs text-gray-500 mt-0.5">{item.source} · {item.time}</p>
      </Link>
    );
  }

  return (
    <Link href={item.href} className="group flex flex-col no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">
      <div className="overflow-hidden rounded-xl mb-3">
        <NewsThumbnail category={imageCategory} src={item.image} className="w-full h-[200px] transition-transform motion-safe:group-hover:scale-[1.02]" />
      </div>
      <span className="text-2xs font-bold uppercase tracking-wider text-brand-accent-ink mb-1.5">{item.category}</span>
      <h3 className="text-xl font-bold leading-snug tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors mb-2 text-pretty">{item.title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-2">{item.dek}</p>
      <p className="text-2xs text-gray-500 mt-auto">{item.source} · {item.time}</p>
    </Link>
  );
}
