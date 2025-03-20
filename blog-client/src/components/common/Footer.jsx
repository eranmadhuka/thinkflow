import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white py-6 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <span className="text-sm text-gray-500">
          © 2025 SocialApp. All Rights Reserved.
        </span>
        <ul className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-500">
          <li>
            <a href="#" className="hover:text-emerald-700">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-emerald-700">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-emerald-700">
              Terms of Service
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
