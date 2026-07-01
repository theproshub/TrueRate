import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Integrity Reports',
  alternates: { canonical: '/reports' },
  description:
    'TrueRate Data Systems publishes data integrity reports documenting anomalies found in the CBL DataWarehousePro API through automated quality-assurance monitoring.',
};

const REPORTS = [
  {
    ref: 'TR-DI-2026-002',
    title: 'Multiple Series Anomalies — INR, FIS, BOP, MON, PRO Databanks',
    date: 'July 1, 2026',
    severity: 'Critical',
    series: 24,
    summary:
      'Interest rate LRD/USD column duplication, government budget hierarchy violation, BOP remittance mis-classification, fiscal velocity spikes, monetary survey balance-sheet anomalies, and CPO unit-of-measure error.',
    href: '/cbl-data-integrity-report-002.html',
  },
  {
    ref: 'TR-DI-2026-001',
    title: 'Monetary Policy Rate Series (LBR_INR_MPR_1)',
    date: 'June 28, 2026',
    severity: 'High',
    series: 1,
    summary:
      'A 5-basis-point data-entry error in the April 2025 MPR observation (17.30 recorded instead of 17.25) cascaded forward through 14 monthly observations.',
    href: '/cbl-data-integrity-report.html',
  },
] as const;

function SeverityBadge({ level }: { level: string }) {
  const color =
    level === 'Critical'
      ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';
  return (
    <span
      className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${color}`}
    >
      {level}
    </span>
  );
}

export default function ReportsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-[860px] px-6 sm:px-10 pt-8 pb-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-5">
            TrueRate Data Systems
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 mb-4">
            Data Integrity Reports
          </h1>
          <p className="text-lg text-gray-600 leading-[1.8] max-w-[640px]">
            We monitor the CBL DataWarehousePro API through automated
            quality-assurance checks. When anomalies are detected, we publish
            formal reports documenting the findings and recommended corrections.
          </p>
        </div>
      </div>

      {/* Reports list */}
      <div className="mx-auto max-w-[860px] px-6 sm:px-10 py-10 space-y-6">
        {REPORTS.map((r) => (
          <article
            key={r.ref}
            className="border border-gray-200 rounded-lg p-6 sm:p-8 hover:border-gray-300 transition-colors"
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <SeverityBadge level={r.severity} />
              <span className="text-xs font-mono text-gray-400">{r.ref}</span>
              <span className="text-xs text-gray-400">{r.date}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-snug">
              {r.title}
            </h2>

            <p className="text-[15px] text-gray-600 leading-relaxed mb-5">
              {r.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#002868] rounded-md hover:bg-[#001a4a] transition-colors focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none no-underline"
              >
                <svg
                  aria-hidden="true"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
                View Report
              </a>
              <a
                href={r.href}
                download
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none no-underline"
              >
                <svg
                  aria-hidden="true"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
                  />
                </svg>
                Download HTML
              </a>
              <span className="text-xs text-gray-400">
                {r.series} series affected
              </span>
            </div>
          </article>
        ))}

        {/* Methodology note */}
        <div className="border-t border-gray-100 pt-8 mt-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
            Methodology
          </h3>
          <p className="text-[15px] text-gray-600 leading-relaxed max-w-[640px]">
            Reports are generated through automated data-quality monitoring of
            the CBL DataWarehousePro API. Checks include parent-child accounting
            identity validation, currency-pair spread analysis, 25bp grid
            compliance for policy rates, velocity bounds on flow variables,
            Z-score outlier detection, and cross-series consistency tests.
          </p>
          <p className="text-[15px] text-gray-600 leading-relaxed max-w-[640px] mt-3">
            For questions about these reports, contact{' '}
            <strong>datasystems@truerateliberia.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
