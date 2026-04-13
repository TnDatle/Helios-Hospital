import { useEffect, useMemo, useState } from "react";
import "../../styles/admin/users.css";
import { getDatabase, ref, onValue } from "firebase/database";

const API_BASE = "http://localhost:5000/api";

const STAFF_OFFICES = [
  { value: "tiep-tan", label: "Phòng Tiếp tân" },
  { value: "ke-toan", label: "Phòng Kế toán" },
  { value: "hanh-chinh", label: "Phòng Hành chính" },
];

const STAFF_ROLE_MAP = {
  "Phòng Tiếp tân": "RECEPTION",
  "Phòng Kế toán": "ACCOUNTANT",
  "Phòng Hành chính": "ADMIN_STAFF",
};

const ACTIVE_ROLE_LABEL  = {
  ADMIN: "Quản trị viên",
  DOCTOR: "Bác sĩ",
  STAFF: "Nhân viên",
};

const ROLE_CONFIG = {
  ADMIN: {
    label: "Quản Trị Viên",
  },
  DOCTOR: {
    label: "Bác Sĩ",
  },
  STAFF: {
    label: "Nhân Viên",
  },
};

export default function Users() {
  /* =========================
     ROLE TAB
  ========================= */
  const [activeRole, setActiveRole] = useState("ADMIN");

  /* =========================
     UI
  ========================= */
  const [showModal, setShowModal] = useState(false);
  const [uiAlert, setUiAlert] = useState({
    open: false,
    type: "error",
    message: "",
  });

 const handleToggle = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/users/${userId}/toggle`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        return showAlert("error", data.message);
      }

      //  update local state luôn (không cần fetch lại)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, isActive: data.data.isActive }
            : u
        )
      );

    } catch {
      showAlert("error", "Không connect server");
    }
  };

  /* =========================
     DATA
  ========================= */
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  /* =========================
     FORM
  ========================= */
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [form, setForm] = useState({
    email: "",
    name: "",
    doctorId: "",
    office: "",
  });

  /* =========================
     TABLE FILTER
  ========================= */
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");

  const getUserOnline = (u) => {
  const uid = u.id; // nếu backend đã đúng UID thì giữ nguyên

  return statusMap[uid]?.isOnline;
};
  /* =========================
     HELPERS
  ========================= */
  const showAlert = (type, message) => {
    setUiAlert({ open: true, type, message });
    setTimeout(() => {
      setUiAlert((prev) => ({ ...prev, open: false }));
    }, 4000);
  };

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@helios\.vn$/.test(email);

  const resetForm = () => {
    setSelectedDepartment("");
    setForm({ email: "", name: "", doctorId: "", office: "" });
  };

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();
      setUsers(data.data || []);
    } catch {
      showAlert("error", "Không tải được danh sách người dùng");
    }
  };

  useEffect(() => {
    const fetchBase = async () => {
      try {
        const [depRes, docRes] = await Promise.all([
          fetch(`${API_BASE}/departments`),
          fetch(`${API_BASE}/doctors`),
        ]);

        setDepartments((await depRes.json()).data || []);
        setAllDoctors((await docRes.json()).data || []);
      } catch {
        showAlert("error", "Không tải được dữ liệu hệ thống");
      }
    };

    fetchBase();
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const statusRef = ref(db, "/status");

    const unsubscribe = onValue(statusRef, (snapshot) => {
      setStatusMap(snapshot.val() || {});
    });

    return () => unsubscribe();
  }, []);

  /* =========================
     FILTER TABLE
  ========================= */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // 🔥 STAFF TAB
      if (activeRole === "STAFF") {
        return ["RECEPTION", "ACCOUNTANT", "ADMIN_STAFF"].includes(u.role);
      }

      // ROLE KHÁC
      if (u.role !== activeRole) return false;

      // FILTER DOCTOR
      if (
        filterDepartment &&
        u.role === "DOCTOR" &&
        u.doctor?.departmentName !== filterDepartment
      ) {
        return false;
      }

      if (
        filterDoctor &&
        u.role === "DOCTOR" &&
        u.doctor?.name !== filterDoctor
      ) {
        return false;
      }

      return true;
    });
  }, [users, activeRole, filterDepartment, filterDoctor]);


  /* =========================
     CREATE USER
  ========================= */
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isValidEmail(form.email)) {
    return showAlert("error", "Email phải có dạng @helios.vn");
  }

  if (activeRole === "DOCTOR" && !form.doctorId) {
    return showAlert("warning", "Vui lòng chọn bác sĩ");
  }

  if (activeRole === "STAFF" && !form.office) {
    return showAlert("warning", "Vui lòng chọn phòng ban");
  }

  // XÁC ĐỊNH ROLE THỰC TẾ
  let finalRole = activeRole;

  if (activeRole === "STAFF") {
    finalRole = STAFF_ROLE_MAP[form.office];
  }

  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        role: finalRole, 
        name: activeRole === "DOCTOR" ? null : form.name,
        office: activeRole === "STAFF" ? form.office : null,
        doctorId: activeRole === "DOCTOR" ? form.doctorId : null,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return showAlert("error", data.message || "Có lỗi xảy ra");
    }

    showAlert("success", "Tạo tài khoản thành công");
    setShowModal(false);
    resetForm();
    fetchUsers();
  } catch {
    showAlert("error", "Không thể kết nối server");
  }
};


  /* =========================
     RENDER
  ========================= */
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Quản lý tài khoản</h1>
        <button className="btn-open" onClick={() => setShowModal(true)}>
          ➕ Thêm tài khoản
        </button>
      </div>

      {uiAlert.open && (
        <div className={`ui-alert ${uiAlert.type}`}>
          {uiAlert.message}
        </div>
      )}

      {/* ROLE TABS */}
      <div className="role-tabs">
      {Object.keys(ROLE_CONFIG).map((r) => (
        <button
          key={r}
          className={activeRole === r ? "active" : ""}
          onClick={() => {
            setActiveRole(r);
            setFilterDepartment("");
            setFilterDoctor("");
          }}  
        >
          {ROLE_CONFIG[r].label}
        </button>
      ))}
    </div>

      {/* FILTER DOCTOR */}
      {activeRole === "DOCTOR" && (
        <div className="table-filters">
          <select
            value={filterDepartment}
            onChange={(e) => {
              setFilterDepartment(e.target.value);
              setFilterDoctor("");
            }}
          >
            <option value="">Tất cả khoa</option>
            {[...new Set(
              users
                .filter((u) => u.role === "DOCTOR")
                .map((u) => u.doctor?.departmentName)
            )].map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>

          <select
            disabled={!filterDepartment}
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
          >
            <option value="">Tất cả bác sĩ</option>
            {users
              .filter(
                (u) =>
                  u.role === "DOCTOR" &&
                  u.doctor?.departmentName === filterDepartment
              )
              .map((u) => (
                <option key={u.id} value={u.doctor?.name}>
                  {u.doctor?.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* TABLE */}
      <div className="admin-table">
        <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Họ tên</th>
                <th>Khoa / Phòng</th>
                <th>Trạng thái</th>
                <th>Online</th>
                <th>Login lần cuối</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5">Không có dữ liệu</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.role === "DOCTOR" ? u.doctor?.name : u.name}</td>
                    <td>
                      {u.role === "DOCTOR"
                        ? u.doctor?.departmentName
                        : u.office}
                    </td>

                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={u.isActive}
                          disabled={u.role === "ADMIN"}
                          onChange={() => handleToggle(u.id)}
                        />
                        <span className="slider"></span>
                      </label>

                      {u.role === "ADMIN" && (
                        <span style={{ marginLeft: 8, color: "#999" }}></span>
                      )}
                    </td>

                    <td>
                      {getUserOnline(u) ? (
                        <span style={{ color: "green" }}>🟢 Online</span>
                      ) : (
                        <span style={{ color: "#999" }}>⚪ Offline</span>
                      )}
                    </td>
                    
                    <td>
                      {u.lastLoginAt?.seconds
                        ? new Date(u.lastLoginAt.seconds * 1000).toLocaleString("vi-VN")
                        : u.lastLoginAt
                        ? new Date(u.lastLoginAt).toLocaleString("vi-VN")
                        : "Chưa đăng nhập"}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Tạo tài khoản {ACTIVE_ROLE_LABEL[activeRole]}</h2>

            <form onSubmit={handleSubmit}>
              <label>Email</label>
              <input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              {(activeRole === "ADMIN" || activeRole === "STAFF") && (
                <>
                  <label>Họ tên</label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </>
              )}

              {activeRole === "STAFF" && (
                <>
                  <label>Phòng ban</label>
                  <select
                    value={form.office}
                    onChange={(e) =>
                      setForm({ ...form, office: e.target.value })
                    }
                  >
                    <option value="">-- Chọn phòng --</option>
                    {STAFF_OFFICES.map((o) => (
                      <option key={o.value} value={o.label}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {activeRole === "DOCTOR" && (
                <>
                  <label>Khoa</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setForm({ ...form, doctorId: "" });
                    }}
                  >
                    <option value="">-- Chọn khoa --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  <label>Bác sĩ</label>
                  <select
                    value={form.doctorId}
                    disabled={!selectedDepartment}
                    onChange={(e) =>
                      setForm({ ...form, doctorId: e.target.value })
                    }
                  >
                    <option value="">-- Chọn bác sĩ --</option>
                    {allDoctors
                      .filter((d) => d.departmentId === selectedDepartment)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                  </select>
                </>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-create">
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
