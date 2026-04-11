import Link from 'next/link';
import { newsItems } from '@/data/news';
import { notFound } from 'next/navigation';
import { HeroVisual, NewsThumbnail } from '@/components/NewsThumbnail';

const CATEGORY_COLORS: Record<string, string> = {
  economy:     'text-[#34d399]',
  forex:       'text-[#60a5fa]',
  commodities: 'text-[#fbbf24]',
  policy:      'text-[#a78bfa]',
};

const LATEST_HEADLINES = [
  { category: 'Forex',   title: 'CBL signals readiness to intervene if LRD weakens past 195',              time: '16m ago' },
  { category: 'Mining',  title: 'ArcelorMittal ships first expanded-capacity iron ore batch from Nimba',   time: '46m ago' },
  { category: 'Energy',  title: 'LPRC reports Q1 revenue rise of 12% on improved distribution margins',    time: '1h ago' },
  { category: 'Banking', title: 'Ecobank raises dividend after strong West Africa quarter',                 time: '2h ago' },
  { category: 'Trade',   title: 'Freeport of Monrovia posts strongest quarter in five years',              time: '3h ago' },
  { category: 'Policy',  title: 'Finance Ministry tables revised budget with 12% capital spending increase', time: '4h ago' },
  { category: 'Agri',    title: 'Firestone rubber output hits decade high on favorable weather conditions', time: '5h ago' },
  { category: 'IMF',     title: 'IMF praises Liberia fiscal consolidation, urges further revenue reform',  time: '6h ago' },
];

