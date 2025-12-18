import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/doctors";

const FindDoctor = () => {
  const navigate = useNavigate();

  const [department, setDepartment] = useState("");
  const [keyword, setKeyword] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * =====================================================
   * FETCH DOCTORS (MEMOIZED)
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

      if (keyword.trim()) {
        params.append("keyword", keyword.trim());
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
  }, [department, keyword]);


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
   * HANDLE SEARCH CLICK
   * =====================================================
   */
  const handleSearch = () => {
    const controller = new AbortController();
    fetchDoctors(controller.signal);
  };

  /**
   * =====================================================
   * MEMO RENDER LIST
   * =====================================================
   */
  const doctorList = useMemo(() => {
    if (loading) return <p>Đang tải danh sách bác sĩ...</p>;
    if (!loading && doctors.length === 0)
      return <p>Không tìm thấy bác sĩ phù hợp</p>;

    return doctors.map((doctor) => (
      <div
        className="doctor-card"
        key={`${doctor.department}_${doctor.id}`}
        onClick={() =>
          navigate(`/tim-bac-si/${doctor.department}/${doctor.id}`, {
            state: doctor, //  dùng lại data, tránh fetch lại
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
        <h3>{doctor.role}</h3>
      </div>
    ));
  }, [doctors, loading, navigate, department]);

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
          placeholder="Tên bác sĩ"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button onClick={handleSearch} disabled={loading}>
          {loading ? "ĐANG TÌM..." : "TÌM BÁC SĨ"}
        </button>
      </div>

      {/* ===== ERROR ===== */}
      {error && <p className="error-text">{error}</p>}

      {/* ===== LIST ===== */}
      <div className="doctor-list container">{doctorList}</div>
    </div>
  );
};

export default FindDoctor;
