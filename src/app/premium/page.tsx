import Link from 'next/link';

const FEATURES = [
  { title: 'Real-time data', desc: 'Live prices with no delay across all West African markets.' },
  { title: 'Advanced screener', desc: 'Filter by 30+ criteria including P/E, EV/EBITDA, and sector.' },
  { title: 'Portfolio analytics', desc: 'Full P&L, allocation breakdowns, and risk scoring.' },
  { title: 'Earnings alerts', desc: 'Get notified before and after earnings with AI-generated summaries.' },
  { title: 'CBL policy tracker', desc: 'Real-time central bank decisions and rate forecasts.' },
  { title: 'Ad-free experience', desc: 'Clean, distraction-free reading across all devices.' },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['15-min delayed data', 'News & headlines', 'Basic screener', 'Currency converter'],
    cta: 'Current plan',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$9',
    period: 'per month',
    features: ['Real-time data', 'Full screener', 'Portfolio tracking', 'Price alerts', 'Ad-free', 'CBL rate tracker'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    features: ['Everything in Premium', 'API access', 'Earnings call transcripts', 'Priority support', 'Custom watchlists', 'Export to CSV'],
    cta: 'Get Pro',
    highlight: false,
  },
];

export default function PremiumPage() {
  return (
    <main className="mx-auto max-w-[1280px] px-4 py-12">
      <div className="mb-12 text-center">
        <span className="mb-3 inline-block rounded-full bg-[#6001d2]/30 px-4 py-1 text-[12px] font-bold uppercase tracking-widest text-[#a78bfa]">Premium</span>
        <h1 className="text-[32px] font-black text-white">Liberia&apos;s most trusted financial data</h1>
        <p className="mt-3 text-[15px] text-[#777]">Get the full TrueRate experience with real-time data and professional tools.</p>
      </div>

      {/* Plans */}
      <div className="mb-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {PLANS.map(plan => (
          <div key={plan.name} className={`rounded-xl border p-6 ${plan.highlight ? 'border-[#6001d2] bg-[#6001d2]/10 ring-1 ring-[#6001d2]/40' : 'border-[#2a2a2a] bg-[#161618]'}`}>
            {plan.highlight && (
              <span className="mb-3 inline-block rounded-full bg-[#6001d2] px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-white">Most popular</span>
            )}
            <h2 className="text-[18px] font-bold text-white">{plan.name}</h2>
            <div className="mt-2 flex items-end gap-1">
              <span className="text-[32px] font-black text-white">{plan.price}</span>
              <span className="mb-1.5 text-[13px] text-[#666]">/{plan.period}</span>
            </div>
            <ul className="my-5 space-y-2">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-[13px] text-[#ccc]">
                  <svg className="h-4 w-4 shrink-0 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full rounded-lg py-2.5 text-[14px] font-semibold transition ${plan.highlight ? 'bg-[#6001d2] text-white hover:bg-[#490099]' : 'border border-[#2a2a2a] bg-transparent text-[#777] hover:text-white hover:border-[#555]'}`}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Feature list */}
      <div className="border-t border-[#222] pt-12">
        <h2 className="mb-6 text-center text-[20px] font-bold text-white">What you get with Premium</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(f => (
            <div key={f.title} className="rounded-lg border border-[#2a2a2a] bg-[#161618] p-5">
              <h3 className="mb-1.5 text-[14px] font-bold text-white">{f.title}</h3>
              <p className="text-[13px] text-[#666]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[13px] text-[#555]">Already have an account? <Link href="/signin" className="text-[#a78bfa] no-underline hover:underline">Sign in</Link></p>
      </div>
    </main>
  );
}
