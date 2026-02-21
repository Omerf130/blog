import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import DocumentModel from '@/models/Document';
import '@/models/Category';
import '@/models/User';
import { requireRole } from '@/lib/auth';
import { documentMetaSchema } from '@/lib/validators/document';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  handleApiError,
} from '@/lib/api-response';

export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * PUT /api/documents/[id]
 * Admin: update document details and optionally replace file
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['admin', 'editor']);
    await connectDB();

    const existing = await DocumentModel.findById(params.id).select('-fileData');
    if (!existing) {
      return errorResponse('Document not found', 404);
    }

    const formData = await request.formData();
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;
    const category = formData.get('category') as string | null;
    const status = formData.get('status') as string | null;
    const file = formData.get('file') as File | null;

    // Validate metadata
    const metaResult = documentMetaSchema.safeParse({
      title: title || existing.title,
      description: description !== null ? description : existing.description,
      category: category || undefined,
      status: status || existing.status,
    });

    if (!metaResult.success) {
      return validationErrorResponse(metaResult.error.issues);
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      title: metaResult.data.title,
      description: metaResult.data.description || undefined,
      category: metaResult.data.category || undefined,
      status: metaResult.data.status || 'active',
    };

    // If a new file is provided, replace file data
    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return errorResponse('Only PDF and DOCX files are allowed', 400);
      }
      if (file.size > MAX_FILE_SIZE) {
        return errorResponse('File size cannot exceed 10MB', 400);
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      updateData.originalFilename = file.name;
      updateData.mimeType = file.type;
      updateData.fileSize = file.size;
      updateData.fileData = buffer;
    }

    const updated = await DocumentModel.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true }
    )
      .select('-fileData')
      .populate('category', 'name')
      .populate('uploadedBy', 'name');

    console.log('✅ Document updated:', updated?.title);

    return successResponse({ message: 'Document updated successfully', document: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

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
