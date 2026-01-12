import { useState } from "react";
import "../../styles/admin/users.css";

const DOCTOR_DEPARTMENTS = [
  { value: "ngoai-tong-quat", label: "Ngoại tổng quát" },
  { value: "ngoai-tiet-nieu", label: "Ngoại tiết niệu" },
  { value: "tim-mach", label: "Tim mạch" },
  { value: "noi-than", label: "Lọc máu - Nội thận" },
  { value: "ung-buou", label: "Ung bướu" },
  { value: "noi-soi-nieu", label: "Nội soi niệu" },
  { value: "noi-soi-tieu-hoa", label: "Nội soi tiêu hóa" },
];

const STAFF_OFFICES = [
  // { value: "hanh-chinh", label: "Phòng Hành chính" },
  // { value: "ke-toan", label: "Phòng Kế toán" },
  // { value: "nhan-su", label: "Phòng Nhân sự" },
  { value: "tiep-tan", label: "Phòng Tiếp tân" },
];

export default function Users() {
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      // đổi role thì reset khoa / phòng
      if (name === "role") {
        return {
          ...prev,
          role: value,
          department: "",
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Tạo người dùng:", form);
    // TODO: gọi API create user

    setShowModal(false);
    setForm({
      name: "",
      email: "",
      role: "",
      department: "",
    });
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Quản lý người dùng</h1>

      <div className="admin-toolbar">
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Thêm người dùng
        </button>
      </div>

      <div className="admin-table-placeholder">
        Bảng danh sách người dùng
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Thêm người dùng</h2>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email đăng nhập</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Vai trò</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn vai trò --</option>
                  <option value="ADMIN">Quản trị</option>
                  <option value="DOCTOR">Bác sĩ</option>
                  <option value="STAFF">Nhân viên</option>
                </select>
              </div>

              {/* KHOA - chỉ cho BÁC SĨ */}
              {form.role === "DOCTOR" && (
                <div className="form-group">
                  <label>Khoa</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn khoa --</option>
                    {DOCTOR_DEPARTMENTS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* PHÒNG BAN - chỉ cho NHÂN VIÊN */}
              {form.role === "STAFF" && (
                <div className="form-group">
                  <label>Phòng ban</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn phòng ban --</option>
                    {STAFF_OFFICES.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
