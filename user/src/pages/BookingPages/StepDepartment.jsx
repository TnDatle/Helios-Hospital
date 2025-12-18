const departments = [
  { id: "dep01", name: "Nội tổng quát" },
  { id: "dep02", name: "Ngoại tổng quát" },
  { id: "dep03", name: "Tim mạch & Mạch máu" },
];

export default function StepDepartment({ onSelect }) {
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
