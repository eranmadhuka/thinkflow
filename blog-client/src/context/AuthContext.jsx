import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Start with false
  const fetchUser = async () => {
    try {
      setLoading(true);
      const checkResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/check`,
        { withCredentials: true }
      );
      if (checkResponse.data.authenticated) {
        const profileResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/profile`,
          { withCredentials: true }
        );
        setUser(profileResponse.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Error checking auth:",
        error.response?.data || error.message
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // const fetchUser = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API_URL}/user/profile`,
  //       { withCredentials: true }
  //     );
  //     setUser(response.data);
  //   } catch (error) {
  //     if (error.response?.status === 401) {
  //       setUser(null);
  //     } else {
  //       console.error(
  //         "Unexpected error fetching user:",
  //         error.response?.data || error.message
  //       );
  //       setUser(null);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Remove useEffect here to avoid auto-fetching on mount
  // useEffect(() => {
  //   fetchUser();
  // }, []);

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
      value={{ user, setUser, loading, login, logout, fetchUser }}
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
