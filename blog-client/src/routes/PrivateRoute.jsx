import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading, fetchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  useEffect(() => {
    if (!user && !loading) {
      fetchUser().then(() => {
        setInitialCheckComplete(true);
      });
    } else {
      setInitialCheckComplete(true);
    }
  }, [user, loading, fetchUser]);

  useEffect(() => {
    if (initialCheckComplete && !user) {
      console.log("User not authenticated, redirecting to login...");
      navigate("/login", { replace: true, state: { from: location.pathname } });
    }
  }, [initialCheckComplete, user, navigate, location]);

  if (!initialCheckComplete) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return user ? <Outlet /> : null;
};

export default PrivateRoute;
