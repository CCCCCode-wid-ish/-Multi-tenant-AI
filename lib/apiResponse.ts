import { NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError, NotFoundError } from './access';
import { ZodError } from 'zod';

/** Standard success response */
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/** Standard error response — maps known error types to correct HTTP status */
export function apiError(err: unknown) {
  if (err instanceof ZodError) {
    return NextResponse.json(
      { success: false, error: 'Validation error', details: err.flatten() },
      { status: 422 }
    );
  }
  if (err instanceof UnauthorizedError) {
    return NextResponse.json({ success: false, error: err.message }, { status: 401 });
  }
  if (err instanceof ForbiddenError) {
    return NextResponse.json({ success: false, error: err.message }, { status: 403 });
  }
  if (err instanceof NotFoundError) {
    return NextResponse.json({ success: false, error: err.message }, { status: 404 });
  }
  console.error('[API Error]', err);
  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
