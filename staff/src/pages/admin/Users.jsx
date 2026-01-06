import "../../styles/admin/users.css";

export default function Users() {
  return (
    <div className="admin-page">
      <h1 className="admin-title">Quản lý người dùng</h1>

      <div className="admin-toolbar">
        <button className="btn-primary">+ Thêm người dùng</button>
      </div>

      <div className="admin-table-placeholder">
        Bảng danh sách người dùng
      </div>
    </div>
  );
}
