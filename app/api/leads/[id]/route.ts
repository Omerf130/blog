import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import { requireRole } from '@/lib/auth';
import { leadUpdateSchema } from '@/lib/validators/lead';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  handleApiError,
} from '@/lib/api-response';

/**
 * GET /api/leads/[id]
 * Get a single lead (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin or editor role
    await requireRole(['admin', 'editor']);

    await connectDB();

    const lead = await Lead.findById(params.id);

    if (!lead) {
      return errorResponse('Lead not found', 404);
    }

    return successResponse({ lead });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/leads/[id]
 * Update a lead (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin or editor role
    await requireRole(['admin', 'editor']);

    await connectDB();

    // Check if lead exists
    const existingLead = await Lead.findById(params.id);
    if (!existingLead) {
      return errorResponse('Lead not found', 404);
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = leadUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.issues);
    }

    const data = validationResult.data;

    // Update lead
    const lead = await Lead.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );

    console.log('✅ Lead updated:', lead?.name, '- Status:', lead?.status);

    return successResponse({
      message: 'Lead updated successfully',
      lead,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/leads/[id]
 * Delete a lead (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin role
    await requireRole(['admin']);

    await connectDB();

    // Check if lead exists
    const lead = await Lead.findById(params.id);
    if (!lead) {
      return errorResponse('Lead not found', 404);
    }

    // Delete lead
    await Lead.findByIdAndDelete(params.id);

    console.log('✅ Lead deleted:', lead.name);

    return successResponse({
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}

