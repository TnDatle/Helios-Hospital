import {
  createPatientService,
  searchPatientService
} from "../services/patient.service.js";

export const createPatient = async (req, res) => {
  try {
    const patient = await createPatientService(req.body, req.user);
    return res.status(201).json(patient);
  } catch (error) {
    console.error(error);

    if (error.message === "PHONE_EXISTS") {
      return res.status(400).json({ message: "Số điện thoại đã tồn tại" });
    }

    if (error.message === "CCCD_EXISTS") {
      return res.status(400).json({ message: "CCCD đã tồn tại" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

export const searchPatient = async (req, res) => {
  const { q, type } = req.query;

  const result = await searchPatientService(q, type);

  if (!result) {
    return res.status(404).json([]);
  }

  res.json(result);

};