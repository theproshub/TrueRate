import { detectPublish, decide } from './publish-guard.mjs';

describe('detectPublish', () => {
  it('flags the import-news-articles script as a bulk publish', () => {
    const d = detectPublish('Bash', { command: 'node scripts/import-news-articles.mjs' });
    expect(d).toEqual({ isPublish: true, slug: null });
  });

  it('extracts a slug from a --slug flag', () => {
    const d = detectPublish('Bash', { command: 'node scripts/publish-one.mjs --slug my-story' });
    expect(d).toEqual({ isPublish: true, slug: 'my-story' });
  });

  it('flags an Edit that introduces status: published into news.ts', () => {
    const d = detectPublish('Edit', {
      file_path: '/repo/src/data/news.ts',
      new_string: "{ slug: 'cement-output-rises', status: 'published' }",
    });
    expect(d).toEqual({ isPublish: true, slug: 'cement-output-rises' });
  });

  it('ignores an unrelated Bash command', () => {
    expect(detectPublish('Bash', { command: 'ls -la' })).toEqual({ isPublish: false, slug: null });
  });

  it('ignores a news.ts edit that does not publish', () => {
    const d = detectPublish('Edit', { file_path: '/repo/src/data/news.ts', new_string: "status: 'draft'" });
    expect(d).toEqual({ isPublish: false, slug: null });
  });
});

describe('decide', () => {
  const fresh = () => ({ valid: true, issuedAt: Date.now() });
  it('allows a non-publish call', () => {
    expect(decide({ isPublish: false, slug: null }, () => ({ valid: false }))).toEqual({ deny: false });
  });
  it('denies a bulk publish (no slug)', () => {
    const r = decide({ isPublish: true, slug: null }, () => fresh());
    expect(r.deny).toBe(true);
  });
  it('denies when no receipt exists', () => {
    const r = decide({ isPublish: true, slug: 'x' }, () => ({ valid: false }));
    expect(r.deny).toBe(true);
    expect(r.reason).toMatch(/number-lock x/);
  });
  it('allows when a fresh receipt exists', () => {
    expect(decide({ isPublish: true, slug: 'x' }, () => fresh())).toEqual({ deny: false });
  });
  it('denies when the receipt is stale (>24h)', () => {
    const stale = { valid: true, issuedAt: Date.now() - 25 * 3600 * 1000 };
    const r = decide({ isPublish: true, slug: 'x' }, () => stale);
    expect(r.deny).toBe(true);
    expect(r.reason).toMatch(/stale/);
  });
});
