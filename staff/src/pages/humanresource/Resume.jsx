import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/humanresource/resume.css";

const API_BASE = "http://localhost:5000/api";

function Resume() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!jobId || jobId === "undefined") return;

    fetch(`${API_BASE}/applications?jobId=${jobId}`)
      .then((res) => res.json())
      .then((data) => setApplications(data.data || []))
      .catch((err) => console.error(err));
  }, [jobId]);

  const getStatusClass = (status) => {
    if (status === "approved") return "status approved";
    if (status === "rejected") return "status rejected";
    return "status pending";
  };

  const handleUpdateStatus = async (id, status) => {
  try {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (!res.ok) return alert(data.error);

    // 👇 update UI luôn
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status } : app
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="hr-container">
      <div className="resume-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Quay lại
        </button>

        <h2>Danh sách ứng viên</h2>
      </div>

      {!jobId ? (
        <p>Lỗi: không có jobId</p>
      ) : applications.length === 0 ? (
        <p>Chưa có ứng viên</p>
      ) : (
        <div className="cv-list">
          {applications.map((app) => (
            <div key={app.id} className="cv-card">
              {/* LEFT */}
              <div className="cv-info">
                <h3>{app.name}</h3>
                <p>📧 {app.email}</p>
                <p>📞 {app.phone}</p>

                {app.coverLetter && (
                  <p className="cover">
                    📝 {app.coverLetter}
                  </p>
                )}

                <span className={getStatusClass(app.status)}>
                  {app.status}
                </span>
              </div>

              {/* RIGHT */}
              <div className="cv-actions">
                <a
                  href={app.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-view-cv"
                >
                  Xem CV
                </a>

                {/* ACTION HR */}
                <div className="cv-buttons">
                  <button
                    className="btn-approve"
                    onClick={() => handleUpdateStatus(app.id, "approved")}
                  >
                    Duyệt
                  </button>

                  <button
                    className="btn-reject"
                    onClick={() => handleUpdateStatus(app.id, "rejected")}
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Resume;