import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import DocumentModel from '@/models/Document';
import { requireAuth } from '@/lib/auth';
import { errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

/**
 * GET /api/documents/[id]/download
 * Auth-gated: any logged-in user can download
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require any authenticated user
    await requireAuth();
    await connectDB();

    const doc = await DocumentModel.findById(params.id).select(
      'fileData mimeType originalFilename fileSize'
    );

    if (!doc) {
      return errorResponse('Document not found', 404);
    }

    // Return the file with proper headers
    const response = new NextResponse(Buffer.from(doc.fileData), {
      status: 200,
      headers: {
        'Content-Type': doc.mimeType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(doc.originalFilename)}"`,
        'Content-Length': String(doc.fileSize),
        'Cache-Control': 'private, no-cache',
      },
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

