import { 
  DoctorService,
  fetchDoctors,
  fetchDoctorDetail,
} from "../services/doctor-service.js";

//Tìm bác sĩ 
export const findDoctors = async (req, res) => {
  try {
    console.log("[API] query:", req.query);

    const { department } = req.query;
    const doctors = await fetchDoctors(department);

    console.log("[API] doctors length:", doctors.length);

    res.json({
      success: true,
      data: doctors,
    });
  } catch (err) {
    console.error("[findDoctors]", err);
    res.status(500).json({ success: false });
  }
};

//Lấy chi tiết bác sĩ 

export const getDoctorDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "doctorId is required",
      });
    }

    const doctor = await fetchDoctorDetail(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.json({
      success: true,
      data: doctor,
    });
  } catch (err) {
    console.error("[getDoctorDetail]", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Cập nhật thông tin bác sĩ

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    await DoctorService.updateDoctor(id, data);

    res.json({ message: "Cập nhật bác sĩ thành công" });
  } catch (err) {
    console.error("UPDATE DOCTOR ERROR:", err);
    res.status(400).json({ message: err.message });
  }
};

//Thêm bác sĩ mới 

export const createDoctor = async (req, res) => {
  try {
    const doctor = await DoctorService.createDoctor(req.body);

    res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch (err) {
    console.error("CREATE DOCTOR ERROR:", err);
    res.status(400).json({ message: err.message });
  }
};

//Hàm xóa bác sĩ 
export const deleteDoctor = async (req, res) => {
  try {
    await DoctorService.deleteDoctor(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};