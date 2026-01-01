import { useEffect, useState } from "react";

export default function StepDoctor({ department, onBack, onSelect }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!department?.id) return;

    fetch(
      `http://localhost:5000/api/booking/doctors?departmentId=${department.id}`,
      { cache: "no-store" }
    )
      .then((res) => {
        if (res.status === 304) {
          return { data: [] };
        }
        return res.json();
      })
      .then((res) => {
        setDoctors(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch doctors error:", err);
        setLoading(false);
      });
  }, [department]);

  if (loading) {
    return <p>Đang tải danh sách bác sĩ...</p>;
  }

  return (
    <>
      <h4>Chọn bác sĩ</h4>

      <div className="booking-meta">
        Khoa: {department.name}
      </div>

      <div className="booking-grid">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="booking-card"
            onClick={() => onSelect(doc)}
          >
            <h5>{doc.name}</h5>
            <p className="sub">{doc.specialty}</p>
          </div>
        ))}
      </div>

      <div className="booking-actions">
        <button className="booking-btn" onClick={onBack}>
          Quay lại
        </button>
      </div>
    </>
  );
}
