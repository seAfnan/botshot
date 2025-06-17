"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { ThemeContext } from "../Providers/ThemeContext";

export default function TermsOfService() {
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
              Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              By accessing and using Botshot, a service provided by Hashtag Tech
              ("Company," "we," "our," or "us"), you agree to be bound by these
              Terms of Service ("Terms"). If you do not agree to these Terms,
              please do not use our service.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              2. Description of Service
            </h2>
            <p
              className={`leading-relaxed mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Botshot is an AI-powered chatbot platform that allows users to
              interact with various Large Language Models (LLMs) including but
              not limited to:
            </p>
            <ul
              className={`list-disc list-inside space-y-1 transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <li>OpenAI GPT models</li>
              <li>Anthropic Claude models</li>
              <li>Groq models</li>
              <li>Hugging Face models</li>
              <li>Local/Ollama models</li>
            </ul>
            <p
              className={`leading-relaxed mt-4 transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Users can switch between different LLMs using dropdown selections
              and engage in conversational AI interactions.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              3. User Accounts
            </h2>
            <div className="space-y-4">
              <div>
                <h3
                  className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  3.1 Account Creation
                </h3>
                <p
                  className={`leading-relaxed transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  You may create an account using Google OAuth. You are
                  responsible for maintaining the confidentiality of your
                  account and for all activities that occur under your account.
                </p>
              </div>

              <div>
                <h3
                  className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  3.2 Account Responsibility
                </h3>
                <p
                  className={`leading-relaxed transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  You must provide accurate information and promptly update any
                  changes. You must not share your account credentials with
                  others.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              4. Acceptable Use
            </h2>
            <div className="space-y-4">
              <div>
                <h3
                  className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  4.1 Permitted Use
                </h3>
                <p
                  className={`leading-relaxed transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  You may use Botshot for lawful purposes and in accordance with
                  these Terms.
                </p>
              </div>

              <div>
                <h3
                  className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  4.2 Prohibited Activities
                </h3>
                <p
                  className={`leading-relaxed mb-2 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  You agree not to:
                </p>
                <ul
                  className={`list-disc list-inside space-y-1 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <li>
                    Use the service for any illegal or unauthorized purpose
                  </li>
                  <li>Generate harmful, abusive, or offensive content</li>
                  <li>Attempt to reverse engineer or hack the service</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Spam or abuse the service</li>
                  <li>
                    Generate content that violates third-party LLM provider
                    policies
                  </li>
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
              5. Third-Party Services
            </h2>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Our service integrates with third-party LLM providers. Your use of
              these services is also subject to their respective terms of
              service and privacy policies. We are not responsible for the
              content generated by third-party AI models.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              6. Intellectual Property
            </h2>
            <div className="space-y-4">
              <div>
                <h3
                  className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  6.1 Our Content
                </h3>
                <p
                  className={`leading-relaxed transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  The Botshot platform, including its design, functionality, and
                  code, is owned by Hashtag Tech and protected by intellectual
                  property laws.
                </p>
              </div>

              <div>
                <h3
                  className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  6.2 Your Content
                </h3>
                <p
                  className={`leading-relaxed transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  You retain ownership of the content you input into our
                  service. However, you grant us a license to process and store
                  this content to provide our services.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              7. Privacy and Data
            </h2>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Your privacy is important to us. Please review our Privacy Policy
              to understand how we collect, use, and protect your information.
              Your chat data is stored securely using MongoDB and encrypted for
              your protection.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              8. Service Availability
            </h2>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              We strive to maintain high service availability but cannot
              guarantee uninterrupted access. We may perform maintenance,
              updates, or modifications that temporarily affect service
              availability.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              9. Disclaimer of Warranties
            </h2>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Botshot is provided "as is" without warranties of any kind. We do
              not guarantee the accuracy, completeness, or reliability of
              AI-generated content. Users should verify important information
              independently.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              10. Limitation of Liability
            </h2>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              To the maximum extent permitted by law, Hashtag Tech shall not be
              liable for any indirect, incidental, special, or consequential
              damages arising from your use of Botshot.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              11. Termination
            </h2>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              We may terminate or suspend your account at any time for
              violations of these Terms. You may also terminate your account at
              any time by contacting us.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              12. Changes to Terms
            </h2>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              We reserve the right to modify these Terms at any time. We will
              notify users of significant changes by updating the "Last updated"
              date and posting a notice on our platform.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              13. Governing Law
            </h2>
            <p
              className={`leading-relaxed transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction where Hashtag Tech is incorporated.
            </p>
          </section>

          <section>
            <h2
              className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              14. Contact Information
            </h2>
            <p
              className={`leading-relaxed mb-4 transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              If you have any questions about these Terms of Service, please
              contact us:
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
