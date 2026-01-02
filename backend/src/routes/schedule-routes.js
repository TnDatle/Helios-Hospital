import express from "express";
import { getPublicSchedules , getDoctorSchedules } from "../controllers/schedule-controller.js";
import { noCache } from "../middlewares/no-cache.js";
const router = express.Router();

// GET /api/schedules
router.get("/", getPublicSchedules);   

// GET /api/schedules/:doctorId
router.get("/:doctorId", noCache ,getDoctorSchedules);

export default router;
