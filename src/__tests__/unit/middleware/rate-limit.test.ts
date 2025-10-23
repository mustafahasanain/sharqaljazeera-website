import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getRateLimitInfo,
  addRateLimitHeaders,
  clearAllRateLimits,
} from "@/lib/middleware/rate-limit";

describe("Rate Limit Middleware", () => {
  beforeEach(() => {
    // Clear all rate limits before each test
    clearAllRateLimits();
  });

  afterEach(() => {
    // Clean up after each test
    clearAllRateLimits();
  });

  describe("checkRateLimit", () => {
    it("should allow first request", async () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/test")
      );

      const result = await checkRateLimit(request);

      expect(result).toBeNull();
    });

    it("should skip rate limiting for static files", async () => {
      const requests = [
        new NextRequest(new URL("http://localhost:3000/_next/static/test.js")),
        new NextRequest(new URL("http://localhost:3000/static/image.png")),
        new NextRequest(new URL("http://localhost:3000/favicon.ico")),
        new NextRequest(new URL("http://localhost:3000/logo.svg")),
      ];

      for (const request of requests) {
        const result = await checkRateLimit(request);
        expect(result).toBeNull();
      }
    });

    it("should apply stricter limits to auth routes", async () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/auth/signin"),
        {
          headers: {
            "x-forwarded-for": "192.168.1.1",
            "user-agent": "test-agent",
          },
        }
      );

      // Make 5 requests (auth limit is 5 per 15 minutes)
      for (let i = 0; i < 5; i++) {
        const result = await checkRateLimit(request);
        expect(result).toBeNull();
      }

      // 6th request should be rate limited
      const result = await checkRateLimit(request);
      expect(result).toBeInstanceOf(NextResponse);
      expect(result?.status).toBe(429);
    });

    it("should apply moderate limits to API routes", async () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/products"),
        {
          headers: {
            "x-forwarded-for": "192.168.1.2",
            "user-agent": "test-agent",
          },
        }
      );

      // API limit is 60 per minute
      // Test that first 60 requests are allowed
      for (let i = 0; i < 60; i++) {
        const result = await checkRateLimit(request);
        expect(result).toBeNull();
      }

      // 61st request should be rate limited
      const result = await checkRateLimit(request);
      expect(result).toBeInstanceOf(NextResponse);
      expect(result?.status).toBe(429);
    });

    it("should include rate limit headers in 429 response", async () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/auth/signin"),
        {
          headers: {
            "x-forwarded-for": "192.168.1.3",
            "user-agent": "test-agent",
          },
        }
      );

      // Exhaust the rate limit
      for (let i = 0; i < 5; i++) {
        await checkRateLimit(request);
      }

      const result = await checkRateLimit(request);
      expect(result?.headers.get("Content-Type")).toBe("application/json");
      expect(result?.headers.get("Retry-After")).toBeTruthy();
      expect(result?.headers.get("X-RateLimit-Limit")).toBe("5");
      expect(result?.headers.get("X-RateLimit-Remaining")).toBe("0");
      expect(result?.headers.get("X-RateLimit-Reset")).toBeTruthy();
    });

    it("should return proper error message in 429 response", async () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/auth/signin"),
        {
          headers: {
            "x-forwarded-for": "192.168.1.4",
            "user-agent": "test-agent",
          },
        }
      );

      // Exhaust the rate limit
      for (let i = 0; i < 5; i++) {
        await checkRateLimit(request);
      }

      const result = await checkRateLimit(request);
      const json = await result?.json();

      expect(json).toHaveProperty("error", "Too Many Requests");
      expect(json).toHaveProperty("message");
      expect(json).toHaveProperty("retryAfter");
    });

    it("should use different limits for different client IPs", async () => {
      const request1 = new NextRequest(
        new URL("http://localhost:3000/api/auth/signin"),
        {
          headers: {
            "x-forwarded-for": "192.168.1.5",
            "user-agent": "test-agent",
          },
        }
      );

      const request2 = new NextRequest(
        new URL("http://localhost:3000/api/auth/signin"),
        {
          headers: {
            "x-forwarded-for": "192.168.1.6",
            "user-agent": "test-agent",
          },
        }
      );

      // Exhaust limit for first IP
      for (let i = 0; i < 5; i++) {
        await checkRateLimit(request1);
      }

      const result1 = await checkRateLimit(request1);
      expect(result1?.status).toBe(429);

      // Second IP should still be allowed
      const result2 = await checkRateLimit(request2);
      expect(result2).toBeNull();
    });

    it("should handle Cloudflare IP header", async () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/test"),
        {
          headers: {
            "cf-connecting-ip": "192.168.1.7",
            "user-agent": "test-agent",
          },
        }
      );

      const result = await checkRateLimit(request);
      expect(result).toBeNull();
    });

    it("should handle x-real-ip header", async () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/test"),
        {
          headers: {
            "x-real-ip": "192.168.1.8",
            "user-agent": "test-agent",
          },
        }
      );

      const result = await checkRateLimit(request);
      expect(result).toBeNull();
    });
  });

  describe("getRateLimitInfo", () => {
    it("should return rate limit info for new client", () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/test"),
        {
          headers: {
            "x-forwarded-for": "192.168.1.9",
            "user-agent": "test-agent",
          },
        }
      );

      const info = getRateLimitInfo(request);

      expect(info).toBeTruthy();
      expect(info?.limit).toBeGreaterThan(0);
      expect(info?.remaining).toBe(info?.limit);
      expect(info?.reset).toBeInstanceOf(Date);
    });

    it("should return updated info after requests", async () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/test"),
        {
          headers: {
            "x-forwarded-for": "192.168.1.10",
            "user-agent": "test-agent",
          },
        }
      );

      // Make one request
      await checkRateLimit(request);

      const info = getRateLimitInfo(request);

      expect(info).toBeTruthy();
      expect(info?.remaining).toBeLessThan(info?.limit || 0);
    });

    it("should return correct remaining count", async () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/auth/signin"),
        {
          headers: {
            "x-forwarded-for": "192.168.1.11",
            "user-agent": "test-agent",
          },
        }
      );

      // Make 3 requests
      for (let i = 0; i < 3; i++) {
        await checkRateLimit(request);
      }

      const info = getRateLimitInfo(request);

      expect(info).toBeTruthy();
      expect(info?.limit).toBe(5); // Auth limit
      expect(info?.remaining).toBe(2); // 5 - 3 = 2
    });
  });

  describe("addRateLimitHeaders", () => {
    it("should add rate limit headers to response", () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/test"),
        {
          headers: {
            "x-forwarded-for": "192.168.1.12",
            "user-agent": "test-agent",
          },
        }
      );

      const response = NextResponse.json({ success: true });
      const updatedResponse = addRateLimitHeaders(response, request);

      expect(updatedResponse.headers.get("X-RateLimit-Limit")).toBeTruthy();
      expect(updatedResponse.headers.get("X-RateLimit-Remaining")).toBeTruthy();
      expect(updatedResponse.headers.get("X-RateLimit-Reset")).toBeTruthy();
    });

    it("should not throw error if rate limit info is unavailable", () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/test")
      );
      const response = NextResponse.json({ success: true });

      expect(() => addRateLimitHeaders(response, request)).not.toThrow();
    });
  });

  describe("clearAllRateLimits", () => {
    it("should clear all rate limits", async () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/auth/signin"),
        {
          headers: {
            "x-forwarded-for": "192.168.1.13",
            "user-agent": "test-agent",
          },
        }
      );

      // Exhaust the rate limit
      for (let i = 0; i < 5; i++) {
        await checkRateLimit(request);
      }

      // Should be rate limited
      let result = await checkRateLimit(request);
      expect(result?.status).toBe(429);

      // Clear all limits
      clearAllRateLimits();

      // Should be allowed again
      result = await checkRateLimit(request);
      expect(result).toBeNull();
    });
  });

  describe("Route-specific Rate Limits", () => {
    it("should apply correct limits for auth routes", async () => {
      const authRequest = new NextRequest(
        new URL("http://localhost:3000/api/auth/signin"),
        {
          headers: {
            "x-forwarded-for": "192.168.1.14",
            "user-agent": "test-agent",
          },
        }
      );

      const info = getRateLimitInfo(authRequest);
      expect(info?.limit).toBe(5); // Auth routes have limit of 5
    });

    it("should apply correct limits for API routes", async () => {
      const apiRequest = new NextRequest(
        new URL("http://localhost:3000/api/products"),
        {
          headers: {
            "x-forwarded-for": "192.168.1.15",
            "user-agent": "test-agent",
          },
        }
      );

      const info = getRateLimitInfo(apiRequest);
      expect(info?.limit).toBe(60); // API routes have limit of 60
    });

    it("should apply correct limits for general pages", async () => {
      const pageRequest = new NextRequest(
        new URL("http://localhost:3000/products"),
        {
          headers: {
            "x-forwarded-for": "192.168.1.16",
            "user-agent": "test-agent",
          },
        }
      );

      const info = getRateLimitInfo(pageRequest);
      expect(info?.limit).toBe(100); // General pages have limit of 100
    });
  });
});
