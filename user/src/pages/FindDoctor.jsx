import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/doctors";

// ưu tiên vai trò
const ROLE_PRIORITY = {
  "Trưởng khoa": 1,
  "Phó khoa": 2,
};

const FindDoctor = () => {
  const navigate = useNavigate();

  const [department, setDepartment] = useState("");
  const [keyword, setKeyword] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * =====================================================
   * FETCH DOCTORS (BACKEND FILTER THEO KHOA)
   * =====================================================
   */
  const fetchDoctors = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (department) {
        params.append("department", department);
      }

      const res = await fetch(`${API_URL}?${params.toString()}`, { signal });
      const json = await res.json();

      if (json.success) {
        setDoctors(json.data);
      } else {
        setDoctors([]);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Fetch doctors error:", err);
        setError("Không thể tải danh sách bác sĩ");
      }
    } finally {
      setLoading(false);
    }
  }, [department]);

  /**
   * =====================================================
   * AUTO LOAD WHEN DEPARTMENT CHANGE
   * =====================================================
   */
  useEffect(() => {
    const controller = new AbortController();
    fetchDoctors(controller.signal);

    return () => controller.abort();
  }, [department, fetchDoctors]);

  /**
   * =====================================================
   * FILTER + SEARCH + SORT (LOGIC FE)
   * =====================================================
   */
  const processedDoctors = useMemo(() => {
    let list = [...doctors];

    // 🔍 tìm theo TÊN bác sĩ hoặc CHUYÊN MÔN
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();

      list = list.filter((d) => {
        const name =
          (d.name || d.DocName || "").toLowerCase();
        const specialty =
          (d.specialty || "").toLowerCase();

        return (
          name.includes(kw) ||
          specialty.includes(kw)
        );
      });
    }

    // 🔽 sắp xếp theo vai trò
    list.sort((a, b) => {
      const aPriority = ROLE_PRIORITY[a.role] || 99;
      const bPriority = ROLE_PRIORITY[b.role] || 99;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // cùng level → sort theo tên
      return (a.name || "").localeCompare(b.name || "");
    });

    return list;
  }, [doctors, keyword]);

  /**
   * =====================================================
   * RENDER LIST
   * =====================================================
   */
  const doctorList = useMemo(() => {
    if (loading) return <p>Đang tải danh sách bác sĩ...</p>;
    if (!loading && processedDoctors.length === 0)
      return <p>Không tìm thấy bác sĩ phù hợp</p>;

    return processedDoctors.map((doctor) => (
      <div
        className="doctor-card"
        key={`${doctor.department}_${doctor.id}`}
        onClick={() =>
          navigate(`/tim-bac-si/${doctor.department}/${doctor.id}`, {
            state: doctor,
          })
        }
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
          alt="doctor"
        />
        <p className="specialty">{doctor.department}</p>
        <h3>{doctor.name || doctor.DocName}</h3>
        <h3>{doctor.specialty}</h3>
        <h3
          className={
            doctor.role === "Trưởng khoa" || doctor.role === "Phó khoa"
              ? "role-lead"
              : "role-doctor"
          }
        >
          {doctor.role || "Bác sĩ"}
        </h3>
      </div>
    ));
  }, [processedDoctors, loading, navigate]);

  return (
    <div className="find-doctor">
      {/* ===== HERO ===== */}
      <div
        className="find-doctor-hero"
        style={{
          backgroundImage: 'url("/icons/hand-banner.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="breadcrumb">Trang chủ / Điều trị</div>
        <h1>BÁC SĨ</h1>
      </div>

      {/* ===== SEARCH ===== */}
      <div className="find-doctor-search container">
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Tất cả</option>
          <option value="Ngoai Tong Quat">Ngoại tổng quát</option>
          <option value="Ngoai Tiet Nieu">Ngoại tiết niệu</option>
          <option value="Tim Mach">Tim mạch & Mạch máu</option>
        </select>

        <input
          type="text"
          placeholder="Tìm theo tên bác sĩ hoặc chuyên môn"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? "ĐANG TÌM..." : "TÌM BÁC SĨ"}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="doctor-list container">{doctorList}</div>
    </div>
  );
};

export default FindDoctor;
