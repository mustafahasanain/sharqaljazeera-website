import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, OPTIONS } from "@/app/api/auth/reset-password/request/route";

// Mock the auth module
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      forgetPassword: vi.fn(),
    },
  },
}));

import { auth } from "@/lib/auth";

describe("POST /api/auth/reset-password/request", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.BETTER_AUTH_URL = "http://localhost:3000";
  });

  it("should request password reset successfully with valid email", async () => {
    vi.mocked(auth.api.forgetPassword).mockResolvedValue({
      status: true,
    } as any);

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/request"),
      {
        method: "POST",
        body: JSON.stringify({
          email: "user@example.com",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link shortly.",
    });
    expect(auth.api.forgetPassword).toHaveBeenCalledWith({
      body: {
        email: "user@example.com",
        redirectTo: "http://localhost:3000/reset-password",
      },
    });
  });

  it("should request password reset with custom redirectTo URL", async () => {
    vi.mocked(auth.api.forgetPassword).mockResolvedValue(undefined as any);

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/request"),
      {
        method: "POST",
        body: JSON.stringify({
          email: "user@example.com",
          redirectTo: "https://example.com/custom-reset",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toHaveProperty("success", true);
    expect(auth.api.forgetPassword).toHaveBeenCalledWith({
      body: {
        email: "user@example.com",
        redirectTo: "https://example.com/custom-reset",
      },
    });
  });

  it("should return 400 for invalid email format", async () => {
    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/request"),
      {
        method: "POST",
        body: JSON.stringify({
          email: "invalid-email",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty("error", "Validation failed");
    expect(json).toHaveProperty("details");
    expect(json.details).toHaveProperty("email");
    expect(auth.api.forgetPassword).not.toHaveBeenCalled();
  });

  it("should return 400 for missing email", async () => {
    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/request"),
      {
        method: "POST",
        body: JSON.stringify({}),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty("error", "Validation failed");
    expect(json).toHaveProperty("details");
    expect(auth.api.forgetPassword).not.toHaveBeenCalled();
  });

  it("should return 400 for invalid redirectTo URL", async () => {
    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/request"),
      {
        method: "POST",
        body: JSON.stringify({
          email: "user@example.com",
          redirectTo: "not-a-valid-url",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty("error", "Validation failed");
    expect(json.details).toHaveProperty("redirectTo");
    expect(auth.api.forgetPassword).not.toHaveBeenCalled();
  });

  it("should return success even if user doesn't exist (security)", async () => {
    // This prevents email enumeration attacks
    vi.mocked(auth.api.forgetPassword).mockResolvedValue(undefined as any);

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/request"),
      {
        method: "POST",
        body: JSON.stringify({
          email: "nonexistent@example.com",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link shortly.",
    });
  });

  it("should handle server errors gracefully", async () => {
    vi.mocked(auth.api.forgetPassword).mockRejectedValue(
      new Error("Database error")
    );

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/request"),
      {
        method: "POST",
        body: JSON.stringify({
          email: "user@example.com",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toHaveProperty(
      "error",
      "Failed to process password reset request"
    );
    expect(json).toHaveProperty(
      "message",
      "An error occurred while processing your request. Please try again later."
    );
  });

  it("should handle malformed JSON gracefully", async () => {
    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/request"),
      {
        method: "POST",
        body: "not-json",
      }
    );

    const response = await POST(request);

    // Should return an error response
    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});

describe("OPTIONS /api/auth/reset-password/request", () => {
  it("should return CORS headers for preflight request", async () => {
    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/request"),
      {
        method: "OPTIONS",
      }
    );

    const response = await OPTIONS(request);

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "POST, OPTIONS"
    );
    expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
      "Content-Type, Authorization"
    );
  });

  it("should return empty body for OPTIONS request", async () => {
    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/request"),
      {
        method: "OPTIONS",
      }
    );

    const response = await OPTIONS(request);
    const text = await response.text();

    expect(text).toBe("");
  });
});
