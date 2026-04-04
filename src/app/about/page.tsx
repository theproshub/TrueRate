import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[860px] px-4 py-12">
      <div className="mb-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2 no-underline mb-4">
          <span className="text-[28px] font-black text-white">TrueRate</span>
          <span className="rounded bg-[#6001d2] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">Liberia</span>
        </Link>
        <h1 className="mt-4 text-[28px] font-black text-white">About TrueRate</h1>
        <p className="mt-3 text-[15px] text-[#777]">Liberia&apos;s dedicated financial news, data, and markets platform.</p>
      </div>

      <div className="space-y-8 text-[15px] leading-relaxed text-[#ccc]">
        <section>
          <h2 className="mb-3 text-[18px] font-bold text-white">Our Mission</h2>
          <p>TrueRate was built to bring transparent, accessible financial information to Liberians and the wider West African investment community. We believe that quality market data and reliable economic analysis should be freely available to everyone — not just institutional investors.</p>
        </section>

        <section>
          <h2 className="mb-3 text-[18px] font-bold text-white">What We Cover</h2>
          <ul className="space-y-2 list-none">
            {['Liberian Dollar (LRD) exchange rates and Central Bank of Liberia policy', 'West African equity markets including BRVM and Ghana Stock Exchange', 'Liberian export commodities: rubber, iron ore, gold, palm oil, timber', 'Macroeconomic indicators, GDP data, and fiscal policy', 'Corporate earnings from Liberian and regional companies'].map(item => (
              <li key={item} className="flex items-start gap-2">
                <svg className="mt-1 h-4 w-4 shrink-0 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-[18px] font-bold text-white">Data Sources</h2>
          <p>TrueRate sources data from the Central Bank of Liberia (CBL), World Bank, International Monetary Fund (IMF), Ghana Stock Exchange (GSE), BRVM, and licensed market data providers. Prices are delayed 15 minutes for free users and real-time for Premium subscribers.</p>
        </section>

        <section>
          <h2 className="mb-3 text-[18px] font-bold text-white">Disclaimer</h2>
          <p className="text-[#777]">TrueRate provides financial information for educational purposes only. Nothing on this site constitutes investment advice. Always conduct your own research or consult a licensed financial advisor before making investment decisions.</p>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap gap-3 border-t border-[#222] pt-8">
        {[
          { label: 'Help Center', href: '/help' },
          { label: 'Feedback', href: '/feedback' },
          { label: 'Privacy Policy', href: '/about' },
          { label: 'Terms of Service', href: '/about' },
        ].map(l => (
          <Link key={l.label} href={l.href} className="rounded-lg border border-[#2a2a2a] px-4 py-2 text-[13px] text-[#777] no-underline hover:text-[#a78bfa] hover:border-[#6001d2]/40 transition-colors">
            {l.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
