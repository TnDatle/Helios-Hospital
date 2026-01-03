import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import MyAppointments from "./pages/Profiles/MyAppointments";
import HoSoBenhNhan from "./pages/Profiles/PatientsProfile";
import ChiTietBacSi from "./pages/DetailPages/DoctorDetail";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NgoaiTongQuat from "./pages/DepartmentsPages/NgoaiTongQuat";
import NgoaiTietNieu from "./pages/DepartmentsPages/NgoaiTietNieu";
import TimMach from "./pages/DepartmentsPages/TimMach";


// Import Header Pages
import DangNhap  from "./pages/AuthPages/Login"
import DangKy  from "./pages/AuthPages/Register"
import HoanThanhHoSo from "./pages/AuthPages/CompleteProfile";
import TimBacSi from "./pages/FindDoctor";
import LichKhamBenh from "./pages/Schedule";
import GioiThieu from "./pages/About";
import GioKhamBenh from "./pages/Time";
import BangGia from "./pages/Price";

// Import CSS Modules
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/hero.css";
import "./styles/finddoctor.css";
import "./styles/doctordetail.css";
import "./styles/booking.css";
import "./styles/home.css";
import "./styles/service.css";
import "./styles/sections.css";
import "./styles/departments.css";
import "./styles/time.css"
import "./styles/price.css";
import "./styles/auth.css"
import "./styles/bookingsuccesmodel.css"
import "./styles/patient.css"

function App() {
  return (
    <BrowserRouter>
      <Header />

      <main style={{ minHeight: "70vh" }}>
        <Routes>

        {/* ===== HOME ===== */}
        <Route path="/" element={<Home />} />

        {/* ===== ĐẶT LỊCH ===== */}
        <Route path="/dat-lich" element={<Booking />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/ho-so-benh-nhan" element={<HoSoBenhNhan />} />

        {/* ===== CÁC KHOA ===== */}
        <Route path="/ngoai-tong-quat" element={<NgoaiTongQuat />} />
        <Route path="/ngoai-tiet-nieu" element={<NgoaiTietNieu />} />
        <Route path="/tim-mach-mach-mau" element={<TimMach />} />

        {/* ===== MENU HEADER ===== */}
        <Route path="/gio-kham" element={<GioKhamBenh />} />
        <Route path="/bang-gia" element={<BangGia />} />
        <Route path="/tim-bac-si" element={<TimBacSi />} />
        <Route path="/tim-bac-si/:department/:id" element={<ChiTietBacSi />} />
        <Route path="/lich-kham-benh" element={<LichKhamBenh />} />
        {/* Placeholder – tạo sau nếu cần */}
        <Route path="/gioi-thieu" element={<GioiThieu />} />
        <Route path="/dieu-tri" element={<div className='container py-5'>Điều trị</div>} />
        <Route path="/dich-vu" element={<div className='container py-5'>Dịch vụ</div>} />
        <Route path="/huong-dan" element={<div className='container py-5'>Hướng dẫn</div>} />
        <Route path="/truyen-thong" element={<div className='container py-5'>Truyền thông</div>} />
        <Route path="/dao-tao" element={<div className='container py-5'>Đào tạo</div>} />
        <Route path="/van-ban" element={<div className='container py-5'>Văn bản</div>} />
        <Route path="/tuyen-dung" element={<div className='container py-5'>Tuyển dụng</div>} />
        <Route path="/lien-he" element={<div className='container py-5'>Liên hệ</div>} />
        <Route path="/dang-nhap" element={<DangNhap />} />
        <Route path="/dang-ky" element={<DangKy />} />
        <Route path="/complete-profile" element={<HoanThanhHoSo />} />

      </Routes>

      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
