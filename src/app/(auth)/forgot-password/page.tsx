"use client";

import React, { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth/actions";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await requestPasswordReset(formData);

      if (result.ok) {
        setSuccess(
          "If an account exists with this email, a password reset link has been sent. Please check your inbox."
        );
      } else {
        setError(result.error || "Failed to send reset link. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-heading-2 font-heading-2 text-site-blue mb-2">
          Forgot Password?
        </h1>
        <p className="text-body text-dark-700">
          Enter your email address and we&apos;ll send you a link to reset your password
        </p>
      </div>

      {/* Request Reset Form */}
      <form onSubmit={handleRequestReset} className="space-y-4">
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
            htmlFor="email"
            className="block mb-2 text-body-medium font-body-medium text-dark-900"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="johndoe@gmail.com"
            required
            disabled={loading || !!success}
            className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-site-blue focus:border-transparent text-body font-body text-dark-900 placeholder:text-dark-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !!success}
          className="w-full bg-site-blue text-light-100 py-3.5 rounded-full hover:bg-dark-blue transition-colors text-body-medium font-body-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

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
