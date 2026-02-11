import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
// Import models used in .populate() — required in serverless (Vercel) so Mongoose registers them
import '@/models/Category';
import '@/models/Lawyer';
import '@/models/User';
import {
  successResponse,
  errorResponse,
  handleApiError,
} from '@/lib/api-response';

/**
 * GET /api/posts/slug/[slugHe]
 * Get a post by its Hebrew slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slugHe: string } }
) {
  try {
    await connectDB();

    const post = await Post.findOne({ slugHe: params.slugHe })
      .populate('categories', 'name slugHe')
      .populate('authorLawyerId', 'name title bio photoUrl phone email linkedIn')
      .populate('authorUserId', 'name');

    if (!post) {
      return errorResponse('Post not found', 404);
    }

    // Only return published posts to public (unless explicitly requested with includeUnpublished)
    const { searchParams } = request.nextUrl;
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';
    
    if (!includeUnpublished && post.status !== 'published') {
      return errorResponse('Post not found', 404);
    }

    return successResponse({ post });
  } catch (error) {
    return handleApiError(error);
  }
}

