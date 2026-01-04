import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuth } from "../auth/useAuth";
import { useToast } from "../components/ToastContext";

function Header() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // LẤY USER TỪ AUTH CONTEXT
  const { user } = useAuth();

  const handleLogout = async () => {
    const ok = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");

    if (!ok) return;

    await signOut(auth);
    showToast("Đăng xuất thành công");
    navigate("/dang-nhap");
  };

  return (
    <header className="helios-header">
      {/* ===== TOP HEADER ===== */}
      <div className="top-header container d-flex justify-content-between align-items-center">
        <Link to="/" className="text-decoration-none text-dark">
          <div className="d-flex align-items-center header-brand">
            <img
              src="/icons/logo1.png"
              className="hospital-logo"
              alt="logo"
            />

            <div className="ms-2">
              <span className="dept-text">
                SỞ Y TẾ THÀNH PHỐ HỒ CHÍ MINH
              </span>
              <h2 className="hospital-name">
                BỆNH VIỆN HELIOS VIỆT NAM
              </h2>
            </div>
          </div>
        </Link>

        <nav className="top-menu d-flex align-items-center gap-4">
          <div className="dropdown nav-dropdown">
            <span
              className="nav-link-custom dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Giới thiệu
            </span>

            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item" to="/tong-quan">
                  Tổng quan bệnh viện
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/co-cau-to-chuc">
                  Cơ cấu tổ chức
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/chinh-sach-chat-luong">
                  Chính sách chất lượng
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/duong-day-nong">
                  Đường dây nóng
                </Link>
              </li>
            </ul>
          </div>
          <Link to="/truyen-thong" className="nav-link-custom">Truyền thông</Link>
          <Link to="/dao-tao" className="nav-link-custom">Đào tạo</Link>
          <Link to="/van-ban" className="nav-link-custom">Văn bản</Link>
          <Link to="/tuyen-dung" className="nav-link-custom">Tuyển dụng</Link>
          <Link to="/lien-he" className="nav-link-custom">Liên hệ</Link>

          <i className="bi bi-search fs-5"></i>

          {/* ===== LOGIN AREA ===== */}
          {!user ? (
            <Link
              to="/dang-nhap"
              className="btn btn-outline-primary btn-sm"
            >
              Đăng nhập
            </Link>
          ) : (
            <div className="dropdown account-dropdown">
            <button
              className="btn btn-outline-secondary btn-sm dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {user.email}
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link className="dropdown-item" to="/ho-so-benh-nhan">
                  Hồ sơ bệnh nhân
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/my-appointments">
                  Lịch hẹn của tôi
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
          )}
        </nav>
      </div>

      {/* ===== BOTTOM NAV ===== */}
      <div className="bottom-nav">
        <div className="container d-flex justify-content-between align-items-center">
          <Link
            to="/tim-bac-si"
            className="nav-item text-decoration-none"
          >
            <img
              src="/icons/doctor.jpg"
              className="nav-icon"
              alt=""
            />
            <span>Tìm bác sĩ</span>
          </Link>

          <Link
            to="/lich-kham-benh"
            className="nav-item text-decoration-none"
          >
            <img
              src="/icons/calendar.png"
              className="nav-icon"
              alt=""
            />
            <span>Lịch khám bệnh</span>
          </Link>

          <Link
            to="/gio-kham"
            className="nav-item text-decoration-none"
          >
            <img
              src="/icons/clock.webp"
              className="nav-icon"
              alt=""
            />
            <span>Giờ khám bệnh</span>
          </Link>

          <Link
            to="/dat-lich"
            className="nav-item text-decoration-none"
          >
            <img
              src="/icons/booking.png"
              className="nav-icon"
              alt=""
            />
            <span>Đặt hẹn khám</span>
          </Link>

          <Link
            to="/bang-gia"
            className="nav-item text-decoration-none"
          >
            <img
              src="/icons/price.png"
              className="nav-icon"
              alt=""
            />
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
