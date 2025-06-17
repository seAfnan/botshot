import React from "react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
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
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By accessing and using Botshot, a service provided by Hashtag Tech
              ("Company," "we," "our," or "us"), you agree to be bound by these
              Terms of Service ("Terms"). If you do not agree to these Terms,
              please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Botshot is an AI-powered chatbot platform that allows users to
              interact with various Large Language Models (LLMs) including but
              not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>OpenAI GPT models</li>
              <li>Anthropic Claude models</li>
              <li>Groq models</li>
              <li>Hugging Face models</li>
              <li>Local/Ollama models</li>
            </ul>
            <p className="text-gray-900 dark:text-white leading-relaxed mt-4">
              Users can switch between different LLMs using dropdown selections
              and engage in conversational AI interactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. User Accounts
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  3.1 Account Creation
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  You may create an account using Google OAuth. You are
                  responsible for maintaining the confidentiality of your
                  account and for all activities that occur under your account.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  3.2 Account Responsibility
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  You must provide accurate information and promptly update any
                  changes. You must not share your account credentials with
                  others.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Acceptable Use
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  4.1 Permitted Use
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  You may use Botshot for lawful purposes and in accordance with
                  these Terms.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  4.2 Prohibited Activities
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
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
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-300 mb-4">
              5. Third-Party Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our service integrates with third-party LLM providers. Your use of
              these services is also subject to their respective terms of
              service and privacy policies. We are not responsible for the
              content generated by third-party AI models.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-300 mb-4">
              6. Intellectual Property
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  6.1 Our Content
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The Botshot platform, including its design, functionality, and
                  code, is owned by Hashtag Tech and protected by intellectual
                  property laws.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  6.2 Your Content
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  You retain ownership of the content you input into our
                  service. However, you grant us a license to process and store
                  this content to provide our services.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-300 mb-4">
              7. Privacy and Data
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy
              to understand how we collect, use, and protect your information.
              Your chat data is stored securely using MongoDB and encrypted for
              your protection.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-300 mb-4">
              8. Service Availability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We strive to maintain high service availability but cannot
              guarantee uninterrupted access. We may perform maintenance,
              updates, or modifications that temporarily affect service
              availability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-300 mb-4">
              9. Disclaimer of Warranties
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Botshot is provided "as is" without warranties of any kind. We do
              not guarantee the accuracy, completeness, or reliability of
              AI-generated content. Users should verify important information
              independently.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-300 mb-4">
              10. Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              To the maximum extent permitted by law, Hashtag Tech shall not be
              liable for any indirect, incidental, special, or consequential
              damages arising from your use of Botshot.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-300 mb-4">
              11. Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may terminate or suspend your account at any time for
              violations of these Terms. You may also terminate your account at
              any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-300 mb-4">
              12. Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will
              notify users of significant changes by updating the "Last updated"
              date and posting a notice on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-300 mb-4">
              13. Governing Law
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction where Hashtag Tech is incorporated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-300 mb-4">
              14. Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg mt-4">
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Hashtag Tech
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Email: hafnan03@gmail.com
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Website:{" "}
                <a
                  className="text-blue-600"
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
