import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: { user },
    });
  } catch (error: any) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to get user' },
      { status: 500 }
    );
  }
}

