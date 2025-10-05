"use server";

import {cookies, headers} from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { guest, passwordReset, user } from "@/lib/db/schema/index";
import { and, eq, lt, gt } from "drizzle-orm";
import { randomUUID } from "crypto";
import { hash } from "@node-rs/argon2";

const COOKIE_OPTIONS = {
  httpOnly: true as const,
  secure: true as const,
  sameSite: "strict" as const,
  path: "/" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8).max(128);
const nameSchema = z.string().min(1).max(100);

export async function createGuestSession() {
  const cookieStore = await cookies();
  const existing = (await cookieStore).get("guest_session");
  if (existing?.value) {
    return { ok: true, sessionToken: existing.value };
  }

  const sessionToken = randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + COOKIE_OPTIONS.maxAge * 1000);

  await db.insert(guest).values({
    sessionToken,
    expiresAt,
  });

  (await cookieStore).set("guest_session", sessionToken, COOKIE_OPTIONS);
  return { ok: true, sessionToken };
}

export async function guestSession() {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("guest_session")?.value;
  if (!token) {
    return { sessionToken: null };
  }
  const now = new Date();
  await db
    .delete(guest)
    .where(and(eq(guest.sessionToken, token), lt(guest.expiresAt, now)));

  return { sessionToken: token };
}

const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export async function signUp(formData: FormData) {
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const data = signUpSchema.parse(rawData);

  const res = await auth.api.signUpEmail({
    body: {
      email: data.email,
      password: data.password,
      name: data.name,
    },
  });

  await migrateGuestToUser();
  return { ok: true, userId: res.user?.id };
}

const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export async function signIn(formData: FormData) {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const data = signInSchema.parse(rawData);

  try {
    const res = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    await migrateGuestToUser();
    return { ok: true, userId: res.user?.id };
  } catch (error: any) {
    return { ok: false, error: error.message || "Invalid email or password" };
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    return session?.user ?? null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function signOut() {
  await auth.api.signOut({ headers: {} });
  return { ok: true };
}

export async function mergeGuestCartWithUserCart() {
  await migrateGuestToUser();
  return { ok: true };
}

async function migrateGuestToUser() {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("guest_session")?.value;
  if (!token) return;

  await db.delete(guest).where(eq(guest.sessionToken, token));
  (await cookieStore).delete("guest_session");
}

// Generate a random token for password reset
function generateResetToken(): string {
  return randomUUID() + randomUUID().replace(/-/g, '');
}

const requestPasswordResetSchema = z.object({
  email: emailSchema,
});

export async function requestPasswordReset(formData: FormData) {
  const rawData = {
    email: formData.get('email') as string,
  };

  try {
    const data = requestPasswordResetSchema.parse(rawData);

    // Find user by email
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, data.email))
      .limit(1);

    // For security, don't reveal if user exists or not
    if (!existingUser) {
      return { ok: true };
    }

    // Generate reset token
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing reset tokens for this user
    await db.delete(passwordReset).where(eq(passwordReset.userId, existingUser.id));

    // Create new reset token
    await db.insert(passwordReset).values({
      userId: existingUser.id,
      token,
      expiresAt,
    });

    // Generate reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    // TODO: Send email with reset link
    // For now, we'll log it (in production, you should send an email)
    console.log(`Password reset link for ${data.email}:`);
    console.log(resetLink);

    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message || "Failed to process password reset request" };
  }
}

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export async function resetPassword(formData: FormData) {
  const rawData = {
    token: formData.get('token') as string,
    password: formData.get('password') as string,
  };

  try {
    const data = resetPasswordSchema.parse(rawData);

    // Find valid reset token
    const [resetRecord] = await db
      .select()
      .from(passwordReset)
      .where(
        and(
          eq(passwordReset.token, data.token),
          gt(passwordReset.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!resetRecord) {
      return { ok: false, error: "Invalid or expired reset link" };
    }

    // Hash the new password
    const hashedPassword = await hash(data.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // Update password using better-auth's internal mechanism
    await db.execute({
      sql: `UPDATE account SET password = $1 WHERE user_id = $2 AND provider_id = 'credential'`,
      args: [hashedPassword, resetRecord.userId],
    });

    // Delete the reset token
    await db.delete(passwordReset).where(eq(passwordReset.id, resetRecord.id));

    return { ok: true };
  } catch (error: any) {
    console.error("Password reset error:", error);
    return { ok: false, error: error.message || "Failed to reset password" };
  }
}
