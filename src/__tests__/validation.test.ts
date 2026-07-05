import { describe, it, expect } from 'vitest';
import { ViewBodySchema, PaginationSchema, CategoryFilterSchema } from '@/lib/validation';

describe('ViewBodySchema', () => {
  it('accepts valid slugs', () => {
    expect(ViewBodySchema.safeParse({ slug: 'cement-output-hits-89000mt' }).success).toBe(true);
    expect(ViewBodySchema.safeParse({ slug: 'a' }).success).toBe(true);
  });

  it('rejects empty slug', () => {
    expect(ViewBodySchema.safeParse({ slug: '' }).success).toBe(false);
    expect(ViewBodySchema.safeParse({}).success).toBe(false);
  });

  it('rejects slugs with injection characters', () => {
    expect(ViewBodySchema.safeParse({ slug: 'test<script>' }).success).toBe(false);
    expect(ViewBodySchema.safeParse({ slug: "'; DROP TABLE--" }).success).toBe(false);
    expect(ViewBodySchema.safeParse({ slug: '../etc/passwd' }).success).toBe(false);
  });

  it('rejects slugs exceeding max length', () => {
    expect(ViewBodySchema.safeParse({ slug: 'a'.repeat(201) }).success).toBe(false);
  });

  it('rejects non-string types', () => {
    expect(ViewBodySchema.safeParse({ slug: 123 }).success).toBe(false);
    expect(ViewBodySchema.safeParse({ slug: null }).success).toBe(false);
  });
});

describe('PaginationSchema', () => {
  it('applies defaults', () => {
    const result = PaginationSchema.parse({});
    expect(result.limit).toBe(50);
    expect(result.offset).toBe(0);
  });

  it('coerces string numbers', () => {
    const result = PaginationSchema.parse({ limit: '10', offset: '5' });
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(5);
  });

  it('clamps limit to 100', () => {
    expect(PaginationSchema.safeParse({ limit: 101 }).success).toBe(false);
  });

  it('rejects negative offset', () => {
    expect(PaginationSchema.safeParse({ offset: -1 }).success).toBe(false);
  });
});

describe('CategoryFilterSchema', () => {
  it('accepts valid category slugs', () => {
    expect(CategoryFilterSchema.safeParse({ category: 'economy' }).success).toBe(true);
    expect(CategoryFilterSchema.safeParse({ category: 'small-business' }).success).toBe(true);
  });

  it('allows omitted category', () => {
    expect(CategoryFilterSchema.safeParse({}).success).toBe(true);
  });

  it('rejects injection attempts', () => {
    expect(CategoryFilterSchema.safeParse({ category: 'a; DROP TABLE' }).success).toBe(false);
    expect(CategoryFilterSchema.safeParse({ category: '<script>' }).success).toBe(false);
  });
});
