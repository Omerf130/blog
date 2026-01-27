import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { createSession, getRequestMetadata } from '@/lib/auth';
import { setSessionToken } from '@/lib/cookies';
import { loginSchema } from '@/lib/validators/auth';
import { successResponse, errorResponse, validationErrorResponse, handleApiError } from '@/lib/api-response';

/**
 * Login endpoint
 * POST /api/auth/login
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse and validate request body
    const body = await request.json();
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.issues);
    }

    const { email, password } = validationResult.data;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    // Check if user is active
    if (user.status !== 'active') {
      return errorResponse('Account is blocked', 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse('Invalid email or password', 401);
    }

    // Get request metadata
    const metadata = await getRequestMetadata();

    // Create session
    const token = await createSession(user._id.toString(), {
      userAgent: metadata.userAgent,
      ip: metadata.ip,
    });

    // Set session cookie
    await setSessionToken(token);

    console.log('✅ User logged in:', email);

    return successResponse({
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}

