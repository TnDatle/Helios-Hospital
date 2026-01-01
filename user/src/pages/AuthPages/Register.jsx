import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import "../../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess(false);

    if (!form.email || !form.password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    setLoading(true);

    try {
      //Tạo Firebase Auth user
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

      const user = userCredential.user;

      //  Tạo document trong users collection
      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "PATIENT",
        createdAt: serverTimestamp(),
      });

      // Thông báo thành công
      setSuccess(true);

      // Chuyển sang bước nhập thông tin cá nhân
      setTimeout(() => {
        navigate("/complete-profile", {
          replace: true,
          state: { fromRegister: true },
        });
      }, 1500);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email đã được sử dụng");
      } else if (err.code === "auth/weak-password") {
        setError("Mật khẩu phải từ 6 ký tự trở lên");
      } else {
        setError("Đăng ký thất bại, vui lòng thử lại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Đăng ký tài khoản</h2>
        <p className="auth-subtitle">
          Tạo tài khoản để đặt lịch khám bệnh
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Nhập lại mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          {success && (
            <p className="form-success">
               Đăng ký thành công! Vui lòng hoàn tất thông tin cá nhân.
            </p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Đã có tài khoản?</span>
          <Link to="/dang-nhap">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
