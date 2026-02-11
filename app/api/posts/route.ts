import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

export const dynamic = 'force-dynamic';
import { requireRole, getCurrentUser } from '@/lib/auth';
import { postSchema } from '@/lib/validators/post';
import { generateUniqueSlug } from '@/lib/slug';
import {
  successResponse,
  validationErrorResponse,
  handleApiError,
} from '@/lib/api-response';

/**
 * GET /api/posts
 * List posts with filters and pagination
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const disputeType = searchParams.get('disputeType');
    const q = searchParams.get('q'); // Search query
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Build query
    const query: any = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by category
    if (category) {
      query.categories = category;
    }

    // Filter by dispute type
    if (disputeType) {
      query.disputeType = disputeType;
    }

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('categories', 'name slugHe')
        .populate('authorLawyerId', 'name title photoUrl')
        .populate('authorUserId', 'name')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content -featuredImage'), // Exclude full content and image data from list
      Post.countDocuments(query),
    ]);

    return successResponse({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/posts
 * Create a new post (admin/editor only)
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin or editor role
    const user = await requireRole(['admin', 'editor']);

    await connectDB();

    // Parse and validate request body
    const body = await request.json();
    const validationResult = postSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.issues);
    }

    const data = validationResult.data;

    // Generate unique Hebrew slug
    const slugHe = await generateUniqueSlug(Post, data.title);

    // Set published date if status is published
    const publishedAt = data.status === 'published' ? new Date() : undefined;

    // Create post
    const post = await Post.create({
      ...data,
      slugHe,
      publishedAt,
      authorUserId: data.authorUserId || user.id,
    });

    // Populate references
    await post.populate([
      { path: 'categories', select: 'name slugHe' },
      { path: 'authorLawyerId', select: 'name title photoUrl' },
      { path: 'authorUserId', select: 'name' },
    ]);

    console.log('✅ Post created:', post.title);

    return successResponse(
      {
        message: 'Post created successfully',
        post,
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

