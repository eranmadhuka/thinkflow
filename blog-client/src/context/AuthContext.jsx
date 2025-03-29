import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const checkAuth = async () => {
    try {
      setLoading(true);
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
      console.error(
        "Auth check failed:",
        error.response?.data || error.message
      );
      setUser(null);
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
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/oauth2/authorization/${provider}`;
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

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, authChecked, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export { AuthContext };
