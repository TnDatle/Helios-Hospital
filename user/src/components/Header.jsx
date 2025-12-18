import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="helios-header">

      {/* ===== TOP HEADER ===== */}
      <div className="top-header container d-flex justify-content-between align-items-center">
        
        <Link to="/" className="text-decoration-none text-dark">
          <div className="d-flex align-items-center header-brand">
            <img src="/icons/logo1.png" className="hospital-logo" alt="logo" />

            <div className="ms-2">
              <span className="dept-text">SỞ Y TẾ THÀNH PHỐ HỒ CHÍ MINH</span>
              <h2 className="hospital-name">BỆNH VIỆN HELIOS VIỆT NAM</h2>
            </div>
          </div>
        </Link>

        <nav className="top-menu d-flex align-items-center gap-4">
          <Link to="/gioi-thieu">Giới thiệu</Link>
          <Link to="/truyen-thong">Truyền thông</Link>
          <Link to="/dao-tao">Đào tạo</Link>
          <Link to="/van-ban">Văn bản</Link>
          <Link to="/tuyen-dung">Tuyển dụng</Link>
          <Link to="/lien-he">Liên hệ</Link>

          {/* Search icon */}
          <i className="bi bi-search fs-5"></i>
        </nav>
      </div>

      {/* ===== BOTTOM NAV ===== */}
      <div className="bottom-nav">
        <div className="container d-flex justify-content-between align-items-center">
          
          <Link to="/tim-bac-si" className="nav-item text-decoration-none">
            <img src="/icons/doctor.jpg" className="nav-icon" alt="" />
            <span>Tìm bác sĩ</span>
          </Link>

          <Link to="/lich-kham" className="nav-item text-decoration-none">
            <img src="/icons/calendar.png" className="nav-icon" alt="" />
            <span>Lịch khám bệnh</span>
          </Link>

          <Link to="/gio-kham" className="nav-item text-decoration-none">
            <img src="/icons/clock.webp" className="nav-icon" alt="" />
            <span>Giờ khám bệnh</span>
          </Link>

          <Link to="/dat-lich" className="nav-item text-decoration-none">
            <img src="/icons/booking.png" className="nav-icon" alt="" />
            <span>Đặt hẹn khám</span>
          </Link>

          <Link to="/bang-gia" className="nav-item text-decoration-none">
            <img src="/icons/price.png" className="nav-icon" alt="" />
            <span>Bảng giá</span>
          </Link>

          <div className="nav-hotline">
            CSKH: <strong>0999 099 099</strong>
          </div>
        </div>
      </div>

    </header>
  );
}

export default Header;
