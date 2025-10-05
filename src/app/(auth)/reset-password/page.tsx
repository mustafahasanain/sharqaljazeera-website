"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth/actions";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Invalid reset link. Please request a new password reset.");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!token) {
      setError("Invalid reset link");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("token", token);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword(formData);

      if (result.ok) {
        setSuccess("Password reset successful! Redirecting to sign in...");
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      } else {
        setError(result.error || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <div className="space-y-8">
        <div className="text-center sm:text-left">
          <h1 className="text-heading-2 font-heading-2 text-site-blue mb-2">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-heading-2 font-heading-2 text-site-blue mb-2">
          Reset Your Password
        </h1>
        <p className="text-body text-dark-700">
          Enter your new password below
        </p>
      </div>

      {/* Reset Password Form */}
      {token && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-body text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-body text-green-600">{success}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-body-medium font-body-medium text-dark-900"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="minimum 8 characters"
              required
              minLength={8}
              className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-site-blue focus:border-transparent text-body font-body text-dark-900 placeholder:text-dark-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-body-medium font-body-medium text-dark-900"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter your password"
              required
              minLength={8}
              className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-site-blue focus:border-transparent text-body font-body text-dark-900 placeholder:text-dark-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-site-blue text-light-100 py-3.5 rounded-full hover:bg-dark-blue transition-colors text-body-medium font-body-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      {/* Error state without token */}
      {!token && error && (
        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-body-medium font-body-medium text-site-blue underline hover:text-dark-blue transition-colors"
          >
            Request a new reset link
          </Link>
        </div>
      )}

      {/* Back to Sign In */}
      <div className="text-center">
        <Link
          href="/sign-in"
          className="text-body text-dark-700 hover:text-dark-900 hover:underline transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
