import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading, fetchUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      fetchUser(); // Line ~22: This updates state in AuthProvider
    }
  }, [user, loading, fetchUser]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : null;
};

export default PrivateRoute;
