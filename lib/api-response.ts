import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

/**
 * Success response helper
 */
export function successResponse<T>(data: T, status: number = 200) {
  const response: ApiResponse<T> = {
    ok: true,
    data,
  };
  return NextResponse.json(response, { status });
}

/**
 * Error response helper
 */
export function errorResponse(error: string, status: number = 400) {
  const response: ApiResponse = {
    ok: false,
    error,
  };
  return NextResponse.json(response, { status });
}

/**
 * Validation error response helper
 */
export function validationErrorResponse(details: any) {
  const response: ApiResponse = {
    ok: false,
    error: 'Validation failed',
    details,
  };
  return NextResponse.json(response, { status: 400 });
}

/**
 * Handle errors in API routes
 */
export function handleApiError(error: any) {
  console.error('API error:', error);

  // Handle known error types
  if (error.message === 'UNAUTHORIZED') {
    return errorResponse('Not authenticated', 401);
  }

  if (error.message === 'FORBIDDEN') {
    return errorResponse('Access denied', 403);
  }

  // Default error response
  return errorResponse('Internal server error', 500);
}

