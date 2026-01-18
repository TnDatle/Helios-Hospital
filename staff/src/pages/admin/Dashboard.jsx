import { useEffect, useState } from "react";
import "../../styles/admin/dashboard.css";

const API_BASE = "http://localhost:5000/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    doctors: 0,
    staff: 0,
    departments: 0,
    schedulesToday: 0,
  });

  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const [doctorsRes, deptsRes, schedulesRes] = await Promise.all([
        fetch(`${API_BASE}/doctors`),
        fetch(`${API_BASE}/departments`),
        fetch(`${API_BASE}/schedules`),
      ]);

      const [doctorsData, deptsData, schedulesData] = await Promise.all([
        doctorsRes.json(),
        deptsRes.json(),
        schedulesRes.json(),
      ]);

      // Count active doctors
      const activeDoctors = doctorsData.data?.length || 0;

      // Count departments
      const totalDepts = deptsData.data?.length || 0;

      // Count today's schedules
      const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
      const weekdayMap = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };
      const todayWeekday = weekdayMap[today];

      let schedulesToday = 0;
      schedulesData.data?.forEach((dept) => {
        dept.doctors?.forEach((doc) => {
          if (doc.schedule[todayWeekday]) {
            schedulesToday += doc.schedule[todayWeekday].length;
          }
        });
      });

      setStats({
        doctors: activeDoctors,
        staff: 18, // TODO: fetch from staff API
        departments: totalDepts,
        schedulesToday,
      });

      // Mock activities (you can fetch from activity log API)
      setActivities([
        { id: 1, text: "Bệnh nhân mới đăng ký", icon: "👤", time: "10 phút trước" },
        { id: 2, text: "Cập nhật lịch làm việc bác sĩ", icon: "📅", time: "25 phút trước" },
        { id: 3, text: "Thêm khoa mới", icon: "🏥", time: "1 giờ trước" },
      ]);

      // System alerts
      setAlerts([
        { id: 1, type: "success", message: "Hệ thống đang hoạt động ổn định" },
        { id: 2, type: "warning", message: "Còn 2 tài khoản chưa phân quyền" },
      ]);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="dashboard-loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

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
            <h3>{stats.doctors}</h3>
            <p>Bác sĩ đang hoạt động</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-green">👩‍💼</div>
          <div className="stat-content">
            <h3>{stats.staff}</h3>
            <p>Nhân viên</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-purple">🏥</div>
          <div className="stat-content">
            <h3>{stats.departments}</h3>
            <p>Khoa phòng</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-orange">📅</div>
          <div className="stat-content">
            <h3>{stats.schedulesToday}</h3>
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
            {activities.map((activity) => (
              <li key={activity.id}>
                <span className="activity-icon">{activity.icon}</span>
                <span className="activity-text">{activity.text}</span>
                <span className="activity-time">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="dashboard-section">
          <h2>Thông báo hệ thống</h2>

          {alerts.map((alert) => (
            <div key={alert.id} className={`system-alert ${alert.type}`}>
              {alert.type === "success" && "✔ "}
              {alert.type === "warning" && "⚠ "}
              {alert.type === "error" && "✖ "}
              {alert.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}