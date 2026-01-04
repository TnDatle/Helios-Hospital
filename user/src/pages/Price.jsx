function Price() {
  return (
    <div className="price-page">

      {/* ======================== BANNER ======================== */}
      <div
        className="page-banner"
        style={{
            backgroundImage: 'url("/icons/hand-banner.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "90px 0",
            color: "#fff",
        }}
        >
        <div className="container">
            <div className="breadcrumb">
            <span>Trang chủ/</span><span> Bảng giá</span>
            </div>
            <h1 className="banner-title">BẢNG GIÁ</h1>
        </div>
        </div>


      {/* ======================== CONTENT ======================== */}
      <div className="container py-5">

        {/* ======= TIÊU ĐỀ ======= */}
        <h2 className="section-title">BẢNG GIÁ</h2>

        {/* ======= BẢNG GIÁ VIỆN PHÍ ======= */}
        <div className="price-table mb-5">
          <div className="price-header">GIÁ VIỆN PHÍ, BHYT</div>

          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>1. KHÁM BỆNH VIỆN PHÍ</td>
                <td className="text-end">50.600 đồng</td>
              </tr>
              <tr>
                <td>2. KHÁM BỆNH BHYT</td>
                <td className="text-end">50.600 đồng</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ======= THÔNG BÁO ======= */}
        <div className="text-center mb-4">
          <h4 className="fw-bold">
            BẢNG GIÁ ÁP DỤNG ĐỐI TƯỢNG BHYT, VIỆN PHÍ
          </h4>
          <p className="fst-italic">
            (Ban hành kèm theo NQ 399/NQ-HĐND ngày 28/08/2025 của Hội đồng nhân dân TP. HCM)
          </p>
        </div>

        {/* ======= CÁC KHỐI XEM CHI TIẾT ======= */}
        <div className="price-box">
          <h5 className="price-box-title">Bảng giá áp dụng đối tượng khám bệnh, chữa bệnh</h5>
          <button className="detail-btn">Xem chi tiết</button>
        </div>

        <div className="price-box">
          <h5 className="price-box-title">
            Bảng giá dịch vụ kỹ thuật thực hiện bằng phương pháp vô cảm (gây tê) – chưa bao gồm thuốc & oxy
          </h5>
          <button className="detail-btn">Xem chi tiết</button>
        </div>

        {/* ======================= GIÁ DỊCH VỤ YÊU CẦU ======================= */}
        <h3 className="section-title mt-5">GIÁ DỊCH VỤ YÊU CẦU</h3>

        <h4 className="sub-section-title">I. DỊCH VỤ KHÁM BỆNH</h4>

        {/* ------- TRỤ SỞ CHÍNH ------- */}
        <h5 className="unit-title">Trụ sở chính</h5>

        <table className="table table-bordered mb-4">
          <tbody>
            <tr>
              <td>1. Khám bệnh chuyên khoa</td>
              <td className="text-end">150.000 đồng</td>
            </tr>
            <tr>
              <td>
                2. Phòng khám chuyên gia ( 001 – Giáo sư, Tiến sĩ, BS CKII)
              </td>
              <td className="text-end">250.000 đồng</td>
            </tr>
            <tr>
              <td>3. Phòng khám hẹn giờ</td>
              <td className="text-end">
                <div>Giá khám: 250.000 đồng</div>
                <div>Tư vấn chuyên sâu: 250.000 đồng</div>
              </td>
            </tr>
            <tr>
              <td>4. Khám bệnh ngoài giờ - Thứ 7, lễ, Tết</td>
              <td className="text-end">250.000 đồng</td>
            </tr>
          </tbody>
        </table>


        {/* ======================= II. DỊCH VỤ KỸ THUẬT ======================= */}
        <h4 className="sub-section-title">II. DỊCH VỤ KỸ THUẬT</h4>

        <div className="price-box">
          <h5 className="price-box-title">1. Bảng giá các dịch vụ khác</h5>
          <button className="detail-btn">Xem chi tiết</button>
        </div>

        <div className="price-box">
          <h5 className="price-box-title">
            2. Bảng giá khám chữa bệnh dịch vụ theo Quyết định Bệnh viện
          </h5>
          <button className="detail-btn">Xem chi tiết</button>
        </div>

        {/* ===== DANH MỤC CHI TIẾT ===== */}
        <h3 className="section-title mt-5">BẢNG GIÁ – VẬT TƯ Y TẾ & THUỐC</h3>

        <div className="list-detail">
          {[
            "DANH MỤC VẬT TƯ Y TẾ - HÓA CHẤT 2024",
            "DANH MỤC VẬT TƯ Y TẾ - HÓA CHẤT XÉT NGHIỆM 2024",
            "DANH MỤC VẬT TƯ Y TẾ - HÓA CHẤT 2025",
            "DANH MỤC VẬT TƯ Y TẾ - HÓA CHẤT XÉT NGHIỆM 2025",
            "DANH MỤC THUỐC 2024",
            "DANH MỤC THUỐC 2025",
          ].map((item, index) => (
            <div key={index} className="price-box">
              <h5 className="price-box-title">{item}</h5>
              <button className="detail-btn">Xem chi tiết</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Price;
