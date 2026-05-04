import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

function Recruitment() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };
  
  /* =====================
     FETCH DATA
  ===================== */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_BASE}/jobs`);

        // debug nếu lỗi JSON
        if (!res.ok) {
          const text = await res.text();
          console.error("API ERROR:", text);
          throw new Error("Không lấy được dữ liệu");
        }

        const data = await res.json();

        // format dữ liệu cho FE
        const formattedJobs = (data.data || [])
          // ẩn job hết hạn
          .filter((job) => {
            if (!job.deadline) return true;
            return new Date(job.deadline) >= new Date();
          })
          .map((job) => ({
            id: job.id,
            title: job.title,
            location: job.location,
            type: job.type || "Full-time",
            salary: job.salary,
            deadline: job.deadline,
            summary: job.description
              ? job.description.slice(0, 120) + "..."
              : "",
            isHot: job.isHot || false,
          }));

        setJobs(formattedJobs);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu tuyển dụng");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* =====================
     RENDER
  ===================== */
  if (loading) return <p className="loading">Đang tải tuyển dụng...</p>;

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="recruitment">
      {/* HEADER */}
      <div className="recruitment-header">
        <h1>TUYỂN DỤNG</h1>
        <p>
          Tham gia cùng chúng tôi để phát triển sự nghiệp trong môi trường
          chuyên nghiệp và ổn định.
        </p>
      </div>

      {/* JOB LIST */}
      <div className="job-list">
        {jobs.length === 0 ? (
          <p>Chưa có tin tuyển dụng</p>
        ) : (
          jobs.map((job) => (
            <Link
              to={`/tuyen-dung/${job.id}`}
              className={`job-card ${job.isHot ? "hot" : ""}`}
              key={job.id}
            >
              <div className="job-main">
                <h3>{job.title}</h3>

                <div className="job-meta">
                  <span>📍 {job.location}</span>
                  <span>💼 {job.type}</span>
                  <span>💰 {job.salary}</span>
                </div>

              </div>

              <div className="job-action">
                <span className="deadline">
                   Hạn: {formatDate(job.deadline)}
                </span>
                <button>Ứng tuyển</button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Recruitment;