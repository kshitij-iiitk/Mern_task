import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
	const isAuthenticated = localStorage.getItem("token"); // Example check

	return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
