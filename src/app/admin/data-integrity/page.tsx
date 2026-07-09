import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ReviewForm from './_components/ReviewForm';

export const metadata = { title: 'Data Integrity — TrueRate Admin' };

interface Finding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  series_mnemonic: string | null;
  period_label: string | null;
  affected_slugs: string[];
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  resolution_note: string | null;
  created_at: string;
  resolved_at: string | null;
}

const SEVERITY_STYLE: Record<Finding['severity'], string> = {
  critical: 'bg-neg/10 text-neg border-neg/30',
  high: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  medium: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  low: 'bg-gray-500/10 text-gray-600 border-gray-300',
};

// Formal data-integrity reports submitted to the CBL Statistics Department.
// The rendered HTML lives in /public and is linked directly (static, not gated),
// so a report link can still be shared with the CBL even though this index now
// lives inside the admin area.
interface PublishedReport {
  ref: string;
  title: string;
  date: string;
  severity: Finding['severity'];
  series: number;
  summary: string;
  href: string;
}

const PUBLISHED_REPORTS: PublishedReport[] = [
  {
    ref: 'TR-DI-2026-002',
    title: 'Multiple Series Anomalies — INR, FIS, BOP, MON, PRO Databanks',
    date: 'July 1, 2026',
    severity: 'critical',
    series: 24,
    summary:
      'Interest rate LRD/USD column duplication, government budget hierarchy violation, BOP remittance mis-classification, fiscal velocity spikes, monetary survey balance-sheet anomalies, and CPO unit-of-measure error.',
    href: '/cbl-data-integrity-report-002.html',
  },
  {
    ref: 'TR-DI-2026-001',
    title: 'Monetary Policy Rate Series (LBR_INR_MPR_1)',
    date: 'June 28, 2026',
    severity: 'high',
    series: 1,
    summary:
      'A 5-basis-point data-entry error in the April 2025 MPR observation (17.30 recorded instead of 17.25) cascaded forward through 14 monthly observations.',
    href: '/cbl-data-integrity-report.html',
  },
];

function shortDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function DataIntegrityPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('data_integrity_findings')
    .select(
      'id, severity, title, detail, series_mnemonic, period_label, affected_slugs, status, resolution_note, created_at, resolved_at',
    )
    .order('created_at', { ascending: false });

  const findings = (data ?? []) as Finding[];
  const open = findings.filter((f) => f.status === 'open' || f.status === 'reviewing');
  const closed = findings.filter((f) => f.status === 'resolved' || f.status === 'dismissed');

  return (
    <div className="mx-auto max-w-container space-y-8 px-4 py-8">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-white">Data integrity</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-400">
          Discrepancies between TrueRate&rsquo;s verification pipeline and the CBL data
          warehouse. The warehouse is never edited — findings are reviewed here, and
          affected articles stay <strong className="text-gray-300">pending</strong> until a
          finding is resolved or dismissed. Formal reports submitted to the CBL are
          published below.
        </p>
      </header>

      {error && (
        <p role="alert" className="rounded-lg border border-neg/30 bg-neg/[0.06] p-3 text-sm text-neg">
          Could not load findings: {error.message}. Has migration 022 been run in the
          Supabase SQL editor?
        </p>
      )}

      <section aria-labelledby="open-findings-heading">
        <h2
          id="open-findings-heading"
          className="mb-3 text-2xs font-bold uppercase tracking-[0.12em] text-gray-500"
        >
          Needs review ({open.length})
        </h2>
        {open.length === 0 && !error && (
          <p className="rounded-2xl border border-gray-200 bg-brand-card px-5 py-4 text-sm text-gray-500">
            No open findings. The pipeline and the warehouse agree.
          </p>
        )}
        <ul className="space-y-4">
          {open.map((f) => (
            <li key={f.id} className="rounded-2xl border border-gray-200 bg-brand-card px-5 py-4">
              <FindingCard finding={f} withReview />
            </li>
          ))}
        </ul>
      </section>

      {closed.length > 0 && (
        <section aria-labelledby="closed-findings-heading">
          <h2
            id="closed-findings-heading"
            className="mb-3 text-2xs font-bold uppercase tracking-[0.12em] text-gray-500"
          >
            Closed ({closed.length})
          </h2>
          <ul className="space-y-4">
            {closed.map((f) => (
              <li key={f.id} className="rounded-2xl border border-gray-200 bg-brand-card px-5 py-4 opacity-80">
                <FindingCard finding={f} withReview />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="published-reports-heading">
        <h2
          id="published-reports-heading"
          className="mb-1 text-2xs font-bold uppercase tracking-[0.12em] text-gray-500"
        >
          Published reports ({PUBLISHED_REPORTS.length})
        </h2>
        <p className="mb-3 max-w-2xl text-xs text-gray-500">
          Formal reports submitted to the CBL Statistics Department. Report links are
          public static files, so they can be shared directly with the CBL.
        </p>
        <ul className="space-y-4">
          {PUBLISHED_REPORTS.map((r) => (
            <li key={r.ref} className="rounded-2xl border border-gray-200 bg-brand-card px-5 py-4">
              <ReportCard report={r} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ReportCard({ report: r }: { report: PublishedReport }) {
  return (
    <article aria-label={r.title}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wide ${SEVERITY_STYLE[r.severity]}`}
        >
          {r.severity}
        </span>
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">{r.ref}</code>
        <span className="text-xs text-gray-500">{r.series} series affected</span>
        <span className="ml-auto text-xs text-gray-500">{r.date}</span>
      </div>

      <h3 className="mt-2 text-base font-bold text-gray-900">{r.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-600">{r.summary}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <a
          href={r.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
        >
          View report
        </a>
        <a
          href={r.href}
          download
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
        >
          Download HTML
        </a>
      </div>
    </article>
  );
}

function FindingCard({ finding: f, withReview }: { finding: Finding; withReview?: boolean }) {
  return (
    <article aria-label={f.title}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wide ${SEVERITY_STYLE[f.severity]}`}
        >
          {f.severity}
        </span>
        <span className="text-2xs font-bold uppercase tracking-wide text-gray-500">
          {f.status}
        </span>
        {f.series_mnemonic && (
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">
            {f.series_mnemonic}
            {f.period_label ? ` · ${f.period_label}` : ''}
          </code>
        )}
        <span className="ml-auto text-xs text-gray-500">
          filed {shortDate(f.created_at)}
          {f.resolved_at ? ` · closed ${shortDate(f.resolved_at)}` : ''}
        </span>
      </div>

      <h3 className="mt-2 text-base font-bold text-gray-900">{f.title}</h3>

      <details className="mt-2">
        <summary className="cursor-pointer text-sm font-semibold text-gray-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink">
          Evidence
        </summary>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-800">
          {f.detail}
        </pre>
      </details>

      {f.affected_slugs.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          Affected articles:{' '}
          {f.affected_slugs.map((slug, i) => (
            <span key={slug}>
              {i > 0 && ', '}
              <Link
                href={`/news/${slug}`}
                className="text-brand-accent-ink underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
              >
                {slug}
              </Link>
            </span>
          ))}
        </p>
      )}

      {f.resolution_note && (
        <p className="mt-2 text-sm text-gray-600">
          <strong>Resolution note:</strong> {f.resolution_note}
        </p>
      )}

      {withReview && (
        <ReviewForm id={f.id} status={f.status} resolutionNote={f.resolution_note} />
      )}
    </article>
  );
}
