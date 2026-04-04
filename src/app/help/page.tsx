const FAQS = [
  { q: 'Is TrueRate free to use?', a: 'Yes. Core features including news, delayed market data, and the currency converter are free. Premium features such as real-time data and portfolio tracking require a subscription.' },
  { q: 'How delayed is the market data?', a: 'Free users receive 15-minute delayed prices. Premium subscribers get real-time data across all West African markets.' },
  { q: 'Where does TrueRate get its data?', a: 'Data is sourced from the Central Bank of Liberia, World Bank, IMF, Ghana Stock Exchange, BRVM, and licensed market data providers.' },
  { q: 'How do I report an error in the data?', a: 'Please use the Feedback page to report any data issues. Our team reviews all submissions within 24 hours.' },
  { q: 'Can I access TrueRate on mobile?', a: 'Yes. TrueRate is fully responsive and works on all modern mobile browsers. A dedicated app is coming soon.' },
  { q: 'How do I cancel my Premium subscription?', a: 'You can cancel at any time from your account settings. Your access continues until the end of the billing period.' },
];

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-[860px] px-4 py-12">
      <h1 className="mb-1 text-[24px] font-black text-white">Help Center</h1>
      <p className="mb-8 text-[13px] text-[#666]">Answers to common questions about TrueRate</p>

      <div className="space-y-3">
        {FAQS.map(faq => (
          <div key={faq.q} className="rounded-lg border border-[#2a2a2a] bg-[#161618] p-5">
            <h3 className="mb-2 text-[14px] font-bold text-white">{faq.q}</h3>
            <p className="text-[13px] leading-relaxed text-[#777]">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-[#2a2a2a] bg-[#161618] p-6 text-center">
        <h2 className="mb-2 text-[16px] font-bold text-white">Still need help?</h2>
        <p className="mb-4 text-[13px] text-[#777]">Send us a message and we&apos;ll get back to you within 24 hours.</p>
        <a href="/feedback" className="inline-block rounded-full bg-[#6001d2] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#490099] no-underline">
          Contact Support
        </a>
      </div>
    </main>
  );
}
