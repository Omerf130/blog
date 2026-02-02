import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import { requireRole } from '@/lib/auth';
import { successResponse, handleApiError } from '@/lib/api-response';

// GET /api/admin/comments - List all comments with filters (admin/editor only)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Require admin or editor role
    await requireRole(['admin', 'editor']);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // pending, approved, rejected, or all
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Get total count
    const total = await Comment.countDocuments(filter);

    // Get comments with populated relations
    const comments = await Comment.find(filter)
      .populate('userId', 'name email')
      .populate('postId', 'title slugHe')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Serialize data
    const serializedComments = comments.map((comment: any) => ({
      _id: comment._id.toString(),
      content: comment.content,
      status: comment.status,
      isLawyerReply: comment.isLawyerReply,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: {
        _id: comment.userId._id.toString(),
        name: comment.userId.name,
        email: comment.userId.email,
      },
      post: {
        _id: comment.postId._id.toString(),
        title: comment.postId.title,
        slugHe: comment.postId.slugHe,
      },
    }));

    return successResponse({
      comments: serializedComments,
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

