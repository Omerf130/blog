import connectDB from '@/lib/db';
import DocumentModel from '@/models/Document';
import '@/models/Category';
import { successResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

/**
 * GET /api/documents/public
 * Public: returns document metadata only (no file data)
 */
export async function GET() {
  try {
    await connectDB();

    const documents = await DocumentModel.find()
      .select('-fileData')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    return successResponse({ documents });
  } catch (error) {
    return handleApiError(error);
  }
}

