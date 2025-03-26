import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const Login = () => {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if user is already authenticated
    if (user) {
      // Use the stored redirect path or default to feed
      const origin = location.state?.from?.pathname || "/feed";
      navigate(origin, { replace: true });
    }
  }, [user, navigate, location]);

  const handleOAuthLogin = (provider) => {
    setIsLoading(true);
    try {
      // Use the centralized login method from AuthContext
      login(provider);
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  // Loading state component
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mx-auto"></div>
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
            Sign in to Your Account
          </h1>

          <div className="space-y-4">
            {/* OAuth Login Buttons */}
            {[
              {
                provider: "google",
                Icon: FcGoogle,
                text: "Sign in with Google",
                className:
                  "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
              },
              {
                provider: "github",
                Icon: FaGithub,
                text: "Sign in with GitHub",
                className: "bg-gray-800 text-white hover:bg-gray-700",
              },
              {
                provider: "facebook",
                Icon: FaFacebook,
                text: "Sign in with Facebook",
                className: "bg-blue-600 text-white hover:bg-blue-700",
              },
            ].map(({ provider, Icon, text, className }) => (
              <button
                key={provider}
                onClick={() => handleOAuthLogin(provider)}
                className={`w-full flex items-center justify-center space-x-3 rounded-md py-2 px-4 transition-colors duration-200 ${className}`}
                disabled={isLoading}
              >
                <Icon className="w-6 h-6" />
                <span className="font-jost">{text}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 font-jost">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-600 font-jost">
              Don't have an account?{" "}
              <Link to="/register" className="text-emerald-700 hover:underline">
                Create one
              </Link>
            </p>

            <p className="text-xs text-gray-500 font-jost">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-emerald-700 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-emerald-700 hover:underline">
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
