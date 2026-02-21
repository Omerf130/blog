import { z } from 'zod';

export const documentMetaSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  category: z.string().optional(),
});

export type DocumentMetaInput = z.infer<typeof documentMetaSchema>;

