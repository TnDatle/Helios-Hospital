import express from "express";
import {
  updateDoctor,
  findDoctors,
  getDoctorDetail,
  createDoctor,
  deleteDoctor
} from "../controllers/doctor.controller.js";

const router = express.Router();

// Lấy danh sách bác sĩ (có thể filter theo khoa)
router.get("/", findDoctors);

// Lấy chi tiết 1 bác sĩ
router.get("/:id", getDoctorDetail);

// Cập nhật thông tin bác sĩ (cho admin)
router.put("/:id", updateDoctor);

// Tạo bác sĩ mới (cho admin)
router.post("/", createDoctor);

// Xóa bác sĩ (cho admin)
router.delete("/:id", deleteDoctor);

export default router;
