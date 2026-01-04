function XetNghiem() {
  return (
    <div className="department-container">

      {/* HEADER */}
      <h2 className="department-title">XÉT NGHIỆM</h2>
      <img src="/services/xetnghiem.jpg" className="department-image" alt="" />

      {/* GIỚI THIỆU NGẮN */}
      <p className="department-desc">
        Khoa Xét Nghiệm thực hiện các xét nghiệm cận lâm sàng phục vụ cho công tác
        chẩn đoán, theo dõi và đánh giá hiệu quả điều trị. Kết quả xét nghiệm đóng
        vai trò quan trọng trong việc hỗ trợ bác sĩ đưa ra chẩn đoán chính xác
        và kịp thời.
      </p>

      {/* DANH SÁCH LĨNH VỰC XÉT NGHIỆM */}
      <h3 className="department-section-title">Các lĩnh vực xét nghiệm</h3>

      <div className="other-department-grid">
        <div className="other-department-item">
          <h4>Huyết học</h4>
          <p>Xét nghiệm công thức máu, đông máu và các bệnh lý về máu.</p>
        </div>

        <div className="other-department-item">
          <h4>Sinh hóa</h4>
          <p>Đánh giá chức năng gan, thận, mỡ máu, đường huyết và điện giải.</p>
        </div>

        <div className="other-department-item">
          <h4>Vi sinh</h4>
          <p>Phát hiện vi khuẩn, virus, nấm và các tác nhân gây bệnh.</p>
        </div>

        <div className="other-department-item">
          <h4>Miễn dịch</h4>
          <p>Xét nghiệm miễn dịch, dấu ấn ung thư và các bệnh lý tự miễn.</p>
        </div>

        <div className="other-department-item">
          <h4>Nước tiểu</h4>
          <p>Đánh giá các bệnh lý thận, tiết niệu và rối loạn chuyển hóa.</p>
        </div>

        <div className="other-department-item">
          <h4>Sinh học phân tử</h4>
          <p>Xét nghiệm chuyên sâu phục vụ chẩn đoán chính xác và sàng lọc bệnh.</p>
        </div>
      </div>

      {/* DỊCH VỤ HỖ TRỢ */}
      <h3 className="department-section-title">Vai trò trong khám chữa bệnh</h3>

      <ul className="department-list">
        <li>Hỗ trợ chẩn đoán bệnh lý chính xác.</li>
        <li>Theo dõi diễn tiến và hiệu quả điều trị.</li>
        <li>Phát hiện sớm các bệnh lý nguy cơ cao.</li>
        <li>Cung cấp dữ liệu quan trọng cho các chuyên khoa lâm sàng.</li>
      </ul>

      <p className="department-desc">
        Khoa Xét Nghiệm luôn tuân thủ quy trình kiểm soát chất lượng nghiêm ngặt,
        đảm bảo độ chính xác, tin cậy và thời gian trả kết quả nhanh chóng nhằm
        phục vụ tốt nhất cho người bệnh.
      </p>
    </div>
  );
}

export default XetNghiem;
