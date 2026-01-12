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

// Thứ tự ngày: 2–4–6 → 3–5 → 7
const WEEKDAY_ORDER = [2, 4, 6, 3, 5, 7];

// Thứ tự phòng: TN-001 → 1
const getRoomOrder = (room = "") => {
  const num = Number(room.replace(/\D/g, ""));
  return isNaN(num) ? 9999 : num;
};

/**
 * =====================================================
 * SINH NGÀY THEO THỨ (14 NGÀY TỚI)
 * =====================================================
 */
function getNextDatesByWeekday(weekday, days = 14) {
  const result = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const jsDay = d.getDay() === 0 ? 7 : d.getDay();
    if (jsDay === weekday) {
      result.push({
        date: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString("vi-VN"),
      });
    }
  }
  return result;
}

export default function StepSchedule({ doctor, onBack, onSelect }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  /* ===== FETCH ===== */
  useEffect(() => {
    if (!doctor?.id) return;

    fetch(`http://localhost:5000/api/schedules/doctor/${doctor.id}`, {
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
  }, [doctor]);

  /* ===== SORTED SCHEDULES ===== */

  const morningSchedules = useMemo(() => {
    return schedules
      .filter((s) => s.shiftId === "MORNING")
      .sort((a, b) => {
        // 1. phòng
        const roomDiff =
          getRoomOrder(a.room) - getRoomOrder(b.room);
        if (roomDiff !== 0) return roomDiff;

        // 2. ngày
        return (
          WEEKDAY_ORDER.indexOf(a.weekday) -
          WEEKDAY_ORDER.indexOf(b.weekday)
        );
      });
  }, [schedules]);

  const afternoonSchedules = useMemo(() => {
    return schedules
      .filter((s) => s.shiftId === "AFTERNOON")
      .sort((a, b) => {
        const roomDiff =
          getRoomOrder(a.room) - getRoomOrder(b.room);
        if (roomDiff !== 0) return roomDiff;

        return (
          WEEKDAY_ORDER.indexOf(a.weekday) -
          WEEKDAY_ORDER.indexOf(b.weekday)
        );
      });
  }, [schedules]);

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
        {/* ================= CA SÁNG ================= */}
        <div className="schedule-column">
          <h5 className="schedule-title">Ca sáng</h5>

          {morningSchedules.map((s) => (
            <div
              key={s.id}
              className={`booking-card ${
                selectedSchedule?.id === s.id ? "selected" : ""
              }`}
            >
              <h6>{WEEKDAY_LABEL[s.weekday]}</h6>
              <p className="sub">{SHIFT_TIME[s.shiftId]}</p>
              <p className="sub">Phòng: {s.room}</p>

              <div className="date-list">
                {getNextDatesByWeekday(s.weekday).map((d) => (
                  <button
                    key={`${s.id}_${d.date}`}
                    className={`date-chip ${
                      selectedSchedule?.id === s.id &&
                      selectedDate === d.date
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedSchedule(s);
                      setSelectedDate(d.date);
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {morningSchedules.length === 0 && (
            <p className="empty">Không có lịch ca sáng</p>
          )}
        </div>

        {/* ================= CA CHIỀU ================= */}
        <div className="schedule-column">
          <h5 className="schedule-title">Ca chiều</h5>

          {afternoonSchedules.map((s) => (
            <div
              key={s.id}
              className={`booking-card ${
                selectedSchedule?.id === s.id ? "selected" : ""
              }`}
            >
              <h6>{WEEKDAY_LABEL[s.weekday]}</h6>
              <p className="sub">{SHIFT_TIME[s.shiftId]}</p>
              <p className="sub">Phòng: {s.room}</p>

              <div className="date-list">
                {getNextDatesByWeekday(s.weekday).map((d) => (
                  <button
                    key={`${s.id}_${d.date}`}
                    className={`date-chip ${
                      selectedSchedule?.id === s.id &&
                      selectedDate === d.date
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedSchedule(s);
                      setSelectedDate(d.date);
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {afternoonSchedules.length === 0 && (
            <p className="empty">Không có lịch ca chiều</p>
          )}
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="booking-actions">
        <button className="booking-btn" onClick={onBack}>
          Quay lại
        </button>

        <button
          className="booking-btn primary"
          disabled={!selectedSchedule || !selectedDate}
          onClick={() =>
            onSelect({
              ...selectedSchedule,
              date: selectedDate,
            })
          }
        >
          Tiếp tục
        </button>
      </div>
    </>
  );
}
