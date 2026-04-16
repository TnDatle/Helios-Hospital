import { useState } from "react";
import "../../styles/humanresource/addjobs.css";

const API_BASE = "http://localhost:5000/api";

function AddJobs() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    salary: "",
    description: "",
    requirements: "",
    benefits: "",
    deadline: "", 
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate
    if (!form.title.trim()) {
      return alert("Vui lòng nhập tiêu đề");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Lỗi tạo job");
      }

      alert("Đăng bài thành công ");

      // reset form
      setForm({
        title: "",
        location: "",
        salary: "",
        description: "",
        requirements: "",
        benefits: "",
      });

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hr-container">
      <h2>Đăng bài tuyển dụng</h2>

      <form onSubmit={handleSubmit} className="hr-form">
        <input
          placeholder="Tiêu đề"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <input
          placeholder="Địa điểm"
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />

        <input
          placeholder="Mức lương"
          value={form.salary}
          onChange={(e) => handleChange("salary", e.target.value)}
        />

        <textarea
          placeholder="Mô tả công việc (JD)"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <textarea
          placeholder="Yêu cầu"
          value={form.requirements}
          onChange={(e) => handleChange("requirements", e.target.value)}
        />

        <textarea
          placeholder="Phúc lợi"
          value={form.benefits}
          onChange={(e) => handleChange("benefits", e.target.value)}
        />
        <span><strong>Deadline bài đăng</strong></span>
        <input
          type="date"
          value={form.deadline}
          onChange={(e) =>
            setForm({ ...form, deadline: e.target.value })
          }
        />

        <button type="submit" className="hr-btn primary" disabled={loading}>
          {loading ? "Đang đăng..." : "Đăng bài"}
        </button>
      </form>
    </div>
  );
}

export default AddJobs;