import { useState } from "react";
import StepDepartment from "./BookingPages/StepDepartment";
import StepSchedule from "./BookingPages/StepSchedule";
import StepDoctor from "./BookingPages/StepDoctor";
import StepConfirm from "./BookingPages/StepConfirm";

export default function Booking() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    department: null,
    schedule: null,
    doctor: null,
  });

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-title">Đặt lịch khám</div>
        <div className="booking-section">
          {step === 1 && (
            <StepDepartment
              onSelect={(department) => {
                setData({ department, schedule: null, doctor: null });
                setStep(2);
              }}
            />
          )}

          {step === 2 && (
            <StepSchedule
              department={data.department}
              onBack={() => setStep(1)}
              onSelect={(schedule) => {
                setData({ ...data, schedule, doctor: null });
                setStep(3);
              }}
            />
          )}

          {step === 3 && (
            <StepDoctor
              schedule={data.schedule}
              onBack={() => setStep(2)}
              onSelect={(doctor) => {
                setData({ ...data, doctor });
                setStep(4);
              }}
            />
          )}

          {step === 4 && (
            <StepConfirm
              data={data}
              onBack={() => setStep(3)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
