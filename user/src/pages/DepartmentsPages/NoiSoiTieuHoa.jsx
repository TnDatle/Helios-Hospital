function NoiSoiTieuHoa() {
  return (
    <div className="department-container">

      <h2 className="department-title">NỘI SOI TIÊU HÓA</h2>
      <img src="/services/noisoitieuhoa.jpg" className="department-image" alt="" />

      {/* I. GIỚI THIỆU */}
      <h3 className="department-section-title">I. Giới thiệu</h3>

      <p className="department-desc">
        Khoa Nội soi Tiêu hóa chuyên thực hiện các kỹ thuật nội soi chẩn đoán và can thiệp 
        các bệnh lý đường tiêu hóa trên và dưới như thực quản, dạ dày, tá tràng, đại tràng. 
        Nội soi giúp phát hiện sớm viêm loét, polyp, xuất huyết tiêu hóa và ung thư tiêu hóa.
      </p>

      <p className="department-desc">
        Khoa được trang bị hệ thống nội soi hiện đại, nội soi độ phân giải cao, hỗ trợ sinh thiết 
        và can thiệp điều trị an toàn, chính xác, giảm tối đa khó chịu cho người bệnh.
      </p>

      {/* Quy trình */}
      <h3 className="department-section-title">Quy trình thăm khám – nội soi</h3>

      <ul className="department-list">
        <li><strong>Bước 1:</strong> Khám lâm sàng, khai thác triệu chứng tiêu hóa.</li>
        <li><strong>Bước 2:</strong> Tư vấn và chỉ định phương pháp nội soi phù hợp.</li>
        <li><strong>Bước 3:</strong> Chuẩn bị người bệnh trước nội soi.</li>
        <li><strong>Bước 4:</strong> Thực hiện nội soi dạ dày / đại tràng.</li>
        <li><strong>Bước 5:</strong> Sinh thiết hoặc can thiệp khi phát hiện tổn thương.</li>
        <li><strong>Bước 6:</strong> Theo dõi sau nội soi và tư vấn điều trị.</li>
      </ul>

      {/* II. KỸ THUẬT */}
      <h3 className="department-section-title">II. Kỹ thuật & dịch vụ chuyên môn</h3>

      <ul className="department-list">
        <li>Nội soi dạ dày – tá tràng.</li>
        <li>Nội soi đại tràng toàn bộ.</li>
        <li>Nội soi gây mê không đau.</li>
        <li>Sinh thiết tổn thương nghi ngờ ác tính.</li>
        <li>Cắt polyp tiêu hóa qua nội soi.</li>
        <li>Chẩn đoán sớm ung thư đường tiêu hóa.</li>
      </ul>

      <p className="department-desc">
        Nội soi tiêu hóa định kỳ giúp phát hiện sớm bệnh lý nguy hiểm, nâng cao hiệu quả điều trị 
        và bảo vệ sức khỏe lâu dài cho người bệnh.
      </p>
    </div>
  );
}

export default NoiSoiTieuHoa;
