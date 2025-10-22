// Base error class for all custom API errors
export class ApiError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;
  readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace for where error was thrown (V8 only)
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

// Thrown when input validation fails
export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed', details?: unknown) {
    super(message, 400, true, details);
  }
}

// Thrown when authentication is required or fails
export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required', details?: unknown) {
    super(message, 401, true, details);
  }
}

// Thrown when user lacks permissions for an action
export class AuthorizationError extends ApiError {
  constructor(message: string = 'Insufficient permissions', details?: unknown) {
    super(message, 403, true, details);
  }
}

// Thrown when a requested resource is not found
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found', details?: unknown) {
    super(message, 404, true, details);
  }
}

// Thrown when a resource conflict occurs (e.g., duplicate email)
export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict', details?: unknown) {
    super(message, 409, true, details);
  }
}

// Thrown when rate limit is exceeded
export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded', details?: unknown) {
    super(message, 429, true, details);
  }
}

// Thrown for internal server errors
export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal server error', details?: unknown) {
    super(message, 500, false, details);
  }
}

// Thrown when a service is temporarily unavailable
export class ServiceUnavailableError extends ApiError {
  constructor(message: string = 'Service temporarily unavailable', details?: unknown) {
    super(message, 503, true, details);
  }
}

// Thrown when request payload is too large
export class PayloadTooLargeError extends ApiError {
  constructor(message: string = 'Request payload too large', details?: unknown) {
    super(message, 413, true, details);
  }
}

// Thrown when a bad request is made
export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad request', details?: unknown) {
    super(message, 400, true, details);
  }
}
