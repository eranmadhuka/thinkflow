import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading, fetchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user && !loading && !initialCheckComplete) {
        try {
          await fetchUser(); // Fetch user if not already loaded
          setInitialCheckComplete(true);
        } catch (error) {
          setInitialCheckComplete(true);
          navigate("/login", { state: { from: location.pathname } }); // Redirect to login if fetch fails
        }
      } else {
        setInitialCheckComplete(true); // Skip fetch if user or loading is already set
      }
    };

    checkAuth();
  }, [user, loading, fetchUser, navigate, location, initialCheckComplete]);

  if (loading || !initialCheckComplete) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return user ? <Outlet /> : null;
};

export default PrivateRoute;
