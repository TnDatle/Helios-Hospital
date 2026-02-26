// Register.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/reception/register.css';
import { getProvinces, getCommunes } from '../../API/location-api';


const Register = () => {

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    idCard: '',
    phone: '',
    email: '',
    province: '',
    ward: '',
    address: '',
    ethnicity: 'Kinh',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    hasInsurance: false,
    insuranceNumber: '',
    insurancePlace: '',
    insuranceFrom: '',
    insuranceTo: ''
  });

  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [patientCode, setPatientCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  /* ================= LOAD PROVINCES ================= */

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const data = await getProvinces();
        setProvinces(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Load provinces error:", err);
        setProvinces([]);
      }
    };

    loadProvinces();
  }, []);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'province') {
      setFormData(prev => ({
        ...prev,
        province: value,
        ward: ''
      }));

      try {
        const data = await getCommunes(value);
        setCommunes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Lỗi load phường:', err);
        setCommunes([]);
      }

      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generatePatientCode = () =>
    'BN' + Date.now().toString().slice(-8);

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {

    const selectedProvince = provinces.find(
      p => p.code === formData.province
    );

    const patientData = {
      patientCode: generatePatientCode(),

      fullName: formData.fullName,
      dob: formData.dateOfBirth,

      gender: formData.gender.toUpperCase(),

      cccd: formData.idCard,
      phone: formData.phone,
      email: formData.email || '',

      ethnicity: formData.ethnicity || 'Kinh',

      address: {
        province: selectedProvince?.name || '',
        provinceCode: formData.province,
        commune: formData.ward,
        detail: formData.address
      },

      relationship: null, // vì tiếp tân tạo

      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/patients",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patientData)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      setPatientCode(result.patientCode);
      setShowSuccess(true);

    } catch (err) {
      alert("Không thể kết nối server");
    }
  };

  /* ================= SEARCH ================= */

  const handleSearch = async () => {

  if (!searchId.trim()) return;

  setIsSearching(true); // 🔥 bật loading

  try {
    const response = await fetch(
      `http://localhost:5000/api/patients/search?q=${searchId}`
    );

    if (!response.ok) {
      alert("Không tìm thấy bệnh nhân");
      return;
    }

    const data = await response.json();

    let provinceCode = data.address?.provinceCode || '';

    if (!provinceCode && data.address?.province) {
      const match = provinces.find(
        p => p.name === data.address.province
      );
      provinceCode = match?.code || '';
    }

    if (provinceCode) {
      const communeData = await getCommunes(provinceCode);
      setCommunes(Array.isArray(communeData) ? communeData : []);
    }

    setFormData(prev => ({
      ...prev,
      fullName: data.fullName || "",
      dateOfBirth: data.dob || "",
      gender: data.gender?.toLowerCase() || "male",
      idCard: data.cccd || "",
      phone: data.phone || "",
      email: data.email || "",
      ethnicity: data.ethnicity || "Kinh",
      province: provinceCode,
      ward: data.address?.commune || "",
      address: data.address?.detail || ""
    }));

    setPatientCode(data.patientCode);
    setIsLocked(true);

  } catch (err) {
    alert("Lỗi server");
  } finally {
    setIsSearching(false);
  }
};

  /* ================= RESET ================= */

  const handleReset = () => {
    setFormData({
      fullName: '',
      dateOfBirth: '',
      gender: 'male',
      idCard: '',
      phone: '',
      email: '',
      province: '',
      ward: '',
      address: '',
      ethnicity: 'Kinh',
      emergencyName: '',
      emergencyPhone: '',
      emergencyRelation: '',
      hasInsurance: false,
      insuranceNumber: '',
      insurancePlace: '',
      insuranceFrom: '',
      insuranceTo: ''
    });

    setCommunes([]);
    setPatientCode('');
    setShowSuccess(false);
    setIsLocked(false);
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        {/* Header */}
        <div className="register-header">
          <h1>ĐĂNG KÝ BỆNH NHÂN MỚI</h1>
          <p>Nhập đầy đủ thông tin bệnh nhân để tạo hồ sơ mới</p>
        </div>

        {/* Search Box */}
        <div className="search-box">
          <h2>Kiểm tra bệnh nhân đã tồn tại</h2>
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Nhập mã BN, CMND, SĐT để tìm kiếm..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="search-input"
            />
            <button
              onClick={handleSearch}
              className="btn-search"
              disabled={isSearching}
            >
              {isSearching ? "Đang tìm..." : "Tìm kiếm"}
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <div className="register-form">
          {/* Thông tin cơ bản */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="icon"></span>
              Thông tin cơ bản
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  disabled={isLocked}
                />
              </div>

              <div className="form-group">
                <label>
                  Ngày sinh <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={isLocked}
                />
              </div>

              <div className="form-group">
                <label>
                  Giới tính <span className="required">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isLocked}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div className="form-group">
                <label>CMND/CCCD</label>
                <input
                  type="text"
                  name="idCard"
                  value={formData.idCard}
                  onChange={handleChange}
                  placeholder="001234567890"
                  disabled={isLocked}
                />
              </div>

              <div className="form-group">
                <label>
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0912345678"
                  disabled={isLocked}
                />
              </div>


              <div className="form-group">
                <label>Dân tộc</label>
                <input
                  type="text"
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleChange}
                  disabled={isLocked}
                />
              </div>
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="icon"></span>
              Địa chỉ
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Tỉnh/Thành phố</label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  disabled={isLocked}
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
              <label>Phường/Xã</label>
              <select
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                disabled={isLocked}
              >
                <option value="">-- Chọn --</option>
                {communes.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

              <div className="form-group form-group-full">
                <label>Địa chỉ chi tiết</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Số nhà, tên đường..."
                  disabled={isLocked}
                />
                
              </div>
            </div>
          </div>

          {/* Người thân */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="icon"></span>
              Người thân liên hệ khẩn cấp
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Họ tên người thân</label>
                <input
                  type="text"
                  name="emergencyName"
                  value={formData.emergencyName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn B"
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  placeholder="0987654321"
                />
              </div>

              <div className="form-group">
                <label>Mối quan hệ</label>
                <select
                  name="emergencyRelation"
                  value={formData.emergencyRelation}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn --</option>
                  <option value="father">Bố</option>
                  <option value="mother">Mẹ</option>
                  <option value="spouse">Vợ/Chồng</option>
                  <option value="sibling">Anh/Chị/Em</option>
                  <option value="child">Con</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bảo hiểm y tế */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="icon"></span>
              Bảo hiểm y tế
            </h2>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="hasInsurance"
                  checked={formData.hasInsurance}
                  onChange={handleChange}
                />
                <span>Có thẻ bảo hiểm y tế</span>
              </label>
            </div>

            {formData.hasInsurance && (
              <div className="insurance-details">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Số thẻ BHYT</label>
                    <input
                      type="text"
                      name="insuranceNumber"
                      value={formData.insuranceNumber}
                      onChange={handleChange}
                      placeholder="DN1234567890123"
                    />
                  </div>

                  <div className="form-group">
                    <label>Nơi đăng ký KCB</label>
                    <input
                      type="text"
                      name="insurancePlace"
                      value={formData.insurancePlace}
                      onChange={handleChange}
                      placeholder="Bệnh viện ABC"
                    />
                  </div>

                  <div className="form-group">
                    <label>Giá trị từ ngày</label>
                    <input
                      type="date"
                      name="insuranceFrom"
                      value={formData.insuranceFrom}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Đến ngày</label>
                    <input
                      type="date"
                      name="insuranceTo"
                      value={formData.insuranceTo}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <button type="button" className="btn-camera">
                       Chụp/Quét thẻ BHYT
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button onClick={handleSubmit} className="btn-submit">
               Lưu và tạo mã bệnh nhân
            </button>
            <button onClick={handleReset} className="btn-reset">
               Hủy
            </button>
          </div>

          {/* Success Message */}
          {showSuccess && patientCode && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <div className="success-content">
                <h3>Đăng ký thành công!</h3>
                <p>Mã bệnh nhân: <strong>{patientCode}</strong></p>
                <p>Họ tên: <strong>{formData.fullName}</strong></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;