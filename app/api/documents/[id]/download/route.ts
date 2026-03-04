import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import DocumentModel from '@/models/Document';
import { getCurrentUser } from '@/lib/auth';
import { errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

/**
 * GET /api/documents/[id]/download
 * Logged-in users can download any document.
 * Logged-out users can only download "active" documents.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const doc = await DocumentModel.findById(params.id).select(
      'fileData mimeType originalFilename fileSize status'
    );

    if (!doc) {
      return errorResponse('Document not found', 404);
    }

    // Block logged-out users from downloading hidden documents
    if (doc.status === 'hidden') {
      const user = await getCurrentUser();
      if (!user) {
        return errorResponse('Document not found', 404);
      }
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

