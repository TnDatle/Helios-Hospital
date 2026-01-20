// Register.jsx
import React, { useState } from 'react';
import '../../styles/reception/register.css';

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

  const [searchId, setSearchId] = useState('');
  const [patientCode, setPatientCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generatePatientCode = () => {
    const code = 'BN' + Date.now().toString().slice(-8);
    return code;
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.dateOfBirth || !formData.phone) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Ngày sinh, Số điện thoại)!');
      return;
    }

    const code = generatePatientCode();
    setPatientCode(code);
    
    const patientData = {
      ...formData,
      patientCode: code,
      createdAt: new Date().toISOString()
    };

    console.log('Đăng ký bệnh nhân:', patientData);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      dateOfBirth: '',
      gender: 'male',
      idCard: '',
      phone: '',
      email: '',
      province: '',
      district: '',
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
    setPatientCode('');
    setShowSuccess(false);
  };

  const handleSearch = () => {
    if (searchId.trim()) {
      alert(`Tìm kiếm bệnh nhân: ${searchId}`);
      // Implement search logic here
    }
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
            <button onClick={handleSearch} className="btn-search">
               Tìm kiếm
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
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>


              <div className="form-group">
                <label>Dân tộc</label>
                <input
                  type="text"
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleChange}
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
                >
                  <option value="">-- Chọn --</option>
                  <option value="HCM">TP. Hồ Chí Minh</option>
                  <option value="HN">Hà Nội</option>
                  <option value="DN">Đà Nẵng</option>
                  <option value="CT">Cần Thơ</option>
                  <option value="HP">Hải Phòng</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phường/Xã</label>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn --</option>
                  <option value="P1">Phường 1</option>
                  <option value="P2">Phường 2</option>
                  <option value="P3">Phường 3</option>
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