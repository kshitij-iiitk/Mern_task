import { Navigate, Outlet } from "react-router-dom";

// Redirects to the home page if the user is already authenticated
// Otherwise, renders the child components

const PublicRoute = () => {
  const isAuthenticated = localStorage.getItem("token"); 

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
