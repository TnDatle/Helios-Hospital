import { useEffect, useMemo, useState } from "react";
import "../../styles/admin/departments.css";

/* =====================
   CONST
===================== */
const ROLE_OPTIONS = ["Bác sĩ", "Phó khoa", "Trưởng khoa"];
const ROLE_PRIORITY = {
  "Trưởng khoa": 1,
  "Phó khoa": 2,
  "Bác sĩ": 3,
};

/* =====================
   COMPONENT
===================== */
export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeDept, setActiveDept] = useState(null);

  const [keyword, setKeyword] = useState("");

  /* ===== MODAL STATE ===== */
  const [showCreateDoctor, setShowCreateDoctor] = useState(false);
  const [viewDoctor, setViewDoctor] = useState(null);
  const [editDoctor, setEditDoctor] = useState(null);

  const [showCreateDept, setShowCreateDept] = useState(false);
  const [editDept, setEditDept] = useState(null);

  /* ===== TOAST ===== */
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success", // success | error
  });

  /* ===== FORM ===== */
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    specialty: "",
    role: "Bác sĩ",
    departmentId: "",
  });

  const [deptForm, setDeptForm] = useState({
    name: "",
  });

  /* =====================
     TOAST HELPER
  ===================== */
  const showToast = (message, type = "success") => {
    setToast({ open: true, message, type });

    setTimeout(() => {
      setToast({ open: false, message: "", type });
    }, 2500);
  };

  /* =====================
     FETCH DATA
  ===================== */
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/departments").then((r) => r.json()),
      fetch("http://localhost:5000/api/doctors").then((r) => r.json()),
    ]).then(([deptRes, docRes]) => {
      setDepartments(deptRes.data || []);
      setDoctors(docRes.data || []);
      setActiveDept(deptRes.data?.[0] || null);
    });
  }, []);

  /* =====================
     FILTER + SORT DOCTOR
  ===================== */
  const doctorsInDept = useMemo(() => {
    let list = doctors.filter(
      (d) => d.departmentId === activeDept?.id
    );

    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(kw) ||
          d.specialty.toLowerCase().includes(kw) ||
          (d.role || "Bác sĩ").toLowerCase().includes(kw)
      );
    }

    list.sort(
      (a, b) =>
        (ROLE_PRIORITY[a.role || "Bác sĩ"] || 99) -
        (ROLE_PRIORITY[b.role || "Bác sĩ"] || 99)
    );

    return list;
  }, [doctors, activeDept, keyword]);

  /* =====================
     DEPARTMENT CRUD
  ===================== */
  const handleCreateDepartment = async (e) => {
    e.preventDefault();

    if (!deptForm.name.trim()) {
      showToast("Tên khoa không được để trống", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: deptForm.name }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Tạo khoa thất bại");
      }

      const { data } = await res.json();

      // cập nhật list khoa
      setDepartments((prev) => [...prev, data]);

      // tự động chọn khoa vừa tạo
      setActiveDept(data);

      // reset form + đóng modal
      setDeptForm({ name: "" });
      setShowCreateDept(false);

      // thông báo
      showToast("Thêm khoa thành công");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:5000/api/departments/${editDept.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editDept.name }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      showToast(err.message || "Cập nhật thất bại", "error");
      return;
    }

    const { data } = await res.json();

    // UPDATE STATE NGAY
    setDepartments((prev) => {
      // xoá khoa cũ
      const filtered = prev.filter((d) => d.id !== data.oldId);

      // thêm khoa mới
      return [...filtered, {
        id: data.id,
        name: data.name,
        isActive: data.isActive,
      }];
    });

    // nếu đang active khoa cũ → chuyển sang khoa mới
    setActiveDept((prev) =>
      prev?.id === data.oldId
        ? { id: data.id, name: data.name, isActive: data.isActive }
        : prev
    );

    setEditDept(null);
    showToast("Cập nhật khoa thành công");
  };


  const handleDeleteDepartment = async (dept) => {
  if (!dept?.id) {
    showToast("Không xác định được khoa", "error");
    return;
  }

  if (!window.confirm(`Xoá khoa "${dept.name}"?`)) return;

  const res = await fetch(
    `http://localhost:5000/api/departments/${dept.id}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    const err = await res.json();
    showToast(err.message || "Xoá thất bại", "error");
    return;
  }

  setDepartments((prev) =>
    prev.filter((d) => d.id !== dept.id)
  );

  setActiveDept(null);
  showToast("Đã xoá khoa");
};




  /* =====================
     DOCTOR CRUD
  ===================== */
  const handleCreateDoctor = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctorForm),
    });

    const { data } = await res.json();
    setDoctors((prev) => [...prev, data]);
    setShowCreateDoctor(false);

    showToast("Thêm bác sĩ thành công");
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();

    await fetch(
      `http://localhost:5000/api/doctors/${editDoctor.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editDoctor),
      }
    );

    setDoctors((prev) =>
      prev.map((d) => (d.id === editDoctor.id ? editDoctor : d))
    );

    setEditDoctor(null);
    showToast("Cập nhật bác sĩ thành công");
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Xoá bác sĩ này?")) return;

    await fetch(
      `http://localhost:5000/api/doctors/${id}`,
      { method: "DELETE" }
    );

    setDoctors((prev) => prev.filter((d) => d.id !== id));
    showToast("Xoá bác sĩ thành công");
  };

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="admin-page">
      <h1 className="admin-title">Khoa & Bác sĩ</h1>

      <div className="dept-layout">
        {/* ===== SIDEBAR ===== */}
        <aside className="dept-sidebar">
          <div className="dept-header">
            <h3>Khoa phòng</h3>
            <button onClick={() => setShowCreateDept(true)}>
              + Thêm khoa
            </button>
          </div>

          <ul>
            {departments.map((d) => (
              <li
                key={d.id}
                className={activeDept?.id === d.id ? "active" : ""}
                onClick={() => setActiveDept(d)}
              >
                <span className="dept-name">{d.name}</span>

                <div
                  className="dept-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={() => setEditDept(d)}>✏️</button>
                  <button onClick={() => handleDeleteDepartment(d)}>🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* ===== CONTENT ===== */}
        <section className="dept-content">
          <div className="toolbar">
            <input
              placeholder="Tìm bác sĩ..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              onClick={() => {
                setDoctorForm({
                  name: "",
                  specialty: "",
                  role: "Bác sĩ",
                  departmentId: activeDept?.id || "",
                });
                setShowCreateDoctor(true);
              }}
            >
              + Thêm bác sĩ
            </button>
          </div>

          <table className="doctor-table">
            <thead>
              <tr>
                <th>Họ và Tên</th>
                <th>Chuyên môn</th>
                <th>Chức vụ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {doctorsInDept.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.specialty}</td>
                  <td>
                    <span
                      className={`role ${(d.role || "Bác sĩ").replace(/\s/g, "")}`}
                    >
                      {d.role || "Bác sĩ"}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => setViewDoctor(d)}>Xem</button>
                    <button onClick={() => setEditDoctor(d)}>Sửa</button>
                    <button onClick={() => handleDeleteDoctor(d.id)}>
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* ===== TOAST ===== */}
      {toast.open && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* ===== MODALS ===== */}
      {showCreateDept && (
        <Modal onClose={() => setShowCreateDept(false)}>
          <h3>Thêm khoa</h3>
          <form onSubmit={handleCreateDepartment}>
            <input
              placeholder="Tên khoa"
              value={deptForm.name}
              onChange={(e) =>
                setDeptForm({ name: e.target.value })
              }
            />
            <button>Thêm</button>
          </form>
        </Modal>
      )}

      {editDept && (
        <Modal onClose={() => setEditDept(null)}>
          <h3>Sửa khoa</h3>
          <form onSubmit={handleUpdateDepartment}>
            <input
              value={editDept.name}
              onChange={(e) =>
                setEditDept({ ...editDept, name: e.target.value })
              }
            />
            <button>Lưu</button>
          </form>
        </Modal>
      )}

      {showCreateDoctor && (
        <Modal onClose={() => setShowCreateDoctor(false)}>
          <h3>Thêm bác sĩ</h3>
          <form onSubmit={handleCreateDoctor}>
            <input
              placeholder="Họ và Tên và học vị"
              value={doctorForm.name}
              onChange={(e) =>
                setDoctorForm({ ...doctorForm, name: e.target.value })
              }
            />
            <input
              placeholder="Chuyên môn"
              value={doctorForm.specialty}
              onChange={(e) =>
                setDoctorForm({
                  ...doctorForm,
                  specialty: e.target.value,
                })
              }
            />
            <select
              value={doctorForm.role}
              onChange={(e) =>
                setDoctorForm({ ...doctorForm, role: e.target.value })
              }
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <button>Thêm</button>
          </form>
        </Modal>
      )}

      {viewDoctor && (
        <Modal onClose={() => setViewDoctor(null)}>
          <p><b>Tên:</b> {viewDoctor.name}</p>
          <p><b>Chuyên môn:</b> {viewDoctor.specialty}</p>
          <p><b>Chức vụ:</b> {viewDoctor.role || "Bác sĩ"}</p>
        </Modal>
      )}

      {editDoctor && (
        <Modal onClose={() => setEditDoctor(null)}>
          <h3>Sửa bác sĩ</h3>
          <form onSubmit={handleUpdateDoctor}>
            <input
              value={editDoctor.name}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, name: e.target.value })
              }
            />
            <input
              value={editDoctor.specialty}
              onChange={(e) =>
                setEditDoctor({
                  ...editDoctor,
                  specialty: e.target.value,
                })
              }
            />
            <select
              value={editDoctor.role}
              onChange={(e) =>
                setEditDoctor({
                  ...editDoctor,
                  role: e.target.value,
                })
              }
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <button>Lưu</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* =====================
   MODAL
===================== */
function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
