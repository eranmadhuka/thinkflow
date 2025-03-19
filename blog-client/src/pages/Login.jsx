import React from "react";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { FaFacebook, FaGithub } from "react-icons/fa"; // Facebook icon

const Login = () => {
  const googleLogin = () => {
    window.location.href =
      "http://localhost:8080/login/oauth2/authorization/google";
  };

  const githubLogin = () => {
    window.location.href =
      "http://localhost:8080/login/oauth2/authorization/github";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        {/* Heading */}
        <h1 className="font-abril text-3xl text-center text-gray-900 mb-6">
          Sign in
        </h1>

        {/* Social Login Buttons */}
        <div className="space-y-4">
          {/* Google Login Button */}
          <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            <FcGoogle className="w-6 h-6" />
            <span className="font-jost">Sign in with Google</span>
          </button>

          {/* GitHub Login Button */}
          <button
            onClick={githubLogin}
            className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            <FaGithub className="w-6 h-6" />
            <span className="font-jost">Sign in with Github</span>
          </button>

          {/* Facebook Login Button */}
          <button className="w-full flex items-center justify-center space-x-3 bg-blue-600 rounded-md py-2 px-4 text-white hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
            <FaFacebook className="w-6 h-6" />
            <span className="font-jost">Sign in with Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 font-jost">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Create Account Link */}
        <p className="text-center text-gray-600 font-jost mb-6">
          No account?{" "}
          <a href="#" className="text-emerald-700 hover:underline">
            Create one
          </a>
        </p>

        {/* Terms of Service and Privacy Policy Paragraph */}
        <p className="text-center text-xs text-gray-500 font-jost">
          Click “Sign in” to agree to Medium’s{" "}
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

export default Login;
