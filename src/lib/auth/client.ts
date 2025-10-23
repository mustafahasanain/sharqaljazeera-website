"use client";

import { createAuthClient } from "better-auth/react";
import type { User as AuthUser, Session as AuthSession } from "better-auth";
import type { UserRole } from "@/types/user";

// Auth client configuration
// This is the client-side interface for Better Auth
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",

  // Fetch options for API calls
  fetchOptions: {
    credentials: "include", // Include cookies in requests
  },
});

// Re-export commonly used auth methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  updateUser,
  changePassword,
  sendVerificationEmail,
  resetPassword,
  forgetPassword,
} = authClient;

// Client-side auth types
export type ClientUser = AuthUser;
export type ClientSession = AuthSession;

// Sign in with email and password
export type SignInWithEmailParams = {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean;
};

export const signInWithEmail = async ({
  email,
  password,
  rememberMe = false,
}: SignInWithEmailParams): Promise<{
  user: ClientUser | null;
  session: ClientSession | null;
  error?: string;
}> => {
  try {
    const response = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    }) as any;

    // Check if response is an error
    if ('error' in response) {
      return {
        user: null,
        session: null,
        error: response.error?.message || "Failed to sign in",
      };
    }

    return {
      user: response.data?.user || null,
      session: response.data?.session || null,
    };
  } catch (error) {
    return {
      user: null,
      session: null,
      error:
        error instanceof Error ? error.message : "Failed to sign in",
    };
  }
};

// Sign up with email and password
export type SignUpWithEmailParams = {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone?: string;
};

export const signUpWithEmail = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpWithEmailParams): Promise<{
  user: ClientUser | null;
  session: ClientSession | null;
  error?: string;
}> => {
  try {
    const response = await authClient.signUp.email({
      email,
      password,
      name: `${firstName} ${lastName}`,
      // Additional fields can be passed as image or other supported fields
      callbackURL: "/auth/verify-email",
    }) as any;

    // Check if response is an error
    if ('error' in response) {
      return {
        user: null,
        session: null,
        error: response.error?.message || "Failed to sign up",
      };
    }

    return {
      user: response.data?.user || null,
      session: response.data?.session || null,
    };
  } catch (error) {
    return {
      user: null,
      session: null,
      error:
        error instanceof Error ? error.message : "Failed to sign up",
    };
  }
};

// Sign in with Google OAuth
export const signInWithGoogle = async (): Promise<void> => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/auth/callback",
    });
  } catch (error) {
    console.error("Failed to sign in with Google:", error);
    throw error;
  }
};

// Sign in with Facebook OAuth
export const signInWithFacebook = async (): Promise<void> => {
  try {
    await authClient.signIn.social({
      provider: "facebook",
      callbackURL: "/auth/callback",
    });
  } catch (error) {
    console.error("Failed to sign in with Facebook:", error);
    throw error;
  }
};

// Sign in with Apple OAuth
export const signInWithApple = async (): Promise<void> => {
  try {
    await authClient.signIn.social({
      provider: "apple",
      callbackURL: "/auth/callback",
    });
  } catch (error) {
    console.error("Failed to sign in with Apple:", error);
    throw error;
  }
};

// Sign out user
export const signOutUser = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await authClient.signOut();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to sign out",
    };
  }
};

// Update user profile
export type UpdateUserProfileParams = {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly avatar?: string;
  readonly dateOfBirth?: string;
  readonly gender?: "male" | "female" | "other" | "prefer_not_to_say";
};

export const updateUserProfile = async (
  data: UpdateUserProfileParams
): Promise<{
  user: ClientUser | null;
  error?: string;
}> => {
  try {
    const response = await authClient.updateUser({
      ...data,
      // Combine firstName and lastName into name if provided
      ...(data.firstName || data.lastName
        ? {
            name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
          }
        : {}),
    }) as any;

    // Check if response is an error
    if ('error' in response) {
      return {
        user: null,
        error: response.error?.message || "Failed to update profile",
      };
    }

    return {
      user: response.data?.user || null,
    };
  } catch (error) {
    return {
      user: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update profile",
    };
  }
};

