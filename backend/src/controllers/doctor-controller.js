import {
  fetchDoctors,
  fetchDoctorDetail,
} from "../services/doctor-service.js";

export const findDoctors = async (req, res) => {
  try {
    const { department } = req.query;
    const doctors = await fetchDoctors(department);

    res.json({
      success: true,
      total: doctors.length,
      data: doctors,
    });
  } catch (err) {
    console.error("[findDoctors]", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getDoctorDetail = async (req, res) => {
  try {
    const { department, id } = req.params;

    if (!department || !id) {
      return res.status(400).json({
        success: false,
        message: "department and id are required",
      });
    }

    const doctor = await fetchDoctorDetail(department, id);

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
