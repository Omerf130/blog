import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Lawyer from '@/models/Lawyer';
import { requireRole } from '@/lib/auth';
import { lawyerUpdateSchema } from '@/lib/validators/lawyer';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  handleApiError,
} from '@/lib/api-response';

/**
 * GET /api/lawyers/[id]
 * Get a single lawyer
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const lawyer = await Lawyer.findById(params.id);

    if (!lawyer) {
      return errorResponse('Lawyer not found', 404);
    }

    return successResponse({ lawyer });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/lawyers/[id]
 * Update a lawyer (admin/editor only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin or editor role
    await requireRole(['admin', 'editor']);

    await connectDB();

    // Check if lawyer exists
    const existingLawyer = await Lawyer.findById(params.id);
    if (!existingLawyer) {
      return errorResponse('Lawyer not found', 404);
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = lawyerUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.issues);
    }

    // Update lawyer
    const lawyer = await Lawyer.findByIdAndUpdate(
      params.id,
      validationResult.data,
      { new: true, runValidators: true }
    );

    console.log('✅ Lawyer updated:', lawyer?.name);

    return successResponse({
      message: 'Lawyer updated successfully',
      lawyer,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/lawyers/[id]
 * Delete a lawyer (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin role
    await requireRole(['admin']);

    await connectDB();

    // Check if lawyer exists
    const lawyer = await Lawyer.findById(params.id);
    if (!lawyer) {
      return errorResponse('Lawyer not found', 404);
    }

    // Delete lawyer
    await Lawyer.findByIdAndDelete(params.id);

    console.log('✅ Lawyer deleted:', lawyer.name);

    return successResponse({
      message: 'Lawyer deleted successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}

