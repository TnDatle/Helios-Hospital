import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HOME_BY_ROLE = {
  ADMIN: "/staff/admin",
  DOCTOR: "/staff/doctor",
  RECEPTION: "/staff/reception",
};

function RoleRedirect() {
  const { user, loading } = useAuth();

  // chờ auth context load xong
  if (loading) return null;

  //  chưa login
  if (!user) {
    return <Navigate to="/staff/login" replace />;
  }

  const target = HOME_BY_ROLE[user.role];

  //  role không hợp lệ
  if (!target) {
    console.error("UNKNOWN ROLE:", user.role);
    return <Navigate to="/staff/login" replace />;
  }

  //  redirect đúng theo role
  return <Navigate to={target} replace />;
}

export default RoleRedirect;
