import { useEffect, useState } from "react";
import "../../styles/doctor/queue.css";

const API_BASE = "http://localhost:5000/api";

export default function Queue() {
  const [queue, setQueue] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [completedToday, setCompletedToday] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch queue data
  const fetchQueue = async () => {
    try {
      // TODO: Replace with actual API call
      // Mock data for now
      const mockQueue = [
        {
          id: 1,
          stt: 1,
          patientName: "Nguyễn Văn A",
          patientCode: "BN001",
          reason: "Khám định kỳ",
          registeredTime: "08:00",
          status: "waiting",
        },
        {
          id: 2,
          stt: 2,
          patientName: "Trần Thị B",
          patientCode: "BN002",
          reason: "Tái khám tim mạch",
          registeredTime: "08:15",
          status: "waiting",
        },
        {
          id: 3,
          stt: 3,
          patientName: "Lê Văn C",
          patientCode: "BN003",
          reason: "Khám bệnh",
          registeredTime: "08:30",
          status: "waiting",
        },
        {
          id: 4,
          stt: 4,
          patientName: "Phạm Thị D",
          patientCode: "BN004",
          reason: "Khám tổng quát",
          registeredTime: "08:45",
          status: "waiting",
        },
      ];

      const mockCompleted = [
        {
          id: 101,
          patientName: "Hoàng Văn E",
          patientCode: "BN100",
          completedTime: "07:45",
          diagnosis: "Huyết áp cao",
        },
      ];

      setQueue(mockQueue);
      setCompletedToday(mockCompleted);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching queue:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();

    // Auto refresh every 10 seconds
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, []);

  // Call next patient
  const handleCallNext = () => {
    if (queue.length === 0) return;

    const nextPatient = queue[0];
    setCurrentPatient(nextPatient);
    setQueue((prev) => prev.slice(1));
  };

  // Complete current patient
  const handleComplete = () => {
    if (!currentPatient) return;

    const completed = {
      ...currentPatient,
      completedTime: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      diagnosis: "Chưa ghi chú", // TODO: Add diagnosis form
    };

    setCompletedToday((prev) => [completed, ...prev]);
    setCurrentPatient(null);
  };

  // Skip current patient
  const handleSkip = () => {
    if (!currentPatient) return;

    setQueue((prev) => [...prev, currentPatient]);
    setCurrentPatient(null);
  };

  if (loading) {
    return (
      <div className="queue-page">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="queue-page">
      {/* HEADER */}
      <div className="queue-header">
        <div>
          <h1 className="queue-title">Hàng đợi bệnh nhân</h1>
          <p className="queue-subtitle">
            Còn {queue.length} bệnh nhân đang chờ
          </p>
        </div>
        <div className="queue-stats">
          <div className="stat-item">
            <span className="stat-number">{completedToday.length}</span>
            <span className="stat-label">Đã khám</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{queue.length}</span>
            <span className="stat-label">Đang chờ</span>
          </div>
        </div>
      </div>

      {/* CURRENT PATIENT */}
      <div className="current-section">
        <h2>Bệnh nhân hiện tại</h2>

        {currentPatient ? (
          <div className="current-patient-card">
            <div className="patient-info">
              <div className="patient-avatar">
                <span className="avatar-text">
                  {currentPatient.patientName.charAt(0)}
                </span>
              </div>
              <div className="patient-details">
                <h3>{currentPatient.patientName}</h3>
                <p className="patient-code">Mã BN: {currentPatient.patientCode}</p>
                <p className="patient-reason">{currentPatient.reason}</p>
              </div>
            </div>

            <div className="patient-actions">
              <button className="btn-skip" onClick={handleSkip}>
                ⏭ Bỏ qua
              </button>
              <button className="btn-complete" onClick={handleComplete}>
                ✓ Hoàn thành
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-current">
            <span className="empty-icon">👤</span>
            <p>Chưa có bệnh nhân</p>
            <button
              className="btn-call-next"
              onClick={handleCallNext}
              disabled={queue.length === 0}
            >
              📢 Gọi bệnh nhân tiếp theo
            </button>
          </div>
        )}
      </div>

      {/* WAITING QUEUE */}
      <div className="queue-section">
        <h2>Danh sách chờ khám</h2>

        {queue.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">✓</span>
            <p>Không còn bệnh nhân trong hàng đợi</p>
          </div>
        ) : (
          <div className="queue-list">
            {queue.map((patient) => (
              <div key={patient.id} className="queue-item">
                <div className="queue-number">{patient.stt}</div>
                <div className="queue-info">
                  <h4>{patient.patientName}</h4>
                  <p className="queue-meta">
                    <span>{patient.patientCode}</span>
                    <span>•</span>
                    <span>{patient.registeredTime}</span>
                  </p>
                  <p className="queue-reason">{patient.reason}</p>
                </div>
                <div className="queue-badge waiting">Đang chờ</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMPLETED TODAY */}
      <div className="queue-section">
        <h2>Đã khám hôm nay ({completedToday.length})</h2>

        {completedToday.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p>Chưa có bệnh nhân nào được khám</p>
          </div>
        ) : (
          <div className="completed-list">
            {completedToday.map((patient) => (
              <div key={patient.id} className="completed-item">
                <div className="completed-info">
                  <h4>{patient.patientName}</h4>
                  <p className="completed-meta">
                    <span>{patient.patientCode}</span>
                    <span>•</span>
                    <span>Hoàn thành lúc {patient.completedTime}</span>
                  </p>
                  {patient.diagnosis && (
                    <p className="completed-diagnosis">
                      Chẩn đoán: {patient.diagnosis}
                    </p>
                  )}
                </div>
                <div className="queue-badge completed">✓ Đã khám</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}