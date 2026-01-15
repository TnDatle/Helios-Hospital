import { useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { addPatient } from "../../API/patient-api";
import { createAppointment } from "../../API/appointment-api";
import BookingSuccessModal from "../../components/BookingSuccessModal";

export default function StepConfirm({ data, onBack }) {
  const { user } = useAuth();
  const { department, doctor, schedule, patient } = data;

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const SHIFT_LABEL = {
    MORNING: "Ca sáng",
    AFTERNOON: "Ca chiều",
  };

  const SHIFT_TIME = {
    MORNING: "06:30 – 11:30",
    AFTERNOON: "13:00 – 16:00",
  };

  /* =====================
     CONFIRM HANDLER
  ===================== */
  const handleConfirm = async () => {
    try {
      setLoading(true);

      let patientId = patient.id;

      // ===== 1. LƯU PATIENT NẾU CHƯA CÓ =====
      if (!patientId) {
        patientId = await addPatient({
          ...patient,
          ownerUid: user.uid,
        });
      }

      // ===== 2. TẠO APPOINTMENT =====
      await createAppointment({
        userUid: user.uid,
        patientId,
        doctorId: doctor.id,
        departmentId: department.id,
        schedule: {
          date: schedule.date,
          shiftId: schedule.shiftId,
          room: schedule.room,
        },
      });

      // ===== 3. SUCCESS =====
      setShowSuccess(true);
    } catch (err) {
      console.error("Create appointment error:", err);
      alert("Đặt lịch thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4>Xác nhận đặt lịch</h4>

      {/* ===== THÔNG TIN KHÁM ===== */}
      <div className="booking-summary">
        <p>
          <strong>Khoa:</strong> {department.name}
        </p>

        <p>
          <strong>Bác sĩ:</strong> {doctor.name}
        </p>

        <p>
          <strong>Ngày khám:</strong>{" "}
          {new Date(schedule.date).toLocaleDateString("vi-VN")}
        </p>

        <p>
          <strong>Ca khám:</strong> {SHIFT_LABEL[schedule.shiftId]}
        </p>

        <p>
          <strong>Giờ dự kiến:</strong> {SHIFT_TIME[schedule.shiftId]}
        </p>

        <p>
          <strong>Phòng khám:</strong> {schedule.room}
        </p>
      </div>

      {/* ===== THÔNG TIN NGƯỜI KHÁM ===== */}
      <div className="booking-summary">
        <h5>Thông tin người khám</h5>

        <p>
          <strong>Họ và tên:</strong> {patient.fullName}
        </p>

        <p>
          <strong>Ngày sinh:</strong>{" "}
          {new Date(patient.dob).toLocaleDateString("vi-VN")}
        </p>

        <p>
          <strong>Giới tính:</strong>{" "}
          {patient.gender === "MALE"
            ? "Nam"
            : patient.gender === "FEMALE"
            ? "Nữ"
            : "Khác"}
        </p>

        <p>
          <strong>Số điện thoại:</strong> {patient.phone}
        </p>

        {patient.cccd && (
          <p>
            <strong>CCCD:</strong> {patient.cccd}
          </p>
        )}

        {patient.bhyt && (
          <p>
            <strong>BHYT:</strong> {patient.bhyt}
          </p>
        )}

        <p>
          <strong>Địa chỉ:</strong>{" "}
          {patient.address?.detail}
          {patient.address?.commune &&
            `, ${patient.address.commune}`}
          {patient.address?.province &&
            `, ${patient.address.province}`}
        </p>
      </div>

      <p className="note">
        <strong>Lưu ý:</strong> Thứ tự khám cụ thể sẽ được sắp xếp tại bệnh viện
        trong ca đã đăng ký.
      </p>

      {/* ===== ACTIONS ===== */}
      <div className="booking-actions">
        <button
          className="booking-btn"
          onClick={onBack}
          disabled={loading}
        >
          Quay lại
        </button>

        <button
          className="booking-btn success"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Đang đặt lịch..." : "Xác nhận đặt lịch"}
        </button>
      </div>

      {/* ===== MODAL ===== */}
      <BookingSuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
