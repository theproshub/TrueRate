import Link from 'next/link';
import { newsItems } from '@/data/news';

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
          <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <h2 className="text-[14px] font-bold text-gray-900 uppercase tracking-wide">Trending</h2>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
          {TRENDING.map(item => (
            <Link key={item.rank} href={item.href} className="flex items-start gap-3 px-4 py-3.5 no-underline group hover:bg-gray-50 transition-colors">
              <span className="shrink-0 tabular-nums text-[18px] font-black text-gray-300 leading-none w-5 pt-0.5">{item.rank}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-snug text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-2">{item.title}</p>
              </div>
            </Link>
          ))}
          <Link href="/news" className="flex items-center justify-between px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
            <span className="text-[13px] text-gray-500 group-hover:text-gray-900 transition-colors">See more stories</span>
            <svg className="h-4 w-4 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Mini market widget */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-3">Markets</h3>
          {[
            { label: 'LRD/USD',  value: '192.50',  pct: '+0.65%', up: true  },
            { label: 'Iron Ore', value: '$108.50', pct: '-2.08%', up: false },
            { label: 'Rubber',   value: '$1.72/kg', pct: '+2.38%', up: true  },
            { label: 'Gold',     value: '$3,108',   pct: '+1.12%', up: true  },
            { label: 'Palm Oil', value: '$922/t',   pct: '-1.40%', up: false },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-[12px] font-semibold text-gray-900">{r.label}</span>
              <div className="text-right">
                <div className="text-[12px] tabular-nums text-gray-900">{r.value}</div>
                <div className={`text-[11px] font-bold tabular-nums ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>{r.pct}</div>
              </div>
            </div>
          ))}
          <Link href="/economy" className="mt-3 block text-center text-[12px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Full markets ›</Link>
        </div>

        {/* In Focus topics */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-[12px] font-bold text-gray-900 mb-3">In Focus</h3>
          <div className="flex flex-wrap gap-2">
            {['Iron Ore', 'LRD/USD', 'Rubber', 'CBL Rate', 'Remittances', 'ECOWAS', 'Mining Policy', 'Inflation', 'Gold', 'ESG Bonds'].map(t => (
              <Link key={t} href="/news" className="rounded-lg border border-gray-300 px-4 py-1.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors no-underline">{t}</Link>
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
          <h3 className="text-[12px] font-bold text-gray-900 mb-1">TrueRate Daily Brief</h3>
          <p className="text-[12px] text-gray-500 mb-3">Liberia business & economy, delivered every morning.</p>
          <input type="email" placeholder="Email address"
            className="w-full rounded-lg bg-gray-100 border border-gray-200 px-3 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors mb-2" />
          <button className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-[13px] font-semibold text-gray-900 hover:bg-gray-50 transition">Sign up free</button>
        </div>

        {/* Upcoming events */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100">
            <h3 className="text-[12px] font-bold text-gray-900">Upcoming Events</h3>
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
              <Link key={i} href="/economy" className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                <div className="shrink-0 rounded-lg bg-gray-100 border border-gray-200 px-2 py-1 text-center min-w-[40px]">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{ev.date.split(' ')[0]}</p>
                  <p className="text-[14px] font-black text-gray-900 leading-none">{ev.date.split(' ')[1]}</p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors leading-snug">{ev.label}</p>
                  <span className="mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase bg-gray-100 text-gray-500">{ev.type}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Most read */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100">
            <h3 className="text-[12px] font-bold text-gray-900">Most Read</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {newsItems.slice(0, 5).map((item, i) => (
              <Link key={item.id} href={`/news/${item.id}`} className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                <span className="shrink-0 text-[18px] font-black text-gray-300 tabular-nums w-5 leading-none pt-0.5">{i + 1}</span>
                <p className="text-[12px] font-bold leading-snug text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-3">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Compact site footer */}
        <div className="pt-2 pb-4">
          <div className="flex items-center justify-center gap-4 mb-3">
            {[
              { label: 'X',         href: '#', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              { label: 'Facebook',  href: '#', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              { label: 'Instagram', href: '#', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
              { label: 'YouTube',   href: '#', path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
            ].map(s => (
              <a key={s.label} href={s.href} className="text-gray-400 hover:text-gray-700 transition-colors" aria-label={s.label}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
            {['About', 'Advertise', 'Careers', 'Help', 'Feedback', 'Privacy', 'Terms'].map(l => (
              <Link key={l} href="/about" className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors no-underline">{l}</Link>
            ))}
          </div>
          <p className="text-center text-[11px] text-gray-400">© 2026 TrueRate. All rights reserved.</p>
        </div>

      </div>
    </aside>
  );
}
