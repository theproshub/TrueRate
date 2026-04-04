import Link from 'next/link';

const THREADS = [
  { author: 'MonroviaTrader', time: '12m ago', title: 'AMTL expansion — undervalued at current prices?', replies: 14, views: 342, tag: 'Equities'    },
  { author: 'LRD_Watch',      time: '45m ago', title: 'CBL rate hold was expected — what next for LRD/USD?', replies: 9,  views: 218, tag: 'Forex'      },
  { author: 'RubberBull',     time: '2h ago',  title: 'Firestone record output: long FSLR or take profits?', replies: 22, views: 489, tag: 'Commodities' },
  { author: 'WestAfriGrow',   time: '4h ago',  title: 'BRVM-CI correlation to Ghana GSE — any alpha here?', replies: 7,  views: 155, tag: 'Markets'    },
  { author: 'DiasporaFund',   time: '6h ago',  title: '$680M remittances — best ways to invest locally?', replies: 31, views: 712, tag: 'Personal Finance'},
  { author: 'CBLWatcher',     time: '1d ago',  title: 'Liberia inflation print coming Thursday — predictions?', replies: 18, views: 403, tag: 'Macro'   },
];

const TAG_COLORS: Record<string, string> = {
  Equities:         'text-[#a78bfa] bg-[#a78bfa]/10',
  Forex:            'text-[#60a5fa] bg-[#60a5fa]/10',
  Commodities:      'text-[#fbbf24] bg-[#fbbf24]/10',
  Markets:          'text-[#34d399] bg-[#34d399]/10',
  'Personal Finance':'text-[#fb923c] bg-[#fb923c]/10',
  Macro:            'text-[#f87171] bg-[#f87171]/10',
};

export default function CommunityPage() {
  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-white">Community</h1>
          <p className="mt-0.5 text-[13px] text-[#666]">Discussion forums for Liberia & West Africa investors</p>
        </div>
        <Link href="/signin" className="rounded-full bg-[#6001d2] px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#490099] no-underline">
          Join discussion
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {THREADS.map(t => (
          <div key={t.title} className="flex items-start justify-between gap-4 rounded-lg border border-[#2a2a2a] bg-[#161618] px-5 py-4 hover:bg-[#1c1c1e] transition-colors cursor-pointer">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TAG_COLORS[t.tag] ?? 'text-[#a78bfa] bg-[#a78bfa]/10'}`}>
                  {t.tag}
                </span>
              </div>
              <h3 className="text-[14px] font-semibold text-white hover:text-[#a78bfa] transition-colors">{t.title}</h3>
              <div className="mt-1.5 flex items-center gap-3 text-[12px] text-[#555]">
                <span className="font-semibold text-[#777]">{t.author}</span>
                <span>·</span>
                <span>{t.time}</span>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1 text-[12px] text-[#555]">
              <span>{t.replies} replies</span>
              <span>{t.views} views</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-[#2a2a2a] bg-[#161618] p-6 text-center">
        <h2 className="mb-2 text-[16px] font-bold text-white">Join the TrueRate community</h2>
        <p className="mb-4 text-[13px] text-[#777]">Sign in to post, reply, and follow topics that matter to you.</p>
        <Link href="/signin" className="inline-block rounded-full bg-[#6001d2] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#490099] no-underline">
          Sign in to participate
        </Link>
      </div>
    </main>
  );
}
