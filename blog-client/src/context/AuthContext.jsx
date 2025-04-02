import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        { withCredentials: true }
      );
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching user:",
        error.response?.data || error.message
      );
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = (provider) => {
    try {
      // No need for sessionStorage since backend handles redirect
      window.location.href = `${
        import.meta.env.VITE_API_URL
      }/oauth2/authorization/${provider}`;
    } catch (error) {
      console.error("Login redirection failed:", error);
      setLoading(false); // Reset loading if redirect fails
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      setUser(null); // Ensure user is cleared even on failure
    } finally {
      setLoading(false);
    }
  };

  // Fetch user on initial mount
  useEffect(() => {
    fetchUser().catch(() => {
      // Silently handle initial fetch failure (e.g., unauthenticated)
      // Routes will handle redirects
    });
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
