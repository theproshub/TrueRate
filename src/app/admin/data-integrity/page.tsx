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
          finding is resolved or dismissed.
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
    </div>
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
