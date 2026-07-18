import { describe, it, expect } from 'vitest';
import { TR_TEMPLATES, templateSize } from '@/app/admin/social-cards/_components/templates/registry';

const ALL = ['breaking', 'article', 'quote', 'stat', 'markets', 'rate', 'event', 'explainer', 'story', 'cover'] as const;

describe('social-cards template registry', () => {
  it('registers all ten formats with both variants and labels', () => {
    for (const key of ALL) {
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

  it('story and cover carry explicit sizes', () => {
    expect(templateSize('story')).toEqual({ w: 1080, h: 1920 });
    expect(templateSize('cover')).toEqual({ w: 1080, h: 1920 });
    expect(templateSize('rate')).toEqual({ w: 1080, h: 1350 });
  });
});
