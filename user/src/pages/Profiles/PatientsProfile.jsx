import { useEffect, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { getPatientsByOwner } from "../../API/patient-api";
import PatientCard from "./PatientCard";
import PatientFormModal from "./PatientFormModal";

export default function PatientProfile() {
  const { user } = useAuth();

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const loadPatients = async () => {
    const data = await getPatientsByOwner(user.uid);
    setPatients(data);
  };

  useEffect(() => {
    if (user) loadPatients();
  }, [user]);

  const selfPatient = patients.find((p) => p.isDefault);
  const relatives = patients.filter((p) => !p.isDefault);

  return (
    <div className="container patient-page">
      <h2>Hồ sơ bệnh nhân</h2>

      {/* ===== HỒ SƠ BẢN THÂN ===== */}
      {selfPatient && (
        <>
          <h4>Hồ sơ của tôi</h4>
          <PatientCard
            patient={selfPatient}
            onEdit={setSelectedPatient}
          />
        </>
      )}

      {/* ===== NGƯỜI THÂN ===== */}
      <h4>Người thân</h4>
      {relatives.map((p) => (
        <PatientCard
          key={p.id}
          patient={p}
          onEdit={setSelectedPatient}
        />
      ))}

      {/* ===== THÊM NGƯỜI THÂN ===== */}
      <button
        className="booking-btn primary"
        onClick={() =>
          setSelectedPatient({
            isDefault: false, // 👈 đánh dấu là người thân
          })
        }
      >
        + Thêm người thân
      </button>

      {/* ===== MODAL ===== */}
      {selectedPatient && (
        <PatientFormModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onSuccess={loadPatients}
        />
      )}
    </div>
  );
}
