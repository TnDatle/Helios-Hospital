import { Outlet, NavLink } from "react-router-dom";

function AdminPage() {
  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <h4>Quản trị hệ thống</h4>

        <nav className="admin-menu">
          <NavLink to="/staff/admin" end>
             Dashboard
          </NavLink>

          <NavLink to="/staff/admin/users">
             Quản lý người dùng
          </NavLink>

          <NavLink to="/staff/admin/roles">
             Phân quyền
          </NavLink>

          <NavLink to="/staff/admin/departments">
             Khoa phòng - Bác Sĩ
          </NavLink>

          <NavLink to="/staff/admin/schedules">
             Lịch làm việc
          </NavLink>

          <NavLink to="/staff/admin/news">
            Tin tức
          </NavLink>
          
          <NavLink to="/staff/admin/logs">
             Nhật ký hệ thống
          </NavLink>

          <NavLink to="/staff/admin/settings">
             Cấu hình hệ thống
          </NavLink>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminPage;
