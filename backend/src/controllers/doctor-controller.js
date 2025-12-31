import {
  fetchDoctors,
  fetchDoctorDetail,
} from "../services/doctor-service.js";

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

