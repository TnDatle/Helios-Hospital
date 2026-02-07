import { useState , useEffect} from "react";

function ServiceSection() {


  const initialSlides = [
    {
      name: "Dịch vụ Tư vấn thuốc",
      desc: "Hướng dẫn sử dụng thuốc an toàn.",
      icon: "/icons/medicine.png",
      slug: "tu-van-thuoc",
    },
    {
      name: "Phẫu thuật trong ngày",
      desc: "Rút ngắn thời gian chờ đợi khám. Người bệnh được nhập viện và phẫu thuật trong ngày.",
      icon: "/icons/24h.png",
      slug: "phau-thuat",
    },
    {
      name: "Xe vận chuyển",
      desc: "Đáp ứng nhu cầu vận chuyển người bệnh",
      icon: "/icons/car.png",
      slug: "xe-van-chuyen",
    },
    {
      name: "Dịch vụ chuyển phát nhanh",
      desc: "Hỗ trợ gửi hồ sơ, kết quả khám và giấy tờ y tế đến tận nơi nhanh chóng.",
      icon: "/icons/send.png",
      slug: "chuyen-phat-nhanh",
    },
    {
      name: "Hỗ trợ xuất viện sớm",
      desc: "Hỗ trợ rút ngắn quy trình thanh toán và hoàn tất thủ tục viện phí, giúp người bệnh xuất viện nhanh chóng.",
      icon: "/icons/medical.png",
      slug: "xuat-vien-som",
    },
  ];

  const [slides, setSlides] = useState(initialSlides);
  const [anim, setAnim] = useState(false);

  const CARD_SHIFT = 360; // trượt nhẹ thay vì trượt full card

  const next = () => {
    setAnim(true);

    setTimeout(() => {
      // xoay vòng
      const newSlides = [...slides];
      const first = newSlides.shift();
      newSlides.push(first);

      setSlides(newSlides);

      // tắt animation rồi reset về 0
      setAnim(false);
    }, 350);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 2000); // 2s 1 lần

    return () => clearInterval(interval);
  });

  const prev = () => {
    setAnim(true);

    setTimeout(() => {
      const newSlides = [...slides];
      const last = newSlides.pop();
      newSlides.unshift(last);

      setSlides(newSlides);

      setAnim(false);
    }, 350);
  };

  return (
    <div className="service-section">

      <div className="service-wrapper">

        <button className="service-nav nav-left" onClick={prev}>
          &lt;
        </button>

        <div className="service-slider-container">
          <div
            className={`service-slider-track ${anim ? "animating" : ""}`}
            style={{
              transform: anim ? `translateX(-${CARD_SHIFT}px)` : "translateX(0)",
            }}
          >
            {slides.map((s, i) => (
              <div className="service-card" key={i}>
                <img src={s.icon} alt={s.name} className="service-icon" />
                <h4 className="service-card-title">{s.name}</h4>
                <div className="underline"></div>
                <p className="service-card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="service-nav nav-right" onClick={next}>
          &gt;
        </button>

      </div>
    </div>
  );
}

export default ServiceSection;
