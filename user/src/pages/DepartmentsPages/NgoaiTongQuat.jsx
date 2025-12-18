function NgoaiTongQuat() {
  return (
    <div className="department-container">

      <h2 className="department-title">NGOẠI TỔNG QUÁT</h2>
      <img src="/services/tongquat.jpg" className="department-image" alt="" />

      {/* I. GIỚI THIỆU */}
      <h3 className="department-section-title">I. Giới thiệu</h3>

      <p className="department-desc">
        Khoa Ngoại Tổng Quát tại Bệnh Viện Helios Việt Nam là một trong những 
        chuyên khoa mũi nhọn, tiếp nhận và điều trị hầu hết các bệnh lý liên quan đến hệ tiêu hoá, 
        gan mật tụy, tuyến giáp, ổ bụng và thành bụng. Với đội ngũ bác sĩ phẫu thuật giàu kinh nghiệm 
        cùng hệ thống phòng mổ vô khuẩn hiện đại, khoa mang đến các phương pháp điều trị hiệu quả, 
        an toàn và nhanh hồi phục.
      </p>

      <p className="department-desc">
        Ngoại Tổng Quát đảm nhận vai trò quan trọng trong cấp cứu, điều trị các ca phức tạp 
        như viêm ruột thừa cấp, xuất huyết tiêu hoá, tắc ruột, viêm túi mật, áp xe gan, thoát vị nghẹt… 
        Đây cũng là nơi tiếp nhận hội chẩn các bệnh lý liên quan đến ung thư tiêu hoá để đưa ra phác đồ 
        tối ưu cho người bệnh.
      </p>

      {/* Quy trình khám chữa bệnh */}
      <h3 className="department-section-title">Quy trình thăm khám – điều trị</h3>

      <ul className="department-list">
        <li><strong>Bước 1:</strong> Bác sĩ thăm khám lâm sàng, khai thác triệu chứng & tiền sử.</li>
        <li><strong>Bước 2:</strong> Chỉ định xét nghiệm máu, siêu âm bụng, CT-scan hoặc nội soi tuỳ trường hợp.</li>
        <li><strong>Bước 3:</strong> Hội chẩn chuyên khoa (khi cần) để đưa ra phác đồ tối ưu.</li>
        <li><strong>Bước 4:</strong> Điều trị nội khoa hoặc chỉ định phẫu thuật.</li>
        <li><strong>Bước 5:</strong> Chăm sóc hậu phẫu & hướng dẫn phục hồi sau điều trị.</li>
        <li><strong>Bước 6:</strong> Tái khám định kỳ và theo dõi lâu dài.</li>
      </ul>

      {/* II. ĐIỀU TRỊ */}
      <h3 className="department-section-title">II. Điều trị & kỹ thuật chuyên môn</h3>

      <ul className="department-list">
        <li>Phẫu thuật nội soi tiêu hoá (dạ dày, đại tràng, ruột non).</li>
        <li>Điều trị viêm ruột thừa cấp bằng nội soi.</li>
        <li>Phẫu thuật tuyến giáp: bướu giáp, Basedow.</li>
        <li>Xử trí thoát vị bẹn – thoát vị thành bụng.</li>
        <li>Phẫu thuật gan mật – tụy (sỏi mật, u gan, nang gan…).</li>
        <li>Điều trị áp xe, nhiễm trùng, u phần mềm.</li>
        <li>Phẫu thuật cấp cứu ổ bụng.</li>
      </ul>

      <p className="department-desc">
        Với công nghệ phẫu thuật nội soi tiên tiến, đa số ca bệnh đều có thể điều trị ít xâm lấn, 
        giúp người bệnh đau ít hơn và hồi phục nhanh hơn.
      </p>
    </div>
  );
}

export default NgoaiTongQuat;
