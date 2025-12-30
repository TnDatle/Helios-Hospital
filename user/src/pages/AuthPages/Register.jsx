import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProvinces,
  getCommunes,
} from "../../API/location-api";
import "../../styles/auth.css";

function Register() {
  // ===== LOCATION =====
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [provinceCode, setProvinceCode] = useState("");

  // ===== FORM DATA =====
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    dob: "",
    cccd: "",
    phone: "",
    province: "",
    commune: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ===== LOAD PROVINCES =====
  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  // ===== LOAD COMMUNES =====
  useEffect(() => {
    if (provinceCode) {
      getCommunes(provinceCode).then(setCommunes);
    }
  }, [provinceCode]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO:
    // 1. Validate nghiệp vụ
    // 2. Firebase Auth create user
    // 3. Gửi hồ sơ bệnh nhân về backend
    console.log(form);
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <h2 className="auth-title">Đăng ký khám bệnh</h2>
        <p className="auth-subtitle">
          Vui lòng nhập đầy đủ thông tin để tạo hồ sơ bệnh nhân
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* ===== THÔNG TIN CÁ NHÂN ===== */}
          <div className="form-row">
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn --</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Căn cước công dân</label>
            <input
              name="cccd"
              maxLength={12}
              value={form.cccd}
              onChange={handleChange}
              required
            />
          </div>

          {/* ===== ĐỊA CHỈ ===== */}
          <div className="form-row">
            <div className="form-group">
              <label>Tỉnh / Thành phố</label>
              <select
                value={provinceCode}
                onChange={(e) => {
                  setProvinceCode(e.target.value);
                  setForm({
                    ...form,
                    province: e.target.options[e.target.selectedIndex].text,
                  });
                }}
                required
              >
                <option value="">-- Chọn --</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Phường / Xã</label>
              <select
                name="commune"
                value={form.commune}
                onChange={handleChange}
                disabled={!provinceCode}
                required
              >
                <option value="">-- Chọn --</option>
                {communes.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Địa chỉ chi tiết</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* ===== TÀI KHOẢN ===== */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Nhập lại mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Hoàn tất đăng ký
          </button>
        </form>

        <div className="auth-footer">
          <span>Đã có tài khoản?</span>
          <Link to="/dang-nhap">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
