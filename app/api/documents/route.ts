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
 * GET /api/documents
 * Admin: list all documents (metadata only, no file data)
 */
export async function GET() {
  try {
    await requireRole(['admin', 'editor']);
    await connectDB();

    const documents = await DocumentModel.find()
      .select('-fileData')
      .populate('category', 'name')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    return successResponse({ documents });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/documents
 * Admin: upload a new document (multipart/form-data)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(['admin', 'editor']);
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const category = formData.get('category') as string | null;

    // Validate metadata
    const metaResult = documentMetaSchema.safeParse({
      title,
      category: category || undefined,
    });

    if (!metaResult.success) {
      return validationErrorResponse(metaResult.error.issues);
    }

    // Validate file
    if (!file) {
      return errorResponse('File is required', 400);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse('Only PDF and DOCX files are allowed', 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorResponse('File size cannot exceed 10MB', 400);
    }

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create document
    const doc = await DocumentModel.create({
      title: metaResult.data.title,
      category: metaResult.data.category || undefined,
      originalFilename: file.name,
      mimeType: file.type,
      fileSize: file.size,
      fileData: buffer,
      uploadedBy: user.id,
    });

    // Return without fileData
    const result = await DocumentModel.findById(doc._id)
      .select('-fileData')
      .populate('category', 'name')
      .populate('uploadedBy', 'name');

    console.log('✅ Document uploaded:', doc.title);

    return successResponse(
      { message: 'Document uploaded successfully', document: result },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

