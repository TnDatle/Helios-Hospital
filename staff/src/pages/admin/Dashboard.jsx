import { useEffect, useState, useRef } from "react";
import "../../styles/admin/dashboard.css";

const API_BASE = "http://localhost:5000/api";

const WEEKDAY_MAP = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const duration = 800;
    const step = (timestamp) => {
      if (!ref.current) return;
      const progress = Math.min((timestamp - ref.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame((ts) => {
      ref.current = ts;
      requestAnimationFrame(step);
    });
  }, [value]);

  return <span>{display}</span>;
}

const STAT_CONFIG = [
  {
    key: "doctors",
    label: "Bác sĩ hoạt động",
    sublabel: "đang trực",
    accent: "#0ea5e9",
    bg: "#f0f9ff",
    border: "#bae6fd",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    key: "staff",
    label: "Nhân viên",
    sublabel: "tổng cộng",
    accent: "#10b981",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    key: "departments",
    label: "Khoa phòng",
    sublabel: "đang vận hành",
    accent: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    key: "schedulesToday",
    label: "Lịch khám hôm nay",
    sublabel: "ca làm việc",
    accent: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="8" y1="14" x2="8" y2="14"/>
        <line x1="12" y1="14" x2="12" y2="14"/>
        <line x1="16" y1="14" x2="16" y2="14"/>
      </svg>
    ),
  },
];

const DAYS_VI = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];

function getMiniWeek() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    return {
      label: DAYS_VI[i],
      date: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
    };
  });
}

