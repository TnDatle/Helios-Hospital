import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * MOCK USERS – demo đăng nhập & phân role
 */
const MOCK_USERS = [
  { email: "staff@helios.vn", password: "123456", role: "reception" },
  { email: "doctor@helios.vn", password: "123456", role: "doctor" },
  { email: "admin@helios.vn", password: "123456", role: "admin" },
];

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setError("Email hoặc mật khẩu không đúng");
      return;
    }

    if (user.role === "reception") navigate("/staff/reception");
    if (user.role === "doctor") navigate("/staff/doctor");
    if (user.role === "admin") navigate("/staff/admin");
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
            />
          </div>

          <div className="form-group password-group">
            <label>Mật khẩu</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? "👁" : "👁"}
              </span>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn">
            Đăng nhập
          </button>
        </form>

        {/* FOOTER */}
        <div className="login-footer">
          <strong>Tài khoản demo</strong>
          <div>staff@helios.vn / 123456</div>
          <div>doctor@helios.vn / 123456</div>
          <div>admin@helios.vn / 123456</div>
        </div>
      </div>
    </div>
  );
}

export default Login;
