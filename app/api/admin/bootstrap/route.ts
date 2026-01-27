import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { bootstrapSchema } from '@/lib/validators/auth';

/**
 * Bootstrap endpoint - Creates the first admin user
 * POST /api/admin/bootstrap
 * 
 * SECURITY: Only works ONCE - when no admin exists
 * Requires x-bootstrap-secret header to match ADMIN_BOOTSTRAP_SECRET env var
 */
export async function POST(request: NextRequest) {
  try {
    // Check bootstrap secret
    const secret = request.headers.get('x-bootstrap-secret');
    const expectedSecret = process.env.ADMIN_BOOTSTRAP_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { ok: false, error: 'Bootstrap secret not configured' },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { ok: false, error: 'Invalid bootstrap secret' },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return NextResponse.json(
        { ok: false, error: 'Admin user already exists. Bootstrap is disabled.' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = bootstrapSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash password and create admin user
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'admin',
      status: 'active',
    });

    console.log('✅ Bootstrap: First admin user created:', email);

    return NextResponse.json({
      ok: true,
      data: {
        message: 'Admin user created successfully',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    console.error('Bootstrap error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

