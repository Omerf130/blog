import { z } from 'zod';

export const lawyerSchema = z.object({
  name: z
    .string()
    .min(1, 'Lawyer name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters')
    .trim(),
  bio: z
    .string()
    .min(1, 'Bio is required')
    .max(2000, 'Bio cannot exceed 2000 characters'),
  photoUrl: z
    .string()
    .url('Invalid photo URL')
    .max(500, 'Photo URL cannot exceed 500 characters')
    .optional(),
  phone: z
    .string()
    .max(20, 'Phone cannot exceed 20 characters')
    .optional(),
  email: z
    .string()
    .email('Invalid email address')
    .optional(),
  linkedIn: z
    .string()
    .url('Invalid LinkedIn URL')
    .max(200, 'LinkedIn URL cannot exceed 200 characters')
    .optional(),
  isActive: z.boolean().optional(),
});

export const lawyerUpdateSchema = lawyerSchema.partial();

export type LawyerInput = z.infer<typeof lawyerSchema>;
export type LawyerUpdateInput = z.infer<typeof lawyerUpdateSchema>;

