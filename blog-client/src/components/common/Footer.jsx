import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-800 py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">ThinkFlow</h3>
            <p className="text-gray-600">
              Making the world a better place through innovative solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Email: contact@company.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>
                Address: 123 Business St,
                <br />
                City, State 12345
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
