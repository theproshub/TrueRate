import Link from 'next/link';

const TOOLS = [
  { title: 'Currency Converter', desc: 'Convert between LRD, USD, EUR, GBP, GHS, NGN and more.', href: '/forex', icon: '💱' },
  { title: 'Stock Screener', desc: 'Find investment opportunities across West African exchanges.', href: '/screener', icon: '🔍' },
  { title: 'Earnings Calendar', desc: 'Track upcoming earnings from Liberian and regional companies.', href: '/earnings', icon: '📅' },
  { title: 'Economic Dashboard', desc: 'GDP, inflation, CBL rates and more economic indicators.', href: '/economy', icon: '📊' },
];

const ARTICLES = [
  { title: 'How to invest in West African stocks as a Liberian resident', cat: 'Investing', time: '5 min read' },
  { title: 'Understanding LRD exchange rate risk for importers', cat: 'Forex', time: '4 min read' },
  { title: 'CBL savings rates vs. mobile money: which is better in 2026?', cat: 'Savings', time: '3 min read' },
  { title: 'Diaspora guide: sending money home to Liberia affordably', cat: 'Remittances', time: '6 min read' },
  { title: 'First-time investor guide: buying stocks through LSEM', cat: 'Investing', time: '7 min read' },
];

const CAT_COLORS: Record<string, string> = {
  Investing:    'text-[#a78bfa]',
  Forex:        'text-[#60a5fa]',
  Savings:      'text-[#34d399]',
  Remittances:  'text-[#fbbf24]',
};

export default function PersonalFinancePage() {
  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8">
      <h1 className="mb-1 text-[24px] font-black text-white">Personal Finance</h1>
      <p className="mb-8 text-[13px] text-[#666]">Tools, guides, and calculators to manage your money in Liberia</p>

      {/* Tools */}
      <section className="mb-10">
        <h2 className="mb-4 text-[15px] font-bold text-white">Financial Tools</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map(t => (
            <Link key={t.title} href={t.href} className="group rounded-lg border border-[#2a2a2a] bg-[#161618] p-5 no-underline transition hover:border-[#6001d2]/50 hover:bg-[#1c1c1e]">
              <div className="mb-3 text-[28px]">{t.icon}</div>
              <h3 className="mb-1 text-[14px] font-bold text-white group-hover:text-[#a78bfa] transition-colors">{t.title}</h3>
              <p className="text-[12px] text-[#666]">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section>
        <h2 className="mb-4 text-[15px] font-bold text-white">Finance Guides</h2>
        <div className="flex flex-col gap-2">
          {ARTICLES.map(a => (
            <div key={a.title} className="flex items-center justify-between gap-4 rounded-lg border border-[#2a2a2a] bg-[#161618] px-5 py-4 hover:bg-[#1c1c1e] transition-colors cursor-pointer">
              <div>
                <span className={`text-[11px] font-bold uppercase tracking-wide ${CAT_COLORS[a.cat] ?? 'text-[#a78bfa]'}`}>{a.cat}</span>
                <h3 className="mt-0.5 text-[14px] font-semibold text-white hover:text-[#a78bfa] transition-colors">{a.title}</h3>
              </div>
              <span className="shrink-0 text-[12px] text-[#555]">{a.time}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 rounded-lg border border-[#6001d2]/40 bg-[#6001d2]/10 p-6 text-center">
        <h2 className="mb-2 text-[16px] font-bold text-white">Get personalized advice</h2>
        <p className="mb-4 text-[13px] text-[#777]">Sign up for Premium to access portfolio tracking and personalized financial insights.</p>
        <Link href="/premium" className="inline-block rounded-full bg-[#6001d2] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#490099] no-underline">
          Get Premium
        </Link>
      </div>
    </main>
  );
}
