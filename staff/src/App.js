import { Routes, Route, Navigate } from "react-router-dom";
import StaffLayout from "./layouts/StaffLayout";
import RoleRedirect from "./components/RoleRedirect";
import ProtectedRoute from "./components/ProtectedRoute";

// pages
import Login from "./pages/auth/Login";

// reception
import ReceptionPage from "./pages/reception/ReceptionPage";
import Register from "./pages/reception/Register";
import WalkIn from "./pages/reception/WalkIn";
import SearchPatient from "./pages/reception/Search";

// doctor
import DoctorPage from "./pages/doctor/DoctorPage";
import Schedule from "./pages/doctor/Schedule";
import Queue from "./pages/doctor/Queue";
import History from "./pages/doctor/History";
import Track from "./pages/doctor/Track";

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

// human resource
import HRPage from "./pages/humanresource/HumanResource";
import JobList from "./pages/humanresource/JobList";
import AddJobs from "./pages/humanresource/AddJobs";
import Resume from "./pages/humanresource/Resume";

// css
import "./styles/index.css";
import "./styles/staff-layout.css";
import "./styles/reception/reception.css";
import "./styles/humanresource/humanresource.css";
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

      {/* STAFF (phải login mới vào được) */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        {/* redirect theo role */}
        <Route index element={<RoleRedirect />} />

        {/* RECEPTION */}
        <Route
          path="reception"
          element={
            <ProtectedRoute allowedRoles={["RECEPTION"]}>
              <ReceptionPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Register />} />
          <Route path="walk-in" element={<WalkIn />} />
          <Route path="search-patient" element={<SearchPatient />} />
        </Route>

        {/* DOCTOR */}
        <Route
          path="doctor"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Schedule />} />
          <Route path="queue" element={<Queue />} />
          <Route path="history" element={<History />} />
          <Route path="track" element={<Track />} />
        </Route>

        {/* HUMAN RESOURCE */}
        <Route
          path="humanresource"
          element={
            <ProtectedRoute allowedRoles={["HUMAN_RESOURCE"]}>
              <HRPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<JobList />} />
          <Route path="jobs/:jobId/resumes" element={<Resume />} />
          <Route path="addjobs" element={<AddJobs />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        >
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

      {/* 404 */}
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

export default App;