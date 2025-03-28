import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { IoIosMenu, IoMdNotificationsOutline } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../../assets/images/logo.png";
import { useNotifications } from "../../context/NotificationContext";
import UserImg from "../../assets/images/user.png";

const Header = ({ onMenuToggle }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <button
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                onClick={onMenuToggle}
              >
                <IoIosMenu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}
            <Link to="/" className="flex-shrink-0">
              <img className="h-7 sm:h-8 w-auto" src={Logo} alt="Logo" />
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative"
                    onClick={() =>
                      setNotificationDropdownOpen(!notificationDropdownOpen)
                    }
                  >
                    <IoMdNotificationsOutline className="h-5 w-5 sm:h-6 sm:w-6" />
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center">
                        {notifications.filter((n) => !n.read).length}
                      </span>
                    )}
                  </button>
                  {notificationDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setNotificationDropdownOpen(false)}
                      />
                      <div className="absolute right-0 z-20 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 transform transition-all duration-200 ease-in-out origin-top-right scale-95 opacity-0 animate-dropdown">
                        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-800">
                            Notifications
                          </h3>
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                          >
                            Mark all as read
                          </button>
                        </div>
                        {notifications.length > 0 ? (
                          <ul className="max-h-64 overflow-y-auto">
                            {notifications.map((notif, index) => (
                              <li
                                key={index}
                                className={`px-4 py-3 text-sm flex justify-between items-center ${
                                  notif.read
                                    ? "text-gray-500"
                                    : "text-gray-700 bg-indigo-50/50"
                                } hover:bg-gray-50 transition-colors duration-150`}
                              >
                                <span className="line-clamp-2">
                                  {notif.message}
                                </span>
                                {!notif.read && (
                                  <button
                                    onClick={() => markAsRead(index)}
                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                                  >
                                    Mark as read
                                  </button>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="px-4 py-3 text-sm text-gray-500">
                            No new notifications
                          </p>
                        )}
                        <Link
                          to="/notifications"
                          className="block px-4 py-2 text-sm text-indigo-600 font-medium hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setNotificationDropdownOpen(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {/* User Profile */}
                <div className="relative">
                  <button
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <img
                      src={user.picture ? user.picture : UserImg}
                      alt="User Avatar"
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border border-gray-200"
                    />
                    <span className="hidden md:inline text-sm font-medium text-gray-700 truncate max-w-[100px]">
                      {user.name}
                    </span>
                  </button>
                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 z-20 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 transform transition-all duration-200 ease-in-out origin-top-right scale-95 opacity-0 animate-dropdown">
                        <Link
                          to={`/profile/${user.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/update-profile"
                          className="block px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-red-600 transition-colors duration-200"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors duration-200"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tailwind Animation for Dropdowns */}
      <style jsx global>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-in-out forwards;
        }
      `}</style>
    </header>
  );
};

export default Header;
