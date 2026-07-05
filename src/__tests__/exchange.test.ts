import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/supabase/public', () => ({
  publicClient: {},
}));

const { toLRDRates } = await import('@/domain/markets/exchange');
type LiveRates = import('@/domain/markets/exchange').LiveRates;

describe('toLRDRates', () => {
  const mockRates: LiveRates = {
    date: '2026-07-05',
    rates: {
      lrd: 182.53,
      eur: 0.8591,
      gbp: 0.7426,
      cny: 6.7656,
      ghs: 15.84,
      ngn: 1605.30,
    },
  };

  it('converts USD to LRD directly', () => {
    const result = toLRDRates(mockRates);
    expect(result['USD']).toBe(182.53);
  });

  it('computes EUR/LRD as (1/eurPerUsd) * lrdPerUsd', () => {
    const result = toLRDRates(mockRates);
    const expected = (1 / 0.8591) * 182.53;
    expect(result['EUR']).toBeCloseTo(expected, 2);
  });

  it('computes GBP/LRD correctly', () => {
    const result = toLRDRates(mockRates);
    const expected = (1 / 0.7426) * 182.53;
    expect(result['GBP']).toBeCloseTo(expected, 2);
  });

  it('always includes LRD=1', () => {
    const result = toLRDRates(mockRates);
    expect(result['LRD']).toBe(1);
  });

  it('handles missing LRD rate gracefully', () => {
    const noLrd: LiveRates = { date: '2026-07-05', rates: { eur: 0.86 } };
    const result = toLRDRates(noLrd);
    expect(result).toEqual({ LRD: 1 });
  });

  it('skips currencies with zero rate (division by zero guard)', () => {
    const zeroEur: LiveRates = {
      date: '2026-07-05',
      rates: { lrd: 182.53, eur: 0, gbp: 0.74 },
    };
    const result = toLRDRates(zeroEur);
    expect(result['EUR']).toBeUndefined();
    expect(result['GBP']).toBeDefined();
  });

  it('skips currencies with NaN rate', () => {
    const nanRate: LiveRates = {
      date: '2026-07-05',
      rates: { lrd: 182.53, eur: NaN },
    };
    const result = toLRDRates(nanRate);
    expect(result['EUR']).toBeUndefined();
  });
});
