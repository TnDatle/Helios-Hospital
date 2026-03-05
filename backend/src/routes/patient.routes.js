import express from "express";
import {
  createPatientForStaff,
  createPatientForUser,
  searchPatient
} from "../controllers/patient.controller.js";
import { requireAuth , verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createPatientForUser);
router.get("/search", verifyToken, searchPatient);

router.post("/staff", requireAuth, createPatientForStaff);
router.get("/staff/search", requireAuth, searchPatient);

export default router;