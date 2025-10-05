"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  type: "signin" | "signup";
}

export default function AuthForm({ type }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isSignUp = type === "signup";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Auth logic will be implemented separately
    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isSignUp && (
        <div>
          <label
            htmlFor="fullName"
            className="block mb-2 text-body-medium font-body-medium text-dark-900"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            required
            className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-site-blue focus:border-transparent text-body font-body text-dark-900 placeholder:text-dark-500"
          />
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
          className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-site-blue focus:border-transparent text-body font-body text-dark-900 placeholder:text-dark-500"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-body-medium font-body-medium text-dark-900"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="minimum 8 characters"
            required
            minLength={8}
            className="w-full px-4 py-3 pr-12 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-site-blue focus:border-transparent text-body font-body text-dark-900 placeholder:text-dark-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-700 hover:text-dark-900 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-site-blue text-light-100 py-3.5 rounded-full hover:bg-dark-blue transition-colors text-body-medium font-body-medium"
      >
        {isSignUp ? "Sign Up" : "Sign In"}
      </button>
    </form>
  );
}
