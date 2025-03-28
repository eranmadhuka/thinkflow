import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/profile", {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (provider) => {
    const currentPath = window.location.pathname;
    localStorage.setItem("redirectAfterLogin", currentPath || "/feed");
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/logout",
        {},
        { withCredentials: true }
      );
      console.log("Logout response:", response.data); // Should log "Logout successful"
      setUser(null);
      window.location.href = "/login"; // Navigate after successful logout
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      setUser(null); // Clear user even on failure
      window.location.href = "/login"; // Fallback navigation
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export { AuthContext };
