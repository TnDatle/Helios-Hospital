import { useState } from "react";

const schedules = [
  {
    id: "s01",
    departmentId: "dep01",
    date: "20/12/2025",
    session: "Ca sáng",
    time: "06:30 – 11:30",
    room: "Phòng 101",
    current: 8,
    max: 20,
  },
  {
    id: "s02",
    departmentId: "dep01",
    date: "20/12/2025",
    session: "Ca chiều",
    time: "13:00 – 16:00",
    room: "Phòng 202",
    current: 20,
    max: 20,
  },
];

export default function StepSchedule({ department, onBack, onSelect }) {
  const [selected, setSelected] = useState(null);

  const list = schedules.filter(
    (s) => s.departmentId === department.id
  );

  return (
    <>
      <h4>Chọn lịch khám</h4>
      <div className="booking-meta">
        Khoa: <strong>{department.name}</strong>
      </div>

      <div className="booking-grid">
        {list.map((s) => {
          const isFull = s.current >= s.max;

          return (
            <div
              key={s.id}
              className={`booking-card ${
                selected?.id === s.id ? "selected" : ""
              } ${isFull ? "disabled" : ""}`}
              onClick={() => !isFull && setSelected(s)}
            >
              <h5>{s.session}</h5>
              <p className="sub">Ngày: {s.date}</p>
              <p className="sub">Giờ: {s.time}</p>
              <p className="sub">Phòng: {s.room}</p>

              <span
                className={`booking-badge ${
                  isFull ? "danger" : "success"
                }`}
              >
                {isFull
                  ? "Đã đủ bệnh nhân"
                  : `Còn ${s.max - s.current} suất`}
              </span>
            </div>
          );
        })}
      </div>

      <div className="booking-actions">
        <button className="booking-btn" onClick={onBack}>
          Quay lại
        </button>
        <button
          className="booking-btn primary"
          disabled={!selected}
          onClick={() => onSelect(selected)}
        >
          Tiếp tục
        </button>
      </div>
    </>
  );
}
