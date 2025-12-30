import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

function StaffLayout() {
  return (
    <>
      <header className="staff-header">
        {/* BRAND */}
        <Link to="/" className="staff-brand-link">
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

        {/* RIGHT ACTIONS (sau này gắn user/logout) */}
        <div className="staff-actions">
          <span className="staff-role">Staff</span>
          <button className="staff-logout">Đăng xuất</button>
        </div>
      </header>

      <Outlet />
    </>
  );
}

export default StaffLayout;
