import { z } from 'zod';

export const ViewBodySchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export const PaginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export const CategoryFilterSchema = z.object({
  category: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).optional(),
});
