import React, { useState } from 'react';
import { Calendar, FileText, User, Clock, MapPin, Pill, Heart, Activity } from 'lucide-react';
import "../../styles/doctor/history.css";

const History = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Dữ liệu mẫu lịch sử khám bệnh
  const medicalRecords = [
    {
      id: 1,
      date: '15/01/2026',
      time: '09:30',
      doctor: 'BS. Nguyễn Văn An',
      specialty: 'Nội khoa',
      diagnosis: 'Viêm họng cấp',
      location: 'Phòng khám A - Tầng 2',
      status: 'completed',
      symptoms: 'Đau họng, sốt nhẹ, ho khan',
      prescription: [
        { name: 'Amoxicillin 500mg', dosage: '2 viên/ngày', duration: '7 ngày' },
        { name: 'Paracetamol 500mg', dosage: '3 viên/ngày khi sốt', duration: '3 ngày' }
      ],
      notes: 'Tái khám sau 1 tuần nếu triệu chứng không thuyên giảm',
      vitalSigns: {
        temperature: '37.5°C',
        bloodPressure: '120/80 mmHg',
        heartRate: '78 bpm'
      }
    },
    {
      id: 2,
      date: '08/01/2026',
      time: '14:00',
      doctor: 'BS. Trần Thị Bình',
      specialty: 'Tim mạch',
      diagnosis: 'Kiểm tra sức khỏe định kỳ',
      location: 'Phòng khám B - Tầng 3',
      status: 'completed',
      symptoms: 'Không có triệu chứng bất thường',
      prescription: [],
      notes: 'Sức khỏe tốt, tiếp tục duy trì lối sống lành mạnh',
      vitalSigns: {
        temperature: '36.8°C',
        bloodPressure: '118/75 mmHg',
        heartRate: '72 bpm'
      }
    },
    {
      id: 3,
      date: '28/12/2025',
      time: '10:15',
      doctor: 'BS. Lê Minh Châu',
      specialty: 'Da liễu',
      diagnosis: 'Viêm da tiếp xúc',
      location: 'Phòng khám C - Tầng 1',
      status: 'completed',
      symptoms: 'Ngứa, đỏ da vùng cánh tay',
      prescription: [
        { name: 'Kem Betamethasone', dosage: 'Bôi 2 lần/ngày', duration: '10 ngày' },
        { name: 'Cetirizine 10mg', dosage: '1 viên/ngày', duration: '7 ngày' }
      ],
      notes: 'Tránh tiếp xúc với chất kích ứng',
      vitalSigns: {
        temperature: '36.6°C',
        bloodPressure: '115/78 mmHg',
        heartRate: '75 bpm'
      }
    }
  ];

  const filteredRecords = filterStatus === 'all' 
    ? medicalRecords 
    : medicalRecords.filter(record => record.status === filterStatus);

  return (
    <div className="history-container">
      <div className="history-header">
        <div className="header-content">
          <h1><Calendar className="header-icon" /> Lịch Sử Khám Bệnh</h1>
          <p>Quản lý và theo dõi hồ sơ khám bệnh của bạn</p>
        </div>
        
        <div className="filter-tabs">
          <button 
            className={filterStatus === 'all' ? 'active' : ''} 
            onClick={() => setFilterStatus('all')}
          >
            Tất cả ({medicalRecords.length})
          </button>
          <button 
            className={filterStatus === 'completed' ? 'active' : ''} 
            onClick={() => setFilterStatus('completed')}
          >
            Đã hoàn thành ({medicalRecords.filter(r => r.status === 'completed').length})
          </button>
        </div>
      </div>

      <div className="history-content">
        <div className="records-list">
          {filteredRecords.map(record => (
            <div 
              key={record.id} 
              className={`record-card ${selectedRecord?.id === record.id ? 'selected' : ''}`}
              onClick={() => setSelectedRecord(record)}
            >
              <div className="record-header">
                <div className="record-date">
                  <Calendar size={18} />
                  <span>{record.date}</span>
                </div>
                <span className={`status-badge ${record.status}`}>
                  {record.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                </span>
              </div>
              
              <h3 className="record-diagnosis">{record.diagnosis}</h3>
              
              <div className="record-info">
                <div className="info-item">
                  <User size={16} />
                  <span>{record.doctor}</span>
                </div>
                <div className="info-item">
                  <Clock size={16} />
                  <span>{record.time}</span>
                </div>
                <div className="info-item">
                  <MapPin size={16} />
                  <span>{record.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="record-details">
          {selectedRecord ? (
            <div className="details-content">
              <div className="details-header">
                <h2>Chi Tiết Khám Bệnh</h2>
                <span className="detail-date">{selectedRecord.date} - {selectedRecord.time}</span>
              </div>

              <div className="details-section">
                <h3><User className="section-icon" /> Thông Tin Bác Sĩ</h3>
                <div className="section-content">
                  <p><strong>Bác sĩ:</strong> {selectedRecord.doctor}</p>
                  <p><strong>Chuyên khoa:</strong> {selectedRecord.specialty}</p>
                  <p><strong>Địa điểm:</strong> {selectedRecord.location}</p>
                </div>
              </div>

              <div className="details-section">
                <h3><Activity className="section-icon" /> Chỉ Số Sinh Tồn</h3>
                <div className="vital-signs">
                  <div className="vital-item">
                    <Heart size={20} />
                    <div>
                      <span className="vital-label">Nhịp tim</span>
                      <span className="vital-value">{selectedRecord.vitalSigns.heartRate}</span>
                    </div>
                  </div>
                  <div className="vital-item">
                    <Activity size={20} />
                    <div>
                      <span className="vital-label">Huyết áp</span>
                      <span className="vital-value">{selectedRecord.vitalSigns.bloodPressure}</span>
                    </div>
                  </div>
                  <div className="vital-item">
                    <Activity size={20} />
                    <div>
                      <span className="vital-label">Nhiệt độ</span>
                      <span className="vital-value">{selectedRecord.vitalSigns.temperature}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3><FileText className="section-icon" /> Triệu Chứng</h3>
                <div className="section-content">
                  <p>{selectedRecord.symptoms}</p>
                </div>
              </div>

              <div className="details-section">
                <h3><FileText className="section-icon" /> Chẩn Đoán</h3>
                <div className="section-content">
                  <p>{selectedRecord.diagnosis}</p>
                </div>
              </div>

              {selectedRecord.prescription.length > 0 && (
                <div className="details-section">
                  <h3><Pill className="section-icon" /> Đơn Thuốc</h3>
                  <div className="prescription-list">
                    {selectedRecord.prescription.map((med, index) => (
                      <div key={index} className="prescription-item">
                        <div className="med-name">{med.name}</div>
                        <div className="med-info">
                          <span>Liều dùng: {med.dosage}</span>
                          <span>Thời gian: {med.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="details-section">
                <h3><FileText className="section-icon" /> Ghi Chú</h3>
                <div className="section-content">
                  <p>{selectedRecord.notes}</p>
                </div>
              </div>

              <div className="details-actions">
                <button className="btn-secondary">
                  <FileText size={18} />
                  Tải xuống hồ sơ
                </button>
                <button className="btn-primary">
                  <Calendar size={18} />
                  Đặt lịch tái khám
                </button>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <FileText size={64} />
              <h3>Chọn một hồ sơ để xem chi tiết</h3>
              <p>Nhấp vào hồ sơ bên trái để xem thông tin chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;