import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setAuthError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        console.log("Auth check successful:", response.data);
        setUser(response.data);
      } else {
        console.log("Auth check returned no user data");
        setUser(null);
      }
    } catch (error) {
      // Handle the server error
      const errorMessage =
        error.response?.data?.error || error.message || "Authentication failed";
      const statusCode = error.response?.status;

      console.error(
        `Auth check failed (${statusCode}):`,
        error.response?.data || error.message
      );

      setUser(null);
      setAuthError({
        message: errorMessage,
        status: statusCode,
        details: error.response?.data,
      });

      // If it's a server error (500), log additional info to help debugging
      if (statusCode === 500) {
        console.error(
          "Server error during authentication. Check your backend logs."
        );
      }
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (provider) => {
    const currentPath = window.location.pathname;
    localStorage.setItem("redirectAfterLogin", currentPath || "/feed");

    // Add timestamp to prevent caching issues
    const timestamp = new Date().getTime();
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/oauth2/authorization/${provider}?t=${timestamp}`;
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        { withCredentials: true }
      );
      console.log("Logout response:", response.data);
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      setUser(null);
      window.location.href = "/login";
    }
  };

  // Add a convenience method to check if auth is truly completed (not loading and checked)
  const isAuthReady = !loading && authChecked;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        authChecked,
        authError,
        isAuthReady,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export { AuthContext };
