import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // đang load user
  if (loading) return null;

  // chưa login
  if (!user) {
    return <Navigate to="/staff/login" replace />;
  }

  // sai role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/staff" replace />;
  }

  return children;
};

export default ProtectedRoute;