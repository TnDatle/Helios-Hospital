import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/doctors";

// ưu tiên vai trò
const ROLE_PRIORITY = {
  "Trưởng khoa": 1,
  "Phó khoa": 2,
};

const DEPARTMENT_LABEL = {
  "ngoai-tong-quat": "Ngoại Tổng Quát",
  "ngoai-tiet-nieu": "Ngoại Tiết Niệu",
  "tim-mach": "Tim Mạch & Mạch Máu",
  "ung-buou": "Ung Bướu",
  "noi-than": "Lọc Máu & Nội Thận",
  "noi-soi-tieu-hoa": "Nội Soi Tiêu Hóa",
  "noi-soi-nieu": "Nội Soi Niệu",
};

// ===== helper: chuẩn hóa khoa -> slug =====
const toSlug = (text = "") =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

// ===== pagination config =====
const PAGE_SIZE = 10;

const FindDoctor = () => {
  const navigate = useNavigate();

  const [department, setDepartment] = useState("");
  const [keyword, setKeyword] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * =====================================================
   * FETCH DOCTORS (BACKEND FILTER THEO KHOA)
   * =====================================================
   */
  const fetchDoctors = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        if (department) params.append("department", department);

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
    },
    [department]
  );

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
   * RESET PAGE WHEN FILTER / SEARCH CHANGE
   * =====================================================
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [department, keyword]);

  /**
   * =====================================================
   * FILTER + SEARCH + SORT (FE)
   * =====================================================
   */
  const processedDoctors = useMemo(() => {
    let list = [...doctors];

    // tìm theo tên hoặc chuyên môn
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      list = list.filter((d) => {
        const name = (d.name || d.DocName || "").toLowerCase();
        const specialty = (d.specialty || "").toLowerCase();
        return name.includes(kw) || specialty.includes(kw);
      });
    }

    // sort theo vai trò
    list.sort((a, b) => {
      const aPriority = ROLE_PRIORITY[a.role] || 99;
      const bPriority = ROLE_PRIORITY[b.role] || 99;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return (a.name || "").localeCompare(b.name || "");
    });

    return list;
  }, [doctors, keyword]);

  /**
   * =====================================================
   * PAGINATION LOGIC (CHỈ THÊM)
   * =====================================================
   */
  const totalPages = Math.ceil(processedDoctors.length / PAGE_SIZE);

  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return processedDoctors.slice(start, start + PAGE_SIZE);
  }, [processedDoctors, currentPage]);

  /**
   * =====================================================
   * RENDER LIST
   * =====================================================
   */
  const doctorList = useMemo(() => {
    if (loading) return <p>Đang tải danh sách bác sĩ...</p>;
    if (!loading && paginatedDoctors.length === 0)
      return <p>Không tìm thấy bác sĩ phù hợp</p>;

    return paginatedDoctors.map((doctor) => {
      const departmentSlug = toSlug(doctor.department);

      return (
        <div
          className="doctor-card"
          key={`${departmentSlug}_${doctor.id}`}
          onClick={() =>
            navigate(`/tim-bac-si/${departmentSlug}/${doctor.id}`, {
              state: {
                id: doctor.id,
                name: doctor.name || doctor.DocName,
                role: doctor.role,
                specialty: doctor.specialty,
                department: departmentSlug,
              },
            })
          }
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
            alt="doctor"
          />

          <p className="specialty">
            Khoa {DEPARTMENT_LABEL[departmentSlug] || doctor.department}
          </p>


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
      );
    });
  }, [paginatedDoctors, loading, navigate]);

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
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">Tất cả</option>
          <option value="ngoai-tong-quat">Ngoại tổng quát</option>
          <option value="ngoai-tiet-nieu">Ngoại tiết niệu</option>
          <option value="tim-mach">Tim mạch & Mạch máu</option>
          <option value="ung-buou">Ung Bướu</option>
          <option value="noi-than">Lọc Máu - Nội Thận</option>
          <option value="noi-soi-nieu">Nội Soi Niệu</option>
          <option value="noi-soi-tieu-hoa">Nội Soi Tiêu Hóa</option>
          <option value="xet-nghiem">Xét Nghiệm</option>
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

      {/* ===== PAGINATION UI ===== */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ◀
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                className={page === currentPage ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default FindDoctor;
