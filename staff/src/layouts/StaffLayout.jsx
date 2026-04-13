import { Outlet, Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, set } from "firebase/database";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const ROLE_LABEL = {
  RECEPTION: "Tiếp tân",
  ACCOUNTANT: "Kế toán",
  ADMIN_STAFF: "Hành chính",
  ADMIN: "Quản trị",
  DOCTOR: "Bác sĩ",
};

const HOME_BY_ROLE = {
  ADMIN: "/staff/admin",
  DOCTOR: "/staff/doctor",
  RECEPTION: "/staff/reception",
  ACCOUNTANT: "/staff/accountant",
};

function StaffLayout() {
  const navigate = useNavigate();
  const { user, loading, refreshUser } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/staff/login" replace />;
  }


const handleLogout = async () => {
  const ok = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
  if (!ok) return;

  try {
    const uid = auth.currentUser?.uid;

    //  set OFF ngay (realtime)
    if (uid) {
      const db = getDatabase();
      const userStatusRef = ref(db, "/status/" + uid);

      await set(userStatusRef, {
        isOnline: false,
        lastChanged: Date.now(),
      });
    }

    //  logout BE (session)
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    //  logout Firebase (QUAN TRỌNG)
    await signOut(auth);

    //  reload user context
    await refreshUser();

  } catch (err) {
    console.error("LOGOUT ERROR:", err);
  }
};


  return (
    <>
      <header className="staff-header">
        <Link
          to={HOME_BY_ROLE[user.role]}
          className="staff-brand-link"
        >
          <div className="staff-brand">
            <img
              src="/icons/logo1.png"
              className="staff-hospital-logo"
              alt="Helios Hospital Logo"
            />
            <div className="staff-brand-text">
              <span className="staff-dept-text">
                SỞ Y TẾ THÀNH PHỐ HỒ CHÍ MINH
              </span>
              <h2 className="staff-hospital-name">
                BỆNH VIỆN HELIOS VIỆT NAM
              </h2>
            </div>
          </div>
        </Link>

        <div className="staff-actions">
          <div className="staff-user-info">
            <strong>{user.name}</strong>
          </div>

          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      </header>

      <Outlet />
    </>
  );
}

export default StaffLayout;
