import Link from 'next/link';

export default function PortfolioPage() {
  return (
    <main className="mx-auto max-w-[860px] px-4 py-16 text-center">
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#6001d2]/20">
          <svg className="h-8 w-8 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm6.75-9.75c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V19.875c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 019.75 19.875V3.375zm7.5 4.5c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v12c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-12z" />
          </svg>
        </div>
      </div>
      <h1 className="mb-3 text-[28px] font-black text-white">Your Portfolio</h1>
      <p className="mb-8 text-[15px] text-[#777]">Sign in to track your investments, monitor your watchlist, and get personalized market insights.</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/signin" className="rounded-full bg-[#6001d2] px-8 py-3 text-[14px] font-semibold text-white transition hover:bg-[#490099] no-underline">
          Sign in
        </Link>
        <Link href="/premium" className="rounded-full border border-[#6001d2] px-8 py-3 text-[14px] font-semibold text-[#a78bfa] transition hover:bg-[#6001d2]/10 no-underline">
          Get Premium
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 text-left">
        {[
          { icon: '📈', title: 'Real-time tracking', desc: 'Monitor your holdings with live prices and P&L calculations.' },
          { icon: '🔔', title: 'Price alerts', desc: 'Get notified when stocks hit your target prices.' },
          { icon: '📊', title: 'Performance analytics', desc: 'See your portfolio allocation, returns, and risk profile.' },
        ].map(f => (
          <div key={f.title} className="rounded-lg border border-[#2a2a2a] bg-[#161618] p-5">
            <div className="mb-2 text-[24px]">{f.icon}</div>
            <h3 className="mb-1 text-[14px] font-bold text-white">{f.title}</h3>
            <p className="text-[13px] text-[#666]">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
