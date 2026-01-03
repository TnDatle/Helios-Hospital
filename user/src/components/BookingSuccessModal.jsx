import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

export default function BookingSuccessModal({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleClose = () => {
    onClose();       // đóng modal
    navigate("/");   // quay về trang chủ
  };

  return createPortal(
    <div className="success-overlay">
      <div className="success-box">
        <div className="success-icon">✓</div>

        <h3>Đặt lịch thành công</h3>

        <p>
          Thông tin đặt lịch khám của quý khách đã được ghi nhận trên hệ thống.
        </p>

        <p>
          Một tin nhắn xác nhận sẽ được gửi đến số điện thoại đã đăng ký
          trong thời gian sớm nhất.
        </p>

        <p className="success-note">
          Vui lòng kiểm tra tin nhắn để nắm rõ thông tin lịch khám.
        </p>

        <button
          className="booking-btn success"
          onClick={handleClose}
        >
          Đã hiểu
        </button>
      </div>
    </div>,
    document.body
  );
}
