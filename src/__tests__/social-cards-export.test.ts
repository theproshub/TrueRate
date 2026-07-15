import { describe, it, expect } from 'vitest';
import { makeFilename } from '@/app/admin/social-cards/_components/export';

describe('makeFilename', () => {
  const d = new Date('2026-07-14T12:00:00Z');
  it('uses truerate-{format}-{yyyy-mm-dd}.png', () => {
    expect(makeFilename('breaking', d)).toBe('truerate-breaking-2026-07-14.png');
    expect(makeFilename('cover', d)).toBe('truerate-cover-2026-07-14.png');
  });
  it('numbers explainer slides 1-5', () => {
    expect(makeFilename('explainer', d, 0)).toBe('truerate-explainer-1-2026-07-14.png');
    expect(makeFilename('explainer', d, 4)).toBe('truerate-explainer-5-2026-07-14.png');
  });
});
