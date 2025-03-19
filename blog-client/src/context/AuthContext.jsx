import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap your application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to store the authenticated user
  const [loading, setLoading] = useState(true); // State to track loading state

  // Function to check if the user is authenticated
  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/profile", {
        withCredentials: true, // Include cookies in the request
      });
      setUser(response.data); // Set the user data
    } catch (error) {
      setUser(null); // Clear the user if not authenticated
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Function to handle login
  const login = () => {
    // Redirect to the backend OAuth2 login endpoint
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/logout",
        {},
        {
          withCredentials: true, // Include cookies in the request
        }
      );
      setUser(null); // Clear the user state
      window.location.href = "http://localhost:5173/login"; // Redirect to the login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Check authentication status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Provide the authentication context to the application
  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Export AuthContext as a named export
export { AuthContext };
