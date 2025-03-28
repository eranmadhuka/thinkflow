import React from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8 text-center">
            Last Updated: March 28, 2025
          </p>

          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to our platform! We value your privacy and are committed
                to protecting your personal information. This Privacy Policy
                explains how we collect, use, and safeguard your data when you
                use our services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                2. Information We Collect
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may collect the following types of information:
              </p>
              <ul className="list-disc pl-5 mt-2 text-gray-700">
                <li>
                  <strong>Personal Information:</strong> Name, email address,
                  and profile picture when you sign up or update your profile.
                </li>
                <li>
                  <strong>Content Data:</strong> Posts, comments, and media you
                  upload to our platform.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you
                  interact with our services, such as IP address and browser
                  type.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We use your data to:
              </p>
              <ul className="list-disc pl-5 mt-2 text-gray-700">
                <li>Provide and improve our services.</li>
                <li>Personalize your experience.</li>
                <li>Communicate with you about updates or issues.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                4. Data Sharing and Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We do not sell your personal information. We may share it with:
              </p>
              <ul className="list-disc pl-5 mt-2 text-gray-700">
                <li>Service providers who assist us (e.g., hosting).</li>
                <li>Legal authorities if required by law.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                We implement reasonable security measures to protect your data,
                but no system is completely secure.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                5. Your Choices
              </h2>
              <p className="text-gray-700 leading-relaxed">You can:</p>
              <ul className="list-disc pl-5 mt-2 text-gray-700">
                <li>Update or delete your account at any time.</li>
                <li>Contact us to access or correct your information.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                6. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about this Privacy Policy, please reach
                out to us at{" "}
                <a
                  href="mailto:support@example.com"
                  className="text-indigo-600 hover:underline"
                >
                  support@example.com
                </a>
                .
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
