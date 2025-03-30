import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext(); // No need to export this

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        { withCredentials: true }
      );
      setUser(response.data || null);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (provider) => {
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/oauth2/authorization/${provider}`;
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
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, setLoading, login, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Use this hook instead of importing `AuthContext` directly
export const useAuth = () => useContext(AuthContext);
