import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import DocumentModel from '@/models/Document';
import '@/models/Category';
import { getCurrentUser } from '@/lib/auth';
import { successResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

/**
 * GET /api/documents/public
 * Returns all document metadata (no file data) to everyone.
 * Also returns isAuthenticated so the frontend can gate downloads
 * for hidden docs behind registration.
 * Supports ?q= for search and ?category= for category filter
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const categoryId = searchParams.get('category');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    if (categoryId) {
      filter.category = categoryId;
    }

    const documents = await DocumentModel.find(filter)
      .select('-fileData')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    return successResponse({ documents, isAuthenticated: !!user });
  } catch (error) {
    return handleApiError(error);
  }
}
