import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';
import { requireRole } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  handleApiError,
} from '@/lib/api-response';

/**
 * GET /api/settings
 * Public: returns site settings
 */
export async function GET() {
  try {
    await connectDB();

    let settings = await SiteSettings.findOne({ key: 'main' });

    if (!settings) {
      // Create default settings if none exist
      settings = await SiteSettings.create({ key: 'main' });
    }

    return successResponse({
      settings: {
        videoUrl: settings.videoUrl || '',
        videoUrl2: settings.videoUrl2 || '',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/settings
 * Admin-only: update site settings
 */
export async function PUT(request: NextRequest) {
  try {
    await requireRole(['admin', 'editor']);
    await connectDB();

    const body = await request.json();
    const { videoUrl, videoUrl2 } = body;

    const updateFields: Record<string, string> = {};
    if (videoUrl !== undefined) updateFields.videoUrl = videoUrl || '';
    if (videoUrl2 !== undefined) updateFields.videoUrl2 = videoUrl2 || '';

    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      updateFields,
      { upsert: true, new: true }
    );

    return successResponse({
      settings: {
        videoUrl: settings.videoUrl || '',
        videoUrl2: settings.videoUrl2 || '',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

