import Link from "next/link";
import { AuthForm, SocialProviders } from "@/components";

export default function SignInPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-heading-2 font-heading-2 text-site-blue mb-2">
          Welcome Back!
        </h1>
        <p className="text-body text-dark-700">
          Sign in to your account to continue
        </p>
      </div>

      {/* Social Providers */}
      <SocialProviders />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-light-400"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-light-100 px-4 text-caption font-caption text-site-blue">
            Or sign in with
          </span>
        </div>
      </div>

      {/* Auth Form */}
      <AuthForm type="signin" />

      {/* Forgot Password */}
      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-body text-dark-700 hover:text-dark-900 hover:underline transition-colors"
        >
          Forgot your password?
        </Link>
      </div>

      <div className="mb-2 text-center">
        <span className="text-body text-dark-700">
          or you don&apos;t have an account?{" "}
        </span>
        <Link
          href="/sign-up"
          className="text-body-medium font-body-medium text-site-blue underline hover:text-dark-blue transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
