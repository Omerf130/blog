import { z } from 'zod';

const disputeTypes = [
  'רטיבות',
  'ליקויי בנייה',
  'רכוש משותף',
  'פגמים נסתרים',
  'קבלנים',
  'שכנים',
  'רעש',
  'הצפה',
  'סדקים',
  'גג דולף',
  'אחר',
] as const;

const schemaTypes = ['Article', 'FAQPage', 'LegalService'] as const;

export const postSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  summary: z
    .string()
    .min(1, 'Summary is required')
    .max(500, 'Summary cannot exceed 500 characters'),
  content: z.string().min(1, 'Content is required'),
  whatWeLearned: z
    .string()
    .max(2000, 'What we learned cannot exceed 2000 characters')
    .optional(),
  authorLawyerId: z.string().optional(),
  authorUserId: z.string().optional(),
  categories: z
    .array(z.string())
    .min(1, 'At least one category is required'),
  disputeType: z.enum(disputeTypes).optional(),
  status: z.enum(['draft', 'pendingApproval', 'published']).optional(),
  commentsLocked: z.boolean().optional(),
  seo: z
    .object({
      title: z
        .string()
        .max(70, 'SEO title cannot exceed 70 characters')
        .optional(),
      description: z
        .string()
        .max(160, 'SEO description cannot exceed 160 characters')
        .optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  schemaTypes: z.array(z.enum(schemaTypes)).optional(),
  featuredImage: z
    .object({
      data: z.string().min(1, 'Image data is required'),
      mimetype: z.enum(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']),
      filename: z.string().min(1, 'Filename is required'),
      size: z.number().max(5000000, 'Image must be less than 5MB'),
    })
    .optional()
    .nullable(),
});

export const postUpdateSchema = postSchema.partial();

export type PostInput = z.infer<typeof postSchema>;
export type PostUpdateInput = z.infer<typeof postUpdateSchema>;

