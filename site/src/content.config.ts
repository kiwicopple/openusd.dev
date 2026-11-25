import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';
export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({ extend: z.object({
      reviewedAt: z.string().optional(), modifiedAt: z.string().optional(),
      sources: z.array(z.object({ id: z.string(), claim: z.string(), reviewedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() })).default([]),
      related: z.array(z.string()).default([]),
    }) }),
  }),
};
