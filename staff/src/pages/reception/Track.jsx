// Track.jsx
import React, { useState } from 'react';
import '../../styles/reception/track.css';

const Track = () => {
  const [searchType, setSearchType] = useState('id'); // id, name, phone, insurance
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // info, history, appointments, tests

  // Mock data
  const mockPatients = [
    {
      id: 'BN12345678',
      name: 'Nguyễn Văn A',
      dob: '15/05/1990',
      age: 34,
      gender: 'Nam',
      phone: '0912345678',
      email: 'nguyenvana@email.com',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      idCard: '001234567890',
      insurance: 'DN1234567890123',
      insuranceValid: '01/01/2024 - 31/12/2024',
      registeredDate: '10/01/2023',
      lastVisit: '15/01/2025',
      totalVisits: 12,
      debt: 0,
      history: [
        { date: '15/01/2025', dept: 'Nội khoa', doctor: 'BS. Nguyễn Văn X', diagnosis: 'Cảm cúm', status: 'Hoàn thành' },
        { date: '20/12/2024', dept: 'Nhi khoa', doctor: 'BS. Trần Thị Y', diagnosis: 'Sốt virus', status: 'Hoàn thành' },
        { date: '05/11/2024', dept: 'Da liễu', doctor: 'BS. Lê Văn Z', diagnosis: 'Dị ứng da', status: 'Hoàn thành' }
      ],
      appointments: [
        { date: '25/01/2025', time: '09:00', dept: 'Nội khoa', doctor: 'BS. Nguyễn Văn X', status: 'Đã xác nhận', note: 'Tái khám' },
        { date: '30/01/2025', time: '14:00', dept: 'Mắt', doctor: 'BS. Cao Văn G', status: 'Chờ xác nhận', note: '' }
      ],
      tests: [
        { date: '15/01/2025', name: 'Xét nghiệm máu tổng quát', result: 'Bình thường', status: 'Hoàn thành' },
        { date: '15/01/2025', name: 'X-quang phổi', result: 'Không có bất thường', status: 'Hoàn thành' },
        { date: '20/12/2024', name: 'Siêu âm bụng', result: 'Bình thường', status: 'Hoàn thành' }
      ],
      prescriptions: [
        { date: '15/01/2025', medicine: 'Paracetamol 500mg', dosage: '1 viên x 3 lần/ngày', days: 5 },
        { date: '15/01/2025', medicine: 'Vitamin C 1000mg', dosage: '1 viên x 1 lần/ngày', days: 7 }
      ]
    },
    {
      id: 'BN87654321',
      name: 'Trần Thị B',
      dob: '20/08/1985',
      age: 39,
      gender: 'Nữ',
      phone: '0987654321',
      email: 'tranthib@email.com',
      address: '456 Lê Lợi, Quận 3, TP.HCM',
      idCard: '009876543210',
      insurance: '',
      insuranceValid: '',
      registeredDate: '15/03/2023',
      lastVisit: '10/01/2025',
      totalVisits: 8,
      debt: 150000,
      history: [
        { date: '10/01/2025', dept: 'Sản khoa', doctor: 'BS. Đỗ Thị C', diagnosis: 'Khám thai định kỳ', status: 'Hoàn thành' }
      ],
      appointments: [],
      tests: [],
      prescriptions: []
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('Vui lòng nhập thông tin tìm kiếm!');
      return;
    }

    let results = [];
    
    switch(searchType) {
      case 'id':
        results = mockPatients.filter(p => 
          p.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        break;
      case 'name':
        results = mockPatients.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        break;
      case 'phone':
        results = mockPatients.filter(p => 
          p.phone.includes(searchQuery)
        );
        break;
      case 'insurance':
        results = mockPatients.filter(p => 
          p.insurance.toLowerCase().includes(searchQuery.toLowerCase())
        );
        break;
      default:
        results = mockPatients;
    }

    setSearchResults(results);
    setShowDetail(false);
    setSelectedPatient(null);
  };

  const handleViewDetail = (patient) => {
    setSelectedPatient(patient);
    setShowDetail(true);
    setActiveTab('info');
  };

  const handleBack = () => {
    setShowDetail(false);
    setSelectedPatient(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    alert('Xuất dữ liệu ra Excel/PDF');
  };

  return (
    <div className="track-container">
      <div className="track-wrapper">
        {/* Header */}
        <div className="track-header">
          <h1>🔍 TRA CỨU BỆNH NHÂN</h1>
          <p>Tìm kiếm và xem thông tin chi tiết hồ sơ bệnh nhân</p>
        </div>

        {!showDetail ? (
          <>
            {/* Search Section */}
            <div className="track-search-section">
              <h2>Tìm kiếm bệnh nhân</h2>
              
              {/* Search Type */}
              <div className="search-type-selector">
                <button
                  className={`type-btn ${searchType === 'id' ? 'active' : ''}`}
                  onClick={() => setSearchType('id')}
                >
                  🆔 Mã BN
                </button>
                <button
                  className={`type-btn ${searchType === 'name' ? 'active' : ''}`}
                  onClick={() => setSearchType('name')}
                >
                  👤 Họ tên
                </button>
                <button
                  className={`type-btn ${searchType === 'phone' ? 'active' : ''}`}
                  onClick={() => setSearchType('phone')}
                >
                  📞 Số ĐT
                </button>
                <button
                  className={`type-btn ${searchType === 'insurance' ? 'active' : ''}`}
                  onClick={() => setSearchType('insurance')}
                >
                  💳 Số BHYT
                </button>
              </div>

              {/* Search Input */}
              <div className="search-box-track">
                <input
                  type="text"
                  placeholder={
                    searchType === 'id' ? 'Nhập mã bệnh nhân...' :
                    searchType === 'name' ? 'Nhập họ tên bệnh nhân...' :
                    searchType === 'phone' ? 'Nhập số điện thoại...' :
                    'Nhập số thẻ BHYT...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="search-input-track"
                />
                <button onClick={handleSearch} className="btn-search-track">
                  🔍 Tìm kiếm
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="track-results">
                <div className="results-header">
                  <h3>Kết quả tìm kiếm ({searchResults.length})</h3>
                  <button onClick={handleExport} className="btn-export">
                    📊 Xuất dữ liệu
                  </button>
                </div>

                <div className="results-table-container">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Mã BN</th>
                        <th>Họ tên</th>
                        <th>Ngày sinh</th>
                        <th>Giới tính</th>
                        <th>SĐT</th>
                        <th>Lần khám cuối</th>
                        <th>Tổng lượt</th>
                        <th>Công nợ</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((patient) => (
                        <tr key={patient.id}>
                          <td><strong>{patient.id}</strong></td>
                          <td>{patient.name}</td>
                          <td>{patient.dob}</td>
                          <td>{patient.gender}</td>
                          <td>{patient.phone}</td>
                          <td>{patient.lastVisit}</td>
                          <td className="text-center">{patient.totalVisits}</td>
                          <td className={patient.debt > 0 ? 'debt-amount' : 'no-debt'}>
                            {patient.debt > 0 ? patient.debt.toLocaleString() + ' đ' : '0 đ'}
                          </td>
                          <td>
                            <button
                              onClick={() => handleViewDetail(patient)}
                              className="btn-view-detail"
                            >
                              👁️ Xem
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {searchQuery && searchResults.length === 0 && (
              <div className="no-results-track">
                <div className="no-results-icon">🔍</div>
                <h3>Không tìm thấy bệnh nhân</h3>
                <p>Vui lòng kiểm tra lại thông tin tìm kiếm</p>
              </div>
            )}
          </>
        ) : (
          /* Patient Detail View */
          <div className="patient-detail">
            <div className="detail-header">
              <button onClick={handleBack} className="btn-back-track">
                ← Quay lại
              </button>
              <div className="detail-actions">
                <button onClick={handlePrint} className="btn-print-track">
                  🖨️ In hồ sơ
                </button>
                <button className="btn-edit-track">
                  ✏️ Chỉnh sửa
                </button>
              </div>
            </div>

            {/* Patient Info Card */}
            <div className="patient-info-card">
              <div className="patient-avatar">
                <div className="avatar-circle">
                  {selectedPatient.name.charAt(0)}
                </div>
              </div>
              <div className="patient-basic-info">
                <h2>{selectedPatient.name}</h2>
                <div className="info-badges">
                  <span className="badge-id">Mã BN: {selectedPatient.id}</span>
                  <span className="badge-age">{selectedPatient.age} tuổi</span>
                  <span className={`badge-gender ${selectedPatient.gender === 'Nam' ? 'male' : 'female'}`}>
                    {selectedPatient.gender}
                  </span>
                  {selectedPatient.insurance && (
                    <span className="badge-insurance-track">Có BHYT</span>
                  )}
                  {selectedPatient.debt > 0 && (
                    <span className="badge-debt">Còn nợ</span>
                  )}
                </div>
                <div className="quick-stats">
                  <div className="stat-item">
                    <span className="stat-label">Ngày đăng ký:</span>
                    <span className="stat-value">{selectedPatient.registeredDate}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Lần khám cuối:</span>
                    <span className="stat-value">{selectedPatient.lastVisit}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Tổng lượt khám:</span>
                    <span className="stat-value">{selectedPatient.totalVisits} lần</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="detail-tabs">
              <button
                className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                📋 Thông tin cá nhân
              </button>
              <button
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                📝 Lịch sử khám
              </button>
              <button
                className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointments')}
              >
                📅 Lịch hẹn
              </button>
              <button
                className={`tab-btn ${activeTab === 'tests' ? 'active' : ''}`}
                onClick={() => setActiveTab('tests')}
              >
                🔬 Kết quả xét nghiệm
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {/* Personal Info Tab */}
              {activeTab === 'info' && (
                <div className="info-grid">
                  <div className="info-section">
                    <h3>Thông tin cơ bản</h3>
                    <div className="info-row">
                      <span className="info-label">Họ và tên:</span>
                      <span className="info-value">{selectedPatient.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Ngày sinh:</span>
                      <span className="info-value">{selectedPatient.dob}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Giới tính:</span>
                      <span className="info-value">{selectedPatient.gender}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">CMND/CCCD:</span>
                      <span className="info-value">{selectedPatient.idCard}</span>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3>Thông tin liên hệ</h3>
                    <div className="info-row">
                      <span className="info-label">Số điện thoại:</span>
                      <span className="info-value">{selectedPatient.phone}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{selectedPatient.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Địa chỉ:</span>
                      <span className="info-value">{selectedPatient.address}</span>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3>Bảo hiểm y tế</h3>
                    <div className="info-row">
                      <span className="info-label">Số thẻ BHYT:</span>
                      <span className="info-value">
                        {selectedPatient.insurance || 'Không có'}
                      </span>
                    </div>
                    {selectedPatient.insurance && (
                      <div className="info-row">
                        <span className="info-label">Giá trị:</span>
                        <span className="info-value">{selectedPatient.insuranceValid}</span>
                      </div>
                    )}
                  </div>

                  <div className="info-section">
                    <h3>Thông tin khác</h3>
                    <div className="info-row">
                      <span className="info-label">Ngày đăng ký:</span>
                      <span className="info-value">{selectedPatient.registeredDate}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Công nợ:</span>
                      <span className={`info-value ${selectedPatient.debt > 0 ? 'debt-text' : ''}`}>
                        {selectedPatient.debt.toLocaleString()} đ
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="history-list">
                  <h3>Lịch sử khám bệnh ({selectedPatient.history.length} lần)</h3>
                  {selectedPatient.history.map((record, index) => (
                    <div key={index} className="history-card">
                      <div className="history-date">{record.date}</div>
                      <div className="history-details">
                        <div className="history-row">
                          <strong>Khoa:</strong> {record.dept}
                        </div>
                        <div className="history-row">
                          <strong>Bác sĩ:</strong> {record.doctor}
                        </div>
                        <div className="history-row">
                          <strong>Chẩn đoán:</strong> {record.diagnosis}
                        </div>
                        <div className="history-status">
                          <span className="status-badge completed">{record.status}</span>
                        </div>
                      </div>
                      <button className="btn-view-prescription">
                        💊 Xem đơn thuốc
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div className="appointments-list">
                  <h3>Lịch hẹn sắp tới ({selectedPatient.appointments.length})</h3>
                  {selectedPatient.appointments.length > 0 ? (
                    selectedPatient.appointments.map((apt, index) => (
                      <div key={index} className="appointment-card">
                        <div className="appointment-date-time">
                          <div className="apt-date">📅 {apt.date}</div>
                          <div className="apt-time">🕐 {apt.time}</div>
                        </div>
                        <div className="appointment-details">
                          <div className="apt-row">
                            <strong>Khoa:</strong> {apt.dept}
                          </div>
                          <div className="apt-row">
                            <strong>Bác sĩ:</strong> {apt.doctor}
                          </div>
                          {apt.note && (
                            <div className="apt-row">
                              <strong>Ghi chú:</strong> {apt.note}
                            </div>
                          )}
                          <div className="apt-status">
                            <span className={`status-badge ${apt.status === 'Đã xác nhận' ? 'confirmed' : 'pending'}`}>
                              {apt.status}
                            </span>
                          </div>
                        </div>
                        <div className="apt-actions">
                          <button className="btn-cancel-apt">❌ Hủy</button>
                          <button className="btn-reschedule-apt">🔄 Đổi lịch</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>📅 Không có lịch hẹn nào</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tests Tab */}
              {activeTab === 'tests' && (
                <div className="tests-list">
                  <h3>Kết quả xét nghiệm và cận lâm sàng</h3>
                  {selectedPatient.tests.length > 0 ? (
                    selectedPatient.tests.map((test, index) => (
                      <div key={index} className="test-card">
                        <div className="test-date">{test.date}</div>
                        <div className="test-details">
                          <div className="test-name">{test.name}</div>
                          <div className="test-result">
                            <strong>Kết quả:</strong> {test.result}
                          </div>
                          <span className="status-badge completed">{test.status}</span>
                        </div>
                        <button className="btn-view-result">
                          📄 Xem chi tiết
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>🔬 Chưa có kết quả xét nghiệm</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Track;