import { useState } from "react";

const RELATIONSHIP_LABEL = {
  FATHER: "Cha",
  MOTHER: "Mẹ",
  SPOUSE: "Vợ / Chồng",
  CHILD: "Con",

  OTHER: "Người thân khác",
};

export default function PatientCard({ patient, onEdit }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="patient-card">
      <div className="patient-card-info">
        <h5 className="patient-name">
          <span>{patient.fullName}</span>

          {/* ===== BADGE MẶC ĐỊNH ===== */}
          {patient.isDefault && (
            <span className="badge badge-default">
              Bản thân
            </span>
          )}

          {/* ===== BADGE QUAN HỆ ===== */}
          {!patient.isDefault && patient.relationship && (
            <span className="badge badge-relationship">
              {RELATIONSHIP_LABEL[patient.relationship]}
            </span>
          )}
        </h5>

        <p>
          <strong>Ngày sinh:</strong>{" "}
          {patient.dob
            ? new Date(patient.dob).toLocaleDateString("vi-VN")
            : "—"}
        </p>

        <p>
          <strong>Giới tính:</strong>{" "}
          {patient.gender === "MALE"
            ? "Nam"
            : patient.gender === "FEMALE"
            ? "Nữ"
            : "Khác"}
        </p>

        <p>
          <strong>SĐT:</strong> {patient.phone || "—"}
        </p>

        <p>
          <strong>Dân Tộc:</strong> {patient.ethnicity || "—"}
        </p>

        <p>
          <strong>Địa chỉ:</strong>{" "}
          {patient.address?.detail
            ? `${patient.address.detail}, ${patient.address.commune}, ${patient.address.province}`
            : "—"}
        </p>

        {showMore && (
          <div className="patient-extra">
            <p>
              <strong>CCCD:</strong>{" "}
              {patient.cccd || "Chưa cập nhật"}
            </p>

            <p>
              <strong>BHYT:</strong>{" "}
              {patient.bhyt || "Chưa cập nhật"}
            </p>
          </div>
        )}
      </div>

      <div className="patient-card-actions">
        <button
          className="booking-btn"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Ẩn bớt" : "Xem thêm"}
        </button>

        <button
          className="booking-btn primary"
          onClick={() => onEdit(patient)}
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
}