export default function Dashboard() {
  const [stats, setStats] = useState({ doctors: 0, staff: 0, departments: 0, schedulesToday: 0 });
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const week = getMiniWeek();

  const now = new Date();
  const timeStr = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });

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

      const activeDoctors = doctorsData.data?.length || 0;
      const totalDepts = deptsData.data?.length || 0;
      const todayWeekday = WEEKDAY_MAP[new Date().getDay()];
      let schedulesToday = 0;
      schedulesData.data?.forEach((dept) => {
        dept.doctors?.forEach((doc) => {
          if (doc.schedule[todayWeekday]) schedulesToday += doc.schedule[todayWeekday].length;
        });
      });

      setStats({ doctors: activeDoctors, staff: 18, departments: totalDepts, schedulesToday });
      setActivities([
        { id: 1, text: "Bệnh nhân mới đăng ký khám", type: "patient", time: "10 phút trước" },
        { id: 2, text: "Cập nhật lịch làm việc – BS. Nguyễn Văn A", type: "schedule", time: "25 phút trước" },
        { id: 3, text: "Thêm Khoa Ngoại tổng quát", type: "dept", time: "1 giờ trước" },
        { id: 4, text: "Phân quyền tài khoản lễ tân mới", type: "role", time: "2 giờ trước" },
        { id: 5, text: "Xuất báo cáo tuần – Khoa Nội", type: "report", time: "3 giờ trước" },
      ]);
      setAlerts([
        { id: 1, type: "success", message: "Hệ thống đang hoạt động ổn định" },
        { id: 2, type: "warning", message: "2 tài khoản chưa được phân quyền" },
        { id: 3, type: "info", message: "Lịch sao lưu dữ liệu: hôm nay 02:00" },
      ]);
      setLastRefresh(new Date());
      setLoading(false);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      // Fallback mock data
      setStats({ doctors: 12, staff: 18, departments: 6, schedulesToday: 34 });
      setActivities([
        { id: 1, text: "Bệnh nhân mới đăng ký khám", type: "patient", time: "10 phút trước" },
        { id: 2, text: "Cập nhật lịch làm việc – BS. Nguyễn Văn A", type: "schedule", time: "25 phút trước" },
        { id: 3, text: "Thêm Khoa Ngoại tổng quát", type: "dept", time: "1 giờ trước" },
        { id: 4, text: "Phân quyền tài khoản lễ tân mới", type: "role", time: "2 giờ trước" },
        { id: 5, text: "Xuất báo cáo tuần – Khoa Nội", type: "report", time: "3 giờ trước" },
      ]);
      setAlerts([
        { id: 1, type: "success", message: "Hệ thống đang hoạt động ổn định" },
        { id: 2, type: "warning", message: "2 tài khoản chưa được phân quyền" },
        { id: 3, type: "info", message: "Lịch sao lưu dữ liệu: hôm nay 02:00" },
      ]);
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);
  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const activityIcons = {
    patient: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    schedule: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    dept: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    role: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    report: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  };

  const alertIcons = {
    success: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    warning: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    info: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="db-skeleton">
          <div className="db-skeleton-header" />
          <div className="db-skeleton-stats">
            {[0,1,2,3].map(i => <div key={i} className="db-skeleton-card" style={{ animationDelay: `${i * 0.1}s` }} />)}
          </div>
          <div className="db-skeleton-row">
            <div className="db-skeleton-block" />
            <div className="db-skeleton-block" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="db-header">
        <div className="db-header-left">
          <h1 className="admin-title">Dashboard</h1>
          <p className="db-date">{dateStr}</p>
        </div>
        <div className="db-header-right">
          <div className="db-week">
            {week.map((d) => (
              <div key={d.label} className={`db-week-day ${d.isToday ? "today" : ""}`}>
                <span className="db-week-label">{d.label}</span>
                <span className="db-week-date">{d.date}</span>
              </div>
            ))}
          </div>
          <div className="db-refresh">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Cập nhật: {lastRefresh.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="db-stats">
        {STAT_CONFIG.map((cfg, i) => (
          <div
            key={cfg.key}
            className="db-stat-card"
            style={{
              "--accent": cfg.accent,
              "--bg": cfg.bg,
              "--bd": cfg.border,
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <div className="db-stat-icon" style={{ color: cfg.accent }}>
              {cfg.svg}
            </div>
            <div className="db-stat-value">
              <AnimatedNumber value={stats[cfg.key]} />
            </div>
            <div className="db-stat-label">{cfg.label}</div>
            <div className="db-stat-sub">{cfg.sublabel}</div>
            <div className="db-stat-bar">
              <div className="db-stat-bar-fill" />
            </div>
          </div>
        ))}
      </div>

      {/* CONTENT ROW */}
      <div className="db-row">
        {/* Activity */}
        <div className="db-card db-activity">
          <div className="db-card-header">
            <h2 className="db-card-title">Hoạt động gần đây</h2>
            <span className="db-card-badge">{activities.length}</span>
          </div>
          <ul className="db-activity-list">
            {activities.map((act, i) => (
              <li key={act.id} className="db-activity-item" style={{ animationDelay: `${0.3 + i * 0.07}s` }}>
                <div className={`db-act-icon act-${act.type}`}>
                  {activityIcons[act.type]}
                </div>
                <div className="db-act-body">
                  <span className="db-act-text">{act.text}</span>
                  <span className="db-act-time">{act.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column */}
        <div className="db-right-col">
          {/* Alerts */}
          <div className="db-card db-alerts">
            <div className="db-card-header">
              <h2 className="db-card-title">Thông báo hệ thống</h2>
            </div>
            <div className="db-alert-list">
              {alerts.map((a, i) => (
                <div key={a.id} className={`db-alert db-alert-${a.type}`} style={{ animationDelay: `${0.35 + i * 0.08}s` }}>
                  <span className="db-alert-icon">{alertIcons[a.type]}</span>
                  <span className="db-alert-msg">{a.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="db-card db-quick">
            <div className="db-card-header">
              <h2 className="db-card-title">Truy cập nhanh</h2>
            </div>
            <div className="db-quick-grid">
              {[
                { label: "Bác sĩ", href: "#/doctors", color: "#0ea5e9" },
                { label: "Lịch làm việc", href: "#/schedules", color: "#8b5cf6" },
                { label: "Khoa phòng", href: "#/departments", color: "#10b981" },
                { label: "Phân quyền", href: "#/roles", color: "#f59e0b" },
              ].map((q) => (
                <a key={q.label} href={q.href} className="db-quick-btn" style={{ "--qc": q.color }}>
                  {q.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}