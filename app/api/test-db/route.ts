import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

/**
 * Test endpoint to verify database connectivity
 * GET /api/test-db
 */
export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Try a simple operation
    const userCount = await User.countDocuments();

    return NextResponse.json({
      ok: true,
      data: {
        message: 'Database connected successfully!',
        userCount,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'Database connection failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