const MARKET_RATES = [
  { label: 'LRD/USD',  value: '192.50', pct: '+0.65%', up: true  },
  { label: 'Iron Ore', value: '$108.50', pct: '-2.08%', up: false },
  { label: 'Rubber',   value: '$1.72/kg', pct: '+2.38%', up: true },
  { label: 'Gold',     value: '$3,108',  pct: '+1.12%', up: true  },
];

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

  const related = newsItems.filter(n => n.id !== id && n.category === item.category).slice(0, 3);
  const moreStories = newsItems.filter(n => n.id !== id).slice(0, 8);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-[12px] text-gray-400">
        <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
        <span>/</span>
        <Link href="/news" className="hover:text-white transition-colors no-underline">News</Link>
        <span>/</span>
        <span className={CATEGORY_COLORS[item.category] ?? 'text-gray-500'}>{item.category}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* ── Main article ── */}
        <main className="flex-1 min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-widest mb-2 ${CATEGORY_COLORS[item.category] ?? 'text-gray-500'}">
            <span className={CATEGORY_COLORS[item.category] ?? 'text-gray-500'}>{item.category}</span>
          </div>

          <h1 className="text-[26px] sm:text-[30px] font-black leading-tight text-white mb-3">{item.title}</h1>

          <div className="flex items-center gap-3 text-[13px] text-[#555] mb-6 border-b border-white/[0.06] pb-5">
            <span>{item.source}</span>
            <span>·</span>
            <span>{timeAgo(item.date)}</span>
          </div>

          <HeroVisual category={item.category} className="w-full rounded-xl h-[280px] sm:h-[360px] mb-8" />

          <div className="text-[15px] leading-[1.75] text-[#c0c0c8] space-y-5 mb-8">
            <p className="text-[16px] font-medium text-[#d4d4dc] leading-relaxed">{item.summary}</p>
            <p>
              Liberia&apos;s financial markets continue to respond to this development, with analysts closely monitoring
              the Central Bank of Liberia&apos;s policy stance. Investors have shown heightened attention to macroeconomic
              signals from both domestic and regional sources, particularly given the broader West African economic context
              and ongoing IMF programme review.
            </p>
            <p>
              The Central Bank of Liberia has maintained open communication with market participants, issuing regular
              guidance on liquidity conditions and the LRD exchange rate corridor. Officials note that foreign reserve
              levels — currently at $502M — provide adequate buffer for near-term stability, though continued vigilance
              is warranted given global commodity price movements.
            </p>
            <p>
              Market participants note that the longer-term implications depend on several factors, including global
              commodity prices — particularly iron ore and rubber — diaspora remittance flows, and fiscal measures
              introduced by the government. Regional bodies such as the IMF and World Bank continue to provide
              technical guidance and programme oversight through 2026.
            </p>
            <p>
              Analysts from FrontPage Africa and the Daily Observer have noted that domestic investor sentiment
              remains cautiously optimistic, supported by the recent upgrade of Liberia&apos;s growth forecast to 5.1%
              by the IMF. The mining sector, led by ArcelorMittal&apos;s Nimba operations and Bea Mountain Mining,
              is expected to be the primary driver of outperformance in the near term.
            </p>
            <p>
              TrueRate will continue to track this story as more information becomes available from official sources,
              including the Ministry of Finance, CBL, and international partners.
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 py-5 border-t border-b border-white/[0.06] mb-8">
            {[item.category, 'Liberia', 'West Africa', 'Economy'].map(tag => (
              <Link key={tag} href="/news" className="rounded-lg border border-white/[0.15] px-3 py-1 text-[12px] text-gray-400 hover:text-white hover:border-white/30 transition-colors no-underline">
                {tag}
              </Link>
            ))}
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-bold text-white">Related</h2>
                <Link href="/news" className="text-[12px] text-gray-400 hover:text-white transition-colors no-underline">More ›</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map(r => (
                  <Link key={r.id} href={`/news/${r.id}`} className="group no-underline">
                    <div className="overflow-hidden rounded-xl mb-2.5">
                      <NewsThumbnail category={r.category} className="w-full h-[110px]" />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-white/35 mb-1">{r.category}</div>
                    <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1">{r.title}</h3>
                    <div className="text-[11px] text-[#555]">{r.source} · {timeAgo(r.date)}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* More Stories */}
          <div>
            <div className="flex items-center justify-between mb-4 border-t border-white/[0.06] pt-8">
              <h2 className="text-[16px] font-bold text-white">More Stories</h2>
              <Link href="/news" className="text-[12px] text-gray-400 hover:text-white transition-colors no-underline">All news ›</Link>
            </div>
            <div className="flex flex-col divide-y divide-white/[0.05]">
              {moreStories.map(s => (
                <Link key={s.id} href={`/news/${s.id}`} className="group flex gap-3.5 py-4 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-lg">
                    <NewsThumbnail category={s.category} className="h-[70px] w-[105px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-white/35 mb-1">{s.category}</div>
                    <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-2 mb-1">{s.title}</h3>
                    <p className="text-[12px] text-gray-400">{s.source} · {timeAgo(s.date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-[260px] shrink-0">
          <div className="lg:sticky lg:top-[120px] flex flex-col gap-6">

            {/* Latest Headlines */}
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
              <div className="px-4 py-3.5 border-b border-white/[0.05]">
                <h3 className="text-[13px] font-bold text-white">Latest Headlines</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {LATEST_HEADLINES.map((h, i) => (
                  <Link key={i} href="/news" className="group flex items-start gap-3 px-4 py-3 no-underline hover:bg-white/[0.02] transition-colors">
                    <span className="shrink-0 tabular-nums text-[18px] font-black text-white/[0.08] leading-none w-5 mt-0.5">{i + 1}</span>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-white/35 mb-0.5">{h.category}</div>
                      <p className="text-[12px] font-semibold leading-snug text-white/80 group-hover:text-white transition-colors line-clamp-2">{h.title}</p>
                      <p className="mt-1 text-[10px] text-gray-400">{h.time}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-white/[0.04]">
                <Link href="/news" className="text-[12px] text-gray-400 hover:text-white transition-colors no-underline">See all headlines ›</Link>
              </div>
            </div>

            {/* Market Rates */}
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-white">Markets</h3>
                <Link href="/forex" className="text-[11px] text-gray-400 hover:text-white transition-colors no-underline">Full view ›</Link>
              </div>
              <div className="space-y-3">
                {MARKET_RATES.map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-white">{r.label}</span>
                    <div className="text-right">
                      <div className="text-[12px] tabular-nums font-bold text-white">{r.value}</div>
                      <div className={`text-[11px] font-bold tabular-nums ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>{r.pct}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In Focus topics */}
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] p-4">
              <h3 className="text-[13px] font-bold text-white mb-3">In Focus</h3>
              <div className="flex flex-wrap gap-2">
                {['Iron Ore', 'LRD/USD', 'CBL Rate', 'Rubber', 'Remittances', 'ECOWAS', 'Mining Policy', 'Gold'].map(t => (
                  <Link key={t} href="/news" className="rounded-lg border border-white/[0.15] px-3 py-1 text-[12px] text-gray-400 hover:text-white hover:border-white/30 transition-colors no-underline">{t}</Link>
                ))}
              </div>
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
}
