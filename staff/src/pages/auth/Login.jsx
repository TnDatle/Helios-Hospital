import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Firebase login
      const { user } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2️⃣ Lấy ID TOKEN
      const idToken = await user.getIdToken();

      // 3️⃣ Gọi backend để lấy role
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Không thể xác thực tài khoản");
      }

      const data = await res.json();

      // 4️⃣ Redirect theo role
      switch (data.role) {
        case "ADMIN":
          navigate("/staff/admin");
          break;
        case "DOCTOR":
          navigate("/staff/doctor");
          break;
        case "RECEPTION":
          navigate("/staff/reception");
          break;
        default:
          setError("Tài khoản không có quyền truy cập");
      }
    } catch (err) {
      console.error(err);
      setError("Email hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* HEADER */}
        <div className="login-header">
          <h1>Bệnh viện Helios Việt Nam</h1>
          <p>Hệ thống nội bộ dành cho nhân sự</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email đăng nhập</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group password-group">
            <label>Mật khẩu</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                👁
              </span>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
