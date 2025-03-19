import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        {/* Heading */}
        <h1 className="font-abril text-3xl text-center text-gray-900 mb-6">
          Create your account
        </h1>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-jost mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 font-jost"
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-jost mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="your@email.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 font-jost"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label
            className="block text-gray-700 font-jost mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 font-jost"
          />
        </div>

        {/* Register Button */}
        <button className="w-full bg-emerald-700 text-white font-jost py-2 px-4 rounded-md hover:bg-emerald-800 transition-colors duration-200 mb-6">
          Create account
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 font-jost">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

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
          <a href="#" className="text-emerald-700 hover:underline">
            Sign in
          </a>
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
  );
};

export default Register;
