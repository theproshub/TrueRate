import { describe, it, expect } from 'vitest';
import {
  diffSeries,
  diffCatalog,
  describeFinding,
  formatReleaseNotice,
  loadObservationIndex,
  type ObservationIndex,
  type ScrapedRow,
} from '@/lib/jobs/cbl-releases';

const row = (period_date: string, value: number | null, label = 'Jun-26'): ScrapedRow => ({
  mnemonic: 'LBR_CPI_0',
  period_date,
  period_label: label,
  value,
});

describe('diffSeries', () => {
  it('reports an absent key as a new period', () => {
    const index: ObservationIndex = new Map();
    const out = diffSeries(index, 'LBR_CPI_0', [row('2026-06-01', 822.59)]);
    expect(out).toEqual([
      {
        kind: 'new_period',
        mnemonic: 'LBR_CPI_0',
        period_date: '2026-06-01',
        period_label: 'Jun-26',
        old_value: null,
        new_value: 822.59,
      },
    ]);
  });

  it('reports a changed value as a revision carrying the old value', () => {
    const index: ObservationIndex = new Map([['LBR_CPI_0|2026-06-01', 822.59]]);
    const out = diffSeries(index, 'LBR_CPI_0', [row('2026-06-01', 823.4)]);
    expect(out).toHaveLength(1);
    expect(out[0].kind).toBe('revision');
    expect(out[0].old_value).toBe(822.59);
    expect(out[0].new_value).toBe(823.4);
  });

  it('reports nothing when the value is unchanged', () => {
    const index: ObservationIndex = new Map([['LBR_CPI_0|2026-06-01', 822.59]]);
    expect(diffSeries(index, 'LBR_CPI_0', [row('2026-06-01', 822.59)])).toEqual([]);
  });

  it('treats a sub-epsilon difference as unchanged', () => {
    const index: ObservationIndex = new Map([['LBR_CPI_0|2026-06-01', 822.59]]);
    expect(diffSeries(index, 'LBR_CPI_0', [row('2026-06-01', 822.59 + 1e-12)])).toEqual([]);
  });

  it('treats null -> value as a revision', () => {
    const index: ObservationIndex = new Map([['LBR_CPI_0|2026-06-01', null]]);
    const out = diffSeries(index, 'LBR_CPI_0', [row('2026-06-01', 822.59)]);
    expect(out[0].kind).toBe('revision');
    expect(out[0].old_value).toBeNull();
  });

  it('treats value -> null as a revision', () => {
    const index: ObservationIndex = new Map([['LBR_CPI_0|2026-06-01', 822.59]]);
    const out = diffSeries(index, 'LBR_CPI_0', [row('2026-06-01', null)]);
    expect(out[0].kind).toBe('revision');
    expect(out[0].new_value).toBeNull();
  });

  it('treats null -> null as unchanged', () => {
    const index: ObservationIndex = new Map([['LBR_CPI_0|2026-06-01', null]]);
    expect(diffSeries(index, 'LBR_CPI_0', [row('2026-06-01', null)])).toEqual([]);
  });
});

describe('diffCatalog', () => {
  it('reports a known series absent from the catalog as missing', () => {
    const out = diffCatalog(new Set(['A', 'B']), new Set(['A']), new Map());
    expect(out).toEqual([
      {
        kind: 'series_missing',
        mnemonic: 'B',
        detail: 'in cbl_series but absent from the scraped catalog',
      },
    ]);
  });

  it('reports a previously-synced series that failed today as a regression', () => {
    const out = diffCatalog(
      new Set(['A']),
      new Set(['A']),
      new Map([['A', 'portal fetch: HTTP 502']]),
    );
    expect(out).toEqual([
      {
        kind: 'series_failed',
        mnemonic: 'A',
        detail: 'synced before, failed today: portal fetch: HTTP 502',
      },
    ]);
  });

  it('does not report a failure for a series never synced before', () => {
    const out = diffCatalog(
      new Set<string>(),
      new Set(['NEW']),
      new Map([['NEW', 'portal fetch: HTTP 500']]),
    );
    expect(out).toEqual([]);
  });

  it('reports nothing when the catalog is intact', () => {
    expect(diffCatalog(new Set(['A']), new Set(['A']), new Map())).toEqual([]);
  });
});

