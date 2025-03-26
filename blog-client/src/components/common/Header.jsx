// src/components/Header.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosMenu, IoMdNotificationsOutline } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../../assets/images/logo.png";
import { useNotifications } from "../../context/NotificationContext";

const Header = ({ onMenuToggle }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { id } = useParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setDropdownOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow duration-300 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="mr-2 rounded-md p-1 text-gray-700 hover:bg-gray-100 md:hidden"
              onClick={onMenuToggle}
            >
              <IoIosMenu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex-shrink-0">
              <img className="h-8 w-auto" src={Logo} alt="Logo" />
            </Link>
          </div>

          {user && (
            <div className="hidden md:block mx-4 flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <FaSearch className="absolute right-3 top-2.5 text-gray-500" />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="relative">
                  <button
                    className="p-2 text-gray-700 hover:text-emerald-600 relative"
                    onClick={toggleNotificationDropdown}
                  >
                    <IoMdNotificationsOutline className="h-6 w-6" />
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
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
                      <div className="absolute right-0 z-20 mt-2 w-64 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                        <div className="flex justify-between px-4 py-2">
                          <h3 className="text-sm font-medium text-gray-700">
                            Notifications
                          </h3>
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-emerald-600 hover:underline"
                          >
                            Mark all as read
                          </button>
                        </div>
                        {notifications.length > 0 ? (
                          <ul className="max-h-60 overflow-y-auto">
                            {notifications.map((notif, index) => (
                              <li
                                key={index}
                                className={`px-4 py-2 text-sm flex justify-between items-center ${
                                  notif.read
                                    ? "text-gray-500"
                                    : "text-gray-700 bg-gray-50"
                                } hover:bg-gray-100`}
                              >
                                {notif.message}
                                {!notif.read && (
                                  <button
                                    onClick={() => markAsRead(index)}
                                    className="text-xs text-emerald-600 hover:underline"
                                  >
                                    Mark as read
                                  </button>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="px-4 py-2 text-sm text-gray-500">
                            No new notifications
                          </p>
                        )}
                        <Link
                          to="/notifications"
                          className="block px-4 py-2 text-sm text-emerald-600 hover:bg-gray-100"
                          onClick={() => setNotificationDropdownOpen(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                <div className="relative">
                  <button
                    className="flex items-center space-x-2"
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                      setNotificationDropdownOpen(false);
                    }}
                  >
                    <img
                      src={user.picture || "https://via.placeholder.com/40"}
                      alt="User Avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="hidden md:inline text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  </button>
                  {dropdownOpen && (
                    // User dropdown remains unchanged
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Link
                          to={`/profile/${user.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/stats"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Stats
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
