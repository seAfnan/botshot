"use client";
import React from "react";

interface LoginModalProps {
  theme?: string;
  setShowLoginModal: (show: boolean) => void;
  handleGoogleLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  theme,
  setShowLoginModal,
  handleGoogleLogin,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg p-6 w-full max-w-md ${
          theme === "dark" ? "bg-neutral-800" : "bg-white"
        }`}
      >
        <div className="text-center">
          <h2
            className={`text-xl font-semibold mb-4 ${
              theme === "dark" ? "text-neutral-100" : "text-neutral-900"
            }`}
          >
            Sign in to continue
          </h2>
          <p
            className={`mb-6 ${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            You need to sign in to start chatting with your AI assistant.
          </p>
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mb-3"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => setShowLoginModal(false)}
            className={`w-full py-2 ${
              theme === "dark"
                ? "text-neutral-400 hover:text-neutral-200"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
