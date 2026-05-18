import Link from 'next/link';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { MORE_STORIES } from '@/lib/builders-data';

export default function MoreStoriesList() {
  return (
    <section aria-labelledby="builders-more" className="mb-10">
      <h2
        id="builders-more"
        className="text-md font-bold text-white border-b border-white/20 pb-3 mb-3"
      >
        More Business Stories
      </h2>
      <ul className="list-none p-0 m-0 divide-y divide-white/[0.05]">
        {MORE_STORIES.map((s, i) => (
          <li key={i}>
            <Link href={s.href} className="group flex items-start gap-4 py-4 no-underline">
              <NewsThumbnail category={s.category} className="w-[88px] h-[64px] sm:w-[120px] sm:h-[72px] rounded-md shrink-0" />
              <div className="min-w-0 flex-1 flex flex-col">
                <h3 className="text-sm sm:text-base font-semibold leading-snug text-white group-hover:text-white/80 transition-colors mb-1">
                  {s.title}
                </h3>
                <span className="text-xs text-gray-500">{s.source} · {s.time}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
