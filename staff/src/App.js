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

        <Route element={<AdminPage />}>
          <Route path="/staff/admin" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
