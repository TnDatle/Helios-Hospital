function HeroSection() {
  return (
    <div className="helios-hero position-relative">

      {/* Background image */}
      <img
        src="/icons/hospital-banner.png"
        className="hero-bg-image"
        alt="Helios banner"
      />

      {/* Overlay */}
      <div className="hero-overlay"></div>

      <div className="container position-relative text-center hero-content">
        <h1 className="hero-title">Bệnh Viện Helios Việt Nam</h1>

        <p className="hero-subtitle">
          Chăm sóc tận tâm – Công nghệ hiện đại – Đặt lịch khám nhanh chóng
        </p>

        <a href="/booking" className="hero-btn">
          Đặt lịch ngay
        </a>
      </div>
    </div>
  );
}

export default HeroSection;
