import { useNavigate } from "react-router-dom";

function ServiceSection() {
  const navigate = useNavigate();

  const services = [
    {
      name: "NGOẠI TỔNG QUÁT",
      desc: "Chẩn đoán và điều trị các bệnh lý ngoại khoa phổ biến, phẫu thuật an toàn với đội ngũ chuyên môn cao.",
      image: "/services/tongquat.jpg",
      slug: "ngoai-tong-quat",
    },
    {
      name: "NGOẠI TIẾT NIỆU",
      desc: "Khám và điều trị sỏi thận, viêm đường tiết niệu, u xơ tuyến tiền liệt và các bệnh lý hệ tiết niệu.",
      image: "/services/tietnieu.jpg",
      slug: "ngoai-tiet-nieu",
    },
    {
      name: "TIM MẠCH & MẠCH MÁU",
      desc: "Khám, chẩn đoán và điều trị các bệnh lý tim mạch, mạch máu với trang thiết bị hiện đại.",
      image: "/services/tim.jpg",
      slug: "tim-mach-mach-mau",
    },
    {
      name: "UNG BƯỚU",
      desc: "Khám, chẩn đoán và điều trị các bệnh lý ung thư theo phác đồ chuyên môn, kết hợp theo dõi và chăm sóc toàn diện cho người bệnh.",
      image: "/services/ungbuou.jpeg",
      slug: "ung-buou",
    },
    {
      name: "LỌC MÁU - NỘI THẬN",
      desc: "Khám và điều trị các bệnh lý thận, quản lý bệnh thận mạn và thực hiện các phương pháp lọc máu nhằm duy trì và cải thiện chức năng thận.",
      image: "/services/noithan.jpg",
      slug: "noi-than",
    },
    {
      name: "XÉT NGHIỆM",
      desc: "Thực hiện các xét nghiệm cận lâm sàng phục vụ công tác chẩn đoán, theo dõi diễn tiến bệnh và đánh giá hiệu quả điều trị.",
      image: "/services/xetnghiem.jpg",
      slug: "xet-nghiem",
    },
    {
    name: "NỘI SOI TIÊU HÓA",
    desc: "Thực hiện các kỹ thuật nội soi đường tiêu hóa như nội soi dạ dày, tá tràng, đại tràng nhằm chẩn đoán, theo dõi và phát hiện sớm các bệnh lý tiêu hóa.",
    image: "/services/noisoitieuhoa.jpg",
    slug: "noi-soi-tieu-hoa",
  },
  {
    name: "NỘI SOI NIỆU",
    desc: "Thực hiện các kỹ thuật nội soi hệ tiết niệu để chẩn đoán và theo dõi các bệnh lý về bàng quang, niệu đạo và đường tiết niệu.",
    image: "/services/noisoinieu.jpg",
    slug: "noi-soi-nieu",
  },
  ];

  return (
    <div className="row gy-4 mt-4">
      {services.map((s, i) => (
        <div className="col-md-4" key={i}>
          <div
            className="department-card shadow-sm"
            onClick={() => navigate(`/${s.slug}`)}
          >
            <img src={s.image} className="department-card-image" alt={s.name} />

            <div className="department-card-body">
              <h5 className="department-card-title">{s.name}</h5>
              <p className="department-card-desc">{s.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ServiceSection;
