import { Routes, Route, Navigate } from "react-router-dom";
import StaffLayout from "./layouts/StaffLayout";
import RoleRedirect from "./components/RoleRedirect";

// pages
import Login from "./pages/auth/Login";

// reception
import ReceptionPage from "./pages/reception/ReceptionPage";
import Register from "./pages/reception/Register";
import WalkIn from "./pages/reception/WalkIn";
import TrackPatient from "./pages/doctor/Track";

// doctor
import DoctorPage from "./pages/doctor/DoctorPage";
import Schedule from "./pages/doctor/Schedule";
import Queue from "./pages/doctor/Queue";
import History from "./pages/doctor/History";
import Track from "./pages/doctor/Track"

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
      {/* ROOT */}
      <Route path="/" element={<Navigate to="/staff/login" replace />} />

      {/* LOGIN */}
      <Route path="/staff/login" element={<Login />} />

      {/* STAFF */}
      <Route path="/staff" element={<StaffLayout />}>
        {/* 🔑 QUAN TRỌNG: redirect khi vào /staff */}
        <Route index element={<RoleRedirect />} />

        {/* RECEPTION */}
        <Route path="reception" element={<ReceptionPage />}>
           <Route index element={<Register />} />
           <Route path="walk-in" element={<WalkIn />} />
           <Route path="track-patient" element={<TrackPatient />} />
        </Route>

        {/* DOCTOR */}
        <Route path="doctor" element={<DoctorPage />}>
          <Route index element={<Schedule />} />
          <Route path="queue" element={<Queue />} />
          <Route path="history" element={<History />} />
          <Route path="track" element={<Track />} />
        </Route>

        {/* ADMIN */}
        <Route path="admin" element={<AdminPage />}>
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

      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

export default App;