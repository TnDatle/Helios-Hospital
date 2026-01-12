import express from "express";
import {
  getPublicSchedules,
  getDoctorSchedules,
  getSchedulesController,
  createBulkScheduleController,
  deleteScheduleController,
} from "../controllers/schedule-controller.js";
import { noCache } from "../middlewares/no-cache.js";

const router = express.Router();

/* ================= PUBLIC ================= */
// Lịch công khai (theo khoa)
router.get("/public", getPublicSchedules);

/* ================= BOOKING ================= */
// Lịch theo bác sĩ (đặt khám)
router.get("/doctor/:doctorId", noCache, getDoctorSchedules);

/* ================= ADMIN ================= */
// CRUD lịch
router.get("/", getSchedulesController);
router.post("/bulk", createBulkScheduleController);
router.delete("/:id", deleteScheduleController);

export default router;
