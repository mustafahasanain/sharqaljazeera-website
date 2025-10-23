import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";

// Request body validation schema
const resetPasswordRequestSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  redirectTo: z.string().url().optional(), // Optional redirect URL after reset
});

/**
 * POST /api/auth/reset-password/request
 * Request a password reset email
 *
 * This endpoint:
 * 1. Validates the email address
 * 2. Checks if user exists (silently fails if not for security)
 * 3. Generates a secure reset token
 * 4. Sends password reset email with token
 * 5. Returns success response (even if user doesn't exist)
 *
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "redirectTo": "https://example.com/reset-password" (optional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = resetPasswordRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const { email, redirectTo } = validation.data;

    // Generate password reset token and send email
    // Better Auth handles:
    // - Token generation
    // - Token storage in database
    // - Email sending via configured email provider
    // - Token expiration (default 1 hour)
    await auth.api.forgetPassword({
      body: {
        email,
        redirectTo: redirectTo || `${process.env.BETTER_AUTH_URL}/reset-password`,
      },
    });

    // Always return success response for security
    // Even if user doesn't exist, we return success to prevent email enumeration
    return NextResponse.json(
      {
        success: true,
        message: "If an account exists with this email, you will receive a password reset link shortly.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset request error:", error);

    // Return generic error to prevent information leakage
    return NextResponse.json(
      {
        error: "Failed to process password reset request",
        message: "An error occurred while processing your request. Please try again later."
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/auth/reset-password/request
 * Handle CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
