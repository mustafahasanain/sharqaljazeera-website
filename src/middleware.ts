import { NextRequest, NextResponse } from "next/server";
import { PROTECTED_ROUTES, ADMIN_ONLY_ROUTES, AUTH_ROUTES } from "@/lib/constants/routes";
import { checkRateLimit } from "@/lib/middleware/rate-limit";
import { getSessionFromRequest, isAdminUser } from "@/lib/middleware/auth";
import type { UserRole } from "@/types/user";

// Routes that require authentication
const PROTECTED_ROUTE_PREFIXES = PROTECTED_ROUTES;

// Routes that require admin role
const ADMIN_ROUTE_PREFIXES = ADMIN_ONLY_ROUTES;

// Auth pages that authenticated users shouldn't access
const AUTH_PAGE_PATHS = Object.values(AUTH_ROUTES);

// Public API routes that don't need authentication
const PUBLIC_API_ROUTES = [
  "/api/auth",
  "/api/products",
  "/api/categories",
  "/api/brands",
];

/**
 * Check if a path matches any of the given prefixes
 */
function matchesPrefix(path: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => path.startsWith(prefix));
}

/**
 * Check if a path is a public API route
 */
function isPublicApiRoute(path: string): boolean {
  return PUBLIC_API_ROUTES.some((route) => path.startsWith(route));
}

/**
 * Main middleware function
 * Handles authentication, authorization, and rate limiting
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and internal Next.js routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // Files with extensions (images, fonts, etc.)
  ) {
    return NextResponse.next();
  }

  // Apply rate limiting to all routes
  const rateLimitResponse = await checkRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse; // Return 429 Too Many Requests
  }

  // Skip auth check for public API routes
  if (isPublicApiRoute(pathname)) {
    return NextResponse.next();
  }

  // Get session from request
  const session = await getSessionFromRequest(request);
  const isAuthenticated = !!session?.user;
  const userRole: UserRole | undefined = session?.user?.role;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && AUTH_PAGE_PATHS.includes(pathname as any)) {
    // If user is trying to access login/register, redirect to account dashboard
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // Check if route requires authentication
  if (matchesPrefix(pathname, PROTECTED_ROUTE_PREFIXES)) {
    if (!isAuthenticated) {
      // Redirect to login with callback URL
      const loginUrl = new URL(AUTH_ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if route requires admin role
    if (matchesPrefix(pathname, ADMIN_ROUTE_PREFIXES)) {
      if (!isAdminUser(userRole)) {
        // Redirect non-admin users to forbidden page
        return NextResponse.redirect(new URL("/403", request.url));
      }
    }
  }

  // Add security headers
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Add user info to headers for use in API routes (optional)
  if (isAuthenticated && session.user) {
    response.headers.set("X-User-Id", session.user.id);
    response.headers.set("X-User-Role", userRole || "customer");
  }

  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
  runtime: "nodejs",
};
