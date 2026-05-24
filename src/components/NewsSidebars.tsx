import Link from 'next/link';
import { newsItems } from '@/data/news';
import { Heading, Text } from '@/components/ui';
import { ACTIVE_SOCIAL_LINKS } from '@/lib/social';

const TRENDING = [
  { rank: 1,  href: '/news/1',  title: "Why the CBL Governor isn't cutting rates — even as inflation falls" },
  { rank: 2,  href: '/news/3',  title: "ArcelorMittal's $120M Nimba bet: the biggest wager on Liberia in a decade" },
  { rank: 3,  href: '/news/22', title: "Bea Mountain's 1.4M oz discovery: what happens next" },
  { rank: 4,  href: '/news/5',  title: "How Firestone turned Harbel into Africa's most productive rubber estate" },
  { rank: 5,  href: '/news/10', title: "The $680M question: where is Liberia's diaspora money actually going?" },
  { rank: 6,  href: '/news/18', title: "Liberia's $50M green bond was oversubscribed 2.4x — now the hard part" },
  { rank: 7,  href: '/news/17', title: "Gold at $3,100: Liberia's miners are positioned for their best year in a decade" },
  { rank: 8,  href: '/news/25', title: "LiberAgro made history on the Ghana Stock Exchange. Nobody noticed." },
  { rank: 9,  href: '/news/30', title: "Off-grid solar is quietly electrifying Liberia — without the government" },
  { rank: 10, href: '/news/28', title: "CBL reserves at $642M: what the 13-year high means for monetary policy" },
];

export function TrendingPanel() {
  return (
    <aside className="hidden lg:block w-[270px] shrink-0 sticky self-end" style={{ bottom: '16px' }}>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-4 w-4 text-emerald-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <Heading level={5} as="h2" className="font-bold text-gray-900 uppercase tracking-wide">Trending</Heading>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
          {TRENDING.map(item => (
            <Link key={item.rank} href={item.href} className="flex items-start gap-3 px-4 py-3.5 no-underline group hover:bg-gray-50 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold leading-snug text-gray-700 group-hover:text-emerald-700 transition-colors line-clamp-2">{item.title}</p>
              </div>
            </Link>
          ))}
          <Link href="/news" className="flex items-center justify-between px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
            <span className="text-base text-gray-500 group-hover:text-emerald-700 transition-colors">See more stories</span>
            <svg className="h-4 w-4 text-gray-400 group-hover:text-emerald-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Mini market widget */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 mb-3">Markets</h3>
          {[
            { label: 'LRD/USD',  value: '192.50',  pct: '+0.65%', up: true  },
            { label: 'Iron Ore', value: '$108.50', pct: '-2.08%', up: false },
            { label: 'Rubber',   value: '$1.72/kg', pct: '+2.38%', up: true  },
            { label: 'Gold',     value: '$3,108',   pct: '+1.12%', up: true  },
            { label: 'Palm Oil', value: '$922/t',   pct: '-1.40%', up: false },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm font-semibold text-gray-900">{r.label}</span>
              <div className="text-right">
                <div className="text-sm tabular-nums text-gray-900">{r.value}</div>
                <div className={`text-xs font-bold tabular-nums ${r.up ? 'text-emerald-700' : 'text-red-400'}`}>{r.pct}</div>
              </div>
            </div>
          ))}
          <Link href="/economy" className="mt-3 block text-center text-sm text-gray-500 hover:text-emerald-700 transition-colors no-underline">Full markets ›</Link>
        </div>

        {/* In Focus topics */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">In Focus</h3>
          <div className="flex flex-wrap gap-2">
            {['Iron Ore', 'LRD/USD', 'Rubber', 'CBL Rate', 'Remittances', 'ECOWAS', 'Mining Policy', 'Inflation', 'Gold', 'ESG Bonds'].map(t => (
              <Link key={t} href="/news" className="rounded-lg border border-gray-300 px-4 py-1.5 text-base font-semibold text-gray-700 hover:bg-gray-100 transition-colors no-underline">{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function RightRail() {
  return (
    <aside className="hidden xl:block w-[300px] shrink-0 sticky self-end" style={{ bottom: '16px' }}>
      <div className="flex flex-col gap-5">

        {/* Newsletter */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-1">TrueRate Daily Brief</h3>
          <p className="text-sm text-gray-500 mb-3">Liberia business & economy, delivered every morning.</p>
          <input type="email" placeholder="Email address"
            className="w-full rounded-lg bg-gray-100 border border-gray-200 px-3 py-2.5 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors mb-2" />
          <button className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 transition">Sign up free</button>
        </div>

        {/* Upcoming events */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Upcoming Events</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { date: 'Apr 7',  label: 'CBL Monetary Policy Meeting',   type: 'Policy'      },
              { date: 'Apr 10', label: 'Q1 GDP Advance Estimate',        type: 'Economy'     },
              { date: 'Apr 14', label: 'Mid-Year Budget Review',         type: 'Policy'      },
              { date: 'Apr 14', label: 'Liberia Investment Forum',       type: 'Trade'       },
              { date: 'Apr 18', label: 'World Bank Country Dialogue',    type: 'Development' },
              { date: 'Apr 22', label: 'ArcelorMittal Q1 Earnings Call', type: 'Markets'     },
            ].map((ev, i) => (
              <Link key={i} href="/economy" className="flex items-center gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                <span className="shrink-0 w-[40px] text-xs font-medium text-gray-400 tabular-nums">{ev.date}</span>
                <div className="min-w-0 flex-1 border-l border-gray-100 pl-3">
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors leading-snug">{ev.label}</p>
                  <span className="text-2xs font-medium text-gray-400 uppercase tracking-wide">{ev.type}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Most read */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Most Read</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {newsItems.slice(0, 5).map((item, i) => (
              <Link key={item.id} href={`/news/${item.id}`} className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                <p className="text-sm font-bold leading-snug text-gray-700 group-hover:text-emerald-700 transition-colors line-clamp-3">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Compact site footer */}
        <div className="pt-2 pb-4">
          <div className="flex items-center justify-center gap-4 mb-3">
            {ACTIVE_SOCIAL_LINKS.map(s => (
              <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 text-gray-900 hover:bg-gray-400 transition-colors no-underline" aria-label={`TrueRate on ${s.label}`}>
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
            {['About', 'Advertise', 'Careers', 'Help', 'Feedback', 'Privacy', 'Terms'].map(l => (
              <Link key={l} href="/about" className="text-xs text-gray-400 hover:text-gray-700 transition-colors no-underline">{l}</Link>
            ))}
          </div>
          <Text variant="meta" className="text-center">© 2026 TrueRate. All rights reserved.</Text>
        </div>

      </div>
    </aside>
  );
}
