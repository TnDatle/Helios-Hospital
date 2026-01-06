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

const WEEKDAY_SEQUENCE = [1, 3, 5, 2, 4, 6];

const normalizeDay = (day) => {
  // nếu là số string: "1" -> 1
  if (!isNaN(day)) return Number(day);

  // nếu là "thu2", "thu3"...
  if (typeof day === "string") {
    const match = day.match(/\d+/);
    if (match) return Number(match[0]) - 1; 
  }

  return null;
};


export default function Schedule() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDept, setOpenDept] = useState(null);

  const toggleDept = (deptId) => {
    setOpenDept((prev) => (prev === deptId ? null : deptId));
  };

  /* ===== FETCH DATA ===== */
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

        const groupedByDepartment = res.data.reduce((acc, row) => {
          if (!acc[row.departmentId]) {
            acc[row.departmentId] = {
              departmentId: row.departmentId,
              departmentName: row.departmentName,
              doctors: [],
            };
          }

          acc[row.departmentId].doctors.push(row);
          return acc;
        }, {});

        setGroups(Object.values(groupedByDepartment));
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
                      {group.doctors.map((row) => (
                        <tr key={row.doctorId}>
                          <td>{row.doctorName}</td>
                          <td>{row.specialty}</td>
                          <td>{row.room}</td>

                          <td>
                            {row.schedule &&
                            Object.keys(row.schedule).length > 0 ? (
                              Object.entries(row.schedule)
                                .sort(
                                  ([dayA], [dayB]) =>
                                    WEEKDAY_SEQUENCE.indexOf(normalizeDay(dayA)) -
                                    WEEKDAY_SEQUENCE.indexOf(normalizeDay(dayB))
                                )
                                .map(([day, shifts]) => (
                                  <div
                                    key={day}
                                    className="schedule-inline"
                                  >
                                    <strong>
                                      {WEEKDAY_LABEL[day]}:
                                    </strong>{" "}
                                    {shifts.map((s) => (
                                      <span
                                        key={s}
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
