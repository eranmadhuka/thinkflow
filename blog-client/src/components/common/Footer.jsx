import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <span className="text-sm text-gray-500">
          © 2025 SocialApp. All Rights Reserved.
        </span>
        <ul className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-500">
          <li>
            <Link to="/about" className="hover:text-emerald-700">
              About
            </Link>
          </li>
          <li>
            <Link to="/privacy" className="hover:text-emerald-700">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms" className="hover:text-emerald-700">
              Terms of Service
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
