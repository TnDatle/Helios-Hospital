import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../../config/firebase";
import "../../styles/auth.css";
import { useToast } from "../../components/ToastContext";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    setLoading(true); // đưa ra ngoài try

    try {
      await setPersistence(auth, browserSessionPersistence);

      const { user } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idToken = await user.getIdToken();

      const res = await fetch("http://localhost:5000/api/auth/me-token", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("UNAUTHORIZED");
      }

      const data = await res.json();

      if (data.data.role !== "PATIENT") {
        await auth.signOut();
        throw new Error("NOT_PATIENT"); // QUAN TRỌNG
      }

      showToast("Đăng nhập thành công");
      navigate("/");

    } catch (err) {
      console.error("Login error:", err);

      if (err.message === "NOT_PATIENT") {
        setError(
          "Email này thuộc nhân sự bệnh viện. Vui lòng đăng nhập tại cổng nội bộ."
        );
      } else {
        setError("Email hoặc mật khẩu không đúng");
      }
    } finally {
      setLoading(false); // LUÔN LUÔN CHẠY
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Đăng nhập</h2>
        <p className="auth-subtitle">
          Bệnh viện Helios Việt Nam
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email đã đăng ký"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Chưa có tài khoản?</span>
          <Link to="/dang-ky">Đăng ký tài khoản</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
