import { useEffect, useState, useCallback } from "react";
import "../../styles/admin/schedules.css";

const API_BASE = "http://localhost:5000/api";

/* ===== CONSTANTS ===== */
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

const INITIAL_FORM = {
  doctorId: "",
  departmentId: "",
  room: "",
};

export default function Schedules() {
  const [groups, setGroups] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDept, setOpenDept] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [selectedSlots, setSelectedSlots] = useState([]);

  /* ===== API CALLS ===== */
  const fetchSchedules = async () => {
    try {
      const res = await fetch(`${API_BASE}/schedules`);
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (error) {
      console.error("Error fetching schedules:", error);
      return [];
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE}/departments`);
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (error) {
      console.error("Error fetching departments:", error);
      return [];
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${API_BASE}/doctors`);
      const json = await res.json();
      if (json.success) setDoctors(json.data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    }
  };

  const getRoomOrder = (room) => {
  if (!room) return Number.MAX_SAFE_INTEGER;

  // Lấy phần sau dấu "-"
  const parts = room.split("-");
  if (parts.length < 2) return Number.MAX_SAFE_INTEGER;

  const num = parseInt(parts[1], 10);
  return isNaN(num) ? Number.MAX_SAFE_INTEGER : num;
};


  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [scheduleData, deptData] = await Promise.all([
        fetchSchedules(),
        fetchDepartments(),
        fetchDoctors(),
      ]);

      const mergedGroups = deptData.map((dept) => {
        const existingSchedule = scheduleData.find(
          (s) => s.departmentId === dept.id
        );

        return {
          departmentId: dept.id,
          departmentName: dept.name,
          doctors: existingSchedule?.doctors || [],
        };
      });

      setGroups(mergedGroups);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ===== SLOT SELECTION ===== */
  const toggleSlot = useCallback((weekday, shift) => {
    setSelectedSlots((prev) => {
      const exists = prev.some(
        (s) => s.weekday === weekday && s.shift === shift
      );

      return exists
        ? prev.filter((s) => !(s.weekday === weekday && s.shift === shift))
        : [...prev, { weekday, shift }];
    });
  }, []);

  /* ===== MODAL HANDLERS ===== */
  const openCreateModal = useCallback((departmentId) => {
    setForm({ ...INITIAL_FORM, departmentId });
    setSelectedSlots([]);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setForm(INITIAL_FORM);
    setSelectedSlots([]);
  }, []);

  /* ===== CRUD OPERATIONS ===== */
  const submitCreate = async () => {
    if (!form.doctorId || !form.room || selectedSlots.length === 0) {
      alert("Vui lòng chọn bác sĩ, phòng và lịch khám");
      return;
    }

    try {
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
      loadData();
    } catch (error) {
      console.error("Error creating schedule:", error);
      alert(" Có lỗi xảy ra khi tạo lịch khám");
    }
  };

  const deleteSchedule = async (scheduleId) => {
    if (!scheduleId) {
      alert(" Không tìm thấy ID lịch");
      return;
    }

    const confirmed = window.confirm(
      " Bạn có chắc chắn muốn xoá lịch khám này?\nHành động này không thể hoàn tác."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/schedules/${scheduleId}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!json.success) {
        alert(`❌ ${json.message}`);
        return;
      }

      alert(" Đã xoá lịch khám thành công");
      loadData();
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert(" Có lỗi xảy ra khi xoá lịch khám");
    }
  };

  /* ===== FORM HANDLERS ===== */
  const handleDoctorChange = (e) => {
    setForm({ ...form, doctorId: e.target.value });
  };

  const handleRoomChange = (e) => {
    setForm({ ...form, room: e.target.value });
  };

  /* ===== COMPUTED VALUES ===== */
  const filteredDoctors = doctors.filter(
    (d) => d.departmentId === form.departmentId
  );

  /* ===== SUB-COMPONENTS ===== */
  const renderScheduleCell = (row) => {
    if (Object.keys(row.schedule).length === 0) {
      return <span className="empty">Chưa có lịch</span>;
    }

    return Object.entries(row.schedule).map(([day, shifts]) => {
      // Sắp xếp ca: MORNING trước, AFTERNOON sau
      const sortedShifts = [...shifts].sort((a, b) => {
        const order = { MORNING: 1, AFTERNOON: 2 };
        return order[a] - order[b];
      });

      return (
        <div key={`${row.doctorId}_${day}`} className="schedule-inline">
          <strong>{WEEKDAY_LABEL[day]}:</strong>{" "}
          {sortedShifts.map((s) => (
            <span
              key={`${row.doctorId}_${day}_${s}`}
              className={`shift-badge ${s.toLowerCase()}`}
            >
              {SHIFT_LABEL[s]} ({SHIFT_TIME[s]})
              <button
                className="icon-btn delete"
                onClick={() =>
                  deleteSchedule(row.scheduleMap?.[`${day}_${s}`])
                }
              >
                🗑
              </button>
            </span>
          ))}
        </div>
      );
    });
  };

  const renderEmptyState = (departmentId) => (
    <div className="empty-schedule">
      <p>Khoa này chưa có lịch khám nào.</p>
      <button
        className="add-btn"
        onClick={() => openCreateModal(departmentId)}
      >
        + Thêm lịch đầu tiên
      </button>
    </div>
  );

  const renderScheduleTable = (group) => (
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
            .sort((a, b) => getRoomOrder(a.room) - getRoomOrder(b.room))
            .map((row) => (
          <tr key={`${row.doctorId}_${row.room}`}>
            <td>{row.doctorName}</td>
            <td>{row.specialty}</td>
            <td>{row.room}</td> 
            <td>{renderScheduleCell(row)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderMatrixCell = (shiftKey, day) => {
    const isActive = selectedSlots.some(
      (s) => s.weekday === Number(day) && s.shift === shiftKey
    );

    return (
      <div
        key={`${shiftKey}_${day}`}
        className={`matrix-cell ${isActive ? "active" : ""}`}
        onClick={() => toggleSlot(Number(day), shiftKey)}
      >
        {isActive && "✓"}
      </div>
    );
  };

  /* ===== MAIN RENDER ===== */
  if (loading) {
    return (
      <div className="admin-page">
        <h1 className="admin-title">Lịch khám bác sĩ (theo tuần)</h1>
        <p>Đang tải…</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-title">Lịch khám bác sĩ (theo tuần)</h1>

      {groups.length === 0 && <p className="empty">Chưa có dữ liệu</p>}

      {groups.map((group) => {
        const isOpen = openDept === group.departmentId;

        return (
          <div key={group.departmentId} className="schedule-section">
            {/* HEADER */}
            <div
              className="department-header"
              onClick={() => setOpenDept(isOpen ? null : group.departmentId)}
            >
              <h3 className="department-title">{group.departmentName}</h3>
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
                <span className="toggle-btn">{isOpen ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* CONTENT */}
            {isOpen && (
              <>
                {group.doctors.length === 0
                  ? renderEmptyState(group.departmentId)
                  : renderScheduleTable(group)}
              </>
            )}
          </div>
        );
      })}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Thêm lịch khám</h3>

            <select value={form.doctorId} onChange={handleDoctorChange}>
              <option value="">-- Chọn bác sĩ --</option>
              {filteredDoctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Phòng khám"
              value={form.room}
              onChange={handleRoomChange}
            />

            <div className="schedule-matrix">
              <div className="matrix-header">
                <div />
                {Object.entries(WEEKDAY_LABEL).map(([k, v]) => (
                  <div key={k} className="matrix-col">
                    {v}
                  </div>
                ))}
              </div>

              {Object.entries(SHIFT_LABEL).map(([shiftKey, shiftLabel]) => (
                <div key={shiftKey} className="matrix-row">
                  <div className="matrix-row-title">{shiftLabel}</div>
                  {Object.keys(WEEKDAY_LABEL).map((day) =>
                    renderMatrixCell(shiftKey, day)
                  )}
                </div>
              ))}
            </div>

            <span className="hint">Click để chọn lịch – click lại để bỏ</span>

            <div className="modal-actions">
              <button onClick={closeModal}>Huỷ</button>
              <button onClick={submitCreate}>Tạo lịch</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}