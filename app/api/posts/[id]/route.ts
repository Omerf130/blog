import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

export const dynamic = 'force-dynamic';
import { requireRole } from '@/lib/auth';
import { postUpdateSchema } from '@/lib/validators/post';
import { generateUniqueSlug } from '@/lib/slug';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  handleApiError,
} from '@/lib/api-response';

/**
 * GET /api/posts/[id]
 * Get a single post
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const post = await Post.findById(params.id)
      .populate('categories', 'name slugHe')
      .populate('authorLawyerId', 'name title bio photoUrl phone email')
      .populate('authorUserId', 'name');

    if (!post) {
      return errorResponse('Post not found', 404);
    }

    return successResponse({ post });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/posts/[id]
 * Update a post (admin/editor only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin or editor role
    await requireRole(['admin', 'editor']);

    await connectDB();

    // Check if post exists
    const existingPost = await Post.findById(params.id);
    if (!existingPost) {
      return errorResponse('Post not found', 404);
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = postUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.issues);
    }

    const data = validationResult.data;

    // Update slug if title changed
    let slugHe = existingPost.slugHe;
    if (data.title && data.title !== existingPost.title) {
      slugHe = await generateUniqueSlug(Post, data.title, 'slugHe', params.id);
    }

    // Update publishedAt if status changes to published
    let publishedAt = existingPost.publishedAt;
    if (
      data.status === 'published' &&
      existingPost.status !== 'published' &&
      !publishedAt
    ) {
      publishedAt = new Date();
    }

    // Update post
    const post = await Post.findByIdAndUpdate(
      params.id,
      {
        ...data,
        ...(slugHe && { slugHe }),
        ...(publishedAt && { publishedAt }),
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'categories', select: 'name slugHe' },
      { path: 'authorLawyerId', select: 'name title photoUrl' },
      { path: 'authorUserId', select: 'name' },
    ]);

    console.log('✅ Post updated:', post?.title);

    return successResponse({
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/posts/[id]
 * Delete a post (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin role
    await requireRole(['admin']);

    await connectDB();

    // Check if post exists
    const post = await Post.findById(params.id);
    if (!post) {
      return errorResponse('Post not found', 404);
    }

    // Delete post
    await Post.findByIdAndDelete(params.id);

    console.log('✅ Post deleted:', post.title);

    return successResponse({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}

