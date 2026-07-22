import { describe, it, expect } from 'vitest';
import { HOOK_BANK } from '@/app/admin/social-cards/_components/hookBank';

const entries = HOOK_BANK.flatMap((g) => g.hooks);

describe('hook bank packs', () => {
  it('every hook carries exactly three reason-points', () => {
    for (const e of entries) {
      expect(e.points, e.hook).toHaveLength(3);
      for (const p of e.points) expect(p.trim().length, e.hook).toBeGreaterThan(0);
    }
  });

  it('every point has a matching non-empty body (two-part explainer)', () => {
    for (const e of entries) {
      expect(e.bodies, e.hook).toHaveLength(3);
      for (const b of e.bodies) expect(b.trim().length, e.hook).toBeGreaterThan(0);
      // a body must add explanation, not echo its own point title
      e.bodies.forEach((b, i) => expect(b, e.hook).not.toBe(e.points[i]));
    }
  });

  it('no point-title duplicates its hook (the bug: points must explain, not repeat)', () => {
    for (const e of entries) {
      for (const p of e.points) expect(p, e.hook).not.toBe(e.hook);
    }
  });

  it('hook strings are unique so the picker can resolve a pick to one pack', () => {
    const hooks = entries.map((e) => e.hook);
    expect(new Set(hooks).size).toBe(hooks.length);
  });

  it('every entry is tied to exactly one article: slug + articleTitle present', () => {
    for (const e of entries) {
      expect(e.slug.trim().length, e.hook).toBeGreaterThan(0);
      expect(e.articleTitle.trim().length, e.hook).toBeGreaterThan(0);
    }
  });

  it('slugs are kebab-case (real article slugs, no spaces/caps)', () => {
    for (const e of entries) expect(e.slug, e.hook).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it('one hook per article: no slug is reused across entries', () => {
    const slugs = entries.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('no point-title merely repeats its own hook verbatim within an entry', () => {
    // (kept alongside the global check) points must explain, not echo the hook.
    for (const e of entries) for (const p of e.points) expect(p, e.hook).not.toBe(e.hook);
  });
});
