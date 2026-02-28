// Track.jsx
import React, { useState } from 'react';
import '../../styles/reception/search.css';

const Track = () => {
  const [searchType, setSearchType] = useState('id');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Vui lòng nhập thông tin tìm kiếm!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/patients/search?q=${searchQuery}&type=${searchType}`
      );

      if (!response.ok) {
        setSearchResults([]);
        return;
      }

      const result = await response.json();

      let patientsArray = [];

      if (Array.isArray(result)) {
        patientsArray = result;
      } else if (result.data && Array.isArray(result.data)) {
        patientsArray = result.data;
      } else if (result.patient) {
        patientsArray = [result.patient];
      } else {
        patientsArray = [result];
      }

      const mapped = patientsArray.map((p) => ({
        id: p.patientCode || '',
        name: p.fullName || '',
        dob: p.dob || '',
        gender: p.gender === 'MALE' ? 'Nam' : 'Nữ',
        phone: p.phone || '',
        insurance: p.bhyt || '',
        idCard: p.cccd || '',
        email: p.email || '',
        address: [
          p.address?.detail,
          p.address?.commune,
          p.address?.province
        ].filter(Boolean).join(', '),
        registeredDate: p.createdAt?._seconds
          ? new Date(p.createdAt._seconds * 1000).toLocaleDateString('vi-VN')
          : '',
        lastVisit: 'Chưa có',
        totalVisits: 0,
        debt: 0,
        age: p.dob
          ? new Date().getFullYear() - new Date(p.dob).getFullYear()
          : '',
        history: [],
        appointments: [],
        tests: [],
      }));

      setSearchResults(mapped);
      setShowDetail(false);
      setSelectedPatient(null);

    } catch (err) {
      alert('Lỗi server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DETAIL ================= */
  const handleViewDetail = (patient) => {
    setSelectedPatient(patient);
    setShowDetail(true);
    setActiveTab('info');
  };

  const handleBack = () => {
    setShowDetail(false);
    setSelectedPatient(null);
  };

  const handlePrint = () => window.print();

  const handleExport = () => {
    alert('Xuất dữ liệu ra Excel/PDF');
  };

  /* ================= UI ================= */
  return (
    <div className="track-container">
      <div className="track-wrapper">

        <div className="track-header">
          <h1> TRA CỨU BỆNH NHÂN</h1>
          <p>Tìm kiếm và xem thông tin chi tiết hồ sơ bệnh nhân</p>
        </div>

        {!showDetail ? (
          <>
            {/* SEARCH */}
            <div className="track-search-section">
              <h2>Tìm kiếm bệnh nhân</h2>

             <div className="search-type-selector">
              <button
                type="button"
                className={`type-btn ${searchType === 'id' ? 'active' : ''}`}
                onClick={() => setSearchType('id')}
              >
                 Mã BN
              </button>

            </div>

              <div className="search-box-track">
                <input
                  type="text"
                  placeholder="Nhập thông tin tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="search-input-track"
                />

                <button onClick={handleSearch} className="btn-search-track">
                  {loading ? 'Đang tìm...' : ' Tìm kiếm'}
                </button>
              </div>
            </div>

            {/* RESULTS */}
            {searchResults.length > 0 && (
              <div className="track-results">
                <div className="results-header">
                  <h3>Kết quả tìm kiếm ({searchResults.length})</h3>
                  <button onClick={handleExport} className="btn-export">
                    Xuất dữ liệu
                  </button>
                </div>

                <div className="results-table-container">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Mã BN</th>
                        <th>Họ và tên</th>
                        <th>Ngày sinh</th>
                        <th>Giới tính</th>
                        <th>SĐT</th>
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
                          <td className="text-center">{patient.totalVisits}</td>
                          <td>{patient.debt} đ</td>
                          <td>
                            <button
                              onClick={() => handleViewDetail(patient)}
                              className="btn-view-detail"
                            >
                               Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {searchQuery && !loading && searchResults.length === 0 && (
              <div className="no-results-track">
                <h3>Không tìm thấy bệnh nhân</h3>
              </div>
            )}
          </>
        ) : (
          /* DETAIL VIEW */
          <div className="patient-detail">

            <div className="detail-header">
              <button onClick={handleBack} className="btn-back-track">
                ← Quay lại
              </button>
              <div className="detail-actions">
                <button onClick={handlePrint} className="btn-print-track">
                   In hồ sơ
                </button>
              </div>
            </div>

            <div className="patient-info-card">
              <div className="patient-avatar">
                <div className="avatar-circle">
                  {selectedPatient.name.charAt(0)}
                </div>
              </div>

              <div className="patient-basic-info">
                <h2>{selectedPatient.name}</h2>
                <p>Mã BN: {selectedPatient.id}</p>
                <p>Tuổi: {selectedPatient.age}</p>
                <p>Giới tính: {selectedPatient.gender}</p>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-row">
                <strong>Ngày sinh:</strong> {selectedPatient.dob}
              </div>
              <div className="info-row">
                <strong>SĐT:</strong> {selectedPatient.phone}
              </div>
              <div className="info-row">
                <strong>CCCD:</strong> {selectedPatient.idCard}
              </div>
              <div className="info-row">
                <strong>BHYT:</strong> {selectedPatient.insurance || 'Không có'}
              </div>
              <div className="info-row">
                <strong>Địa chỉ:</strong> {selectedPatient.address}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Track;