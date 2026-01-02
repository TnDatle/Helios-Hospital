import { useEffect, useState } from "react";
import "../styles/schedule.css";

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

export default function Schedule() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // GROUP THEO KHOA (1 khoa = 1 bảng)
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
          groups.map((group) => (
            <div
              key={group.departmentId}
              className="schedule-section"
            >
              <h3 className="department-title">
                {group.departmentName}
              </h3>

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

                      {/* ===== LỊCH GOM TRONG 1 Ô ===== */}
                      <td>
                        {row.schedule &&
                        Object.keys(row.schedule).length >
                          0 ? (
                          Object.entries(row.schedule)
                            .sort((a, b) => a[0] - b[0])
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
            </div>
          ))}
      </div>
    </div>
  );
}
