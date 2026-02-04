import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { getProvinces, getCommunes } from "../../API/location-api";
import { validatePatientForm } from "../../utils/validate";
import "../../styles/auth.css";

function CompleteProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // ===== LOCATION =====
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [provinceCode, setProvinceCode] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    dob: "",
    phone: "",
    cccd: "",
    ethnicity: "",
    province: "", // name
    commune: "",  // name
    address: "",
  });

  // ===== PROTECT ROUTE =====
  useEffect(() => {
    if (!auth.currentUser) navigate("/dang-nhap");
  }, [navigate]);

  // ===== LOAD LOCATION =====
  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  useEffect(() => {
    if (provinceCode) {
      getCommunes(provinceCode).then(setCommunes);
    } else {
      setCommunes([]);
    }
  }, [provinceCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validateErrors = validatePatientForm(form);
    setErrors(validateErrors);

    if (Object.keys(validateErrors).length > 0) return;

    setLoading(true);

    try {
      const user = auth.currentUser;

      await addDoc(collection(db, "Patients"), {
        ownerUid: user.uid,
        fullName: form.fullName.trim(),
        gender: form.gender,
        dob: form.dob,
        phone: form.phone,
        cccd: form.cccd || null,
        ethnicity: form.ethnicity,
        address: {
          province: form.province,
          commune: form.commune,
          detail: form.address,
        },
        isDefault: true,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Create patient error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <h2 className="auth-title">Hoàn tất hồ sơ cá nhân</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            {errors.fullName && <span className="form-error">{errors.fullName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Giới tính</label>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">-- Chọn --</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ngày sinh</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
              {errors.dob && <span className="form-error">{errors.dob}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input name="phone" value={form.phone} onChange={handleChange} required />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Dân Tộc</label>
            <input name="ethnicity" value={form.ethnicity} onChange={handleChange} required />
            {errors.ethnicity && <span className="form-error">{errors.ethnicity}</span>}
          </div>

          <div className="form-group">
            <label>Căn cước công dân</label>
            <input name="cccd" value={form.cccd} onChange={handleChange} required />
            {errors.cccd && <span className="form-error">{errors.cccd}</span>}
          </div>

          {/* ===== ADDRESS ===== */}
          <div className="form-row">
            <div className="form-group">
              <label>Tỉnh / Thành phố</label>
              <select
                value={provinceCode}
                onChange={(e) => {
                  const code = e.target.value;
                  const name = e.target.options[e.target.selectedIndex].text;
                  setProvinceCode(code);
                  setForm((prev) => ({
                    ...prev,
                    province: name,
                    commune: "",
                  }));
                }}
              >
                <option value="">-- Chọn --</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>
              {errors.province && <span className="form-error">{errors.province}</span>}
            </div>

            <div className="form-group">
              <label>Phường / Xã</label>
              <select
                value={form.commune}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, commune: e.target.value }))
                }
                disabled={!provinceCode}
              >
                <option value="">-- Chọn --</option>
                {communes.map((c) => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
              {errors.commune && <span className="form-error">{errors.commune}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Địa chỉ chi tiết</label>
            <input name="address" value={form.address} onChange={handleChange} />
          </div>

          {success && (
            <p className="form-success">
               Lưu hồ sơ thành công! Đang chuyển trang...
            </p>
          )}

          <button className="btn-primary" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu hồ sơ"}
          </button>

          <p className="auth-note">
          ⚠️ Để việc tiếp nhận hồ sơ diễn ra nhanh chóng,
            vui lòng nhập thông tin đúng theo giấy tờ pháp lý hợp lệ
            (CCCD, Giấy khai sinh).
        </p>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
