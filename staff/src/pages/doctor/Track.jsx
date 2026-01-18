import { useState } from "react";
import "../../styles/doctor/track.css";

const API_BASE = "http://localhost:5000/api";

export default function Track() {
  const [searchType, setSearchType] = useState("code"); // code | name | phone
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search patients
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchValue.trim()) {
      alert("Vui lòng nhập thông tin tìm kiếm");
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // Mock search results
      const mockResults = [
        {
          id: 1,
          patientCode: "BN001",
          patientName: "Nguyễn Văn A",
          phone: "0901234567",
          dateOfBirth: "1985-05-15",
          gender: "Nam",
          address: "123 Lê Lợi, Q1, TP.HCM",
          lastVisit: "2024-01-15",
        },
        {
          id: 2,
          patientCode: "BN002",
          patientName: "Nguyễn Thị A",
          phone: "0901234568",
          dateOfBirth: "1990-08-20",
          gender: "Nữ",
          address: "456 Nguyễn Huệ, Q1, TP.HCM",
          lastVisit: "2024-01-10",
        },
      ];

      // Filter based on search type
      const filtered = mockResults.filter((p) => {
        const value = searchValue.toLowerCase();
        if (searchType === "code") return p.patientCode.toLowerCase().includes(value);
        if (searchType === "name") return p.patientName.toLowerCase().includes(value);
        if (searchType === "phone") return p.phone.includes(value);
        return false;
      });

      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching patients:", error);
      alert("Có lỗi xảy ra khi tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  // View patient details
  const handleViewPatient = async (patient) => {
    setSelectedPatient(patient);

    try {
      // TODO: Replace with actual API call
      // Mock medical history
      const mockHistory = [
        {
          id: 1,
          visitDate: "2024-01-15",
          doctor: "BS. Trần Văn B",
          department: "Khoa Nội Tim mạch",
          diagnosis: "Tăng huyết áp độ 1",
          prescription: "Amlodipine 5mg - 1 viên/ngày",
          notes: "Tái khám sau 2 tuần",
          vitalSigns: {
            bloodPressure: "140/90",
            heartRate: "78",
            temperature: "36.5",
            weight: "70",
          },
        },
        {
          id: 2,
          visitDate: "2023-12-20",
          doctor: "BS. Lê Thị C",
          department: "Khoa Nội Tổng hợp",
          diagnosis: "Viêm họng cấp",
          prescription: "Amoxicillin 500mg - 3 lần/ngày x 5 ngày",
          notes: "Nghỉ ngơi, uống nhiều nước",
          vitalSigns: {
            bloodPressure: "120/80",
            heartRate: "75",
            temperature: "37.8",
            weight: "69",
          },
        },
        {
          id: 3,
          visitDate: "2023-11-10",
          doctor: "BS. Phạm Văn D",
          department: "Khoa Ngoại Tổng hợp",
          diagnosis: "Khám sức khỏe định kỳ",
          prescription: "Không",
          notes: "Sức khỏe tốt",
          vitalSigns: {
            bloodPressure: "118/78",
            heartRate: "72",
            temperature: "36.6",
            weight: "68",
          },
        },
      ];

      setMedicalHistory(mockHistory);
    } catch (error) {
      console.error("Error fetching medical history:", error);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchValue("");
    setSearchResults([]);
    setSelectedPatient(null);
    setMedicalHistory([]);
  };

  // Calculate age
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="track-page">
      {/* HEADER */}
      <div className="track-header">
        <h1 className="track-title">Truy cứu hồ sơ bệnh án</h1>
        <p className="track-subtitle">Tra cứu thông tin và lịch sử khám bệnh</p>
      </div>

      {/* SEARCH SECTION */}
      <div className="search-section">
        <h2>Tìm kiếm bệnh nhân</h2>

        <form onSubmit={handleSearch}>
          <div className="search-controls">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="search-type"
            >
              <option value="code">Mã bệnh nhân</option>
              <option value="name">Tên bệnh nhân</option>
              <option value="phone">Số điện thoại</option>
            </select>

            <input
              type="text"
              placeholder={
                searchType === "code"
                  ? "Nhập mã bệnh nhân (VD: BN001)"
                  : searchType === "name"
                  ? "Nhập tên bệnh nhân"
                  : "Nhập số điện thoại"
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="search-input"
            />

            <button type="submit" className="btn-search" disabled={loading}>
              {loading ? "Đang tìm..." : "🔍 Tìm kiếm"}
            </button>

            {searchResults.length > 0 && (
              <button
                type="button"
                className="btn-clear"
                onClick={handleClearSearch}
              >
                ✕ Xóa
              </button>
            )}
          </div>
        </form>

        {/* SEARCH RESULTS */}
        {searchResults.length > 0 && !selectedPatient && (
          <div className="search-results">
            <p className="results-count">
              Tìm thấy {searchResults.length} kết quả
            </p>

            <div className="results-list">
              {searchResults.map((patient) => (
                <div
                  key={patient.id}
                  className="result-item"
                  onClick={() => handleViewPatient(patient)}
                >
                  <div className="result-avatar">
                    {patient.patientName.charAt(0)}
                  </div>
                  <div className="result-info">
                    <h4>{patient.patientName}</h4>
                    <p className="result-meta">
                      <span>Mã: {patient.patientCode}</span>
                      <span>•</span>
                      <span>{patient.gender}</span>
                      <span>•</span>
                      <span>{calculateAge(patient.dateOfBirth)} tuổi</span>
                    </p>
                    <p className="result-contact">
                      📞 {patient.phone} • 📍 {patient.address}
                    </p>
                  </div>
                  <div className="result-action">
                    <span className="view-link">Xem chi tiết →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PATIENT DETAILS */}
      {selectedPatient && (
        <>
          <div className="patient-section">
            <div className="section-header">
              <h2>Thông tin bệnh nhân</h2>
              <button className="btn-back" onClick={handleClearSearch}>
                ← Quay lại tìm kiếm
              </button>
            </div>

            <div className="patient-card">
              <div className="patient-main">
                <div className="patient-avatar-large">
                  {selectedPatient.patientName.charAt(0)}
                </div>
                <div className="patient-info">
                  <h3>{selectedPatient.patientName}</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Mã BN:</span>
                      <span className="info-value">{selectedPatient.patientCode}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Ngày sinh:</span>
                      <span className="info-value">
                        {new Date(selectedPatient.dateOfBirth).toLocaleDateString("vi-VN")} ({calculateAge(selectedPatient.dateOfBirth)} tuổi)
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Giới tính:</span>
                      <span className="info-value">{selectedPatient.gender}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Số ĐT:</span>
                      <span className="info-value">{selectedPatient.phone}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Địa chỉ:</span>
                      <span className="info-value">{selectedPatient.address}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Lần khám gần nhất:</span>
                      <span className="info-value">
                        {new Date(selectedPatient.lastVisit).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MEDICAL HISTORY */}
          <div className="history-section">
            <h2>Lịch sử khám bệnh ({medicalHistory.length})</h2>

            {medicalHistory.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <p>Chưa có lịch sử khám bệnh</p>
              </div>
            ) : (
              <div className="history-timeline">
                {medicalHistory.map((record) => (
                  <div key={record.id} className="history-item">
                    <div className="history-date">
                      <div className="date-badge">
                        {new Date(record.visitDate).toLocaleDateString("vi-VN")}
                      </div>
                    </div>

                    <div className="history-content">
                      <div className="history-header">
                        <h4>{record.department}</h4>
                        <span className="history-doctor">👨‍⚕️ {record.doctor}</span>
                      </div>

                      <div className="history-details">
                        <div className="detail-row">
                          <span className="detail-label">Chẩn đoán:</span>
                          <span className="detail-value diagnosis">{record.diagnosis}</span>
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Đơn thuốc:</span>
                          <span className="detail-value">{record.prescription}</span>
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Ghi chú:</span>
                          <span className="detail-value">{record.notes}</span>
                        </div>

                        <div className="vital-signs">
                          <div className="vital-item">
                            <span className="vital-icon">💉</span>
                            <span className="vital-label">Huyết áp</span>
                            <span className="vital-value">{record.vitalSigns.bloodPressure} mmHg</span>
                          </div>
                          <div className="vital-item">
                            <span className="vital-icon">❤️</span>
                            <span className="vital-label">Nhịp tim</span>
                            <span className="vital-value">{record.vitalSigns.heartRate} bpm</span>
                          </div>
                          <div className="vital-item">
                            <span className="vital-icon">🌡️</span>
                            <span className="vital-label">Nhiệt độ</span>
                            <span className="vital-value">{record.vitalSigns.temperature}°C</span>
                          </div>
                          <div className="vital-item">
                            <span className="vital-icon">⚖️</span>
                            <span className="vital-label">Cân nặng</span>
                            <span className="vital-value">{record.vitalSigns.weight} kg</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}