import "./../styles/about.css";

function About() {
  return (
    <div className="about-page">

      {/* ===== BANNER ===== */}
      <div
        className="about-banner"
        style={{ backgroundImage: "url('/icons/hand-banner.jpg')" }}
      >
        <div className="banner-overlay"></div>

        <div className="banner-content container">
          <div className="breadcrumb">
            <span> Giới Thiệu &gt; Tổng quan bệnh viện</span>
          </div>

          <h1 className="banner-title">TỔNG QUAN BỆNH VIỆN</h1>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="container about-content-wrapper">

        {/* LEFT CONTENT */}
        <div className="about-left">
            <h2 className="about-main-title">
                BỆNH VIỆN <span>HELIOS VIỆT NAM</span>
            </h2>

            <h4 className="about-subtitle">
                Trung tâm điều trị chuyên sâu về Ngoại tổng quát, Tiết niệu, Tim mạch & Mạch máu
            </h4>

            {/* ẢNH CHÍNH */}
            <div className="about-img-box">
                <img src="/icons/hospital-banner.png" alt="hospital" />
            </div>

            <p>
                Thành lập từ năm 2004, <strong>Bệnh viện Helios Việt Nam</strong> được định hướng trở 
                thành một trong những cơ sở y tế dẫn đầu trong khu vực phía Nam, chuyên sâu về 
                các lĩnh vực Ngoại tổng quát, Tiết niệu, Tim mạch – Mạch máu và nhiều chuyên khoa quan trọng khác.
            </p>

            <p>
                Bệnh viện hiện có <strong>700 giường bệnh</strong> cùng hệ thống cơ sở vật chất đạt chuẩn,
                mỗi năm tiếp nhận hơn <strong>6.000 lượt khám ngoại trú</strong> và 
                <strong> 10.000 lượt điều trị nội trú</strong>. Với đội ngũ bác sĩ dày dặn kinh nghiệm,
                hệ thống phòng mổ hiện đại và quy trình điều trị an toàn – hiệu quả, Helios đang dần 
                khẳng định vị thế là một trong những bệnh viện đa khoa uy tín tại TP. Hồ Chí Minh.
            </p>

            {/* =================================================== */}
            {/* SECTION 1 – PHÒNG BỆNH */}
            {/* =================================================== */}
            <h3 className="section-title about-section-title">Hệ thống phòng bệnh hiện đại</h3>

            <img src="/icons/room.jpg" className="about-image" alt="Phòng bệnh" />

            <p>
                Hệ thống phòng bệnh tại Helios được thiết kế dựa trên tiêu chí 
                <strong> an toàn – tiện nghi – thân thiện</strong>. Không gian điều trị được tối ưu để 
                giúp bệnh nhân phục hồi nhanh hơn, hạn chế tối đa nguy cơ nhiễm khuẩn và mang lại cảm giác 
                thoải mái như ở nhà.
            </p>

            <p>Các loại phòng bệnh hiện đang được cung cấp bao gồm:</p>

            <ul className="about-list">
                <li>Phòng VIP 1 giường với đầy đủ tiện nghi, đảm bảo sự riêng tư tuyệt đối.</li>
                <li>Phòng 2–4 giường rộng rãi, thoáng mát, phù hợp nhu cầu của số đông bệnh nhân.</li>
                <li>Khu điều trị hậu phẫu với máy monitoring theo dõi liên tục.</li>
                <li>Hệ thống báo gọi điều dưỡng 24/7 được trang bị tại mỗi giường bệnh.</li>
            </ul>

            <p>
                Tất cả các phòng đều được vệ sinh theo chuẩn vô khuẩn nghiêm ngặt và được nhân viên y tế 
                kiểm tra thường xuyên nhằm đảm bảo môi trường điều trị an toàn, sạch sẽ.
            </p>

            {/* =================================================== */}
            {/* SECTION 2 – VĂN PHÒNG KHOA */}
            {/* =================================================== */}
            <h3 className="section-title about-section-title">Văn phòng khoa – Tổ chức chuyên nghiệp</h3>

            <img src="/icons/office.jpg" className="about-image" alt="Văn phòng khoa" />

            <p>
                Hệ thống văn phòng khoa tại Helios được tổ chức khoa học, tuân thủ mô hình quản lý 
                chuẩn quốc tế nhằm hỗ trợ tối đa cho hoạt động chuyên môn và xử lý hồ sơ bệnh án.
            </p>

            <p>Các khoa – phòng trọng điểm bao gồm:</p>

            <ul className="about-list">
                <li>Khoa Ngoại Tổng Quát với đội ngũ phẫu thuật viên giàu kinh nghiệm.</li>
                <li>Khoa Ngoại Tiết Niệu – thế mạnh lâu năm của bệnh viện.</li>
                <li>Khoa Tim Mạch & Mạch Máu – chuyên sâu về can thiệp mạch và phẫu thuật mạch máu.</li>
                <li>Phòng Công tác xã hội hỗ trợ thông tin và kết nối người bệnh.</li>
            </ul>

            <p>
                Mỗi văn phòng khoa đều được trang bị đầy đủ công cụ làm việc, đảm bảo việc tiếp nhận – 
                xử lý hồ sơ bệnh nhân nhanh chóng, minh bạch và thuận tiện.
            </p>

            {/* =================================================== */}
            {/* SECTION 3 – PHÒNG KHÁM */}
            {/* =================================================== */}
            <h3 className="section-title about-section-title">Hệ thống phòng khám hiện đại</h3>

            <img src="/icons/clinic.jpg" className="about-image" alt="Phòng khám" />

            <p>
                Khu khám bệnh được bố trí theo mô hình một chiều, giúp rút ngắn thời gian di chuyển, 
                tránh ùn ứ và tối ưu trải nghiệm cho người bệnh. Mỗi phòng khám đều được trang bị đầy đủ 
                thiết bị cần thiết để thực hiện khám lâm sàng, tư vấn và chỉ định cận lâm sàng.
            </p>

            <p>Cơ sở phòng khám bao gồm:</p>

            <ul className="about-list">
                <li>Phòng khám chuyên khoa với đội ngũ bác sĩ đầu ngành.</li>
                <li>Phòng khám dịch vụ và phòng khám hẹn giờ, hạn chế thời gian chờ.</li>
                <li>Khu xét nghiệm, siêu âm, X-quang – CT – MRI theo mô hình một chiều.</li>
                <li>Khu vực tiếp nhận nhanh dành riêng cho người cao tuổi.</li>
            </ul>

            {/* =================================================== */}
            {/* SECTION 4 – PHÒNG PHẪU THUẬT */}
            {/* =================================================== */}
            <h3 className="section-title about-section-title">Hệ thống phòng phẫu thuật</h3>

            <img src="/icons/surgery.png" className="about-image" alt="Phòng phẫu thuật" />

            <p>
                Hệ thống phòng phẫu thuật của bệnh viện Helios được xây dựng theo tiêu chuẩn quốc tế, 
                đảm bảo vô khuẩn tuyệt đối và được trang bị đầy đủ thiết bị phẫu thuật hiện đại. 
                Không gian phòng mổ được kiểm soát nghiêm ngặt về nhiệt độ, độ ẩm và chất lượng không khí.
            </p>

            <p>Đặc điểm nổi bật của trung tâm phẫu thuật:</p>

            <ul className="about-list">
                <li>Phòng mổ Hybrid tích hợp chẩn đoán hình ảnh ngay trong phòng mổ.</li>
                <li>Hệ thống robot phẫu thuật thế hệ mới hỗ trợ các ca phẫu thuật phức tạp.</li>
                <li>Phòng mổ nội soi 3D – 4K với hình ảnh độ phân giải cao.</li>
                <li>Hệ thống lọc khí vô trùng và kiểm soát nhiễm khuẩn đạt chuẩn châu Âu.</li>
                <li>Khu hồi tỉnh theo dõi sau mổ liên tục 24/7.</li>
            </ul>

            <p>
                Đội ngũ phẫu thuật viên, bác sĩ gây mê hồi sức và điều dưỡng đều được đào tạo bài bản, 
                đảm bảo an toàn tối đa cho người bệnh trong mọi quy trình phẫu thuật. Nhờ đó, bệnh viện 
                đạt tỷ lệ thành công cao và thời gian phục hồi nhanh cho mỗi ca điều trị.
            </p>


            {/* =================================================== */}
            {/* SECTION 5 – PHÒNG XÉT NGHIỆM */}
            {/* =================================================== */}

            <h3 className="section-title about-section-title">Hệ thống phòng xét nghiệm – chẩn đoán</h3>

            <img src="/icons/lab.png" className="about-image" alt="Phòng xét nghiệm" />

            <p>
            Hệ thống phòng xét nghiệm và chẩn đoán hình ảnh tại Bệnh viện Helios Việt Nam
            được đầu tư đồng bộ, ứng dụng các công nghệ hàng đầu nhằm đảm bảo tính chính xác,
            nhanh chóng và an toàn trong mọi chỉ định cận lâm sàng.
            </p>

            <p>
            Tất cả các quy trình xét nghiệm đều được chuẩn hóa theo tiêu chuẩn 
            <strong> ISO 15189</strong>, giúp kiểm soát chất lượng nghiêm ngặt, giảm thiểu tối đa sai số
            và hỗ trợ bác sĩ chẩn đoán hiệu quả hơn.
            </p>

            <p>Các lĩnh vực xét nghiệm – chẩn đoán bao gồm:</p>

            <ul className="about-list">
            <li>Xét nghiệm huyết học, sinh hóa, miễn dịch.</li>
            <li>Xét nghiệm nước tiểu, tế bào học và vi sinh học.</li>
            <li>Hệ thống sinh học phân tử phục vụ tầm soát ung thư và bệnh lý di truyền.</li>
            <li>Chẩn đoán hình ảnh: Siêu âm, X-quang số hóa, CT Scan, MRI.</li>
            <li>Hệ thống nội soi tiêu hóa – tiết niệu công nghệ cao.</li>
            </ul>

            <p>
            Toàn bộ mẫu bệnh phẩm được xử lý theo mô hình khép kín, ứng dụng  
            <strong> máy phân tích tự động</strong> thế hệ mới giúp rút ngắn thời gian trả kết quả.
            Nhiều nhóm xét nghiệm có thể trả trong vòng từ <strong>30–60 phút</strong>.
            </p>

            <p>
            Đội ngũ kỹ thuật viên xét nghiệm và chẩn đoán hình ảnh đều là những chuyên gia
            được đào tạo bài bản, có chứng chỉ chuyên ngành và kinh nghiệm trong xử lý
            các trường hợp phức tạp.
            </p>

            <p>
            Nhờ hệ thống xét nghiệm – chẩn đoán chất lượng cao, bệnh viện có khả năng hỗ trợ
            bác sĩ lập phác đồ điều trị chính xác, kịp thời và an toàn cho từng bệnh nhân.
            </p>

            <p>
                Với hơn <strong>1.500 nhân viên y tế</strong> cùng hệ thống trang thiết bị hiện đại, 
                Bệnh viện Helios Việt Nam cam kết cung cấp dịch vụ khám chữa bệnh 
                chất lượng – an toàn – tận tâm – chuyên nghiệp.
            </p>
            </div>


      </div>
    </div>
  );
}

export default About;
