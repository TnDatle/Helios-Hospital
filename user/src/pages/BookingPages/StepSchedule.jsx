import { useEffect, useState, useMemo } from "react";

const WEEKDAY_LABEL = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  7: "Chủ nhật",
};

const SHIFT_TIME = {
  MORNING: "06:30 – 11:30",
  AFTERNOON: "13:00 – 16:00",
};


export default function StepSchedule({ doctor, onBack, onSelect }) {
  const [schedules, setSchedules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctor?.id) return;

    fetch(`http://localhost:5000/api/schedules/${doctor.id}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((res) => {
        setSchedules(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch schedules error:", err);
        setLoading(false);
      });

    console.log("[StepSchedule] doctor =", doctor);
  }, [doctor]);

  const morningSchedules = useMemo(
    () =>
      schedules
        .filter((s) => s.shiftId === "MORNING")
        .sort((a, b) => a.weekday - b.weekday),
    [schedules]
  );

  const afternoonSchedules = useMemo(
    () =>
      schedules
        .filter((s) => s.shiftId === "AFTERNOON")
        .sort((a, b) => a.weekday - b.weekday),
    [schedules]
  );


  if (loading) {
    return <p>Đang tải lịch làm việc...</p>;
  }

  return (
    <>
      <h4>Chọn lịch khám</h4>

      <div className="booking-meta">
        Bác sĩ: <strong>{doctor.name}</strong>
      </div>

      <div className="schedule-columns">
        {/* CA SÁNG */}
        <div className="schedule-column">
          <h5 className="schedule-title">Ca sáng</h5>

          {morningSchedules.map((s) => (
            <div
              key={s.id}
              className={`booking-card ${
                selected?.id === s.id ? "selected" : ""
              }`}
              onClick={() => setSelected(s)}
            >
              <h6>{WEEKDAY_LABEL[s.weekday]}</h6>
              <p className="sub">{SHIFT_TIME[s.shiftId]}</p>
              <p className="sub">Phòng: {s.room}</p>
            </div>

          ))}

          {morningSchedules.length === 0 && (
            <p className="empty">Không có lịch ca sáng</p>
          )}
        </div>

        {/* CA CHIỀU */}
        <div className="schedule-column">
          <h5 className="schedule-title">Ca chiều</h5>

          {afternoonSchedules.map((s) => (
            <div
              key={s.id}
              className={`booking-card ${
                selected?.id === s.id ? "selected" : ""
              }`}
              onClick={() => setSelected(s)}
            >
              <h6>{WEEKDAY_LABEL[s.weekday]}</h6>
              <p className="sub">{SHIFT_TIME[s.shiftId]}</p>
              <p className="sub">Phòng: {s.room}</p>
            </div>
          ))}

          {afternoonSchedules.length === 0 && (
            <p className="empty">Không có lịch ca chiều</p>
          )}
        </div>
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
