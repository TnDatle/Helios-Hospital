import { useEffect, useState } from "react";
import "../../styles/humanresource/resume.css"

const API_BASE = "http://localhost:5000/api";

function Resume() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/applications`)
      .then((res) => res.json())
      .then((data) => setApplications(data.data || []));
  }, []);

  return (
    <div>
      <h2>Hồ sơ ứng viên</h2>

      {applications.length === 0 ? (
        <p>Chưa có ứng viên</p>
      ) : (
        applications.map((app) => (
          <div key={app.id} className="hr-card hr-cv-card">
            <p><b>{app.name}</b></p>
            <p>{app.email}</p>
            <p>{app.phone}</p>

            <a href={app.cvUrl} target="_blank" rel="noreferrer">
              Xem CV
            </a>
          </div>
        ))
      )}
    </div>
  );
}

export default Resume;