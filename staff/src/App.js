import { Routes, Route, Navigate } from "react-router-dom";
import StaffLayout from "./layouts/StaffLayout";

// pages
import Login from "./pages/auth/Login";

// reception
import ReceptionPage from "./pages/reception/ReceptionPage";
import PatientQueue from "./pages/reception/PatientQueue";
import VerifyPatient from "./pages/reception/VerifyPatient";

// doctor
import DoctorPage from "./pages/doctor/DoctorPage";
import Schedule from "./pages/doctor/Schedule";

// admin
import AdminPage from "./pages/admin/AdminPage";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Department from "./pages/admin/Department";
import Role from "./pages/admin/Role";
import Schedules from "./pages/admin/Schedules";
import News from "./pages/admin/News";
import AuditLogs from "./pages/admin/AuditLogs";
import Setting from "./pages/admin/Setting";

//css
import "./styles/index.css";
import "./styles/staff-layout.css";
import "./styles/reception/reception.css";
import "./styles/doctor/doctor.css";
import "./styles/admin/admin.css";
import "./styles/login.css";

function App() {
  return (
    <Routes>
      {/* 🔹 ROOT → LOGIN */}
      <Route path="/" element={<Navigate to="/staff/login" />} />

      {/* 🔹 LOGIN */}
      <Route path="/staff/login" element={<Login />} />

      {/* 🔹 STAFF SYSTEM */}
      <Route element={<StaffLayout />}>
        <Route element={<ReceptionPage />}>
          <Route path="/staff/reception" element={<PatientQueue />} />
          <Route path="/staff/reception/verify/:id" element={<VerifyPatient />} />
        </Route>

        <Route element={<DoctorPage />}>
          <Route path="/staff/doctor" element={<Schedule />} />
        </Route>

        <Route path="/staff/admin" element={<AdminPage />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="departments" element={<Department />} />
          <Route path="roles" element={<Role />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="news" element={<News />} />
          <Route path="logs" element={<AuditLogs />} />
          <Route path="settings" element={<Setting />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
