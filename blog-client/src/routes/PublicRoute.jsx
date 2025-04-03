import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user, loading, fetchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/callback" && !user && !loading) {
      fetchUser()
        .then(() => {
          const redirectPath =
            sessionStorage.getItem("redirectAfterLogin") || "/feed";
          sessionStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath, { replace: true });
        })
        .catch(() => {
          navigate("/login");
        });
    } else if (!loading && user) {
      const redirectPath =
        sessionStorage.getItem("redirectAfterLogin") || "/feed";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath, { replace: true });
    }
  }, [user, loading, fetchUser, navigate, location]);

  return user ? null : <Outlet />;
};

export default PublicRoute;
