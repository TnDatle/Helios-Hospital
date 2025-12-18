import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaInfoCircle, FaCalendarAlt } from "react-icons/fa";

const API_URL = "http://localhost:5000/api/doctors";

const DoctorDetail = () => {
  const { department, id } = useParams();
  const location = useLocation();

  // ===== ƯU TIÊN DATA TỪ TRANG TRƯỚC =====
  const [doctor, setDoctor] = useState(() => {
    return location.state
      ? {
          name: location.state.name || location.state.DocName || "",
          role: location.state.role || "",
          specialty: location.state.specialty || "",
          schedule: {
            day: location.state.weekday || "",
            time: [
              location.state.shiftmorning,
              location.state.shiftafternoon,
            ]
              .filter(Boolean)
              .join(" | "),
            room: location.state.room || "",
            location: "Khu Khám bệnh Trụ sở chính",
          },
        }
      : null;
  });

  const [loading, setLoading] = useState(!doctor);
  const [error, setError] = useState("");

  /**
   * =====================================================
   * FETCH DETAIL (CHỈ KHI CHƯA CÓ DATA)
   * =====================================================
   */
  useEffect(() => {
    if (doctor) return; // không fetch lại

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
          setDoctor(json.data);
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

  // ===== LOADING =====
  if (loading) {
    return <p className="loading">Đang tải thông tin bác sĩ…</p>;
  }

  // ===== ERROR =====
  if (error || !doctor) {
    return <p className="error-text">{error || "Dữ liệu không tồn tại"}</p>;
  }

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
            <p>
              <strong>Chuyên khoa:</strong> {doctor.specialty}
            </p>
          </div>
        </div>
      </div>

      {/* ===== SCHEDULE ===== */}
      <div className="doctor-section">
        <h3 className="section-title">Lịch khám bệnh</h3>

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
            {doctor.schedule?.day ? (
              <tr>
                <td>{doctor.schedule.day}</td>
                <td>{doctor.schedule.time}</td>
                <td>{doctor.schedule.room}</td>
                <td>{doctor.schedule.location}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan="4" className="empty">
                  Chưa có lịch khám
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <p className="note">
          <strong>Ghi chú:</strong> Lịch khám có thể thay đổi theo lịch công tác
          của bác sĩ, vui lòng theo dõi cập nhật mới nhất.
        </p>
      </div>

      {/* ===== BOOKING ===== */}
      <div className="doctor-section booking">
        <h3>
          <FaCalendarAlt /> ĐẶT HẸN KHÁM BỆNH VỚI {doctor.name}
        </h3>
        <p>
          Quý khách sau khi đăng ký đặt hẹn thành công, vui lòng chờ nhân viên
          CSKH liên hệ xác nhận qua điện thoại hoặc Zalo{" "}
          <strong>0999 099 099</strong>.
        </p>
      </div>
    </div>
  );
};

export default DoctorDetail;
