import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function RecruitmentDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

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
     MOCK DATA
  ===================== */
  const mockJobs = [
    {
      id: "1",
      title: "Frontend Developer (ReactJS)",
      location: "TP. Hồ Chí Minh",
      type: "Full-time",
      salary: "15 - 25 triệu",
      deadline: "30/05/2026",

      description: `
        <ul>
          <li>Phát triển giao diện người dùng bằng ReactJS.</li>
          <li>Phối hợp với Backend để tích hợp API.</li>
          <li>Tối ưu hiệu năng và UX/UI.</li>
          <li>Bảo trì và nâng cấp hệ thống.</li>
        </ul>
      `,

      requirements: `
        <ul>
          <li>Tốt nghiệp Đại học/Cao đẳng CNTT.</li>
          <li>Thành thạo HTML, CSS, JavaScript.</li>
          <li>Có kinh nghiệm ReactJS là lợi thế.</li>
          <li>Kỹ năng làm việc nhóm tốt.</li>
        </ul>
      `,

      benefits: `
        <ul>
          <li>Lương theo ngạch/bậc + phụ cấp.</li>
          <li>Đóng BHXH, BHYT, BHTN đầy đủ.</li>
          <li>Nghỉ lễ, Tết theo quy định Nhà nước.</li>
          <li>Môi trường ổn định, lâu dài.</li>
          <li>Được đào tạo nâng cao chuyên môn.</li>
        </ul>
      `,
    },
    {
      id: "2",
      title: "Backend Developer (NodeJS)",
      location: "TP. Hồ Chí Minh",
      type: "Full-time",
      salary: "18 - 30 triệu",
      deadline: "15/06/2026",

      description: `
        <ul>
          <li>Xây dựng API bằng NodeJS, Express.</li>
          <li>Thiết kế và quản lý database.</li>
          <li>Đảm bảo bảo mật và hiệu năng hệ thống.</li>
          <li>Phối hợp với Frontend.</li>
        </ul>
      `,

      requirements: `
        <ul>
          <li>Tốt nghiệp CNTT hoặc tương đương.</li>
          <li>Có kinh nghiệm NodeJS.</li>
          <li>Hiểu RESTful API.</li>
          <li>Biết Docker là lợi thế.</li>
        </ul>
      `,

      benefits: `
        <ul>
          <li>Lương + thưởng theo hiệu quả.</li>
          <li>Đầy đủ chế độ bảo hiểm.</li>
          <li>Thưởng lễ, Tết.</li>
          <li>Cơ hội thăng tiến.</li>
        </ul>
      `,
    },
  ];

  /* =====================
     FETCH JOB
  ===================== */
  useEffect(() => {
    const found = mockJobs.find((item) => item.id === id);
    setJob(found);
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

    // TODO: call API upload CV
  };

  if (!job) return <p className="loading">Không tìm thấy công việc</p>;

  return (
    <div className="job-detail">
      {/* HEADER */}
      <div className="job-header">
        <h1>{job.title}</h1>

        <div className="job-meta">
          <span>📍 {job.location}</span>
          <span>💼 {job.type}</span>
          <span>💰 {job.salary}</span>
          <span>⏰ Hạn nộp: {job.deadline}</span>
        </div>
      </div>

      {/* =====================
          JOB CONTENT
      ===================== */}
      <div className="job-section">
        <h2>I. Mô tả công việc</h2>
        <div
          dangerouslySetInnerHTML={{ __html: job.description }}
        />
      </div>

      <div className="job-section">
        <h2>II. Yêu cầu</h2>
        <div
          dangerouslySetInnerHTML={{ __html: job.requirements }}
        />
      </div>

      <div className="job-section">
        <h2>III. Quyền lợi</h2>
        <div
          dangerouslySetInnerHTML={{ __html: job.benefits }}
        />
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

          {/* Upload CV */}
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

          {/* Cover Letter */}
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