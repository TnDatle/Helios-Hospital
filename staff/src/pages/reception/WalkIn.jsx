import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../../styles/reception/walkin.css';

import {
  searchPatientsApi,
  createAppointmentApi,
  getAppointmentsByPatientApi
} from "../../API/user-appointment-api";

const WalkIn = () => {

  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentMessage, setAppointmentMessage] = useState("");
  const navigate = useNavigate();

  const [appointmentData, setAppointmentData] = useState({
    department: '',
    doctor: '',
    visitType: 'kham-benh',
    priority: false,
    paymentType: 'tien-mat',
    reason: '',
    hasInsurance: false
  });
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("today");
  const [queueNumber, setQueueNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Danh sách khoa
  const departments = [
    { id: 'noi', name: 'Nội khoa', icon: '🏥' },
    { id: 'ngoai', name: 'Ngoại khoa', icon: '⚕️' },
    { id: 'san', name: 'Sản khoa', icon: '👶' },
    { id: 'nhi', name: 'Nhi khoa', icon: '🧸' },
    { id: 'mat', name: 'Mắt', icon: '👁️' },
    { id: 'tai-mui-hong', name: 'Tai-Mũi-Họng', icon: '👂' },
    { id: 'rang-ham-mat', name: 'Răng-Hàm-Mặt', icon: '🦷' },
    { id: 'da-lieu', name: 'Da liễu', icon: '💊' }
  ];

  const doctorsByDept = {
    'noi': ['BS. Nguyễn Văn X', 'BS. Trần Thị Y'],
    'ngoai': ['BS. Phạm Văn A'],
    'san': ['BS. Đỗ Thị C'],
    'nhi': ['BS. Bùi Thị E']
  };

  /* ================= SEARCH ================= */

  const handleSearch = async () => {

    if (!searchQuery.trim()) return;

    try {

      const data = await searchPatientsApi(searchQuery);

      setSearchResults(data);

    } catch (err) {

      console.error(err);
      alert("Không tìm thấy bệnh nhân");

      setSearchResults([]);

    }

  };

  /* ================= SELECT PATIENT ================= */

  const handleSelectPatient = async (patient) => {

  setSelectedPatient(patient);

  setAppointmentData(prev => ({
    ...prev,
    hasInsurance: patient.hasInsurance || false
  }));

  try {

    const data = await getAppointmentsByPatientApi(patient.patientId);

    console.log("API RESULT:", data);

    setAppointments(data);

    const today = new Date().toISOString().split("T")[0];

    if (!appointments || appointments.length === 0) {

      setAppointmentMessage("Bệnh nhân chưa có lịch hẹn.");
      setSelectedAppointment(null);
      return;
    }

    const appointment = appointments[0];

    setSelectedAppointment(appointment);

    setAppointmentData(prev => ({
      ...prev,
      department: appointment.departmentId || "",
      doctor: appointment.doctorId || ""
    }));

    if (appointment.schedule?.date === today) {

      setAppointmentMessage("Bệnh nhân có lịch hẹn hôm nay.");

    } else if (appointment.schedule?.date > today) {

      setAppointmentMessage(
        `Bệnh nhân có lịch hẹn ngày ${appointment.schedule.date}`
      );

    } else {

      setAppointmentMessage("Lịch hẹn đã quá ngày.");

    }

  } catch (err) {

    console.error("CHECK APPOINTMENT ERROR:", err);

    setAppointmentMessage("Không thể kiểm tra lịch hẹn.");
    setSelectedAppointment(null);

  }

};

  const handleNewPatient = () => {
    navigate("/staff/reception");
  };

  /* ================= CHANGE ================= */

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setAppointmentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'department') {

      setAppointmentData(prev => ({
        ...prev,
        doctor: ''
      }));

    }

  };

  const generateQueueNumber = () => {

    const deptCode = appointmentData.department.substring(0, 2).toUpperCase();

    const num = Math.floor(Math.random() * 900) + 100;

    return `${deptCode}${num}`;

  };

  /* ================= CONFIRM ================= */

  const handleConfirm = async () => {

  /* ===== CHECKIN LỊCH HẸN ===== */

  if (selectedAppointment) {

    setQueueNumber(
      selectedAppointment.queueNumber ||
      generateQueueNumber()
    );

    setShowSuccess(true);

    setStep(3);

    return;
  }

  /* ===== WALK-IN ===== */

  if (!appointmentData.department) {

    alert("Vui lòng chọn khoa khám!");

    return;

  }

  try {

    const body = {

      patientId: selectedPatient.patientId,

      departmentId: appointmentData.department,

      doctorId: appointmentData.doctor || null,

      visitType: appointmentData.visitType,

      priority: appointmentData.priority,

      paymentType: appointmentData.paymentType,

      reason: appointmentData.reason,

      hasInsurance: appointmentData.hasInsurance

    };

    const result = await createAppointmentApi(body);

    setQueueNumber(result.queueNumber);

    setShowSuccess(true);

    setStep(3);

  } catch (err) {

    console.error(err);

    alert("Không thể tạo lịch khám");

  }

};

  /* ================= RESET ================= */

  const handleReset = () => {

    setStep(1);

    setSearchQuery('');

    setSearchResults([]);

    setSelectedPatient(null);

    setSelectedAppointment(null);

    setAppointmentData({
      department: '',
      doctor: '',
      visitType: 'kham-benh',
      priority: false,
      paymentType: 'tien-mat',
      reason: '',
      hasInsurance: false
    });

    setQueueNumber('');

    setShowSuccess(false);

  };

  const handlePrint = () => {

    window.print();

  };


  //Khai báo các trang thái của từng tab
  const today = new Date().toISOString().slice(0,10);

  const todayAppointments = appointments.filter(
    a => a.schedule?.date === today
  );

  const upcomingAppointments = appointments.filter(
    a => a.schedule?.date > today
  );

  const historyAppointments = appointments.filter(
    a => a.schedule?.date < today
  );

  return (
    <div className="walkin-container">
      <div className="walkin-wrapper">
        {/* Header */}
        <div className="walkin-header">
          <h1>TIẾP NHẬN TRỰC TIẾP</h1>
          <p>Check-in bệnh nhân đến khám tại quầy</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Tìm bệnh nhân</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Chọn dịch vụ</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Xác nhận</div>
          </div>
        </div>

        {/* Step 1: Search Patient */}
        {step === 1 && (
          <div className="walkin-content">
            <div className="search-section">
              <h2>Tìm kiếm bệnh nhân</h2>
              <div className="search-box-walkin">
                <input
                  type="text"
                  placeholder="Nhập mã BN, tên, hoặc số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="search-input-walkin"
                />
                <button onClick={handleSearch} className="btn-search-walkin">
                   Tìm kiếm
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="search-results">
                  <h3>Kết quả tìm kiếm ({searchResults.length})</h3>
                  <div className="patient-list">
                    {searchResults.map(patient => (
                      <div key={patient.id} className="patient-card">
                        <div className="patient-info">
                          <h4>{patient.fullName}</h4>
                          <p>Mã BN: <strong>{patient.patientId}</strong></p>
                          <p>Ngày sinh:<strong> {patient.dob}</strong></p>
                          <p>SĐT: <strong>{patient.phone}</strong></p>
                          <p>CCCD/CMND: <strong>{patient.cccd}</strong></p>
                          {patient.hasInsurance && <span className="badge-insurance">Có BHYT</span>}
                        </div>
                        <button 
                          onClick={() => handleSelectPatient(patient)}
                          className="btn-select"
                        >
                          Chọn ➜
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="no-results">
                  <p> Không tìm thấy bệnh nhân</p>
                </div>
              )}

              {selectedPatient && (
                <div className="appointment-tabs">

                  <h3>Lịch khám</h3>

                  {/* TAB HEADER */}

                  <div className="tab-header">

                    <button
                      className={activeTab === "today" ? "active" : ""}
                      onClick={() => setActiveTab("today")}
                    >
                      Hôm nay ({todayAppointments.length})
                    </button>

                    <button
                      className={activeTab === "upcoming" ? "active" : ""}
                      onClick={() => setActiveTab("upcoming")}
                    >
                      Sắp tới ({upcomingAppointments.length})
                    </button>

                    <button
                      className={activeTab === "history" ? "active" : ""}
                      onClick={() => setActiveTab("history")}
                    >
                      Lịch sử ({historyAppointments.length})
                    </button>

                  </div>

                  {/* TAB CONTENT */}

                  <div className="tab-content">

                    {/* TODAY */}

                    {activeTab === "today" && todayAppointments.map(app => (

                      <div key={app.id} className="appointment-card">

                        <p><strong>Khoa:</strong> {app.departmentName}</p>

                        <p><strong>Bác sĩ:</strong> {app.doctorName}</p>

                        <p><strong>Phòng:</strong> {app.schedule?.room}</p>

                        <p>
                          <strong>Ca:</strong>{" "}
                            {app.schedule?.shiftId === "MORNING"
                              ? "6:00 - 11:30"
                              : app.schedule?.shiftId === "AFTERNOON"
                              ? "13:00 - 16:00"
                              : "Không xác định"}
                        </p>

                        <button
                          onClick={()=>{
                            setSelectedAppointment(app);
                            handleConfirm();
                          }}
                        >
                          Check-in
                        </button>

                      </div>

                    ))}

                    {/* UPCOMING */}

                    {activeTab === "upcoming" && (
                      upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map(app => (
                          <div key={app.id} className="appointment-card">

                            <p><strong>Khoa:</strong> {app.departmentName}</p>

                            <p><strong>Bác sĩ:</strong> {app.doctorName}</p>

                            <p><strong>Phòng:</strong> {app.schedule?.room}</p>

                            <p>
                              <strong>Ca:</strong>{" "}
                              {app.schedule?.shiftId === "MORNING"
                                ? "6:00 - 11:30"
                                : app.schedule?.shiftId === "AFTERNOON"
                                ? "13:00 - 16:00"
                                : "Không xác định"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>Không có lịch sắp tới</p>
                      )
                    )}

                    {/* HISTORY */}

                    {activeTab === "history" && (
                      historyAppointments.length > 0 ? (
                        historyAppointments.map(app => (
                          <div key={app.id} className="appointment-card">

                            <p><strong>Khoa:</strong> {app.departmentName}</p>

                            <p><strong>Bác sĩ:</strong> {app.doctorName}</p>

                            <p><strong>Phòng:</strong> {app.schedule?.room}</p>

                            <p>
                              <strong>Ca:</strong>{" "}
                              {app.schedule?.shiftId === "MORNING"
                                ? "6:00 - 11:30"
                                : app.schedule?.shiftId === "AFTERNOON"
                                ? "13:00 - 16:00"
                                : "Không xác định"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>Chưa có lịch sử khám</p>
                      )
                    )}

                  </div>

                </div>
              )}

              <div className="new-patient-section">
                <p>Bệnh nhân chưa có trong hệ thống?</p>
                <button onClick={handleNewPatient} className="btn-new-patient">
                   Đăng ký bệnh nhân mới
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select Service */}
        {step === 2 && selectedPatient && (
          <div className="walkin-content">
            <div className="patient-selected">
              <h3>Bệnh nhân đã chọn</h3>
              <div className="selected-card">
                <div className="selected-info">
                  <h4>{selectedPatient.fullName}</h4>
                  <p>Mã BN: <strong>{selectedPatient.patientId}</strong></p>
                  <p>Ngày sinh: <strong>{selectedPatient.dob}</strong></p>
                  <p>SĐT: <strong>{selectedPatient.phone}</strong></p>
                  <p>CCCD/CMND: <strong>{selectedPatient.cccd}</strong></p>
                </div>
                <button onClick={() => setStep(1)} className="btn-change">
                  Đổi BN
                </button>
              </div>
            </div>

            <div className="service-section">
              <h2>Chọn dịch vụ khám</h2>

              {/* Loại khám */}
              <div className="form-group-walkin">
                <label>Loại khám</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="visitType"
                      value="kham-benh"
                      checked={appointmentData.visitType === 'kham-benh'}
                      onChange={handleChange}
                    />
                    <span>Khám bệnh</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="visitType"
                      value="tai-kham"
                      checked={appointmentData.visitType === 'tai-kham'}
                      onChange={handleChange}
                    />
                    <span>Tái khám</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="visitType"
                      value="cap-cuu"
                      checked={appointmentData.visitType === 'cap-cuu'}
                      onChange={handleChange}
                    />
                    <span>Cấp cứu</span>
                  </label>
                </div>
              </div>

              {/* Chọn khoa */}
              <div className="form-group-walkin">
                <label>Chọn khoa khám <span className="required">*</span></label>
                <div className="department-grid">
                  {departments.map(dept => (
                    <div
                      key={dept.id}
                      className={`dept-card ${appointmentData.department === dept.id ? 'selected' : ''}`}
                      onClick={() => setAppointmentData(prev => ({ ...prev, department: dept.id, doctor: '' }))}
                    >
                      <div className="dept-icon">{dept.icon}</div>
                      <div className="dept-name">{dept.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chọn bác sĩ */}
              {appointmentData.department && (
                <div className="form-group-walkin">
                  <label>Chọn bác sĩ (tùy chọn)</label>
                  <select
                    name="doctor"
                    value={appointmentData.doctor}
                    onChange={handleChange}
                    className="select-doctor"
                  >
                    <option value="">-- Tự động phân bổ --</option>
                    {doctorsByDept[appointmentData.department]?.map((doc, idx) => (
                      <option key={idx} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Lý do khám */}
              <div className="form-group-walkin">
                <label>Lý do khám / Triệu chứng</label>
                <textarea
                  name="reason"
                  value={appointmentData.reason}
                  onChange={handleChange}
                  placeholder="Ví dụ: Đau đầu, sốt cao, ho..."
                  rows="3"
                  className="textarea-reason"
                />
              </div>

              {/* Options */}
              <div className="options-group">
                <label className="checkbox-label-walkin">
                  <input
                    type="checkbox"
                    name="priority"
                    checked={appointmentData.priority}
                    onChange={handleChange}
                  />
                  <span> Ưu tiên (người cao tuổi, trẻ em, khuyết tật)</span>
                </label>

                <label className="checkbox-label-walkin">
                  <input
                    type="checkbox"
                    name="hasInsurance"
                    checked={appointmentData.hasInsurance}
                    onChange={handleChange}
                  />
                  <span> Sử dụng bảo hiểm y tế</span>
                </label>
              </div>

              {/* Payment Type */}
              <div className="form-group-walkin">
                <label>Hình thức thanh toán</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="paymentType"
                      value="tien-mat"
                      checked={appointmentData.paymentType === 'tien-mat'}
                      onChange={handleChange}
                    />
                    <span> Tiền mặt</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="paymentType"
                      value="the"
                      checked={appointmentData.paymentType === 'the'}
                      onChange={handleChange}
                    />
                    <span> Thẻ</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="paymentType"
                      value="chuyen-khoan"
                      checked={appointmentData.paymentType === 'chuyen-khoan'}
                      onChange={handleChange}
                    />
                    <span> Chuyển khoản</span>
                  </label>
                </div>
              </div>

              {/* Fee Summary */}
              <div className="fee-summary">
                <h3>Tổng chi phí</h3>
                <div className="fee-item">
                  <span>Phí khám:</span>
                  <strong>150,000 đ</strong>
                </div>
                {appointmentData.hasInsurance && (
                  <div className="fee-item insurance">
                    <span>BHYT chi trả (80%):</span>
                    <strong>- 120,000 đ</strong>
                  </div>
                )}
                <div className="fee-total">
                  <span>Bệnh nhân thanh toán:</span>
                  <strong>{appointmentData.hasInsurance ? '30,000' : '150,000'} đ</strong>
                </div>
              </div>

              {/* Actions */}
              <div className="form-actions-walkin">
                <button onClick={() => setStep(1)} className="btn-back">
                  ← Quay lại
                </button>
                <button onClick={handleConfirm} className="btn-confirm">
                  Xác nhận check-in ✓
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && showSuccess && (
          <div className="walkin-content">
            <div className="success-container">
              <div className="success-icon-large">✓</div>
              <h2>Check-in thành công!</h2>
              
              <div className="queue-number-display">
                <div className="queue-label">Số thứ tự</div>
                <div className="queue-number-large">{queueNumber}</div>
              </div>

              <div className="summary-info">
                <h3>Thông tin khám bệnh</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Bệnh nhân:</span>
                    <span className="summary-value">{selectedPatient.fullName}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Mã BN:</span>
                    <span className="summary-value">{selectedPatient.patientId}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Khoa:</span>
                    <span className="summary-value">
                      {departments.find(d => d.id === appointmentData.department)?.name}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Bác sĩ:</span>
                    <span className="summary-value">
                      {appointmentData.doctor || 'Tự động phân bổ'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Loại khám:</span>
                    <span className="summary-value">
                      {appointmentData.visitType === 'kham-benh' ? 'Khám bệnh' : 
                       appointmentData.visitType === 'tai-kham' ? 'Tái khám' : 'Cấp cứu'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Thanh toán:</span>
                    <span className="summary-value">
                      {appointmentData.hasInsurance ? '30,000 đ (Có BHYT)' : '150,000 đ'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="success-actions">
                <button onClick={handlePrint} className="btn-print">
                  🖨️ In phiếu khám
                </button>
                <button onClick={handleReset} className="btn-new-checkin">
                  ➕ Check-in bệnh nhân mới
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalkIn;