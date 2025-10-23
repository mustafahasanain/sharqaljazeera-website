import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/db/schema";
import {
  DEFAULT_SESSION_CONFIG,
  DEFAULT_SECURITY_CONFIG,
  validateAuthEnv,
} from "./config";
import {
  EmailSender,
  generateWelcomeEmail,
  generateEmailVerificationEmail,
  generatePasswordResetEmail,
  generatePasswordChangedEmail,
  getEmailSubject,
} from "./email";

// Validate environment variables on initialization
validateAuthEnv();

// Email sender instance
const emailSender = new EmailSender({
  host: process.env.EMAIL_HOST!,
  port: parseInt(process.env.EMAIL_PORT || "587", 10),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASSWORD!,
  },
  from: {
    name: process.env.EMAIL_FROM_NAME!,
    address: process.env.EMAIL_FROM_ADDRESS!,
  },
});

// Better Auth configuration
export const auth = betterAuth({
  // Database adapter using Drizzle ORM
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL
    schema: {
      // Map Better Auth tables to existing schema
      user: schema.users,
      account: schema.accounts,
      session: schema.sessions,
      verification: schema.verificationTokens,
    },
  }),

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: DEFAULT_SECURITY_CONFIG.requireEmailVerification,

    // Password validation rules
    minPasswordLength: DEFAULT_SECURITY_CONFIG.passwordPolicy.minLength,

    // Send verification email
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: { email: string; name: string };
      url: string;
      token: string;
    }) => {
      const firstName = user.name.split(" ")[0];
      const html = generateEmailVerificationEmail({
        firstName,
        verificationUrl: url,
        expiresIn: "24 hours",
      });

      await emailSender.send({
        to: user.email,
        subject: getEmailSubject("email_verification"),
        html,
      });
    },

    // Send password reset email
    sendResetPassword: async ({
      user,
      url,
    }: {
      user: { email: string; name: string };
      url: string;
      token: string;
    }) => {
      const firstName = user.name.split(" ")[0];
      const html = generatePasswordResetEmail({
        firstName,
        resetUrl: url,
        expiresIn: "1 hour",
      });

      await emailSender.send({
        to: user.email,
        subject: getEmailSubject("password_reset"),
        html,
      });
    },
  },

  // Social authentication providers
  socialProviders: {
    // Google OAuth configuration
    google: {
      enabled: !!process.env.GOOGLE_CLIENT_ID,
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },

    // Facebook OAuth configuration
    facebook: {
      enabled: !!process.env.FACEBOOK_CLIENT_ID,
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/facebook`,
    },

    // Apple OAuth configuration
    apple: {
      enabled: !!process.env.APPLE_CLIENT_ID,
      clientId: process.env.APPLE_CLIENT_ID || "",
      clientSecret: process.env.APPLE_CLIENT_SECRET || "",
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/apple`,
    },
  },

  // Session configuration
  session: {
    expiresIn: DEFAULT_SESSION_CONFIG.expiresIn,
    updateAge: DEFAULT_SESSION_CONFIG.updateAge,
    cookieCache: {
      enabled: true,
      maxAge: DEFAULT_SESSION_CONFIG.updateAge,
    },
  },

  // User configuration
  user: {
    // Change email notification
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({
        user,
        newEmail,
        url,
      }: {
        user: { email: string; name: string };
        newEmail: string;
        url: string;
      }) => {
        const firstName = user.name.split(" ")[0];
        const html = generateEmailVerificationEmail({
          firstName,
          verificationUrl: url,
          expiresIn: "1 hour",
        });

        await emailSender.send({
          to: newEmail,
          subject: getEmailSubject("email_verification"),
          html,
        });
      },
    },

    // Change password notification
    changePassword: {
      enabled: true,
      sendPasswordChangedNotification: async ({
        user,
      }: {
        user: { email: string; name: string };
      }) => {
        const firstName = user.name.split(" ")[0];
        const html = generatePasswordChangedEmail({
          firstName,
          changedAt: new Date().toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short",
          }),
        });

        await emailSender.send({
          to: user.email,
          subject: getEmailSubject("password_changed"),
          html,
        });
      },
    },
  },

  // Advanced configuration
  advanced: {
    // Use secure cookies in production
    useSecureCookies: process.env.NODE_ENV === "production",

    // Cookie options
    cookiePrefix: "auth",

    // CSRF protection
    crossSubDomainCookies: {
      enabled: false,
    },

    // Generate default user name from email
    generateId: () => crypto.randomUUID(),
  },

  // Security configuration
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,

  // Rate limiting (handled by middleware)
  rateLimit: DEFAULT_SECURITY_CONFIG.rateLimit.enabled
    ? {
        window: DEFAULT_SECURITY_CONFIG.rateLimit.windowMs,
        max: DEFAULT_SECURITY_CONFIG.rateLimit.maxAttempts,
      }
    : undefined,

  // Callbacks for custom logic
  callbacks: {
    // After user signs up
    async afterSignUp({ user }: { user: { email: string; name: string } }) {
      // Send welcome email
      const firstName = user.name.split(" ")[0];
      const html = generateWelcomeEmail({
        firstName,
      });

      try {
        await emailSender.send({
          to: user.email,
          subject: getEmailSubject("welcome"),
          html,
        });
      } catch (error) {
        console.error("Failed to send welcome email:", error);
        // Don't throw error to prevent signup failure
      }

      // Log activity (this would be done in your application layer)
      console.log(`New user signed up: ${user.email}`);
    },

    // After user signs in
    async afterSignIn({ user }: { user: { email: string } }) {
      // Update last login timestamp (this would be done in your application layer)
      console.log(`User signed in: ${user.email}`);
    },

    // After user signs out
    async afterSignOut({ userId }: { userId: string }) {
      console.log(`User signed out: ${userId}`);
    },
  },

  // Trust host (required for deployment)
  trustedOrigins: process.env.TRUSTED_ORIGINS?.split(",") || [],
});

// Export types for use in application
export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session.session;

// Extend User type with custom fields from database
export type User = typeof auth.$Infer.Session.user & {
  role?: "customer" | "admin" | "vendor" | "support";
  status?: "active" | "inactive" | "suspended" | "pending_verification";
  firstName?: string;
  lastName?: string;
  phone?: string;
  phoneVerified?: boolean;
  avatar?: string;
  dateOfBirth?: Date | string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  lastLoginAt?: Date | string;
};

// Export email sender for manual use
export { emailSender };

// Helper function to check if email service is working
export const verifyEmailService = async (): Promise<boolean> => {
  try {
    return await emailSender.verify();
  } catch (error) {
    console.error("Email service verification failed:", error);
    return false;
  }
};
