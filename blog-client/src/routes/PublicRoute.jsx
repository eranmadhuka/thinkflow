import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authSuccess =
      new URLSearchParams(location.search).get("auth_success") === "true";
    if (authSuccess) return; // Skip redirect logic on auth success

    if (!loading && user) {
      const redirectPath =
        sessionStorage.getItem("redirectAfterLogin") || "/feed";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath);
    }
  }, [loading, user, navigate, location.search]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? null : <Outlet />;
};

export default PublicRoute; // Changed to default export
