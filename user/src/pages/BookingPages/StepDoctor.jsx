import { useEffect, useState } from "react";

export default function StepDoctor({ department, onBack, onSelect }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const sortedDoctors = [...doctors].sort((a, b) => {
    const priority = {
      "Trưởng khoa": 1,
      "Phó khoa": 2,
    };

    return (priority[a.role] || 99) - (priority[b.role] || 99);
  });

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
        {sortedDoctors.map((doc) => (
          <div
            key={doc.id}
            className="booking-card"
            onClick={() => onSelect(doc)}
          >
            <div className="doctor-header">
              <h5>{doc.name}</h5>

              {(doc.role === "Trưởng khoa" ||
                doc.role === "Phó khoa") && (
                <span
                  className={`badge ${
                    doc.role === "Trưởng khoa"
                      ? "head"
                      : "deputy"
                  }`}
                >
                  {doc.role}
                </span>
              )}
            </div>

            <p className="sub">
              Chuyên môn: {doc.specialty}
            </p>
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
