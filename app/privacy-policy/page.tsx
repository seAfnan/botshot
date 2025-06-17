"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { ThemeContext } from "../Providers/ThemeContext";

export default function PrivacyPolicy() {
  const { switchDark, switchLight, theme } = useContext(ThemeContext) ?? {};
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950"
          : "bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className={`font-medium text-sm sm:text-base transition-colors duration-200 ${
                theme === "dark"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              ← Back
            </Link>

            {/* Theme Toggle Buttons */}
            {/* <div className="flex items-center space-x-2">
              <button
                onClick={switchLight}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  theme === "light"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                title="Light Mode"
              >
                ☀️
              </button>
              <button
                onClick={switchDark}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-gray-700 text-blue-400"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
                title="Dark Mode"
              >
                🌙
              </button>
            </div> */}
          </div>

          <div className="text-center">
            <h1
              className={`text-3xl sm:text-4xl font-bold mb-2 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Privacy Policy
            </h1>
            <p
              className={`text-sm transition-colors duration-300 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Last updated: {date}
            </p>
          </div>
        </div>

        {/* Content */}
        <div
          className={`rounded-xl shadow-xl p-8 space-y-8 transition-all duration-300 ${
            theme === "dark"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              1. Introduction
            </h2>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Welcome to Botshot, a chatbot service provided by Hashtag Tech
              ("we," "our," or "us"). This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our AI-powered chatbot platform that integrates with various
              Large Language Models (LLMs).
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              2. Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3
                  className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  2.1 Information You Provide
                </h3>
                <ul
                  className={`list-disc list-inside space-y-1 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <li>
                    Account information (name, email address) when you sign in
                    with Google
                  </li>
                  <li>
                    Chat messages and conversations you have with our AI
                    chatbots
                  </li>
                  <li>Files you upload for processing (if applicable)</li>
                  <li>Preferences and settings you configure</li>
                </ul>
              </div>

              <div>
                <h3
                  className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  2.2 Automatically Collected Information
                </h3>
                <ul
                  className={`list-disc list-inside space-y-1 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <li>Usage data and analytics</li>
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Session data and timestamps</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              3. How We Use Your Information
            </h2>
            <ul
              className={`list-disc list-inside space-y-2 transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <li>To provide and maintain our chatbot services</li>
              <li>To process your requests and generate AI responses</li>
              <li>To improve our services and user experience</li>
              <li>To communicate with you about service updates</li>
              <li>To ensure security and prevent abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              4. Third-Party Services
            </h2>
            <p
              className={`leading-relaxed mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Botshot integrates with various third-party LLM providers
              including but not limited to:
            </p>
            <ul
              className={`list-disc list-inside space-y-1 transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <li>OpenAI (GPT models)</li>
              <li>Anthropic (Claude models)</li>
              <li>Groq</li>
              <li>Hugging Face</li>
              <li>Local/Ollama models</li>
            </ul>
            <p
              className={`leading-relaxed mt-4 transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              When you use these services, your messages may be processed by
              these third-party providers according to their respective privacy
              policies.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              5. Data Storage and Security
            </h2>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              We store your data using MongoDB and implement appropriate
              security measures to protect your information. Your chat history
              is encrypted and stored securely. We retain your data only as long
              as necessary to provide our services or as required by law.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              6. Your Rights
            </h2>
            <ul
              className={`list-disc list-inside space-y-2 transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your chat history</li>
              <li>Opt-out of certain data processing</li>
            </ul>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              7. Cookies and Tracking
            </h2>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              We use essential cookies for authentication and session
              management. We do not use tracking cookies for advertising
              purposes.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              8. Children's Privacy
            </h2>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Our service is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              9. Changes to This Policy
            </h2>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              10. Contact Us
            </h2>
            <p
              className={`leading-relaxed mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <div
              className={`p-6 rounded-lg mt-4 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-700 border border-gray-600"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <p
                className={`font-medium mb-2 transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Hashtag Tech
              </p>
              <p
                className={`mb-1 transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Email: hafnan03@gmail.com
              </p>
              <p
                className={`transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Website:{" "}
                <a
                  className={`transition-colors duration-200 hover:underline ${
                    theme === "dark"
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://afnan.elements.red"
                >
                  https://afnan.elements.red
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
