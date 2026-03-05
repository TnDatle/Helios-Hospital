import {
  createPatientForStaffService,
  createPatientForUserService,
  searchPatientService
} from "../services/patient.service.js";

export const createPatientForUser = async (req, res) => {
  const patient = await createPatientForUserService(req.body, req.user);
  res.json(patient);
};

export const createPatientForStaff = async (req, res) => {
  const patient = await createPatientForStaffService(req.body, req.user);
  res.json(patient);
};

export const searchPatient = async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q || !type) {
      return res.status(400).json({
        message: "Thiếu tham số tìm kiếm"
      });
    }

    const result = await searchPatientService(q, type);

    if (!result || result.length === 0) {
      return res.status(404).json([]);
    }

    return res.json(result);

  } catch (error) {
    console.error("Search Patient Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};