import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import EconomyTopicTabs from '@/components/EconomyTopicTabs';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import { getNewsItems } from '@/lib/news-source';
import { timeAgo } from '@/lib/utils';
import { ECONOMY_TOPIC_BY_SLUG, ECONOMY_TOPICS } from '@/lib/economy-topics';
import {
  getCpiData,
  getExchangeRateData,
  getGdpData,
  getFiscalData,
  getTradeData,
} from '@/lib/data/cbl-observations';
import { getCblPolicyRate } from '@/lib/data/cbl-rate';
import dynamic from 'next/dynamic';

const TrendChart = dynamic(
  () => import('@/components/analytics/terminal/TrendChart'),
  { loading: () => <div className="h-[200px] w-full animate-pulse rounded bg-white" /> },
);

export const revalidate = 0; // always read the latest articles + live CBL data from the DB

export function generateStaticParams() {
  return ECONOMY_TOPICS.map(t => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = ECONOMY_TOPIC_BY_SLUG[slug];
  if (!topic) return { title: 'Economy — TrueRate' };
  return {
    title: `${topic.label} — Economy | TrueRate`,
    description: topic.blurb,
  };
}

function StatCell({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-2xs uppercase tracking-[0.14em] text-gray-500 font-medium">{label}</span>
      <span className="text-xl sm:text-2xl font-bold tabular-nums text-gray-900 leading-none">{value}</span>
      {sub && <span className="text-xs text-gray-500 mt-0.5">{sub}</span>}
    </div>
  );
}

/** Format a USD million value for display. */
function fmtM(v: number): string {
  return `$${v.toLocaleString('en-US', { maximumFractionDigits: 1 })}M`;
}

export default async function EconomyTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const topic = ECONOMY_TOPIC_BY_SLUG[slug];
  if (!topic) notFound();

  const items = (await getNewsItems())
    .filter(topic.matches)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  // Fetch CBL data only for topics that display it.
  const [cpi, exr, gdp, fiscal, trade, policyRate] = await Promise.all([
    slug === 'inflation' ? getCpiData(24) : Promise.resolve(null),
    slug === 'monetary-policy' ? getExchangeRateData(24) : Promise.resolve(null),
    slug === 'growth' ? getGdpData(15) : Promise.resolve(null),
    slug === 'fiscal' ? getFiscalData(24) : Promise.resolve(null),
    slug === 'trade' ? getTradeData(20) : Promise.resolve(null),
    slug === 'monetary-policy' ? getCblPolicyRate() : Promise.resolve(null),
  ]);

  return (
    <main className="mx-auto max-w-container px-4 py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Economy', href: '/economy' }, { label: topic.label }]} />

      <EconomyTopicTabs activeSlug={topic.slug} />

      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-accent-ink mb-2">Economy &middot; {topic.label}</p>
        <h1 className="text-3xl sm:text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 mb-3">{topic.label}</h1>
        <p className="text-md text-gray-600 leading-relaxed max-w-[720px]">{topic.blurb}</p>
        <p className="mt-3 text-sm text-gray-500 tabular-nums">
          {items.length} {items.length === 1 ? 'story' : 'stories'} matched from the TrueRate newsroom.
        </p>
      </header>

      {/* ── Inflation data panel ─────────────────────────────────────────── */}
      {slug === 'inflation' && cpi && (
        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-5" aria-label="Liberia CPI data">
          <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
            <div>
              <p className="text-2xs font-bold uppercase tracking-[0.16em] text-brand-accent-ink mb-1">
                CBL Statistical Data &middot; Harmonized CPI
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Consumer Price Index for Liberia (LBR_CPI_0), sourced from the Central Bank of Liberia DataWarehousePro. Monthly series.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-8 mb-6">
            {cpi.latest ? (
              <StatCell
                label="Latest CPI"
                value={cpi.latest.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                sub={cpi.period ? `As of ${cpi.period}` : undefined}
              />
            ) : null}
            {cpi.yoy !== null ? (
              <StatCell
                label="Year-on-Year"
                value={`${cpi.yoy > 0 ? '+' : ''}${cpi.yoy.toFixed(2)}%`}
                sub="12-month change"
              />
            ) : null}
          </div>

          {cpi.points.length >= 2 ? (
            <>
              <p className="sr-only">
                Chart showing Liberia harmonized CPI over the past {cpi.points.length} months.
                {cpi.yoy !== null
                  ? ` Year-on-year change: ${cpi.yoy > 0 ? '+' : ''}${cpi.yoy.toFixed(2)}%.`
                  : ''}
              </p>
              <TrendChart points={cpi.points} unit="index" height={200} />
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">Chart data unavailable — sync pending.</p>
          )}

          <p className="mt-3 text-2xs text-gray-600">
            Source: Central Bank of Liberia DataWarehousePro · Updated nightly
          </p>
        </section>
      )}

      {/* ── Monetary policy data panel ───────────────────────────────────── */}
      {slug === 'monetary-policy' && (
        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-5" aria-label="CBL monetary policy data">
          <div className="mb-5">
            <p className="text-2xs font-bold uppercase tracking-[0.16em] text-brand-accent-ink mb-1">
              CBL Statistical Data &middot; Monetary Policy
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              CBL benchmark rate and USD/LRD end-of-period exchange rate, sourced from the Central Bank of Liberia.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-8 mb-6">
            <StatCell
              label="Policy Rate"
              value={`${(policyRate?.value ?? 0).toFixed(2)}%`}
              sub={`MPC · ${policyRate?.period ?? ''}`}
            />
            {exr?.latest ? (
              <StatCell
                label="USD/LRD Rate"
                value={exr.latest.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                sub={`End-of-period · ${exr.latest.date.slice(0, 7)}`}
              />
            ) : null}
          </div>

          {exr && exr.points.length >= 2 ? (
            <>
              <p className="sr-only">
                Chart showing USD to Liberian dollar end-of-period exchange rate over the past {exr.points.length} months.
                {exr.latest ? ` Most recent rate: ${exr.latest.value} LRD per USD.` : ''}
              </p>
              <TrendChart points={exr.points} unit="LRD" height={200} />
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">Chart data unavailable — sync pending.</p>
          )}

          <p className="mt-3 text-2xs text-gray-600">
            Source: Central Bank of Liberia DataWarehousePro · Updated nightly
          </p>
        </section>
      )}

      {/* ── Growth data panel ────────────────────────────────────────────── */}
      {slug === 'growth' && gdp && (
        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-5" aria-label="Liberia GDP data">
          <div className="mb-5">
            <p className="text-2xs font-bold uppercase tracking-[0.16em] text-brand-accent-ink mb-1">
              CBL Statistical Data &middot; National Accounts
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Gross domestic product at market prices (LBR_NAT_0) and constant 1992 prices (LBR_NAT_00). Annual series.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-8 mb-6">
            {gdp.nominal.latest ? (
              <StatCell
                label="Nominal GDP"
                value={fmtM(gdp.nominal.latest.value)}
                sub={gdp.nominal.latest.date.slice(0, 4)}
              />
            ) : null}
            {gdp.real.latest ? (
              <StatCell
                label="Real GDP (1992 prices)"
                value={fmtM(gdp.real.latest.value)}
                sub={gdp.real.latest.date.slice(0, 4)}
              />
            ) : null}
          </div>

          {gdp.nominal.points.length >= 2 ? (
            <>
              <p className="sr-only">
                Chart showing Liberia nominal GDP over {gdp.nominal.points.length} years.
                {gdp.nominal.latest ? ` Most recent: ${fmtM(gdp.nominal.latest.value)} in ${gdp.nominal.latest.date.slice(0, 4)}.` : ''}
              </p>
              <TrendChart points={gdp.nominal.points} unit="M USD" height={200} />
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">Chart data unavailable — sync pending.</p>
          )}

          <p className="mt-3 text-2xs text-gray-600">
            Source: Central Bank of Liberia DataWarehousePro · Updated nightly
          </p>
        </section>
      )}

      {/* ── Fiscal data panel ────────────────────────────────────────────── */}
      {slug === 'fiscal' && fiscal && (
        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-5" aria-label="Liberia fiscal data">
          <div className="mb-5">
            <p className="text-2xs font-bold uppercase tracking-[0.16em] text-brand-accent-ink mb-1">
              CBL Statistical Data &middot; Government Finance
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Total government debt (LBR_FIS_DEBT_1), revenue, and expenditure. Monthly series, million USD.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-8 mb-6">
            {fiscal.debt.latest ? (
              <StatCell
                label="Total Govt Debt"
                value={fmtM(fiscal.debt.latest.value)}
                sub={fiscal.debt.latest.date.slice(0, 7)}
              />
            ) : null}
            {fiscal.revenue ? (
              <StatCell
                label="Total Revenue"
                value={fmtM(fiscal.revenue.value)}
                sub={fiscal.revenue.date.slice(0, 7)}
              />
            ) : null}
            {fiscal.expenditure ? (
              <StatCell
                label="Total Expenditure"
                value={fmtM(fiscal.expenditure.value)}
                sub={fiscal.expenditure.date.slice(0, 7)}
              />
            ) : null}
          </div>

          {fiscal.debt.points.length >= 2 ? (
            <>
              <p className="sr-only">
                Chart showing Liberia total government debt over the past {fiscal.debt.points.length} months.
                {fiscal.debt.latest ? ` Most recent: ${fmtM(fiscal.debt.latest.value)}.` : ''}
              </p>
              <TrendChart points={fiscal.debt.points} unit="M USD" height={200} />
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">Chart data unavailable — sync pending.</p>
          )}

          <p className="mt-3 text-2xs text-gray-600">
            Source: Central Bank of Liberia DataWarehousePro · Updated nightly
          </p>
        </section>
      )}

      {/* ── Trade data panel ─────────────────────────────────────────────── */}
      {slug === 'trade' && trade && (
        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-5" aria-label="Liberia trade data">
          <div className="mb-5">
            <p className="text-2xs font-bold uppercase tracking-[0.16em] text-brand-accent-ink mb-1">
              CBL Statistical Data &middot; Balance of Payments
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Goods trade balance (LBR_BOP_1_4) with export and import flows. Quarterly series, million USD.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-8 mb-6">
            {trade.balance.latest ? (
              <StatCell
                label="Trade Balance"
                value={fmtM(trade.balance.latest.value)}
                sub={trade.balance.latest.date.slice(0, 7)}
              />
            ) : null}
            {trade.exports ? (
              <StatCell
                label="Goods Exports"
                value={fmtM(trade.exports.value)}
                sub={trade.exports.date.slice(0, 7)}
              />
            ) : null}
            {trade.imports ? (
              <StatCell
                label="Goods Imports"
                value={fmtM(Math.abs(trade.imports.value))}
                sub={trade.imports.date.slice(0, 7)}
              />
            ) : null}
          </div>

          {trade.balance.points.length >= 2 ? (
            <>
              <p className="sr-only">
                Chart showing Liberia goods trade balance over {trade.balance.points.length} quarters.
                {trade.balance.latest ? ` Most recent: ${fmtM(trade.balance.latest.value)}.` : ''}
              </p>
              <TrendChart points={trade.balance.points} unit="M USD" height={200} />
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">Chart data unavailable — sync pending.</p>
          )}

          <p className="mt-3 text-2xs text-gray-600">
            Source: Central Bank of Liberia DataWarehousePro · Updated nightly
          </p>
        </section>
      )}

      {items.length === 0 ? (
        <section className="border-t border-gray-200 pt-6 pb-10 text-center">
          <p className="text-md text-gray-600 mb-2">No published stories tagged for this topic yet.</p>
          <p className="text-base text-gray-500 mb-6">Browse the newsroom or check back as coverage develops.</p>
          <Link href="/news" className="inline-block rounded-lg bg-brand-accent px-5 py-2.5 text-base font-bold text-brand-accent-ink hover:bg-brand-accent-hover transition-colors no-underline">
            All news
          </Link>
        </section>
      ) : (
        <section aria-label={`${topic.label} stories`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {items.map(item => (
            <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col no-underline">
              <div className="overflow-hidden rounded-xl mb-3">
                <NewsThumbnail category={item.category} src={item.image} className="w-full h-[170px]" />
              </div>
              <p className={`text-2xs font-bold uppercase tracking-widest mb-1.5 ${getCatColor(item.category)}`}>{item.category}</p>
              <h2 className="text-sm font-bold leading-snug text-gray-900 group-hover:underline decoration-1 underline-offset-2 line-clamp-3 mb-2">{item.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">{item.summary}</p>
              <div className="mt-auto text-xs text-gray-500">{item.source} &middot; {timeAgo(item.date)}</div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
