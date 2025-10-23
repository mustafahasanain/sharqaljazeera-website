import { describe, it, expect, beforeEach, afterEach } from "vitest";
import type { UserRole } from "@/types/user";
import {
  DEFAULT_SESSION_CONFIG,
  DEFAULT_PASSWORD_POLICY,
  DEFAULT_RATE_LIMIT_CONFIG,
  DEFAULT_SECURITY_CONFIG,
  getOAuthScopes,
  mapUserRole,
  validateAuthEnv,
} from "@/lib/auth/config";

describe("Auth Config", () => {
  describe("Default Configurations", () => {
    it("should have correct default session config", () => {
      expect(DEFAULT_SESSION_CONFIG).toEqual({
        expiresIn: 60 * 60 * 24 * 30, // 30 days
        updateAge: 60 * 60 * 24, // 24 hours
        cookieName: "auth.session-token",
        cookieSecure: process.env.NODE_ENV === "production",
        cookieSameSite: "lax",
      });
    });

    it("should have correct default password policy", () => {
      expect(DEFAULT_PASSWORD_POLICY).toEqual({
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        preventCommonPasswords: true,
      });
    });

    it("should have correct default rate limit config", () => {
      expect(DEFAULT_RATE_LIMIT_CONFIG).toEqual({
        enabled: true,
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes
        blockDuration: 60 * 60 * 1000, // 1 hour
      });
    });

    it("should have correct default security config", () => {
      expect(DEFAULT_SECURITY_CONFIG).toEqual({
        passwordPolicy: DEFAULT_PASSWORD_POLICY,
        rateLimit: DEFAULT_RATE_LIMIT_CONFIG,
        requireEmailVerification: true,
        allowRegistration: true,
        allowSocialAuth: true,
        twoFactorAuth: {
          enabled: false,
          methods: ["email"],
        },
      });
    });
  });

  describe("getOAuthScopes", () => {
    it("should return correct scopes for Google", () => {
      const scopes = getOAuthScopes("google");
      expect(scopes).toEqual(["openid", "email", "profile"]);
    });

    it("should return correct scopes for Facebook", () => {
      const scopes = getOAuthScopes("facebook");
      expect(scopes).toEqual(["email", "public_profile"]);
    });

    it("should return correct scopes for Apple", () => {
      const scopes = getOAuthScopes("apple");
      expect(scopes).toEqual(["name", "email"]);
    });

    it("should return empty array for credentials provider", () => {
      const scopes = getOAuthScopes("credentials");
      expect(scopes).toEqual([]);
    });

    it("should return empty array for unknown provider", () => {
      const scopes = getOAuthScopes("unknown" as any);
      expect(scopes).toEqual([]);
    });
  });

  describe("mapUserRole", () => {
    it("should map admin role correctly", () => {
      const role = mapUserRole("admin");
      expect(role).toBe("admin");
    });

    it("should map vendor role correctly", () => {
      const role = mapUserRole("vendor");
      expect(role).toBe("vendor");
    });

    it("should map support role correctly", () => {
      const role = mapUserRole("support");
      expect(role).toBe("support");
    });

    it("should default to customer for unknown role", () => {
      const role = mapUserRole("unknown");
      expect(role).toBe("customer");
    });

    it("should default to customer for undefined role", () => {
      const role = mapUserRole(undefined);
      expect(role).toBe("customer");
    });

    it("should default to customer for empty string", () => {
      const role = mapUserRole("");
      expect(role).toBe("customer");
    });
  });

  describe("validateAuthEnv", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      // Reset env before each test
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      // Restore original env
      process.env = originalEnv;
    });

    it("should pass validation when all required env vars are present", () => {
      process.env.BETTER_AUTH_SECRET = "test-secret";
      process.env.BETTER_AUTH_URL = "http://localhost:3000";
      process.env.DATABASE_URL = "postgresql://localhost:5432/test";
      process.env.EMAIL_HOST = "smtp.example.com";
      process.env.EMAIL_PORT = "587";
      process.env.EMAIL_USER = "test@example.com";
      process.env.EMAIL_PASSWORD = "password";
      process.env.EMAIL_FROM_NAME = "Test";
      process.env.EMAIL_FROM_ADDRESS = "noreply@example.com";

      expect(() => validateAuthEnv()).not.toThrow();
    });

    it("should throw error when BETTER_AUTH_SECRET is missing", () => {
      delete process.env.BETTER_AUTH_SECRET;
      process.env.BETTER_AUTH_URL = "http://localhost:3000";
      process.env.DATABASE_URL = "postgresql://localhost:5432/test";
      process.env.EMAIL_HOST = "smtp.example.com";
      process.env.EMAIL_PORT = "587";
      process.env.EMAIL_USER = "test@example.com";
      process.env.EMAIL_PASSWORD = "password";
      process.env.EMAIL_FROM_NAME = "Test";
      process.env.EMAIL_FROM_ADDRESS = "noreply@example.com";

      expect(() => validateAuthEnv()).toThrow(
        "Missing required environment variables: BETTER_AUTH_SECRET"
      );
    });

    it("should throw error when multiple env vars are missing", () => {
      delete process.env.BETTER_AUTH_SECRET;
      delete process.env.BETTER_AUTH_URL;
      delete process.env.DATABASE_URL;

      expect(() => validateAuthEnv()).toThrow(
        "Missing required environment variables:"
      );
      expect(() => validateAuthEnv()).toThrow("BETTER_AUTH_SECRET");
      expect(() => validateAuthEnv()).toThrow("BETTER_AUTH_URL");
      expect(() => validateAuthEnv()).toThrow("DATABASE_URL");
    });

    it("should throw error when email configuration is missing", () => {
      process.env.BETTER_AUTH_SECRET = "test-secret";
      process.env.BETTER_AUTH_URL = "http://localhost:3000";
      process.env.DATABASE_URL = "postgresql://localhost:5432/test";
      delete process.env.EMAIL_HOST;
      delete process.env.EMAIL_PORT;
      delete process.env.EMAIL_USER;
      delete process.env.EMAIL_PASSWORD;

      expect(() => validateAuthEnv()).toThrow("EMAIL_HOST");
      expect(() => validateAuthEnv()).toThrow("EMAIL_PORT");
      expect(() => validateAuthEnv()).toThrow("EMAIL_USER");
      expect(() => validateAuthEnv()).toThrow("EMAIL_PASSWORD");
    });
  });
});
