import { useEffect, useState } from "react";

export default function StepDepartment({ onSelect }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/departments", {
      cache: "no-store",
    })
      .then((res) => {
        if (res.status === 304) {
          return { data: [] };
        }
        return res.json();
      })
      .then((res) => {
        setDepartments(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch departments error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Đang tải danh sách khoa...</p>;
  }

  return (
    <>
      <h4>Chọn khoa</h4>

      <div className="booking-grid">
        {departments.map((dep) => (
          <div
            key={dep.id}
            className="booking-card"
            onClick={() => onSelect(dep)}
          >
            <h5>{dep.name}</h5>
            <p className="sub">Khám và điều trị chuyên khoa</p>
          </div>
        ))}
      </div>
    </>
  );
}
