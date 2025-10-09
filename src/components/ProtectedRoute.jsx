import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return null; // or a spinner

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin" && user.role !== "manager" && user.role !== "staff") {
    // Not authorized
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
