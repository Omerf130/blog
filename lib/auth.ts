import { headers } from 'next/headers';
import connectDB from '@/lib/db';
import User, { IUser } from '@/models/User';
import Session from '@/models/Session';
import { getSessionToken } from '@/lib/cookies';
import type { SessionUser } from '@/types';

/**
 * Create a new session for a user
 * Returns the raw token (to be stored in cookie)
 */
export async function createSession(
  userId: string,
  options?: {
    userAgent?: string;
    ip?: string;
  }
): Promise<string> {
  await connectDB();

  // Generate a secure random token
  const token = Session.generateToken();
  const tokenHash = Session.hashToken(token);

  // Calculate expiration
  const ttlDays = parseInt(process.env.SESSION_TTL_DAYS || '14', 10);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + ttlDays);

  // Create session in database
  await Session.create({
    userId,
    tokenHash,
    expiresAt,
    userAgent: options?.userAgent,
    ip: options?.ip,
  });

  return token;
}

/**
 * Get the current session user from the request
 * Returns null if no valid session
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    await connectDB();

    // Get token from cookie
    const token = await getSessionToken();
    if (!token) {
      return null;
    }

    // Hash the token to look up in database
    const tokenHash = Session.hashToken(token);

    // Find session
    const session = await Session.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() }, // Not expired
    });

    if (!session) {
      return null;
    }

    // Get user
    const user = await User.findById(session.userId);
    if (!user || user.status !== 'active') {
      return null;
    }

    // Return session user data
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Delete a specific session by token
 */
export async function deleteSession(token: string): Promise<void> {
  await connectDB();
  const tokenHash = Session.hashToken(token);
  await Session.deleteOne({ tokenHash });
}

/**
 * Delete all sessions for a user (logout from all devices)
 */
export async function deleteAllUserSessions(userId: string): Promise<void> {
  await connectDB();
  await Session.deleteMany({ userId });
}

/**
 * Require authentication - throws if user not authenticated
 * Use in API routes to protect endpoints
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

/**
 * Require specific role(s)
 */
export async function requireRole(
  allowedRoles: string[]
): Promise<SessionUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
  return user;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

/**
 * Check if user is admin or editor
 */
export async function canManageContent(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin' || user?.role === 'editor';
}

/**
 * Get request metadata (IP, user agent)
 */
export async function getRequestMetadata() {
  const headersList = await headers();
  return {
    ip:
      headersList.get('x-forwarded-for')?.split(',')[0] ||
      headersList.get('x-real-ip') ||
      'unknown',
    userAgent: headersList.get('user-agent') || 'unknown',
  };
}

