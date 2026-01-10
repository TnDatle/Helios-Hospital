import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaInfoCircle, FaCalendarAlt } from "react-icons/fa";

const API_URL = "http://localhost:5000/api/doctors";
const SCHEDULE_API = "http://localhost:5000/api/schedules";

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
  MORNING: "Ca sáng (06:30 – 11:30)",
  AFTERNOON: "Ca chiều (13:00 – 16:00)",
};

const DEPARTMENT_LABEL = {
  "ngoai-tong-quat": "Ngoại Tổng Quát",
  "ngoai-tiet-nieu": "Ngoại Tiết Niệu",
  "tim-mach": "Tim Mạch & Mạch Máu",
  "ung-buou": "Ung Bướu",
  "noi-than": "Lọc Máu & Nội Thận",
  "noi-soi-tieu-hoa": "Nội Soi Tiêu Hóa",
  "noi-soi-nieu": "Nội Soi Niệu",
};

/**
 * =====================================================
 * INTRO TEMPLATE (CLEAN – SCALE ĐƯỢC)
 * =====================================================
 */
const getDoctorIntro = (doctor) => {
  if (!doctor) return "";

  const departmentName = DEPARTMENT_LABEL[doctor.department] || "khoa chuyên môn";

  return `
  ${doctor.name} hiện đang công tác tại ${departmentName} với chuyên môn là ${doctor.specialty}.
  Bác sĩ tham gia tiếp nhận, thăm khám và tư vấn cho người bệnh theo quy trình chuyên môn của khoa.

  Lịch làm việc của bác sĩ được cập nhật định kỳ trên hệ thống để người bệnh thuận tiện theo dõi và đăng ký khám.`;
};