// Change user password
export type ChangePasswordParams = {
  readonly currentPassword: string;
  readonly newPassword: string;
};

export const changeUserPassword = async ({
  currentPassword,
  newPassword,
}: ChangePasswordParams): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true, // Revoke all other sessions for security
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to change password",
    };
  }
};

// Request password reset
export type RequestPasswordResetParams = {
  readonly email: string;
};

export const requestPasswordReset = async ({
  email,
}: RequestPasswordResetParams): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await authClient.forgetPassword({
      email,
      redirectTo: "/auth/reset-password",
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to request password reset",
    };
  }
};

// Reset password with token
export type ResetPasswordParams = {
  readonly token: string;
  readonly newPassword: string;
};

export const resetPasswordWithToken = async ({
  token,
  newPassword,
}: ResetPasswordParams): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await authClient.resetPassword({
      token,
      newPassword,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to reset password",
    };
  }
};

// Verify email with token
export type VerifyEmailParams = {
  readonly token: string;
};

export const verifyEmail = async ({
  token,
}: VerifyEmailParams): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await authClient.verifyEmail({
      query: {
        token,
      },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to verify email",
    };
  }
};

// Resend verification email
export const resendVerificationEmail = async (email: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await authClient.sendVerificationEmail({
      email,
      callbackURL: "/auth/verify-email",
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to resend verification email",
    };
  }
};

// Get current session
export const getCurrentSession = async (): Promise<{
  user: ClientUser | null;
  session: ClientSession | null;
}> => {
  try {
    const response = await authClient.getSession() as any;

    // Check if response is an error
    if ('error' in response) {
      return {
        user: null,
        session: null,
      };
    }

    return {
      user: response.data?.user || null,
      session: response.data?.session || null,
    };
  } catch (error) {
    console.error("Failed to get current session:", error);
    return {
      user: null,
      session: null,
    };
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const { user } = await getCurrentSession();
  return !!user;
};

// Check if user has specific role
export const hasRole = (
  user: ClientUser | null,
  role: UserRole
): boolean => {
  if (!user) return false;
  // Better Auth stores custom fields differently, adjust based on actual implementation
  return (user as unknown as { role?: UserRole }).role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (
  user: ClientUser | null,
  roles: readonly UserRole[]
): boolean => {
  if (!user) return false;
  const userRole = (user as unknown as { role?: UserRole }).role;
  return userRole ? roles.includes(userRole) : false;
};

// Check if user is admin
export const isAdmin = (user: ClientUser | null): boolean => {
  return hasRole(user, "admin");
};

// Check if user is vendor
export const isVendor = (user: ClientUser | null): boolean => {
  return hasRole(user, "vendor");
};

// Check if user email is verified
export const isEmailVerified = (user: ClientUser | null): boolean => {
  if (!user) return false;
  return (user as unknown as { emailVerified?: boolean }).emailVerified || false;
};

// Auth loading state hook
export const useAuthLoading = (): boolean => {
  const { isPending } = useSession();
  return isPending;
};

// Custom hook for protected routes
export const useRequireAuth = (redirectTo: string = "/auth/signin") => {
  const { data: session, isPending } = useSession();

  if (typeof window !== "undefined" && !isPending && !session) {
    window.location.href = redirectTo;
  }

  return { session, isLoading: isPending };
};

// Custom hook for role-based access
export const useRequireRole = (
  requiredRole: UserRole,
  redirectTo: string = "/"
) => {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  if (typeof window !== "undefined" && !isPending) {
    if (!user) {
      window.location.href = "/auth/signin";
    } else if (!hasRole(user, requiredRole)) {
      window.location.href = redirectTo;
    }
  }

  return { session, isLoading: isPending };
};

// Custom hook for admin access
export const useRequireAdmin = (redirectTo: string = "/") => {
  return useRequireRole("admin", redirectTo);
};

// Custom hook for vendor access
export const useRequireVendor = (redirectTo: string = "/") => {
  return useRequireRole("vendor", redirectTo);
};
