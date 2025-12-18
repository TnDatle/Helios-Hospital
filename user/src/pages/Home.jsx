import HeroSection from "../components/HeroSection";
import DepartmentSection from "../components/DepartmentSection";
import ServiceSection from "../components/ServiceSection";
import OverviewSection from "../components/OverviewSection";
function Home() {
  return (
    <>
      <HeroSection />

      <div className="container my-5">
        {/* Section 1: Chuyên khoa */}
        <h3 className="home-section-title text-center">CÁC CHUYÊN KHOA</h3>
        <DepartmentSection />

        {/* Section 2: Dịch vụ nổi bật */}
        <h3 className="home-section-title text-center mt-5">DỊCH VỤ NỔI BẬT</h3>
        <ServiceSection />


        <OverviewSection />
        
      </div>
    </>
  );
}

export default Home;
