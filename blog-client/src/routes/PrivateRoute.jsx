import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const PrivateRoute = () => {
  const { user, setUser, loading, setLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasFetched = useRef(false);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (user || loading) return; // Prevent unnecessary calls

      console.log("Checking authentication...");

      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/profile`,
          { withCredentials: true, timeout: 5000 }
        );

        if (response.data) {
          console.log("Authenticated user:", response.data);
          setUser(response.data);

          if (location.pathname === "/login") {
            navigate("/feed", { replace: true });
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);

        setUser(null);
        if (location.pathname !== "/login") {
          navigate("/login", {
            replace: true,
            state: { from: location.pathname },
          });
        }
      } finally {
        setLoading(false);
        setInitialCheckComplete(true);
      }
    };

    if (!hasFetched.current) {
      hasFetched.current = true;
      checkAuth();
    }
  }, [user, loading, setUser, navigate, location]);

  // Show loading state only during initial check
  if (!initialCheckComplete) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Only render protected content if we have a user
  return user ? <Outlet /> : null;
};

export default PrivateRoute;
