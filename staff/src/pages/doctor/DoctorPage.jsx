import { Outlet, NavLink } from "react-router-dom";

function DoctorPage() {
  return (
    <div className="doctor-layout">
      {/* SIDEBAR */}
      <aside className="doctor-sidebar">

        <nav className="doctor-menu">
          <NavLink to="/staff/doctor" end>
            🗓️ Lịch khám hôm nay
          </NavLink>

          <NavLink to="/staff/doctor/queue">
            👥 Bệnh nhân chờ khám
          </NavLink>

          <NavLink to="/staff/doctor/history">
            📄 Lịch sử khám
          </NavLink>

          <NavLink to="/staff/doctor/track">
            🔍 Tra cứu bệnh nhân
          </NavLink>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="doctor-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DoctorPage;
