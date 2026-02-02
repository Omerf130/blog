import { z } from 'zod';

export const commentSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  content: z
    .string()
    .min(3, 'Comment must be at least 3 characters')
    .max(2000, 'Comment must be less than 2000 characters')
    .trim(),
});

export const moderateCommentSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  isLawyerReply: z.boolean().optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;
export type ModerateCommentInput = z.infer<typeof moderateCommentSchema>;

