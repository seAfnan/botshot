"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

interface LoginModalProps {
  theme?: string;
  setShowLoginModal: (show: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  theme,
  setShowLoginModal,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in error:", error);
      // Reset loading state if there's an error
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className={`relative rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 backdrop-blur-xs ${
          theme === "dark"
            ? "bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-200"
            : "bg-white/95 border border-gray-200/50"
        }`}
      >
        {/* Decorative elements */}
        <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-r from-neutral-500 to-neutral-600 rounded-2xl blur-xs opacity-20"></div>

        <div className="relative z-10">
          {/* Logo/Icon placeholder */}
          <div className="flex justify-center mb-6">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                theme === "dark"
                  ? "bg-gradient-to-r from-neutral-500 to-neutral-600"
                  : "bg-gradient-to-r from-neutral-600 to-neutral-700"
              }`}
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h2
              className={`text-2xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {isLoading ? "Signing you in..." : "Welcome Back"}
            </h2>
            <p
              className={`mb-8 text-sm leading-relaxed ${
                theme === "dark" ? "text-neutral-300" : "text-gray-600"
              }`}
            >
              {isLoading
                ? "Please wait while we redirect you to Google..."
                : "Sign in to access Botshot and continue your conversations."}
            </p>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mb-4 shadow-lg ${
                isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : theme === "dark"
                  ? "bg-white text-gray-900 hover:bg-gray-100 border border-gray-200"
                  : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-300 shadow-md"
              }`}
            >
              {isLoading ? (
                <>
                  {/* Loading spinner */}
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  Connecting to Google...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Progress indicator when loading */}
            {isLoading && (
              <div className="mb-4">
                <div
                  className={`w-full bg-gray-200 rounded-full h-1 ${
                    theme === "dark" ? "bg-neutral-700" : "bg-gray-200"
                  }`}
                >
                  <div
                    className="bg-blue-500 h-1 rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  ></div>
                </div>
                <p
                  className={`text-xs mt-2 ${
                    theme === "dark" ? "text-neutral-400" : "text-gray-500"
                  }`}
                >
                  Opening Google sign-in...
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="relative mb-4">
              <div
                className={`absolute inset-0 flex items-center ${
                  theme === "dark" ? "text-neutral-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-full border-t ${
                    theme === "dark" ? "border-neutral-700" : "border-gray-200"
                  }`}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={`px-3 ${
                    theme === "dark"
                      ? "bg-neutral-800/95 text-neutral-400"
                      : "bg-white/95 text-gray-500"
                  }`}
                >
                  {/* or */}
                </span>
              </div>
            </div>

            {/* Trust indicators */}
            <div
              className={`mt-6 pt-4 border-t ${
                theme === "dark" ? "border-neutral-700" : "border-gray-200"
              } ${isLoading ? "opacity-50" : ""}`}
            >
              <p
                className={`text-xs mb-3 ${
                  theme === "dark" ? "text-neutral-400" : "text-gray-500"
                }`}
              >
                🔒 Your data is secure
              </p>

              {/* Privacy Policy and Terms Links */}
              <div className="flex justify-center space-x-4 text-xs">
                <a
                  href="/privacy-policy"
                  className={`hover:underline transition-colors ${
                    isLoading ? "pointer-events-none" : ""
                  } ${
                    theme === "dark"
                      ? "text-neutral-400 hover:text-neutral-300"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Privacy Policy
                </a>
                <span
                  className={
                    theme === "dark" ? "text-neutral-600" : "text-gray-400"
                  }
                >
                  •
                </span>
                <a
                  href="/terms-of-service"
                  className={`hover:underline transition-colors ${
                    isLoading ? "pointer-events-none" : ""
                  } ${
                    theme === "dark"
                      ? "text-neutral-400 hover:text-neutral-300"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
