import { useState } from "react";
import BookingSuccessModal from "../../components/BookingSuccessModal";

export default function StepConfirm({ data, onBack }) {
  const { department, schedule, doctor } = data;
  const [showSuccess, setShowSuccess] = useState(false);

  const SHIFT_LABEL = {
    MORNING: "Ca sáng",
    AFTERNOON: "Ca chiều",
  };

  const SHIFT_TIME = {
    MORNING: "06:30 – 11:30",
    AFTERNOON: "13:00 – 16:00",
  };

  return (
    <>
      <h4>Xác nhận đặt lịch</h4>

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

        <p className="note">
          <strong>Lưu ý:</strong> Thứ tự khám cụ thể sẽ được sắp xếp tại bệnh viện
          trong ca đã đăng ký.
        </p>
      </div>

      <div className="booking-actions">
        <button className="booking-btn" onClick={onBack}>
          Quay lại
        </button>

        <button
          className="booking-btn success"
          onClick={() => {
            console.log("CONFIRM CLICK");
            setShowSuccess(true);
          }}
        >
          Xác nhận đặt lịch
        </button>
      </div>

     <BookingSuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />

    </>
  );
}
