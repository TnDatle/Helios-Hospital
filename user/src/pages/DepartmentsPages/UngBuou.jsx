function UngBuou() {
  return (
    <div className="department-container">

      <h2 className="department-title">UNG BƯỚU</h2>
      <img src="/services/ungbuou.jpeg" className="department-image" alt="" />

      {/* I. GIỚI THIỆU */}
      <h3 className="department-section-title">I. Giới thiệu</h3>

      <p className="department-desc">
        Khoa Ung Bướu chuyên tiếp nhận, chẩn đoán và điều trị các bệnh lý ung thư ở nhiều
        cơ quan khác nhau như ung thư đường tiêu hóa, ung thư gan, ung thư phổi,
        ung thư vú, ung thư tuyến giáp và các bệnh lý ác tính khác. Khoa thực hiện
        điều trị theo phác đồ chuyên môn, cá thể hóa cho từng người bệnh.
      </p>

      <p className="department-desc">
        Với đội ngũ bác sĩ có trình độ chuyên môn cao cùng hệ thống trang thiết bị
        hiện đại, khoa Ung Bướu hướng đến mục tiêu phát hiện sớm, điều trị hiệu quả
        và nâng cao chất lượng sống cho người bệnh trong suốt quá trình điều trị.
      </p>

      {/* Quy trình khám chữa bệnh */}
      <h3 className="department-section-title">Quy trình thăm khám – điều trị</h3>

      <ul className="department-list">
        <li><strong>Bước 1:</strong> Khám lâm sàng, khai thác tiền sử và triệu chứng.</li>
        <li><strong>Bước 2:</strong> Chỉ định xét nghiệm máu, dấu ấn ung thư cần thiết.</li>
        <li><strong>Bước 3:</strong> Thực hiện chẩn đoán hình ảnh: siêu âm, CT-scan, MRI.</li>
        <li><strong>Bước 4:</strong> Sinh thiết, giải phẫu bệnh để xác định chẩn đoán.</li>
        <li><strong>Bước 5:</strong> Hội chẩn chuyên khoa, xây dựng phác đồ điều trị.</li>
        <li><strong>Bước 6:</strong> Theo dõi điều trị và tái khám định kỳ.</li>
      </ul>

      {/* II. ĐIỀU TRỊ */}
      <h3 className="department-section-title">II. Điều trị & kỹ thuật chuyên môn</h3>

      <ul className="department-list">
        <li>Điều trị ung thư bằng phương pháp nội khoa và can thiệp.</li>
        <li>Hóa trị theo phác đồ chuẩn.</li>
        <li>Theo dõi và chăm sóc giảm nhẹ cho bệnh nhân ung thư.</li>
        <li>Phối hợp phẫu thuật ung thư với các chuyên khoa liên quan.</li>
        <li>Tư vấn, theo dõi và quản lý bệnh nhân ung thư lâu dài.</li>
      </ul>

      <p className="department-desc">
        Khoa Ung Bướu luôn chú trọng điều trị toàn diện, kết hợp giữa y học hiện đại
        và chăm sóc tâm lý nhằm mang lại hiệu quả điều trị tối ưu và sự an tâm
        cho người bệnh.
      </p>
    </div>
  );
}

export default UngBuou;
