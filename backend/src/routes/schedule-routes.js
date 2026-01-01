import express from "express";
import { getDoctorSchedules } from "../controllers/schedule-controller.js";
import { noCache } from "../middlewares/no-cache.js";
const router = express.Router();

// GET /api/schedules/:doctorId
router.get("/:doctorId", noCache ,getDoctorSchedules);

export default router;
