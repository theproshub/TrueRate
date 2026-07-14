import { describe, it, expect } from 'vitest';
import { TR_TEMPLATES, templateSize } from '@/app/admin/social-cards/_components/templates/registry';

const PART1 = ['breaking', 'article', 'quote', 'stat', 'markets'] as const;

describe('social-cards template registry', () => {
  it('registers part-1 formats with both variants and labels', () => {
    for (const key of PART1) {
      const entry = TR_TEMPLATES[key];
      expect(entry, key).toBeDefined();
      expect(typeof entry.terminal).toBe('function');
      expect(typeof entry.broadsheet).toBe('function');
      expect(entry.label.length).toBeGreaterThan(0);
    }
  });

  it('feed cards default to 1080×1350', () => {
    expect(templateSize('breaking')).toEqual({ w: 1080, h: 1350 });
  });
});
