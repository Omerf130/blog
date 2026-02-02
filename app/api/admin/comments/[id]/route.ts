import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import { requireRole } from '@/lib/auth';
import { moderateCommentSchema } from '@/lib/validators/comment';
import { successResponse, validationErrorResponse, handleApiError } from '@/lib/api-response';
import mongoose from 'mongoose';

type RouteContext = {
  params: { id: string };
};

// PATCH /api/admin/comments/[id] - Approve/reject comment (admin/editor only)
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    // Require admin or editor role
    await requireRole(['admin', 'editor']);

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validation = moderateCommentSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { status, isLawyerReply } = validation.data;

    // Update comment
    const updateData: any = { status };
    if (isLawyerReply !== undefined) {
      updateData.isLawyerReply = isLawyerReply;
    }

    const comment = await Comment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!comment) {
      return NextResponse.json(
        { ok: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    return successResponse({
      _id: comment._id.toString(),
      status: comment.status,
      isLawyerReply: comment.isLawyerReply,
      message: `Comment ${status}`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/admin/comments/[id] - Delete comment (admin only)
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    // Require admin role
    await requireRole(['admin']);

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return NextResponse.json(
        { ok: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    return successResponse({ message: 'Comment deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

