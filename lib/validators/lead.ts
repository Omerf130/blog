import { z } from 'zod';

/**
 * Schema for creating a new lead
 */
export const leadCreateSchema = z.object({
  name: z
    .string()
    .min(2, 'שם חייב להכיל לפחות 2 תווים')
    .max(100, 'שם לא יכול לעבור 100 תווים'),
  email: z
    .string()
    .email('כתובת אימייל לא תקינה')
    .max(255, 'אימייל ארוך מדי'),
  phone: z
    .string()
    .min(9, 'מספר טלפון לא תקין')
    .max(20, 'מספר טלפון ארוך מדי')
    .regex(/^[0-9\-\+\s()]+$/, 'מספר טלפון יכול להכיל רק ספרות ותווים מיוחדים'),
  topic: z.enum([
    'דיני מקרקעין',
    'ליקויי בנייה',
    'דיני שכנים',
    'נדל"ן',
    'רכוש משותף',
    'פגמים נסתרים',
    'קבלנים',
    'אחר',
  ]),
  message: z
    .string()
    .min(10, 'ההודעה חייבת להכיל לפחות 10 תווים')
    .max(2000, 'ההודעה לא יכולה לעבור 2000 תווים'),
  source: z.string().optional(),
});

/**
 * Schema for updating a lead
 */
export const leadUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'converted', 'closed']).optional(),
  notes: z.string().max(1000, 'הערות לא יכולות לעבור 1000 תווים').optional(),
});

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;

