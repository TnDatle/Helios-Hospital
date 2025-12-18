function TimMachMachMau() {
  return (
    <div className="department-container">

      <h2 className="department-title">TIM MẠCH & MẠCH MÁU</h2>
      <img src="/services/tim.jpg" className="department-image" alt="" />

      {/* I. GIỚI THIỆU */}
      <h3 className="department-section-title">I. Giới thiệu</h3>

      <p className="department-desc">
        Khoa Tim Mạch & Mạch Máu cung cấp đầy đủ dịch vụ khám, tầm soát, chẩn đoán và điều trị 
        các bệnh tim mạch và bệnh lý hệ tuần hoàn. Với đội ngũ bác sĩ tim mạch được đào tạo 
        chuyên sâu, cùng hệ thống thiết bị hiện đại, khoa đáp ứng nhu cầu thăm khám đa dạng 
        từ các bệnh lý phổ biến đến phức tạp.
      </p>

      <p className="department-desc">
        Các bệnh lý thường gặp bao gồm tăng huyết áp, rối loạn nhịp tim, suy tim, thiếu máu cơ tim, 
        bệnh động mạch ngoại biên và suy giãn tĩnh mạch chi dưới. Ngoài ra, khoa còn triển khai nhiều 
        dịch vụ theo dõi tim mạch chuyên sâu cho người bệnh mãn tính.
      </p>

      {/* Quy trình khám chữa bệnh */}
      <h3 className="department-section-title">Quy trình thăm khám – điều trị</h3>

      <ul className="department-list">
        <li><strong>Bước 1:</strong> Khám lâm sàng và ghi nhận triệu chứng.</li>
        <li><strong>Bước 2:</strong> Điện tâm đồ (ECG), siêu âm tim Doppler.</li>
        <li><strong>Bước 3:</strong> Xét nghiệm máu, đường huyết, mỡ máu, chức năng tim.</li>
        <li><strong>Bước 4:</strong> Chẩn đoán & lập phác đồ điều trị cá nhân hóa.</li>
        <li><strong>Bước 5:</strong> Điều trị nội khoa hoặc can thiệp nếu cần.</li>
        <li><strong>Bước 6:</strong> Theo dõi và quản lý lâu dài đối với bệnh nhân tim mạch mạn tính.</li>
      </ul>

      {/* II. ĐIỀU TRỊ */}
      <h3 className="department-section-title">II. Điều trị & kỹ thuật chuyên môn</h3>

      <ul className="department-list">
        <li>Tầm soát bệnh tim mạch và rối loạn nhịp.</li>
        <li>Điện tâm đồ (ECG), Holter ECG 24 giờ.</li>
        <li>Siêu âm tim Doppler màu.</li>
        <li>Điều trị tăng huyết áp, suy tim, đau thắt ngực.</li>
        <li>Điều trị suy giãn tĩnh mạch bằng tiêm xơ, laser.</li>
        <li>Chẩn đoán và điều trị bệnh động mạch ngoại biên.</li>
      </ul>

      <p className="department-desc">
        Với định hướng “lấy người bệnh làm trung tâm”, khoa Tim Mạch luôn cam kết mang đến dịch vụ 
        an toàn, chính xác và tận tâm.
      </p>
    </div>
  );
}

export default TimMachMachMau;
