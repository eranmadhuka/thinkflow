import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      console.log(
        "Fetching user from:",
        `${import.meta.env.VITE_API_URL}/user/profile`
      );

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        { withCredentials: true }
      );

      if (response.data) {
        console.log("User data received:", response.data);
        setUser(response.data); // Ensure this line is correctly updating state
      } else {
        console.log("No user data received, setting user to null");
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

  const login = (provider) => {
    const currentPath = window.location.pathname;
    sessionStorage.setItem("redirectAfterLogin", currentPath || "/feed");
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
