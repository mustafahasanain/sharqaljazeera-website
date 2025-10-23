import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better Auth catch-all handler for Next.js App Router
// This handles all authentication endpoints:
// - POST /api/auth/sign-up - Create new user account
// - POST /api/auth/sign-in - Sign in with email/password
// - POST /api/auth/sign-out - Sign out current session
// - POST /api/auth/verify-email - Verify email address
// - POST /api/auth/forgot-password - Request password reset
// - POST /api/auth/reset-password - Reset password with token
// - GET /api/auth/session - Get current session
// - POST /api/auth/refresh - Refresh session token
// - GET /api/auth/callback/[provider] - OAuth callback handlers
// - And more...

// Export named HTTP method handlers
export const { GET, POST, PUT, PATCH, DELETE } = toNextJsHandler(auth);
