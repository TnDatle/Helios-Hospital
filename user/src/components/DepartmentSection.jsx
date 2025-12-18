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
