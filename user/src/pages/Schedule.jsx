import { useEffect, useState } from "react";

/* ===== LABEL ===== */
const WEEKDAY_LABEL = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
};

const SHIFT_LABEL = {
  MORNING: "Ca sáng",
  AFTERNOON: "Ca chiều",
};

const SHIFT_TIME = {
  MORNING: "06:30 – 11:30",
  AFTERNOON: "13:00 – 16:00",
};

/* ===== SORT ORDER ===== */

// Thứ tự ngày: 2 – 4 – 6 → 3 – 5 → 7
const WEEKDAY_ORDER = [2, 4, 6, 3, 5, 7];

// Thứ tự ca: sáng → chiều
const SHIFT_ORDER = {
  MORNING: 1,
  AFTERNOON: 2,
};

// Lấy số phòng: TN-001 → 1
const getRoomOrder = (room = "") => {
  const num = Number(room.replace(/\D/g, ""));
  return isNaN(num) ? 9999 : num;
};

export default function Schedule() {
  const [groups, setGroups] = useState([]); // backend đã group sẵn
  const [loading, setLoading] = useState(true);
  const [openDept, setOpenDept] = useState(null);

  const toggleDept = (deptId) => {
    setOpenDept((prev) => (prev === deptId ? null : deptId));
  };

  /* ===== FETCH PUBLIC SCHEDULE ===== */
  useEffect(() => {
    fetch("http://localhost:5000/api/schedules", {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) {
          setLoading(false);
          return;
        }

        setGroups(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch schedule error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="schedule-page">
      {/* ===== BANNER ===== */}
      <div
        className="page-banner"
        style={{
          backgroundImage: 'url("/icons/hand-banner.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "90px 0",
          color: "#fff",
        }}
      >
        <div className="container">
          <div className="breadcrumb">
            <span>Trang chủ / </span>
            <span>Lịch khám</span>
          </div>
          <h1 className="banner-title">LỊCH KHÁM BỆNH</h1>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="container">
        {loading && <p>Đang tải lịch khám…</p>}

        {!loading && groups.length === 0 && (
          <p className="empty">Chưa có dữ liệu lịch khám</p>
        )}

        {!loading &&
          groups.map((group) => {
            const isOpen = openDept === group.departmentId;

            return (
              <div
                key={group.departmentId}
                className={`schedule-section ${isOpen ? "open" : ""}`}
              >
                {/* ===== HEADER KHOA ===== */}
                <div
                  className="department-header"
                  onClick={() => toggleDept(group.departmentId)}
                >
                  <h3 className="department-title">
                    {group.departmentName}
                  </h3>
                  <button className="toggle-btn">
                    {isOpen ? "Thu gọn ▲" : "Xem lịch ▼"}
                  </button>
                </div>

                {/* ===== TABLE ===== */}
                {isOpen && (
                  <table className="schedule-table">
                    <thead>
                      <tr>
                        <th>BÁC SĨ</th>
                        <th>CHUYÊN MÔN</th>
                        <th>PHÒNG</th>
                        <th>LỊCH TRONG TUẦN</th>
                      </tr>
                    </thead>

                    <tbody>
                      {[...group.doctors]
                        .sort(
                          (a, b) =>
                            getRoomOrder(a.room) -
                            getRoomOrder(b.room)
                        )
                        .map((row) => (
                          <tr
                            key={`${row.doctorId}_${row.room}`}
                          >
                            <td>{row.doctorName}</td>
                            <td>{row.specialty}</td>
                            <td>{row.room}</td>

                            <td>
                              {row.schedule &&
                              Object.keys(row.schedule).length >
                                0 ? (
                                Object.entries(row.schedule)
                                  .map(([day, shifts]) => ({
                                    day: Number(day),
                                    shifts,
                                  }))
                                  .sort(
                                    (a, b) =>
                                      WEEKDAY_ORDER.indexOf(
                                        a.day
                                      ) -
                                      WEEKDAY_ORDER.indexOf(
                                        b.day
                                      )
                                  )
                                  .map(({ day, shifts }) => (
                                    <div
                                      key={`${row.doctorId}_${day}`}
                                      className="schedule-inline"
                                    >
                                      <strong>
                                        {WEEKDAY_LABEL[day]}:
                                      </strong>{" "}
                                      {[...shifts]
                                        .sort(
                                          (a, b) =>
                                            SHIFT_ORDER[a] -
                                            SHIFT_ORDER[b]
                                        )
                                        .map((s) => (
                                          <span
                                            key={`${row.doctorId}_${day}_${s}`}
                                            className={`shift-badge ${s.toLowerCase()}`}
                                          >
                                            {SHIFT_LABEL[s]} (
                                            {SHIFT_TIME[s]})
                                          </span>
                                        ))}
                                    </div>
                                  ))
                              ) : (
                                <span className="empty">
                                  Chưa có lịch
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
