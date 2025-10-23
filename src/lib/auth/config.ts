import type { BetterAuthOptions } from "better-auth";
import type { UserRole } from "@/types/user";

// Auth provider types
export type AuthProvider = "credentials" | "google" | "facebook" | "apple";

// Better Auth configuration
export type AuthConfig = Pick<
  BetterAuthOptions,
  | "database"
  | "emailAndPassword"
  | "socialProviders"
  | "session"
  | "user"
  | "advanced"
>;

// Email configuration for nodemailer
export type EmailConfig = {
  readonly host: string;
  readonly port: number;
  readonly secure: boolean;
  readonly auth: {
    readonly user: string;
    readonly pass: string;
  };
  readonly from: {
    readonly name: string;
    readonly address: string;
  };
};

// Session configuration
export type SessionConfig = {
  readonly expiresIn: number; // in seconds
  readonly updateAge: number; // in seconds
  readonly cookieName: string;
  readonly cookieSecure: boolean;
  readonly cookieSameSite: "lax" | "strict" | "none";
};

// OAuth provider configuration
export type OAuthProviderConfig = {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly redirectUri: string;
  readonly scope?: readonly string[];
};

// Google OAuth config
export type GoogleOAuthConfig = OAuthProviderConfig;

// Facebook OAuth config
export type FacebookOAuthConfig = OAuthProviderConfig;

// Apple OAuth config
export type AppleOAuthConfig = OAuthProviderConfig & {
  readonly teamId: string;
  readonly keyId: string;
  readonly privateKey: string;
};

// Auth callbacks
export type AuthCallbacks = {
  readonly onSignUp?: (userId: string, email: string) => Promise<void>;
  readonly onSignIn?: (userId: string, email: string) => Promise<void>;
  readonly onSignOut?: (userId: string) => Promise<void>;
  readonly onEmailVerification?: (userId: string) => Promise<void>;
  readonly onPasswordReset?: (userId: string) => Promise<void>;
};

// Password policy configuration
export type PasswordPolicy = {
  readonly minLength: number;
  readonly requireUppercase: boolean;
  readonly requireLowercase: boolean;
  readonly requireNumbers: boolean;
  readonly requireSpecialChars: boolean;
  readonly preventCommonPasswords: boolean;
};

// Rate limiting configuration
export type RateLimitConfig = {
  readonly enabled: boolean;
  readonly maxAttempts: number;
  readonly windowMs: number; // time window in milliseconds
  readonly blockDuration: number; // block duration in milliseconds
};

// Security configuration
export type SecurityConfig = {
  readonly passwordPolicy: PasswordPolicy;
  readonly rateLimit: RateLimitConfig;
  readonly requireEmailVerification: boolean;
  readonly allowRegistration: boolean;
  readonly allowSocialAuth: boolean;
  readonly twoFactorAuth: {
    readonly enabled: boolean;
    readonly methods: readonly ("email" | "sms" | "totp")[];
  };
};

// Complete auth configuration type
export type CompleteAuthConfig = {
  readonly baseUrl: string;
  readonly databaseUrl: string;
  readonly secret: string;
  readonly session: SessionConfig;
  readonly email: EmailConfig;
  readonly security: SecurityConfig;
  readonly callbacks: AuthCallbacks;
  readonly oauth?: {
    readonly google?: GoogleOAuthConfig;
    readonly facebook?: FacebookOAuthConfig;
    readonly apple?: AppleOAuthConfig;
  };
};

// Default session configuration
export const DEFAULT_SESSION_CONFIG: SessionConfig = {
  expiresIn: 60 * 60 * 24 * 30, // 30 days
  updateAge: 60 * 60 * 24, // 24 hours
  cookieName: "auth.session-token",
  cookieSecure: process.env.NODE_ENV === "production",
  cookieSameSite: "lax",
};

// Default password policy
export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
};

// Default rate limit configuration
export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  enabled: true,
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDuration: 60 * 60 * 1000, // 1 hour
};

// Default security configuration
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  passwordPolicy: DEFAULT_PASSWORD_POLICY,
  rateLimit: DEFAULT_RATE_LIMIT_CONFIG,
  requireEmailVerification: true,
  allowRegistration: true,
  allowSocialAuth: true,
  twoFactorAuth: {
    enabled: false,
    methods: ["email"],
  },
};

// Helper function to get OAuth scopes
export const getOAuthScopes = (provider: AuthProvider): readonly string[] => {
  switch (provider) {
    case "google":
      return ["openid", "email", "profile"];
    case "facebook":
      return ["email", "public_profile"];
    case "apple":
      return ["name", "email"];
    default:
      return [];
  }
};

// Helper function to map Better Auth user to application user role
export const mapUserRole = (betterAuthRole?: string): UserRole => {
  // Better Auth doesn't have built-in roles, so we default to customer
  // This should be extended based on your custom role implementation
  if (betterAuthRole === "admin") return "admin";
  if (betterAuthRole === "vendor") return "vendor";
  if (betterAuthRole === "support") return "support";
  return "customer";
};

// Helper function to validate environment variables
export const validateAuthEnv = (): void => {
  const required = [
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "DATABASE_URL",
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_USER",
    "EMAIL_PASSWORD",
    "EMAIL_FROM_NAME",
    "EMAIL_FROM_ADDRESS",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};
