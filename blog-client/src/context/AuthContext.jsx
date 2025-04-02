import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user data on mount or after login
  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        { withCredentials: true }
      );
      setUser(response.data || null);
    } catch (error) {
      console.error(
        "Error fetching user:",
        error.response?.data || error.message
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth2 login with a specific provider (e.g., "google")
  const login = (provider) => {
    try {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = `${
        import.meta.env.VITE_API_URL
      }/oauth2/authorization/${provider}`;
    } catch (error) {
      console.error("Login redirection failed:", error);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      window.location.href = "/"; // Redirect to home after logout
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check user status on mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, setLoading, login, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
