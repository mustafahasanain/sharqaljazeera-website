import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/auth/signout/route";

// Mock the auth module
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      signOut: vi.fn(),
    },
  },
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

describe("POST /api/auth/signout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should sign out successfully with authorization header", async () => {
    const mockHeaders = new Headers();
    mockHeaders.set("authorization", "Bearer test-token");

    vi.mocked(headers).mockResolvedValue(mockHeaders);
    vi.mocked(auth.api.signOut).mockResolvedValue({ success: true } as any);

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/signout"),
      {
        method: "POST",
        headers: mockHeaders,
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({
      success: true,
      message: "Successfully signed out",
    });
    expect(auth.api.signOut).toHaveBeenCalledWith({
      headers: mockHeaders,
    });
  });

  it("should return 401 when no session token is present", async () => {
    const mockHeaders = new Headers();

    vi.mocked(headers).mockResolvedValue(mockHeaders);

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/signout"),
      {
        method: "POST",
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({
      error: "No active session found",
    });
    expect(auth.api.signOut).not.toHaveBeenCalled();
  });

  it("should set cookie headers to clear auth cookies", async () => {
    const mockHeaders = new Headers();
    mockHeaders.set("authorization", "Bearer test-token");

    vi.mocked(headers).mockResolvedValue(mockHeaders);
    vi.mocked(auth.api.signOut).mockResolvedValue({ success: true } as any);

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/signout"),
      {
        method: "POST",
        headers: mockHeaders,
      }
    );

    const response = await POST(request);

    const setCookie = response.headers.get("Set-Cookie");
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain("auth.session-token=");
    expect(setCookie).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  });

  it("should handle signout errors gracefully", async () => {
    const mockHeaders = new Headers();
    mockHeaders.set("authorization", "Bearer test-token");

    vi.mocked(headers).mockResolvedValue(mockHeaders);
    vi.mocked(auth.api.signOut).mockRejectedValue(
      new Error("Sign out failed")
    );

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/signout"),
      {
        method: "POST",
        headers: mockHeaders,
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toHaveProperty("error", "Failed to sign out");
    expect(json).toHaveProperty("message", "Sign out failed");
  });

  it("should handle unknown errors", async () => {
    const mockHeaders = new Headers();
    mockHeaders.set("authorization", "Bearer test-token");

    vi.mocked(headers).mockResolvedValue(mockHeaders);
    vi.mocked(auth.api.signOut).mockRejectedValue("Unknown error");

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/signout"),
      {
        method: "POST",
        headers: mockHeaders,
      }
    );

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toHaveProperty("error", "Failed to sign out");
    expect(json).toHaveProperty("message", "Unknown error occurred");
  });
});

describe("GET /api/auth/signout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to home page after successful signout", async () => {
    const mockHeaders = new Headers();

    vi.mocked(headers).mockResolvedValue(mockHeaders);
    vi.mocked(auth.api.signOut).mockResolvedValue({ success: true } as any);

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/signout"),
      {
        method: "GET",
      }
    );

    const response = await GET(request);

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("http://localhost:3000/");
    expect(auth.api.signOut).toHaveBeenCalledWith({
      headers: mockHeaders,
    });
  });

  it("should clear cookies in redirect response", async () => {
    const mockHeaders = new Headers();

    vi.mocked(headers).mockResolvedValue(mockHeaders);
    vi.mocked(auth.api.signOut).mockResolvedValue({ success: true } as any);

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/signout"),
      {
        method: "GET",
      }
    );

    const response = await GET(request);

    const setCookie = response.headers.get("Set-Cookie");
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain("auth.session-token=");
    expect(setCookie).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  });

  it("should redirect to home even on error", async () => {
    const mockHeaders = new Headers();

    vi.mocked(headers).mockResolvedValue(mockHeaders);
    vi.mocked(auth.api.signOut).mockRejectedValue(
      new Error("Sign out failed")
    );

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/signout"),
      {
        method: "GET",
      }
    );

    const response = await GET(request);

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("http://localhost:3000/");
  });

  it("should not set cookie headers on error redirect", async () => {
    const mockHeaders = new Headers();

    vi.mocked(headers).mockResolvedValue(mockHeaders);
    vi.mocked(auth.api.signOut).mockRejectedValue(
      new Error("Sign out failed")
    );

    const request = new NextRequest(
      new URL("http://localhost:3000/api/auth/signout"),
      {
        method: "GET",
      }
    );

    const response = await GET(request);

    // Should still redirect but without cookie clearing headers
    expect(response.status).toBe(302);
    // The error path doesn't set Set-Cookie headers
    const setCookie = response.headers.get("Set-Cookie");
    expect(setCookie).toBeNull();
  });
});
