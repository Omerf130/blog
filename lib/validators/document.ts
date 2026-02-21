import { z } from 'zod';

export const documentMetaSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .trim()
    .optional(),
  category: z.string().optional(),
  status: z.enum(['active', 'hidden']).optional(),
});

export type DocumentMetaInput = z.infer<typeof documentMetaSchema>;

