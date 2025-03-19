import React, { useState } from "react";
import {
  FiSearch,
  FiBell,
  FiEdit,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi"; // Icons
import { FaUser, FaBook, FaChartLine, FaGift } from "react-icons/fa"; // Additional icons
import Logo from "../../assets/images/logo.png"; // Replace with your logo
import UserAvatar from "../../assets/images/avatar.png"; // Replace with your user avatar

const LoggedInHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-gray-800">
          <img src={Logo} alt="logo" className="h-8 w-auto" />
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-8 max-w-md relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 font-jost"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Right Side: Write Button, Notification, User Avatar */}
        <div className="flex items-center space-x-6">
          {/* Write Button */}
          <button className="flex items-center space-x-2 bg-emerald-700 text-white font-jost px-4 py-2 rounded-md hover:bg-emerald-800 transition-colors duration-200">
            <FiEdit className="w-5 h-5" />
            <span>Write</span>
          </button>

          {/* Notification Icon */}
          <button className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
            <FiBell className="w-6 h-6" />
          </button>

          {/* User Avatar with Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="relative focus:outline-none"
            >
              <img
                src={UserAvatar}
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="absolute inset-0 rounded-full shadow-inner"></div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
                {/* Profile Section */}
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">hw********@gmail.com</p>
                </div>

                {/* Main Links */}
                <div className="p-2">
                  <a
                    href="#"
                    className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <FaUser className="w-5 h-5" />
                    <span>Profile</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <FaBook className="w-5 h-5" />
                    <span>Library</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <FaChartLine className="w-5 h-5" />
                    <span>Stats</span>
                  </a>
                </div>

                {/* Settings Section */}
                <div className="p-2 border-t border-gray-200">
                  <a
                    href="#"
                    className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <FiSettings className="w-5 h-5" />
                    <span>Settings</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <FiHelpCircle className="w-5 h-5" />
                    <span>Help</span>
                  </a>
                </div>

                {/* Membership Section */}
                <div className="p-2 border-t border-gray-200">
                  <a
                    href="#"
                    className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <FaGift className="w-5 h-5" />
                    <span>Become a Member</span>
                  </a>
                </div>

                {/* Sign Out */}
                <div className="p-2 border-t border-gray-200">
                  <button className="flex items-center space-x-3 p-2 w-full text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
                    <FiLogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LoggedInHeader;
