function Time() {
  return (
    <div className="time-page">

      {/* ====== BANNER ====== */}
      <div
        className="time-banner"
        style={{ backgroundImage: "url('/icons/time-banner.jpg')" }}
        >
        <div className="banner-overlay">
            <h1 className="banner-title">GIỜ KHÁM BỆNH</h1>
        </div>
      </div>

      {/* ====== BREADCRUMB ====== */}
      <div className="container mt-3">
        <div className="breadcrumb">
          <span>Trang chủ/ Giờ khám bệnh</span>
        </div>
      </div>

      {/* ====== MAIN CONTENT ====== */}
      <div className="container time-content">

        <h2 className="section-title">GIỜ KHÁM BỆNH</h2>

        <div className="row mt-5">

          {/* COLUMN 1: TRỤ SỞ CHÍNH */}
          <div className="col-md-6 time-block">

            <h3 className="time-location">TRỤ SỞ CHÍNH</h3>
            <p className="time-sub">(Từ thứ 2 đến thứ 6)</p>

            <p><strong>Sáng:</strong> từ 06:00 đến 11:30</p>
            <p><strong>Chiều:</strong> từ 13:00 đến 16:00</p>

          </div>

          {/* COLUMN 2: KHU KỸ THUẬT CAO */}
          <div className="col-md-6 time-block">

            <h3 className="time-location">KHÁM NGOÀI GIỜ </h3>
            <p className="time-sub">(Thứ 7, Lễ tết)</p>

            <p><strong>Sáng:</strong> từ 06:00 đến 11:30</p>
            <p><strong>TIẾP NHẬN CẤP CỨU 24/7</strong></p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Time;
