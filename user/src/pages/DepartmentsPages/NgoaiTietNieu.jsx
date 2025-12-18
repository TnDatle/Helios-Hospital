function NgoaiTietNieu() {
  return (
    <div className="department-container">

      <h2 className="department-title">NGOẠI TIẾT NIỆU</h2>
      <img src="/services/tietnieu.jpg" className="department-image" alt="" />

      {/* I. GIỚI THIỆU */}
      <h3 className="department-section-title">I. Giới thiệu</h3>

      <p className="department-desc">
        Khoa Ngoại Tiết Niệu chuyên tiếp nhận, chẩn đoán và điều trị các bệnh lý liên quan đến 
        hệ tiết niệu – sinh dục như sỏi thận, sỏi niệu quản, phì đại tuyến tiền liệt, viêm đường 
        tiết niệu, bệnh lý nam khoa và ung thư hệ tiết niệu. Khoa sở hữu nhiều kỹ thuật điều trị ít 
        xâm lấn, giúp giảm đau, rút ngắn thời gian nằm viện.
      </p>

      <p className="department-desc">
        Khoa được trang bị máy tán sỏi Laser, hệ thống nội soi ống mềm, nội soi sau phúc mạc và các 
        thiết bị chẩn đoán hình ảnh tiên tiến nhằm nâng cao hiệu quả trong việc phát hiện sớm và điều trị 
        bệnh lý tiết niệu phức tạp.
      </p>

      {/* Quy trình khám chữa bệnh */}
      <h3 className="department-section-title">Quy trình thăm khám – điều trị</h3>

      <ul className="department-list">
        <li><strong>Bước 1:</strong> Khám lâm sàng, siêu âm thận – bàng quang.</li>
        <li><strong>Bước 2:</strong> Xét nghiệm nước tiểu, máu, PSA (nếu nghi ngờ tuyến tiền liệt).</li>
        <li><strong>Bước 3:</strong> Chỉ định CT-scan, X-quang hệ tiết niệu khi cần.</li>
        <li><strong>Bước 4:</strong> Lập phác đồ điều trị: nội khoa hoặc can thiệp.</li>
        <li><strong>Bước 5:</strong> Phẫu thuật/tán sỏi theo phương pháp tối ưu.</li>
        <li><strong>Bước 6:</strong> Theo dõi hậu phẫu và tái khám định kỳ.</li>
      </ul>

      {/* II. ĐIỀU TRỊ */}
      <h3 className="department-section-title">II. Điều trị & kỹ thuật chuyên môn</h3>

      <ul className="department-list">
        <li>Tán sỏi thận – niệu quản bằng Laser công suất cao.</li>
        <li>Nội soi ống mềm lấy sỏi.</li>
        <li>Điều trị phì đại tuyến tiền liệt bằng dao lưỡng cực.</li>
        <li>Điều trị viêm đường tiết niệu tái phát.</li>
        <li>Điều trị bệnh lý nam khoa: rối loạn cương, xuất tinh sớm.</li>
        <li>Điều trị ung thư thận – bàng quang – tuyến tiền liệt.</li>
      </ul>

      <p className="department-desc">
        Khoa luôn tiên phong ứng dụng kỹ thuật ít xâm lấn, đảm bảo hiệu quả cao, an toàn 
        và phục hồi nhanh cho người bệnh.
      </p>
    </div>
  );
}

export default NgoaiTietNieu;
