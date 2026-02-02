import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getSessionToken, clearSessionToken } from '@/lib/cookies';
import { deleteSession } from '@/lib/auth';

/**
 * Logout endpoint
 * POST /api/auth/logout
 */
export async function POST(request: NextRequest) {
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

    // Redirect to home page
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  } catch (error: any) {
    console.error('Logout error:', error);
    // On error, still try to redirect home
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }
}

