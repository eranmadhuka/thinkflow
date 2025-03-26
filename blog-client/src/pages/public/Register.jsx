import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const Register = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          {/* Heading */}
          <h1 className="font-abril text-3xl text-center text-gray-900 mb-6">
            Create your account
          </h1>

          {/* Social Login Buttons */}
          <div className="space-y-4">
            {/* Google Login Button */}
            <button className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              <FcGoogle className="w-6 h-6" />
              <span className="font-jost">Sign up with Google</span>
            </button>

            {/* Facebook Login Button */}
            <button className="w-full flex items-center justify-center space-x-3 bg-blue-600 rounded-md py-2 px-4 text-white hover:bg-blue-700 transition-colors duration-200">
              <FaFacebook className="w-6 h-6" />
              <span className="font-jost">Sign up with Facebook</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600 font-jost mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-700 hover:underline">
              Sign in
            </Link>
          </p>

          {/* Terms of Service and Privacy Policy Paragraph */}
          <p className="text-center text-xs text-gray-500 font-jost mt-6">
            By creating an account, you agree to Medium’s{" "}
            <a href="#" className="text-emerald-700 hover:underline">
              Terms of Service
            </a>{" "}
            and acknowledge that Medium’s{" "}
            <a href="#" className="text-emerald-700 hover:underline">
              Privacy Policy
            </a>{" "}
            applies to you.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
