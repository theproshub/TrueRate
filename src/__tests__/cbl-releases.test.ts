import { describe, it, expect } from 'vitest';
import {
  diffSeries,
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
