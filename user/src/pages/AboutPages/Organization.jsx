function Organization() {
  return (
    <div className="about-page">

      {/* ===== BANNER ===== */}
      <div
        className="about-banner"
        style={{ backgroundImage: "url('/icons/hand-banner.jpg')" }}
      >
        <div className="banner-overlay"></div>

        <div className="banner-content container">
          <div className="breadcrumb">
            <span>Giới thiệu / Cơ cấu tổ chức</span>
          </div>
          <h1 className="banner-title">CƠ CẤU TỔ CHỨC</h1>
        </div>
      </div>

      {/* ===== SƠ ĐỒ TỔ CHỨC ===== */}
      <div className="organization-page container">
        <h2 className="org-title">
          SƠ ĐỒ TỔ CHỨC BỆNH VIỆN HELIOS VIỆT NAM
        </h2>

        {/* ================= GIÁM ĐỐC ================= */}
        <div className="org-level org-top">
          <div className="org-column no-line">
            <div className="org-box main">
              <strong>GIÁM ĐỐC BỆNH VIỆN</strong><br />
              PGS.TS.BS. Lê Tấn Đạt
            </div>
          </div>
        </div>

        {/* ================= PHÓ GIÁM ĐỐC ================= */}
        <div className="org-level pho-giam-doc">
          <div className="org-column">
            <div className="org-box pho">
              <strong>Phó Giám đốc</strong><br />
              Phụ trách Hành chính<br />
              TS.BS. Lê Thanh Thảo
            </div>
          </div>

          <div className="org-column">
            <div className="org-box pho">
              <strong>Phó Giám đốc</strong><br />
              Phụ trách Điều trị<br />
              TS.BS. Thái Thanh Phong
            </div>
          </div>

          <div className="org-column">
            <div className="org-box pho">
              <strong>Phó Giám đốc</strong><br />
              Phụ trách Chuyên môn<br />
              TS.BS. Nguyễn Lê Minh Thiện
            </div>
          </div>
        </div>

        {/* ================= CÁC KHỐI ================= */}
        <div className="org-level">

          {/* ===== PHÒNG CHỨC NĂNG ===== */}
          <div className="org-column">
            <div className="org-box section">PHÒNG CHỨC NĂNG</div>
            <div className="org-box sub">Phòng Tổ chức – Hành chính</div>
            <div className="org-box sub">Phòng Kế hoạch Tổng hợp</div>
            <div className="org-box sub">Phòng Tài chính – Kế toán</div>
            <div className="org-box sub">Phòng Điều dưỡng</div>
            <div className="org-box sub">Phòng Công nghệ Thông tin</div>
            <div className="org-box sub">Phòng Quản lý Chất lượng</div>
            <div className="org-box sub">Phòng Công tác Xã hội</div>
          </div>

          {/* ===== KHỐI LÂM SÀNG ===== */}
          <div className="org-column">
            <div className="org-box section">KHỐI LÂM SÀNG</div>
            <div className="org-box sub">Khoa Ngoại Tổng Quát</div>
            <div className="org-box sub">Khoa Ngoại Tiết Niệu</div>
            <div className="org-box sub">Khoa Tim Mạch &amp; Mạch Máu</div>
            <div className="org-box sub">Khoa Ung Bướu</div>
            <div className="org-box sub">Khoa Lọc Máu - Nội Thận</div>
          </div>

          {/* ===== KHỐI CẬN LÂM SÀNG ===== */}
          <div className="org-column">
            <div className="org-box section">KHỐI CẬN LÂM SÀNG</div>
            <div className="org-box sub">Khoa Xét nghiệm</div>
            <div className="org-box sub">Khoa Chẩn đoán Hình ảnh</div>
            <div className="org-box sub">Khoa Nội soi</div>
            <div className="org-box sub">Giải phẫu bệnh</div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Organization;
