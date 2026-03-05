import express from "express";

import {searchPatientsAppointment, createWalkInAppointment } from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/walkin", createWalkInAppointment);
router.get("/patients/search", searchPatientsAppointment);

export default router;