import { useEffect, useMemo, useState } from "react";
import "../../styles/admin/departments.css";

const ROLE_OPTIONS = ["Bác sĩ", "Phó khoa", "Trưởng khoa"];
const ROLE_PRIORITY = {
  "Trưởng khoa": 1,
  "Phó khoa": 2,
  "Bác sĩ": 3,
};

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeDept, setActiveDept] = useState(null);

  const [keyword, setKeyword] = useState("");

  // NEW: modal state
  const [showCreate, setShowCreate] = useState(false);
  const [viewDoctor, setViewDoctor] = useState(null);
  const [editDoctor, setEditDoctor] = useState(null);

  const [form, setForm] = useState({
    name: "",
    specialty: "",
    role: "Bác sĩ",
  });

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

  /* ===== FILTER + SORT ===== */
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

  /* ===== CREATE ===== */
 const handleCreate = async (e) => {
  e.preventDefault();

  if (!form.departmentId) {
    alert("Vui lòng chọn khoa");
    return;
  }

  const payload = {
    name: form.name,
    specialty: form.specialty,
    departmentId: form.departmentId,
  };

  if (form.role !== "Bác sĩ") {
    payload.role = form.role;
  }

  try {
    const res = await fetch("http://localhost:5000/api/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Tạo bác sĩ thất bại");
    }

    const { data: newDoctor } = await res.json();

    setDoctors((prev) => [...prev, newDoctor]);

    alert("Thêm bác sĩ thành công");

    setForm({
      name: "",
      specialty: "",
      role: "Bác sĩ",
      departmentId: "",
    });

    setShowCreate(false);
  } catch (err) {
    alert("" + err.message);
  }
};



  /* ===== UPDATE ===== */
  const handleUpdate = async (e) => {
  e.preventDefault();

  const payload = {
    name: editDoctor.name,
    specialty: editDoctor.specialty,
  };

  if (editDoctor.role !== editDoctor._originalRole) {
    if (editDoctor.role === "Bác sĩ") {
      payload.role = null;
    } else {
      payload.role = editDoctor.role;
    }
  }

  try {
    const res = await fetch(
      `http://localhost:5000/api/doctors/${editDoctor.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Cập nhật thất bại");
    }

    setDoctors((prev) =>
      prev.map((d) =>
        d.id === editDoctor.id ? { ...d, ...payload } : d
      )
    );

    alert("Cập nhật bác sĩ thành công");
    setEditDoctor(null);
  } catch (err) {
    alert(" " + err.message);
  }
};

//Hàm xóa bác sĩ

 const handleDelete = async (id) => {
  if (!window.confirm("Bạn chắc chắn muốn xoá bác sĩ này?")) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/doctors/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Xoá thất bại");
    }

    setDoctors((prev) => prev.filter((d) => d.id !== id));
    alert(" Xoá bác sĩ thành công");
  } catch (err) {
    alert("" + err.message);
  }
};


  return (
    <div className="admin-page">
      <h1 className="admin-title">Khoa & Bác sĩ</h1>

      <div className="dept-layout">
        {/* ===== LEFT ===== */}
        <aside className="dept-sidebar">
          <h3>Khoa phòng</h3>
          <ul>
            {departments.map((d) => (
              <li
                key={d.id}
                className={activeDept?.id === d.id ? "active" : ""}
                onClick={() => setActiveDept(d)}
              >
                {d.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* ===== RIGHT ===== */}
        <section className="dept-content">
          {/* TOOLBAR */}
          <div className="toolbar">
            <input
              className="search"
              placeholder="Tìm theo tên, chuyên môn, chức vụ…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <button
              className="btn-primary"
              onClick={() => {
                setForm({
                  name: "",
                  specialty: "",
                  role: "Bác sĩ",
                  departmentId: activeDept?.id || "",
                });
                setShowCreate(true);
              }}
            >
              + Thêm bác sĩ
            </button>
          </div>

          {/* TABLE */}
          <table className="doctor-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Chuyên môn</th>
                <th>Chức vụ</th>
                <th width="140">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {doctorsInDept.length ? (
                doctorsInDept.map((d) => (
                  <tr key={d.id}>
                    <td>{d.name}</td>
                    <td>{d.specialty}</td>
                    <td>
                      <span className={`role ${(d.role || "Bác sĩ").replace(/\s/g, "")}`}>
                        {d.role || "Bác sĩ"}
                      </span>
                    </td>
                    <td className="actions">
                      <button onClick={() => setViewDoctor(d)}>Xem</button>
                      <button
                        onClick={() =>
                          setEditDoctor({
                            ...d,
                            role: d.role || "Bác sĩ",
                            _originalRole: d.role || "Bác sĩ", 
                          })
                        }
                      >
                        Sửa
                      </button>
                      <button
                        className="danger"
                        onClick={() => handleDelete(d.id)}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty">
                    Không có bác sĩ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      {/* ===== CREATE MODAL ===== */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <h3>Thêm bác sĩ</h3>
          <form className="modal-form" onSubmit={handleCreate}>
            <input
              placeholder="Tên bác sĩ"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <input
              placeholder="Chuyên môn"
              value={form.specialty}
              onChange={(e) =>
                setForm({ ...form, specialty: e.target.value })
              }
            />
            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <button className="btn-primary">Thêm</button>
          </form>
        </Modal>
      )}

      {/* ===== VIEW MODAL ===== */}
      {viewDoctor && (
        <Modal onClose={() => setViewDoctor(null)}>
          <h3>Chi tiết bác sĩ</h3>
          <p><b>Tên:</b> {viewDoctor.name}</p>
          <p><b>Chuyên môn:</b> {viewDoctor.specialty}</p>
          <p><b>Chức vụ:</b> {viewDoctor.role || "Bác sĩ"}</p>
        </Modal>
      )}

      {/* ===== EDIT MODAL ===== */}
      {editDoctor && (
        <Modal onClose={() => setEditDoctor(null)}>
          <h3>Sửa bác sĩ</h3>
          <form className="modal-form" onSubmit={handleUpdate}>
            <input
              value={editDoctor.name}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, name: e.target.value })
              }
            />
            <input
              value={editDoctor.specialty}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, specialty: e.target.value })
              }
            />
            <select
              value={editDoctor.role}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, role: e.target.value })
              }
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <button className="btn-primary">Lưu</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
