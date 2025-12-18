function Footer() {
  return (
    <footer className="helios-footer">

      <div className="container footer-top">

        <div className="row">

          {/* COLUMN 1 */}
          <div className="col-md-3 mb-4">
            <h5 className="footer-title">HƯỚNG DẪN</h5>
            <ul className="footer-list">
              <li>Quyền và nghĩa vụ của người bệnh</li>
              <li>Hướng dẫn xe buýt</li>
              <li>Lịch khám bệnh</li>
              <li>Hướng dẫn khám bệnh</li>
              <li>Hướng dẫn nhập viện</li>
              <li>Chuẩn bị phẫu thuật</li>
              <li>Hướng dẫn xuất viện</li>
              <li>Hướng dẫn thăm bệnh</li>
            </ul>
          </div>

          {/* COLUMN 2 */}
          <div className="col-md-3 mb-4">
            <h5 className="footer-title">TRUYỀN THÔNG</h5>
            <ul className="footer-list">
              <li>Thông báo</li>
              <li>Thông tin báo chí</li>
              <li>Cảm nhận khách hàng</li>
              <li>Giáo dục sức khỏe</li>
              <li>Câu lạc bộ người bệnh</li>
              <li>Thư viện ảnh</li>
              <li>Thư viện video</li>
              <li>Hoạt động bệnh viện</li>
            </ul>
          </div>

          {/* COLUMN 3 */}
          <div className="col-md-3 mb-4">
            <h5 className="footer-title">THÔNG TIN</h5>
            <ul className="footer-list">
              <li>Giới thiệu bệnh viện</li>
              <li>Các chuyên khoa</li>
              <li>Báo cáo khoa học</li>
              <li>Dịch vụ</li>
              <li>Góc nhân ái</li>
              <li>Liên hệ - Góp ý</li>
            </ul>
          </div>

          {/* COLUMN 4 */}
          <div className="col-md-3 mb-4">
            <h5 className="footer-title">ĐĂNG KÝ NHẬN TIN</h5>
            <p>Nhập email để nhận thông tin mới nhất từ Bệnh viện Helios:</p>

            <div className="footer-email-box d-flex">
              <input type="email" placeholder="Email của bạn…" />
              <button>Gửi</button>
            </div>

            <div className="footer-social mt-3">
              <img src="/icons/facebook.png" className="social-icon" alt="" />
              <img src="/icons/youtube.png" className="social-icon" alt="" />
            </div>
          </div>

        </div>
      </div>


      {/* BOTTOM COPY SECTION */}
      <div className="footer-bottom">
        <div className="container">

          <p>
            Copyright © 2025 <strong>Bệnh Viện Helios Việt Nam</strong>
          </p>

          <p>
            <i className="bi bi-geo-alt-fill"></i>
            <strong> Trụ sở chính: </strong> 338 Điện Biên Phủ, Phường Vườn Lài, TP. Hồ Chí Minh
          </p>

          <p>
            <i className="bi bi-geo-alt-fill"></i>
            <strong> Built by: </strong> Lê Tấn Đạt
          </p>

        </div>
      </div>

    </footer>
  );
}

export default Footer;
