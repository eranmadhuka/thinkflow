import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMenu, IoMdClose, IoMdNotificationsOutline } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../../assets/images/logo.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <header
      className={`${
        isScrolled
          ? "fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200"
          : "absolute inset-x-0 top-0 z-50 bg-transparent"
      } transition-all duration-300 ease-in-out`}
    >
      <nav className="flex items-center justify-between p-4 mx-auto max-w-7xl lg:px-8 font-abril">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <img className="h-8 w-auto" src={Logo} alt="Logo" />
          </Link>
        </div>

        {user ? (
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-1.5 border rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <FaSearch className="absolute right-3 top-2 text-gray-500 cursor-pointer" />
            </div>

            <IoMdNotificationsOutline className="text-2xl text-gray-700 cursor-pointer hover:text-emerald-600" />

            <div className="relative">
              <button
                className="flex items-center space-x-2"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={user.picture || "https://via.placeholder.com/40"}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-sm font-semibold text-gray-700">
                  {user.name}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg">
                  <Link
                    to={`/profile/${user.id}`} // Use the logged-in user's ID
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/stats"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Stats
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex lg:gap-x-4 lg:items-center ms-5">
            <Link
              to="/login"
              className="text-sm font-semibold px-4 py-2 rounded-full bg-emerald-700 text-white hover:bg-emerald-800"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold px-4 py-2 rounded-full border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white"
            >
              Get started
            </Link>
          </div>
        )}

        <button
          type="button"
          className="lg:hidden p-2.5 text-gray-700 hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(true)}
        >
          <IoIosMenu className="h-6 w-6" />
        </button>
      </nav>
    </header>
  );
};

export default Header;