describe('describeFinding', () => {
  it('describes a new period with its value', () => {
    expect(
      describeFinding({
        kind: 'new_period',
        mnemonic: 'LBR_CPI_0',
        period_label: 'Jun-26',
        new_value: 822.59,
      }),
    ).toBe('Outdated — LBR_CPI_0 gained Jun-26 (822.59).');
  });

  it('describes a revision with both values', () => {
    expect(
      describeFinding({
        kind: 'revision',
        mnemonic: 'LBR_CPI_0',
        period_label: 'Jun-26',
        old_value: 822.59,
        new_value: 823.4,
      }),
    ).toBe('Outdated — LBR_CPI_0 Jun-26 restated 822.59 → 823.4.');
  });
});

describe('formatReleaseNotice', () => {
  it('returns undefined when there is nothing to report', () => {
    expect(formatReleaseNotice([])).toBeUndefined();
  });

  it('groups findings by kind with counts', () => {
    const notice = formatReleaseNotice([
      { kind: 'new_period', mnemonic: 'A', period_label: 'Jun-26', new_value: 1 },
      { kind: 'new_period', mnemonic: 'B', period_label: 'Jun-26', new_value: 2 },
      { kind: 'series_missing', mnemonic: 'C', detail: 'gone' },
    ])!;
    expect(notice).toContain('NEW PERIODS (2)');
    expect(notice).toContain('SERIES MISSING (1)');
    expect(notice).toContain('A');
  });

  it('caps each group at 15 entries and states the remainder', () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      kind: 'new_period' as const,
      mnemonic: `M${i}`,
      period_label: 'Jun-26',
      new_value: i,
    }));
    const notice = formatReleaseNotice(many)!;
    expect(notice).toContain('NEW PERIODS (20)');
    expect(notice).toContain('…and 5 more');
    expect(notice).not.toContain('M19');
  });
});

/**
 * Minimal Supabase stub that reproduces PostgREST's silent `max-rows` cap:
 * it returns at most `cap` rows no matter how large a range you request.
 */
function stubClient(total: number, cap: number) {
  // (mnemonic, period_date) must be unique per row — the index is keyed on it,
  // and a colliding fixture silently under-counts and looks like a loader bug.
  const rows = Array.from({ length: total }, (_, i) => {
    const within = i % 100;
    return {
      mnemonic: `M${Math.floor(i / 100)}`,
      period_date: `${2000 + Math.floor(within / 12)}-${String((within % 12) + 1).padStart(2, '0')}-01`,
      value: i,
    };
  });
  let pageRequests = 0;

  const builder = {
    order() {
      return builder;
    },
    range(from: number, to: number) {
      pageRequests++;
      const requested = to - from + 1;
      return Promise.resolve({
        data: rows.slice(from, from + Math.min(requested, cap)),
        error: null,
      });
    },
    // Awaiting the builder directly is the head/count call.
    then(resolve: (v: { count: number; error: null }) => void) {
      resolve({ count: total, error: null });
    },
  };

  return {
    client: { from: () => ({ select: () => builder }) },
    pageRequests: () => pageRequests,
  };
}

describe('loadObservationIndex', () => {
  it('loads every row when the server caps pages below the requested size', async () => {
    // The real incident: 44152 rows, PostgREST capping at 1000.
    const { client } = stubClient(44152, 1000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const index = await loadObservationIndex(client as any);
    expect(index.size).toBe(44152);
  });

  it('advances by rows returned, not by the requested page size', async () => {
    const { client, pageRequests } = stubClient(2500, 1000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await loadObservationIndex(client as any);
    // 1000 + 1000 + 500 + one empty page that ends the loop.
    expect(pageRequests()).toBe(4);
  });

  it('throws rather than diffing against a partial index', async () => {
    // Server reports 100 rows but hands back none — the silent-truncation shape.
    const short = {
      from: () => ({
        select: () => ({
          order() {
            return this;
          },
          range: () => Promise.resolve({ data: [], error: null }),
          then: (r: (v: { count: number; error: null }) => void) =>
            r({ count: 100, error: null }),
        }),
      }),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect(loadObservationIndex(short as any)).rejects.toThrow(
      /index incomplete: loaded 0 of 100/,
    );
  });
});
