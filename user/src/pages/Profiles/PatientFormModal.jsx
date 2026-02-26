import { useEffect, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { addPatient, updatePatient } from "../../API/patient-api";
import { getProvinces, getCommunes } from "../../API/location-api";

export default function PatientFormModal({ patient, onClose, onSuccess }) {
  const { user } = useAuth();

  /* =====================
     FORM STATE
  ===================== */
  const [form, setForm] = useState({
    fullName: patient.fullName || "",
    dob: patient.dob || "",
    gender: patient.gender || "MALE",
    phone: patient.phone || "",
    cccd: patient.cccd || "",
    ethnicity: patient.ethnicity || "",
    bhyt: patient.bhyt || "",
    relationship: patient.relationship || "",
    provinceCode: "",
    wardCode: "",
    addressDetail: patient.address?.detail || "",
  });

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  /* =====================
     LOAD PROVINCES
  ===================== */
  useEffect(() => {
    getProvinces().then((data) => setProvinces(data || []));
  }, []);

  /* =====================
     MAP DATA WHEN EDIT
  ===================== */
  useEffect(() => {
    if (!patient.address || !provinces.length) return;

    const provinceObj = provinces.find(
      (p) => p.name === patient.address.province
    );

    if (provinceObj) {
      setForm((prev) => ({
        ...prev,
        provinceCode: provinceObj.code,
      }));

      getCommunes(provinceObj.code).then((wardsData) => {
        setWards(wardsData || []);

        const wardObj = wardsData?.find(
          (w) => w.name === patient.address.commune
        );

        if (wardObj) {
          setForm((prev) => ({
            ...prev,
            wardCode: wardObj.code,
          }));
        }
      });
    }
  }, [patient, provinces]);

  /* =====================
     HANDLERS
  ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = async (e) => {
    const code = e.target.value;

    setForm((prev) => ({
      ...prev,
      provinceCode: code,
      wardCode: "",
    }));
    setWards([]);

    if (!code) return;

    const data = await getCommunes(code);
    setWards(data || []);
  };

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async () => {
  if (
    !form.fullName ||
    !form.dob ||
    !form.provinceCode ||
    !form.wardCode ||
    (!patient.isDefault && !form.relationship)
  ) {
    alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
    return;
  }

  const provinceObj = provinces.find(
    (p) => p.code === form.provinceCode
  );
  const wardObj = wards.find(
    (w) => w.code === form.wardCode
  );

  const payload = {
    fullName: form.fullName,
    dob: form.dob,
    gender: form.gender,
    phone: form.phone,
    cccd: form.cccd,
    ethnicity: form.ethnicity,
    bhyt: form.bhyt,
    isDefault: patient.isDefault || false,
    relationship: patient.isDefault ? null : form.relationship,
    address: {
      province: provinceObj?.name || "",
      commune: wardObj?.name || "",
      detail: form.addressDetail,
    },
  };

  try {
    alert("Đang lưu thông tin...");

    let result;

    if (patient.id) {
      result = await updatePatient(patient.id, payload);
    } else {
      result = await addPatient(payload);
    }

    if (result?.message === "PHONE_EXISTS") {
      alert("Số điện thoại đã tồn tại trong hệ thống.");
      return;
    }

    if (result?.message === "CCCD_EXISTS") {
      alert("CCCD đã tồn tại trong hệ thống.");
      return;
    }

    alert(patient.id ? "Cập nhật thành công!" : "Thêm người thân thành công!");

    onSuccess();
    onClose();

  } catch (err) {
    console.error("Patient save error:", err);
    alert("Có lỗi xảy ra. Vui lòng thử lại.");
  }
};

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="patient-modal-backdrop">
      <div className="patient-modal">
        <h4>{patient.id ? "Cập nhật hồ sơ" : "Thêm người thân"}</h4>

        <div className="patient-form">
          <input
            name="fullName"
            placeholder="Họ và tên"
            value={form.fullName}
            onChange={handleChange}
          />

          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>

          {/* ===== RELATIONSHIP (ONLY RELATIVE) ===== */}
          {!patient.isDefault && (
            <select
              name="relationship"
              value={form.relationship}
              onChange={handleChange}
            >
              <option value="">Chọn mối quan hệ</option>
              <option value="FATHER">Cha</option>
              <option value="MOTHER">Mẹ</option>
              <option value="SPOUSE">Vợ / Chồng</option>
              <option value="CHILD">Con</option>
              <option value="OTHER">Người thân khác</option>
            </select>
          )}

          <input
            name="phone"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            name="ethnicity"
            placeholder="Dân Tộc"
            value={form.ethnicity}
            onChange={handleChange}
          />

          <input
            name="cccd"
            placeholder="CCCD"
            value={form.cccd}
            onChange={handleChange}
          />

          <input
            name="bhyt"
            placeholder="BHYT (nếu có)"
            value={form.bhyt}
            onChange={handleChange}
          />

          {/* ===== LOCATION ===== */}
          <select
            value={form.provinceCode}
            onChange={handleProvinceChange}
          >
            <option value="">Chọn Tỉnh / Thành phố</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={form.wardCode}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                wardCode: e.target.value,
              }))
            }
            disabled={!wards.length}
          >
            <option value="">Chọn Phường / Xã</option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>

          <input
            name="addressDetail"
            placeholder="Số nhà, tên đường"
            value={form.addressDetail}
            onChange={handleChange}
          />
        </div>

        <div className="booking-actions">
          <button className="booking-btn" onClick={onClose}>
            Huỷ
          </button>
          <button className="booking-btn primary" onClick={handleSubmit}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