const DoctorDetail = () => {
  const { department, id } = useParams();
  const location = useLocation();

  /**
   * =====================================================
   * INIT DOCTOR (ƯU TIÊN DATA TỪ TRANG TRƯỚC)
   * =====================================================
   */
  const [doctor, setDoctor] = useState(() => {
    if (!location.state) return null;

    return {
      id,
      name: location.state.name || "",
      role: location.state.role || "",
      specialty: location.state.specialty || "",
      department: location.state.department || "",
    };
  });

  const [loading, setLoading] = useState(!doctor);
  const [error, setError] = useState("");

  /**
   * =====================================================
   * FETCH DOCTOR DETAIL (KHI CHƯA CÓ DATA)
   * =====================================================
   */
  useEffect(() => {
    if (doctor) return;

    const controller = new AbortController();

    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${API_URL}/${encodeURIComponent(department)}/${encodeURIComponent(
            id
          )}`,
          { signal: controller.signal }
        );

        const json = await res.json();

        if (json.success) {
          setDoctor({
            id: json.data.id,
            name: json.data.name,
            role: json.data.role,
            specialty: json.data.specialty,
            department: json.data.department,
          });
        } else {
          setError("Không tìm thấy thông tin bác sĩ");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch doctor detail error:", err);
          setError("Lỗi khi tải thông tin bác sĩ");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
    return () => controller.abort();
  }, [department, id, doctor]);

  /**
   * =====================================================
   * FETCH WEEKLY SCHEDULE (TEMPLATE)
   * =====================================================
   */
  const [schedules, setSchedules] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  useEffect(() => {
    if (!doctor?.id) return;

    fetch(`${SCHEDULE_API}/${doctor.id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        setSchedules(json.data || []);
        setScheduleLoading(false);
      })
      .catch((err) => {
        console.error("Fetch schedules error:", err);
        setScheduleLoading(false);
      });
  }, [doctor]);

  /**
   * =====================================================
   * GROUP & SORT SCHEDULE
   * =====================================================
   */
  const SHIFT_ORDER = {
    MORNING: 1,
    AFTERNOON: 2,
  };

  const groupedSchedules = schedules.reduce((acc, s) => {
    if (!acc[s.weekday]) acc[s.weekday] = [];
    acc[s.weekday].push(s);
    return acc;
  }, {});

  Object.keys(groupedSchedules).forEach((weekday) => {
    groupedSchedules[weekday].sort(
      (a, b) => SHIFT_ORDER[a.shiftId] - SHIFT_ORDER[b.shiftId]
    );
  });

  /**
   * =====================================================
   * LOADING / ERROR
   * =====================================================
   */
  if (loading) {
    return <p className="loading">Đang tải thông tin bác sĩ…</p>;
  }

  if (error || !doctor) {
    return <p className="error-text">{error || "Dữ liệu không tồn tại"}</p>;
  }

  /**
   * =====================================================
   * RENDER
   * =====================================================
   */
  return (
    <div className="doctor-detail container">
      {/* ===== HEADER ===== */}
      <div className="doctor-header">
        <div className="doctor-avatar">
          <img
            src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
            alt="doctor"
          />
        </div>

        <div className="doctor-main-info">
          <h1 className="doctor-name">{doctor.name}</h1>
          <h2 className="doctor-role">{doctor.role}</h2>

          <div className="specialty-tag">
            <span className="dot"></span>
            <span>Chuyên khoa: {doctor.specialty}</span>
          </div>

          <hr />

          {/* ===== INTRO ===== */}
          <div className="intro-section">
            <h3>
              <FaInfoCircle /> GIỚI THIỆU
            </h3>

            <p className="intro-text">
              {getDoctorIntro(doctor)}
            </p>
          </div>
        </div>
      </div>

      {/* ===== WEEKLY SCHEDULE ===== */}
      <div className="doctor-section">
        <h3 className="section-title">Lịch khám bệnh (theo tuần)</h3>

        <table className="schedule-table">
          <thead>
            <tr>
              <th>NGÀY</th>
              <th>THỜI GIAN</th>
              <th>PHÒNG KHÁM</th>
              <th>VỊ TRÍ</th>
            </tr>
          </thead>

          <tbody>
            {scheduleLoading && (
              <tr>
                <td colSpan="4" className="empty">
                  Đang tải lịch khám…
                </td>
              </tr>
            )}

            {!scheduleLoading && schedules.length === 0 && (
              <tr>
                <td colSpan="4" className="empty">
                  Chưa có lịch khám
                </td>
              </tr>
            )}

            {!scheduleLoading &&
              Object.keys(groupedSchedules)
                .sort((a, b) => a - b)
                .map((weekday) =>
                  groupedSchedules[weekday].map((s, idx) => (
                    <tr key={`${weekday}-${idx}`}>
                      <td>{WEEKDAY_LABEL[weekday]}</td>
                      <td>{SHIFT_LABEL[s.shiftId]}</td>
                      <td>{s.room}</td>
                      <td>Khu khám bệnh trụ sở chính</td>
                    </tr>
                  ))
                )}
          </tbody>
        </table>

        <p className="note">
          <strong>Ghi chú:</strong> Lịch khám mang tính chất định kỳ hàng tuần.
          Ngày khám cụ thể sẽ được xác nhận khi đặt lịch.
        </p>
        <p className="note">
          <strong>Lịch khám có thể thay đổi theo lịch công tác của bác sĩ</strong>
        </p>
      </div>

      {/* ===== BOOKING CTA ===== */}
      <div className="doctor-section booking">
        <h3>
          <FaCalendarAlt /> ĐẶT HẸN KHÁM BỆNH VỚI {doctor.name}
        </h3>
        <p>
          Quý khách vui lòng sang trang đặt lịch để chọn{" "}
          <strong>ngày khám cụ thể</strong>. Tin nhắn CSKH sẽ gửi thông tin xác nhận lịch của quý khách
          qua số điện thoại đã đăng ký.
        </p>
      </div>
    </div>
  );
};

export default DoctorDetail;
