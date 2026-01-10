function NoiSoiNieu() {
  return (
    <div className="department-container">

      <h2 className="department-title">NỘI SOI NIỆU</h2>
      <img src="/services/noisoinieu.jpg" className="department-image" alt="" />

      {/* I. GIỚI THIỆU */}
      <h3 className="department-section-title">I. Giới thiệu</h3>

      <p className="department-desc">
        Khoa Nội soi Niệu chuyên thực hiện các kỹ thuật nội soi chẩn đoán và điều trị các bệnh lý 
        hệ tiết niệu như bàng quang, niệu đạo, niệu quản và thận. Nội soi niệu giúp đánh giá chính xác 
        tổn thương và can thiệp điều trị ít xâm lấn.
      </p>

      <p className="department-desc">
        Khoa ứng dụng các hệ thống nội soi hiện đại, hỗ trợ điều trị sỏi tiết niệu, u bàng quang, 
        hẹp niệu đạo và các bệnh lý tiết niệu phức tạp với độ an toàn cao.
      </p>

      {/* Quy trình */}
      <h3 className="department-section-title">Quy trình thăm khám – nội soi</h3>

      <ul className="department-list">
        <li><strong>Bước 1:</strong> Khám lâm sàng và đánh giá triệu chứng tiết niệu.</li>
        <li><strong>Bước 2:</strong> Thực hiện xét nghiệm nước tiểu và chẩn đoán hình ảnh.</li>
        <li><strong>Bước 3:</strong> Chỉ định nội soi niệu phù hợp.</li>
        <li><strong>Bước 4:</strong> Chuẩn bị và tiến hành nội soi.</li>
        <li><strong>Bước 5:</strong> Can thiệp điều trị nếu phát hiện bất thường.</li>
        <li><strong>Bước 6:</strong> Theo dõi và hướng dẫn chăm sóc sau thủ thuật.</li>
      </ul>

      {/* II. KỸ THUẬT */}
      <h3 className="department-section-title">II. Kỹ thuật & dịch vụ chuyên môn</h3>

      <ul className="department-list">
        <li>Nội soi bàng quang chẩn đoán và sinh thiết.</li>
        <li>Nội soi niệu đạo.</li>
        <li>Nội soi niệu quản – thận.</li>
        <li>Tán sỏi tiết niệu qua nội soi.</li>
        <li>Điều trị hẹp niệu đạo.</li>
        <li>Can thiệp u bàng quang qua nội soi.</li>
      </ul>

      <p className="department-desc">
        Nội soi niệu là phương pháp hiện đại giúp điều trị hiệu quả các bệnh lý tiết niệu, 
        giảm đau, phục hồi nhanh và hạn chế tối đa biến chứng.
      </p>
    </div>
  );
}

export default NoiSoiNieu;
