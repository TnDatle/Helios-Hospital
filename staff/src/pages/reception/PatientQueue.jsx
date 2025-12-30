import { Link } from "react-router-dom";

function PatientQueue() {
  // mock data – sau thay bằng API
  const patients = [
    { id: "p1", name: "Nguyen Van A", nationalId: "012345678901" },
    { id: "p2", name: "Tran Thi B", nationalId: "012345678902" },
  ];

  return (
    <div>
      <h2>Patient Queue</h2>
      <p>Danh sách bệnh nhân chờ xác thực</p>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>National ID</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.nationalId}</td>
              <td>
                <Link to={`/staff/reception/verify/${p.id}`}>
                  Xác thực
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientQueue;
