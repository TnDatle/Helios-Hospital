import { useParams, useNavigate } from "react-router-dom";

function VerifyPatient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleVerify = () => {
    // TODO: gọi API verify patient
    alert(`Patient ${id} verified`);
    navigate("/staff/reception");
  };

  return (
    <div>
      <h2>Xác thực bệnh nhân</h2>

      <p><strong>Patient ID:</strong> {id}</p>

      <p>
        Staff đối chiếu giấy tờ tuỳ thân (National ID, thông tin cá nhân)
        trước khi xác nhận.
      </p>

      <button onClick={handleVerify}>
        Xác nhận đã xác thực
      </button>
    </div>
  );
}

export default VerifyPatient;
