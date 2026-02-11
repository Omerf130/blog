import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
// Import models used in .populate() — required in serverless (Vercel) so Mongoose registers them
import '@/models/User';
import { getCurrentUser } from '@/lib/auth';
import { commentSchema } from '@/lib/validators/comment';
import { successResponse, validationErrorResponse, handleApiError } from '@/lib/api-response';
import mongoose from 'mongoose';

// GET /api/comments?postId=... - List approved comments for a post (public)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { ok: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    // Only return approved comments
    const comments = await Comment.find({
      postId: new mongoose.Types.ObjectId(postId),
      status: 'approved',
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // Serialize data
    const serializedComments = comments.map((comment: any) => ({
      _id: comment._id.toString(),
      content: comment.content,
      isLawyerReply: comment.isLawyerReply,
      createdAt: comment.createdAt,
      user: {
        _id: comment.userId._id.toString(),
        name: comment.userId.name,
      },
    }));

    return successResponse(serializedComments);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/comments - Submit a comment (requires auth)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Require authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = commentSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { postId, content } = validation.data;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    // Verify post exists and is published
    const post = await Post.findOne({
      _id: new mongoose.Types.ObjectId(postId),
      status: 'published',
    });

    if (!post) {
      return NextResponse.json(
        { ok: false, error: 'Post not found or not published' },
        { status: 404 }
      );
    }

    // Check if comments are enabled for this post
    if (post.commentsLocked) {
      return NextResponse.json(
        { ok: false, error: 'Comments are disabled for this post' },
        { status: 403 }
      );
    }

    // Create comment (pending approval)
    const comment = await Comment.create({
      postId: new mongoose.Types.ObjectId(postId),
      userId: new mongoose.Types.ObjectId(user.id),
      content,
      status: 'pending',
      isLawyerReply: false,
    });

    return successResponse(
      {
        _id: comment._id.toString(),
        message: 'Comment submitted successfully! It will appear after approval.',
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

