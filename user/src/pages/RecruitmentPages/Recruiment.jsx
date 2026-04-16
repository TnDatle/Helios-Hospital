import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Recruitment() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     MOCK DATA
  ===================== */
  const mockJobs = [
    {
      id: 1,
      title: "Frontend Developer (ReactJS)",
      location: "TP. Hồ Chí Minh",
      type: "Full-time",
      salary: "15 - 25 triệu",
      summary:
        "Phát triển giao diện người dùng cho hệ thống CRM, tối ưu UX/UI và hiệu suất.",
      isHot: true,
    },
    {
      id: 2,
      title: "Backend Developer (NodeJS)",
      location: "TP. Hồ Chí Minh",
      type: "Full-time",
      salary: "18 - 30 triệu",
      summary:
        "Xây dựng API, làm việc với database và tối ưu hệ thống backend.",
    },
    {
      id: 3,
      title: "IT Support",
      location: "Hà Nội",
      type: "Full-time",
      salary: "10 - 15 triệu",
      summary:
        "Hỗ trợ người dùng, xử lý sự cố phần cứng, phần mềm và mạng.",
    },
    {
      id: 4,
      title: "UI/UX Designer",
      location: "Remote",
      type: "Part-time",
      salary: "Thỏa thuận",
      summary:
        "Thiết kế giao diện web/app, cải thiện trải nghiệm người dùng.",
    },
    {
      id: 5,
      title: "Intern Web Developer",
      location: "TP. Hồ Chí Minh",
      type: "Intern",
      salary: "3 - 5 triệu",
      summary:
        "Tham gia dự án thực tế, được mentor và đào tạo bài bản.",
    },
  ];

  /* =====================
     LOAD DATA
  ===================== */
  useEffect(() => {
    setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) return <p className="loading">Đang tải tuyển dụng...</p>;

  return (
    <div className="recruitment">
      {/* HEADER */}
      <div className="recruitment-header">
        <h1>TUYỂN DỤNG</h1>
        <p>
          Tham gia cùng chúng tôi để phát triển sự nghiệp trong môi trường chuyên
          nghiệp và năng động.
        </p>
      </div>

      {/* JOB LIST */}
      <div className="job-list">
        {jobs.map((job) => (
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

                <p className="job-desc">{job.summary}</p>
            </div>

            <div className="job-action">
                <button>Ứng tuyển</button>
            </div>
            </Link>
        ))}
        </div>
    </div>
  );
}

export default Recruitment;