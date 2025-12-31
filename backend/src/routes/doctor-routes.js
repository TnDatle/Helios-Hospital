import express from "express";
import {
  findDoctors,
  getDoctorDetail,
} from "../controllers/doctor-controller.js";

const router = express.Router();

// Lấy danh sách bác sĩ (có thể filter theo khoa)
router.get("/", findDoctors);

// Lấy chi tiết 1 bác sĩ
router.get("/:id", getDoctorDetail);

export default router;
