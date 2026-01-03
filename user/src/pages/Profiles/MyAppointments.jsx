import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/useAuth";

import { getAppointmentsByUser } from "../../API/appointment-api";
import { getDoctorById } from "../../API/doctor-api";
import { getPatientById } from "../../API/patient-api";
import { getDepartmentById } from "../../API/department-api";

const SHIFT_LABEL = {
  MORNING: "Ca sáng",
  AFTERNOON: "Ca chiều",
};

const SHIFT_TIME = {
  MORNING: "06:30 – 11:30",
  AFTERNOON: "13:00 – 16:00",
};

const STATUS_LABEL = {
  PENDING: "Sắp khám",
  DONE: "Đã khám",
  CANCELLED: "Đã huỷ",
};

/* =====================
   HELPER
===================== */
const isPastAppointment = (a) => {
  if (!a.schedule?.date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const examDate = new Date(a.schedule.date);
  examDate.setHours(0, 0, 0, 0);

  return (
    a.status === "DONE" ||
    a.status === "CANCELLED" ||
    examDate < today
  );
};

export default function MyAppointments() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* TAB: SELF | RELATIVE */
  const [activeTab, setActiveTab] = useState("SELF");

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);

      const raw = await getAppointmentsByUser(user.uid);

      /* CACHE */
      const doctorCache = {};
      const patientCache = {};
      const departmentCache = {};

      const full = await Promise.all(
        raw.map(async (a) => {
          if (!doctorCache[a.doctorId]) {
            doctorCache[a.doctorId] = await getDoctorById(a.doctorId);
          }
          if (!patientCache[a.patientId]) {
            patientCache[a.patientId] = await getPatientById(a.patientId);
          }
          if (!departmentCache[a.departmentId]) {
            departmentCache[a.departmentId] =
              await getDepartmentById(a.departmentId);
          }

          const patient = patientCache[a.patientId];

          return {
            ...a,
            doctorName: doctorCache[a.doctorId]?.name || "—",
            departmentName: departmentCache[a.departmentId]?.name || "—",
            patientName: patient?.fullName || "—",
            patientIsDefault: patient?.isDefault || false,
          };
        })
      );

      setAppointments(full);
      setLoading(false);
    };

    load();
  }, [user]);

  /* =====================
     FILTER BY TAB
  ===================== */
  const { upcoming, history } = useMemo(() => {
    const filtered = appointments.filter((a) =>
      activeTab === "SELF"
        ? a.patientIsDefault
        : !a.patientIsDefault
    );

    return {
      upcoming: filtered.filter((a) => !isPastAppointment(a)),
      history: filtered.filter((a) => isPastAppointment(a)),
    };
  }, [appointments, activeTab]);

  /* =====================
     CARD
  ===================== */
  const renderCard = (a) => (
    <div key={a.id} className="patient-card">
      <div className="patient-card-info">
        <h5>{a.patientName}</h5>

        <p><strong>Bác sĩ:</strong> {a.doctorName}</p>
        <p><strong>Khoa:</strong> {a.departmentName}</p>

        <p>
          <strong>Ngày khám:</strong>{" "}
          {new Date(a.schedule.date).toLocaleDateString("vi-VN")}
        </p>

        <p>
          <strong>Ca:</strong>{" "}
          {SHIFT_LABEL[a.schedule.shiftId]}
        </p>

        <p>
          <strong>Giờ:</strong>{" "}
          {SHIFT_TIME[a.schedule.shiftId]}
        </p>

        <p>
          <strong>Phòng:</strong> {a.schedule.room}
        </p>
      </div>

      <div className="patient-card-actions">
        <span
          className={`booking-badge ${
            a.status === "DONE"
              ? "success"
              : a.status === "CANCELLED"
              ? "danger"
              : ""
          }`}
        >
          {STATUS_LABEL[a.status]}
        </span>
      </div>
    </div>
  );

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="container patient-page">
      <h2>Lịch khám của tôi</h2>

      {/* ===== MAIN TAB ===== */}
      <div className="tab-group">
        <button
          className={`tab ${activeTab === "SELF" ? "active" : ""}`}
          onClick={() => setActiveTab("SELF")}
        >
          Bản thân
        </button>

        <button
          className={`tab ${activeTab === "RELATIVE" ? "active" : ""}`}
          onClick={() => setActiveTab("RELATIVE")}
        >
          Người thân
        </button>
      </div>

      {loading && <p>Đang tải lịch khám...</p>}

      {!loading && (
        <>
          <h4>Lịch sắp tới</h4>
          {upcoming.length ? upcoming.map(renderCard) : <p>Không có lịch sắp tới.</p>}

          <h4 style={{ marginTop: 24 }}>Lịch sử khám</h4>
          {history.length ? history.map(renderCard) : <p>Chưa có lịch sử khám.</p>}
        </>
      )}
    </div>
  );
}
