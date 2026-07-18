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

  it('no point-title duplicates its hook (the bug: points must explain, not repeat)', () => {
    for (const e of entries) {
      for (const p of e.points) expect(p, e.hook).not.toBe(e.hook);
    }
  });

  it('hook strings are unique so the picker can resolve a pick to one pack', () => {
    const hooks = entries.map((e) => e.hook);
    expect(new Set(hooks).size).toBe(hooks.length);
  });
});
