import { scan } from './article-number-scan.mjs';

describe('article-number-scan scan', () => {
  it('flags a currency figure with no period label', () => {
    expect(scan('Revenue reached US$304 million last cycle.')).toContain('US$304 million');
  });

  it('is silent when a period label is nearby', () => {
    expect(scan('Revenue reached US$304 million in March 2026.')).toEqual([]);
  });

  it('flags a bare percent with no period', () => {
    const f = scan('The lending rate is 13.11 percent for borrowers.');
    expect(f.some((t) => /13\.11/.test(t))).toBe(true);
  });

  it('accepts a Mar-26 style label', () => {
    expect(scan('Lending rate 13.11 percent (Mar-26).')).toEqual([]);
  });

  it('returns empty for text with no figures', () => {
    expect(scan('The market women in Red Light felt the change.')).toEqual([]);
  });

  it('dedupes repeated unlabelled figures', () => {
    const f = scan('L$500,000 here and L$500,000 there.');
    expect(f).toEqual(['L$500,000']);
  });

  it('flags a figure whose only nearby date is a bare year', () => {
    expect(scan('Revenue was US$304 million in 2026.')).toContain('US$304 million');
  });
});
