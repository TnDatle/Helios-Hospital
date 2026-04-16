import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

function RecruitmentDetail() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================
     FORM STATE
  ===================== */
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cv: null,
    coverLetter: "",
  });

  /* =====================
     FETCH JOB DETAIL
  ===================== */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${API_BASE}/jobs/${id}`);

        if (!res.ok) {
          const text = await res.text();
          console.error("API ERROR:", text);
          throw new Error("Không tìm thấy công việc");
        }

        const data = await res.json();

        setJob(data.data);
      } catch (err) {
        console.error(err);
        setError("Không tải được chi tiết công việc");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  /* =====================
     HANDLE FORM
  ===================== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "cv") {
      setForm({ ...form, cv: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form data:", form);

    alert("Nộp CV thành công (demo)");

    // TODO: upload CV API
  };

  /* =====================
     UI STATE
  ===================== */
  if (loading) return <p className="loading">Đang tải...</p>;

  if (error) return <p className="error">{error}</p>;

  if (!job) return <p className="loading">Không tìm thấy công việc</p>;

  return (
    <div className="job-detail">
      {/* HEADER */}
      <div className="job-header">
        <h1>{job.title}</h1>

        <div className="job-meta">
          <span>📍 {job.location}</span>
          <span>💼 {job.type || "Full-time"}</span>
          <span>💰 {job.salary}</span>
          <span>⏰ Hạn nộp: {job.deadline}</span>
        </div>
      </div>

      {/* =====================
          JOB CONTENT
      ===================== */}

      <div className="job-section">
      <h2>I. Mô tả công việc</h2>
      <ul>
        {job.description
          ?.split("-")
          .filter((item) => item.trim() !== "")
          .map((item, i) => (
            <li key={i}>{item.trim()}</li>
          ))}
      </ul>
    </div>

    <div className="job-section">
      <h2>II. Yêu cầu</h2>
      <ul>
        {job.requirements
          ?.split("-")
          .filter((item) => item.trim() !== "")
          .map((item, i) => (
            <li key={i}>{item.trim()}</li>
          ))}
      </ul>
    </div>

    <div className="job-section">
      <h2>III. Quyền lợi</h2>
      <ul>
        {job.benefits
          ?.split("-")
          .filter((item) => item.trim() !== "")
          .map((item, i) => (
            <li key={i}>{item.trim()}</li>
          ))}
      </ul>
    </div>

      {/* =====================
          APPLY FORM
      ===================== */}
      <div className="apply-section">
        <h2>Ứng tuyển vị trí này</h2>

        <form onSubmit={handleSubmit} className="apply-form">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <div className="file-input">
            <label>Upload CV (PDF/DOC)</label>
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="coverLetter"
            placeholder="Cover Letter (không bắt buộc)"
            value={form.coverLetter}
            onChange={handleChange}
            rows={5}
          />

          <button type="submit">Gửi ứng tuyển</button>
        </form>
      </div>
    </div>
  );
}

export default RecruitmentDetail;