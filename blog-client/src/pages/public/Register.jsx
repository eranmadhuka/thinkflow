import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const Register = () => {
  const { user, loading, authChecked, login, checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Check for OAuth callback parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const authSuccess = queryParams.get("auth_success");

    if (authSuccess === "true") {
      // Force re-check authentication status
      checkAuth();
    }
  }, [checkAuth]);

  // Handle navigation after auth check is complete
  useEffect(() => {
    if (authChecked && user) {
      console.log("User authenticated, redirecting from register page...");
      const redirectPath =
        localStorage.getItem("redirectAfterLogin") || "/feed";
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath, { replace: true });
    }
  }, [user, authChecked, navigate]);

  const handleOAuthLogin = (provider) => {
    setIsLoading(true);
    login(provider);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">
            Creating your account, please wait...
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
            Join the Party – Make Your Account!
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
            <p className="text-center text-gray-600 font-jost mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-700 hover:underline">
                Sign in
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

export default Register;
