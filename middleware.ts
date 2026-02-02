import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect routes
 * Runs before route handlers
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Check for session cookie
    const sessionCookie = request.cookies.get(
      process.env.SESSION_COOKIE_NAME || 'keshet_session'
    );

    if (!sessionCookie) {
      // Not authenticated - redirect to public login page
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Note: We don't validate the session here for performance
    // The actual validation happens in the route handlers
    // If session is invalid, the page will handle it
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/admin/:path*',
    // Add more protected routes as needed
  ],
};

