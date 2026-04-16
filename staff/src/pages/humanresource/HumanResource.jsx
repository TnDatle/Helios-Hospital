import { Outlet, NavLink } from "react-router-dom";

function HumanResourcePage() {
  return (
    <div className="hr-page-layout">
      {/* SIDEBAR */}
      <aside className="hr-sidebar">
        <h4>Tuyển dụng</h4>

        <nav className="hr-sidebar-menu">
          <NavLink to="/staff/humanresource" end>
            📄 Danh sách tuyển dụng
          </NavLink>

          <NavLink to="/staff/humanresource/addjobs">
            ➕ Đăng bài tuyển dụng
          </NavLink>

          <NavLink to="/staff/humanresource/resume">
            📥 Hồ sơ ứng viên
          </NavLink>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="hr-content">
        <Outlet />
      </main>
    </div>
  );
}

export default HumanResourcePage;