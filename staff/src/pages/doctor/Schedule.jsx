import { useEffect, useState } from "react";
import "../../styles/doctor/schedule.css";

const API_BASE = "http://localhost:5000/api";

const WEEKDAY_LABEL = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  7: "Chủ nhật",
};

const SHIFT_LABEL = {
  MORNING: "Ca sáng",
  AFTERNOON: "Ca chiều",
};

const SHIFT_TIME = {
  MORNING: "06:30 – 11:30",
  AFTERNOON: "13:00 – 16:00",
};

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get current weekday (1-7)
  const getCurrentWeekday = (date) => {
    const day = date.getDay();
    return day === 0 ? 7 : day;
  };

  // Format date
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch doctor's schedules
  const fetchSchedules = async () => {
    try {
      // TODO: Replace with actual doctor ID from auth
      const doctorId = 1;

      const res = await fetch(`${API_BASE}/schedules`);
      const json = await res.json();

      if (json.success) {
        // Filter schedules for this doctor
        const doctorSchedules = [];
        json.data.forEach((dept) => {
          dept.doctors.forEach((doc) => {
            if (doc.doctorId === doctorId) {
              Object.entries(doc.schedule).forEach(([weekday, shifts]) => {
                shifts.forEach((shift) => {
                  doctorSchedules.push({
                    weekday: Number(weekday),
                    shift,
                    room: doc.room,
                    department: dept.departmentName,
                  });
                });
              });
            }
          });
        });

        setSchedules(doctorSchedules);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  // Fetch appointments (mock data for now)
  const fetchAppointments = async () => {
    try {
      // TODO: Replace with actual API call
      // Mock appointments for today
      const mockAppointments = [
        {
          id: 1,
          time: "08:00",
          patient: "Nguyễn Văn A",
          reason: "Khám định kỳ",
          status: "confirmed",
        },
        {
          id: 2,
          time: "08:30",
          patient: "Trần Thị B",
          reason: "Tái khám",
          status: "confirmed",
        },
        {
          id: 3,
          time: "09:00",
          patient: "Lê Văn C",
          reason: "Khám bệnh",
          status: "pending",
        },
        {
          id: 4,
          time: "14:00",
          patient: "Phạm Thị D",
          reason: "Khám tổng quát",
          status: "confirmed",
        },
      ];

      setAppointments(mockAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    Promise.all([fetchSchedules(), fetchAppointments()]).finally(() => {
      setLoading(false);
    });
  }, []);

  // Get schedules for selected date
  const todayWeekday = getCurrentWeekday(selectedDate);
  const todaySchedules = schedules.filter((s) => s.weekday === todayWeekday);

  if (loading) {
    return (
      <div className="schedule-page">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="schedule-page">
      {/* HEADER */}
      <div className="schedule-header">
        <h1 className="schedule-title">Lịch khám của tôi</h1>
        <p className="schedule-subtitle">
          {WEEKDAY_LABEL[todayWeekday]}, {formatDate(selectedDate)}
        </p>
      </div>

      {/* MY SCHEDULES */}
      <div className="schedule-section">
        <h2>Lịch làm việc hôm nay</h2>

        {todaySchedules.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📅</span>
            <p>Hôm nay bạn không có lịch làm việc</p>
          </div>
        ) : (
          <div className="schedule-grid">
            {todaySchedules.map((schedule, idx) => (
              <div key={idx} className="schedule-card">
                <div className="schedule-badge">
                  {SHIFT_LABEL[schedule.shift]}
                </div>
                <div className="schedule-info">
                  <div className="schedule-time">
                    🕐 {SHIFT_TIME[schedule.shift]}
                  </div>
                  <div className="schedule-room">📍 Phòng {schedule.room}</div>
                  <div className="schedule-dept">🏥 {schedule.department}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* APPOINTMENTS */}
      <div className="schedule-section">
        <h2>Danh sách bệnh nhân đã đặt lịch</h2>

        {appointments.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">👥</span>
            <p>Chưa có bệnh nhân đặt lịch</p>
          </div>
        ) : (
          <div className="appointment-list">
            {appointments.map((apt) => (
              <div key={apt.id} className="appointment-card">
                <div className="appointment-time">{apt.time}</div>
                <div className="appointment-content">
                  <h3>{apt.patient}</h3>
                  <p>{apt.reason}</p>
                </div>
                <div className="appointment-status">
                  <span
                    className={`status-badge ${apt.status}`}
                  >
                    {apt.status === "confirmed" && "✓ Đã xác nhận"}
                    {apt.status === "pending" && "⏳ Chờ xác nhận"}
                    {apt.status === "completed" && "✔ Hoàn thành"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}