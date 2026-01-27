import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME || 'keshet_session';

/**
 * Get the session token from cookies
 */
export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Set the session token in cookies
 */
export async function setSessionToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  const ttlDays = parseInt(process.env.SESSION_TTL_DAYS || '14', 10);
  const maxAge = ttlDays * 24 * 60 * 60; // Convert days to seconds

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });
}

/**
 * Clear the session token from cookies
 */
export async function clearSessionToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get session cookie configuration
 */
export function getSessionConfig() {
  return {
    name: SESSION_COOKIE_NAME,
    ttlDays: parseInt(process.env.SESSION_TTL_DAYS || '14', 10),
  };
}

