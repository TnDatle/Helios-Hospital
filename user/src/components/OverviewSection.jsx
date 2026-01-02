 import { Link } from "react-router-dom";
import "../styles/overview.css";

function OverviewSection() {
  return (
    <div className="overview-section container text-center">

      <h2 className="overview-title">TỔNG QUAN BỆNH VIỆN</h2>

      <p className="overview-desc">
        Thành lập từ năm 2004, Bệnh viện Helios Việt Nam là địa chỉ uy tín của người dân 
        trong lựa chọn nơi khám bệnh và phẫu thuật với đội ngũ chuyên môn cao và trang thiết bị hiện đại.
      </p>

      <div className="row overview-stats">
        
        <div className="col-md-3 stat-item">
          <img src="/icons/hospital.png" alt="icon" className="stat-icon" />
          <h3 className="stat-number">20+</h3>
          <p className="stat-text">năm hình thành & phát triển</p>
        </div>

        <div className="col-md-3 stat-item border-item">
          <img src="/icons/bed.png" alt="icon" className="stat-icon" />
          <h3 className="stat-number">200+</h3>
          <p className="stat-text">giường cho bệnh nhân</p>
        </div>

        <div className="col-md-3 stat-item border-item">
          <img src="/icons/bandage.png" alt="icon" className="stat-icon" />
          <h3 className="stat-number">1.000+</h3>
          <p className="stat-text">ca phẫu thuật thành công hằng năm</p>
        </div>

        <div className="col-md-3 stat-item">
          <img src="/icons/heart-hand.png" alt="icon" className="stat-icon" />
          <h3 className="stat-number">6.000+</h3>
          <p className="stat-text">bệnh nhân được điều trị hằng năm</p>
        </div>

      </div>


      <Link to="/gioi-thieu" className="overview-btn">
        XEM THÊM
      </Link>
    </div>
  );
}

export default OverviewSection;
