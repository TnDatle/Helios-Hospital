export default function StepConfirm({ data, onBack }) {
  const { department, schedule, doctor } = data;
  const stt = schedule.current + 1;

  return (
    <>
      <h4>Xác nhận đặt lịch</h4>

      <div className="booking-summary">
        <p><strong>Khoa:</strong> {department.name}</p>
        <p><strong>Bác sĩ:</strong> {doctor.name}</p>
        <p><strong>Ngày:</strong> {schedule.date}</p>
        <p><strong>Ca:</strong> {schedule.session}</p>
        <p><strong>Phòng:</strong> {schedule.room}</p>
        <p><strong>STT dự kiến:</strong> {stt}</p>
      </div>

      <div className="booking-actions">
        <button className="booking-btn" onClick={onBack}>
          Quay lại
        </button>
        <button
          className="booking-btn success"
          onClick={() => {
            console.log("BOOKING:", data);
            alert("Đặt lịch thành công (mock)");
          }}
        >
          Xác nhận
        </button>
      </div>
    </>
  );
}
