import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  const fetchUser = async () => {
    try {
      console.log("Fetching user data...");
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        { withCredentials: true }
      );

      if (response.data) {
        console.log("User authenticated:", response.data);
        setUser(response.data);
      } else {
        setUser(null);
      }
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

  // Runs only once when the app starts
  useEffect(() => {
    fetchUser();
  }, []);

  const login = (provider) => {
    sessionStorage.setItem(
      "redirectAfterLogin",
      window.location.pathname || "/feed"
    );
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
      console.error("Logout failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
