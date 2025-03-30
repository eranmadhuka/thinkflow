import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading, fetchUser } = useAuth();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!user && !loading && !hasFetched.current) {
      hasFetched.current = true;
      fetchUser();
    }

    if (!loading && !user && hasFetched.current) {
      navigate("/login");
    }
  }, [user, loading, fetchUser, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : null;
};

export default PrivateRoute;
