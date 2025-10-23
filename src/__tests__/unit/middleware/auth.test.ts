import { describe, it, expect, vi } from "vitest";
import type { UserRole } from "@/types/user";
import type { User, Session } from "@/lib/auth";
import {
  hasRole,
  isAdminUser,
  isVendorUser,
  isSupportUser,
  isCustomerUser,
  isStaffUser,
  canManageProducts,
  canAccessAdminPanel,
  getUserIdFromSession,
  getUserEmailFromSession,
  getUserRoleFromSession,
  isEmailVerified,
  isAccountActive,
  canPerformAction,
  getAuthErrorMessage,
  createAuthContext,
} from "@/lib/middleware/auth";

describe("Middleware Auth Helpers", () => {
  describe("hasRole", () => {
    it("should return true when user has allowed role", () => {
      expect(hasRole("admin", ["admin", "vendor"])).toBe(true);
      expect(hasRole("vendor", ["admin", "vendor"])).toBe(true);
    });

    it("should return false when user does not have allowed role", () => {
      expect(hasRole("customer", ["admin", "vendor"])).toBe(false);
      expect(hasRole("support", ["admin"])).toBe(false);
    });

    it("should return false when role is undefined", () => {
      expect(hasRole(undefined, ["admin"])).toBe(false);
    });

    it("should return false when allowed roles is empty", () => {
      expect(hasRole("admin", [])).toBe(false);
    });
  });

  describe("isAdminUser", () => {
    it("should return true for admin role", () => {
      expect(isAdminUser("admin")).toBe(true);
    });

    it("should return false for non-admin roles", () => {
      expect(isAdminUser("vendor")).toBe(false);
      expect(isAdminUser("support")).toBe(false);
      expect(isAdminUser("customer")).toBe(false);
      expect(isAdminUser(undefined)).toBe(false);
    });
  });

  describe("isVendorUser", () => {
    it("should return true for vendor role", () => {
      expect(isVendorUser("vendor")).toBe(true);
    });

    it("should return false for non-vendor roles", () => {
      expect(isVendorUser("admin")).toBe(false);
      expect(isVendorUser("support")).toBe(false);
      expect(isVendorUser("customer")).toBe(false);
      expect(isVendorUser(undefined)).toBe(false);
    });
  });

  describe("isSupportUser", () => {
    it("should return true for support role", () => {
      expect(isSupportUser("support")).toBe(true);
    });

    it("should return false for non-support roles", () => {
      expect(isSupportUser("admin")).toBe(false);
      expect(isSupportUser("vendor")).toBe(false);
      expect(isSupportUser("customer")).toBe(false);
      expect(isSupportUser(undefined)).toBe(false);
    });
  });

  describe("isCustomerUser", () => {
    it("should return true for customer role", () => {
      expect(isCustomerUser("customer")).toBe(true);
    });

    it("should return false for non-customer roles", () => {
      expect(isCustomerUser("admin")).toBe(false);
      expect(isCustomerUser("vendor")).toBe(false);
      expect(isCustomerUser("support")).toBe(false);
      expect(isCustomerUser(undefined)).toBe(false);
    });
  });

  describe("isStaffUser", () => {
    it("should return true for admin and support roles", () => {
      expect(isStaffUser("admin")).toBe(true);
      expect(isStaffUser("support")).toBe(true);
    });

    it("should return false for non-staff roles", () => {
      expect(isStaffUser("vendor")).toBe(false);
      expect(isStaffUser("customer")).toBe(false);
      expect(isStaffUser(undefined)).toBe(false);
    });
  });

  describe("canManageProducts", () => {
    it("should return true for admin and vendor roles", () => {
      expect(canManageProducts("admin")).toBe(true);
      expect(canManageProducts("vendor")).toBe(true);
    });

    it("should return false for other roles", () => {
      expect(canManageProducts("support")).toBe(false);
      expect(canManageProducts("customer")).toBe(false);
      expect(canManageProducts(undefined)).toBe(false);
    });
  });

  describe("canAccessAdminPanel", () => {
    it("should return true for admin, support, and vendor roles", () => {
      expect(canAccessAdminPanel("admin")).toBe(true);
      expect(canAccessAdminPanel("support")).toBe(true);
      expect(canAccessAdminPanel("vendor")).toBe(true);
    });

    it("should return false for customer role", () => {
      expect(canAccessAdminPanel("customer")).toBe(false);
      expect(canAccessAdminPanel(undefined)).toBe(false);
    });
  });

  describe("Session Helper Functions", () => {
    const mockUser: Partial<User> = {
      id: "user-123",
      email: "test@example.com",
      role: "customer" as UserRole,
      emailVerified: true,
      status: "active",
    };

    const mockSession: Partial<Session> = {
      id: "session-123",
      userId: "user-123",
    };

    const sessionData = {
      user: mockUser as User,
      session: mockSession as Session,
    };

    describe("getUserIdFromSession", () => {
      it("should return user ID from session", () => {
        expect(getUserIdFromSession(sessionData)).toBe("user-123");
      });

      it("should return null when session is null", () => {
        expect(getUserIdFromSession(null)).toBe(null);
      });

      it("should return null when user is undefined", () => {
        expect(getUserIdFromSession({ user: undefined } as any)).toBe(null);
      });
    });

    describe("getUserEmailFromSession", () => {
      it("should return user email from session", () => {
        expect(getUserEmailFromSession(sessionData)).toBe("test@example.com");
      });

      it("should return null when session is null", () => {
        expect(getUserEmailFromSession(null)).toBe(null);
      });
    });

    describe("getUserRoleFromSession", () => {
      it("should return user role from session", () => {
        expect(getUserRoleFromSession(sessionData)).toBe("customer");
      });

      it("should return null when session is null", () => {
        expect(getUserRoleFromSession(null)).toBe(null);
      });
    });

    describe("isEmailVerified", () => {
      it("should return true when email is verified", () => {
        expect(isEmailVerified(sessionData)).toBe(true);
      });

      it("should return false when email is not verified", () => {
        const unverifiedSession = {
          ...sessionData,
          user: { ...mockUser, emailVerified: false } as User,
        };
        expect(isEmailVerified(unverifiedSession)).toBe(false);
      });

      it("should return false when session is null", () => {
        expect(isEmailVerified(null)).toBe(false);
      });
    });

    describe("isAccountActive", () => {
      it("should return true when account status is active", () => {
        expect(isAccountActive(sessionData)).toBe(true);
      });

      it("should return false when account is inactive", () => {
        const inactiveSession = {
          ...sessionData,
          user: { ...mockUser, status: "inactive" } as User,
        };
        expect(isAccountActive(inactiveSession)).toBe(false);
      });

      it("should return false when session is null", () => {
        expect(isAccountActive(null)).toBe(false);
      });
    });

    describe("canPerformAction", () => {
      it("should return true for active users", () => {
        expect(canPerformAction(sessionData)).toBe(true);
      });

      it("should return false for inactive users", () => {
        const inactiveSession = {
          ...sessionData,
          user: { ...mockUser, status: "inactive" } as User,
        };
        expect(canPerformAction(inactiveSession)).toBe(false);
      });

      it("should return false for suspended users", () => {
        const suspendedSession = {
          ...sessionData,
          user: { ...mockUser, status: "suspended" } as User,
        };
        expect(canPerformAction(suspendedSession)).toBe(false);
      });

      it("should return false when session is null", () => {
        expect(canPerformAction(null)).toBe(false);
      });
    });

    describe("getAuthErrorMessage", () => {
      it("should return login message when session is null", () => {
        expect(getAuthErrorMessage(null)).toBe(
          "You must be logged in to perform this action"
        );
      });

      it("should return inactive message for inactive accounts", () => {
        const inactiveSession = {
          ...sessionData,
          user: { ...mockUser, status: "inactive" } as User,
        };
        expect(getAuthErrorMessage(inactiveSession)).toBe(
          "Your account is inactive. Please contact support."
        );
      });

      it("should return suspended message for suspended accounts", () => {
        const suspendedSession = {
          ...sessionData,
          user: { ...mockUser, status: "suspended" } as User,
        };
        expect(getAuthErrorMessage(suspendedSession)).toBe(
          "Your account has been suspended. Please contact support."
        );
      });

      it("should return verification message for pending verification", () => {
        const pendingSession = {
          ...sessionData,
          user: { ...mockUser, status: "pending_verification" } as User,
        };
        expect(getAuthErrorMessage(pendingSession)).toBe(
          "Please verify your email address to continue."
        );
      });

      it("should return default message for other statuses", () => {
        const activeSession = {
          ...sessionData,
          user: { ...mockUser, status: "active" } as User,
        };
        expect(getAuthErrorMessage(activeSession)).toBe(
          "You are not authorized to perform this action"
        );
      });
    });

    describe("createAuthContext", () => {
      it("should create auth context with all permissions for admin", () => {
        const adminSession = {
          ...sessionData,
          user: { ...mockUser, role: "admin" as UserRole } as User,
        };

        const context = createAuthContext(adminSession);

        expect(context.isAuthenticated).toBe(true);
        expect(context.role).toBe("admin");
        expect(context.isAdmin).toBe(true);
        expect(context.isVendor).toBe(false);
        expect(context.isSupport).toBe(false);
        expect(context.isCustomer).toBe(false);
        expect(context.isStaff).toBe(true);
        expect(context.canManageProducts).toBe(true);
        expect(context.canAccessAdminPanel).toBe(true);
        expect(context.isEmailVerified).toBe(true);
        expect(context.isAccountActive).toBe(true);
        expect(context.canPerformAction).toBe(true);
      });

      it("should create auth context with limited permissions for customer", () => {
        const context = createAuthContext(sessionData);

        expect(context.isAuthenticated).toBe(true);
        expect(context.role).toBe("customer");
        expect(context.isAdmin).toBe(false);
        expect(context.isVendor).toBe(false);
        expect(context.isSupport).toBe(false);
        expect(context.isCustomer).toBe(true);
        expect(context.isStaff).toBe(false);
        expect(context.canManageProducts).toBe(false);
        expect(context.canAccessAdminPanel).toBe(false);
      });

      it("should create unauthenticated context for null session", () => {
        const context = createAuthContext(null);

        expect(context.isAuthenticated).toBe(false);
        expect(context.role).toBe(null);
        expect(context.user).toBe(null);
        expect(context.session).toBe(null);
        expect(context.isAdmin).toBe(false);
        expect(context.canPerformAction).toBe(false);
      });

      it("should handle vendor role correctly", () => {
        const vendorSession = {
          ...sessionData,
          user: { ...mockUser, role: "vendor" as UserRole } as User,
        };

        const context = createAuthContext(vendorSession);

        expect(context.isVendor).toBe(true);
        expect(context.canManageProducts).toBe(true);
        expect(context.canAccessAdminPanel).toBe(true);
        expect(context.isStaff).toBe(false);
      });

      it("should handle support role correctly", () => {
        const supportSession = {
          ...sessionData,
          user: { ...mockUser, role: "support" as UserRole } as User,
        };

        const context = createAuthContext(supportSession);

        expect(context.isSupport).toBe(true);
        expect(context.isStaff).toBe(true);
        expect(context.canAccessAdminPanel).toBe(true);
        expect(context.canManageProducts).toBe(false);
      });
    });
  });
});
