import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { requireRole } from '@/lib/auth';
import { categorySchema } from '@/lib/validators/category';
import { generateUniqueSlug } from '@/lib/slug';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  handleApiError,
} from '@/lib/api-response';

/**
 * GET /api/categories
 * List all categories
 */
export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find()
      .sort({ name: 1 })
      .select('_id name slugHe description createdAt');

    return successResponse({
      categories,
      total: categories.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/categories
 * Create a new category (admin/editor only)
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin or editor role
    await requireRole(['admin', 'editor']);

    await connectDB();

    // Parse and validate request body
    const body = await request.json();
    const validationResult = categorySchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.issues);
    }

    const { name, description } = validationResult.data;

    // Generate unique Hebrew slug
    const slugHe = await generateUniqueSlug(Category, name);

    // Create category
    const category = await Category.create({
      name,
      slugHe,
      description,
    });

    console.log('✅ Category created:', category.name);

    return successResponse(
      {
        message: 'Category created successfully',
        category: {
          id: category._id.toString(),
          name: category.name,
          slugHe: category.slugHe,
          description: category.description,
        },
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

