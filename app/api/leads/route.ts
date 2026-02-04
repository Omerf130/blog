import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import { requireRole } from '@/lib/auth';
import { leadCreateSchema } from '@/lib/validators/lead';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  handleApiError,
} from '@/lib/api-response';

/**
 * POST /api/leads
 * Create a new lead (public endpoint)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse and validate request body
    const body = await request.json();
    const validationResult = leadCreateSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.issues);
    }

    const data = validationResult.data;

    // Create lead
    const lead = await Lead.create({
      ...data,
      status: 'new',
    });

    console.log('✅ New lead created:', lead.name, '-', lead.email);

    return successResponse(
      {
        message: 'פנייתך נשלחה בהצלחה! ניצור איתך קשר בהקדם',
        lead: {
          _id: lead._id,
          name: lead.name,
          createdAt: lead.createdAt,
        },
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/leads
 * Get all leads (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Require admin or editor role
    await requireRole(['admin', 'editor']);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch leads
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Get counts by status
    const counts = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = counts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return successResponse({
      leads,
      counts: {
        new: statusCounts.new || 0,
        contacted: statusCounts.contacted || 0,
        converted: statusCounts.converted || 0,
        closed: statusCounts.closed || 0,
        total: leads.length,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

