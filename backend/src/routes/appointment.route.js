import express from "express";

import {
  searchPatientsAppointment,
  createWalkInAppointment,
  getAppointmentsByPatient
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/walkin", createWalkInAppointment);

router.get("/patients/search", searchPatientsAppointment);

router.get("/patient/:patientId", getAppointmentsByPatient);

export default router;