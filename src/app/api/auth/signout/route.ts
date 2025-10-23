import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * POST /api/auth/signout
 * Sign out the current user and invalidate their session
 *
 * This endpoint:
 * 1. Validates the current session
 * 2. Invalidates the session in the database
 * 3. Clears authentication cookies
 * 4. Returns success response
 */
export async function POST(request: NextRequest) {
  try {
    // Get session from request headers
    const headersList = await headers();
    const sessionToken = headersList.get("authorization")?.replace("Bearer ", "");

    if (!sessionToken) {
      return NextResponse.json(
        { error: "No active session found" },
        { status: 401 }
      );
    }

    // Sign out using Better Auth
    // Better Auth handles session invalidation and cookie clearing
    await auth.api.signOut({
      headers: headersList,
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Successfully signed out"
      },
      {
        status: 200,
        // Clear auth cookies
        headers: {
          "Set-Cookie": [
            "auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
            "auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
          ].join(", "),
        },
      }
    );
  } catch (error) {
    console.error("Sign out error:", error);

    return NextResponse.json(
      {
        error: "Failed to sign out",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/signout
 * Alternative GET endpoint for sign out (for convenience)
 * Redirects to POST handler
 */
export async function GET(request: NextRequest) {
  // For GET requests, we'll redirect to home after signing out
  try {
    const headersList = await headers();

    await auth.api.signOut({
      headers: headersList,
    });

    // Redirect to home page after sign out
    return NextResponse.redirect(new URL("/", request.url), {
      status: 302,
      headers: {
        "Set-Cookie": [
          "auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
          "auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
        ].join(", "),
      },
    });
  } catch (error) {
    console.error("Sign out error:", error);

    // Still redirect even if there's an error
    return NextResponse.redirect(new URL("/", request.url), {
      status: 302,
    });
  }
}
