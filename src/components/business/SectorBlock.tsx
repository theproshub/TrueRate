import Link from 'next/link';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import SourceLabel from './SourceLabel';

type Card = {
  category: string;
  categorySlug?: string;
  title: string;
  source: string;
  time: string;
  href: string;
  image?: string | null;
};

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-1';

export default function SectorBlock({
  brand,
  title,
  cards,
}: {
  brand?: string;
  title: string;
  cards: Card[];
}) {
  if (cards.length === 0) return null;

  return (
    <section aria-label={title}>
      <h2 className="text-lg sm:text-xl font-extrabold text-[#0A0A0A] pb-3 border-b border-gray-300 mb-4 sm:mb-5">
        {brand && <>{brand}<span className="text-gray-300 font-normal mx-2">|</span></>}
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card, i) => (
          <article key={card.href + i}>
            <Link href={card.href} className={`group block no-underline ${focusRing}`}>
              <div className="overflow-hidden rounded-lg">
                <NewsThumbnail
                  category={card.categorySlug ?? card.category}
                  src={card.image ?? undefined}
                  className="w-full h-[100px] sm:h-[140px] group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <span className={`mt-2 block text-[10px] font-bold uppercase tracking-[0.06em] ${getCatColor(card.categorySlug ?? card.category)}`}>
                {card.category}
              </span>
              <h3 className="mt-0.5 text-[14px] font-bold leading-[1.25] text-[#0A0A0A] group-hover:underline decoration-1 underline-offset-2 line-clamp-3">
                {card.title}
              </h3>
              <SourceLabel source={card.source} time={card.time} className="mt-1.5" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
