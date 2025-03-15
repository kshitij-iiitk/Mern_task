import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
	const { user } = useAuth();

	if (user === undefined) return <p>Loading...</p>; // Show loading while checking auth

	return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
