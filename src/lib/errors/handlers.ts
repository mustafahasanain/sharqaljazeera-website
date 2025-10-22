import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiError } from './index';

// Type for error response structure
type ErrorResponse = {
  error: {
    message: string;
    statusCode: number;
    name?: string;
    details?: unknown;
    stack?: string;
  };
};

// Main error handler for Next.js API routes
export function handleError(error: unknown): NextResponse<ErrorResponse> {
  // Handle known ApiError instances
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          statusCode: error.statusCode,
          name: error.name,
          details: error.details,
          // Only include stack trace in development
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          message: 'Validation failed',
          statusCode: 400,
          name: 'ValidationError',
          details: error.errors,
        },
      },
      { status: 400 }
    );
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    // Check for specific error types by name
    const statusCode = getStatusCodeFromError(error);

    return NextResponse.json(
      {
        error: {
          message: error.message,
          statusCode,
          name: error.name,
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        },
      },
      { status: statusCode }
    );
  }

  // Handle unknown error types
  return NextResponse.json(
    {
      error: {
        message: 'An unexpected error occurred',
        statusCode: 500,
        name: 'UnknownError',
        ...(process.env.NODE_ENV === 'development' && {
          details: String(error)
        }),
      },
    },
    { status: 500 }
  );
}

// Helper to determine status code from error name
function getStatusCodeFromError(error: Error): number {
  const errorName = error.name.toLowerCase();

  if (errorName.includes('validation')) return 400;
  if (errorName.includes('authentication') || errorName.includes('unauthorized')) return 401;
  if (errorName.includes('authorization') || errorName.includes('forbidden')) return 403;
  if (errorName.includes('notfound') || errorName.includes('not found')) return 404;
  if (errorName.includes('conflict')) return 409;

  return 500;
}

// Async error wrapper for API route handlers
// Catches both sync and async errors and passes them to handleError
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse> | NextResponse
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      const result = await handler(...args);
      return result;
    } catch (error) {
      console.error('API Error:', error);
      return handleError(error);
    }
  };
}

// Type-safe wrapper specifically for Next.js route handlers
export function apiRoute(
  handler: (request: NextRequest, context?: { params: Record<string, string> }) => Promise<NextResponse>
) {
  return withErrorHandler(handler);
}

// Centralized logging for operational errors
export function logError(error: unknown): void {
  if (error instanceof ApiError) {
    // Only log non-operational errors (unexpected errors)
    if (!error.isOperational) {
      console.error('Non-operational error:', {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
        stack: error.stack,
        details: error.details,
      });
    }
  } else {
    // Log all non-ApiError instances as they're unexpected
    console.error('Unexpected error:', error);
  }
}

// Helper to create standardized success responses
export function successResponse<T>(data: T, status: number = 200): NextResponse<{ data: T }> {
  return NextResponse.json({ data }, { status });
}

// Helper to check if error is operational (expected business logic error)
export function isOperationalError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.isOperational;
  }
  return false;
}
