import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Lawyer from '@/models/Lawyer';
import { requireRole } from '@/lib/auth';
import { lawyerSchema } from '@/lib/validators/lawyer';
import {
  successResponse,
  validationErrorResponse,
  handleApiError,
} from '@/lib/api-response';

/**
 * GET /api/lawyers
 * List all lawyers (optionally filter by isActive)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const isActive = searchParams.get('isActive');

    // Build query
    const query: any = {};
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    const lawyers = await Lawyer.find(query)
      .sort({ name: 1 })
      .select('_id name title bio photoUrl phone email linkedIn isActive createdAt');

    return successResponse({
      lawyers,
      total: lawyers.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/lawyers
 * Create a new lawyer (admin/editor only)
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin or editor role
    await requireRole(['admin', 'editor']);

    await connectDB();

    // Parse and validate request body
    const body = await request.json();
    const validationResult = lawyerSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.issues);
    }

    // Create lawyer
    const lawyer = await Lawyer.create(validationResult.data);

    console.log('✅ Lawyer created:', lawyer.name);

    return successResponse(
      {
        message: 'Lawyer created successfully',
        lawyer,
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

