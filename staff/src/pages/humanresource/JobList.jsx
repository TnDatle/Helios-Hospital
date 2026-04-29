import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/humanresource/joblist.css";

const API_BASE = "http://localhost:5000/api";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [cvCount, setCvCount] = useState({}); // 👈 số lượng CV

  // modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();

  /* =========================
     FETCH
  ========================= */
  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = () => {
    fetch(`${API_BASE}/jobs`)
      .then((res) => res.json())
      .then((data) => setJobs(data.data || []));
  };

  const fetchApplications = () => {
    fetch(`${API_BASE}/applications`)
      .then((res) => res.json())
      .then((data) => {
        const apps = data.data || [];

        const count = apps.reduce((acc, app) => {
          if (!acc[app.jobId]) acc[app.jobId] = 0;
          acc[app.jobId]++;
          return acc;
        }, {});

        setCvCount(count);
      });
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa bài tuyển dụng này?")) return;

    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message);

    alert("Đã xóa");
    fetchJobs();
  };

  /* =========================
     UPDATE
  ========================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/jobs/${selectedJob.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedJob),
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message);

    alert("Cập nhật thành công");
    setShowModal(false);
    fetchJobs();
  };

  /* =========================
     HELPER
  ========================= */
  const isExpired = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="hr-job-container">
      <h2 className="hr-title">Danh sách tuyển dụng</h2>

      {jobs.length === 0 ? (
        <p>Chưa có bài tuyển dụng</p>
      ) : (
        <div className="hr-job-list">
          {jobs.map((job) => {
            const expired = isExpired(job.deadline);

            return (
              <div key={job.id} className="hr-job-card">
                {/* TOP */}
                <div className="hr-job-top">
                  <h3>{job.title}</h3>

                  <span
                    className={`hr-badge ${
                      expired ? "expired" : "active"
                    }`}
                  >
                    {expired ? "Hết hạn" : "Đang tuyển"}
                  </span>
                </div>

                {/* INFO */}
                <div className="hr-job-info">
                  <p>📍 {job.location || "Không rõ"}</p>
                  <p>💰 {job.salary || "Thỏa thuận"}</p>

                  {/* 👇 SỐ CV */}
                  <p>📄 {cvCount[job.id] || 0} ứng viên</p>
                </div>

                {/* FOOTER */}
                <div className="hr-job-footer">
                  <span>
                    ⏰{" "}
                    {job.deadline
                      ? new Date(job.deadline).toLocaleDateString("vi-VN")
                      : "Không có"}
                  </span>

                  <div className="hr-actions">
                    <button
                      className="btn-view"
                      onClick={() => {
                        setSelectedJob(job);
                        setIsEdit(false);
                        setShowModal(true);
                      }}
                    >
                      Xem
                    </button>

                    <button
                      className="btn-edit"
                      onClick={() => {
                        setSelectedJob(job);
                        setIsEdit(true);
                        setShowModal(true);
                      }}
                    >
                      Sửa
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(job.id)}
                    >
                      Xóa
                    </button>

                    {/* 👇 NÚT CV */}
                    <button
                        className="btn-cv"
                        onClick={() =>
                          navigate(`/staff/humanresource/jobs/${job.id}/resumes`)
                        }
                      >
                        CV ({cvCount[job.id] || 0})
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================
         MODAL
      ========================= */}
      {showModal && selectedJob && (
        <div className="modal-overlay">
          <div className="modal">
            {!isEdit ? (
              <div className="job-view">
                <h1 className="job-title">{selectedJob.title}</h1>

                <div className="job-meta">
                  <span>📍 {selectedJob.location}</span>
                  <span>💰 {selectedJob.salary}</span>
                  <span>
                    ⏰{" "}
                    {selectedJob.deadline
                      ? new Date(
                          selectedJob.deadline
                        ).toLocaleDateString("vi-VN")
                      : "Không có"}
                  </span>
                </div>

                <div className="job-section">
                  <h3>Mô tả công việc</h3>
                  <div className="job-content">
                    {selectedJob.description}
                  </div>
                </div>

                <div className="job-section">
                  <h3>Yêu cầu</h3>
                  <div className="job-content">
                    {selectedJob.requirements}
                  </div>
                </div>

                <div className="job-section">
                  <h3>Phúc lợi</h3>
                  <div className="job-content">
                    {selectedJob.benefits}
                  </div>
                </div>

                <div className="modal-actions">
                  <button onClick={() => setShowModal(false)}>
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2>Sửa bài tuyển dụng</h2>

                <form onSubmit={handleUpdate}>
                  <label>Tiêu đề</label>
                  <input
                    value={selectedJob.title}
                    onChange={(e) =>
                      setSelectedJob({
                        ...selectedJob,
                        title: e.target.value,
                      })
                    }
                  />

                  <label>Địa điểm</label>
                  <input
                    value={selectedJob.location}
                    onChange={(e) =>
                      setSelectedJob({
                        ...selectedJob,
                        location: e.target.value,
                      })
                    }
                  />

                  <label>Mức lương</label>
                  <input
                    value={selectedJob.salary}
                    onChange={(e) =>
                      setSelectedJob({
                        ...selectedJob,
                        salary: e.target.value,
                      })
                    }
                  />

                  <label>Hạn tuyển</label>
                  <input
                    type="date"
                    value={selectedJob.deadline || ""}
                    onChange={(e) =>
                      setSelectedJob({
                        ...selectedJob,
                        deadline: e.target.value,
                      })
                    }
                  />

                  <label>Mô tả</label>
                  <textarea
                    value={selectedJob.description || ""}
                    onChange={(e) =>
                      setSelectedJob({
                        ...selectedJob,
                        description: e.target.value,
                      })
                    }
                  />

                  <label>Yêu cầu</label>
                  <textarea
                    value={selectedJob.requirements || ""}
                    onChange={(e) =>
                      setSelectedJob({
                        ...selectedJob,
                        requirements: e.target.value,
                      })
                    }
                  />

                  <label>Phúc lợi</label>
                  <textarea
                    value={selectedJob.benefits || ""}
                    onChange={(e) =>
                      setSelectedJob({
                        ...selectedJob,
                        benefits: e.target.value,
                      })
                    }
                  />

                  <div className="modal-actions">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Hủy
                    </button>

                    <button type="submit" className="btn-edit">
                      Lưu
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JobList;