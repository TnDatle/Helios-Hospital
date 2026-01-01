import { useState } from "react";
import StepDepartment from "./BookingPages/StepDepartment";
import StepDoctor from "./BookingPages/StepDoctor";
import StepSchedule from "./BookingPages/StepSchedule";
import StepConfirm from "./BookingPages/StepConfirm";
import StepPatient from "./BookingPages/StepPatient";

export default function Booking() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    department: null,
    doctor: null,
    schedule: null,
    patient: null,
  });

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-title">Đặt lịch khám</div>

        <div className="booking-section">
          {/* STEP 1: CHỌN KHOA */}
          {step === 1 && (
            <StepDepartment
              onSelect={(department) => {
                setData({
                  department,
                  doctor: null,
                  schedule: null,
                });
                setStep(2);
              }}
            />
          )}

          {/* STEP 2: CHỌN BÁC SĨ */}
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

          {/* STEP 3: CHỌN LỊCH */}
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


          {/* STEP 4: Chọn mối quan hệ*/}
          {step === 4 && (
            <StepPatient
              onBack={() => setStep(3)}
              onSelect={(patient) => {
                setData({ ...data, patient });
                setStep(5);
              }}
            />
          )}

           {/* STEP 5: XÁC NHẬN */}
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
