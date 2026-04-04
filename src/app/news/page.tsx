import Link from 'next/link';
import { newsItems } from '@/data/news';

const NEWS_IMGS = [
  'https://picsum.photos/seed/lr1/800/420',
  'https://picsum.photos/seed/lr2/400/240',
  'https://picsum.photos/seed/lr3/400/240',
  'https://picsum.photos/seed/lr4/400/240',
  'https://picsum.photos/seed/lr5/400/240',
  'https://picsum.photos/seed/lr6/400/240',
  'https://picsum.photos/seed/lr7/400/240',
  'https://picsum.photos/seed/lr8/400/240',
];

function timeAgo(d: string) {
  const days = Math.floor((new Date('2026-04-01').getTime() - new Date(d).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

const CATEGORY_COLORS: Record<string, string> = {
  economy:     'text-[#34d399]',
  forex:       'text-[#60a5fa]',
  commodities: 'text-[#fbbf24]',
  policy:      'text-[#a78bfa]',
};

export default function NewsPage() {
  const featured = newsItems[0];
  const rest = newsItems.slice(1);

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8">
      <h1 className="mb-6 text-[24px] font-black text-white">Latest News</h1>

      {/* Hero */}
      <Link href={`/news/${featured.id}`} className="group mb-8 flex flex-col gap-4 no-underline sm:flex-row sm:gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={NEWS_IMGS[0]} alt={featured.title} className="w-full rounded-lg object-cover sm:h-[260px] sm:w-[460px] sm:shrink-0" />
        <div className="flex flex-col justify-center">
          <span className={`mb-2 text-[11px] font-bold uppercase tracking-wide ${CATEGORY_COLORS[featured.category] ?? 'text-[#a78bfa]'}`}>
            {featured.category}
          </span>
          <h2 className="text-[22px] font-bold leading-snug text-white group-hover:text-[#a78bfa] transition-colors">{featured.title}</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-[#999]">{featured.summary}</p>
          <div className="mt-3 text-[12px] text-[#666]">{featured.source} · {timeAgo(featured.date)}</div>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((item, i) => (
          <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col no-underline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={NEWS_IMGS[(i + 1) % NEWS_IMGS.length]} alt="" className="h-[160px] w-full rounded-lg object-cover" />
            <div className="mt-3 flex flex-col flex-1">
              <span className={`mb-1 text-[10px] font-bold uppercase tracking-wide ${CATEGORY_COLORS[item.category] ?? 'text-[#a78bfa]'}`}>
                {item.category}
              </span>
              <h3 className="flex-1 text-[14px] font-semibold leading-snug text-white group-hover:text-[#a78bfa] transition-colors">{item.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-[12px] text-[#777]">{item.summary}</p>
              <div className="mt-2 text-[11px] text-[#555]">{item.source} · {timeAgo(item.date)}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
