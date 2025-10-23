import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, OPTIONS } from "@/app/api/auth/reset-password/confirm/route";

// Mock the auth module
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      resetPassword: vi.fn(),
    },
  },
}));

import { auth } from "@/lib/auth";

describe("POST /api/auth/reset-password/confirm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reset password successfully with valid token and password", async () => {
    vi.mocked(auth.api.resetPassword).mockResolvedValue({ status: true } as any);

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "POST",
        body: JSON.stringify({
          token: "valid-reset-token-123",
          newPassword: "NewSecure123!",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({
      success: true,
      message:
        "Password has been reset successfully. You can now sign in with your new password.",
    });
    expect(auth.api.resetPassword).toHaveBeenCalledWith({
      body: {
        token: "valid-reset-token-123",
        password: "NewSecure123!",
      },
    });
  });

  it("should return 400 for missing token", async () => {
    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "POST",
        body: JSON.stringify({
          newPassword: "NewSecure123!",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty("error", "Validation failed");
    expect(json.details).toHaveProperty("token");
    expect(auth.api.resetPassword).not.toHaveBeenCalled();
  });

  it("should return 400 for empty token", async () => {
    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "POST",
        body: JSON.stringify({
          token: "",
          newPassword: "NewSecure123!",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty("error", "Validation failed");
    expect(json.details).toHaveProperty("token");
  });

  it("should return 400 for password that is too short", async () => {
    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "POST",
        body: JSON.stringify({
          token: "valid-token",
          newPassword: "Short1!",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty("error", "Validation failed");
    expect(json.details).toHaveProperty("newPassword");
    expect(auth.api.resetPassword).not.toHaveBeenCalled();
  });

  it("should return 400 for password that is too long", async () => {
    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "POST",
        body: JSON.stringify({
          token: "valid-token",
          newPassword: "a".repeat(101) + "1!",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty("error", "Validation failed");
    expect(json.details).toHaveProperty("newPassword");
    expect(auth.api.resetPassword).not.toHaveBeenCalled();
  });

  it("should return 400 for missing password", async () => {
    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "POST",
        body: JSON.stringify({
          token: "valid-token",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty("error", "Validation failed");
    expect(json.details).toHaveProperty("newPassword");
  });

  it("should return 400 for invalid or expired token", async () => {
    vi.mocked(auth.api.resetPassword).mockResolvedValue(null as any);

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "POST",
        body: JSON.stringify({
          token: "invalid-token",
          newPassword: "NewSecure123!",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty("error", "Invalid or expired reset token");
    expect(json).toHaveProperty(
      "message",
      "The password reset link is invalid or has expired. Please request a new one."
    );
  });

  it("should handle password policy violations", async () => {
    vi.mocked(auth.api.resetPassword).mockRejectedValue(
      new Error("Password must contain at least one uppercase letter")
    );

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "POST",
        body: JSON.stringify({
          token: "valid-token",
          newPassword: "newsecure123!",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty("error", "Password validation failed");
    expect(json).toHaveProperty(
      "message",
      "Password must contain at least one uppercase letter"
    );
  });

  it("should handle token-related errors", async () => {
    vi.mocked(auth.api.resetPassword).mockRejectedValue(
      new Error("Token has expired")
    );

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "POST",
        body: JSON.stringify({
          token: "expired-token",
          newPassword: "NewSecure123!",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty("error", "Invalid or expired reset token");
    expect(json).toHaveProperty(
      "message",
      "The password reset link is invalid or has expired. Please request a new one."
    );
  });

  it("should handle generic server errors", async () => {
    vi.mocked(auth.api.resetPassword).mockRejectedValue(
      new Error("Database connection failed")
    );

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "POST",
        body: JSON.stringify({
          token: "valid-token",
          newPassword: "NewSecure123!",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toHaveProperty("error", "Failed to reset password");
    expect(json).toHaveProperty(
      "message",
      "An error occurred while resetting your password. Please try again later."
    );
  });

  it("should handle non-Error objects thrown", async () => {
    vi.mocked(auth.api.resetPassword).mockRejectedValue("Unknown error");

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "POST",
        body: JSON.stringify({
          token: "valid-token",
          newPassword: "NewSecure123!",
        }),
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toHaveProperty("error", "Failed to reset password");
  });

  it("should handle malformed JSON gracefully", async () => {
    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "POST",
        body: "not-json",
      }
    );

    const response = await POST(request);

    // Should return an error response
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it("should validate password with exactly 8 characters", async () => {
    vi.mocked(auth.api.resetPassword).mockResolvedValue({ status: true } as any);

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "POST",
        body: JSON.stringify({
          token: "valid-token",
          newPassword: "Secure1!",
        }),
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(200);
  });

  it("should validate password with exactly 100 characters", async () => {
    vi.mocked(auth.api.resetPassword).mockResolvedValue({ status: true } as any);

    const longPassword = "A".repeat(98) + "1!";

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "POST",
        body: JSON.stringify({
          token: "valid-token",
          newPassword: longPassword,
        }),
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(200);
  });
});

describe("OPTIONS /api/auth/reset-password/confirm", () => {
  it("should return CORS headers for preflight request", async () => {
    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
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
      new URL("http://localhost:3000/api/auth/reset-password/confirm"),
      {
        method: "OPTIONS",
      }
    );

    const response = await OPTIONS(request);
    const text = await response.text();

    expect(text).toBe("");
  });
});
