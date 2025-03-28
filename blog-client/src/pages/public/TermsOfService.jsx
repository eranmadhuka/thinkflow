import React from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 mb-8 text-center">
            Last Updated: March 28, 2025
          </p>

          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using our platform, you agree to be bound by
                these Terms of Service ("Terms"). If you do not agree, please do
                not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                2. User Responsibilities
              </h2>
              <p className="text-gray-700 leading-relaxed">You agree to:</p>
              <ul className="list-disc pl-5 mt-2 text-gray-700">
                <li>
                  Use the platform in compliance with all applicable laws.
                </li>
                <li>Not post harmful, illegal, or offensive content.</li>
                <li>
                  Be responsible for maintaining the security of your account.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                3. Account Usage
              </h2>
              <p className="text-gray-700 leading-relaxed">
                To use certain features, you must create an account. You are
                responsible for:
              </p>
              <ul className="list-disc pl-5 mt-2 text-gray-700">
                <li>Providing accurate information during registration.</li>
                <li>Not sharing your account credentials with others.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                4. Content Ownership
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You retain ownership of the content you post, but by submitting
                it, you grant us a non-exclusive, royalty-free license to use,
                display, and distribute it on our platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                5. Termination
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your account if you
                violate these Terms. You may also delete your account at any
                time.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                6. Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are provided "as is." We are not liable for any
                indirect, incidental, or consequential damages arising from your
                use of the platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                7. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms, please contact us at{" "}
                <a
                  href="mailto:hweranmadhuka@gmail.com"
                  className="text-indigo-600 hover:underline"
                >
                  hweranmadhuka@gmail.com
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

export default TermsOfService;
