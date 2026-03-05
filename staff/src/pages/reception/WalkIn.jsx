import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/reception/walkin.css";

import {
  searchPatientsApi,
  createAppointmentApi
} from "../../API/user-appointment-api";

const WalkIn = () => {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [queueNumber, setQueueNumber] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [appointmentData, setAppointmentData] = useState({
    department: "",
    doctor: "",
    visitType: "kham-benh",
    priority: false,
    paymentType: "tien-mat",
    reason: "",
    hasInsurance: false
  });

  /* ================= SEARCH ================= */

  const handleSearch = async () => {

    if (!searchQuery.trim()) return;

    try {

      const data = await searchPatientsApi(searchQuery);

      setSearchResults(data);

    } catch (err) {

      alert("Không tìm thấy bệnh nhân");

      setSearchResults([]);

    }

  };

  /* ================= SELECT PATIENT ================= */

  const handleSelectPatient = (patient) => {

    setSelectedPatient(patient);

    setAppointmentData(prev => ({
      ...prev,
      hasInsurance: patient.hasInsurance || false
    }));

    setStep(2);

  };

  const handleNewPatient = () => {

    navigate("/staff/reception");

  };

  /* ================= CHANGE ================= */

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setAppointmentData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (name === "department") {

      setAppointmentData(prev => ({
        ...prev,
        department: value,
        doctor: ""
      }));

    }

  };

  /* ================= CREATE APPOINTMENT ================= */

  const handleConfirm = async () => {

    if (!appointmentData.department) {

      alert("Vui lòng chọn khoa khám!");

      return;

    }

    try {

      const body = {

        patientId: selectedPatient.id,

        departmentId: appointmentData.department,

        doctorId: appointmentData.doctor || null,

        visitType: appointmentData.visitType,

        priority: appointmentData.priority,

        paymentType: appointmentData.paymentType,

        reason: appointmentData.reason,

        hasInsurance: appointmentData.hasInsurance

      };

      const result = await createAppointmentApi(body);

      setQueueNumber(result.queueNumber);

      setShowSuccess(true);

      setStep(3);

    } catch (err) {

      alert("Không thể tạo lịch khám");

    }

  };

  /* ================= RESET ================= */

  const handleReset = () => {

    setStep(1);

    setSearchQuery("");
    setSearchResults([]);

    setSelectedPatient(null);

    setQueueNumber("");
    setShowSuccess(false);

    setAppointmentData({
      department: "",
      doctor: "",
      visitType: "kham-benh",
      priority: false,
      paymentType: "tien-mat",
      reason: "",
      hasInsurance: false
    });

  };

  const handlePrint = () => {

    window.print();

  };

  /* ================= DATA ================= */

  const departments = [
    { id: "noi", name: "Nội khoa" },
    { id: "ngoai", name: "Ngoại khoa" },
    { id: "san", name: "Sản khoa" },
    { id: "nhi", name: "Nhi khoa" },
    { id: "mat", name: "Mắt" },
    { id: "tai-mui-hong", name: "Tai-Mũi-Họng" },
    { id: "rang-ham-mat", name: "Răng-Hàm-Mặt" },
    { id: "da-lieu", name: "Da liễu" }
  ];

  const doctorsByDept = {
    noi: ["BS. Nguyễn Văn A", "BS. Trần Thị B"],
    ngoai: ["BS. Lê Văn C"],
    san: ["BS. Phạm Thị D"],
    nhi: ["BS. Hoàng Văn E"]
  };

  /* ================= UI ================= */

  return (

    <div className="walkin-container">

      {/* STEP 1 SEARCH */}

      {step === 1 && (

        <div className="search-section">

          <h2>Tìm bệnh nhân</h2>

          <div className="search-box-walkin">

            <input
              type="text"
              placeholder="Mã BN / Tên / SĐT"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button onClick={handleSearch}>
              Tìm kiếm
            </button>

          </div>

          {searchResults.map((patient) => (

            <div key={patient.id} className="patient-card">

              <h4>{patient.fullName}</h4>

              <p>Mã BN: {patient.patientCode}</p>

              <p>SĐT: {patient.phone}</p>

              <button
                onClick={() => handleSelectPatient(patient)}
              >
                Chọn
              </button>

            </div>

          ))}

          {searchQuery && searchResults.length === 0 && (

            <p>Không tìm thấy bệnh nhân</p>

          )}

          <button
            onClick={handleNewPatient}
            className="btn-new-patient"
          >
            Đăng ký bệnh nhân mới
          </button>

        </div>

      )}

      {/* STEP 2 SELECT SERVICE */}

      {step === 2 && selectedPatient && (

        <div className="service-section">

          <h3>Bệnh nhân</h3>

          <p>{selectedPatient.fullName}</p>
          <p>Mã BN: {selectedPatient.patientCode}</p>

          <h3>Chọn khoa</h3>

          <div className="department-grid">

            {departments.map((dept) => (

              <button
                key={dept.id}
                onClick={() =>
                  setAppointmentData(prev => ({
                    ...prev,
                    department: dept.id
                  }))
                }
              >
                {dept.name}
              </button>

            ))}

          </div>

          {appointmentData.department && (

            <select
              name="doctor"
              value={appointmentData.doctor}
              onChange={handleChange}
            >

              <option value="">
                Tự động phân bổ
              </option>

              {doctorsByDept[appointmentData.department]?.map((doc, i) => (

                <option key={i} value={doc}>
                  {doc}
                </option>

              ))}

            </select>

          )}

          <textarea
            name="reason"
            value={appointmentData.reason}
            onChange={handleChange}
            placeholder="Lý do khám"
          />

          <button onClick={() => setStep(1)}>
            Quay lại
          </button>

          <button onClick={handleConfirm}>
            Check-in
          </button>

        </div>

      )}

      {/* STEP 3 SUCCESS */}

      {step === 3 && showSuccess && (

        <div className="success-container">

          <h2>Check-in thành công</h2>

          <h1>{queueNumber}</h1>

          <p>{selectedPatient.fullName}</p>

          <button onClick={handlePrint}>
            In phiếu
          </button>

          <button onClick={handleReset}>
            Check-in bệnh nhân mới
          </button>

        </div>

      )}

    </div>

  );

};

export default WalkIn;