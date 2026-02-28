import { useEffect, useState, useRef } from "react";
import { getProvinces, getCommunes } from "../../API/location-api";
import {
  getSelfPatientByOwner,
  getPatientsByOwner,
} from "../../API/patient-api";
import { useAuth } from "../../auth/useAuth";

const RELATIONSHIP_LABEL = {
  FATHER: "Cha",
  MOTHER: "Mẹ",
  SPOUSE: "Vợ / Chồng",
  CHILD: "Con",
  OTHER: "Người thân khác",
};

export default function StepPatient({ onBack, onSelect }) {
  const { user } = useAuth();

  /* =====================
     MODE STATE
  ===================== */
  const [type, setType] = useState("SELF"); // SELF | OTHER
  const [otherMode, setOtherMode] = useState("SELECT"); // SELECT | NEW
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isSelfLoaded, setIsSelfLoaded] = useState(false);
  /* =====================
     FORM STATE
  ===================== */
  const emptyPatient = {
    fullName: "",
    dob: "",
    gender: "MALE",
    phone: "",
    cccd: "",
    bhyt: "",
    relationship: "",
    ethnicity:"",
    province: "",
    ward: "",
    address: "",
  };

  const [patient, setPatient] = useState(emptyPatient);

  const isFilled = (v) => !!v;

  /* =====================
     LOCATION STATE + CACHE
  ===================== */
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  const wardsCache = useRef({});
  const selfProfileCache = useRef(null);

  /* =====================
     RELATIVES (SELECT MODE)
  ===================== */
  const [relatives, setRelatives] = useState([]);
  const [selectedRelative, setSelectedRelative] = useState(null);

  /* =====================
     LOAD PROVINCES (1 LẦN)
  ===================== */
  useEffect(() => {
    getProvinces()
      .then((data) => setProvinces(data || []))
      .catch(console.error);
  }, []);

  /* =====================
     LOAD SELF PROFILE (CACHE)
  ===================== */
  useEffect(() => {
    if (!user || type !== "SELF" || !provinces.length) return;

    const loadSelfPatient = async () => {
      setLoadingProfile(true);
      setIsSelfLoaded(false);

      let profile = selfProfileCache.current;

      if (!profile) {
        profile = await getSelfPatientByOwner(user.uid);
        selfProfileCache.current = profile;
      }

      if (!profile) {
        // Không có hồ sơ → cho nhập
        setPatient(emptyPatient);
        setWards([]);
        setIsSelfLoaded(false);
        setLoadingProfile(false);
        return;
      }

      const provinceObj = provinces.find(
        (p) => p.name === profile.address?.province
      );

      const provinceCode = provinceObj?.code || "";

      setPatient({
        fullName: profile.fullName || "",
        dob: profile.dob || "",
        gender: profile.gender || "MALE",
        phone: profile.phone || "",
        cccd: profile.cccd || "",
        ethnicity: profile.ethnicity || "Kinh",
        bhyt: profile.bhyt || "",
        relationship: "",
        province: provinceCode,
        ward: "",
        address: profile.address?.detail || "",
      });

      if (provinceCode) {
        let wardsData = wardsCache.current[provinceCode];

        if (!wardsData) {
          wardsData = await getCommunes(provinceCode);
          wardsCache.current[provinceCode] = wardsData || [];
        }

        setWards(wardsData || []);

        const wardObj = wardsData?.find(
          (w) => w.name === profile.address?.commune
        );

        if (wardObj) {
          setPatient((prev) => ({
            ...prev,
            ward: wardObj.code,
          }));
        }
      }

      // Đánh dấu đã load profile thật
      setIsSelfLoaded(true);
      setLoadingProfile(false);
    };

    loadSelfPatient();
  }, [user?.uid, type, provinces.length]);

  /* =====================
     LOAD RELATIVES (SELECT)
  ===================== */
  useEffect(() => {
    if (!user || type !== "OTHER" || otherMode !== "SELECT") return;

    getPatientsByOwner(user.uid).then((data) => {
      setRelatives(data.filter((p) => !p.isDefault));
    });
  }, [type, otherMode, user?.uid]);

  /* =====================
     SWITCH MODE
  ===================== */
  useEffect(() => {
    if (type === "OTHER") {
      setPatient(emptyPatient);
      setWards([]);
      setSelectedRelative(null);
    }
  }, [type]);

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

    if (!code) {
      setWards([]);
      return;
    }

    if (wardsCache.current[code]) {
      setWards(wardsCache.current[code]);
      return;
    }

    const data = await getCommunes(code);
    wardsCache.current[code] = data || [];
    setWards(data || []);
  };

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = () => {
    /* ===== OTHER → SELECT ===== */
    if (type === "OTHER" && otherMode === "SELECT") {
      if (!selectedRelative) {
        alert("Vui lòng chọn người thân");
        return;
      }
      onSelect(selectedRelative);
      return;
    }

    /* ===== VALIDATE FORM ===== */
    if (
      !patient.fullName ||
      !patient.dob ||
      !patient.phone ||
      !patient.cccd ||
      !patient.ethnicity ||
      !patient.province ||
      !patient.ward ||
      !patient.address ||
      (type === "OTHER" && !patient.relationship)
    ) {
      alert("Vui lòng nhập đầy đủ thông tin người khám");
      return;
    }

    const provinceObj = provinces.find(
      (p) => p.code === patient.province
    );
    const wardObj = wards.find(
      (w) => w.code === patient.ward
    );

    onSelect({
      ownerUid: user.uid,
      fullName: patient.fullName,
      dob: patient.dob,
      gender: patient.gender,
      phone: patient.phone,
      cccd: patient.cccd,
      ethnicity: patient.ethnicity.trim(),
      bhyt: patient.bhyt || "",
      isDefault: type === "SELF",
      relationship: type === "OTHER" ? patient.relationship : null,
      address: {
        province: provinceObj?.name || "",
        commune: wardObj?.name || "",
        detail: patient.address.trim(),
      },
    });
  };

  /* =====================
     RENDER
  ===================== */
  return (
    <>
      <h4>Thông tin người khám</h4>

      {/* ===== SELF / OTHER ===== */}
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

      {/* ===== OTHER MODE ===== */}
      {type === "OTHER" && (
        <div className="patient-type" style={{ marginTop: 12 }}>
          <label>
            <input
              type="radio"
              checked={otherMode === "SELECT"}
              onChange={() => setOtherMode("SELECT")}
            />
            Chọn người thân đã lưu
          </label>

          <label>
            <input
              type="radio"
              checked={otherMode === "NEW"}
              onChange={() => setOtherMode("NEW")}
            />
            Nhập người thân mới
          </label>
        </div>
      )}

      {loadingProfile && <p>Đang tải hồ sơ...</p>}

      {/* ===== SELECT RELATIVE ===== */}
      {type === "OTHER" && otherMode === "SELECT" && (
        <select
          value={selectedRelative?.id || ""}
          onChange={(e) =>
            setSelectedRelative(
              relatives.find((r) => r.id === e.target.value)
            )
          }
        >
          <option value="">Chọn người thân</option>
          {relatives.map((r) => (
            <option key={r.id} value={r.id}>
              {r.fullName} ({RELATIONSHIP_LABEL[r.relationship]})
            </option>
          ))}
        </select>
      )}

      {/* ===== FORM (SELF / OTHER-NEW) ===== */}
      {(type === "SELF" || otherMode === "NEW") && (
        <div className="patient-form-wrapper">
          <div className="patient-form-title">
            Thông tin chi tiết
          </div>
        <div className="patient-form">
          <input
            name="fullName"
            placeholder="Họ và Tên"
            value={patient.fullName}
            onChange={handleChange}
            disabled={type === "SELF" && isSelfLoaded}
          />

          <input
            type="date"
            name="dob"
            value={patient.dob}
            onChange={handleChange}
            disabled={type === "SELF" && isSelfLoaded}
          />

          <select
            name="gender"
            value={patient.gender}
            onChange={handleChange}
            disabled={type === "SELF" && isSelfLoaded}
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
            value={patient.phone}
            onChange={handleChange}
            disabled={type === "SELF" && isSelfLoaded}
          />

          <input
            name="ethnicity"
            placeholder="Dân tộc (VD: Kinh, Tày, Thái...)"
            value={patient.ethnicity}
            onChange={handleChange}
            disabled={type === "SELF" && isSelfLoaded}
          />

          <input
            name="cccd"
            placeholder="Căn cước công dân"
            value={patient.cccd}
            onChange={handleChange}
            disabled={type === "SELF" && isSelfLoaded}
          />

          <select
            value={patient.province}
            onChange={handleProvinceChange}
            disabled={type === "SELF" && isSelfLoaded}
          >
            <option value="">Chọn Tỉnh / Thành</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={patient.ward}
            onChange={(e) =>
              setPatient((prev) => ({ ...prev, ward: e.target.value }))
            }
            disabled={type === "SELF" && isSelfLoaded}
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
            disabled={type === "SELF" && isSelfLoaded}
          />
        </div>
        </div>
      )}

      <div className="booking-actions">
        <button className="booking-btn" onClick={onBack}>
          Quay lại
        </button>

        <button className="booking-btn primary" onClick={handleSubmit}>
          Tiếp tục
        </button>
      </div>
    </>
  );
}
