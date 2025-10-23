import { NextRequest, NextResponse } from "next/server";

// Rate limit configuration for different route types
type RateLimitConfig = {
  readonly windowMs: number; // Time window in milliseconds
  readonly maxRequests: number; // Max requests per window
};

// Different rate limits for different route types
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Auth endpoints - stricter limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  // API endpoints - moderate limits
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
  },
  // General pages - lenient limits
  default: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  },
};

// Store for tracking request counts
// In production, use Redis or similar distributed cache
type RateLimitStore = {
  [key: string]: {
    count: number;
    resetTime: number;
  };
};

// Simple in-memory store (will be reset on server restart)
// For production, replace with Redis or similar persistent store
const rateLimitStore: RateLimitStore = {};

/**
 * Clean up expired entries from the store
 * Prevents memory leaks by removing old entries
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  const keys = Object.keys(rateLimitStore);

  for (const key of keys) {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  }
}

/**
 * Get rate limit config based on the request path
 */
function getRateLimitConfig(pathname: string): RateLimitConfig {
  // Auth routes
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/auth")) {
    return RATE_LIMITS.auth;
  }

  // API routes
  if (pathname.startsWith("/api")) {
    return RATE_LIMITS.api;
  }

  // Default for all other routes
  return RATE_LIMITS.default;
}

/**
 * Get client identifier from request
 * Uses IP address or falls back to a header-based identifier
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers (for proxied requests)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip"); // Cloudflare

  // Use the first available identifier
  const ip = forwarded?.split(",")[0]?.trim() || realIp || cfConnectingIp || "unknown";

  // For additional security, combine IP with user agent
  const userAgent = request.headers.get("user-agent") || "unknown";

  // Create a composite key
  return `${ip}:${userAgent.substring(0, 50)}`;
}

/**
 * Create rate limit key for storage
 */
function createRateLimitKey(
  clientId: string,
  pathname: string,
  config: RateLimitConfig
): string {
  // Include path prefix in key to have separate limits for different route types
  const pathPrefix = pathname.startsWith("/api/auth")
    ? "auth"
    : pathname.startsWith("/api")
    ? "api"
    : "default";

  return `ratelimit:${pathPrefix}:${clientId}`;
}

/**
 * Check if request should be rate limited
 * Returns NextResponse with 429 status if limit exceeded, null otherwise
 */
export async function checkRateLimit(
  request: NextRequest
): Promise<NextResponse | null> {
  try {
    const { pathname } = request.nextUrl;

    // Skip rate limiting for static files
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/static") ||
      pathname.includes(".")
    ) {
      return null;
    }

    // Get rate limit config for this route
    const config = getRateLimitConfig(pathname);

    // Get client identifier
    const clientId = getClientIdentifier(request);

    // Create storage key
    const key = createRateLimitKey(clientId, pathname, config);

    // Get current time
    const now = Date.now();

    // Get or create rate limit entry
    let entry = rateLimitStore[key];

    // If no entry exists or entry is expired, create new one
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      rateLimitStore[key] = entry;

      // Clean up old entries periodically (every 100 requests)
      if (Math.random() < 0.01) {
        cleanupExpiredEntries();
      }

      return null; // Allow request
    }

    // Increment count
    entry.count += 1;

    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      // Calculate retry after time
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

      // Return rate limit error response
      return new NextResponse(
        JSON.stringify({
          error: "Too Many Requests",
          message: "You have exceeded the rate limit. Please try again later.",
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": config.maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(entry.resetTime).toISOString(),
          },
        }
      );
    }

    // Allow request but could add headers to response (handled in middleware)
    return null;
  } catch (error) {
    // If rate limiting fails, allow the request
    // Log the error but don't block the user
    console.error("Rate limiting error:", error);
    return null;
  }
}

/**
 * Get rate limit info for current client
 * Useful for API routes that want to include rate limit headers
 */
export function getRateLimitInfo(
  request: NextRequest
): {
  limit: number;
  remaining: number;
  reset: Date;
} | null {
  try {
    const { pathname } = request.nextUrl;
    const config = getRateLimitConfig(pathname);
    const clientId = getClientIdentifier(request);
    const key = createRateLimitKey(clientId, pathname, config);

    const entry = rateLimitStore[key];

    if (!entry || entry.resetTime < Date.now()) {
      return {
        limit: config.maxRequests,
        remaining: config.maxRequests,
        reset: new Date(Date.now() + config.windowMs),
      };
    }

    return {
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - entry.count),
      reset: new Date(entry.resetTime),
    };
  } catch (error) {
    console.error("Failed to get rate limit info:", error);
    return null;
  }
}

/**
 * Add rate limit headers to a response
 * Call this in API routes to inform clients about rate limits
 */
export function addRateLimitHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  try {
    const info = getRateLimitInfo(request);

    if (info) {
      response.headers.set("X-RateLimit-Limit", info.limit.toString());
      response.headers.set("X-RateLimit-Remaining", info.remaining.toString());
      response.headers.set("X-RateLimit-Reset", info.reset.toISOString());
    }
  } catch (error) {
    console.error("Failed to add rate limit headers:", error);
  }

  return response;
}

/**
 * Reset rate limit for a specific client (useful for testing or admin actions)
 */
export function resetRateLimit(clientId: string, pathname: string): void {
  const config = getRateLimitConfig(pathname);
  const key = createRateLimitKey(clientId, pathname, config);
  delete rateLimitStore[key];
}

/**
 * Clear all rate limits (useful for testing)
 */
export function clearAllRateLimits(): void {
  Object.keys(rateLimitStore).forEach((key) => {
    delete rateLimitStore[key];
  });
}
