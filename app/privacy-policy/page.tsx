import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-900 dark:to-gray-95 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm sm:text-base"
          >
            ← Back
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-right mb-5">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Welcome to Botshot, a chatbot service provided by Hashtag Tech
              ("we," "our," or "us"). This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our AI-powered chatbot platform that integrates with various
              Large Language Models (LLMs).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  2.1 Information You Provide
                </h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
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
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  2.2 Automatically Collected Information
                </h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Usage data and analytics</li>
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Session data and timestamps</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>To provide and maintain our chatbot services</li>
              <li>To process your requests and generate AI responses</li>
              <li>To improve our services and user experience</li>
              <li>To communicate with you about service updates</li>
              <li>To ensure security and prevent abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Third-Party Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Botshot integrates with various third-party LLM providers
              including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>OpenAI (GPT models)</li>
              <li>Anthropic (Claude models)</li>
              <li>Groq</li>
              <li>Hugging Face</li>
              <li>Local/Ollama models</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              When you use these services, your messages may be processed by
              these third-party providers according to their respective privacy
              policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Data Storage and Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We store your data using MongoDB and implement appropriate
              security measures to protect your information. Your chat history
              is encrypted and stored securely. We retain your data only as long
              as necessary to provide our services or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Your Rights
            </h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your chat history</li>
              <li>Opt-out of certain data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Cookies and Tracking
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We use essential cookies for authentication and session
              management. We do not use tracking cookies for advertising
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our service is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg mt-4">
              <p className="text-gray-700 dark:text-gray-200 font-medium">
                Hashtag Tech
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Email: hafnan03@gmail.com
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Website:{" "}
                <a
                  className="text-blue-600 dark:text-blue-400"
                  target="_blank"
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
