import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

// Các bước đăng nhập 
import StepDepartment from "./BookingPages/StepDepartment";
import StepDoctor from "./BookingPages/StepDoctor";
import StepSchedule from "./BookingPages/StepSchedule";
import StepPatient from "./BookingPages/StepPatient";
import StepConfirm from "./BookingPages/StepConfirm";

export default function Booking() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    department: null,
    doctor: null,
    schedule: null,
    patient: null,
  });

  // ===============================
  //  RÀNG BUỘC ĐĂNG NHẬP
  // ===============================
  useEffect(() => {
    if (!loading && !user) {
      navigate("/dang-nhap", {
        state: { from: "/dat-lich" }, // quay lại sau login
        replace: true,
      });
    }
  }, [user, loading, navigate]);

  // Check auth
  if (loading) return null; // hoặc spinner

  // Chưa login thì không render gì cả
  if (!user) return null;

  return (
    <div className="booking-page">
      <div className="container">
        <h2 className="booking-title">Đặt lịch khám</h2>

        <div className="booking-section">
          {/* ===== STEP 1: CHỌN KHOA ===== */}
          {step === 1 && (
            <StepDepartment
              onSelect={(department) => {
                setData({
                  department,
                  doctor: null,
                  schedule: null,
                  patient: null,
                });
                setStep(2);
              }}
            />
          )}

          {/* ===== STEP 2: CHỌN BÁC SĨ ===== */}
          {step === 2 && (
            <StepDoctor
              department={data.department}
              onBack={() => setStep(1)}
              onSelect={(doctor) => {
                setData({
                  ...data,
                  doctor,
                  schedule: null,
                });
                setStep(3);
              }}
            />
          )}

          {/* ===== STEP 3: CHỌN LỊCH ===== */}
          {step === 3 && (
            <StepSchedule
              doctor={data.doctor}
              onBack={() => setStep(2)}
              onSelect={(schedule) => {
                setData({ ...data, schedule });
                setStep(4);
              }}
            />
          )}

          {/* ===== STEP 4: CHỌN NGƯỜI KHÁM ===== */}
          {step === 4 && (
            <StepPatient
              onBack={() => setStep(3)}
              onSelect={(patient) => {
                setData({ ...data, patient });
                setStep(5);
              }}
            />
          )}

          {/* ===== STEP 5: XÁC NHẬN ===== */}
          {step === 5 && (
            <StepConfirm
              data={data}
              onBack={() => setStep(4)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
