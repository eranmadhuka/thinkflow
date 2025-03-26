import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // Redirect to feed if user is logged in
  return !user ? <Outlet /> : <Navigate to="/feed" replace />;
};

export default PublicRoute;
