import Link from 'next/link';
import { newsItems } from '@/data/news';
import { notFound } from 'next/navigation';

const NEWS_IMGS = [
  'https://picsum.photos/seed/lr1/800/420',
  'https://picsum.photos/seed/lr2/800/420',
  'https://picsum.photos/seed/lr3/800/420',
  'https://picsum.photos/seed/lr4/800/420',
  'https://picsum.photos/seed/lr5/800/420',
  'https://picsum.photos/seed/lr6/800/420',
  'https://picsum.photos/seed/lr7/800/420',
  'https://picsum.photos/seed/lr8/800/420',
];

const CATEGORY_COLORS: Record<string, string> = {
  economy:     'text-[#34d399]',
  forex:       'text-[#60a5fa]',
  commodities: 'text-[#fbbf24]',
  policy:      'text-[#a78bfa]',
};

function timeAgo(d: string) {
  const days = Math.floor((new Date('2026-04-01').getTime() - new Date(d).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export function generateStaticParams() {
  return newsItems.map(item => ({ id: item.id }));
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = newsItems.find(n => n.id === id);
  if (!item) notFound();

  const idx = newsItems.indexOf(item);
  const related = newsItems.filter(n => n.id !== id && n.category === item.category).slice(0, 3);

  return (
    <main className="mx-auto max-w-[860px] px-4 py-8">
      <Link href="/news" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-[#a78bfa] no-underline hover:underline">
        ← Back to News
      </Link>

      <span className={`mt-4 block text-[11px] font-bold uppercase tracking-widest ${CATEGORY_COLORS[item.category] ?? 'text-[#a78bfa]'}`}>
        {item.category}
      </span>
      <h1 className="mt-2 text-[28px] font-black leading-tight text-white">{item.title}</h1>
      <div className="mt-3 text-[13px] text-[#666]">{item.source} · {timeAgo(item.date)}</div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={NEWS_IMGS[idx % NEWS_IMGS.length]}
        alt=""
        className="my-6 w-full rounded-xl object-cover"
        style={{ height: '320px' }}
      />

      <div className="prose prose-invert max-w-none text-[15px] leading-relaxed text-[#ccc]">
        <p>{item.summary}</p>
        <p className="mt-4">
          Liberia&apos;s financial markets continue to respond to this development, with analysts closely monitoring
          the Central Bank of Liberia&apos;s policy stance. Investors have shown heightened attention to macroeconomic
          signals from both domestic and regional sources, particularly given the broader West African economic context.
        </p>
        <p className="mt-4">
          Market participants note that the longer-term implications depend on several factors, including global commodity
          prices, diaspora remittance flows, and fiscal measures introduced by the government of Liberia. Regional bodies
          such as the IMF and World Bank continue to provide technical guidance.
        </p>
        <p className="mt-4">
          TrueRate will continue to track this story as more information becomes available from official sources.
        </p>
      </div>

      {related.length > 0 && (
        <div className="mt-10 border-t border-[#222] pt-8">
          <h2 className="mb-4 text-[16px] font-bold text-white">Related Articles</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map(r => (
              <Link key={r.id} href={`/news/${r.id}`} className="group no-underline">
                <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-[#a78bfa] transition-colors">{r.title}</h3>
                <div className="mt-1 text-[11px] text-[#555]">{r.source} · {timeAgo(r.date)}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
