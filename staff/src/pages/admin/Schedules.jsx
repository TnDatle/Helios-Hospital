import { useEffect, useState } from "react";
import "../../styles/admin/schedules.css";

const API_BASE = "http://localhost:5000/api";

/* ===== CONSTANT ===== */
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

export default function Schedules() {
  /* ===== DATA ===== */
  const [groups, setGroups] = useState([]); // <-- BACKEND GROUP SẴN
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== UI ===== */
  const [openDept, setOpenDept] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ===== FORM ===== */
  const [form, setForm] = useState({
    doctorId: "",
    departmentId: "",
    room: "",
  });
  const [selectedSlots, setSelectedSlots] = useState([]); // [{weekday, shift}]

  /* ===== FETCH ===== */
  const fetchSchedules = async () => {
    const res = await fetch(`${API_BASE}/schedules`);
    const json = await res.json();
    if (json.success) setGroups(json.data);
  };

  const fetchDoctors = async () => {
    const res = await fetch(`${API_BASE}/doctors`);
    const json = await res.json();
    if (json.success) setDoctors(json.data || []);
  };

  useEffect(() => {
    Promise.all([fetchSchedules(), fetchDoctors()]).finally(() =>
      setLoading(false)
    );
  }, []);

  /* ===== MATRIX LOGIC ===== */
  const toggleSlot = (weekday, shift) => {
    const exists = selectedSlots.some(
      (s) => s.weekday === weekday && s.shift === shift
    );

    setSelectedSlots((prev) =>
      exists
        ? prev.filter(
            (s) => !(s.weekday === weekday && s.shift === shift)
          )
        : [...prev, { weekday, shift }]
    );
  };

  /* ===== MODAL ===== */
  const openCreateModal = (departmentId) => {
    setForm({ doctorId: "", departmentId, room: "" });
    setSelectedSlots([]);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  /* ===== CRUD ===== */
  const submitCreate = async () => {
    if (!form.doctorId || !form.room || selectedSlots.length === 0) {
      alert(" Vui lòng chọn bác sĩ, phòng và lịch khám");
      return;
    }

    const res = await fetch(`${API_BASE}/schedules/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId: form.doctorId,
        room: form.room,
        slots: selectedSlots,
      }),
    });

    const json = await res.json();

    if (!json.success) {
      alert(`❌ ${json.message}`);
      return;
    }

    alert(" Thêm lịch khám thành công");
    closeModal();
    fetchSchedules();
  };


  const deleteSchedule = async (scheduleId) => {
    if (!scheduleId) {
      alert("❌ Không tìm thấy ID lịch");
      return;
    }

    const ok = window.confirm(
      " Bạn có chắc chắn muốn xoá lịch khám này?\nHành động này không thể hoàn tác."
    );
    if (!ok) return;

    const res = await fetch(
      `${API_BASE}/schedules/${scheduleId}`,
      { method: "DELETE" }
    );

    const json = await res.json();
    if (!json.success) {
      alert(` ${json.message}`);
      return;
    }

    alert(" Đã xoá lịch khám thành công");
    fetchSchedules();
  };


  /* ===== RENDER ===== */
  return (
    <div className="admin-page">
      <h1 className="admin-title">Lịch khám bác sĩ (theo tuần)</h1>

      {loading && <p>Đang tải…</p>}

      {!loading && groups.length === 0 && (
        <p className="empty">Chưa có dữ liệu</p>
      )}

      {!loading &&
        groups.map((group) => {
          const isOpen = openDept === group.departmentId;

          return (
            <div
              key={group.departmentId}
              className="schedule-section"
            >
              {/* ===== HEADER ===== */}
              <div
                className="department-header"
                onClick={() =>
                  setOpenDept(
                    isOpen ? null : group.departmentId
                  )
                }
              >
                <h3 className="department-title">
                  {group.departmentName}
                </h3>
                <div className="header-actions">
                  <button
                    className="add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCreateModal(group.departmentId);
                    }}
                  >
                    + Thêm lịch
                  </button>
                  <span className="toggle-btn">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>
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
                      <tr
                        key={`${row.doctorId}_${row.room}`}
                      >
                        <td>{row.doctorName}</td>
                        <td>{row.specialty}</td>
                        <td>{row.room}</td>
                        <td>
                          {Object.keys(row.schedule).length >
                          0 ? (
                            Object.entries(row.schedule).map(
                              ([day, shifts]) => (
                                <div
                                  key={`${row.doctorId}_${day}`}
                                  className="schedule-inline"
                                >
                                  <strong>
                                    {WEEKDAY_LABEL[day]}:
                                  </strong>{" "}
                                  {shifts.map((s) => (
                                    <span
                                      key={`${row.doctorId}_${day}_${s}`}
                                      className={`shift-badge ${s.toLowerCase()}`}
                                    >
                                      {SHIFT_LABEL[s]} (
                                      {SHIFT_TIME[s]})
                                      <button
                                        className="icon-btn delete"
                                        onClick={() =>
                                          deleteSchedule(
                                            row.scheduleMap?.[
                                              `${day}_${s}`
                                            ]
                                          )
                                        }
                                      >
                                        🗑
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )
                            )
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

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Thêm lịch khám</h3>

            <select
              value={form.doctorId}
              onChange={(e) =>
                setForm({
                  ...form,
                  doctorId: e.target.value,
                })
              }
            >
              <option value="">-- Chọn bác sĩ --</option>
              {doctors
                .filter(
                  (d) =>
                    d.departmentId === form.departmentId
                )
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
            </select>

            <input
              placeholder="Phòng khám"
              value={form.room}
              onChange={(e) =>
                setForm({ ...form, room: e.target.value })
              }
            />

            <div className="schedule-matrix">
              <div className="matrix-header">
                <div />
                {Object.entries(WEEKDAY_LABEL).map(
                  ([k, v]) => (
                    <div key={k} className="matrix-col">
                      {v}
                    </div>
                  )
                )}
              </div>

              {Object.entries(SHIFT_LABEL).map(
                ([shiftKey, shiftLabel]) => (
                  <div
                    key={shiftKey}
                    className="matrix-row"
                  >
                    <div className="matrix-row-title">
                      {shiftLabel}
                    </div>
                    {Object.keys(WEEKDAY_LABEL).map(
                      (day) => {
                        const active =
                          selectedSlots.some(
                            (s) =>
                              s.weekday === Number(day) &&
                              s.shift === shiftKey
                          );

                        return (
                          <div
                            key={`${shiftKey}_${day}`}
                            className={`matrix-cell ${
                              active ? "active" : ""
                            }`}
                            onClick={() =>
                              toggleSlot(
                                Number(day),
                                shiftKey
                              )
                            }
                          >
                            {active && "✓"}
                          </div>
                        );
                      }
                    )}
                  </div>
                )
              )}
            </div>

            <span className="hint">
              Click để chọn lịch – click lại để bỏ
            </span>

            <div className="modal-actions">
              <button onClick={closeModal}>Huỷ</button>
              <button onClick={submitCreate}>
                Tạo lịch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
