import { Outlet, NavLink } from "react-router-dom";

function ReceptionPage() {
  return (
    <div className="page-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h4>Tiếp nhận</h4>

        <nav className="sidebar-menu">
          <NavLink to="/staff/reception" end>
            🧾 Đăng ký khám
          </NavLink>

          <NavLink to="/staff/reception/walk-in">
            🚶 Tiếp nhận trực tiếp
          </NavLink>

          <NavLink to="/staff/reception/track-patient">
            🔍 Tra cứu bệnh nhân
          </NavLink>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default ReceptionPage;
