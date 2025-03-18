import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ProtectedRoute component to protect routes that require authentication

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (user === undefined) return <p>Loading...</p>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
