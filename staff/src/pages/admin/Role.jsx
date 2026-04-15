import { useState } from "react";
import "../../styles/admin/roles.css";

const ROLES = ["ADMIN", "DOCTOR", "RECEPTION"];

const ROLE_META = {
  ADMIN: {
    label: "Admin",
    color: "role-admin",
    icon: "A",
    description: "Toàn quyền hệ thống",
  },
  DOCTOR: {
    label: "Bác sĩ",
    color: "role-doctor",
    icon: "B",
    description: "Quản lý bệnh nhân & hồ sơ",
  },
  RECEPTION: {
    label: "Lễ tân",
    color: "role-reception",
    icon: "L",
    description: "Đặt lịch & tiếp nhận",
  },
};

const ALL_PERMISSIONS = [
  {
    group: "Người dùng",
    items: [
      { key: "user.view", label: "Xem danh sách người dùng" },
      { key: "user.create", label: "Tạo người dùng mới" },
      { key: "user.edit", label: "Chỉnh sửa người dùng" },
      { key: "user.delete", label: "Xoá người dùng" },
    ],
  },
  {
    group: "Bệnh nhân",
    items: [
      { key: "patient.view", label: "Xem hồ sơ bệnh nhân" },
      { key: "patient.create", label: "Tạo hồ sơ bệnh nhân" },
      { key: "patient.edit", label: "Cập nhật hồ sơ bệnh nhân" },
      { key: "patient.delete", label: "Xoá hồ sơ bệnh nhân" },
    ],
  },
  {
    group: "Lịch hẹn",
    items: [
      { key: "appt.view", label: "Xem lịch hẹn" },
      { key: "appt.create", label: "Đặt lịch hẹn" },
      { key: "appt.edit", label: "Cập nhật lịch hẹn" },
      { key: "appt.cancel", label: "Huỷ lịch hẹn" },
    ],
  },
  {
    group: "Báo cáo & Thống kê",
    items: [
      { key: "report.view", label: "Xem báo cáo" },
      { key: "report.export", label: "Xuất báo cáo" },
    ],
  },
  {
    group: "Cấu hình hệ thống",
    items: [
      { key: "system.settings", label: "Thay đổi cài đặt hệ thống" },
      { key: "system.roles", label: "Quản lý phân quyền" },
      { key: "system.logs", label: "Xem nhật ký hệ thống" },
    ],
  },
];

const DEFAULT_PERMISSIONS = {
  ADMIN: new Set(ALL_PERMISSIONS.flatMap((g) => g.items.map((i) => i.key))),
  DOCTOR: new Set([
    "patient.view",
    "patient.create",
    "patient.edit",
    "appt.view",
    "appt.edit",
    "report.view",
  ]),
  RECEPTION: new Set([
    "patient.view",
    "appt.view",
    "appt.create",
    "appt.edit",
    "appt.cancel",
  ]),
};

export default function Roles() {
  const [selectedRole, setSelectedRole] = useState("ADMIN");
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);
  const [saved, setSaved] = useState(false);

  const current = permissions[selectedRole];

  const toggle = (key) => {
    if (selectedRole === "ADMIN") return;
    setPermissions((prev) => {
      const next = new Set(prev[selectedRole]);
      next.has(key) ? next.delete(key) : next.add(key);
      return { ...prev, [selectedRole]: next };
    });
    setSaved(false);
  };

  const toggleGroup = (group) => {
    if (selectedRole === "ADMIN") return;
    const keys = group.items.map((i) => i.key);
    const allChecked = keys.every((k) => current.has(k));
    setPermissions((prev) => {
      const next = new Set(prev[selectedRole]);
      keys.forEach((k) => (allChecked ? next.delete(k) : next.add(k)));
      return { ...prev, [selectedRole]: next };
    });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const totalPerms = ALL_PERMISSIONS.flatMap((g) => g.items).length;
  const activePerms = current.size;

  return (
    <div className="admin-page">
      <div className="roles-header">
        <div>
          <h1 className="admin-title">Phân quyền</h1>
          <p className="roles-subtitle">
            Cấu hình quyền hạn cho từng vai trò trong hệ thống
          </p>
        </div>
        <button
          className={`roles-save-btn ${saved ? "saved" : ""}`}
          onClick={handleSave}
        >
          {saved ? "✓ Đã lưu" : "Lưu thay đổi"}
        </button>
      </div>

      <div className="roles-layout">
        {/* Sidebar */}
        <aside className="roles-sidebar">
          <p className="sidebar-label">Vai trò</p>
          {ROLES.map((role) => {
            const meta = ROLE_META[role];
            const count = permissions[role].size;
            return (
              <button
                key={role}
                className={`role-tab ${selectedRole === role ? "active" : ""} ${meta.color}`}
                onClick={() => setSelectedRole(role)}
              >
                <span className="role-tab-icon">{meta.icon}</span>
                <span className="role-tab-body">
                  <span className="role-tab-name">{meta.label}</span>
                  <span className="role-tab-desc">{meta.description}</span>
                </span>
                <span className="role-tab-badge">{count}</span>
              </button>
            );
          })}
        </aside>

        {/* Main panel */}
        <main className="roles-panel">
          <div className="panel-header">
            <div className={`panel-role-chip ${ROLE_META[selectedRole].color}`}>
              {ROLE_META[selectedRole].label}
            </div>
            <div className="panel-stats">
              <span className="stat-num">{activePerms}</span>
              <span className="stat-sep">/</span>
              <span className="stat-total">{totalPerms} quyền được cấp</span>
            </div>
          </div>

          {selectedRole === "ADMIN" && (
            <div className="admin-notice">
              Admin có toàn quyền hệ thống và không thể thay đổi.
            </div>
          )}

          <div className="perm-groups">
            {ALL_PERMISSIONS.map((group) => {
              const keys = group.items.map((i) => i.key);
              const checkedCount = keys.filter((k) => current.has(k)).length;
              const allChecked = checkedCount === keys.length;
              const someChecked = checkedCount > 0 && !allChecked;

              return (
                <div key={group.group} className="perm-group">
                  <div className="perm-group-header">
                    <label className="perm-group-toggle">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        ref={(el) => {
                          if (el) el.indeterminate = someChecked;
                        }}
                        onChange={() => toggleGroup(group)}
                        disabled={selectedRole === "ADMIN"}
                      />
                      <span className="perm-group-name">{group.group}</span>
                    </label>
                    <span className="perm-group-count">
                      {checkedCount}/{keys.length}
                    </span>
                  </div>
                  <div className="perm-items">
                    {group.items.map((item) => (
                      <label
                        key={item.key}
                        className={`perm-item ${current.has(item.key) ? "checked" : ""} ${selectedRole === "ADMIN" ? "disabled" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={current.has(item.key)}
                          onChange={() => toggle(item.key)}
                          disabled={selectedRole === "ADMIN"}
                        />
                        <span className="perm-item-label">{item.label}</span>
                        <span className="perm-item-key">{item.key}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}