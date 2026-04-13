import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth  , rtdb } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { ref, set, onDisconnect } from "firebase/database";

const API_BASE = "http://localhost:5000/api";

function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     🔑 ĐÃ LOGIN → ĐẨY RA KHỎI LOGIN
  ========================= */
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/staff", { replace: true });
    }
  }, [user, authLoading, navigate]);

  /* =========================
     SUBMIT LOGIN
  ========================= */
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
      const { user: fbUser } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2️⃣ Lấy Firebase ID token
      const idToken = await fbUser.getIdToken();

      // 3️⃣ GỬI TOKEN → BACKEND TẠO SESSION
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      // CHECK TRƯỚC
      if (!res.ok) {
        throw new Error("LOGIN_FAILED");
      }

      // Rồi mới làm tiếp
      await refreshUser();

      const userStatusRef = ref(rtdb, "/status/" + fbUser.uid);

      await set(userStatusRef, {
        isOnline: true,
        lastChanged: Date.now(),
      });

      onDisconnect(userStatusRef).set({
        isOnline: false,
        lastChanged: Date.now(),
      });

      if (!res.ok) {
        throw new Error("LOGIN_FAILED");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Email hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  // ⏳ chờ AuthContext xác nhận
  if (authLoading) return null;

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
