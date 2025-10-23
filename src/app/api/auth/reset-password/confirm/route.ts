import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";

// Request body validation schema
const resetPasswordConfirmSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters"),
});

/**
 * POST /api/auth/reset-password/confirm
 * Confirm password reset with token and set new password
 *
 * This endpoint:
 * 1. Validates the reset token
 * 2. Validates the new password against password policy
 * 3. Checks token expiration (default 1 hour)
 * 4. Updates user password in database
 * 5. Invalidates the reset token
 * 6. Sends password changed confirmation email
 * 7. Returns success response
 *
 * Request body:
 * {
 *   "token": "reset-token-from-email",
 *   "newPassword": "NewSecurePassword123!"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = resetPasswordConfirmSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const { token, newPassword } = validation.data;

    // Reset password using Better Auth
    // Better Auth handles:
    // - Token validation
    // - Token expiration check
    // - Password policy validation (from config)
    // - Password hashing
    // - Token invalidation
    // - Password changed email notification
    const result = await auth.api.resetPassword({
      body: {
        token,
        password: newPassword,
      },
    });

    // Check if reset was successful
    if (!result) {
      return NextResponse.json(
        {
          error: "Invalid or expired reset token",
          message: "The password reset link is invalid or has expired. Please request a new one."
        },
        { status: 400 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Password has been reset successfully. You can now sign in with your new password.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset confirmation error:", error);

    // Handle specific error cases
    if (error instanceof Error) {
      // Password policy violation errors
      if (error.message.includes("Password must")) {
        return NextResponse.json(
          {
            error: "Password validation failed",
            message: error.message
          },
          { status: 400 }
        );
      }

      // Token validation errors
      if (
        error.message.includes("token") ||
        error.message.includes("expired") ||
        error.message.includes("invalid")
      ) {
        return NextResponse.json(
          {
            error: "Invalid or expired reset token",
            message: "The password reset link is invalid or has expired. Please request a new one."
          },
          { status: 400 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Failed to reset password",
        message: "An error occurred while resetting your password. Please try again later."
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/auth/reset-password/confirm
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
