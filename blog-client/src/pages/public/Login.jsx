import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const Login = () => {
  const { user, loading, login, fetchUser } = useAuth(); // Add fetchUser
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Login.jsx
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const authSuccess = queryParams.get("auth_success") === "true";

    if (authSuccess) {
      console.log("Auth success detected, redirecting without fetch...");
      const redirectPath =
        sessionStorage.getItem("redirectAfterLogin") || "/feed";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath, { replace: true });
    } else if (!loading && user) {
      console.log("User authenticated, redirecting...");
      const redirectPath =
        sessionStorage.getItem("redirectAfterLogin") || "/feed";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath, { replace: true });
    }
  }, [user, loading, fetchUser, navigate, location.search]);

  const handleOAuthLogin = (provider) => {
    setIsLoading(true);
    login(provider);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">
            Authenticating, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h1 className="font-abril text-3xl text-center text-gray-900 mb-6">
            Time to Enter the Digital Realm!
          </h1>
          <div className="space-y-4">
            <button
              className="w-full flex items-center justify-center space-x-3 rounded-md py-2 px-4 transition-colors duration-200 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => handleOAuthLogin("google")}
            >
              <FcGoogle className="w-6 h-6 me-2" />
              Sign in with Google
            </button>
            <button
              className="w-full flex items-center justify-center space-x-3 rounded-md py-2 px-4 bg-blue-600 text-white opacity-60 cursor-not-allowed"
              disabled
            >
              <FaFacebook className="w-6 h-6 me-2" />
              Sign in with Facebook
            </button>
          </div>
          <div className="text-center space-y-4 mt-6">
            <p className="text-gray-600 font-jost">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-700 hover:underline">
                Create one
              </Link>
            </p>
            <p className="text-xs text-gray-500 font-jost">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-indigo-700 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-indigo-700 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
