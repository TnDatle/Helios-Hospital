import {
  createPatientService,
  searchPatientService
} from "../services/patient.service.js";

export const createPatient = async (req, res) => {
  try {
    const patient = await createPatientService(req.body, req.user);
    return res.status(201).json(patient);

  } catch (error) {
    console.error("Create Patient Error:", error);

    switch (error.message) {
      case "PHONE_EXISTS":
        return res.status(400).json({ message: "Số điện thoại đã tồn tại" });

      case "CCCD_EXISTS":
        return res.status(400).json({ message: "CCCD đã tồn tại" });

      default:
        return res.status(500).json({ message: "Internal Server Error" });
    }
  }
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