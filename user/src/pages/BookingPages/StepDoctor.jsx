const doctors = [
  {
    id: "d01",
    name: "BS. Trần Văn Minh",
    scheduleIds: ["s01"],
  },
  {
    id: "d02",
    name: "BS. Nguyễn Thị Lan",
    scheduleIds: ["s01"],
  },
];

export default function StepDoctor({ schedule, onBack, onSelect }) {
  const list = doctors.filter((d) =>
    d.scheduleIds.includes(schedule.id)
  );

  return (
    <>
      <h4>Chọn bác sĩ</h4>
      <div className="booking-meta">
        {schedule.session} · {schedule.time}
      </div>

      <div className="booking-grid">
        {list.map((doc) => (
          <div
            key={doc.id}
            className="booking-card"
            onClick={() => onSelect(doc)}
          >
            <h5>{doc.name}</h5>
            <p className="sub">Bác sĩ chuyên khoa</p>
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
