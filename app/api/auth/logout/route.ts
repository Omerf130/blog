import { NextResponse } from 'next/server';
import { getSessionToken, clearSessionToken } from '@/lib/cookies';
import { deleteSession } from '@/lib/auth';

/**
 * Logout endpoint
 * POST /api/auth/logout
 */
export async function POST() {
  try {
    // Get current session token
    const token = await getSessionToken();

    if (token) {
      // Delete session from database
      await deleteSession(token);
      console.log('✅ User logged out');
    }

    // Clear cookie
    await clearSessionToken();

    return NextResponse.json({
      ok: true,
      data: { message: 'Logged out successfully' },
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { ok: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}

