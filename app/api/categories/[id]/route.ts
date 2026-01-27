import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { requireRole } from '@/lib/auth';
import { categoryUpdateSchema } from '@/lib/validators/category';
import { generateUniqueSlug } from '@/lib/slug';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  handleApiError,
} from '@/lib/api-response';

/**
 * GET /api/categories/[id]
 * Get a single category
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const category = await Category.findById(params.id);

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    return successResponse({ category });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/categories/[id]
 * Update a category (admin/editor only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin or editor role
    await requireRole(['admin', 'editor']);

    await connectDB();

    // Check if category exists
    const existingCategory = await Category.findById(params.id);
    if (!existingCategory) {
      return errorResponse('Category not found', 404);
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = categoryUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.issues);
    }

    const { name, description } = validationResult.data;

    // Update slug if name changed
    let slugHe = existingCategory.slugHe;
    if (name && name !== existingCategory.name) {
      slugHe = await generateUniqueSlug(Category, name, 'slugHe', params.id);
    }

    // Update category
    const category = await Category.findByIdAndUpdate(
      params.id,
      {
        ...(name && { name }),
        ...(slugHe && { slugHe }),
        ...(description !== undefined && { description }),
      },
      { new: true, runValidators: true }
    );

    console.log('✅ Category updated:', category?.name);

    return successResponse({
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/categories/[id]
 * Delete a category (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin role
    await requireRole(['admin']);

    await connectDB();

    // Check if category exists
    const category = await Category.findById(params.id);
    if (!category) {
      return errorResponse('Category not found', 404);
    }

    // Delete category
    await Category.findByIdAndDelete(params.id);

    console.log('✅ Category deleted:', category.name);

    return successResponse({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}

