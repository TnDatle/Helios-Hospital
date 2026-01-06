import "../../styles/admin/dashboard.css";

export default function Dashboard() {
  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1 className="admin-title">Dashboard</h1>
        <p className="admin-subtitle">
          Tổng quan hoạt động hệ thống hôm nay
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon icon-blue">👨‍⚕️</div>
          <div className="stat-content">
            <h3>42</h3>
            <p>Bác sĩ đang hoạt động</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-green">👩‍💼</div>
          <div className="stat-content">
            <h3>18</h3>
            <p>Nhân viên</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-purple">🏥</div>
          <div className="stat-content">
            <h3>12</h3>
            <p>Khoa phòng</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-orange">📅</div>
          <div className="stat-content">
            <h3>96</h3>
            <p>Lịch khám hôm nay</p>
          </div>
        </div>
      </div>

      {/* CONTENT ROW */}
      <div className="dashboard-row">
        {/* LEFT */}
        <div className="dashboard-section">
          <h2>Hoạt động hôm nay</h2>

          <ul className="activity-list">
            <li>👤 Bệnh nhân mới đăng ký</li>
            <li>📅 Cập nhật lịch làm việc bác sĩ</li>
            <li>🏥 Thêm khoa mới</li>
          </ul>
        </div>

        {/* RIGHT */}
        <div className="dashboard-section">
          <h2>Thông báo hệ thống</h2>

          <div className="system-alert success">
            ✔ Hệ thống đang hoạt động ổn định
          </div>

          <div className="system-alert warning">
            ⚠ Còn 2 tài khoản chưa phân quyền
          </div>
        </div>
      </div>
    </div>
  );
}
