import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { registerSchema } from '@/lib/validators/register';
import { successResponse, validationErrorResponse, handleApiError } from '@/lib/api-response';

// POST /api/auth/register - Register a new user
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user with 'user' role by default
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'user',
      status: 'active',
    });

    return successResponse(
      {
        message: 'Registration successful! You can now login.',
        userId: user._id.toString(),
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

