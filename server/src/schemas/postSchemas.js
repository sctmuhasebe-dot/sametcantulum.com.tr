// server/src/schemas/postSchemas.js
import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir."),
  content: z.string().min(10).max(50000),
  category: z.enum(['mevzuat', 'makaleler', 'blog']).default('blog'),
  excerpt: z.string().max(500).optional(),
});