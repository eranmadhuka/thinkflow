import React, { useEffect, useRef } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading, fetchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasFetched = useRef(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const authSuccess = queryParams.get("auth_success") === "true";

    if (authSuccess) {
      // Allow initial redirect from /login?auth_success=true
      return;
    }

    if (!user && !loading && !hasFetched.current) {
      hasFetched.current = true;
      fetchUser();
    }

    if (!loading && !user && hasFetched.current) {
      navigate("/login");
    }
  }, [user, loading, fetchUser, navigate, location.search]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : null;
};

export default PrivateRoute;
