function NoiThan() {
  return (
    <div className="department-container">

      <h2 className="department-title">LỌC MÁU - NỘI THẬN</h2>
      <img src="/services/noithan.jpg" className="department-image" alt="" />

      {/* I. GIỚI THIỆU */}
      <h3 className="department-section-title">I. Giới thiệu</h3>

      <p className="department-desc">
        Khoa Lọc Máu – Nội Thận chuyên tiếp nhận, chẩn đoán và điều trị các bệnh lý
        liên quan đến thận và đường tiết niệu như viêm cầu thận, suy thận cấp và mạn,
        hội chứng thận hư, tăng huyết áp do thận và các rối loạn chức năng thận khác.
      </p>

      <p className="department-desc">
        Khoa thực hiện quản lý và theo dõi lâu dài cho bệnh nhân thận mạn, kết hợp
        điều trị nội khoa và các phương pháp lọc máu hiện đại nhằm duy trì và cải thiện
        chất lượng sống cho người bệnh.
      </p>

      {/* Quy trình khám chữa bệnh */}
      <h3 className="department-section-title">Quy trình thăm khám – điều trị</h3>

      <ul className="department-list">
        <li><strong>Bước 1:</strong> Khám lâm sàng, đánh giá triệu chứng và tiền sử bệnh.</li>
        <li><strong>Bước 2:</strong> Xét nghiệm máu, nước tiểu đánh giá chức năng thận.</li>
        <li><strong>Bước 3:</strong> Siêu âm thận – tiết niệu và các cận lâm sàng cần thiết.</li>
        <li><strong>Bước 4:</strong> Chẩn đoán mức độ bệnh thận và nguyên nhân.</li>
        <li><strong>Bước 5:</strong> Lập kế hoạch điều trị nội khoa hoặc chỉ định lọc máu.</li>
        <li><strong>Bước 6:</strong> Theo dõi điều trị, tái khám và quản lý lâu dài.</li>
      </ul>

      {/* II. ĐIỀU TRỊ */}
      <h3 className="department-section-title">II. Điều trị & kỹ thuật chuyên môn</h3>

      <ul className="department-list">
        <li>Điều trị các bệnh lý thận cấp và mạn tính.</li>
        <li>Quản lý và điều trị suy thận mạn giai đoạn cuối.</li>
        <li>Lọc máu chu kỳ cho bệnh nhân suy thận.</li>
        <li>Điều chỉnh rối loạn điện giải và toan kiềm.</li>
        <li>Điều trị tăng huyết áp và biến chứng do bệnh thận.</li>
        <li>Tư vấn chế độ dinh dưỡng và sinh hoạt cho bệnh nhân thận.</li>
      </ul>

      <p className="department-desc">
        Khoa Lọc Máu – Nội Thận luôn chú trọng điều trị toàn diện, an toàn và theo dõi
        sát người bệnh, góp phần nâng cao hiệu quả điều trị và cải thiện chất lượng
        cuộc sống cho bệnh nhân mắc bệnh thận mạn tính.
      </p>
    </div>
  );
}

export default NoiThan;
