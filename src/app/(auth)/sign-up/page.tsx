import Link from "next/link";
import { AuthForm, SocialProviders } from "@/components";
import { signUp } from "@/lib/auth/actions";

export default function SignUpPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-heading-2 font-heading-2 text-site-blue mb-2">
          Join Us Today!
        </h1>
        <p className="text-body text-dark-700">
          Create your account to start your journey
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
            Or sign up with
          </span>
        </div>
      </div>

      {/* Auth Form */}
      <AuthForm mode="signup" onSubmit={signUp} />

      {/* Terms and Privacy */}
      <p className="text-footnote font-footnote text-dark-700 text-center">
        By signing up, you agree to our{" "}
        <Link
          href="/terms"
          className="underline hover:text-dark-blue transition-colors"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline hover:text-dark-blue transition-colors"
        >
          Privacy Policy
        </Link>
      </p>
      <div className="text-center">
        <span className="text-body text-dark-700">
          Already have an account?{" "}
        </span>
        <Link
          href="/sign-in"
          className="text-body-medium font-body-medium text-site-blue underline hover:text-dark-blue transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
