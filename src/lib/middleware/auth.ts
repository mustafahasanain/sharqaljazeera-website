import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/types/user";
import type { Session, User } from "@/lib/auth";

/**
 * Extract session from the request
 * Uses Better Auth to validate the session cookie
 */
export async function getSessionFromRequest(
  request: NextRequest
): Promise<{ user: User; session: Session } | null> {
  try {
    // Get the session cookie from the request
    const sessionToken = request.cookies.get("auth.session-token")?.value;

    if (!sessionToken) {
      return null;
    }

    // Verify the session using Better Auth
    // Better Auth automatically validates the session token
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return null;
    }

    return session;
  } catch (error) {
    console.error("Failed to get session from request:", error);
    return null;
  }
}

/**
 * Check if user has a specific role
 */
export function hasRole(userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean {
  if (!userRole) {
    return false;
  }
  return allowedRoles.includes(userRole);
}

/**
 * Check if user is an admin
 */
export function isAdminUser(userRole: UserRole | undefined): boolean {
  return userRole === "admin";
}

/**
 * Check if user is a vendor
 */
export function isVendorUser(userRole: UserRole | undefined): boolean {
  return userRole === "vendor";
}

/**
 * Check if user is support staff
 */
export function isSupportUser(userRole: UserRole | undefined): boolean {
  return userRole === "support";
}

/**
 * Check if user is a customer
 */
export function isCustomerUser(userRole: UserRole | undefined): boolean {
  return userRole === "customer";
}

/**
 * Check if user has admin or support role
 */
export function isStaffUser(userRole: UserRole | undefined): boolean {
  return hasRole(userRole, ["admin", "support"]);
}

/**
 * Check if user has vendor or admin role (can manage products)
 */
export function canManageProducts(userRole: UserRole | undefined): boolean {
  return hasRole(userRole, ["admin", "vendor"]);
}

/**
 * Check if user can access admin panel
 */
export function canAccessAdminPanel(userRole: UserRole | undefined): boolean {
  return hasRole(userRole, ["admin", "support", "vendor"]);
}

/**
 * Extract user ID from session
 */
export function getUserIdFromSession(
  session: { user: User } | null
): string | null {
  return session?.user?.id || null;
}

/**
 * Extract user email from session
 */
export function getUserEmailFromSession(
  session: { user: User } | null
): string | null {
  return session?.user?.email || null;
}

/**
 * Extract user role from session
 */
export function getUserRoleFromSession(
  session: { user: User } | null
): UserRole | null {
  return session?.user?.role || null;
}

/**
 * Check if user's email is verified
 */
export function isEmailVerified(session: { user: User } | null): boolean {
  return session?.user?.emailVerified || false;
}

/**
 * Check if user account is active
 */
export function isAccountActive(session: { user: User } | null): boolean {
  return session?.user?.status === "active";
}

/**
 * Check if user can perform action based on status
 */
export function canPerformAction(session: { user: User } | null): boolean {
  if (!session) {
    return false;
  }

  const status = session.user.status;

  // Only active users can perform actions
  if (status !== "active") {
    return false;
  }

  return true;
}

/**
 * Get authorization error message based on user state
 */
export function getAuthErrorMessage(session: { user: User } | null): string {
  if (!session) {
    return "You must be logged in to perform this action";
  }

  const status = session.user.status;

  switch (status) {
    case "inactive":
      return "Your account is inactive. Please contact support.";
    case "suspended":
      return "Your account has been suspended. Please contact support.";
    case "pending_verification":
      return "Please verify your email address to continue.";
    default:
      return "You are not authorized to perform this action";
  }
}

/**
 * Create authorization context for API routes
 * Contains user info and permission helpers
 */
export type AuthContext = {
  readonly user: User | null;
  readonly session: Session | null;
  readonly isAuthenticated: boolean;
  readonly role: UserRole | null;
  readonly isAdmin: boolean;
  readonly isVendor: boolean;
  readonly isSupport: boolean;
  readonly isCustomer: boolean;
  readonly isStaff: boolean;
  readonly canManageProducts: boolean;
  readonly canAccessAdminPanel: boolean;
  readonly isEmailVerified: boolean;
  readonly isAccountActive: boolean;
  readonly canPerformAction: boolean;
};

/**
 * Create auth context from session
 */
export function createAuthContext(
  sessionData: { user: User; session: Session } | null
): AuthContext {
  const role = sessionData?.user?.role || null;

  return {
    user: sessionData?.user || null,
    session: sessionData?.session || null,
    isAuthenticated: !!sessionData,
    role,
    isAdmin: isAdminUser(role),
    isVendor: isVendorUser(role),
    isSupport: isSupportUser(role),
    isCustomer: isCustomerUser(role),
    isStaff: isStaffUser(role),
    canManageProducts: canManageProducts(role),
    canAccessAdminPanel: canAccessAdminPanel(role),
    isEmailVerified: isEmailVerified(sessionData),
    isAccountActive: isAccountActive(sessionData),
    canPerformAction: canPerformAction(sessionData),
  };
}
