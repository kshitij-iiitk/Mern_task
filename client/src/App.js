import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./components/PublicRoute";
import "./App.css";

// App component to define the routes of the application
// It uses the AuthProvider to store the user state
// It uses the PublicRoute and ProtectedRoute components to define the routes

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes*/}
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes*/}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Main />} />
        </Route>

        {/* Default redirect*/}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
