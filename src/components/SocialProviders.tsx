"use client";

import { Chrome, Apple } from "lucide-react";

export default function SocialProviders() {
  return (
    <div className="space-y-3">
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-light-400 rounded-full hover:bg-light-200 transition-colors text-body font-body text-dark-900"
        aria-label="Continue with Google"
      >
        <Chrome className="w-5 h-5" />
        <span>Continue with Google</span>
      </button>

      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-light-400 rounded-full hover:bg-light-200 transition-colors text-body font-body text-dark-900"
        aria-label="Continue with Apple"
      >
        <Apple className="w-5 h-5" />
        <span>Continue with Apple</span>
      </button>
    </div>
  );
}
