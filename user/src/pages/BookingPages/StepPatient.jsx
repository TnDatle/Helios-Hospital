import { useEffect, useState } from "react";
import { getProvinces, getCommunes } from "../../API/location-api";

export default function StepPatient({ onBack, onSelect }) {
  const [type, setType] = useState("SELF");

  const [patient, setPatient] = useState({
    fullName: "",
    dob: "",
    gender: "MALE",
    relationship: "SELF",
    phone: "",
    cccd: "",
    bhyt: "",
    province: "",
    ward: "",
    address: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  /* =====================
     LOAD PROVINCES
  ===================== */
  useEffect(() => {
    getProvinces()
      .then((data) => setProvinces(data || []))
      .catch((err) =>
        console.error("Load provinces error:", err)
      );
  }, []);

  /* =====================
     HANDLERS
  ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = async (e) => {
    const code = e.target.value;

    setPatient((prev) => ({
      ...prev,
      province: code,
      ward: "",
    }));
    setWards([]);

    if (!code) return;

    try {
      const data = await getCommunes(code);
      setWards(data || []);
    } catch (err) {
      console.error("Load wards error:", err);
    }
  };

  const handleSubmit = () => {
    if (
      !patient.fullName ||
      !patient.dob ||
      !patient.phone ||
      !patient.province ||
      !patient.ward ||
      !patient.address
    ) {
      alert("Vui lòng nhập đầy đủ thông tin người khám và địa chỉ");
      return;
    }

    onSelect({
      ...patient,
      relationship: type,
    });
  };

  /* =====================
     RENDER
  ===================== */
  return (
    <>
      <h4>Thông tin người khám</h4>

      {/* ===== CHỌN ĐỐI TƯỢNG ===== */}
      <div className="patient-type">
        <label>
          <input
            type="radio"
            checked={type === "SELF"}
            onChange={() => setType("SELF")}
          />
          Tôi đăng ký cho bản thân
        </label>

        <label>
          <input
            type="radio"
            checked={type === "OTHER"}
            onChange={() => setType("OTHER")}
          />
          Đăng ký cho người thân
        </label>
      </div>

      {/* ===== FORM ===== */}
      <div className="patient-form">
        <input
          name="fullName"
          placeholder="Họ và tên (theo CCCD)"
          value={patient.fullName}
          onChange={handleChange}
        />

        <input
          type="date"
          name="dob"
          value={patient.dob}
          onChange={handleChange}
        />

        <select
          name="gender"
          value={patient.gender}
          onChange={handleChange}
        >
          <option value="MALE">Nam</option>
          <option value="FEMALE">Nữ</option>
          <option value="OTHER">Khác</option>
        </select>

        {type === "OTHER" && (
          <select
            name="relationship"
            value={patient.relationship}
            onChange={handleChange}
          >
            <option value="FATHER">Cha</option>
            <option value="MOTHER">Mẹ</option>
            <option value="CHILD">Con</option>
            <option value="SPOUSE">Vợ / Chồng</option>
            <option value="OTHER">Người thân khác</option>
          </select>
        )}

        <input
          name="phone"
          placeholder="Số điện thoại liên hệ"
          value={patient.phone}
          onChange={handleChange}
        />

        <input
          name="cccd"
          placeholder="CCCD (12 số)"
          value={patient.cccd}
          onChange={handleChange}
        />

        <input
          name="bhyt"
          placeholder="Mã BHYT (nếu có)"
          value={patient.bhyt}
          onChange={handleChange}
        />

        {/* ===== ĐỊA CHỈ ===== */}
        <select
          value={patient.province}
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
          value={patient.ward}
          onChange={(e) =>
            setPatient((prev) => ({
              ...prev,
              ward: e.target.value,
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
          name="address"
          placeholder="Số nhà, tên đường"
          value={patient.address}
          onChange={handleChange}
        />
      </div>

      <p className="patient-note">
        * Thông tin người khám cần chính xác theo giấy tờ tùy thân.
      </p>

      <div className="booking-actions">
        <button className="booking-btn" onClick={onBack}>
          Quay lại
        </button>

        <button
          className="booking-btn primary"
          onClick={handleSubmit}
        >
          Tiếp tục
        </button>
      </div>
    </>
  );
}
