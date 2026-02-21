import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import DocumentModel from '@/models/Document';
import { requireRole } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  handleApiError,
} from '@/lib/api-response';

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/documents/[id]
 * Admin: delete a document
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['admin', 'editor']);
    await connectDB();

    const doc = await DocumentModel.findByIdAndDelete(params.id);

    if (!doc) {
      return errorResponse('Document not found', 404);
    }

    console.log('✅ Document deleted:', doc.title);

    return successResponse({ message: 'Document deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

